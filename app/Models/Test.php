<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    /** @use HasFactory<\Database\Factories\TestFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'audio_path',
        'image_path',
        'total_questions',
        // 'questions' removed
        'attempts',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'attempts' => 'integer',
        'duration' => 'integer',
        'total_questions' => 'integer',
    ];

    public function questions()
    {
        return $this->hasMany(TestQuestion::class);
    }

    public function results()
    {
        return $this->hasMany(TestResult::class);
    }
}
