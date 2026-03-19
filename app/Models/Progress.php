<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    use HasFactory;

    protected $table = 'user_progress';

    protected $fillable = [
        'user_id',
        'level',
        'part',
        'score',
        'percentage',
        'is_passed',
        'completed_at',
    ];

    protected $casts = [
        'is_passed' => 'boolean',
        'completed_at' => 'datetime',
        'score' => 'float',
        'percentage' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
