<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\TestResult;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestResultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = User::query()->value('id');
        $tests = Test::query()->get();

        foreach ($tests as $test) {
            $questions = is_array($test->questions) ? $test->questions : [];
            $answers = [];
            $correct = 0;

            foreach ($questions as $question) {
                $options = $question['options'] ?? [];
                if (empty($options)) {
                    continue;
                }
                $selected = $options[array_rand($options)];
                $answers[$question['id']] = $selected['id'];
                if (!empty($selected['is_correct'])) {
                    $correct++;
                }
            }

            $total = count($questions);
            $score = $total > 0 ? (int) round(($correct / $total) * 100) : 0;

            TestResult::create([
                'user_id' => $userId,
                'test_id' => $test->id,
                'score' => $score,
                'user_answer' => $answers,
                'completed_at' => now(),
            ]);
        }
    }
}
