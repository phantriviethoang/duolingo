<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Test;
use App\Models\TestResult;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $stats = [
            ['label' => 'Tổng số người dùng', 'value' => User::count()],
            ['label' => 'Tổng đề thi', 'value' => Test::count()],
            ['label' => 'Tổng bài làm', 'value' => TestResult::count()],
            ['label' => 'Đề thi đang mở', 'value' => Test::where('is_active', true)->count()],
        ];

        $recentResults = TestResult::query()
            ->with(['test:id,title,duration', 'user:id,name'])
            ->orderByDesc('completed_at')
            ->limit(6)
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->id,
                    'user' => $result->user?->name ?? 'Người dùng',
                    'test' => $result->test?->title ?? 'Đề thi',
                    'score' => $result->score,
                    'duration' => $result->test?->duration,
                    'completed_at' => optional($result->completed_at)->format('d/m/Y') ?? '',
                ];
            })
            ->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentResults' => $recentResults,
        ]);
    }
}
