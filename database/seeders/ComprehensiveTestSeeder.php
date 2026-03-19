<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\Question;
use App\Models\Answer;
use App\Traits\HasQuestionBank;
use Illuminate\Database\Seeder;

/**
 * ComprehensiveTestSeeder
 *
 * Tạo dữ liệu test hoàn chỉnh cho hệ thống:
 * - 6 levels: A1, A2, B1, B2, C1, C2
 * - A1: 1 part, các level còn lại: 3 parts
 * - 1 test per part
 * - 10 questions per test with 4 answers each
 */
class ComprehensiveTestSeeder extends Seeder
{
    use HasQuestionBank;

    public function run(): void
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $questionBank = $this->getQuestionBank();
        $questionsPerTest = count($questionBank);

        foreach ($levels as $level) {
            // Level A1 chỉ có 1 part
            $partsForLevel = ($level === 'A1') ? [1] : [1, 2, 3];

            foreach ($partsForLevel as $part) {
                // Chỉ tạo 1 test cho mỗi part
                $test = Test::create([
                    'title' => "$level - Part $part - Test 1",
                    'description' => "Assessment test for $level - Part $part",
                    'duration' => 30,
                    'level' => $level,
                    'part' => $part,
                    'total_questions' => $questionsPerTest,
                    'is_active' => true,
                ]);

                // Tạo câu hỏi dựa trên question bank dùng chung
                $shuffledBank = $questionBank;
                shuffle($shuffledBank);

                foreach ($shuffledBank as $qIdx => $item) {
                    $question = Question::create([
                        'test_id' => $test->id,
                        'question_text' => $item['question'],
                        'question_type' => 'multiple_choice',
                        'order' => $qIdx + 1,
                        'translation' => $item['translation'] ?? null,
                        'explanation' => $item['explanation'] ?? null,
                        'detailed_explanation' => $item['detailed_explanation'] ?? null,
                    ]);

                    foreach (($item['options'] ?? []) as $aIdx => $optionText) {
                        Answer::create([
                            'question_id' => $question->id,
                            'answer_text' => $optionText,
                            'is_correct' => $aIdx === ($item['correct'] ?? -1),
                        ]);
                    }
                }
            }
        }
    }
}
