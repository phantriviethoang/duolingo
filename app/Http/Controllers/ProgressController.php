<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Progress;
use App\Services\CEFRProgressService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProgressController extends Controller
{
    protected $cefrService;

    public function __construct(CEFRProgressService $cefrService)
    {
        $this->cefrService = $cefrService;
    }

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
     * Dashboard tiến độ học tập chi tiết
     */
    public function dashboard()
    {
        $user = Auth::user();
        $stats = $this->cefrService->getUserDetailedStats($user);

        return Inertia::render('Progress/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Get progress data for specific level
     */
    private function getLevelProgress($user, $level)
    {
        // Dynamically get parts from database (from progress or test_parts)
        $parts = Progress::where('user_id', $user->id)
            ->where('level', $level)
            ->distinct()
            ->orderBy('part')
            ->pluck('part')
            ->map(fn($part) => (int) $part)
            ->toArray();

        // If no progress yet, fetch available parts from test database
        if (empty($parts)) {
            $parts = \App\Models\TestPart::query()
                ->whereHas('test', function ($query) use ($level) {
                    $query->where('level', $level);
                })
                ->distinct()
                ->orderBy('part_number')
                ->pluck('part_number')
                ->map(fn($part) => (int) $part)
                ->toArray();
        }

        // Fallback to empty if still nothing
        if (empty($parts)) {
            $parts = [];
        }

        $levelConfig = \App\Models\Level::where('name', $level)->first();
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

            // Get threshold from config (dynamic, not hardcoded)
            $thresholdField = "pass_threshold_part{$part}";
            $passScore = $levelConfig ? ($levelConfig->$thresholdField ?? 60.0) : 60.0;

            $partData = [
                'part' => $part,
                'completed' => false,
                'score' => 0,
                'attempts' => 0,
                'pass_score' => (int) $passScore,
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
