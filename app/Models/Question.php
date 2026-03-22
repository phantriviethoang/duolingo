<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function tests()
    {
        return $this->belongsToMany(Test::class)->withPivot('order')->withTimestamps();
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
