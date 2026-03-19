<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Models\Test;
use Inertia\Inertia;

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
    public function index()
    {
        $user = auth()->user();
        $tests = Test::orderBy('level')
            ->orderBy('part')
            ->get()
            ->map(function ($test) use ($user) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                    'level' => $test->level,
                    'part' => $test->part,
                    'duration' => $test->duration,
                    'total_questions' => $test->total_questions,
                    'locked' => ! $this->canAccessTest($user, $test),
                ];
            });

        return Inertia::render('Tests/Index', [
            'tests' => $tests,
        ]);
    }

    /**
     * Display specific test
     */
    public function show(Test $test)
    {
        $user = auth()->user();

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

        foreach ($questions as $q) {
            // options
            $options = collect($q['options'] ?? [])->map(function ($opt, $i) {
                return [
                    'id' => $opt['id'] ?? chr(65 + $i),
                    'text' => $opt['text'] ?? '',
                ];
            })->toArray();

            // lấy đáp án đúng
            $correct = collect($q['options'] ?? [])
                ->firstWhere('is_correct', true);

            $test->questions()->create([
                'question' => $q['question'],
                'options' => $options,
                'correct_option_id' => $correct['id'] ?? 'A',
                'explanation' => $q['explanation'] ?? null,
                'translation' => $q['translation'] ?? null,
                'detailed_explanation' => $q['detailed_explanation'] ?? null,
            ]);
        }

        return redirect()->route('admin.tests')
            ->with('success', 'Đề thi đã được tạo!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Test $test)
    {
        return Inertia::render('Tests/Edit', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'description' => $test->description,
                'duration' => $test->duration,
                'audio_path' => $test->audio_path,
                'image_path' => $test->image_path,
                'questions' => $test->questions,
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

        foreach ($questions as $q) {

            $options = collect($q['options'] ?? [])->map(function ($opt, $i) {
                return [
                    'id' => $opt['id'] ?? chr(65 + $i),
                    'text' => $opt['text'] ?? '',
                ];
            })->toArray();

            $correct = collect($q['options'] ?? [])
                ->firstWhere('is_correct', true);

            $test->questions()->create([
                'question' => $q['question'],
                'options' => $options,
                'correct_option_id' => $correct['id'] ?? 'A',
                'explanation' => $q['explanation'] ?? null,
                'translation' => $q['translation'] ?? null,
                'detailed_explanation' => $q['detailed_explanation'] ?? null,
            ]);
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

    public function take(Test $test)
    {
        // Kiểm tra test có tồn tại không
        if (! $test) {
            return redirect()->route('tests.index')
                ->with('error', 'Đề thi không tồn tại.');
        }

        // Kiểm tra test có active không
        if (! $test->is_active) {
            return redirect()->route('tests.index')
                ->with('error', 'Đề thi này không khả dụng.');
        }

        // Lấy câu hỏi từ bảng test_questions
        $questions = $test->questions()->get();

        if ($questions->isEmpty()) {
            return redirect()->route('tests.index')
                ->with('error', 'Đề thi này chưa có câu hỏi.');
        }

        // Tăng số lượt làm bài
        $test->increment('attempts');

        $retakeWrong = request()->query('retake_wrong');
        $resultId = request()->query('result_id');

        if ($retakeWrong && $resultId) {
            $previousResult = \App\Models\Result::where('id', $resultId)
                ->where('user_id', auth()->id())
                ->first();

            if ($previousResult) {
                $prevAnswers = (array) $previousResult->answers;
                $wrongQuestions = collect();

                foreach ($questions as $q) {
                    $userAns = $prevAnswers[$q->id] ?? null;
                    if ($userAns != $q->correct_option_id) {
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
            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => is_array($q->options) ? $q->options : (is_string($q->options) ? json_decode($q->options, true) : []),
                // Do not send correct_option_id, explanation, etc. to frontend during take
            ];
        })->values();

        return Inertia::render('Tests/Take', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title ?? 'Untitled Test',
                'description' => $test->description ?? '',
                'duration' => $test->duration ?? 40,
                'total_questions' => $questions->count(),
                'questions' => $mappedQuestions,
                'retake_wrong' => (bool) $retakeWrong,
                'previous_result_id' => $resultId ? (int) $resultId : null,
            ],
        ]);
    }
}
