<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    /** @use HasFactory<\Database\Factories\TestFactory> */
    use HasFactory;

    public const PART_QUESTION_COUNTS = [
        1 => 15,
        2 => 15,
        3 => 20,
    ];

    public const PART_DURATION_MINUTES = [
        1 => 10,
        2 => 15,
        3 => 20,
    ];

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'duration' => 'integer',
        'total_questions' => 'integer',
        'part' => 'integer',
    ];

    /**
     * Relationships
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    public static function configuredQuestionCountForPart(int $part): int
    {
        return self::PART_QUESTION_COUNTS[$part] ?? 50;
    }

    public function configuredQuestionCount(): int
    {
        return self::configuredQuestionCountForPart((int) $this->part);
    }

    public static function configuredDurationForPart(int $part): int
    {
        return self::PART_DURATION_MINUTES[$part] ?? 20;
    }

    public function configuredDuration(): int
    {
        return self::configuredDurationForPart((int) $this->part);
    }
}
