<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Level::firstOrCreate(
            ['name' => 'B1'],
            ['description' => 'Trình độ cơ bản - Người mới bắt đầu']
        );

        Level::firstOrCreate(
            ['name' => 'B2'],
            ['description' => 'Trình độ trung cấp - Có nền tảng tốt']
        );

        Level::firstOrCreate(
            ['name' => 'C1'],
            ['description' => 'Trình độ cao cấp - Tầm nhìn xa']
        );
    }
}
