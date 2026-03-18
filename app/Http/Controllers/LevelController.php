<?php

namespace App\Http\Controllers;

use App\Models\Level;

class LevelController extends Controller
{
    /**
     * Hiển thị danh sách các cấp độ
     * Mỗi cấp độ có số đề, số bài thành công/thất bại
     */
    public function index()
    {
        $user = auth()->user();

        // Lấy tất cả các level với số lượng exams
        $levels = Level::with([
            'exams' => function ($query) {
                $query->select('id', 'level_id', 'name');
            }
        ])->get();

        // Thêm thông tin tiến độ người dùng cho mỗi level
        $levels = $levels->map(function ($level) use ($user) {
            $examsCount = $level->exams->count();

            // Đếm exams đã hoàn thành
            $completedCount = $level->exams()
                ->whereHas('userProgress', function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->where('is_completed', true);
                })
                ->count();

            // Đếm exams đang làm
            $inProgressCount = $level->exams()
                ->whereHas('userProgress', function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->where('is_completed', false);
                })
                ->count();

            return [
                'id' => $level->id,
                'name' => $level->name,
                'description' => $level->description,
                'total_exams' => $examsCount,
                'completed_exams' => $completedCount,
                'in_progress_exams' => $inProgressCount,
                'progress_percent' => $examsCount > 0 ? round(($completedCount / $examsCount) * 100) : 0,
            ];
        });

        return inertia('Exams/Levels', [
            'levels' => $levels,
        ]);
    }
}
