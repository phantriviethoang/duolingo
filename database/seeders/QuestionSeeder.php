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
        $tests = \App\Models\Test::where('is_active', true)->get();

        if ($tests->isEmpty()) {
            return; // No tests, skip
        }

        foreach ($tests as $test) {
            $parts = $test->parts;
            if ($parts->isEmpty()) {
                continue;
            }

            foreach ($parts as $part) {
                $questionCount = 5; // e.g. 5 questions per part for the seeder
                
                for ($i = 1; $i <= $questionCount; $i++) {
                    $question = \App\Models\Question::create([
                        'level' => $test->level,
                        'part_number' => $part->part_number,
                        'question_text' => "Sample Question $i for {$test->level} Part {$part->part_number} Test {$test->id}",
                        'question_type' => 'multiple_choice',
                        'order' => $i,
                        'explanation' => "This is a seeded explanation for Question $i.",
                        'translation' => "Dịch câu hỏi $i",
                        'detailed_explanation' => "Chi tiết giải thích cho câu hỏi $i.",
                    ]);

                    $question->tests()->attach($test->id, ['order' => $i]);

                    $correctOption = rand(1, 4);

                    for ($j = 1; $j <= 4; $j++) {
                        $question->answers()->create([
                            'answer_text' => "Option $j (Level " . $test->level . ")",
                            'is_correct' => $j === $correctOption,
                        ]);
                    }
                }
                
                // Update test total_questions count
                $test->increment('total_questions', $questionCount);
            }
        }
    }
}
