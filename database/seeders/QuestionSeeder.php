<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $parts = [1, 2, 3, 4, 5]; // up to 5 parts
        $questionsPerPart = 15; // 15 questions per level/part

        foreach ($levels as $level) {
            foreach ($parts as $part) {
                // Determine if we have tests that match this level and part to attach to
                $matchingTests = \App\Models\Test::where('level', $level)
                    ->whereHas('parts', function($q) use ($part) {
                        $q->where('part_number', $part);
                    })->get();

                for ($i = 1; $i <= $questionsPerPart; $i++) {
                    $question = \App\Models\Question::create([
                        'level' => $level,
                        'part_number' => $part,
                        'question_text' => "Ngân hàng câu hỏi $level - Phần $part - Câu $i: Lựa chọn đáp án đúng nhất...",
                        'question_type' => 'multiple_choice',
                        'order' => $i,
                        'explanation' => "Giải thích mẫu cho câu hỏi $i phần $part trình độ $level.",
                        'translation' => "Bản dịch cho câu hỏi $i phần $part trình độ $level.",
                        'detailed_explanation' => "Đây là lời giải thích chi tiết cho câu hỏi.",
                    ]);

                    $correctOption = rand(1, 4);

                    for ($j = 1; $j <= 4; $j++) {
                        $question->answers()->create([
                            'answer_text' => "Đáp án $j " . ($j === $correctOption ? '(Đúng)' : '(Sai)'),
                            'is_correct' => $j === $correctOption,
                        ]);
                    }

                    // Attach to a random matching test if any exist
                    if ($matchingTests->isNotEmpty() && rand(1, 100) > 30) {
                        $randomTest = $matchingTests->random();
                        $question->tests()->attach($randomTest->id, ['order' => $i]);
                        $randomTest->increment('total_questions');
                    }
                }
            }
        }
    }
}
