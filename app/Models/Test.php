<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TestQuestion;
use App\Models\TestResult;
use App\Models\UserProgress;
use App\Models\QuestionStatistic;

class Test extends Model
{
    /** @use HasFactory<\Database\Factories\TestFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'section',
        'part_number',
        'total_questions',
        'level',
        'is_active',
        'pass_score',
        'attempts',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'attempts' => 'integer',
        'duration' => 'integer',
        'total_questions' => 'integer',
        'part_number' => 'integer',
        'pass_score' => 'float',
    ];

    public function questions()
    {
        return $this->hasMany(TestQuestion::class)->orderBy('question_number');
    }

    public function results()
    {
        return $this->hasMany(TestResult::class);
    }

    public function userProgress()
    {
        return $this->hasMany(UserProgress::class);
    }

    public function statistics()
    {
        return $this->hasManyThrough(
            QuestionStatistic::class,
            TestQuestion::class
        );
    }
}
