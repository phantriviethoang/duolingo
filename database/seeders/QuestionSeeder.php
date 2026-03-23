<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Test;
use App\Traits\HasQuestionBank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    use HasQuestionBank, WithoutModelEvents;

    /**
     * Run the database seeds.
     *
     * Seed câu hỏi từ HasQuestionBank vào database
     * Mỗi level sẽ có các câu hỏi được lặp lại cho từng part
     */
    public function run(): void
    {
        $questionBank = $this->getQuestionBank(); // 10 questions từ HasQuestionBank
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $parts = [1, 2, 3]; // 3 parts mỗi level
        $repeatCycles = 3; // Lặp lại bộ 10 câu 3 lần = 30 câu mỗi part

        foreach ($levels as $level) {
            foreach ($parts as $part) {
                // Lấy các test matching cho level và part này
                $matchingTests = Test::where('level', $level)
                    ->whereHas('parts', function($q) use ($part) {
                        $q->where('part_number', $part);
                    })
                    ->get();

                $questionOrder = 1;

                // Lặp lại bộ câu hỏi
                for ($cycle = 0; $cycle < $repeatCycles; $cycle++) {
                    foreach ($questionBank as $bankIndex => $bankQuestion) {
                        $question = Question::create([
                            'level' => $level,
                            'part_number' => $part,
                            'question_text' => $bankQuestion['question'],
                            'order' => $questionOrder,
                            'translation' => $bankQuestion['translation'] ?? null,
                            'explanation' => $bankQuestion['explanation'] ?? null,
                            'detailed_explanation' => $bankQuestion['detailed_explanation'] ?? null,
                        ]);

                        // Tạo các đáp án từ options
                        foreach ($bankQuestion['options'] as $optionIndex => $optionText) {
                            $question->answers()->create([
                                'answer_text' => $optionText,
                                'is_correct' => $optionIndex === $bankQuestion['correct'],
                            ]);
                        }

                        // Gắn câu hỏi vào test ngẫu nhiên nếu có test matching
                        if ($matchingTests->isNotEmpty() && rand(1, 100) > 20) {
                            $randomTest = $matchingTests->random();
                            $question->tests()->attach($randomTest->id, ['order' => $questionOrder]);
                            $randomTest->increment('total_questions');
                        }

                        $questionOrder++;
                    }
                }

                echo "✓ Seeded {$questionOrder} questions for Level $level - Part $part\n";
            }
        }

        echo "\n✓ Question seeding completed! Total questions seeded: " . Question::count() . "\n";
    }
}
