<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Flashcard;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FlashcardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'Giao tiếp hàng ngày' => [
                ['word' => 'greet', 'phonetic' => '/ɡriːt/', 'meaning' => 'chào hỏi', 'example' => 'They greet each other every morning.'],
                ['word' => 'conversation', 'phonetic' => '/ˌkɒnvəˈseɪʃn/', 'meaning' => 'cuộc trò chuyện', 'example' => 'Our conversation lasted an hour.'],
                ['word' => 'polite', 'phonetic' => '/pəˈlaɪt/', 'meaning' => 'lịch sự', 'example' => 'Always be polite to guests.'],
            ],
            'Du lịch' => [
                ['word' => 'journey', 'phonetic' => '/ˈdʒɜːrni/', 'meaning' => 'chuyến đi', 'example' => 'The journey took three hours.'],
                ['word' => 'airport', 'phonetic' => '/ˈeəpɔːt/', 'meaning' => 'sân bay', 'example' => 'We arrived at the airport early.'],
                ['word' => 'passport', 'phonetic' => '/ˈpɑːspɔːt/', 'meaning' => 'hộ chiếu', 'example' => 'Keep your passport safe.'],
            ],
            'Công việc' => [
                ['word' => 'deadline', 'phonetic' => '/ˈdedlaɪn/', 'meaning' => 'hạn chót', 'example' => 'The deadline is tomorrow.'],
                ['word' => 'meeting', 'phonetic' => '/ˈmiːtɪŋ/', 'meaning' => 'cuộc họp', 'example' => 'We have a team meeting at 9 AM.'],
                ['word' => 'budget', 'phonetic' => '/ˈbʌdʒɪt/', 'meaning' => 'ngân sách', 'example' => 'Please update the marketing budget.'],
            ],
            'Ẩm thực' => [
                ['word' => 'delicious', 'phonetic' => '/dɪˈlɪʃəs/', 'meaning' => 'ngon miệng', 'example' => 'This soup tastes delicious.'],
                ['word' => 'recipe', 'phonetic' => '/ˈresəpi/', 'meaning' => 'công thức nấu ăn', 'example' => 'She shared her favorite recipe.'],
                ['word' => 'ingredient', 'phonetic' => '/ɪnˈɡriːdiənt/', 'meaning' => 'nguyên liệu', 'example' => 'Salt is a basic ingredient.'],
            ],
            'Công nghệ' => [
                ['word' => 'update', 'phonetic' => '/ˌʌpˈdeɪt/', 'meaning' => 'cập nhật', 'example' => 'Update your software regularly.'],
                ['word' => 'device', 'phonetic' => '/dɪˈvaɪs/', 'meaning' => 'thiết bị', 'example' => 'This device is very useful.'],
                ['word' => 'password', 'phonetic' => '/ˈpɑːswɜːd/', 'meaning' => 'mật khẩu', 'example' => 'Change your password often.'],
            ],
            'Sức khỏe' => [
                ['word' => 'healthy', 'phonetic' => '/ˈhelθi/', 'meaning' => 'khỏe mạnh', 'example' => 'Healthy habits are important.'],
                ['word' => 'exercise', 'phonetic' => '/ˈeksəsaɪz/', 'meaning' => 'tập thể dục', 'example' => 'Exercise every day.'],
                ['word' => 'medicine', 'phonetic' => '/ˈmedsn/', 'meaning' => 'thuốc', 'example' => 'Take your medicine after meals.'],
            ],
        ];

        foreach ($data as $categoryName => $cards) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName]
            );

            foreach ($cards as $card) {
                Flashcard::updateOrCreate(
                    ['word' => ucfirst($card['word']), 'category_id' => $category->id],
                    array_merge($card, ['category_id' => $category->id])
                );
            }
        }
    }
}
