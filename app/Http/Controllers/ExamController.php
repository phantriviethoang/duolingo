<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitSectionRequest;
use App\Models\Test as Exam;
use App\Models\Section;
use App\Models\UserProgress;
use App\Services\ExamResultService;
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
     * Hiển thị danh sách exams theo cấp độ
     * GET /levels/{level}/exams?sort=difficulty&per_page=10
     */
    public function byLevel($levelId, Request $request)
    {
        $sortBy = $request->query('sort', 'created_at');
        $perPage = $request->query('per_page', 10);
        $allowedSorts = ['created_at', 'difficulty_score', 'title'];

        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $exams = Exam::where('is_active', true)
            ->where('level_id', $levelId)
            ->with('levelRelation', 'sections')
            ->orderBy($sortBy, $sortBy === 'title' ? 'asc' : 'desc')
            ->paginate($perPage);

        // Lấy dữ liệu tiến độ user cho mỗi exam
        $user = auth()->user();
        $exams = $exams->through(function ($exam) use ($user) {
            $userProgress = $user->progress()
                ->where('exam_id', $exam->id)
                ->first();

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
                'user_progress' => $userProgress ? [
                    'last_completed_section_order' => $userProgress->last_completed_section_order,
                    'is_completed' => $userProgress->is_completed,
                    'started_at' => $userProgress->started_at->format('d/m/Y H:i'),
                    'completed_at' => $userProgress->completed_at?->format('d/m/Y H:i'),
                ] : null,
            ];
        });

        return Inertia::render('Exams/ByLevel', [
            'exams' => $exams,
            'level_id' => $levelId,
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
     * 1. Validate dữ liệu via SubmitSectionRequest
     * 2. Gọi ExamResultService::submitSection()
     * 3. Service tính toán và cập nhật database
     * 4. Return flash message cho Inertia
     */
    public function submitSection(SubmitSectionRequest $request, Exam $exam, ExamResultService $resultService)
    {
        $validated = $request->validated();

        // Gọi service để xử lý
        $result = $resultService->submitSection(
            exam: $exam,
            user: auth()->user(),
            sectionOrder: $validated['section_order'],
            answers: $validated['answers']
        );

        // Nếu lỗi (section locked, etc)
        if (isset($result['error'])) {
            return redirect()->back()->withErrors([
                'error' => $result['error']
            ]);
        }

        // Nếu pass: flash success message
        if ($result['passed']) {
            return redirect()->back()->with('success', [
                'message' => $result['message'],
                'percentage' => $result['percentage'],
                'correct_count' => $result['correct_count'],
                'total' => $result['total_questions'],
                'passed' => true,
                'exam_completed' => $result['exam_completed'],
                'next_section_unlocked' => $result['next_section_unlocked'],
            ]);
        }

        // Nếu fail: flash error message
        return redirect()->back()->with('error', [
            'message' => $result['message'],
            'percentage' => $result['percentage'],
            'required_percentage' => $result['required_percentage'],
            'correct_count' => $result['correct_count'],
            'total' => $result['total_questions'],
            'passed' => false,
        ]);
    }
}
