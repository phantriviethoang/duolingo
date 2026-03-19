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

        // Lấy tất cả các level thuộc target_level của user (thường là 3 parts), sắp xếp theo thứ tự
        $levels = Level::where('target_level', $user->target_level ?? 'A1')
            ->with([
            'exams' => function ($query) {
                $query->select('id', 'level_id', 'title', 'description', 'duration', 'total_questions', 'is_active', 'is_high_quality', 'difficulty_score');
            }
        ])->orderBy('order')->get();

        // Lấy ngưỡng điểm của user dựa vào target_level (50/70/90)
        $userPassThreshold = $user->getPassThreshold();

        // Thêm thông tin tiến độ người dùng cho mỗi level
        $levels = $levels->map(function ($level) use ($user, $userPassThreshold) {
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
            // Logic: Part N chỉ mở nếu Part N-1 đã pass (và Part 1 luôn mở)
            $isLocked = $level->getIsLockedFor($user);

            // Tính số câu cần đúng để pass Part này
            // scoreNeeded = (pass_threshold / 100) * total_questions
            $totalQuestions = $level->exams->sum('total_questions');
            $scoreNeeded = $totalQuestions > 0
                ? ceil(($userPassThreshold / 100) * $totalQuestions)
                : 0;

            return [
                'id' => $level->id,
                'name' => $level->name,
                'order' => $level->order,
                'description' => $level->description,
                'pass_threshold' => $userPassThreshold, // ← Dùng user.target_level thay vì level.pass_threshold
                'total_exams' => $examsCount,
                'completed_exams' => $completedCount,
                'in_progress_exams' => $inProgressCount,
                'progress_percent' => $examsCount > 0 ? round(($completedCount / $examsCount) * 100) : 0,
                'is_locked' => $isLocked, // ← Quan trọng: truyền qua Inertia
                'status' => $isLocked ? 'locked' : ($completedCount < $examsCount ? 'in-progress' : 'completed'),
                'score_needed' => $scoreNeeded, // ← Số câu cần đúng để pass phần này
            ];
        });

        return inertia('Exams/Roadmap', [
            'levels' => $levels,
            'user_is_high_quality' => $user->is_high_quality,
            'user_target_part' => $user->target_part_id,
            'user_pass_threshold' => $userPassThreshold, // ← Truyền ngưỡng điểm của user
        ]);
    }
}
