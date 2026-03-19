<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    use HasFactory;

    protected $table = 'user_progress';

    protected $fillable = [
        'user_id',
        'level',
        'part',
        'score',
        'percentage',
        'is_passed',
        'completed_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'part' => 'integer',
        'score' => 'integer',
        'percentage' => 'float',
        'is_passed' => 'boolean',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * CEFR pass thresholds for each part
     */
    const PASS_THRESHOLDS = [
        1 => 60.0,
        2 => 75.0,
        3 => 90.0,
    ];

    /**
     * Quan hệ: UserProgress thuộc về một User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Lấy progress theo level
     */
    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    /**
     * Scope: Lấy progress đã passed
     */
    public function scopePassed($query)
    {
        return $query->where('is_passed', true);
    }

    /**
     * Scope: Lấy progress chưa passed
     */
    public function scopeNotPassed($query)
    {
        return $query->where('is_passed', false);
    }

    /**
     * Lấy ngưỡng đạt cho part hiện tại
     */
    public function getPassThreshold(): float
    {
        // Ưu tiên lấy từ database (bảng levels)
        $levelConfig = \App\Models\Level::where('name', $this->level)->first();
        if ($levelConfig) {
            $thresholdField = "pass_threshold_part{$this->part}";
            return (float) ($levelConfig->$thresholdField ?? self::PASS_THRESHOLDS[$this->part] ?? 60.0);
        }

        return (float) (self::PASS_THRESHOLDS[$this->part] ?? 60.0);
    }

    /**
     * Kiểm tra user có thể truy cập part này không
     * Logic khóa/mở theo yêu cầu
     */
    public function canAccess(): bool
    {
        // Part 1 luôn mở
        if ($this->part === 1) {
            return true;
        }

        // Kiểm tra part trước đó đã passed chưa
        $previousPart = static::where('user_id', $this->user_id)
            ->where('level', $this->level)
            ->where('part', $this->part - 1)
            ->where('is_passed', true)
            ->first();

        return $previousPart !== null;
    }

    /**
     * Kiểm tra part có bị khóa không
     */
    public function isLocked(): bool
    {
        return ! $this->canAccess();
    }

    /**
     * Lấy thông tin khóa của part (nếu có)
     */
    public function getLockMessage(): ?string
    {
        if ($this->part === 1) {
            return null; // Part 1 không bao giờ khóa
        }

        if ($this->isLocked()) {
            $prevPartNum = $this->part - 1;
            
            // Lấy threshold của part trước đó từ DB
            $levelConfig = \App\Models\Level::where('name', $this->level)->first();
            $threshold = 60.0;
            if ($levelConfig) {
                $thresholdField = "pass_threshold_part{$prevPartNum}";
                $threshold = $levelConfig->$thresholdField ?? self::PASS_THRESHOLDS[$prevPartNum] ?? 60.0;
            } else {
                $threshold = self::PASS_THRESHOLDS[$prevPartNum] ?? 60.0;
            }

            return "Bạn cần đạt ít nhất {$threshold}% ở Phần {$prevPartNum} để mở Phần {$this->part}";
        }

        return null;
    }

    /**
     * Kiểm tra user đã hoàn thành toàn bộ level này chưa
     */
    public static function isLevelCompleted($userId, $level): bool
    {
        $passedParts = static::where('user_id', $userId)
            ->where('level', $level)
            ->where('is_passed', true)
            ->count();

        return $passedParts >= 3; // Cần pass cả 3 parts
    }

    /**
     * Lấy progress của user cho một level
     */
    public static function getUserLevelProgress($userId, $level)
    {
        return static::where('user_id', $userId)
            ->where('level', $level)
            ->orderBy('part')
            ->get()
            ->keyBy('part');
    }

    /**
     * Tạo hoặc update progress
     */
    public static function updateProgress($userId, $level, $part, $score, $totalQuestions)
    {
        $percentage = $totalQuestions > 0 ? ($score / $totalQuestions) * 100 : 0;
        
        // Lấy threshold từ DB
        $levelConfig = \App\Models\Level::where('name', $level)->first();
        $threshold = 60.0;
        if ($levelConfig) {
            $thresholdField = "pass_threshold_part{$part}";
            $threshold = $levelConfig->$thresholdField ?? self::PASS_THRESHOLDS[$part] ?? 60.0;
        } else {
            $threshold = self::PASS_THRESHOLDS[$part] ?? 60.0;
        }

        $isPassed = $percentage >= $threshold;

        return static::updateOrCreate(
            [
                'user_id' => $userId,
                'level' => $level,
                'part' => $part,
            ],
            [
                'score' => $score,
                'percentage' => round($percentage, 2),
                'is_passed' => $isPassed,
                'completed_at' => $isPassed ? now() : null,
            ]
        );
    }
}
