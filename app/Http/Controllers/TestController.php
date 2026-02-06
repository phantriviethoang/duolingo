<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Models\Test;
use Illuminate\Http\Request;
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
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Lấy tất cả tests
            $tests = Test::orderBy('created_at', 'desc')
                ->get()
                ->map(function ($test) {
                    return [
                        'id' => $test->id,
                        'title' => $test->title ?? 'Untitled',
                        'description' => $test->description ?? '',
                        'duration' => $test->duration ?? 40,
                        'total_questions' => $test->total_questions ?? 0,
                        'attempts' => $test->attempts ?? 0,
                        'created_at' => $test->created_at ? $test->created_at->format('Y-m-d') : '',
                    ];
                });

            // Đảm bảo luôn trả về array, không phải null
            $tests = $tests->toArray();

            return Inertia::render('Tests/Index', [
                'tests' => $tests,
            ]);
        } catch (\Exception $e) {
            // Nếu có lỗi, vẫn trả về trang với mảng rỗng
            \Log::error('TestController@index error: ' . $e->getMessage());

            return Inertia::render('Tests/Index', [
                'tests' => [],
                'error' => 'Có lỗi xảy ra khi tải dữ liệu: ' . $e->getMessage(),
            ]);
        }
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
        $questionsData = $data['questions'] ?? [];
        $data['total_questions'] = count($questionsData);

        // Remove questions from data before creating Test
        unset($data['questions']);

        $test = Test::create($data);

        // Creates questions
        foreach ($questionsData as $index => $qData) {
            // Chuẩn bị options
            $options = [];
            $correctOptionId = 0;

            // Checking if options are simple strings or objects
            // The frontend likely sends objects {id, text, is_correct} or similar
            // Based on Take.jsx, options have id, text.

            if (isset($qData['options']) && is_array($qData['options'])) {
                foreach ($qData['options'] as $optIndex => $option) {
                    $optId = $optIndex; // Re-index for safety/consistency with Factory
                    $options[] = [
                        'id' => $optId,
                        'text' => is_array($option) ? ($option['text'] ?? '') : $option,
                        'is_correct' => is_array($option) ? ($option['is_correct'] ?? false) : false,
                    ];

                    if (is_array($option) && isset($option['is_correct']) && $option['is_correct']) {
                        $correctOptionId = $optId;
                    }
                }
            }

            $test->questions()->create([
                'question' => $qData['question'],
                'options' => $options,
                'correct_option_id' => $correctOptionId,
                'explanation' => $qData['explanation'] ?? null,
                'translation' => $qData['translation'] ?? null,
                'detailed_explanation' => $qData['detailed_explanation'] ?? null,
            ]);
        }

        return redirect()->route('tests.index')
            ->with('success', 'Đề thi đã được tạo thành công!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Test $test)
    {
        return Inertia::render('Tests/Show', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                // 'email' => $test->email,
                'description' => $test->description,
                'duration' => $test->duration,
                'audio_path' => $test->audio_path,
                'image_path' => $test->image_path,
                'total_questions' => $test->total_questions,
                'attempts' => $test->attempts,
                'created_at' => $test->created_at->format('Y-m-d H:i'),
            ],
        ]);
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
                // 'email' => $test->email,
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
        $questionsData = $data['questions'] ?? [];
        $data['total_questions'] = count($questionsData);

        unset($data['questions']);

        $test->update($data);

        // Delete existing questions and recreate (Strategies: sync, or delete-all-create-new)
        // For simplicity and to ensure order/ids match the editor view:
        $test->questions()->delete();

        foreach ($questionsData as $qData) {
            $options = [];
            $correctOptionId = 0;

            if (isset($qData['options']) && is_array($qData['options'])) {
                foreach ($qData['options'] as $optIndex => $option) {
                    $optId = $optIndex;
                    $options[] = [
                        'id' => $optId,
                        'text' => is_array($option) ? ($option['text'] ?? '') : $option,
                        'is_correct' => is_array($option) ? ($option['is_correct'] ?? false) : false,
                    ];

                    if (is_array($option) && isset($option['is_correct']) && $option['is_correct']) {
                        $correctOptionId = $optId;
                    }
                }
            }

            $test->questions()->create([
                'question' => $qData['question'],
                'options' => $options,
                'correct_option_id' => $correctOptionId,
                'explanation' => $qData['explanation'] ?? null,
                'translation' => $qData['translation'] ?? null,
                'detailed_explanation' => $qData['detailed_explanation'] ?? null,
            ]);
        }

        return redirect()->route('tests.index')
            ->with('success', 'Đề thi đã được cập nhật thành công!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test)
    {
        $test->delete();

        return redirect()->route('tests.index')
            ->with('success', 'Đề thi đã được xóa thành công!');
    }

    /**
     * Show the test taking page
     */
    public function take(Test $test)
    {
        // Kiểm tra test có tồn tại không
        if (!$test) {
            return redirect()->route('tests.index')
                ->with('error', 'Đề thi không tồn tại.');
        }

        // Kiểm tra test có active không
        if (!$test->is_active) {
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

        // Transform questions for frontend (map to expected structure)
        $mappedQuestions = $questions->map(function ($q) {
            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $q->options,
                // Do not send correct_option_id, explanation, etc. to frontend during take
            ];
        });

        return Inertia::render('Tests/Take', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title ?? 'Untitled Test',
                'description' => $test->description ?? '',
                'duration' => $test->duration ?? 40,
                'total_questions' => $questions->count(),
                'questions' => $mappedQuestions,
            ],
        ]);
    }
}
