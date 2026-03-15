<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestResultController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

//
Route::get('/', HomeController::class)->name('home');
Route::get('/about', function () {
    return inertia('About');
});
Route::get('/contact', function () {
    return inertia('Contact');
});

// auth
Route::get('/register', function () {
    return inertia('Auth/Register');
})->middleware('guest');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// dethi
Route::middleware(['auth'])->group(function () {
    Route::get('/results', [TestResultController::class, 'index'])->name('results.index');
    Route::get('/results/{result}', [TestResultController::class, 'show'])->name('results.show');

    Route::get('/tests', [TestController::class, 'index'])->name('tests.index');
    Route::get('/tests/{test}/take', [TestController::class, 'take'])->name('tests.take');
    Route::post('/tests/{test}/results', [TestResultController::class, 'store'])->name('results.store');
});

// dashboard
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', DashboardController::class)->name('admin.dashboard');

    Route::get('/admin/tests', [TestController::class, 'adminIndex'])->name('admin.tests');
    Route::get('/admin/tests/create', [TestController::class, 'create'])->name('tests.create');
    Route::post('/admin/tests', [TestController::class, 'store'])->name('tests.store');
    Route::get('/admin/tests/{test}/edit', [TestController::class, 'edit'])->name('tests.edit');
    Route::put('/admin/tests/{test}', [TestController::class, 'update'])->name('tests.update');
    Route::delete('/admin/tests/{test}', [TestController::class, 'destroy'])->name('tests.destroy');

    Route::get('/admin/questions', function () {
        return inertia('Admin/Questions');
    })->name('admin.questions');

    Route::get('/admin/users', function () {
        return inertia('Admin/Users');
    })->name('admin.users');
});

Route::get('/tests/{test}', [TestController::class, 'show'])->name('tests.show');
