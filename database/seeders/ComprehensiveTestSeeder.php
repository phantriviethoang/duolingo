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
 * - Mỗi level có 3 part
 * - 1 test per part
 * - Số câu và thời gian theo cấu hình chuẩn của từng part
 */
class ComprehensiveTestSeeder extends Seeder
{
    use HasQuestionBank;

    public function run(): void
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

        foreach ($levels as $level) {
            $partsForLevel = [
                ['part_number' => 1, 'question_count' => 10, 'duration' => 10],
                ['part_number' => 2, 'question_count' => 15, 'duration' => 15],
                ['part_number' => 3, 'question_count' => 20, 'duration' => 20],
            ];

            $maxQuestionCount = collect($partsForLevel)->max('question_count');

            $test = Test::updateOrCreate(
                [
                    'level' => $level,
                    'title' => "$level - Comprehensive Test",
                ],
                [
                    'description' => "Assessment test for $level",
                    'total_questions' => $maxQuestionCount,
                    'is_active' => true,
                ]
            );

            $test->parts()->delete();
            $test->parts()->createMany($partsForLevel);

            // Reset question bank cho test này để luôn đảm bảo đủ và đúng số lượng.
            $test->questions()->delete();

            for ($qIdx = 1; $qIdx <= $maxQuestionCount; $qIdx++) {
                $item = $this->getRandomQuestion();

                $question = Question::create([
                    'level' => $level,
                    'part_number' => ceil($qIdx / ($maxQuestionCount / 3)),
                    'question_text' => $item['question_text'] ?? $item['question'],
                    'question_type' => 'multiple_choice',
                    'order' => $qIdx,
                    'translation' => $item['translation'] ?? null,
                    'explanation' => $item['explanation'] ?? null,
                    'detailed_explanation' => $item['detailed_explanation'] ?? null,
                ]);

                $question->tests()->attach($test->id, ['order' => $qIdx]);

                foreach (($item['answers'] ?? []) as $answer) {
                    Answer::create([
                        'question_id' => $question->id,
                        'answer_text' => $answer['answer_text'] ?? '',
                        'is_correct' => (bool) ($answer['is_correct'] ?? false),
                    ]);
                }
            }
        }
    }
}
