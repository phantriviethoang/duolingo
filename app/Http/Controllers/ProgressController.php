<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Progress;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProgressController extends Controller
{
    /**
     * Display user's overall progress
     */
    public function index()
    {
        $user = Auth::user();

        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $progressData = [];

        foreach ($levels as $level) {
            $progressData[$level] = $this->getLevelProgress($user, $level);
        }

        $recentResults = Result::where('user_id', $user->id)
            ->with('test')
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Progress/Index', [
            'progressData' => $progressData,
            'recentResults' => $recentResults,
            'currentLevel' => $user->current_level ?? 'A1',
        ]);
    }

    /**
     * Get progress data for specific level
     */
    private function getLevelProgress($user, $level)
    {
        $parts = [1, 2, 3];
        $levelProgress = [
            'level' => $level,
            'parts' => [],
            'overall_completion' => 0,
        ];

        $completedParts = 0;

        foreach ($parts as $part) {
            $progress = Progress::where('user_id', $user->id)
                ->where('level', $level)
                ->where('part', $part)
                ->first();

            $partData = [
                'part' => $part,
                'completed' => false,
                'score' => 0,
                'attempts' => 0,
                'pass_score' => [1 => 60, 2 => 75, 3 => 90][$part],
            ];

            if ($progress) {
                $partData['completed'] = $progress->completed;
                $partData['score'] = $progress->score;
                $partData['attempts'] = $progress->attempts;

                if ($progress->completed) {
                    $completedParts++;
                }
            }

            $levelProgress['parts'][] = $partData;
        }

        $levelProgress['overall_completion'] = ($completedParts / 3) * 100;

        return $levelProgress;
    }
}
