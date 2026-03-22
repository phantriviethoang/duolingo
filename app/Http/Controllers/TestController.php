<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Models\Test;
use App\Models\TestSession;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    /**
     * Display admin listing of tests
     */
    public function adminIndex(Request $request)
    {
        $query = Test::query();

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        if ($request->has('part')) {
            $query->where('part', $request->part);
        }

        $tests = $query->orderByDesc('created_at')
            ->get(['id', 'title', 'description', 'duration', 'total_questions', 'created_at'])
            ->map(function (Test $test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                    'duration' => $test->configuredDuration(),
                    'total_questions' => $test->total_questions,
                    'created_at' => optional($test->created_at)->format('d/m/Y'),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('Admin/Tests', [
            'tests' => $tests,
            'filters' => $request->only(['level', 'part']),
        ]);
    }

    /**
     * Display a listing of tests for users
     */
    public function index(Request $request)
    {
        $selectedLevel = $request->get('level', 'all');

        $testsQuery = Test::query()
            ->orderBy('level')
            ->orderBy('part');

        // Lọc theo level nếu được họn
        if ($selectedLevel !== 'all') {
            $testsQuery = $testsQuery->where('level', $selectedLevel);
        }

        $tests = $testsQuery->get(['id', 'title', 'description', 'duration', 'level', 'part', 'total_questions', 'is_active'])->map(function (Test $test) {
            return [
                'id' => $test->id,
                'title' => $test->title,
                'description' => $test->description,
                'duration' => $test->configuredDuration(),
                'level' => $test->level,
                'part' => $test->part,
                'total_questions' => $test->configuredQuestionCount(),
                'is_active' => $test->is_active,
            ];
        })->values()->toArray();

        return Inertia::render('Tests/Index', [
            'tests' => $tests,
            'selectedLevel' => $selectedLevel,
        ]);
    }

    /**
     * Display specific test
     */
    public function show(Test $test)
    {
        $user = Auth::user();

        if (! $this->canAccessTest($user, $test)) {
            abort(403, 'This part is locked');
        }

        $test->load('questions.answers');

        return Inertia::render('Tests/Show', [
            'test' => $test,
        ]);
    }

    /**
     * Check if user can access test
     */
    private function canAccessTest($user, $test, ?int $partNumber = null, ?array $partNumbers = null)
    {
        $partNumber = $partNumber ?: (int) ($test->part ?: 1);
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
        $previousProgress = \App\Models\Progress::where('user_id', $user->id)
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

    private function getPreviousLevel($currentLevel)
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $index = array_search($currentLevel, $levels);
        if ($index > 0) {
            return $levels[$index - 1];
        }
        return null;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Tests/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTestRequest $request)
    {
        $data = $request->validated();

        $parts = collect($data['parts'] ?? [])
            ->map(fn (array $part) => [
                'part_number' => (int) $part['part_number'],
                'question_count' => (int) $part['question_count'],
                'duration' => (int) $part['duration'],
                'is_active' => true,
            ])
            ->sortBy('part_number')
            ->values();

        unset($data['questions']);
        unset($data['parts']);

        $primaryPart = $parts->first();
        $data['part'] = (int) ($primaryPart['part_number'] ?? 1);
        $data['duration'] = (int) ($primaryPart['duration'] ?? 900);

        $test = Test::create($data);

        $test->parts()->createMany($parts->all());

        if (isset($data['question_ids']) && is_array($data['question_ids'])) {
            $syncData = [];
            foreach ($data['question_ids'] as $index => $qId) {
                $syncData[$qId] = ['order' => $index + 1];
            }
            $test->questions()->sync($syncData);
            $test->update(['total_questions' => count($data['question_ids'])]);
        }

        return redirect()->route('admin.tests')
            ->with('success', 'Đề thi đã được tạo!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Test $test)
    {
        $test->load('parts', 'questions');

        return Inertia::render('Tests/Edit', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'description' => $test->description,
                'level' => $test->level,
                'duration' => $test->duration,
                'part' => $test->part,
                'parts' => $test->parts
                    ->sortBy('part_number')
                    ->map(function ($part) {
                        return [
                            'id' => $part->id,
                            'part_number' => (int) $part->part_number,
                            'question_count' => (int) $part->question_count,
                            'duration' => (int) $part->duration,
                            'is_active' => (bool) $part->is_active,
                        ];
                    })
                    ->values()
                    ->toArray(),
                'audio_path' => $test->audio_path,
                'image_path' => $test->image_path,
                'is_active' => $test->is_active,
                'question_ids' => $test->questions->sortBy('pivot.order')->pluck('id')->toArray(),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestRequest $request, Test $test)
    {
        $data = $request->validated();

        $parts = collect($data['parts'] ?? [])
            ->map(fn (array $part) => [
                'part_number' => (int) $part['part_number'],
                'question_count' => (int) $part['question_count'],
                'duration' => (int) $part['duration'],
                'is_active' => true,
            ])
            ->sortBy('part_number')
            ->values();

        unset($data['questions']);
        unset($data['parts']);

        $primaryPart = $parts->first();
        $data['part'] = (int) ($primaryPart['part_number'] ?? 1);
        $data['duration'] = (int) ($primaryPart['duration'] ?? 900);

        // update
        $test->update($data);

        $test->parts()->delete();
        $test->parts()->createMany($parts->all());

        if (array_key_exists('question_ids', $data) && is_array($data['question_ids'])) {
            $syncData = [];
            foreach ($data['question_ids'] as $index => $qId) {
                $syncData[$qId] = ['order' => $index + 1];
            }
            $test->questions()->sync($syncData);
            $test->update(['total_questions' => count($data['question_ids'])]);
        }

        return redirect()->route('admin.tests')
            ->with('success', 'Đề thi đã được cập nhật!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test)
    {
        $test->delete();

        return redirect()->route('admin.tests')
            ->with('success', 'Đề thi đã được xóa thành công!');
    }

    public function take(string $level, Test $test)
    {
        if ($test->level !== $level) {
            abort(404);
        }

        $user = Auth::user();

        $partNumber = (int) request()->query('part_number', ($test->part ?: 1));
        if ($partNumber < 1) {
            abort(404);
        }

        $partNumbers = $this->resolveAttemptPartNumbers($test, $partNumber);

        if (! $this->canAccessTest($user, $test, $partNumber, $partNumbers)) {
            $index = array_search($partNumber, $partNumbers, true);
            $prevPart = ($index !== false && $index > 0)
                ? $partNumbers[$index - 1]
                : ($partNumbers[0] ?? 1);
            $prevLevel = $test->level;

            $progress = \App\Models\Progress::where('user_id', $user->id)
                ->where('level', $prevLevel)
                ->where('part', $prevPart)
                ->first();

            $levelConfig = \App\Models\Level::where('name', $prevLevel)->first();
            $thresholdField = "pass_threshold_part{$prevPart}";
            $threshold = $levelConfig->$thresholdField ?? 60;

            abort(403);

            // return Inertia::render('Errors/Forbidden', [
            //     'level' => $test->level,
            //     'part' => $test->part,
            //     'required_score' => $threshold,
            //     'previous_score' => $progress->percentage ?? 0,
            // ]);
        }

        // Kiểm tra test có active không
        if (! $test->is_active) {
            return redirect()->route('path.levels')
                ->with('error', 'Đề thi này không khả dụng.');
        }

        $perPage = 20;
        $page = max((int) request()->query('page', 1), 1);

        $selectedPartConfig = $test->partConfig($partNumber);

        $totalQuestionBank = $test->questions()->count();
        $defaultQuestionLimit = max(1, min(
            (int) ($selectedPartConfig?->question_count ?? $test->configuredQuestionCount($partNumber)),
            $totalQuestionBank
        ));
        $requestedQuestionLimit = (int) request()->query('question_limit', $defaultQuestionLimit);
        $questionLimit = max(1, min($requestedQuestionLimit > 0 ? $requestedQuestionLimit : $defaultQuestionLimit, $totalQuestionBank));

        $defaultDuration = (int) ($selectedPartConfig?->duration ?? $test->configuredDuration($partNumber));
        $requestedDuration = (int) request()->query('duration', $defaultDuration);
        $duration = max(1, min($requestedDuration > 0 ? $requestedDuration : $defaultDuration, 240));

        $levelConfig = \App\Models\Level::where('name', $test->level)->first();
        $thresholdField = "pass_threshold_part{$partNumber}";
        $defaultPassThreshold = (float) ($levelConfig?->$thresholdField ?? 60.0);
        $requestedPassThreshold = request()->query('custom_pass_threshold');
        $customPassThreshold = $requestedPassThreshold === null || $requestedPassThreshold === "" 
            ? $defaultPassThreshold 
            : max(1, min(100, (float) $requestedPassThreshold));

        $retakeWrong = request()->query('retake_wrong');
        $resultId = request()->query('result_id');

        $paginator = null;

        $allQuestions = $test->questions()
            ->with('answers')
            ->orderBy('question_test.order')
            ->take($questionLimit)
            ->get();

        if ($retakeWrong && $resultId) {
            $previousResult = \App\Models\Result::where('id', $resultId)
                ->where('user_id', Auth::id())
                ->first();

            if ($previousResult) {
                $prevAnswers = (array) $previousResult->answers;
                $wrongQuestions = collect();

                foreach ($allQuestions as $q) {
                    $userAns = $prevAnswers[$q->id] ?? null;

                    // Get correct answer - must exist via is_correct flag
                    $correctAnswer = $q->answers->firstWhere('is_correct', true);
                    if (!$correctAnswer) {
                        \Log::warning("Question {$q->id} has no correct answer marked");
                        continue; // Skip if no correct answer found
                    }
                    $correctAnswerId = $correctAnswer->id;

                    if ((string) $userAns !== (string) $correctAnswerId) {
                        $wrongQuestions->push($q);
                    }
                }

                if ($wrongQuestions->isNotEmpty()) {
                    $allQuestions = $wrongQuestions;
                }

                $paginator = new LengthAwarePaginator(
                    $allQuestions->forPage($page, $perPage)->values(),
                    $allQuestions->count(),
                    $perPage,
                    $page,
                    [
                        'path' => request()->url(),
                        'query' => request()->query(),
                    ]
                );
            }
        }

        if (! $paginator) {
            $paginator = new LengthAwarePaginator(
                $allQuestions->forPage($page, $perPage)->values(),
                $allQuestions->count(),
                $perPage,
                $page,
                [
                    'path' => request()->url(),
                    'query' => request()->query(),
                ]
            );
        }

        if ($paginator->total() === 0) {
            return redirect()->route('path.levels')
                ->with('error', 'Đề thi này chưa có câu hỏi.');
        }

        // Tăng số lượt làm bài chỉ ở lần vào đầu tiên.
        if ($page === 1) {
            $test->increment('attempts');
        }

        $activeSession = null;
        if (! $retakeWrong) {
            $activeSession = TestSession::query()
                ->where('user_id', Auth::id())
                ->where('test_id', $test->id)
                ->where('status', 'in_progress')
                ->latest('updated_at')
                ->first();
        }

        // Transform questions for frontend (map to expected structure)
        $mappedQuestions = $paginator->getCollection()->map(function ($q) {
            $optionsFromAnswers = $q->answers
                ->map(function ($answer) {
                    return [
                        'id' => $answer->id,
                        'text' => $answer->answer_text,
                    ];
                })
                ->values()
                ->toArray();

            $fallbackOptions = is_array($q->options)
                ? $q->options
                : (is_string($q->options ?? null) ? json_decode($q->options, true) : []);

            return [
                'id' => $q->id,
                'question' => $q->question_text ?? $q->question,
                'options' => ! empty($optionsFromAnswers) ? $optionsFromAnswers : $fallbackOptions,
                // Do not send correct_option_id, explanation, etc. to frontend during take
            ];
        })->values();

        $paginator->setCollection($mappedQuestions);

        return Inertia::render('Tests/Take', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title ?? 'Untitled Test',
                'description' => $test->description ?? '',
                'duration' => $duration,
                'level' => $test->level,
                'part' => $partNumber,
                'total_questions' => $paginator->total(),
                'selected_question_limit' => $questionLimit,
                'selected_duration' => $duration,
                'selected_pass_threshold' => $customPassThreshold,
            ],
            'retake_wrong' => (bool) $retakeWrong,
            'previous_result_id' => $resultId ? (int) $resultId : null,
            'questionsFeed' => Inertia::scroll(fn () => $paginator),
            'testSession' => $activeSession ? [
                'id' => $activeSession->id,
                'answers' => $activeSession->answers ?? [],
                'flagged' => $activeSession->flagged ?? [],
                'current_question' => (int) $activeSession->current_question,
                'time_left' => (int) $activeSession->time_left,
                'last_synced_at' => optional($activeSession->last_synced_at)->toISOString(),
            ] : null,
        ]);
    }
}
