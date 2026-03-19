<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitSectionRequest;
use App\Models\Test as Exam;
use App\Services\ExamResultService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $user = Auth::user();
        $exams = $exams->through(function ($exam) use ($user) {
            $userProgress = $user->userProgress()
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
                    'started_at' => $userProgress->started_at?->format('d/m/Y H:i') ?? null,
                    'completed_at' => $userProgress->completed_at?->format('d/m/Y H:i') ?? null,
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

        $userProgress = Auth::user()
            ->userProgress()
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
     *
     * ⭐ FIX: Chỉ truyền question + options, không truyền explanation/translation
     *        để tránh lộ đáp án lúc làm bài
     *
     * Authorization:
     * - User phải bắt đầu exam (create UserProgress)
     * - User chỉ được truy cập sections đã unlock
     * - Sections unlock dần theo thứ tự 1 → 2 → 3
     */
    public function take(Exam $exam, Request $request)
    {
        // Với CEFR system, không tạo user_progress ở đây
        // UserProgress sẽ được tạo bởi CEFRProgressService khi hoàn thành

        // Load exam với questions
        $exam->load([
            'questions' => function ($query) {
                $query->orderBy('question_number');
            }
        ]);

        // Render trang làm bài với component có sẵn
        return Inertia::render('Tests/Take', [
            'test' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'duration' => $exam->duration,
                'total_questions' => $exam->total_questions,
                'questions' => $exam->questions->map(function ($question) {
                    return [
                        'id' => $question->id,
                        'question_number' => $question->question_number,
                        'question' => $question->question,
                        'options' => $question->options,
                        // Không gửi correct_option_id để tránh lộ đáp án
                    ];
                }),
            ],
            'section' => null, // CEFR system không dùng sections
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
        $user = Auth::user();
        $result = $resultService->submitSection(
            exam: $exam,
            user: $user,
            sectionOrder: $validated['section_order'],
            answers: $validated['answers'] ?? []
        );

        // Nếu lỗi (section locked, etc)
        if (isset($result['error'])) {
            return redirect()->back()->withErrors([
                'error' => $result['error']
            ]);
        }

        // Redirect tới trang Results với test result ID
        return redirect()->route('results.show', $result['test_result_id']);
    }
}
