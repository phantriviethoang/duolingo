<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    /** @use HasFactory<\Database\Factories\LevelFactory> */
    use HasFactory;

    protected $table = 'levels';

    protected $fillable = [
        'name',
        'description',
        'order',
        'pass_threshold',
        'pass_threshold_part1',
        'pass_threshold_part2',
        'pass_threshold_part3',
    ];

    protected $casts = [
        'order' => 'integer',
        'pass_threshold' => 'integer',
        'pass_threshold_part1' => 'float',
        'pass_threshold_part2' => 'float',
        'pass_threshold_part3' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get by Level name (A1, A2, etc.)
     */
    public function scopeByName($query, $name)
    {
        return $query->where('name', $name);
    }
}
