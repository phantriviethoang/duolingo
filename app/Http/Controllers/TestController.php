<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Models\Test;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    /**
     * Display admin listing of tests
     */
    public function adminIndex()
    {
        $tests = Test::orderByDesc('created_at')
            ->get(['id', 'title', 'description', 'duration', 'total_questions', 'created_at'])
            ->map(function (Test $test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                    'duration' => $test->duration,
                    'total_questions' => $test->total_questions,
                    'created_at' => optional($test->created_at)->format('d/m/Y'),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('Admin/Tests', [
            'tests' => $tests,
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
                'duration' => $test->duration,
                'level' => $test->level,
                'part' => $test->part,
                'total_questions' => $test->total_questions,
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
    private function canAccessTest($user, $test)
    {
        if ($test->part === 1) {
            return true;
        }

        $previousPart = $test->part - 1;
        $previousProgress = \App\Models\Progress::where('user_id', $user->id)
            ->where('level', $test->level)
            ->where('part', $previousPart)
            ->first();

        if (! $previousProgress) {
            return false;
        }

        $passScores = [1 => 60, 2 => 75, 3 => 90];
        return $previousProgress->score >= $passScores[$previousPart];
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

        $questions = $data['questions'] ?? [];
        unset($data['questions']);

        $data['total_questions'] = count($questions);

        $test = Test::create($data);

        foreach ($questions as $index => $q) {
            $question = $test->questions()->create([
                'question_text' => $q['question'],
                'question_type' => 'multiple_choice',
                'order' => $index + 1,
                'explanation' => $q['explanation'] ?? null,
                'translation' => $q['translation'] ?? null,
                'detailed_explanation' => $q['detailed_explanation'] ?? null,
            ]);

            foreach (($q['options'] ?? []) as $option) {
                $question->answers()->create([
                    'answer_text' => $option['text'] ?? '',
                    'is_correct' => (bool) ($option['is_correct'] ?? false),
                ]);
            }
        }

        return redirect()->route('admin.tests')
            ->with('success', 'Đề thi đã được tạo!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Test $test)
    {
        $test->load('questions.answers');

        return Inertia::render('Tests/Edit', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'description' => $test->description,
                'duration' => $test->duration,
                'audio_path' => $test->audio_path,
                'image_path' => $test->image_path,
                'questions' => $test->questions
                    ->sortBy('order')
                    ->map(function ($question) {
                        return [
                            'id' => $question->id,
                            'question' => $question->question_text ?? '',
                            'explanation' => $question->explanation,
                            'translation' => $question->translation,
                            'detailed_explanation' => $question->detailed_explanation,
                            'options' => $question->answers
                                ->map(function ($answer, $index) {
                                    return [
                                        'id' => $answer->id ?? $index,
                                        'text' => $answer->answer_text,
                                        'is_correct' => (bool) $answer->is_correct,
                                    ];
                                })
                                ->values()
                                ->toArray(),
                        ];
                    })
                    ->values()
                    ->toArray(),
                'is_active' => $test->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestRequest $request, Test $test)
    {
        $data = $request->validated();

        $questions = $data['questions'] ?? [];
        unset($data['questions']);

        $data['total_questions'] = count($questions);

        // update
        $test->update($data);

        $test->questions()->delete();

        foreach ($questions as $index => $q) {
            $question = $test->questions()->create([
                'question_text' => $q['question'],
                'question_type' => 'multiple_choice',
                'order' => $index + 1,
                'explanation' => $q['explanation'] ?? null,
                'translation' => $q['translation'] ?? null,
                'detailed_explanation' => $q['detailed_explanation'] ?? null,
            ]);

            foreach (($q['options'] ?? []) as $option) {
                $question->answers()->create([
                    'answer_text' => $option['text'] ?? '',
                    'is_correct' => (bool) ($option['is_correct'] ?? false),
                ]);
            }
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

        // Kiểm tra test có active không
        if (! $test->is_active) {
            return redirect()->route('path.levels')
                ->with('error', 'Đề thi này không khả dụng.');
        }

        // Lấy câu hỏi + đáp án từ DB
        $questions = $test->questions()
            ->with('answers')
            ->orderBy('order')
            ->get();

        if ($questions->isEmpty()) {
            return redirect()->route('path.levels')
                ->with('error', 'Đề thi này chưa có câu hỏi.');
        }

        // Tăng số lượt làm bài
        $test->increment('attempts');

        $retakeWrong = request()->query('retake_wrong');
        $resultId = request()->query('result_id');

        if ($retakeWrong && $resultId) {
            $previousResult = \App\Models\Result::where('id', $resultId)
                ->where('user_id', Auth::id())
                ->first();

            if ($previousResult) {
                $prevAnswers = (array) $previousResult->answers;
                $wrongQuestions = collect();

                foreach ($questions as $q) {
                    $userAns = $prevAnswers[$q->id] ?? null;

                    // Ưu tiên đáp án đúng từ relation answers
                    $correctAnswer = $q->answers->firstWhere('is_correct', true);
                    $correctAnswerId = $correctAnswer?->id ?? ($q->correct_option_id ?? null);

                    if ((string) $userAns !== (string) $correctAnswerId) {
                        $wrongQuestions->push($q);
                    }
                }

                if ($wrongQuestions->isNotEmpty()) {
                    $questions = $wrongQuestions;
                }
            }
        }

        // Transform questions for frontend (map to expected structure)
        $mappedQuestions = $questions->map(function ($q) {
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

        return Inertia::render('Tests/Take', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title ?? 'Untitled Test',
                'description' => $test->description ?? '',
                'duration' => $test->duration ?? 40,
                'level' => $test->level,
                'part' => $test->part,
                'total_questions' => $questions->count(),
                'questions' => $mappedQuestions,
                'retake_wrong' => (bool) $retakeWrong,
                'previous_result_id' => $resultId ? (int) $resultId : null,
            ],
        ]);
    }
}
