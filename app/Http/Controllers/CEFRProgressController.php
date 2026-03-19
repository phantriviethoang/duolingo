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

        // Tìm exam phù hợp với level và part
        $exam = \App\Models\Test::where('title', 'like', "%{$level}%")
            ->orWhere('title', 'like', "%Part {$part}%")
            ->first();

        if (! $exam) {
            // Fallback: lấy exam đầu tiên active
            $exam = \App\Models\Test::where('is_active', true)->first();
        }

        if (! $exam) {
            return back()->with('error', 'Không tìm thấy bài kiểm tra phù hợp.');
        }

        // Redirect đến trang làm bài có sẵn
        return redirect()->route('exams.take', ['exam' => $exam->id]);
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

        // Calculate percentage
        $percentage = round(($validated['score'] / $validated['total_questions']) * 100, 2);
        $isPassed = $percentage >= $this->cefrService->getPassThreshold($part);

        // Render result page
        return Inertia::render('CEFR/Result', [
            'level' => $level,
            'part' => $part,
            'score' => $validated['score'],
            'totalQuestions' => $validated['total_questions'],
            'percentage' => $percentage,
            'isPassed' => $isPassed,
            'passThreshold' => $this->cefrService->getPassThreshold($part),
            'completedAt' => $progress->completed_at,
        ]);
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
