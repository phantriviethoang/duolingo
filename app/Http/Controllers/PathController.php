<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PathController extends Controller
{
    private const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    /**
     * Display learning path for current level
     */
    public function target()
    {
        return $this->index();
    }

    public function index()
    {
        $user = Auth::user();
        $currentLevel = $user->current_level ?? 'A1';
        $progressData = [];

        foreach (self::LEVELS as $level) {
            $progressData[$level] = [
                'part1' => self::getPartProgress($user, $level, 1),
                'part2' => self::getPartProgress($user, $level, 2),
                'part3' => self::getPartProgress($user, $level, 3),
            ];
        }

        return Inertia::render('Path/Index', [
            'currentLevel' => $currentLevel,
            'levels' => self::LEVELS,
            'progressData' => $progressData,
        ]);
    }

    /**
     * Alias for /path/level to display 6 CEFR levels.
     */
    public function levels()
    {
        return $this->index();
    }

    /**
     * Update user's current level
     */
    public function saveTarget(Request $request)
    {
        return $this->update($request);
    }

    public function update(Request $request)
    {
        $request->validate([
            'level' => 'required|in:A1,A2,B1,B2,C1,C2',
        ]);

        $user = Auth::user();
        $user->update(['current_level' => $request->level]);

        return redirect()->route('path.parts', $request->level);
    }

    /**
     * Show specific level with parts
     */
    public function show($level)
    {
        return $this->parts($level);
    }

    /**
     * Show parts of selected level.
     */
    public function parts($level)
    {
        $user = Auth::user();

        if (! in_array($level, self::LEVELS, true)) {
            abort(404);
        }

        $parts = $this->buildPartsData($user, $level);

        return Inertia::render('Path/Show', [
            'level' => $level,
            'parts' => $parts,
            'selectedPart' => null,
        ]);
    }

    /**
     * Show tests list for selected part in a level.
     */
    public function tests($level, $part)
    {
        $user = Auth::user();
        $part = (int) $part;

        if (! in_array($level, self::LEVELS, true) || ! in_array($part, [1, 2, 3], true)) {
            abort(404);
        }

        $parts = $this->buildPartsData($user, $level);

        return Inertia::render('Path/Show', [
            'level' => $level,
            'parts' => $parts,
            'selectedPart' => $part,
        ]);
    }

    private function buildPartsData($user, string $level): array
    {
        return [
            1 => [
                'name' => 'Part 1',
                'pass_score' => 60,
                'tests' => $this->mapTestsForPart($level, 1),
                'unlocked' => true,
                'progress' => $this->getPartProgress($user, $level, 1),
            ],
            2 => [
                'name' => 'Part 2',
                'pass_score' => 75,
                'tests' => $this->mapTestsForPart($level, 2),
                'unlocked' => $this->isPartUnlocked($user, $level, 2),
                'progress' => $this->getPartProgress($user, $level, 2),
            ],
            3 => [
                'name' => 'Part 3',
                'pass_score' => 90,
                'tests' => $this->mapTestsForPart($level, 3),
                'unlocked' => $this->isPartUnlocked($user, $level, 3),
                'progress' => $this->getPartProgress($user, $level, 3),
            ],
        ];
    }

    private function mapTestsForPart(string $level, int $part)
    {
        return Test::where('level', $level)
            ->where('part', $part)
            ->get()
            ->map(function (Test $test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                    'duration' => $test->configuredDuration(),
                    'level' => $test->level,
                    'part' => $test->part,
                    'total_questions' => $test->configuredQuestionCount(),
                ];
            })
            ->values();
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
