<?php

namespace Database\Seeders;

use App\Models\Level;
use App\Models\Test;
use App\Models\Section;
use App\Models\TestQuestion;
use App\Traits\HasQuestionBank;
use Illuminate\Database\Seeder;

/**
 * ComprehensiveTestSeeder
 *
 * Tạo dữ liệu test hoàn chỉnh cho hệ thống:
 * - 3 levels: B1, B2, C1
 * - 3-4 tests per level
 * - 2 sections per test
 * - 10 questions per section
 */
class ComprehensiveTestSeeder extends Seeder
{
    use HasQuestionBank;
    public function run(): void
    {
        $targetLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

        foreach ($targetLevels as $tl) {
            for ($part = 1; $part <= 3; $part++) {
                // Tạo 3 phần (Parts) cho mỗi target_level
                $level = Level::firstOrCreate(
                    [
                        'target_level' => $tl,
                        'order' => $part
                    ],
                    [
                        'name' => "Phần $part",
                        'description' => "Nội dung học $tl - Phần $part",
                        'pass_threshold' => 0.5,
                    ]
                );

                // Tạo tự động N Test exams cho Phần này (ví dụ mỗi Phần có 2 bài thi)
                for ($examIdx = 1; $examIdx <= 2; $examIdx++) {
                    $this->createTestWithSections($level, [
                        'title' => "$tl - Bài kiểm tra Phần $part - Đề $examIdx",
                        'description' => "Đánh giá năng lực $tl - Phần $part - Mã đề $examIdx",
                        'duration' => 30 + ($examIdx * 5),
                        'total_questions' => 20,
                        'difficulty_score' => $part * 2 + $examIdx,
                        'is_high_quality' => ($part == 3 && $examIdx == 2), // Đề cuối phần cuối là chất lượng cao
                    ]);
                }
            }
        }

        $this->command->info('✅ Lộ trình cá nhân hóa (6 cấp x 3 phần) created successfully!');
    }

    /**
     * Tạo một test với 2 sections và các questions
     */
    private function createTestWithSections(Level $level, array $testData): void
    {
        // Tạo test
        $test = Test::updateOrCreate(
            ['title' => $testData['title'], 'level_id' => $level->id],
            [
                'description' => $testData['description'],
                'duration' => $testData['duration'],
                'total_questions' => $testData['total_questions'],
                'difficulty_score' => $testData['difficulty_score'],
                'is_high_quality' => $testData['is_high_quality'],
                'is_active' => true,
            ]
        );

        // Xóa sections + questions cũ
        $test->sections()->delete();

        // Tạo 2 sections
        $questionsPerSection = intval($testData['total_questions'] / 2);

        for ($sectionOrder = 1; $sectionOrder <= 2; $sectionOrder++) {
            $section = Section::create([
                'test_id' => $test->id,
                'order' => $sectionOrder,
                'pass_threshold' => 0.7, // 70% yêu cầu
            ]);

            // Tạo 10 questions per section từ bộ ngân hàng câu hỏi
            for ($i = 1; $i <= $questionsPerSection; $i++) {
                $questionData = $this->getRandomQuestion();

                TestQuestion::create([
                    'test_id' => $test->id,
                    'section_id' => $section->id,
                    'question' => $questionData['question'],
                    'translation' => $questionData['translation'],
                    'options' => $questionData['options'],
                    'correct_option_id' => $questionData['correct_option_id'],
                    'explanation' => $questionData['explanation'],
                    'detailed_explanation' => $questionData['detailed_explanation'],
                ]);
            }
        }
    }
}
