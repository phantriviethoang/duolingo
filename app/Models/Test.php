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
}
