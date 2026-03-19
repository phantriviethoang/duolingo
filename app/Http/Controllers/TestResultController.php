<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestResult;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestResultController extends Controller
{
    public function index()
    {
        $results = TestResult::query()
            ->where('user_id', auth()->id())
            // n+1
            ->with('test')
            ->orderByDesc('completed_at')
            ->get()
            ->map(function ($result) {
                // Tính số câu sai
                $questions = $result->test?->questions ?? collect();
                $answers = (array) $result->user_answer;
                $wrongCount = 0;

                foreach ($questions as $question) {
                    $userAnswer = $answers[$question->id] ?? null;
                    if ($userAnswer !== null && $userAnswer != $question->correct_option_id) {
                        $wrongCount++;
                    }
                }

                return [
                    'id' => $result->id,
                    'test_id' => $result->test_id,
                    'test_title' => $result->test->title,
                    'score' => $result->score,
                    'wrong_count' => $wrongCount,
                    'total_questions' => $questions->count(),
                    'correct_count' => $questions->count() - $wrongCount,
                    'completed_at' => $result->completed_at?->format('Y-m-d H:i'),
                ];
            })
            ->toArray();

        // pass to FE
        return Inertia::render('Results/Index', [
            'results' => $results,
        ]);
    }

    public function store(Request $request, Test $test)
    {
        $data = $request->validate([
            'answers' => ['nullable', 'array'],
            'retake_wrong' => ['nullable', 'boolean'],
            'previous_result_id' => ['nullable', 'integer'],
        ]);

        // lay cau tra loi
        $answers = $data['answers'] ?? [];

        if (! empty($data['retake_wrong']) && ! empty($data['previous_result_id'])) {
            $previousResult = TestResult::where('id', $data['previous_result_id'])
                ->where('user_id', auth()->id())
                ->first();

            if ($previousResult) {
                $mergedAnswers = (array) $previousResult->user_answer;
                foreach ($answers as $qId => $ans) {
                    $mergedAnswers[$qId] = $ans;
                }
                $answers = $mergedAnswers;
            }
        }

        // get all
        $questions = $test->questions()->get();

        $correct = 0;
        // logic
        foreach ($questions as $question) {
            // lay dap an cua nguoi dung voi cau hoi tuong ung
            $userAnswer = $answers[$question->id] ?? null;

            if ($userAnswer !== null && $userAnswer == $question->correct_option_id) {
                // so sanh va cong diem
                $correct++;
            }
        }

        // count
        $total = $questions->count();
        // tinh diem
        $score = $total > 0
            ? (int) round(($correct / $total) * 100)
            : 0;

        $userId = auth()->id();

        // luu ::create
        $result = TestResult::create([
            'user_id' => $userId,
            'test_id' => $test->id,
            'score' => $score,
            'user_answer' => $answers,
            'completed_at' => now(),
        ]);

        // redirect
        return redirect()->route('results.show', $result);
    }

    public function show(TestResult $result)
    {
        // load
        $result->load('test');
        $test = $result->test;

        $questions = $test?->questions ?? collect();
        $answers = (array) $result->user_answer;

        $correct = 0;

        // map
        $mappedQuestions = $questions->map(function ($q) use ($answers, &$correct) {
            // lay cac dap an
            $rawOptions = is_array($q->options) ? $q->options : (is_string($q->options) ? json_decode($q->options, true) : []);

            $formattedOptions = [];
            foreach ($rawOptions ?? [] as $key => $opt) {
                if (is_array($opt)) {
                    $formattedOptions[] = [
                        'id' => $opt['id'] ?? $key,
                        'text' => $opt['text'] ?? '',
                        'is_correct' => ($opt['id'] ?? $key) == $q->correct_option_id,
                    ];
                } else {
                    $formattedOptions[] = [
                        'id' => is_numeric($key) ? (int) $key : $key,
                        'text' => (string) $opt,
                        'is_correct' => $key == $q->correct_option_id,
                    ];
                }
            }

            // tinh diem
            if (($answers[$q->id] ?? null) == $q->correct_option_id) {
                $correct++;
            }

            // map xong tra ve
            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $formattedOptions,
                'explanation' => $q->explanation,
                'translation' => $q->translation,
                'detailed_explanation' => $q->detailed_explanation,
            ];
        });

        // pass data
        return Inertia::render('Results/Show', [
            'test' => [
                'id' => $test?->id,
                'title' => $test?->title,
            ],
            'result' => [
                'id' => $result->id,
                'score' => $result->score,
                'correct' => $correct,
                'total' => $questions->count(),
                'answers' => $answers,
                'completed_at' => $result->completed_at?->format('Y-m-d H:i'),
            ],
            'questions' => $mappedQuestions,
        ]);
    }

    /**
     * Lấy danh sách câu hỏi sai để làm lại
     */
    public function getWrongQuestions(TestResult $result)
    {
        $this->authorize('view', $result);

        $result->load('test');
        $test = $result->test;
        $questions = $test?->questions ?? collect();
        $answers = (array) $result->user_answer;

        // Lọc chỉ những câu sai
        $wrongQuestions = $questions->filter(function ($q) use ($answers) {
            $userAnswer = $answers[$q->id] ?? null;
            return $userAnswer !== null && $userAnswer != $q->correct_option_id;
        })->values();

        // Map dữ liệu
        $mappedQuestions = $wrongQuestions->map(function ($q) use ($answers) {
            $rawOptions = is_array($q->options) ? $q->options : (is_string($q->options) ? json_decode($q->options, true) : []);

            $formattedOptions = [];
            foreach ($rawOptions ?? [] as $key => $opt) {
                if (is_array($opt)) {
                    $formattedOptions[] = [
                        'id' => $opt['id'] ?? $key,
                        'text' => $opt['text'] ?? '',
                        'is_correct' => ($opt['id'] ?? $key) == $q->correct_option_id,
                    ];
                } else {
                    $formattedOptions[] = [
                        'id' => is_numeric($key) ? (int) $key : $key,
                        'text' => (string) $opt,
                        'is_correct' => $key == $q->correct_option_id,
                    ];
                }
            }

            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $formattedOptions,
                'explanation' => $q->explanation,
                'translation' => $q->translation,
                'detailed_explanation' => $q->detailed_explanation,
                'user_answer' => $answers[$q->id] ?? null,
            ];
        });

        return response()->json([
            'test' => [
                'id' => $test?->id,
                'title' => $test?->title,
                'duration' => $test?->duration,
            ],
            'result' => [
                'id' => $result->id,
                'score' => $result->score,
                'wrong_count' => count($wrongQuestions),
            ],
            'questions' => $mappedQuestions->toArray(),
        ]);
    }
}
