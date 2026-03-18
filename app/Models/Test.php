<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TestQuestion;
use App\Models\TestResult;
use App\Models\UserProgress;
use App\Models\QuestionStatistic;

class Test extends Model
{
    /** @use HasFactory<\Database\Factories\TestFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'section',
        'part_number',
        'total_questions',
        'level',
        'is_active',
        'pass_score',
        'attempts',
        'level_id',
        'is_high_quality',
        'difficulty_score',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'attempts' => 'integer',
        'duration' => 'integer',
        'total_questions' => 'integer',
        'part_number' => 'integer',
        'pass_score' => 'float',
        'level_id' => 'integer',
        'is_high_quality' => 'boolean',
        'difficulty_score' => 'float',
    ];

    public function questions()
    {
        return $this->hasMany(TestQuestion::class)->orderBy('question_number');
    }

    public function results()
    {
        return $this->hasMany(TestResult::class);
    }

    public function userProgress()
    {
        return $this->hasMany(UserProgress::class, 'exam_id');
    }

    public function statistics()
    {
        return $this->hasManyThrough(
            QuestionStatistic::class,
            TestQuestion::class
        );
    }

    /**
     * Quan hệ: Một Exam (Test) thuộc về một Level
     */
    public function levelRelation()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }

    /**
     * Quan hệ: Một Exam (Test) có nhiều Sections (Parts)
     */
    public function sections()
    {
        return $this->hasMany(Section::class, 'test_id')->orderBy('order');
    }

    /**
     * Scope: Lọc exams theo Level
     * Sử dụng: Test::byLevel(1)->get() hoặc Test::byLevel('B1')->get()
     */
    public function scopeByLevel($query, $levelId)
    {
        // Hỗ trợ cả ID và name
        if (is_numeric($levelId)) {
            return $query->where('level_id', $levelId);
        }

        return $query->whereHas('levelRelation', function ($q) use ($levelId) {
            $q->where('name', $levelId);
        });
    }

    /**
     * Scope: Lọc exams theo chế độ High-Quality
     */
    public function scopeHighQuality($query, $isHighQuality = true)
    {
        return $query->where('is_high_quality', $isHighQuality);
    }
}
