<?php

namespace App\Http\Controllers;

use App\Models\Test as Exam;
use App\Models\Section;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Hiển thị danh sách exams (đề thi) cho người dùng
     */
    public function index()
    {
        $exams = Exam::where('is_active', true)
            ->with('levelRelation', 'sections')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'description' => $exam->description,
                    'duration' => $exam->duration,
                    'total_questions' => $exam->total_questions,
                    'level_id' => $exam->level_id,
                    'level_name' => $exam->levelRelation?->name ?? 'N/A',
                    'is_high_quality' => $exam->is_high_quality,
                    'difficulty_score' => $exam->difficulty_score,
                    'sections_count' => $exam->sections->count(),
                ];
            });

        return Inertia::render('Exams/Index', [
            'exams' => $exams,
        ]);
    }

    /**
     * Hiển thị chi tiết exam và sections
     */
    public function show(Exam $exam)
    {
        $exam->load('levelRelation', 'sections.questions');

        $userProgress = auth()->user()
            ->progress()
            ->where('exam_id', $exam->id)
            ->first();

        return Inertia::render('Exams/Show', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'duration' => $exam->duration,
                'total_questions' => $exam->total_questions,
                'level_id' => $exam->level_id,
                'level_name' => $exam->levelRelation?->name ?? 'N/A',
                'is_high_quality' => $exam->is_high_quality,
                'difficulty_score' => $exam->difficulty_score,
                'sections' => $exam->sections->map(fn ($s) => [
                    'id' => $s->id,
                    'order' => $s->order,
                    'pass_threshold' => $s->pass_threshold,
                    'question_count' => $s->questions->count(),
                ])->toArray(),
            ],
            'userProgress' => $userProgress ? [
                'last_completed_section_order' => $userProgress->last_completed_section_order,
                'is_completed' => $userProgress->is_completed,
            ] : null,
        ]);
    }

    /**
     * Vào phòng thi - hiển thị các câu hỏi của một section
     */
    public function take(Exam $exam, Request $request)
    {
        $sectionOrder = $request->query('section', 1);

        // Lấy hoặc tạo user progress mới
        $userProgress = auth()->user()
            ->progress()
            ->where('exam_id', $exam->id)
            ->firstOrCreate([
                'exam_id' => $exam->id,
            ], [
                'last_completed_section_order' => 1,
                'is_completed' => false,
                'started_at' => now(),
            ]);

        // Nếu yêu cầu resume, lấy section cuối cùng đã làm
        if ($request->query('resume') == 'true') {
            $sectionOrder = $userProgress->last_completed_section_order + 1;
        }

        // Kiểm tra section có tồn tại không
        $section = $exam->sections()
            ->where('order', $sectionOrder)
            ->firstOrFail();

        // Lấy các câu hỏi của section đó
        $questions = $section->questions()
            ->with('exam')
            ->get()
            ->map(fn ($q) => [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $q->options,
                'explanation' => $q->explanation,
                'translation' => $q->translation,
                'detailed_explanation' => $q->detailed_explanation,
            ])
            ->toArray();

        return Inertia::render('Exams/Take', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'duration' => $exam->duration,
                'is_high_quality' => $exam->is_high_quality,
            ],
            'section' => [
                'id' => $section->id,
                'order' => $section->order,
                'pass_threshold' => $section->pass_threshold,
            ],
            'questions' => $questions,
            'total_sections' => $exam->sections->count(),
        ]);
    }

    /**
     * Nộp bài cho một section
     *
     * Logic:
     * 1. Tính phần trăm câu đúng
     * 2. Kiểm tra >= pass_threshold
     * 3. Nếu đạt: cập nhật user_progress, mở khóa section tiếp theo
     * 4. Nếu không đạt: yêu cầu làm lại
     * 5. Nếu high-quality: nhân pass_threshold với 1.2
     */
    public function submitSection(Exam $exam, Request $request)
    {
        $validated = $request->validate([
            'section_order' => 'required|integer|min:1',
            'answers' => 'required|array', // answers = { question_id: selected_option_id, ... }
        ]);

        // Lấy section
        $section = $exam->sections()
            ->where('order', $validated['section_order'])
            ->firstOrFail();

        // Lấy user progress
        $userProgress = auth()->user()
            ->progress()
            ->where('exam_id', $exam->id)
            ->firstOrFail();

        // Kiểm tra xem user có phép làm section này không
        // Chỉ có thể làm section hiện tại hoặc section đã unlock
        if ($validated['section_order'] > $userProgress->last_completed_section_order + 1) {
            return redirect()->back()->withErrors([
                'error' => 'Bạn chưa mở khóa section này. Vui lòng hoàn thành phần trước.'
            ]);
        }

        // Lấy tất cả questions của section
        $questions = $section->questions()->get();

        // Tính số câu đúng
        $correctCount = 0;
        foreach ($questions as $question) {
            $userAnswer = $validated['answers'][$question->id] ?? null;
            if ($userAnswer == $question->correct_option_id) {
                $correctCount++;
            }
        }

        // Tính phần trăm
        $totalQuestions = $questions->count();
        $percentage = $totalQuestions > 0 ? ($correctCount / $totalQuestions) : 0;

        // Lấy pass_threshold
        $passThreshold = $section->pass_threshold;

        // Nếu high-quality: nhân threshold với 1.2 (20% cao hơn)
        if ($exam->is_high_quality) {
            $passThreshold = $passThreshold * 1.2;
        }

        // Kiểm tra đạt hay không
        $passed = $percentage >= $passThreshold;

        if ($passed) {
            // Cập nhật user_progress
            $userProgress->update([
                'last_completed_section_order' => $validated['section_order'],
            ]);

            // Nếu là section cuối cùng
            if ($validated['section_order'] == $exam->sections->count()) {
                $userProgress->update([
                    'is_completed' => true,
                    'completed_at' => now(),
                ]);
            }

            return redirect()->back()->with('success', [
                'message' => '🎉 Chúc mừng! Bạn đã đạt yêu cầu phần này.',
                'percentage' => round($percentage * 100, 2),
                'correct_count' => $correctCount,
                'total' => $totalQuestions,
                'passed' => true,
                'next_section_unlocked' => $validated['section_order'] < $exam->sections->count(),
            ]);
        } else {
            // Không đạt - yêu cầu làm lại
            return redirect()->back()->with('error', [
                'message' => '❌ Bạn chưa đạt yêu cầu. Vui lòng làm lại phần này.',
                'percentage' => round($percentage * 100, 2),
                'required_percentage' => round($passThreshold * 100, 2),
                'correct_count' => $correctCount,
                'total' => $totalQuestions,
                'passed' => false,
            ]);
        }
    }
}
