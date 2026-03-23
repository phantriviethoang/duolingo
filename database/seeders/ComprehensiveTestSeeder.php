<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\Question;
use App\Models\Answer;
use App\Traits\HasQuestionBank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * ComprehensiveTestSeeder
 *
 * Tạo dữ liệu test hoàn chỉnh cho hệ thống:
 * - 6 levels: A1, A2, B1, B2, C1, C2
 * - Mỗi level có 3 parts
 * - 2-3 tests per part (dễ, trung bình, khó)
 * - Sử dụng câu hỏi thực từ HasQuestionBank
 */
class ComprehensiveTestSeeder extends Seeder
{
    use HasQuestionBank, WithoutModelEvents;

    public function run(): void
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $testDifficulties = ['Easy', 'Medium', 'Hard'];

        $partConfigs = [
            1 => ['question_count' => 10, 'duration' => 10],
            2 => ['question_count' => 15, 'duration' => 15],
            3 => ['question_count' => 20, 'duration' => 20],
        ];

        foreach ($levels as $levelIndex => $level) {
            foreach ([1, 2, 3] as $part) {
                $config = $partConfigs[$part];

                // Tạo 3 tests cho mỗi part (Easy, Medium, Hard)
                foreach ($testDifficulties as $diffIndex => $difficulty) {
                    $testNum = $part + ($diffIndex * 3);

                    $test = Test::updateOrCreate(
                        [
                            'level' => $level,
                            'part' => $part,
                            'title' => "$level - Part $part - $difficulty Test",
                        ],
                        [
                            'description' => "Assessment test for $level Part $part ($difficulty difficulty)",
                            'total_questions' => $config['question_count'],
                            'duration' => $config['duration'],
                            'is_active' => true,
                            'attempts' => 0,
                        ]
                    );

                    // Xóa các part và question cũ
                    $test->parts()->delete();
                    $test->questions()->detach();

                    // Tạo test_part
                    $test->parts()->create([
                        'part_number' => $part,
                        'question_count' => $config['question_count'],
                        'duration' => $config['duration'],
                        'is_active' => true,
                    ]);

                    // Tạo các câu hỏi từ question bank
                    $questionBank = $this->getQuestionBank();
                    $bankCount = count($questionBank);

                    for ($qIdx = 0; $qIdx < $config['question_count']; $qIdx++) {
                        // Chọn câu hỏi từ bank (loop qua các câu)
                        $bankQuestion = $questionBank[$qIdx % $bankCount];

                        // Tạo hoặc lấy câu hỏi
                        $question = Question::updateOrCreate(
                            [
                                'level' => $level,
                                'part_number' => $part,
                                'question_text' => $bankQuestion['question'],
                                'order' => $qIdx + 1,
                            ],
                            [
                                'translation' => $bankQuestion['translation'] ?? null,
                                'explanation' => $bankQuestion['explanation'] ?? null,
                                'detailed_explanation' => $bankQuestion['detailed_explanation'] ?? null,
                            ]
                        );

                        // Tạo các đáp án nếu chưa tồn tại
                        if ($question->answers()->count() === 0) {
                            foreach ($bankQuestion['options'] as $optionIndex => $optionText) {
                                Answer::create([
                                    'question_id' => $question->id,
                                    'answer_text' => $optionText,
                                    'is_correct' => $optionIndex === $bankQuestion['correct'],
                                ]);
                            }
                        }

                        // Gắn câu hỏi vào test (tránh duplicate)
                        if (!$test->questions()->where('question_id', $question->id)->exists()) {
                            $test->questions()->attach($question->id, [
                                'order' => $qIdx + 1,
                            ]);
                        }
                    }

                    echo "✓ Created Test: $level - Part $part - $difficulty ({$config['question_count']} questions)\n";
                }
            }
        }

        echo "\n✓ Comprehensive test seeding completed!\n";
        echo "   Total Tests: " . Test::count() . "\n";
        echo "   Total Questions: " . Question::count() . "\n";
        echo "   Total Answers: " . Answer::count() . "\n";
    }
}
