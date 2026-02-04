<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Flashcard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlashcardController extends Controller
{
    public function index(Request $request)
    {
        $selectedCategoryId = $request->query('category');

        $categories = Category::query()
            ->withCount('flashcards')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'flashcards_count' => $category->flashcards_count,
                ];
            })
            ->toArray();

        $flashcardsQuery = Flashcard::query()->with('category');
        if ($selectedCategoryId) {
            $flashcardsQuery->where('category_id', $selectedCategoryId);
        }

        $flashcards = $flashcardsQuery
            ->orderBy('word')
            ->get()
            ->map(function ($flashcard) {
                return [
                    'id' => $flashcard->id,
                    'word' => $flashcard->word,
                    'phonetic' => $flashcard->phonetic,
                    'meaning' => $flashcard->meaning,
                    'example' => $flashcard->example,
                    'category' => $flashcard->category ? [
                        'id' => $flashcard->category->id,
                        'name' => $flashcard->category->name,
                        'slug' => $flashcard->category->slug,
                    ] : null,
                ];
            })
            ->toArray();

        return Inertia::render('Flashcards/Index', [
            'categories' => $categories,
            'flashcards' => $flashcards,
            'selectedCategoryId' => $selectedCategoryId ? (int) $selectedCategoryId : null,
        ]);
    }
}
