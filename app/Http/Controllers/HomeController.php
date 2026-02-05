<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Models\Test;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        $featuredCourses = Test::query()
            ->where('is_active', true)
            ->latest('created_at')
            ->take(3)
            ->get(['id', 'title', 'description'])
            ->map(function (Test $test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                ];
            })
            ->toArray();

        $stats = [
            'tests' => Test::count(),
            'flashcards' => Flashcard::count(),
        ];

        return Inertia::render('Home', [
            'featuredCourses' => $featuredCourses,
            'stats' => $stats,
        ]);
    }
}
