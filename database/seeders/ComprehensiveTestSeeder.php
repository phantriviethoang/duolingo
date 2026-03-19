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
            $partsForLevel = [1, 2, 3];

            foreach ($partsForLevel as $part) {
                $questionsPerTest = Test::configuredQuestionCountForPart($part);
                $durationMinutes = Test::configuredDurationForPart($part);

                // Upsert test theo level/part để chạy lại seeder không bị nhân bản dữ liệu.
                $test = Test::firstOrCreate([
                    'level' => $level,
                    'part' => $part,
                    'title' => "$level - Part $part - Test 1",
                ], [
                    'description' => "Assessment test for $level - Part $part",
                    'duration' => $durationMinutes,
                    'total_questions' => $questionsPerTest,
                    'is_active' => true,
                ]);

                $test->update([
                    'description' => "Assessment test for $level - Part $part",
                    'duration' => $durationMinutes,
                    'total_questions' => $questionsPerTest,
                    'is_active' => true,
                ]);

                // Reset question bank cho test này để luôn đảm bảo đủ và đúng số lượng.
                $test->questions()->delete();

                for ($qIdx = 1; $qIdx <= $questionsPerTest; $qIdx++) {
                    $item = $this->getRandomQuestion();

                    $question = Question::create([
                        'test_id' => $test->id,
                        'question_text' => $item['question_text'] ?? $item['question'],
                        'question_type' => 'multiple_choice',
                        'order' => $qIdx,
                        'translation' => $item['translation'] ?? null,
                        'explanation' => $item['explanation'] ?? null,
                        'detailed_explanation' => $item['detailed_explanation'] ?? null,
                    ]);

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
}
