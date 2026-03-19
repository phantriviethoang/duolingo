<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PathController extends Controller
{
    /**
     * Display learning path for current level
     */
    public function index()
    {
        $user = Auth::user();
        $currentLevel = $user->current_level ?? 'A1';

        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $progressData = [];

        foreach ($levels as $level) {
            $progressData[$level] = [
                'part1' => $this->getPartProgress($user, $level, 1),
                'part2' => $this->getPartProgress($user, $level, 2),
                'part3' => $this->getPartProgress($user, $level, 3),
            ];
        }

        return Inertia::render('Path/Index', [
            'currentLevel' => $currentLevel,
            'levels' => $levels,
            'progressData' => $progressData,
        ]);
    }

    /**
     * Update user's current level
     */
    public function update(Request $request)
    {
        $request->validate([
            'level' => 'required|in:A1,A2,B1,B2,C1,C2',
        ]);

        $user = Auth::user();
        $user->update(['current_level' => $request->level]);

        return redirect()->route('path.show', $request->level);
    }

    /**
     * Show specific level with parts
     */
    public function show($level)
    {
        $user = Auth::user();

        if (! in_array($level, ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])) {
            abort(404);
        }

        $parts = [
            1 => [
                'name' => 'Part 1',
                'pass_score' => 60,
                'tests' => Test::where('level', $level)->where('part', 1)->get(),
                'unlocked' => true,
                'progress' => $this->getPartProgress($user, $level, 1),
            ],
            2 => [
                'name' => 'Part 2',
                'pass_score' => 75,
                'tests' => Test::where('level', $level)->where('part', 2)->get(),
                'unlocked' => $this->isPartUnlocked($user, $level, 2),
                'progress' => $this->getPartProgress($user, $level, 2),
            ],
            3 => [
                'name' => 'Part 3',
                'pass_score' => 90,
                'tests' => Test::where('level', $level)->where('part', 3)->get(),
                'unlocked' => $this->isPartUnlocked($user, $level, 3),
                'progress' => $this->getPartProgress($user, $level, 3),
            ],
        ];

        return Inertia::render('Path/Show', [
            'level' => $level,
            'parts' => $parts,
        ]);
    }

    /**
     * Get progress for specific part
     */
    private function getPartProgress($user, $level, $part)
    {
        $progress = Progress::where('user_id', $user->id)
            ->where('level', $level)
            ->where('part', $part)
            ->first();

        if (! $progress) {
            return [
                'completed' => false,
                'score' => 0,
                'attempts' => 0,
            ];
        }

        return [
            'completed' => $progress->completed,
            'score' => $progress->score,
            'attempts' => $progress->attempts,
        ];
    }

    /**
     * Check if part is unlocked
     */
    private function isPartUnlocked($user, $level, $part)
    {
        if ($part === 1) {
            return true;
        }

        $previousPart = $part - 1;
        $previousProgress = Progress::where('user_id', $user->id)
            ->where('level', $level)
            ->where('part', $previousPart)
            ->first();

        if (! $previousProgress) {
            return false;
        }

        $passScores = [1 => 60, 2 => 75, 3 => 90];
        return $previousProgress->score >= $passScores[$previousPart];
    }
}
