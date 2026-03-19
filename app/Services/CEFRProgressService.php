<?php

namespace App\Services;

use App\Models\UserProgress;
use App\Models\User;
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
                'duration' => $test->duration,
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
        return match ($part) {
            1 => 60,  // Part 1: 60%
            2 => 75,  // Part 2: 75%
            3 => 90,  // Part 3: 90%
            default => 60,
        };
    }
}
