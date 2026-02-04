<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestResultController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::get('/flashcards', [FlashcardController::class, 'index'])->name('flashcards.index');
Route::get('/results', [TestResultController::class, 'index'])->name('results.index');
Route::get('/results/{result}', [TestResultController::class, 'show'])->name('results.show');

// Public routes - danh sách và xem đề thi
Route::get('/tests', [TestController::class, 'index'])->name('tests.index');
Route::get('/tests/{test}/take', [TestController::class, 'take'])->name('tests.take');
Route::post('/tests/{test}/results', [TestResultController::class, 'store'])->name('results.store');

// Admin routes - CRUD đề thi (đặt TRƯỚC route show để tránh conflict)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/tests/create', [TestController::class, 'create'])->name('tests.create');
    Route::post('/tests', [TestController::class, 'store'])->name('tests.store');
    Route::get('/tests/{test}/edit', [TestController::class, 'edit'])->name('tests.edit');
    Route::put('/tests/{test}', [TestController::class, 'update'])->name('tests.update');
    Route::delete('/tests/{test}', [TestController::class, 'destroy'])->name('tests.destroy');
});

// Route show phải đặt CUỐI để không conflict với /tests/create
Route::get('/tests/{test}', [TestController::class, 'show'])->name('tests.show');
