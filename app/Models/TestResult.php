<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    /** @use HasFactory<\Database\Factories\TestResultFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'test_id',
        'score',
        'total_questions',
        'correct_answers',
        'user_answer',
        'time_spent',
        'completed_at',
    ];

    protected $casts = [
        'user_answer' => 'array',
        'completed_at' => 'datetime',
        'score' => 'float',
        'total_questions' => 'integer',
        'correct_answers' => 'integer',
        'time_spent' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function getPercentageAttribute()
    {
        if ($this->total_questions == 0)
            return 0;
        return ($this->correct_answers / $this->total_questions) * 100;
    }

    public function isPassedAttribute()
    {
        return $this->score >= $this->test->pass_score;
    }
}
