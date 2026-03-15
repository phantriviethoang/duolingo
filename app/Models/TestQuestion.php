<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuestionStatistic;

class TestQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_id',
        'question',
        'question_number',
        'options',
        'correct_option_id',
        'explanation',
        'translation',
        'detailed_explanation',
    ];

    protected $casts = [
        'options' => 'array',
        'question_number' => 'integer',
    ];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function statistics()
    {
        return $this->hasOne(QuestionStatistic::class, 'question_id');
    }
}
