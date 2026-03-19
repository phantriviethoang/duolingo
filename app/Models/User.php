<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\TestResult;
use App\Models\UserProgress;
use App\Models\Level;
use App\Models\Test;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'target_part_id',
        'is_high_quality',
        'target_level',
        'current_level',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_high_quality' => 'boolean',
            'target_level' => 'string',
            'current_level' => 'string',
        ];
    }

    /**
     * Quan hệ: User có một Part mục tiêu
     */
    public function targetPart()
    {
        return $this->belongsTo(Level::class, 'target_part_id');
    }

    public function testResults()
    {
        return $this->hasMany(TestResult::class);
    }

    public function userProgress()
    {
        return $this->hasMany(UserProgress::class);
    }

    /**
     * Accessor: Ngưỡng điểm đạt cho user này
     *
     * Dựa vào target_part + is_high_quality
     * VD: User target=B2 (65%) + high_quality=true → 65% * 1.1 = 71.5%
     */
    public function getPassThresholdAttribute()
    {
        if (! $this->targetPart) {
            return 0.5; // Mặc định 50%
        }

        $base = $this->targetPart->pass_threshold;
        if ($this->is_high_quality) {
            return min($base * 1.1, 1.0); // +10% nhưng max 100%
        }
        return $base;
    }

    public function getPassThresholdByLevelAttribute()
    {
        return match ($this->target_level ?? 'A1') {
            'A1' => 40,
            'A2' => 50,
            'B1' => 60,
            'B2' => 70,
            'C1' => 80,
            'C2' => 90,
            default => 40,
        };
    }

    public function getPassThreshold(): int
    {
        return match ($this->target_level ?? 'A1') {
            'A1' => 40,
            'A2' => 50,
            'B1' => 60,
            'B2' => 70,
            'C1' => 80,
            'C2' => 90,
            default => 40,
        };
    }

    /**
     * Lấy results của user cho một section cụ thể
     *
     * @param int|Section $section
     * @return mixed TestResult collection
     */
    public function sectionResults($section)
    {
        $sectionId = $section instanceof Section ? $section->id : $section;
        return $this->testResults()
            ->where('section_id', $sectionId)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Kiểm tra user đã pass section nào
     *
     * @param int|Section $section
     * @param Test $test
     * @return bool
     */
    public function hasPassedSection($section, $test = null)
    {
        $sectionId = $section instanceof Section ? $section->id : $section;

        $result = $this->testResults()
            ->where('section_id', $sectionId)
            ->first();

        if (! $result) {
            return false;
        }

        // Determine high-quality mode
        $isHighQuality = $test
            ? $test->is_high_quality
            : ($result->test->is_high_quality ?? false);

        return $result->is_section_passed ? true : false;
    }
}
