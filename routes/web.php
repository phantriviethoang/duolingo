<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LevelController;
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

// =========== ⭐ PHẦN MỚI: CHỌN TRÌNH ĐỘ & ROADMAP ===========
//
// Flow:
// /select-level → Chọn target_level (Trung bình/Khá/Tốt = 60%/75%/90%)
//      ↓ POST
// /select-target-level → Lưu users.target_level = ...
//      ↓ Redirect
// /roadmap → Hiển thị danh sách levels + exams + unlock logic
//      ↓ Click "Làm bài"
// /levels/{level}/exams → Danh sách bộ đề theo level
//      ↓ Click bộ đề
// /exams/{exam} → Chi tiết bộ đề
//      ↓ Nút "Bắt đầu"
// /exams/{exam}/take → Làm bài trắc nghiệm (2 sections)
//      ↓ Nộp bài
// /exams/{exam}/sections/submit → Tính điểm + unlock phần tiếp
//      ↓ Redirect
// /exams/results → Hiển thị kết quả
//
Route::middleware(['auth'])->group(function () {
    // 1. Chọn trình độ
    Route::get('/select-level', [LevelSelectionController::class, 'create'])->name('level-selection.create');
    Route::post('/select-target-level', [LevelSelectionController::class, 'store'])->name('level-selection.store');

    // 2. Roadmap - danh sách các levels
    Route::get('/roadmap', [LevelController::class, 'index'])->name('roadmap.index');

    // 3. Danh sách đề theo level
    Route::get('/levels/{level}/exams', [ExamController::class, 'byLevel'])->name('exams.by-level');

    // 4. Chi tiết exam
    Route::get('/exams/{exam}', [ExamController::class, 'show'])->name('exams.show');

    // 5. Vào phòng thi (2 sections/exam)
    Route::get('/exams/{exam}/take', [ExamController::class, 'take'])->name('exams.take');

    // 6. Nộp bài - tính điểm + unlock phần tiếp theo
    Route::post('/exams/{exam}/sections/submit', [ExamController::class, 'submitSection'])
        ->name('exams.sections.submit')
        ->middleware('throttle:60,1');

    // 7. Trang kết quả (pass/fail)
    Route::get('/exams/results', function () {
        return inertia('Quiz/Results');
    })->name('exams.results');
});
// ============================================================

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
