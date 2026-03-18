<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    /** @use HasFactory<\Database\Factories\LevelFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    protected $casts = [
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
}
