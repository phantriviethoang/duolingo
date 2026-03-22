<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Result;
use App\Models\Progress;
use App\Models\TestSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
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
            'question_ids' => 'nullable|array',
            'question_ids.*' => 'integer',
            'custom_question_limit' => 'nullable|integer|min:1',
            'part_number' => 'nullable|integer|min:1',
            'custom_pass_threshold' => 'nullable|numeric|min:1|max:100',
        ]);

        $user = Auth::user();

        if ($test->level !== $level) {
            abort(404);
        }

        $partNumber = (int) $request->input('part_number', ($test->part ?: 1));
        if ($partNumber < 1) {
            abort(404);
        }

        $partNumbers = $this->resolveAttemptPartNumbers($test, $partNumber);

        if (! $this->canAccessTest($user, $test, $partNumber, $partNumbers)) {
            abort(403);
        }

        $answers = (array) $request->input('answers', []);
        $totalQuestionBank = $test->questions()->count();

        $requestedQuestionIds = collect($request->input('question_ids', []))
            ->map(fn ($id) => (int) $id)
            ->filter(fn (int $id) => $id > 0)
            ->unique()
            ->values();

        $questionLimit = max(
            1,
            min(
                (int) $request->input('custom_question_limit', $test->configuredQuestionCount()),
                $totalQuestionBank
            )
        );

        $questionsQuery = $test->questions()
            ->with('answers:id,question_id,is_correct')
            ->orderBy('question_test.order');

        if ($requestedQuestionIds->isNotEmpty()) {
            $questionsQuery->whereIn('questions.id', $requestedQuestionIds->all());
        } else {
            $questionsQuery->take($questionLimit);
        }

        $questions = $questionsQuery->get(['questions.id']);

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
        $customPassThreshold = $request->filled('custom_pass_threshold')
            ? (float) max(1, min(100, (float) $request->input('custom_pass_threshold')))
            : null;

        $resultPayload = [
            'user_id' => $user->id,
            'test_id' => $test->id,
            'part_number' => $partNumber,
            'answers' => $answers,
            'score' => $score,
            'correct' => $correct,
            'total' => $total,
            'time_spent' => $request->input('time_spent'),
            'completed_at' => now(),
        ];

        if ($this->supportsCustomPassThresholdColumn()) {
            $resultPayload['custom_pass_threshold'] = $customPassThreshold;
        }

        $result = Result::create($resultPayload);

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
        $this->updateProgress($user, $test, $score, $partNumber, $customPassThreshold);

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

        $reviewPartNumber = (int) ($result->part_number ?: ($test->part ?: 1));
        $questionLimit = max(1, (int) ($result->total ?: $test->configuredQuestionCount($reviewPartNumber)));

        $test->load([
            'questions' => function ($query) use ($questionLimit) {
                $query->with('answers')
                    ->orderBy('question_test.order')
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
        $threshold = null;
        if ($this->supportsCustomPassThresholdColumn()) {
            $threshold = $result->custom_pass_threshold;
        }

        if ($threshold === null) {
            if ($levelConfig) {
                $thresholdField = "pass_threshold_part{$reviewPartNumber}";
                $threshold = $levelConfig->$thresholdField ?? \App\Models\UserProgress::PASS_THRESHOLDS[$reviewPartNumber] ?? 60.0;
            } else {
                $threshold = \App\Models\UserProgress::PASS_THRESHOLDS[$reviewPartNumber] ?? 60.0;
            }
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
    private function canAccessTest($user, $test, int $partNumber, ?array $partNumbers = null)
    {
        $partNumbers = $partNumbers ?: $this->resolveAttemptPartNumbers($test, $partNumber);
        $firstPart = $partNumbers[0] ?? 1;

        if ($partNumber === $firstPart) {
            return true;
        }

        $index = array_search($partNumber, $partNumbers, true);
        if ($index === false || $index === 0) {
            return false;
        }

        $previousPart = $partNumbers[$index - 1];
        $previousProgress = Progress::where('user_id', $user->id)
            ->where('level', $test->level)
            ->where('part', $previousPart)
            ->first();

        if (! $previousProgress) {
            return false;
        }

        return $previousProgress->is_passed ?? false;
    }

    private function resolveAttemptPartNumbers(Test $test, int $targetPartNumber): array
    {
        $activeParts = $test->activePartNumbers();
        $firstPart = $activeParts[0] ?? 1;
        $maxConfiguredPart = max($activeParts ?: [$firstPart]);

        if ($targetPartNumber > $maxConfiguredPart) {
            return range($firstPart, $targetPartNumber);
        }

        return $activeParts;
    }

    /**
     * Update user progress
     */
    private function updateProgress($user, $test, $score, int $partNumber, ?float $customPassThreshold = null)
    {
        // Lấy threshold từ DB
        $levelConfig = \App\Models\Level::where('name', $test->level)->first();
        $threshold = 60.0;
        if ($customPassThreshold !== null) {
            $threshold = max(1, min(100, $customPassThreshold));
        } elseif ($levelConfig) {
            $thresholdField = "pass_threshold_part{$partNumber}";
            $threshold = $levelConfig->$thresholdField ?? 60.0;
        }

        // $score đã là phần trăm (0-100), không quy đổi thêm lần nữa.
        $percentage = max(0, min(100, (float) $score));
        $isPassed = $percentage >= $threshold;

        \App\Models\Progress::updateOrCreate(
            [
                'user_id' => $user->id,
                'level' => $test->level,
                'part' => $partNumber,
            ],
            [
                'score' => $percentage,
                'percentage' => round($percentage, 2),
                'is_passed' => $isPassed,
                'completed_at' => $isPassed ? now() : null,
            ]
        );
    }

    private function supportsCustomPassThresholdColumn(): bool
    {
        static $supports = null;

        if ($supports === null) {
            $supports = Schema::hasColumn('results', 'custom_pass_threshold');
        }

        return $supports;
    }
}
