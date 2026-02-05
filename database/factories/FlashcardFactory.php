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

    protected function sampleWord(): array
    {
        $samples = [
            ['word' => 'journey', 'phonetic' => '/ˈdʒɜːrni/', 'meaning' => 'chuyến đi', 'example' => 'The journey took three hours.'],
            ['word' => 'budget', 'phonetic' => '/ˈbʌdʒɪt/', 'meaning' => 'ngân sách', 'example' => 'Keep track of your monthly budget.'],
            ['word' => 'delicious', 'phonetic' => '/dɪˈlɪʃəs/', 'meaning' => 'ngon miệng', 'example' => 'This soup tastes delicious.'],
            ['word' => 'deadline', 'phonetic' => '/ˈdedlaɪn/', 'meaning' => 'hạn chót', 'example' => 'The deadline is next Friday.'],
            ['word' => 'healthy', 'phonetic' => '/ˈhelθi/', 'meaning' => 'khỏe mạnh', 'example' => 'Healthy habits improve your life.'],
            ['word' => 'update', 'phonetic' => '/ˌʌpˈdeɪt/', 'meaning' => 'cập nhật', 'example' => 'Please update the report.'],
            ['word' => 'conversation', 'phonetic' => '/ˌkɒnvəˈseɪʃn/', 'meaning' => 'cuộc trò chuyện', 'example' => 'We had a short conversation.'],
            ['word' => 'airport', 'phonetic' => '/ˈeəpɔːt/', 'meaning' => 'sân bay', 'example' => 'The airport is very busy today.'],
            ['word' => 'meeting', 'phonetic' => '/ˈmiːtɪŋ/', 'meaning' => 'cuộc họp', 'example' => 'Our meeting starts at 9 AM.'],
            ['word' => 'recipe', 'phonetic' => '/ˈresəpi/', 'meaning' => 'công thức nấu ăn', 'example' => 'She shared her favorite recipe.'],
        ];

        return fake()->randomElement($samples);
    }

    public function definition(): array
    {
        $sample = $this->sampleWord();
        $categoryId = Category::query()->inRandomOrder()->value('id') ?? Category::factory()->create()->id;

        return [
            'word' => ucfirst($sample['word']),
            'phonetic' => $sample['phonetic'],
            'meaning' => $sample['meaning'],
            'example' => $sample['example'],
            'category_id' => $categoryId,
        ];
    }
}
