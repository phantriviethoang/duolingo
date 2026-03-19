<?php

namespace Database\Factories;

use App\Traits\HasQuestionBank;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Test>
 */
class TestFactory extends Factory
{
    use HasQuestionBank;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $testTypes = [
            'English Grammar Practice',
            'Reading Practice',
            'Grammar & Reading Practice',
            'Grammar & Reading Practice',
            'Grammar & Reading Practice',
            'Grammar & Reading Practice',
            'Grammar & Reading Practice',
            'Grammar & Reading Practice',
        ];

        $testType = fake()->randomElement($testTypes);
        $testNumber = fake()->numberBetween(1, 50);

        // Tạo số câu hỏi hợp lý theo loại bài luyện tập
        $totalQuestions = match ($testType) {
            'Grammar & Reading Practice' => fake()->numberBetween(40, 60),
            default => fake()->numberBetween(25, 45),
        };

        return [
            'title' => $testType . ' ' . $testNumber,
            'description' => $this->generateDescription($testType),
            'duration' => $this->calculateDuration($totalQuestions),
            'audio_path' => fake()->optional(0.3)->filePath(),
            'image_path' => fake()->optional(0.3)->imageUrl(640, 360, 'education', true),
            'total_questions' => $totalQuestions,
            // 'questions' removed
            'attempts' => fake()->numberBetween(0, 50000),
            'is_active' => true,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (\App\Models\Test $test) {
            for ($i = 1; $i <= $test->total_questions; $i++) {
                $questionData = $this->generatePracticeQuestion($i);
                $question = $test->questions()->create([
                    'question_text' => $questionData['question_text'] ?? $questionData['question'] ?? '',
                    'question_type' => $questionData['question_type'] ?? 'multiple_choice',
                    'order' => $i,
                    'translation' => $questionData['translation'] ?? null,
                    'explanation' => $questionData['explanation'] ?? null,
                    'detailed_explanation' => $questionData['detailed_explanation'] ?? null,
                ]);

                foreach (($questionData['answers'] ?? []) as $answer) {
                    $question->answers()->create([
                        'answer_text' => $answer['answer_text'] ?? '',
                        'is_correct' => (bool) ($answer['is_correct'] ?? false),
                    ]);
                }
            }
        });
    }

    private function generatePracticeQuestion(int $number): array
    {
        return $this->getRandomQuestion();
    }

    private function generateDescription(string $testType): string
    {
        $descriptions = [
            'English Grammar Practice' => 'Luyện ngữ pháp tiếng Anh với các câu hỏi trắc nghiệm về cấu trúc câu, từ loại và cách dùng từ.',
            'Reading Practice' => 'Luyện đọc hiểu với các câu hỏi tập trung vào ý chính, chi tiết và suy luận.',
            'Grammar & Reading Practice' => 'Bài luyện tổng hợp ngữ pháp và đọc hiểu để nâng cao kỹ năng tiếng Anh.',
        ];

        return $descriptions[$testType] ?? 'Luyện tiếng Anh với bộ đề tổng hợp.';
    }

    private function calculateDuration(int $totalQuestions): int
    {
        // Trung bình 1 phút/câu cho bài luyện ngữ pháp/đọc hiểu
        return $totalQuestions;
    }
}
