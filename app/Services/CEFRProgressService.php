<?php

namespace App\Services;

use App\Models\UserProgress;
use App\Models\User;
use App\Models\Result;
use Illuminate\Support\Collection;

class CEFRProgressService
{
    /**
     * CEFR levels available
     */
    const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    /**
     * Get all available CEFR levels
     */
    public static function getAvailableLevels(): array
    {
        return self::CEFR_LEVELS;
    }

    /**
     * Get user progress for a specific level
     */
    public function getUserLevelProgress(User $user, string $level): Collection
    {
        return UserProgress::getUserLevelProgress($user->id, $level);
    }

    /**
     * Get structured progress data for UI
     */
    public function getLevelProgressData(User $user, string $level): array
    {
        $progress = $this->getUserLevelProgress($user, $level);
        $isLevelCompleted = UserProgress::isLevelCompleted($user->id, $level);

        $parts = [];
        for ($part = 1; $part <= 3; $part++) {
            $partProgress = $progress->get($part) ?: new UserProgress([
                'user_id' => $user->id,
                'level' => $level,
                'part' => $part,
                'score' => 0,
                'percentage' => 0,
                'is_passed' => false,
            ]);

            $parts[] = [
                'part' => $part,
                'score' => $partProgress->score,
                'percentage' => $partProgress->percentage,
                'is_passed' => $partProgress->is_passed,
                'is_locked' => $partProgress->isLocked(),
                'can_access' => $partProgress->canAccess(),
                'lock_message' => $partProgress->getLockMessage(),
                'pass_threshold' => $partProgress->getPassThreshold(),
                'completed_at' => $partProgress->completed_at,
            ];
        }

        return [
            'level' => $level,
            'parts' => $parts,
            'is_level_completed' => $isLevelCompleted,
            'current_part' => $this->getCurrentPart($progress),
        ];
    }

    /**
     * Get the current part user should work on
     */
    private function getCurrentPart(Collection $progress): int
    {
        // Find first non-passed part
        for ($part = 1; $part <= 3; $part++) {
            $partProgress = $progress->get($part);
            if (! $partProgress || ! $partProgress->is_passed) {
                return $part;
            }
        }

        return 3; // All parts completed
    }

    /**
     * Update user progress after completing a part
     */
    public function updateProgress(User $user, string $level, int $part, int $score, int $totalQuestions): UserProgress
    {
        return UserProgress::updateProgress($user->id, $level, $part, $score, $totalQuestions);
    }

    /**
     * Check if user can access a specific part
     */
    public function canAccessPart(User $user, string $level, int $part): bool
    {
        $progress = $this->getUserLevelProgress($user, $level);
        $partProgress = $progress->get($part) ?: new UserProgress([
            'user_id' => $user->id,
            'level' => $level,
            'part' => $part,
        ]);

        return $partProgress->canAccess();
    }

    /**
     * Get user's overall progress across all levels
     */
    public function getUserOverallProgress(User $user): array
    {
        $overallProgress = [];

        foreach (self::CEFR_LEVELS as $level) {
            $levelProgress = $this->getLevelProgressData($user, $level);
            $overallProgress[] = [
                'level' => $level,
                'is_completed' => $levelProgress['is_level_completed'],
                'completed_parts' => count(array_filter($levelProgress['parts'], fn ($p) => $p['is_passed'])),
                'total_parts' => 3,
                'current_part' => $levelProgress['current_part'],
            ];
        }

        return $overallProgress;
    }

    /**
     * Set user's current learning level
     */
    public function setUserCurrentLevel(User $user, string $level): void
    {
        $user->current_level = $level;
        $user->save();
    }

    /**
     * Get user's current learning level
     */
    public function getUserCurrentLevel(User $user): string
    {
        return $user->current_level ?? 'A1';
    }

    /**
     * Get next available level for user
     */
    public function getNextLevel(User $user): ?string
    {
        $currentLevel = $this->getUserCurrentLevel($user);
        $currentIndex = array_search($currentLevel, self::CEFR_LEVELS);

        if ($currentIndex !== false && $currentIndex < count(self::CEFR_LEVELS) - 1) {
            return self::CEFR_LEVELS[$currentIndex + 1];
        }

        return null;
    }

    /**
     * Get questions for a specific level and part
     */
    public function getQuestionsForPart(string $level, int $part)
    {
        // Tìm test phù hợp với level và part
        $test = \App\Models\Test::where('title', 'like', "%{$level}%")
            ->orWhere('title', 'like', "%Part {$part}%")
            ->first();

        if (! $test) {
            // Nếu không tìm thấy, lấy test đầu tiên
            $test = \App\Models\Test::first();
        }

        if (! $test) {
            return [];
        }

        // Lấy câu hỏi của test
        $questions = $test->questions()
            ->orderBy('question_number')
            ->get()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question_number' => $question->question_number,
                    'question' => $question->question,
                    'options' => $question->options,
                    'correct_option_id' => $question->correct_option_id,
                    'explanation' => $question->explanation,
                    'translation' => $question->translation,
                ];
            });

        return [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'description' => $test->description,
                'duration' => $test->configuredDuration(),
                'total_questions' => $test->total_questions,
            ],
            'questions' => $questions,
        ];
    }

    /**
     * Check if user can start a new level
     * Luôn cho phép chọn bất kỳ trình độ nào (không khóa)
     */
    public function canStartLevel(User $user, string $level): bool
    {
        // Luôn cho phép chọn bất kỳ trình độ nào
        // User có thể tự do chuyển giữa các trình độ
        return true;
    }

    /**
     * Get pass threshold for a part
     */
    public function getPassThreshold(int $part): int
    {
        return (int) (\App\Models\UserProgress::PASS_THRESHOLDS[$part] ?? 60);
    }

    /**
     * Lấy thống kê chi tiết cho dashboard người dùng
     */
    public function getUserDetailedStats(User $user): array
    {
        $allResults = Result::query()
            ->where('user_id', $user->id)
            ->with(['test.questions.answers'])
            ->orderByDesc('completed_at')
            ->get();

        $currentLevel = $this->getUserCurrentLevel($user);
        $levelProgress = $this->getLevelProgressData($user, $currentLevel);

        // 1. Phân tích câu hỏi hay sai
        $wrongQuestions = $this->analyzeWrongQuestions($allResults);

        // 2. Phân tích phần kém
        $weakAreas = $this->analyzeWeakAreas($allResults);

        // 3. Đề xuất trình độ
        $recommendedLevel = $this->calculateRecommendedLevel($user, $allResults);

        return [
            'current_level' => $currentLevel,
            'level_progress' => $levelProgress,
            'wrong_questions' => array_slice($wrongQuestions, 0, 5), // Lấy top 5 câu sai
            'weak_areas' => $weakAreas,
            'recommended_level' => $recommendedLevel,
            'recent_results' => $allResults->take(5)->map(fn ($r) => [
                'test_title' => $r->test->title ?? 'N/A',
                'score' => $r->score,
                'is_passed' => $r->score >= 60, // Giả định threshold chung
                'completed_at' => optional($r->completed_at)->format('d/m/Y H:i') ?? 'N/A',
            ]),
        ];
    }

    /**
     * Phân tích các câu hỏi người dùng hay làm sai
     */
    private function analyzeWrongQuestions(Collection $results): array
    {
        $wrongCounts = [];
        $questionDetails = [];

        foreach ($results as $result) {
            $answers = (array) ($result->answers ?? []);
            $test = $result->test;
            if (! $test) {
                continue;
            }

            $questions = $test->questions ?? collect();
            foreach ($questions as $question) {
                $userAns = $answers[$question->id] ?? null;

                if ($userAns === null) {
                    continue;
                }

                $correctAnswerId = optional($question->answers->firstWhere('is_correct', true))->id;
                if ($correctAnswerId === null) {
                    continue;
                }

                if ((string) $userAns !== (string) $correctAnswerId) {
                    $qId = $question->id;
                    $wrongCounts[$qId] = ($wrongCounts[$qId] ?? 0) + 1;
                    if (! isset($questionDetails[$qId])) {
                        $questionDetails[$qId] = [
                            'id' => $qId,
                            'question' => $question->question_text ?? $question->question ?? 'N/A',
                            'explanation' => $question->explanation,
                            'test_title' => $test->title,
                        ];
                    }
                }
            }
        }

        // Sắp xếp theo số lần sai giảm dần
        arsort($wrongCounts);

        $stats = [];
        foreach ($wrongCounts as $qId => $count) {
            $stats[] = array_merge($questionDetails[$qId], ['wrong_count' => $count]);
        }

        return $stats;
    }

    /**
     * Phân tích các phần (level/part) mà người dùng đang kém
     */
    private function analyzeWeakAreas(Collection $results): array
    {
        $areaStats = [];

        foreach ($results as $result) {
            $test = $result->test;
            if (! $test)
                continue;

            $key = $test->level . ' - Part ' . $test->part;
            if (! isset($areaStats[$key])) {
                $areaStats[$key] = ['total_score' => 0, 'count' => 0, 'level' => $test->level, 'part' => $test->part];
            }

            $areaStats[$key]['total_score'] += $result->score;
            $areaStats[$key]['count']++;
        }

        $weakAreas = [];
        foreach ($areaStats as $key => $stat) {
            $avgScore = $stat['total_score'] / $stat['count'];
            if ($avgScore < 60) { // Nếu trung bình < 60% thì coi là yếu
                $weakAreas[] = [
                    'area' => $key,
                    'avg_score' => round($avgScore, 1),
                    'message' => "Bạn đang gặp khó khăn ở {$key}. Hãy luyện tập thêm phần này.",
                ];
            }
        }

        return $weakAreas;
    }

    /**
     * Tính toán trình độ đề xuất dựa trên kết quả thực tế
     */
    private function calculateRecommendedLevel(User $user, Collection $results): string
    {
        if ($results->isEmpty()) {
            return $user->current_level ?? 'A1';
        }

        $levelScores = [];
        foreach ($results as $result) {
            $test = $result->test;
            if (! $test)
                continue;

            if (! isset($levelScores[$test->level])) {
                $levelScores[$test->level] = ['total' => 0, 'count' => 0];
            }
            $levelScores[$test->level]['total'] += $result->score;
            $levelScores[$test->level]['count']++;
        }

        $recommended = 'A1';
        foreach (self::CEFR_LEVELS as $level) {
            if (isset($levelScores[$level])) {
                $avg = $levelScores[$level]['total'] / $levelScores[$level]['count'];
                if ($avg >= 80) {
                    // Nếu đạt > 80% ở level này, đề xuất level tiếp theo
                    $idx = array_search($level, self::CEFR_LEVELS);
                    if ($idx !== false && $idx < count(self::CEFR_LEVELS) - 1) {
                        $recommended = self::CEFR_LEVELS[$idx + 1];
                    } else {
                        $recommended = $level;
                    }
                } elseif ($avg >= 50) {
                    $recommended = $level;
                }
            }
        }

        return $recommended;
    }
}
