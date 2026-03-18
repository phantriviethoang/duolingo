<?php

namespace Database\Seeders;

use App\Models\Level;
use App\Models\Test;
use App\Models\Section;
use App\Models\TestQuestion;
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
    public function run(): void
    {
        // Lấy hoặc tạo levels
        $b1 = Level::firstOrCreate(
            ['name' => 'B1'],
            ['description' => 'Tiếng Anh cơ bản']
        );

        $b2 = Level::firstOrCreate(
            ['name' => 'B2'],
            ['description' => 'Tiếng Anh trung cấp']
        );

        $c1 = Level::firstOrCreate(
            ['name' => 'C1'],
            ['description' => 'Tiếng Anh cao cấp']
        );

        // ============= B1 TESTS =============
        $this->createTestWithSections($b1, [
            'title' => 'B1 Test 1: Basic Skills',
            'description' => 'Kiểm tra ngữ pháp cơ bản, từ vựng đơn giản',
            'duration' => 30,
            'total_questions' => 20,
            'difficulty_score' => 2,
            'is_high_quality' => false,
        ]);

        $this->createTestWithSections($b1, [
            'title' => 'B1 Test 2: Communication',
            'description' => 'Kỹ năng giao tiếp và cách diễn đạt',
            'duration' => 35,
            'total_questions' => 20,
            'difficulty_score' => 2,
            'is_high_quality' => true, // High-quality test
        ]);

        $this->createTestWithSections($b1, [
            'title' => 'B1 Test 3: Reading Comprehension',
            'description' => 'Đọc hiểu các văn bản ngắn, trích đoạn',
            'duration' => 40,
            'total_questions' => 15,
            'difficulty_score' => 3,
            'is_high_quality' => false,
        ]);

        // ============= B2 TESTS =============
        $this->createTestWithSections($b2, [
            'title' => 'B2 Test 1: Advanced Grammar',
            'description' => 'Ngữ pháp tiếng Anh nâng cao',
            'duration' => 45,
            'total_questions' => 25,
            'difficulty_score' => 5,
            'is_high_quality' => false,
        ]);

        $this->createTestWithSections($b2, [
            'title' => 'B2 Test 2: Business English',
            'description' => 'Tiếng Anh trong môi trường công sở',
            'duration' => 50,
            'total_questions' => 25,
            'difficulty_score' => 6,
            'is_high_quality' => true,
        ]);

        $this->createTestWithSections($b2, [
            'title' => 'B2 Test 3: Listening & Speaking',
            'description' => 'Nghe hiểu và nói tiếng Anh thành thạo',
            'duration' => 55,
            'total_questions' => 30,
            'difficulty_score' => 6,
            'is_high_quality' => false,
        ]);

        // ============= C1 TESTS =============
        $this->createTestWithSections($c1, [
            'title' => 'C1 Test 1: Mastery Level',
            'description' => 'Trình độ thành thạo, các chủ đề phức tạp',
            'duration' => 60,
            'total_questions' => 35,
            'difficulty_score' => 8,
            'is_high_quality' => false,
        ]);

        $this->createTestWithSections($c1, [
            'title' => 'C1 Test 2: Academic English',
            'description' => 'Tiếng Anh học thuật, các tài liệu chuyên sâu',
            'duration' => 75,
            'total_questions' => 40,
            'difficulty_score' => 9,
            'is_high_quality' => true,
        ]);

        $this->createTestWithSections($c1, [
            'title' => 'C1 Test 3: Proficiency Test',
            'description' => 'Bài thi trình độ cao nhất, content chuyên nghiệp',
            'duration' => 90,
            'total_questions' => 50,
            'difficulty_score' => 10,
            'is_high_quality' => true,
        ]);

        $this->command->info('✅ Comprehensive test data created successfully!');
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

            // Tạo 10 questions per section
            for ($i = 1; $i <= $questionsPerSection; $i++) {
                TestQuestion::create([
                    'test_id' => $test->id,
                    'section_id' => $section->id,
                    'question' => "Question {$i} from Section {$sectionOrder} of {$test->title}",
                    'translation' => "Câu {$i} từ Phần {$sectionOrder}",
                    'options' => [
                        'A' => 'Option A - ' . $this->randomText(),
                        'B' => 'Option B - ' . $this->randomText(),
                        'C' => 'Option C - ' . $this->randomText(),
                        'D' => 'Option D - ' . $this->randomText(),
                    ],
                    'correct_option_id' => collect(['A', 'B', 'C', 'D'])->random(),
                    'explanation' => 'This is the correct answer because...',
                    'detailed_explanation' => 'Additional context and explanation for deeper understanding.',
                ]);
            }
        }
    }

    /**
     * Generate random text for options
     */
    private function randomText(): string
    {
        $texts = [
            'common practice',
            'best approach',
            'standard method',
            'traditional way',
            'modern technique',
            'advanced skill',
            'basic understanding',
        ];

        return collect($texts)->random();
    }
}
