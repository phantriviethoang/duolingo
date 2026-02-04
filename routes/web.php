<?php

use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestResultController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::get('/flashcards', [FlashcardController::class, 'index'])->name('flashcards.index');
Route::get('/results', [TestResultController::class, 'index'])->name('results.index');
Route::get('/results/{result}', [TestResultController::class, 'show'])->name('results.show');

// Route custom phải đặt TRƯỚC resource route để tránh conflict
Route::get('/tests/{test}/take', [TestController::class, 'take'])->name('tests.take');
Route::post('/tests/{test}/results', [TestResultController::class, 'store'])->name('results.store');
Route::resource('/tests', TestController::class);
