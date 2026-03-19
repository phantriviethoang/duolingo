<?php

namespace App\Http\Controllers;

use App\Services\CEFRProgressService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CEFRProgressController extends Controller
{
    protected $cefrService;

    public function __construct(CEFRProgressService $cefrService)
    {
        $this->cefrService = $cefrService;
    }

    /**
     * Hiển thị lộ trình học cho level hiện tại
     */
    public function index()
    {
        $user = Auth::user();
        $currentLevel = $this->cefrService->getUserCurrentLevel($user);

        // Lấy progress data cho level hiện tại
        $levelProgress = $this->cefrService->getLevelProgressData($user, $currentLevel);

        // Lấy overall progress cho tất cả levels
        $overallProgress = $this->cefrService->getUserOverallProgress($user);

        return Inertia::render('CEFR/Progress', [
            'currentLevel' => $currentLevel,
            'levelProgress' => $levelProgress,
            'overallProgress' => $overallProgress,
            'availableLevels' => $this->cefrService->getAvailableLevels(),
        ]);
    }

    /**
     * Hiển thị progress cho một level cụ thể
     */
    public function showLevel($level)
    {
        $user = Auth::user();

        // Validate level
        if (! in_array($level, $this->cefrService->getAvailableLevels())) {
            abort(404);
        }

        // Check if user can access this level
        if (! $this->cefrService->canStartLevel($user, $level)) {
            return back()->with('error', 'Bạn cần hoàn thành level trước đó để mở level này.');
        }

        // Set as current level
        $this->cefrService->setUserCurrentLevel($user, $level);

        $levelProgress = $this->cefrService->getLevelProgressData($user, $level);
        $overallProgress = $this->cefrService->getUserOverallProgress($user);

        return Inertia::render('CEFR/LevelProgress', [
            'level' => $level,
            'levelProgress' => $levelProgress,
            'overallProgress' => $overallProgress,
            'nextLevel' => $this->cefrService->getNextLevel($user),
        ]);
    }

    /**
     * Bắt đầu làm một part
     */
    public function startPart(Request $request, $level, $part)
    {
        $user = Auth::user();

        // Validate inputs
        if (! in_array($level, $this->cefrService->getAvailableLevels()) || ! in_array($part, [1, 2, 3])) {
            abort(404);
        }

        // Check if user can access this part
        if (! $this->cefrService->canAccessPart($user, $level, $part)) {
            $progress = $this->cefrService->getUserLevelProgress($user, $level);
            $partProgress = $progress->get($part) ?: new \App\Models\UserProgress([
                'user_id' => $user->id,
                'level' => $level,
                'part' => $part,
            ]);

            return back()->with('error', $partProgress->getLockMessage());
        }

        // Tạm thời redirect về trang level với thông báo
        // TODO: Sau này sẽ redirect đến trang làm bài test thực tế
        return redirect()->route('cefr.level', ['level' => $level])
            ->with('info', "Đang bắt đầu Part {$part} của Level {$level} - Tính năng đang phát triển!");
    }

    /**
     * Hoàn thành một part (được gọi từ TestResultController sau khi submit test)
     */
    public function completePart(Request $request, $level, $part)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'score' => 'required|integer|min:0',
            'total_questions' => 'required|integer|min:1',
        ]);

        // Update progress
        $progress = $this->cefrService->updateProgress(
            $user,
            $level,
            $part,
            $validated['score'],
            $validated['total_questions']
        );

        // Check if level is completed
        $isLevelCompleted = \App\Models\UserProgress::isLevelCompleted($user->id, $level);

        if ($isLevelCompleted) {
            $message = "🎉 Chúc mừng! Bạn đã hoàn thành trình độ {$level}!";

            // Check if there's next level
            $nextLevel = $this->cefrService->getNextLevel($user);
            if ($nextLevel) {
                $message .= " Hãy thử thách với trình độ {$nextLevel}!";
            }
        } else {
            $threshold = $progress->getPassThreshold();
            if ($progress->is_passed) {
                $message = "✅ Tốt! Bạn đã đạt {$progress->percentage}% (yêu cầu: {$threshold}%).";
            } else {
                $message = "❌ Bạn cần đạt ít nhất {$threshold}% để hoàn thành Phần {$part}.";
            }
        }

        return redirect()->route('cefr.level', ['level' => $level])
            ->with('success', ['message' => $message]);
    }

    /**
     * Chọn trình độ học tập
     */
    public function selectLevel()
    {
        $user = Auth::user();
        $overallProgress = $this->cefrService->getUserOverallProgress($user);
        $availableLevels = $this->cefrService->getAvailableLevels();

        // Add can_access property to each level
        $levels = [];
        foreach ($availableLevels as $level) {
            $levels[] = [
                'level' => $level,
                'can_access' => $this->cefrService->canStartLevel($user, $level),
                'is_completed' => \App\Models\UserProgress::isLevelCompleted($user->id, $level),
            ];
        }

        return Inertia::render('CEFR/SelectLevel', [
            'levels' => $levels,
            'currentLevel' => $this->cefrService->getUserCurrentLevel($user),
        ]);
    }

    /**
     * Lưu trình độ được chọn
     */
    public function storeSelectedLevel(Request $request)
    {
        $user = Auth::user();
        $validated = $request->validate([
            'level' => 'required|in:A1,A2,B1,B2,C1,C2',
        ]);

        // Check if user can access this level
        if (! $this->cefrService->canStartLevel($user, $validated['level'])) {
            return back()->with('error', 'Bạn cần hoàn thành các trình độ trước đó để mở trình độ này.');
        }

        $this->cefrService->setUserCurrentLevel($user, $validated['level']);

        return redirect()->route('cefr.level', ['level' => $validated['level']])
            ->with('success', ['message' => "✅ Bạn đã chọn trình độ: {$validated['level']}"]);
    }
}
