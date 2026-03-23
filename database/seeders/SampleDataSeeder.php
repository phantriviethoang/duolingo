<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Result;
use App\Models\UserProgress;
use App\Models\TestSession;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * SampleDataSeeder
 *
 * Tạo dữ liệu mẫu:
 * - User mẫu (student, admin, teacher)
 * - Sample results cho user
 * - Sample progress records
 * - Sample test sessions
 */
class SampleDataSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Tạo user admin (nếu chưa có)
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'current_level' => 'A1',
                'goal_score' => 70,
            ]
        );

        // Tạo 5 user student mẫu
        $students = User::factory(5)->create([
            'role' => 'student',
        ]);

        foreach ($students as $student) {
            // Cấu hình mặc định
            $student->update([
                'goal_score' => 70,
                'current_level' => 'A1',
                'current_part' => 1,
                'part_count_preferences' => json_encode([
                    'A1' => ['part' => 1, 'questions' => 5],
                    'A2' => ['part' => 1, 'questions' => 5],
                ]),
                'email_verified_at' => now(),
            ]);

            // Tạo test results mẫu
            $this->createSampleResults($student);

            // Tạo user progress records
            $this->createSampleProgress($student);
        }

        echo "✓ Sample data seeding completed!\n";
        echo "   Users: " . User::count() . "\n";
        echo "   Results: " . Result::count() . "\n";
        echo "   Progress: " . UserProgress::count() . "\n";
    }

    /**
     * Tạo các bài làm mẫu cho user
     */
    private function createSampleResults(User $user): void
    {
        $levels = ['A1', 'A2', 'B1'];
        $parts = [1, 2, 3];

        foreach ($levels as $level) {
            foreach ($parts as $part) {
                // Lấy test phù hợp
                $tests = \App\Models\Test::where('level', $level)
                    ->whereHas('parts', function($q) use ($part) {
                        $q->where('part_number', $part);
                    })
                    ->limit(1)
                    ->get();

                if ($tests->isNotEmpty()) {
                    $test = $tests->first();
                    $totalQuestions = $test->total_questions ?? 10;
                    $correctCount = rand(max(1, $totalQuestions - 5), $totalQuestions);
                    $score = (int) (($correctCount / $totalQuestions) * 100);

                    Result::create([
                        'user_id' => $user->id,
                        'test_id' => $test->id,
                        'score' => $score,
                        'user_answer' => $correctCount,
                        'correct' => $correctCount,
                        'total' => $totalQuestions,
                        'answers' => json_encode($this->generateSampleAnswers($test)),
                        'time_spent' => rand(300, 1200), // 5-20 phút
                        'part_number' => $part,
                        'completed_at' => now()->subDays(rand(1, 30)),
                    ]);
                }
            }
        }
    }

    /**
     * Tạo progress record mẫu
     */
    private function createSampleProgress(User $user): void
    {
        $levels = ['A1', 'A2', 'B1', 'B2'];

        foreach ($levels as $index => $level) {
            foreach ([1, 2, 3] as $part) {
                UserProgress::create([
                    'user_id' => $user->id,
                    'level' => $level,
                    'part' => $part,
                    'score' => rand(50, 100),
                    'percentage' => rand(50, 100),
                    'is_passed' => rand(0, 1),
                    'completed_at' => $index < 2 ? now()->subDays(rand(1, 30)) : null,
                ]);
            }
        }
    }

    /**
     * Tạo dữ liệu trả lời mẫu
     */
    private function generateSampleAnswers(\App\Models\Test $test): array
    {
        $answers = [];
        $questions = $test->questions()->limit(10)->get();

        foreach ($questions as $question) {
            $answerOptions = $question->answers;
            if ($answerOptions->isNotEmpty()) {
                $selectedAnswer = $answerOptions->random();

                $answers[$question->id] = [
                    'answer_id' => $selectedAnswer->id,
                    'answer_text' => $selectedAnswer->answer_text,
                    'is_correct' => (bool) $selectedAnswer->is_correct,
                ];
            }
        }

        return $answers;
    }
}
