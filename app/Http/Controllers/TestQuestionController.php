<?php

namespace App\Http\Controllers;

use App\Models\TestQuestion;
use App\Models\Test;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestQuestionController extends Controller
{
    /**
     * Display admin listing of questions
     */
    public function adminIndex()
    {
        $questions = TestQuestion::with('test')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (TestQuestion $question) {
                return [
                    'id' => $question->id,
                    'test_id' => $question->test_id,
                    'test' => $question->test?->title ?? 'N/A',
                    'question' => substr($question->question ?? '', 0, 100),
                    'question_full' => $question->question,
                    'created_at' => optional($question->created_at)->format('d/m/Y'),
                ];
            })
            ->values()
            ->toArray();

        $tests = Test::select('id', 'title')
            ->orderBy('title')
            ->get()
            ->toArray();

        return Inertia::render('Admin/Questions', [
            'questions' => $questions,
            'tests' => $tests,
        ]);
    }

    /**
     * Create a new question
     */
    public function create()
    {
        $tests = Test::select('id', 'title')
            ->orderBy('title')
            ->get()
            ->toArray();

        return Inertia::render('Admin/CreateQuestion', [
            'tests' => $tests,
        ]);
    }

    /**
     * Store a newly created question
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'test_id' => ['required', 'integer', 'exists:tests,id'],
            'question' => ['required', 'string', 'max:5000'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.id' => ['required', 'string'],
            'options.*.text' => ['required', 'string'],
            'correct_option_id' => ['required', 'string'],
            'explanation' => ['nullable', 'string'],
        ]);

        // Determine question number for this test
        $maxQuestionNumber = TestQuestion::where('test_id', $validated['test_id'])
            ->max('question_number') ?? 0;

        $validated['question_number'] = $maxQuestionNumber + 1;
        // Ensure correct_option_id is stored as a string for consistency
        $validated['correct_option_id'] = (string) $validated['correct_option_id'];

        TestQuestion::create($validated);

        return redirect()->route('admin.questions')
            ->with('success', 'Câu hỏi được tạo thành công!');
    }

    /**
     * Edit a question
     */
    public function edit(TestQuestion $testQuestion)
    {
        $tests = Test::select('id', 'title')
            ->orderBy('title')
            ->get()
            ->toArray();

        $question = [
            'id' => $testQuestion->id,
            'test_id' => $testQuestion->test_id,
            'question' => $testQuestion->question,
            'options' => is_array($testQuestion->options) ? $testQuestion->options : json_decode($testQuestion->options, true),
            'correct_option_id' => (string) $testQuestion->correct_option_id,
            'explanation' => $testQuestion->explanation,
        ];

        return Inertia::render('Admin/EditQuestion', [
            'question' => $question,
            'tests' => $tests,
        ]);
    }

    /**
     * Update a question
     */
    public function update(Request $request, TestQuestion $testQuestion)
    {
        $validated = $request->validate([
            'test_id' => ['required', 'integer', 'exists:tests,id'],
            'question' => ['required', 'string', 'max:5000'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.id' => ['required', 'string'],
            'options.*.text' => ['required', 'string'],
            'correct_option_id' => ['required', 'string'],
            'explanation' => ['nullable', 'string'],
        ]);

        // Ensure correct_option_id is stored as a string for consistency
        $validated['correct_option_id'] = (string) $validated['correct_option_id'];

        $testQuestion->update($validated);

        return redirect()->route('admin.questions')
            ->with('success', 'Câu hỏi được cập nhật thành công!');
    }

    /**
     * Delete a question
     */
    public function destroy(TestQuestion $testQuestion)
    {
        $testQuestion->delete();

        return redirect()->route('admin.questions')
            ->with('success', 'Câu hỏi được xóa thành công!');
    }
}
