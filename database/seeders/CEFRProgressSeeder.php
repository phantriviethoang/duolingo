<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserProgress;

class CEFRProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user (or create one for testing)
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'current_level' => 'A1',
            ]);
        }

        // Create sample progress for A1 level
        $this->createSampleProgress($user, 'A1', [
            1 => ['score' => 8, 'total' => 10, 'passed' => true],   // 80% - passed
            2 => ['score' => 15, 'total' => 20, 'passed' => true],  // 75% - passed
            3 => ['score' => 16, 'total' => 20, 'passed' => false], // 80% - not passed (need 90%)
        ]);

        // Create sample progress for A2 level (partially completed)
        $this->createSampleProgress($user, 'A2', [
            1 => ['score' => 7, 'total' => 10, 'passed' => true],   // 70% - passed
            2 => ['score' => 12, 'total' => 20, 'passed' => false], // 60% - not passed (need 75%)
            3 => ['score' => 0, 'total' => 20, 'passed' => false],  // 0% - not started
        ]);

        $this->command->info('CEFR Progress sample data created successfully!');
    }

    /**
     * Create sample progress for a specific level
     */
    private function createSampleProgress(User $user, string $level, array $partsData): void
    {
        foreach ($partsData as $part => $data) {
            $percentage = ($data['score'] / $data['total']) * 100;
            $threshold = UserProgress::PASS_THRESHOLDS[$part] ?? 60.0;
            $isPassed = $percentage >= $threshold;

            UserProgress::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'level' => $level,
                    'part' => $part,
                ],
                [
                    'score' => $data['score'],
                    'percentage' => round($percentage, 2),
                    'is_passed' => $isPassed,
                    'completed_at' => $isPassed ? now()->subDays(rand(1, 30)) : null,
                ]
            );
        }
    }
}
