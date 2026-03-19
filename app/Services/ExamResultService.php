<?php

namespace App\Services;

use App\Models\Test as Exam;
use App\Models\TestResult;
use App\Models\UserProgress;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * ExamResultService
 *
 * Xử lý logic tính toán kết quả bài thi
 * Quản lý pass/fail, unlock phần tiếp theo, tính điểm
 */
class ExamResultService
{
    /**
     * Tính toán và lưu kết quả nộp bài
     *
     * @param Exam $exam
     * @param Authenticatable $user
     * @param int $sectionOrder
     * @param array $answers
     * @return array ['passed' => bool, 'score' => float, 'message' => string, ...]
     */
    public function submitSection(Exam $exam, Authenticatable $user, int $sectionOrder, array $answers): array
    {
        // Lấy section
        $section = $exam->sections()
            ->where('order', $sectionOrder)
            ->firstOrFail();

        // Lấy user progress
        $userProgress = $user->userProgress()
            ->where('exam_id', $exam->id)
            ->firstOrFail();

        // Kiểm tra xem user có phép làm section này không
        // Chỉ có thể làm section hiện tại hoặc section đã unlock
        if ($sectionOrder > $userProgress->last_completed_section_order + 1) {
            return [
                'passed' => false,
                'error' => 'Bạn chưa mở khóa section này. Vui lòng hoàn thành phần trước.',
                'error_code' => 'section_locked',
            ];
        }

        // Lấy tất cả questions của section
        $questions = $section->questions()->get();

        // Tính số câu đúng
        $correctCount = 0;
        $totalQuestions = $questions->count();

        foreach ($questions as $question) {
            $userAnswer = $answers[$question->id] ?? null;
            if ($userAnswer == $question->correct_option_id) {
                $correctCount++;
            }
        }

        // Tính phần trăm
        $percentage = $totalQuestions > 0 ? ($correctCount / $totalQuestions) : 0;

        // Lấy pass_threshold
        $passThreshold = $section->pass_threshold;

        // Nếu high-quality: nhân threshold với 1.2 (20% cao hơn)
        if ($exam->is_high_quality) {
            $passThreshold = $this->applyHighQualityMultiplier($passThreshold);
        }

        // Kiểm tra đạt hay không
        $passed = $percentage >= $passThreshold;

        // Lưu TestResult (section-level result)
        TestResult::create([
            'user_id' => $user->id,
            'test_id' => $exam->id,
            'section_id' => $section->id,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctCount,
            'time_spent' => 0, // Will be set by frontend if needed
        ]);

        // Chuẩn bị kết quả
        $result = [
            'passed' => $passed,
            'percentage' => round($percentage * 100, 2),
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'required_percentage' => round($passThreshold * 100, 2),
            'message' => $passed
                ? '🎉 Chúc mừng! Bạn đã đạt yêu cầu phần này.'
                : '❌ Bạn chưa đạt yêu cầu. Vui lòng làm lại phần này.',
        ];

        // Nếu pass: cập nhật progress
        if ($passed) {
            $userProgress->update([
                'last_completed_section_order' => $sectionOrder,
            ]);

            // Nếu là section cuối cùng
            $isLastSection = $sectionOrder == $exam->sections->count();
            if ($isLastSection) {
                $userProgress->update([
                    'is_completed' => true,
                    'completed_at' => now(),
                ]);

                $result['exam_completed'] = true;
                $result['next_section_unlocked'] = false;
            } else {
                $result['exam_completed'] = false;
                $result['next_section_unlocked'] = true;
            }
        }

        return $result;
    }

    /**
     * Áp dụng multiplier cho high-quality mode
     * Công thức: threshold * 1.2 (20% cao hơn)
     *
     * VD: 70% → 84%, 80% → 96%
     */
    private function applyHighQualityMultiplier(float $threshold): float
    {
        $multipliedThreshold = $threshold * 1.2;

        // Giới hạn max 100%
        return min($multipliedThreshold, 1.0);
    }

    /**
     * Tính thời gian còn lại cho high-quality exams
     * High-quality: 0.8x time (20% ít thời gian hơn)
     */
    public function calculateAdjustedDuration(Exam $exam, int $baseDuration): int
    {
        if ($exam->is_high_quality) {
            return (int) ceil($baseDuration * 0.8);
        }
        return $baseDuration;
    }

    /**
     * Lấy thống kê kết quả của user cho một exam
     */
    public function getExamStats(Exam $exam, Authenticatable $user): array
    {
        $userProgress = $user->userProgress()
            ->where('exam_id', $exam->id)
            ->first();

        if (! $userProgress) {
            return [
                'started' => false,
                'completed' => false,
                'sections_completed' => 0,
                'total_sections' => $exam->sections->count(),
            ];
        }

        return [
            'started' => true,
            'completed' => $userProgress->is_completed,
            'sections_completed' => $userProgress->last_completed_section_order,
            'total_sections' => $exam->sections->count(),
            'progress_percent' => round(
                ($userProgress->last_completed_section_order / $exam->sections->count()) * 100
            ),
            'started_at' => $userProgress->started_at?->format('d/m/Y H:i'),
            'completed_at' => $userProgress->completed_at?->format('d/m/Y H:i'),
        ];
    }
}
