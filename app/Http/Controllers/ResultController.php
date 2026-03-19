<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Result;
use App\Models\Progress;
use App\Models\TestSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResultController extends Controller
{
    /**
     * Display user's test results
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        // Allow sorting by columns in results table
        $allowedSortBy = ['created_at', 'score', 'time_spent'];
        if (! in_array($sortBy, $allowedSortBy)) {
            $sortBy = 'created_at';
        }

        $allowedSortOrder = ['asc', 'desc'];
        if (! in_array($sortOrder, $allowedSortOrder)) {
            $sortOrder = 'desc';
        }

        $results = Result::where('user_id', $user->id)
            ->with('test')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Results/Index', [
            'results' => $results,
            'filters' => [
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store new test result
     */
    public function store(Request $request, string $level, Test $test)
    {
        $request->validate([
            'answers' => 'nullable|array',
        ]);

        $user = Auth::user();

        if ($test->level !== $level) {
            abort(404);
        }

        if (! $this->canAccessTest($user, $test)) {
            abort(403);
        }

        $answers = (array) $request->input('answers', []);
        $questionLimit = $test->configuredQuestionCount();
        $questions = $test->questions()
            ->with('answers:id,question_id,is_correct')
            ->orderBy('order')
            ->take($questionLimit)
            ->get(['id']);

        $total = $questions->count();
        $correct = 0;

        foreach ($questions as $question) {
            $userAnswer = $answers[$question->id] ?? null;

            $correctAnswer = $question->answers->firstWhere('is_correct', true);
            $correctAnswerId = $correctAnswer?->id ?? ($question->correct_option_id ?? null);

            if ((string) $userAnswer === (string) $correctAnswerId) {
                $correct++;
            }
        }

        $score = $total > 0 ? (int) round(($correct / $total) * 100) : 0;

        $result = Result::create([
            'user_id' => $user->id,
            'test_id' => $test->id,
            'answers' => $answers,
            'score' => $score,
            'correct' => $correct,
            'total' => $total,
            'time_spent' => $request->input('time_spent'),
            'completed_at' => now(),
        ]);

        TestSession::query()
            ->where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->where('status', 'in_progress')
            ->update([
                'status' => 'submitted',
                'answers' => $answers,
                'current_question' => 0,
                'time_left' => 0,
                'last_synced_at' => now(),
            ]);

        // Update progress
        $this->updateProgress($user, $test, $score);

        return redirect()->route('results.show', $result->id);
    }

    /**
     * Show specific result
     */
    public function show(Result $result)
    {
        // Check ownership
        if ($result->user_id !== Auth::id()) {
            abort(403);
        }

        $test = $result->test()->first();

        if (! $test) {
            abort(404, 'Test not found for this result.');
        }

        $questionLimit = $test->configuredQuestionCount();

        $test->load([
            'questions' => function ($query) use ($questionLimit) {
                $query->with('answers')
                    ->orderBy('order')
                    ->take($questionLimit);
            }
        ]);

        $result->setRelation('test', $test);

        // Tính toán chi tiết kết quả
        $correct = 0;
        $wrong = 0;
        $skipped = 0;
        $total = 0;

        if ($result->test->questions) {
            $total = $result->test->questions->count();

            foreach ($result->test->questions as $question) {
                $userAnswerId = $result->answers[$question->id] ?? null;

                if (! $userAnswerId) {
                    $skipped++;
                } else {
                    $correctAnswer = $question->answers->firstWhere('is_correct', true);
                    if ($correctAnswer && $userAnswerId === $correctAnswer->id) {
                        $correct++;
                    } else {
                        $wrong++;
                    }
                }
            }
        }

        // Đảm bảo các giá trị được gán vào result để FE nhận được
        $result->correct_count = $correct;
        $result->wrong_count = $wrong;
        $result->skipped_count = $skipped;
        $result->total_count = $total;
        $result->accuracy = $total > 0 ? round(($correct / $total) * 100, 1) : 0;

        // Bổ sung ngưỡng đạt và trạng thái đạt của part hiện tại
        $levelConfig = \App\Models\Level::where('name', $test->level)->first();
        $threshold = 60.0;
        if ($levelConfig) {
            $thresholdField = "pass_threshold_part{$test->part}";
            $threshold = $levelConfig->$thresholdField ?? \App\Models\UserProgress::PASS_THRESHOLDS[$test->part] ?? 60.0;
        } else {
            $threshold = \App\Models\UserProgress::PASS_THRESHOLDS[$test->part] ?? 60.0;
        }

        $result->pass_threshold = $threshold;
        $result->is_passed_requirement = $result->accuracy >= $result->pass_threshold;

        return Inertia::render('Results/Show', [
            'result' => $result,
        ]);
    }

    /**
     * Check if user can access test
     */
    private function canAccessTest($user, $test)
    {
        if ($test->part === 1) {
            return true;
        }

        $previousPart = $test->part - 1;
        $previousProgress = Progress::where('user_id', $user->id)
            ->where('level', $test->level)
            ->where('part', $previousPart)
            ->first();

        if (! $previousProgress) {
            return false;
        }

        // Lấy threshold từ DB
        $levelConfig = \App\Models\Level::where('name', $test->level)->first();
        $threshold = 60.0;
        if ($levelConfig) {
            $thresholdField = "pass_threshold_part{$previousPart}";
            $threshold = $levelConfig->$thresholdField ?? \App\Models\UserProgress::PASS_THRESHOLDS[$previousPart] ?? 60.0;
        } else {
            $threshold = \App\Models\UserProgress::PASS_THRESHOLDS[$previousPart] ?? 60.0;
        }

        return $previousProgress->score >= $threshold;
    }

    /**
     * Update user progress
     */
    private function updateProgress($user, $test, $score)
    {
        // Lấy threshold từ DB
        $levelConfig = \App\Models\Level::where('name', $test->level)->first();
        $threshold = 60.0;
        if ($levelConfig) {
            $thresholdField = "pass_threshold_part{$test->part}";
            $threshold = $levelConfig->$thresholdField ?? 60.0;
        }

        // $score đã là phần trăm (0-100), không quy đổi thêm lần nữa.
        $percentage = max(0, min(100, (float) $score));
        $isPassed = $percentage >= $threshold;

        \App\Models\Progress::updateOrCreate(
            [
                'user_id' => $user->id,
                'level' => $test->level,
                'part' => $test->part,
            ],
            [
                'score' => $percentage,
                'percentage' => round($percentage, 2),
                'is_passed' => $isPassed,
                'completed_at' => $isPassed ? now() : null,
            ]
        );
    }
}
