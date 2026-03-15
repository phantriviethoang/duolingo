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
        'question_number',
        'question_text',
        'question_type',
        'question_sub_type',
        'difficulty',
        'topic',
        'audio_path',
        'image_path',
        'passage_text',
        'options',
        'correct_option_id',
        'skill_code',
        'explanation',
        'explanation_vi',
        'detailed_explanation',
        'detailed_explanation_vi',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_option_id' => 'integer',
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
