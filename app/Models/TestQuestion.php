<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_id',
        'question',
        'options',
        'correct_option_id',
        'explanation',
        'translation',
        'detailed_explanation',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_option_id' => 'integer',
    ];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
