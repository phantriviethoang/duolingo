<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Test;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $totalUsers = User::count();
        $totalTests = Test::count();
        $totalResults = Result::count();
        $avgScore = (float) Result::query()->avg('score');

        $passRate = 0.0;
        if ($totalResults > 0) {
            $passedCount = Result::query()->where('score', '>=', 60)->count();
            $passRate = ($passedCount / $totalResults) * 100;
        }

        $resultsByLevel = Result::query()
            ->join('tests', 'tests.id', '=', 'results.test_id')
            ->select('tests.level', DB::raw('COUNT(results.id) as attempts'), DB::raw('AVG(results.score) as avg_score'))
            ->groupBy('tests.level')
            ->orderBy('tests.level')
            ->get()
            ->map(function ($row) {
                return [
                    'level' => $row->level,
                    'attempts' => (int) $row->attempts,
                    'avg_score' => round((float) $row->avg_score, 1),
                ];
            })
            ->values()
            ->toArray();

        $recentDailyAttempts = Result::query()
            ->selectRaw('DATE(completed_at) as day, COUNT(*) as attempts')
            ->whereNotNull('completed_at')
            ->where('completed_at', '>=', now()->subDays(7))
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->map(fn ($row) => [
                'day' => $row->day,
                'attempts' => (int) $row->attempts,
            ])
            ->values()
            ->toArray();

        return Inertia::render('Admin/Analytics', [
            'overview' => [
                'total_users' => $totalUsers,
                'total_tests' => $totalTests,
                'total_results' => $totalResults,
                'avg_score' => round($avgScore, 1),
                'pass_rate' => round($passRate, 1),
            ],
            'resultsByLevel' => $resultsByLevel,
            'recentDailyAttempts' => $recentDailyAttempts,
        ]);
    }
}
