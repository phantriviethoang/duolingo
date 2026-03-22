<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Tạo 6 Levels trong CEFR Framework
     * Threshold: A1/A2=60%, B1/B2=75%, C1/C2=90%
     */
    public function run(): void
    {
        $parts = [
            [
                'name' => 'A1', 
                'order' => 1, 
                'pass_threshold_part1' => 60,
                'pass_threshold_part2' => 75,
                'pass_threshold_part3' => 90,
                'description' => 'Beginner - Bước đầu tiên'
            ],
            [
                'name' => 'A2', 
                'order' => 2, 
                'pass_threshold_part1' => 60,
                'pass_threshold_part2' => 75,
                'pass_threshold_part3' => 90,
                'description' => 'Elementary - Nền tảng cơ bản'
            ],
            [
                'name' => 'B1', 
                'order' => 3, 
                'pass_threshold_part1' => 60,
                'pass_threshold_part2' => 75,
                'pass_threshold_part3' => 90,
                'description' => 'Intermediate - Tự tin giao tiếp'
            ],
            [
                'name' => 'B2', 
                'order' => 4, 
                'pass_threshold_part1' => 60,
                'pass_threshold_part2' => 75,
                'pass_threshold_part3' => 90,
                'description' => 'Upper Intermediate - Giao tiếp thành thạo'
            ],
            [
                'name' => 'C1', 
                'order' => 5, 
                'pass_threshold_part1' => 60,
                'pass_threshold_part2' => 75,
                'pass_threshold_part3' => 90,
                'description' => 'Advanced - Nâng cao kỹ năng'
            ],
            [
                'name' => 'C2', 
                'order' => 6, 
                'pass_threshold_part1' => 60,
                'pass_threshold_part2' => 75,
                'pass_threshold_part3' => 90,
                'description' => 'Proficient - Gần như người bản xứ'
            ],
        ];

        foreach ($parts as $part) {
            Level::updateOrCreate(
                ['name' => $part['name']],
                [
                    'order' => $part['order'],
                    'pass_threshold_part1' => $part['pass_threshold_part1'],
                    'pass_threshold_part2' => $part['pass_threshold_part2'],
                    'pass_threshold_part3' => $part['pass_threshold_part3'],
                    'description' => $part['description'],
                ]
            );
        }
    }
}
