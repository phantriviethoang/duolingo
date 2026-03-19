<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\Test;
use App\Models\TestQuestion;
use App\Models\TestResult;
use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Database\Seeder;

class TestResultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Tạo TestResult cho mỗi section, không phải toàn bộ test
     * Mô phỏng user làm từng section một
     */
    public function run(): void
    {
        $users = User::with('userProgress')->get();

        foreach ($users as $user) {
            $tests = Test::with('sections')->get();

            foreach ($tests as $test) {
                // Tạo user progress nếu chưa có
                $userProgress = $user->userProgress()
                    ->where('exam_id', $test->id)
                    ->firstOrCreate([
                        'exam_id' => $test->id,
                    ], [
                        'last_completed_section_order' => 0,
                        'is_completed' => false,
                        'started_at' => now(),
                    ]);

                // Tạo result cho mỗi section
                $lastPassedOrder = 0;
                foreach ($test->sections as $section) {
                    $questions = $section->questions()->get();
                    $totalQuestions = $questions->count();

                    if ($totalQuestions === 0) {
                        continue;
                    }

                    // Mô phỏng: user trả lời ngẫu nhiên, ~70% đúng
                    $correctCount = (int) round($totalQuestions * 0.7);
                    $percentage = ($correctCount / $totalQuestions);

                    // Kiểm tra pass threshold (có coi high-quality không)
                    $passThreshold = $section->pass_threshold;
                    if ($test->is_high_quality) {
                        $passThreshold = min($passThreshold * 1.2, 1.0);
                    }

                    $passed = $percentage >= $passThreshold;

                    TestResult::create([
                        'user_id' => $user->id,
                        'test_id' => $test->id,
                        'section_id' => $section->id,
                        'total_questions' => $totalQuestions,
                        'correct_answers' => $correctCount,
                        'score' => $percentage * 100,
                        'time_spent' => rand(60, 300),
                        'user_answer' => [],
                        'completed_at' => now(),
                    ]);

                    // Nếu pass, cập nhật progress
                    if ($passed) {
                        $lastPassedOrder = $section->order;
                    }
                }

                // Cập nhật UserProgress theo kết quả
                if ($lastPassedOrder > 0) {
                    $isLastSection = $lastPassedOrder === $test->sections->count();
                    $userProgress->update([
                        'last_completed_section_order' => $lastPassedOrder,
                        'is_completed' => $isLastSection,
                        'completed_at' => $isLastSection ? now() : null,
                    ]);
                }
            }
        }
    }
}
