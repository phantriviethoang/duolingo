<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestResult;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestResultController extends Controller
{
    public function index()
    {
        $results = TestResult::query()
            ->with('test')
            ->orderByDesc('completed_at')
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->id,
                    'test_id' => $result->test_id,
                    'test_title' => $result->test?->title ?? 'Đề thi',
                    'score' => $result->score,
                    'completed_at' => $result->completed_at?->format('Y-m-d H:i') ?? '',
                ];
            })
            ->toArray();

        return Inertia::render('Results/Index', [
            'results' => $results,
        ]);
    }

    public function store(Request $request, Test $test)
    {
        $data = $request->validate([
            'answers' => ['nullable', 'array'],
        ]);

        $answers = $data['answers'] ?? [];
        
        // Load questions from DB
        $questions = $test->questions()->get();

        $correct = 0;
        foreach ($questions as $question) {
            $userAnswer = $answers[$question->id] ?? null;
            
            // Note: $question->id is now the DB ID of TestQuestion
            // Frontend sends answers keyed by that ID.
            
            if ($userAnswer !== null && $userAnswer == $question->correct_option_id) {
                $correct++;
            }
        }

        $total = $questions->count();
        $score = $total > 0 ? (int) round(($correct / $total) * 100) : 0;

        $userId = auth()->id() ?? User::query()->value('id');

        $result = TestResult::create([
            'user_id' => $userId,
            'test_id' => $test->id,
            'score' => $score,
            'user_answer' => $answers,
            'completed_at' => now(),
        ]);

        return redirect()->route('results.show', $result);
    }

    public function show(TestResult $result)
    {
        $result->load('test');
        $test = $result->test;
        
        // Load questions from relation
        $questions = $test?->questions()->get() ?? collect([]);
        $answers = is_array($result->user_answer) ? $result->user_answer : [];

        $correct = 0;
        // Transform questions for display and calc correct count for verification (optional)
        $mappedQuestions = $questions->map(function ($q) use ($answers) {
            // Note: We need to inject is_correct into options for frontend display
            // OR frontend needs to check correct_option_id
            // Let's modify options to include is_correct for frontend compatibility
            $options = $q->options;
            $newOptions = [];
            if (is_array($options)) {
                foreach ($options as $opt) {
                     $opt['is_correct'] = ($opt['id'] == $q->correct_option_id);
                     $newOptions[] = $opt;
                }
            }
            
            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $newOptions,
                'explanation' => $q->explanation,
                'translation' => $q->translation,
                'detailed_explanation' => $q->detailed_explanation,
                'correct_option_id' => $q->correct_option_id,
            ];
        });

        // Recalculate correct for display summary (if needed, but result already has correct count usually? logic below relied on loop)
        foreach ($mappedQuestions as $q) {
             $userAnswer = $answers[$q['id']] ?? null;
             // Ensure type safety
             if ($userAnswer !== null && $userAnswer == $q['correct_option_id']) {
                 $correct++;
             }
        }

        $total = $questions->count();

        return Inertia::render('Results/Show', [
            'test' => [
                'id' => $test?->id,
                'title' => $test?->title ?? 'Đề thi',
            ],
            'result' => [
                'id' => $result->id,
                'score' => $result->score,
                'correct' => $correct, // Recalculated based on current questions
                'total' => $total,
                'answers' => $answers,
                'completed_at' => $result->completed_at?->format('Y-m-d H:i') ?? '',
            ],
            'questions' => $mappedQuestions,
        ]);
    }
}
