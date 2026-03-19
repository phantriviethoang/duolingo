<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\CEFRProgressController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LevelSelectionController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestQuestionController;
use App\Http\Controllers\TestResultController;
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
    // 1. Chọn trình độ (CŨ)
    Route::get('/select-level', [LevelSelectionController::class, 'create'])->name('level-selection.create');
    Route::post('/select-target-level', [LevelSelectionController::class, 'store'])->name('level-selection.store');

    // 2. CEFR Progress System - Đổi prefix thành /path
    Route::get('/path', [CEFRProgressController::class, 'index'])->name('cefr.index');
    Route::get('/path/select-level', [CEFRProgressController::class, 'selectLevel'])->name('cefr.select-level');
    Route::post('/path/select-level', [CEFRProgressController::class, 'storeSelectedLevel'])->name('cefr.store-level');
    Route::get('/path/{level}', [CEFRProgressController::class, 'showLevel'])->name('cefr.level');
    Route::get('/path/{level}/part/{part}/start', [CEFRProgressController::class, 'startPart'])->name('cefr.start-part');
    Route::post('/path/{level}/part/{part}/complete', [CEFRProgressController::class, 'completePart'])->name('cefr.complete-part');

    // CẬP NHẬT TỪ /exams -> /tests
    Route::get('/tests', [TestController::class, 'index'])->name('tests.index'); // Danh sách tất cả tests
    Route::get('/tests/{exam}', [ExamController::class, 'show'])->name('exams.show');
    Route::get('/tests/{exam}/take', [ExamController::class, 'take'])->name('exams.take');
    Route::post('/tests/{exam}/sections/submit', [ExamController::class, 'submitSection'])
        ->name('exams.sections.submit')
        ->middleware('throttle:60,1');

    // CẬP NHẬT TỪ /dashboard -> /progress
    Route::get('/progress', [DashboardController::class, 'index'])->name('dashboard');

    // THÔNG TIN PROFILE
    Route::get('/profile', function () {
        return inertia('Profile/Edit');
    })->name('profile.edit');

    // RESULTS
    Route::get('/results', [TestResultController::class, 'index'])->name('results.index');
    Route::get('/results/{result}', [TestResultController::class, 'show'])->name('results.show');
    Route::get('/results/{result}/wrong-questions', [TestResultController::class, 'getWrongQuestions'])->name('results.wrong-questions');
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

    Route::get('/admin/questions', [TestQuestionController::class, 'adminIndex'])->name('admin.questions');
    Route::get('/admin/questions/create', [TestQuestionController::class, 'create'])->name('questions.create');
    Route::post('/admin/questions', [TestQuestionController::class, 'store'])->name('questions.store');
    Route::get('/admin/questions/{testQuestion}/edit', [TestQuestionController::class, 'edit'])->name('questions.edit');
    Route::put('/admin/questions/{testQuestion}', [TestQuestionController::class, 'update'])->name('questions.update');
    Route::delete('/admin/questions/{testQuestion}', [TestQuestionController::class, 'destroy'])->name('questions.destroy');

    // MỚI: Results & Analytics
    Route::get('/admin/results', function () {
        return inertia('Admin/Results');
    })->name('admin.results');
    Route::get('/admin/analytics', function () {
        return inertia('Admin/Analytics');
    })->name('admin.analytics');
});
