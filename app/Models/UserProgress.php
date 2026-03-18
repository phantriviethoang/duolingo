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
}
