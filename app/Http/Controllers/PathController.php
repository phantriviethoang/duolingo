<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestPart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class PathController extends Controller
{
    private const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    private const FALLBACK_PARTS = [1];

    /**
     * Admin view for managing the learning path structure
     */
    public function adminIndex()
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $pathData = [];
        $levelConfigs = \App\Models\Level::all()->keyBy('name');

        foreach ($levels as $level) {
            $partCounts = collect();
            if ($this->usesTestPartsTable()) {
                $partCounts = TestPart::query()
                    ->whereHas('test', function ($query) use ($level) {
                        $query->where('level', $level);
                    })
                    ->selectRaw('part_number, COUNT(*) as total')
                    ->groupBy('part_number')
                    ->pluck('total', 'part_number');
            }

            $questionCounts = \App\Models\Question::where('level', $level)
                ->selectRaw('part_number, COUNT(*) as total')
                ->groupBy('part_number')
                ->pluck('total', 'part_number');

            $maxTestPart = max(1, $partCounts->keys()->max() ?? 1, \App\Models\Test::where('level', $level)->max('part') ?? 1);
            $maxQuestionPart = max(1, $questionCounts->keys()->max() ?? 1);
            $maxPart = max($maxTestPart, $maxQuestionPart, 3); // Ensure at least 3 parts show up

            $partsData = [];
            for ($i = 1; $i <= $maxPart; $i++) {
                $partsData["part{$i}"] = (int) ($partCounts[$i] ?? Test::where('level', $level)->where('part', $i)->count());
                $partsData["q_part{$i}"] = (int) ($questionCounts[$i] ?? 0);
            }

            $pathData[$level] = array_merge($partsData, [
                'max_part' => $maxPart,
                'config' => $levelConfigs[$level] ?? [
                    'pass_threshold_part1' => 60,
                    'pass_threshold_part2' => 75,
                    'pass_threshold_part3' => 90,
                ],
            ]);
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
     * Display selection for initial targets (goal score: 50, 70, 90)
     */
    public function target()
    {
        $user = Auth::user();

        return Inertia::render('Path/Target', [
            'goal_score' => $user->goal_score ?? 50,
        ]);
    }

    /**
     * Update user's goal score
     */
    public function saveTarget(Request $request)
    {
        $request->validate([
            'goal_score' => 'required|in:50,70,90',
        ]);

        $user = Auth::user();
        $user->update(['goal_score' => (int) $request->goal_score]);

        return redirect()->route('path.levels')->with('success', 'Mục tiêu học tập đã được cập nhật.');
    }

    /**
     * Display the overall learning path for students
     */
    public function index()
    {
        $user = Auth::user();
        $progressData = [];
        $levelConfigs = \App\Models\Level::all()->keyBy('name');

        $targetPartCounts = $user->target_part_counts ?? [];

        foreach (self::LEVELS as $level) {
            $progressParts = \App\Models\Progress::where('user_id', $user->id)
                ->where('level', $level)
                ->select('part')
                ->distinct()
                ->orderBy('part')
                ->pluck('part')
                ->map(fn ($part) => (int) $part)
                ->toArray();

            $targetCount = $targetPartCounts[$level] ?? 0;
            $targetParts = $targetCount > 0 ? range(1, $targetCount) : [];

            // Combine both target parts and progress parts, prioritize distinct part numbers
            $parts = collect(array_merge($progressParts, $targetParts))
                        ->unique()
                        ->sort()
                        ->values()
                        ->toArray();

            $levelConfig = $levelConfigs[$level] ?? null;
            $thresholds = $this->buildThresholds($levelConfig, $parts);

            $progressData[$level] = collect($parts)
                ->mapWithKeys(function (int $part) use ($user, $level, $parts, $thresholds) {
                    return [
                        'part' . $part => array_merge(
                            $this->getPartProgress($user, $level, $part),
                            ['unlocked' => $this->isPartUnlocked($user, $level, $part, $parts, $thresholds)]
                        ),
                    ];
                })
                ->toArray();
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
     * Update user's target level (A1, A2, ...)
     */
    public function saveLevel(Request $request)
    {
        $request->validate([
            'target_level' => 'required|in:A1,A2,B1,B2,C1,C2',
        ]);

        $user = Auth::user();
        $user->update(['target_level' => $request->target_level]);

        return redirect()->route('path.levels')->with('success', 'Trình độ mục tiêu đã được lưu lại.');
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

        // Lưu trình độ hiện tại khi user truy cập vào /path/{level}
        $user->update(['current_level' => $level]);

        $parts = $this->buildPartsData($user, $level);

        $counts = $user->target_part_counts ?? [];

        return Inertia::render('Path/Show', [
            'level' => $level,
            'parts' => $parts,
            'selectedPart' => null, // Luôn hiển thị giao diện chọn part
            'targetPartCount' => $counts[$level] ?? null, // Số lượng phần theo phân vùng level
        ]);
    }

    /**
     * Update user's target part count
     */
    public function savePartCount(Request $request)
    {
        $request->validate([
            'count' => 'required|integer|min:1|max:50',
            'level' => 'required|in:A1,A2,B1,B2,C1,C2',
        ]);

        $user = Auth::user();
        $counts = $user->target_part_counts ?? [];
        $counts[$request->level] = (int) $request->count;

        $user->update([
            'target_part_count' => (int) $request->count, // Keep for backward compat
            'target_part_counts' => $counts
        ]);

        return back()->with('success', 'Đã lưu số lượng phần thi mong muốn.');
    }

    /**
     * Show tests list for selected part in a level.
     */
    public function tests($level, $part)
    {
        $user = Auth::user();
        $part = (int) $part;
        $parts = $this->getAvailableParts($level);

        if (! in_array($level, self::LEVELS, true) || ! in_array($part, $parts, true)) {
            abort(404);
        }

        // Lưu lại phần (part) hiện tại khi user chọn
        $user->update([
            'current_level' => $level,
            'current_part' => $part
        ]);

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
        $parts = $this->getAvailableParts($level);
        $thresholds = $this->buildThresholds($levelConfig, $parts);

        return collect($parts)
            ->mapWithKeys(function (int $part) use ($user, $level, $parts, $thresholds) {
                return [
                    $part => [
                        'name' => 'Part ' . $part,
                        'pass_score' => $thresholds[$part] ?? 60.0,
                        'tests' => $this->mapTestsForPart($level, $part),
                        'first_test_id' => $this->resolveFirstTestId($level, $part),
                        'unlocked' => $this->isPartUnlocked($user, $level, $part, $parts, $thresholds),
                        'progress' => $this->getPartProgress($user, $level, $part),
                    ],
                ];
            })
            ->toArray();
    }

    private function mapTestsForPart(string $level, int $part)
    {
        if (! $this->usesTestPartsTable()) {
            return Test::where('level', $level)
                ->where('part', $part)
                ->get()
                ->map(function (Test $test) use ($part) {
                    return [
                        'id' => $test->id,
                        'title' => $test->title,
                        'description' => $test->description,
                        'duration' => $test->configuredDuration($part),
                        'level' => $test->level,
                        'part' => $part,
                        'total_questions' => $test->configuredQuestionCount($part),
                    ];
                })
                ->values();
        }

        $testParts = TestPart::query()
            ->with('test')
            ->where('part_number', $part)
            ->where('is_active', true)
            ->whereHas('test', function ($query) use ($level) {
                $query->where('level', $level)->where('is_active', true);
            })
            ->orderBy('test_id')
            ->get();

        if ($testParts->isEmpty()) {
            return Test::where('level', $level)
                ->where('part', $part)
                ->get()
                ->map(function (Test $test) use ($part) {
                    return [
                        'id' => $test->id,
                        'title' => $test->title,
                        'description' => $test->description,
                        'duration' => $test->configuredDuration($part),
                        'level' => $test->level,
                        'part' => $part,
                        'total_questions' => $test->configuredQuestionCount($part),
                    ];
                })
                ->values();
        }

        return $testParts
            ->map(function (TestPart $testPart) {
                $test = $testPart->test;
                if (! $test) {
                    return null;
                }

                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                    'duration' => (int) $testPart->duration,
                    'level' => $test->level,
                    'part' => (int) $testPart->part_number,
                    'total_questions' => (int) $testPart->question_count,
                ];
            })
            ->filter()
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

        $lastResult = \App\Models\Result::where('user_id', $user->id)
            ->whereNotNull('custom_pass_threshold')
            ->latest('id')
            ->first();

        $percent = $this->resolveProgressPercent($progress);

        return [
            'score' => $percent,
            'completed' => $progress->is_passed ?? false,
            'custom_pass_threshold' => $lastResult?->custom_pass_threshold,
        ];
    }

    /**
     * Check if part is unlocked
     */
    private function isPartUnlocked($user, string $level, int $part, array $parts, array $thresholds): bool
    {
        $firstPart = $parts[0] ?? 1;
        if ($part === $firstPart) {
            return true;
        }

        $currentIndex = array_search($part, $parts, true);
        if ($currentIndex === false || $currentIndex === 0) {
            return false;
        }

        $previousPart = $parts[$currentIndex - 1];
        $progress = \App\Models\Progress::where('user_id', $user->id)
            ->where('level', $level)
            ->where('part', $previousPart)
            ->first();

        if (! $progress) {
            return false;
        }

        return $progress->is_passed ?? false;
    }

    private function getAvailableParts(string $level): array
    {
        $parts = [];

        if ($this->usesTestPartsTable()) {
            $parts = TestPart::query()
                ->whereHas('test', function ($query) use ($level) {
                    $query->where('level', $level)->where('is_active', true);
                })
                ->where('is_active', true)
                ->select('part_number')
                ->distinct()
                ->orderBy('part_number')
                ->pluck('part_number')
                ->map(fn ($part) => (int) $part)
                ->filter(fn (int $part) => $part > 0)
                ->values()
                ->toArray();
        }

        if ($parts === []) {
            $parts = Test::where('level', $level)
                ->select('part')
                ->distinct()
                ->orderBy('part')
                ->pluck('part')
                ->map(fn ($part) => (int) $part)
                ->filter(fn (int $part) => $part > 0)
                ->values()
                ->toArray();
        }

        return $parts !== [] ? $parts : self::FALLBACK_PARTS;
    }

    private function resolveFirstTestId(string $level, int $part): ?int
    {
        if ($this->usesTestPartsTable()) {
            return TestPart::query()
                ->where('part_number', $part)
                ->whereHas('test', function ($query) use ($level) {
                    $query->where('level', $level)->where('is_active', true);
                })
                ->orderBy('test_id')
                ->first()?->test_id;
        }

        return Test::where('level', $level)
            ->where('part', $part)
            ->where('is_active', true)
            ->orderBy('id')
            ->first()?->id;
    }

    private function usesTestPartsTable(): bool
    {
        static $hasTable = null;

        if ($hasTable === null) {
            $hasTable = Schema::hasTable('test_parts');
        }

        return $hasTable;
    }

    private function buildThresholds(?\App\Models\Level $levelConfig, array $parts): array
    {
        return collect($parts)
            ->mapWithKeys(function (int $part) use ($levelConfig) {
                if (! $levelConfig) {
                    return [$part => 60.0];
                }

                $field = "pass_threshold_part{$part}";
                $value = data_get($levelConfig, $field);

                return [$part => (float) ($value ?? $levelConfig->pass_threshold ?? 60.0)];
            })
            ->toArray();
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
