<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PathController extends Controller
{
    private const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    /**
     * Admin view for managing the learning path structure
     */
    public function adminIndex()
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $pathData = [];
        $levelConfigs = \App\Models\Level::all()->keyBy('name');

        foreach ($levels as $level) {
            $pathData[$level] = [
                'part1' => Test::where('level', $level)->where('part', 1)->count(),
                'part2' => Test::where('level', $level)->where('part', 2)->count(),
                'part3' => Test::where('level', $level)->where('part', 3)->count(),
                'config' => $levelConfigs[$level] ?? [
                    'pass_threshold_part1' => 60,
                    'pass_threshold_part2' => 75,
                    'pass_threshold_part3' => 90,
                ],
            ];
        }

        return Inertia::render('Admin/Path/Index', [
            'pathData' => $pathData,
            'levels' => $levels,
        ]);
    }

    /**
     * Update level threshold configuration
     */
    public function updateThreshold(Request $request, $level)
    {
        $request->validate([
            'part1' => 'required|numeric|min:0|max:100',
            'part2' => 'required|numeric|min:0|max:100',
            'part3' => 'required|numeric|min:0|max:100',
        ], [
            'part1.required' => 'Điểm Phần 1 là bắt buộc.',
            'part1.numeric' => 'Điểm Phần 1 phải là số.',
            'part1.min' => 'Điểm Phần 1 phải từ 0 đến 100.',
            'part1.max' => 'Điểm Phần 1 phải từ 0 đến 100.',
            'part2.required' => 'Điểm Phần 2 là bắt buộc.',
            'part2.numeric' => 'Điểm Phần 2 phải là số.',
            'part2.min' => 'Điểm Phần 2 phải từ 0 đến 100.',
            'part2.max' => 'Điểm Phần 2 phải từ 0 đến 100.',
            'part3.required' => 'Điểm Phần 3 là bắt buộc.',
            'part3.numeric' => 'Điểm Phần 3 phải là số.',
            'part3.min' => 'Điểm Phần 3 phải từ 0 đến 100.',
            'part3.max' => 'Điểm Phần 3 phải từ 0 đến 100.',
        ]);

        $config = \App\Models\Level::updateOrCreate(
            ['name' => $level],
            [
                'pass_threshold_part1' => $request->part1,
                'pass_threshold_part2' => $request->part2,
                'pass_threshold_part3' => $request->part3,
            ]
        );

        return back()->with('success', "Đã cập nhật ngưỡng điểm cho trình độ $level");
    }

    /**
     * Display learning path for current level
     */
    public function target()
    {
        return $this->index();
    }

    /**
     * Display the overall learning path for students
     */
    public function index()
    {
        $user = Auth::user();
        $progressData = [];
        $levelConfigs = \App\Models\Level::all()->keyBy('name');

        foreach (self::LEVELS as $level) {
            $levelConfig = $levelConfigs[$level] ?? null;
            $thresholds = [
                1 => $levelConfig->pass_threshold_part1 ?? 60,
                2 => $levelConfig->pass_threshold_part2 ?? 75,
                3 => $levelConfig->pass_threshold_part3 ?? 90,
            ];

            $progressData[$level] = [
                'part1' => array_merge(self::getPartProgress($user, $level, 1), ['unlocked' => $this->isPartUnlocked($user, $level, 1, $thresholds)]),
                'part2' => array_merge(self::getPartProgress($user, $level, 2), ['unlocked' => $this->isPartUnlocked($user, $level, 2, $thresholds)]),
                'part3' => array_merge(self::getPartProgress($user, $level, 3), ['unlocked' => $this->isPartUnlocked($user, $level, 3, $thresholds)]),
            ];
        }

        return Inertia::render('Path/Index', [
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
        $levelConfig = \App\Models\Level::where('name', $level)->first();

        $thresholds = [
            1 => $levelConfig->pass_threshold_part1 ?? 60,
            2 => $levelConfig->pass_threshold_part2 ?? 75,
            3 => $levelConfig->pass_threshold_part3 ?? 90,
        ];

        return [
            1 => [
                'name' => 'Part 1',
                'pass_score' => $thresholds[1],
                'tests' => $this->mapTestsForPart($level, 1),
                'first_test_id' => Test::where('level', $level)->where('part', 1)->first()?->id,
                'unlocked' => true,
                'progress' => $this->getPartProgress($user, $level, 1),
            ],
            2 => [
                'name' => 'Part 2',
                'pass_score' => $thresholds[2],
                'tests' => $this->mapTestsForPart($level, 2),
                'first_test_id' => Test::where('level', $level)->where('part', 2)->first()?->id,
                'unlocked' => $this->isPartUnlocked($user, $level, 2, $thresholds),
                'progress' => $this->getPartProgress($user, $level, 2),
            ],
            3 => [
                'name' => 'Part 3',
                'pass_score' => $thresholds[3],
                'tests' => $this->mapTestsForPart($level, 3),
                'first_test_id' => Test::where('level', $level)->where('part', 3)->first()?->id,
                'unlocked' => $this->isPartUnlocked($user, $level, 3, $thresholds),
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
    private function getPartProgress($user, string $level, int $part): array
    {
        $progress = \App\Models\Progress::where('user_id', $user->id)
            ->where('level', $level)
            ->where('part', $part)
            ->first();

        $percent = $this->resolveProgressPercent($progress);

        return [
            'score' => $percent,
            'completed' => $progress->is_passed ?? false,
        ];
    }

    /**
     * Check if part is unlocked
     */
    private function isPartUnlocked($user, string $level, int $part, array $thresholds): bool
    {
        // Người dùng đã chọn level mục tiêu thì Part 1 luôn mở.
        if ($part === 1) {
            return true;
        }

        // Part 2 và 3 cần Part trước đó của cùng level đạt điểm
        $previousPart = $part - 1;
        $progress = \App\Models\Progress::where('user_id', $user->id)
            ->where('level', $level)
            ->where('part', $previousPart)
            ->first();

        if (! $progress) {
            return false;
        }

        return $this->resolveProgressPercent($progress) >= ($thresholds[$previousPart] ?? 60);
    }

    private function resolveProgressPercent(?\App\Models\Progress $progress): float
    {
        if (! $progress) {
            return 0.0;
        }

        $raw = $progress->percentage ?? $progress->score ?? 0;
        return (float) max(0, min(100, $raw));
    }
}
