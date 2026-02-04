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
        'user_answer',
        'completed_at',
    ];

    protected $casts = [
        'user_answer' => 'array',
        'completed_at' => 'datetime',
        'score' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
