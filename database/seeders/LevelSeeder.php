<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Tạo 7 Parts trong Adaptive Roadmap
     * Threshold: A1/A2=50%, B1=50%, B2=65%, B3=65%, C1=80%, C2=80%
     */
    public function run(): void
    {
        $parts = [
            ['name' => 'A1', 'order' => 1, 'pass_threshold' => 0.50, 'description' => 'Beginner - Bước đầu tiên'],
            ['name' => 'A2', 'order' => 2, 'pass_threshold' => 0.50, 'description' => 'Elementary - Nền tảng cơ bản'],
            ['name' => 'B1', 'order' => 3, 'pass_threshold' => 0.50, 'description' => 'Intermediate - Tự tin giao tiếp'],
            ['name' => 'B2', 'order' => 4, 'pass_threshold' => 0.65, 'description' => 'Upper Intermediate - Giao tiếp thành thạo'],
            ['name' => 'B3', 'order' => 5, 'pass_threshold' => 0.65, 'description' => 'Advanced - Nâng cao kỹ năng'],
            ['name' => 'C1', 'order' => 6, 'pass_threshold' => 0.80, 'description' => 'Proficient - Gần như người bản xứ'],
            ['name' => 'C2', 'order' => 7, 'pass_threshold' => 0.80, 'description' => 'Mastery - Chủ đạo ngôn ngữ'],
        ];

        foreach ($parts as $part) {
            Level::firstOrCreate(
                ['name' => $part['name']],
                [
                    'order' => $part['order'],
                    'pass_threshold' => $part['pass_threshold'],
                    'description' => $part['description'],
                ]
            );
        }
    }
}
