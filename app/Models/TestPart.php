<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestPart extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'part_number' => 'integer',
        'question_count' => 'integer',
        'duration' => 'integer',
        'is_active' => 'boolean',
    ];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
