<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Flashcard;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Flashcard>
 */
class FlashcardFactory extends Factory
{
    protected $model = Flashcard::class;

    public function definition(): array
    {
        return [
            'word' => fake()->unique()->word(),
            'phonetic' => fake()->optional()->word(),
            'meaning' => fake()->word(),
            'example' => fake()->optional()->sentence(),
            'category_id' => Category::query()->inRandomOrder()->value('id'),
        ];
    }
}
