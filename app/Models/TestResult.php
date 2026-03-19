<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    /** @use HasFactory<\Database\Factories\TestResultFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'test_id',
        'section_id',
        'score',
        'total_questions',
        'correct_answers',
        'user_answer',
        'time_spent',
        'completed_at',
    ];

    protected $casts = [
        'user_answer' => 'array',
        'completed_at' => 'datetime',
        'score' => 'float',
        'total_questions' => 'integer',
        'correct_answers' => 'integer',
        'time_spent' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    /**
     * Quan hệ: Kết quả bài thi thuộc về một Section
     */
    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Accessor: Tính phần trăm đạt được
     */
    public function getPercentageAttribute()
    {
        if ($this->total_questions == 0)
            return 0;
        return ($this->correct_answers / $this->total_questions) * 100;
    }

    /**
     * Accessor: Kiểm tra pass section (user đã đạt pass_threshold của section này)
     *
     * Xem xét:
     * - Nếu là section result: so sánh với section->pass_threshold
     * - Nếu là exam result (no section_id): so sánh với test->pass_score
     */
    public function getIsSectionPassedAttribute()
    {
        if (! $this->section_id || ! $this->section) {
            return null;
        }

        // Lấy pass_threshold dựa trên user->target_level
        $threshold = $this->user ? ($this->user->getPassThreshold() / 100) : $this->section->pass_threshold;

        // Nếu user hoặc exam là high-quality: nhân threshold với 1.1 (cộng thêm 10%)
        if ($this->user && $this->user->is_high_quality) {
            $threshold = min($threshold * 1.1, 1.0);
        }

        return $this->percentage >= ($threshold * 100);
    }

    /**
     * Accessor: Kiểm tra pass exam (toàn bộ exam đạt pass_score)
     *
     * Dùng khi không có section_id (test result toàn exam)
     */
    public function getIsExamPassedAttribute()
    {
        return $this->percentage >= $this->test->pass_score;
    }

    /**
     * Accessor cũ để backward compatibility
     */
    public function getIsPassedAttribute()
    {
        // Ưu tiên section pass, nếu không có thì dùng exam pass
        if ($this->section_id) {
            return $this->isSectionPassed;
        }
        return $this->isExamPassed;
    }
}
