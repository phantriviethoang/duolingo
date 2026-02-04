<?php

namespace Database\Factories;

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
        return [
            'user_id' => User::query()->inRandomOrder()->value('id'),
            'test_id' => Test::query()->inRandomOrder()->value('id'),
            'score' => fake()->numberBetween(40, 100),
            'user_answer' => [],
            'completed_at' => now(),
        ];
    }
}
