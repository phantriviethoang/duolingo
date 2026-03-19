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
        'exam_id',
        'last_completed_section_order',
        'is_completed',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'exam_id' => 'integer',
        'last_completed_section_order' => 'integer',
        'is_completed' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Quan hệ: UserProgress thuộc về một User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Quan hệ: UserProgress thuộc về một Exam (Test)
     */
    public function exam()
    {
        return $this->belongsTo(Test::class, 'exam_id');
    }

    /**
     * Scope: Lấy progress đang làm dở
     */
    public function scopeInProgress($query)
    {
        return $query->where('is_completed', false);
    }

    /**
     * Scope: Lấy progress đã hoàn thành
     */
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    /**
     * Kiểm tra user có thể truy cập section này không
     *
     * Quy tắc:
     * - Section 1 luôn có thể truy cập sau khi bắt đầu
     * - Section N chỉ có thể truy cập nếu section N-1 đã hoàn thành
     * - User chưa hoàn thành exam
     *
     * @param int $sectionOrder
     * @return bool
     */
    public function canAccessSection(int $sectionOrder): bool
    {
        // Nếu đã hoàn thành exam, không thể truy cập thêm
        if ($this->is_completed) {
            return false;
        }

        // Chỉ có thể truy cập section hiện tại hoặc các section đã unlock
        return $sectionOrder <= $this->last_completed_section_order + 1;
    }

    /**
     * Kiểm tra section có bị khóa không
     *
     * @param int $sectionOrder
     * @return bool - true nếu section bị khóa
     */
    public function isSectionLocked(int $sectionOrder): bool
    {
        return ! $this->canAccessSection($sectionOrder);
    }
}
