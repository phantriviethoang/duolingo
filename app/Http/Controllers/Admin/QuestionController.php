<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Test;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function apiIndex(Request $request)
    {
        $query = Question::query();

        if ($request->has('level') && $request->level) {
            $query->where('level', $request->level);
        }

        if ($request->has('part_number') && $request->part_number) {
            // Support comma separated part numbers or array
            $parts = is_array($request->part_number) ? $request->part_number : explode(',', $request->part_number);
            $query->whereIn('part_number', $parts);
        }

        // Optional: filter by test_id (exclude questions already in this test)
        if ($request->has('exclude_test_id') && $request->exclude_test_id) {
            $query->whereDoesntHave('tests', function($q) use ($request) {
                $q->where('tests.id', $request->exclude_test_id);
            });
        }

        return response()->json(
            $query->select('id', 'question_text', 'level', 'part_number')
                  ->orderBy('part_number')
                  ->orderBy('created_at', 'desc')
                  ->get()
        );
    }

    public function index(Request $request)
    {
        $query = Question::with('tests');

        if ($request->has('level') && $request->level) {
            $query->where('level', $request->level);
        }

        if ($request->has('test_id') && $request->test_id) {
            $query->whereHas('tests', function($q) use ($request) {
                $q->where('tests.id', $request->test_id);
            });
        }

        if ($request->has('part_number') && $request->part_number) {
            $query->where('part_number', $request->part_number);
        }

        $questions = $query->orderByDesc('created_at')
            ->paginate(20)
            ->through(function ($question) {
                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'level' => $question->level,
                    'test' => $question->tests->first() ? ['id' => $question->tests->first()->id, 'title' => $question->tests->first()->title] : null,
                    'part_number' => $question->part_number,
                    'created_at' => optional($question->created_at)->format('d/m/Y'),
                ];
            });

        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions,
            'filters' => $request->only(['level', 'test_id', 'part_number']),
            'tests' => Test::select('id', 'title', 'level')->get(),
            'levels' => \App\Models\Level::select('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Questions/Create', [
            'tests' => Test::with('parts')->select('id', 'title', 'level')->get(),
            'levels' => \App\Models\Level::select('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'test_id' => 'required|exists:tests,id',
            'level' => 'required|string',
            'part_number' => 'required|integer|min:1',
            'question_text' => 'required|string',
            'explanation' => 'nullable|string',
            'translation' => 'nullable|string',
            'detailed_explanation' => 'nullable|string',
            'answers' => 'required|array|min:2',
            'answers.*.text' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
        ]);

        // Validate exactly one correct answer
        $correctCount = collect($data['answers'])
            ->filter(fn ($ans) => $ans['is_correct'] ?? false)
            ->count();

        if ($correctCount !== 1) {
            return back()->withErrors(['answers' => 'Phải có đúng 1 đáp án đúng.'])->withInput();
        }

        $questionCount = \DB::table('question_test')->where('test_id', $data['test_id'])->count();

        $question = Question::create([
            'level' => $data['level'],
            'part_number' => $data['part_number'],
            'question_text' => $data['question_text'],
            'order' => $questionCount + 1,
            'explanation' => $data['explanation'] ?? null,
            'translation' => $data['translation'] ?? null,
            'detailed_explanation' => $data['detailed_explanation'] ?? null,
        ]);

        $question->tests()->attach($data['test_id'], ['order' => $questionCount + 1]);

        foreach ($data['answers'] as $answerData) {
            $question->answers()->create([
                'answer_text' => $answerData['text'],
                'is_correct' => $answerData['is_correct'],
            ]);
        }

        $test = Test::find($data['test_id']);
        if ($test) {
            $test->increment('total_questions');
        }

        return redirect()->route('admin.questions.index')
            ->with('success', 'Câu hỏi đã được tạo!');
    }

    public function edit(Question $question)
    {
        $question->load(['answers', 'tests']);

        return Inertia::render('Admin/Questions/Edit', [
            'question' => [
                'id' => $question->id,
                'test_id' => $question->tests->first()?->id,
                'level' => $question->level,
                'part_number' => $question->part_number,
                'question_text' => $question->question_text,
                'explanation' => $question->explanation,
                'translation' => $question->translation,
                'detailed_explanation' => $question->detailed_explanation,
                'answers' => $question->answers->map(function ($ans) {
                    return [
                        'id' => $ans->id,
                        'text' => $ans->answer_text,
                        'is_correct' => (bool) $ans->is_correct,
                    ];
                }),
            ],
            'tests' => Test::with('parts')->select('id', 'title', 'level')->get(),
            'levels' => \App\Models\Level::select('name')->get(),
        ]);
    }

    public function update(Request $request, Question $question)
    {
        $data = $request->validate([
            'test_id' => 'required|exists:tests,id',
            'level' => 'required|string',
            'part_number' => 'required|integer|min:1',
            'question_text' => 'required|string',
            'explanation' => 'nullable|string',
            'translation' => 'nullable|string',
            'detailed_explanation' => 'nullable|string',
            'answers' => 'required|array|min:2',
            'answers.*.text' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
        ]);

        // Validate exactly one correct answer
        $correctCount = collect($data['answers'])
            ->filter(fn ($ans) => $ans['is_correct'] ?? false)
            ->count();

        if ($correctCount !== 1) {
            return back()->withErrors(['answers' => 'Phải có đúng 1 đáp án đúng.'])->withInput();
        }

        $oldTestId = $question->tests->first()?->id;

        $question->update([
            'level' => $data['level'],
            'part_number' => $data['part_number'],
            'question_text' => $data['question_text'],
            'explanation' => $data['explanation'] ?? null,
            'translation' => $data['translation'] ?? null,
            'detailed_explanation' => $data['detailed_explanation'] ?? null,
        ]);

        $question->answers()->delete();

        foreach ($data['answers'] as $answerData) {
            $question->answers()->create([
                'answer_text' => $answerData['text'],
                'is_correct' => $answerData['is_correct'],
            ]);
        }

        $question->tests()->syncWithPivotValues([$data['test_id']], ['order' => $question->order ?? 1]);

        if ($oldTestId && $oldTestId !== (int) $data['test_id']) {
            $oldTest = Test::find($oldTestId);
            if ($oldTest && $oldTest->total_questions > 0) {
                $oldTest->decrement('total_questions');
            }
            $newTest = Test::find($data['test_id']);
            if ($newTest) {
                $newTest->increment('total_questions');
            }
        } elseif (!$oldTestId) {
            $newTest = Test::find($data['test_id']);
            if ($newTest) {
                $newTest->increment('total_questions');
            }
        }

        return redirect()->route('admin.questions.index')
            ->with('success', 'Câu hỏi đã được cập nhật!');
    }

    public function destroy(Question $question)
    {
        $testIds = $question->tests()->pluck('tests.id');
        $question->tests()->detach();
        $question->delete();

        foreach ($testIds as $testId) {
            $test = Test::find($testId);
            if ($test && $test->total_questions > 0) {
                $test->decrement('total_questions');
            }
        }

        return redirect()->route('admin.questions.index')
            ->with('success', 'Câu hỏi đã bị xóa!');
    }
}
