<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\TestResult;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Hiển thị Dashboard tiến độ với % hoàn thành lộ trình
     */
    public function index()
    {
        $user = auth()->user();

        // Lấy tất cả levels với progress của user
        $levels = Level::with([
            'exams' => function ($query) {
                $query->select('id', 'level_id', 'title', 'description', 'duration', 'total_questions', 'is_active');
            }
        ])->get();

        // Tính progress cho mỗi level
        $levelsProgress = $levels->map(function ($level) use ($user) {
            $exams = $level->exams;
            $totalExams = $exams->count();

            // Lấy results của user cho exams trong level này
            $results = TestResult::query()
                ->where('user_id', $user->id)
                ->whereIn('test_id', $exams->pluck('id'))
                ->get()
                ->groupBy('test_id');

            // Đếm exams đã hoàn thành và passed
            $completedExams = 0;
            $passedExams = 0;

            foreach ($exams as $exam) {
                if ($results->has($exam->id)) {
                    $completedExams++;
                    $bestScore = $results->get($exam->id)->max('score');
                    if ($bestScore >= 70) {
                        $passedExams++;
                    }
                }
            }

            $progressPercent = $totalExams > 0 ? round(($completedExams / $totalExams) * 100) : 0;

            return [
                'id' => $level->id,
                'name' => $level->name,
                'description' => $level->description,
                'total_exams' => $totalExams,
                'completed_exams' => $completedExams,
                'passed_exams' => $passedExams,
                'progress_percent' => $progressPercent,
            ];
        });

        // Tính stats tổng
        $totalCompletedExams = $levelsProgress->sum('completed_exams');
        $totalPassedExams = $levelsProgress->sum('passed_exams');
        $averageProgress = $levelsProgress->avg('progress_percent');

        // Lấy recent results
        $recentResults = TestResult::query()
            ->where('user_id', $user->id)
            ->with('test')
            ->orderByDesc('completed_at')
            ->take(5)
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->id,
                    'test_title' => $result->test->title,
                    'score' => $result->score,
                    'completed_at' => $result->completed_at?->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Dashboard', [
            'levels' => $levelsProgress,
            'stats' => [
                'total_completed' => $totalCompletedExams,
                'total_passed' => $totalPassedExams,
                'average_progress' => round($averageProgress),
            ],
            'recent_results' => $recentResults,
        ]);
    }
}
