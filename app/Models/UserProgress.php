<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'test_id',
        'current_question_number',
        'answers_submitted',
        'is_completed',
        'started_at',
        'saved_at',
    ];

    protected $casts = [
        'answers_submitted' => 'array',
        'is_completed' => 'boolean',
        'started_at' => 'datetime',
        'saved_at' => 'datetime',
        'current_question_number' => 'integer',
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
