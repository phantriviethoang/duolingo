<?php

namespace Database\Factories;

use App\Models\Section;
use App\Models\Test;
use App\Models\TestResult;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TestResult>
 */
class TestResultFactory extends Factory
{
    protected $model = TestResult::class;

    public function definition(): array
    {
        $totalQuestions = fake()->numberBetween(5, 20);
        $correctAnswers = fake()->numberBetween(1, $totalQuestions);

        return [
            'user_id' => User::query()->inRandomOrder()->value('id'),
            'test_id' => Test::query()->inRandomOrder()->value('id'),
            'section_id' => Section::query()->inRandomOrder()->value('id'),
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctAnswers,
            'score' => ($correctAnswers / $totalQuestions) * 100,
            'time_spent' => fake()->numberBetween(30, 300),
            'user_answer' => [],
            'completed_at' => now(),
        ];
    }
}
