<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\PathController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\HomeController;
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
Route::post('/register', [AuthController::class, 'register'])->name('register');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// =========== TRANG DÀNH CHO USER ===========
Route::middleware(['auth'])->group(function () {
    // Path (lộ trình)
    Route::get('/path', [PathController::class, 'index'])->name('path.index');
    Route::put('/path', [PathController::class, 'update'])->name('path.update');
    Route::get('/path/{level}', [PathController::class, 'show'])->name('path.show');

    // Tests
    Route::get('/tests', [TestController::class, 'index'])->name('tests.index');
    Route::get('/tests/{test}', [TestController::class, 'show'])->name('tests.show');

    // Results
    Route::get('/results', [ResultController::class, 'index'])->name('results.index');
    Route::post('/results', [ResultController::class, 'store'])->name('results.store');
    Route::get('/results/{result}', [ResultController::class, 'show'])->name('results.show');

    // Progress
    Route::get('/progress', [ProgressController::class, 'index'])->name('progress.index');

    // Profile
    Route::get('/profile', function () {
        return inertia('Profile/Edit');
    })->name('profile.edit');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
});
// ============================================================


// =========== DASHBOARD ADMIN ===========
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', AdminDashboardController::class)->name('admin.dashboard');

    Route::get('/admin/users', function () {
        return inertia('Admin/Users');
    })->name('admin.users');

    Route::get('/admin/tests', [TestController::class, 'adminIndex'])->name('admin.tests');
    Route::get('/admin/tests/create', [TestController::class, 'create'])->name('tests.create');
    Route::post('/admin/tests', [TestController::class, 'store'])->name('tests.store');
    Route::get('/admin/tests/{test}/edit', [TestController::class, 'edit'])->name('tests.edit');
    Route::put('/admin/tests/{test}', [TestController::class, 'update'])->name('tests.update');
    Route::delete('/admin/tests/{test}', [TestController::class, 'destroy'])->name('tests.destroy');

    // MỚI: Results & Analytics
    Route::get('/admin/results', function () {
        return inertia('Admin/Results');
    })->name('admin.results');
    Route::get('/admin/analytics', function () {
        return inertia('Admin/Analytics');
    })->name('admin.analytics');
});
