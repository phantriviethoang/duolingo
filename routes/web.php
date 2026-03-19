<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LevelController;
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

// =========== EXAMS - LỘ TRÌNH CẤP ĐỘ ===========
Route::middleware(['auth'])->group(function () {
    // Chọn cấp độ
    Route::get('/levels', [LevelController::class, 'index'])->name('levels.index');

    // Danh sách đề theo cấp độ
    Route::get('/levels/{level}/exams', [ExamController::class, 'byLevel'])->name('exams.by-level');

    // Chi tiết exam
    Route::get('/exams/{exam}', [ExamController::class, 'show'])->name('exams.show');

    // Vào phòng thi
    Route::get('/exams/{exam}/take', [ExamController::class, 'take'])->name('exams.take');

    // Nộp bài - phần chính (được bảo vệ bởi policy)
    Route::post('/exams/{exam}/sections/submit', [ExamController::class, 'submitSection'])
        ->name('exams.sections.submit')
        ->middleware('throttle:60,1');
});

// =========== CỦA TESTS (cũ - giữ cho tương thích) ===========
Route::middleware(['auth'])->group(function () {
    // Dashboard tiến độ
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // hien thi ket qua bai lam
    Route::get('/results', [TestResultController::class, 'index'])->name('results.index');

    // chi tiet
    Route::get('/results/{result}', [TestResultController::class, 'show'])->name('results.show');

    // Lấy danh sách câu sai để làm lại
    Route::get('/results/{result}/wrong-questions', [TestResultController::class, 'getWrongQuestions'])->name('results.wrong-questions');

    Route::get('/tests', [TestController::class, 'index'])->name('tests.index');
    Route::get('/tests/{test}', [TestController::class, 'show'])->name('tests.show');
    Route::get('/tests/{test}/take', [TestController::class, 'take'])->name('tests.take');
    Route::post('/tests/{test}/results', [TestResultController::class, 'store'])->name('results.store');
});

// =========== DASHBOARD ADMIN ===========
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', AdminDashboardController::class)->name('admin.dashboard');

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

    Route::get('/admin/users', function () {
        return inertia('Admin/Users');
    })->name('admin.users');
});
