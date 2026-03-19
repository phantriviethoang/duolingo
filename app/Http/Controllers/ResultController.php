<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Result;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
    public function store(Request $request)
    {
        // Debug log để kiểm tra request data
        Log::info('Result store request data', ['data' => $request->all()]);
        Log::info('Answers field type', ['type' => gettype($request->answers)]);
        Log::info('Answers field value', ['answers' => $request->answers]);

        $request->validate([
            'test_id' => 'required|exists:tests,id',
            'answers' => 'required', // Chỉ yêu cầu field tồn tại, không yêu cầu array
            'score' => 'required|integer|min:0|max:100',
            'correct' => 'required|integer|min:0',
            'total' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        $test = Test::findOrFail($request->test_id);

        // Check if test is accessible
        if (! $this->canAccessTest($user, $test)) {
            abort(403, 'This part is locked');
        }

        // Create test result
        $answers = $request->answers;

        // Nếu answers là { empty: true }, chuyển thành array rỗng
        if (is_array($answers) && isset($answers['empty']) && $answers['empty'] === true) {
            $answers = [];
        }

        Log::info('Final answers to save', ['answers' => $answers]);

        $result = Result::create([
            'user_id' => $user->id,
            'test_id' => $test->id,
            'answers' => $answers,
            'score' => $request->score,
            'correct' => $request->correct,
            'total' => $request->total,
            'completed_at' => now(),
        ]);

        Log::info('Result created successfully', ['result' => $result->toArray()]);

        // Update progress
        $this->updateProgress($user, $test, $request->score);

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
