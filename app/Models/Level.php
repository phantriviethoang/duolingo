<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Attribute;

class Level extends Model
{
    /** @use HasFactory<\Database\Factories\LevelFactory> */
    use HasFactory;

    protected $fillable = [
        'target_level',
        'name',
        'description',
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
     * Quan hệ: Một Level có nhiều Exams (Tests)
     */
    public function exams()
    {
        return $this->hasMany(Test::class, 'level_id');
    }

    /**
     * Get by Level name (B1, B2, C1)
     */
    public function scopeByName($query, $name)
    {
        return $query->where('name', $name);
    }

    /**
     * Accessor: Ngưỡng điểm đạt của Part này
     *
     * Nếu user có high_quality = true:
     *   threshold = pass_threshold * 1.1 (cộng thêm 10%)
     *   VD: 50% → 55%, 65% → 71.5%, max 100%
     */
    protected function passThreshold(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ?? 0.5
        )->shouldCache();
    }

    /**
     * Accessor: Ngưỡng điểm với high-quality multiplier
     */
    protected function adjustedPassThreshold(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => min(($attributes['pass_threshold'] ?? 0.5) * 1.1, 1.0)
        )->shouldCache();
    }

    /**
     * Kiểm tra user có thể truy cập Part này không
     *
     * Quy tắc:
     * - Part đầu tiên (order=1) luôn truy cập được
     * - Part N chỉ truy cập khi user đã đạt threshold ở Part N-1
     */
    public function getIsLockedFor($user): bool
    {
        // Part đầu tiên luôn mở
        if ($this->order == 1) {
            return false;
        }

        // Lấy Part trước đó thuộc cùng khóa học/level
        $prevPart = Level::where('target_level', $this->target_level)
            ->where('order', $this->order - 1)
            ->first();
        if (! $prevPart) {
            return true; // Không có Part trước → khóa
        }

        // Kiểm tra user đã đạt threshold ở Part trước không
        $userPassed = $user->testResults()
            ->whereHas('test', fn ($q) => $q->where('level_id', $prevPart->id))
            ->get()
            ->filter(function ($result) use ($user, $prevPart) {
                $userThreshold = $user->getPassThreshold() / 100;
                $threshold = $user->is_high_quality ? min($userThreshold * 1.1, 1.0) : $userThreshold;
                $percentage = $result->total_questions > 0
                    ? ($result->correct_answers / $result->total_questions)
                    : 0;
                return $percentage >= $threshold;
            })
            ->isNotEmpty();

        return ! $userPassed; // true = locked, false = unlocked
    }
}
