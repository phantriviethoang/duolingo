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
        'part_thresholds',
    ];

    protected $casts = [
        'order' => 'integer',
        'pass_threshold' => 'integer',
        'part_thresholds' => 'array',
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

    /**
     * Get pass threshold for a specific part
     * @param int $part Part number (1, 2, 3, ...)
     * @param float $default Default if not found
     * @return float
     */
    public function getPartThreshold(int $part, float $default = 60.0): float
    {
        $thresholds = $this->part_thresholds ?? [1 => 60.0, 2 => 75.0, 3 => 90.0];
        return (float) ($thresholds[$part] ?? $this->pass_threshold ?? $default);
    }

    /**
     * Get all part thresholds
     * @return array
     */
    public function getPartThresholds(): array
    {
        return $this->part_thresholds ?? [1 => 60.0, 2 => 75.0, 3 => 90.0];
    }
}
