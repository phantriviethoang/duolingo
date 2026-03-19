<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Attribute;
use App\Models\TestResult;

class Section extends Model
{
    /** @use HasFactory<\Database\Factories\SectionFactory> */
    use HasFactory;

    protected $fillable = [
        'test_id',
        'order',
        'pass_threshold',
    ];

    protected $casts = [
        'order' => 'integer',
        'pass_threshold' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Quan hệ: Một Section thuộc về một Exam (Test)
     */
    public function exam()
    {
        return $this->belongsTo(Test::class, 'test_id');
    }

    /**
     * Quan hệ: Một Section có nhiều Questions
     */
    public function questions()
    {
        return $this->hasMany(TestQuestion::class, 'section_id');
    }

    /**
     * Quan hệ: Một Section có nhiều TestResults
     */
    public function testResults()
    {
        return $this->hasMany(TestResult::class, 'section_id');
    }

    /**
     * Scope: Lấy sections theo thứ tự
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Scope: Lấy section by thứ tự trong exam
     */
    public function scopeByOrder($query, $order)
    {
        return $query->where('order', $order);
    }

    /**
     * Accessor: Tính pass_threshold điều chỉnh (cho high-quality exams)
     *
     * High-quality mode: threshold = pass_threshold * 1.2 (max 100%)
     */
    protected function adjustedPassThreshold(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => min($this->pass_threshold * 1.2, 1.0)
        )->shouldCache();
    }

    /**
     * Scope: Kiểm tra user đã pass section này chưa
     *
     * Cách dùng:
     * Section::find(1)
     *   ->results()
     *   ->where('user_id', $userId)
     *   ->isPassed($isHighQuality)
     *   ->get()
     */
    public function scopeUserPassed($query, $userId, $isHighQuality = false)
    {
        $threshold = $isHighQuality ? $this->adjustedPassThreshold : $this->pass_threshold;

        return $query->join('test_results', 'sections.id', '=', 'test_results.section_id')
            ->where('test_results.user_id', $userId)
            ->whereRaw('(test_results.correct_answers / test_results.total_questions) >= ?', [$threshold])
            ->distinct('test_results.id');
    }
}
