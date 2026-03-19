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

        // Lấy tất cả các level với số lượng exams, sắp xếp theo order
        $levels = Level::with([
            'exams' => function ($query) {
                $query->select('id', 'level_id', 'title', 'description', 'duration', 'total_questions', 'is_active', 'is_high_quality', 'difficulty_score');
            }
        ])->orderBy('order')->get();

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

            // Tính is_locked (Part có bị khóa không)
            $isLocked = $level->getIsLockedFor($user);

            return [
                'id' => $level->id,
                'name' => $level->name,
                'order' => $level->order,
                'description' => $level->description,
                'pass_threshold' => $user->is_high_quality ? $level->adjusted_pass_threshold : $level->pass_threshold,
                'total_exams' => $examsCount,
                'completed_exams' => $completedCount,
                'in_progress_exams' => $inProgressCount,
                'progress_percent' => $examsCount > 0 ? round(($completedCount / $examsCount) * 100) : 0,
                'is_locked' => $isLocked, // ← Quan trọng: truyền qua Inertia
                'status' => $isLocked ? 'locked' : ($completedCount < $examsCount ? 'in-progress' : 'completed'),
            ];
        });

        return inertia('Exams/Roadmap', [
            'levels' => $levels,
            'user_is_high_quality' => $user->is_high_quality,
            'user_target_part' => $user->target_part_id,
        ]);
    }
}
