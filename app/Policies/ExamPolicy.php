<?php

namespace App\Policies;

use App\Models\Test as Exam;
use App\Models\User;

/**
 * ExamPolicy
 *
 * Kiểm tra quyền của user trên các action liên quan đến exam
 */
class ExamPolicy
{
    /**
     * Người dùng có thể xem danh sách exams không?
     */
    public function viewAny(User $user): bool
    {
        // Tất cả users đã authenticated có thể xem danh sách
        return true;
    }

    /**
     * Người dùng có thể xem chi tiết exam không?
     */
    public function view(User $user, Exam $exam): bool
    {
        // Tất cả users có thể xem exam (không bảo vệ chi tiết)
        return true;
    }

    /**
     * Người dùng có thể vào phòng thi không?
     */
    public function take(User $user, Exam $exam): bool
    {
        // Tất cả users có thể vào làm bài
        // Nhưng BE sẽ kiểm tra:
        // - User progress có unlock section đó không
        // - User không cheat (verify answers)
        return true;
    }

    /**
     * Người dùng có thể nộp bài không?
     *
     * Kiểm tra:
     * - User có bắt đầu làm exam này chưa?
     * - User đang làm đúng section không?
     * - Thời gian nộp bài có hợp lệ không?
     */
    public function submitSection(User $user, Exam $exam): bool
    {
        // Kiểm tra user có user_progress cho exam này không
        $userProgress = $user->userProgress()
            ->where('exam_id', $exam->id)
            ->first();

        if (! $userProgress) {
            // Chưa bắt đầu làm, không thể nộp
            return false;
        }

        // Nếu đã hoàn thành, không thể nộp lại (tùy chọn)
        // Comment out nếu muốn cho phép làm lại
        // if ($userProgress->is_completed) {
        //     return false;
        // }

        return true;
    }

    /**
     * Người dùng có thể tiếp tục exam không?
     */
    public function resume(User $user, Exam $exam): bool
    {
        $userProgress = $user->userProgress()
            ->where('exam_id', $exam->id)
            ->first();

        // Chỉ có thể resume nếu đang làm (chưa hoàn thành)
        return $userProgress && ! $userProgress->is_completed;
    }

    /**
     * Admin có thể create exams không?
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Admin có thể update exam không?
     */
    public function update(User $user, Exam $exam): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Admin có thể delete exam không?
     */
    public function delete(User $user, Exam $exam): bool
    {
        return $user->hasRole('admin');
    }
}
