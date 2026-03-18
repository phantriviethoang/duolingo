<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
