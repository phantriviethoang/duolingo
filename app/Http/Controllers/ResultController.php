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
    public function index()
    {
        $user = Auth::user();

        $results = Result::where('user_id', $user->id)
            ->with('test')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Results/Index', [
            'results' => $results,
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

        // Check if test is accessible
        if (! $this->canAccessTest($user, $test)) {
            abort(403, 'This part is locked');
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

                if (!$userAnswerId) {
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
        $result->pass_threshold = \App\Models\UserProgress::PASS_THRESHOLDS[$test->part] ?? 60.0;
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

        $passScores = \App\Models\UserProgress::PASS_THRESHOLDS;
        return $previousProgress->score >= ($passScores[$previousPart] ?? 60);
    }

    /**
     * Update user progress
     */
    private function updateProgress($user, $test, $score)
    {
        $progress = Progress::firstOrCreate(
            [
                'user_id' => $user->id,
                'level' => $test->level,
                'part' => $test->part,
            ],
            [
                'score' => 0,
                'attempts' => 0,
                'completed' => false,
            ]
        );

        $progress->score = max($progress->score, $score);
        $progress->attempts += 1;

        $passScores = \App\Models\UserProgress::PASS_THRESHOLDS;
        if ($score >= ($passScores[$test->part] ?? 60)) {
            $progress->completed = true;
        }

        $progress->save();
    }
}
