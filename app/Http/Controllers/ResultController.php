<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Result;
use App\Models\Progress;
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
        $questions = $test->questions()
            ->with('answers:id,question_id,is_correct')
            ->get(['id', 'correct_option_id']);

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
            'completed_at' => now(),
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

        $result->load('test.questions.answers');

        // Tính số câu đúng và tổng số câu
        $correct = 0;
        $total = 0;

        if ($result->test->questions) {
            $total = $result->test->questions->count();

            foreach ($result->test->questions as $question) {
                if ($question->answers) {
                    $correctAnswer = $question->answers->firstWhere('is_correct', true);
                    $userAnswerId = $result->answers[$question->id] ?? null;

                    if ($userAnswerId && $correctAnswer && $userAnswerId === $correctAnswer->id) {
                        $correct++;
                    }
                }
            }
        }

        // Thêm thông tin vào result
        $result->correct = $correct;
        $result->total = $total;

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

        $passScores = [1 => 60, 2 => 75, 3 => 90];
        return $previousProgress->score >= $passScores[$previousPart];
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

        $passScores = [1 => 60, 2 => 75, 3 => 90];
        if ($score >= $passScores[$test->part]) {
            $progress->completed = true;
        }

        $progress->save();
    }
}
