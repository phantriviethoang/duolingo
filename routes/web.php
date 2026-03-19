<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\PathController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/about', fn () => inertia('About'));
Route::get('/contact', fn () => inertia('Contact'));

Route::middleware('guest')->group(function () {
    Route::get('/register', fn () => inertia('Auth/Register'));
    Route::post('/register', [AuthController::class, 'register'])->name('register');

    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
});

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');


Route::middleware(['auth'])->group(function () {

    Route::prefix('path')->group(function () {

        // /path -> chọn target ban đầu (50/70/90)
        Route::get('/', [PathController::class, 'target'])
            ->name('path.target');

        // Alias tương thích Ziggy cho code cũ còn gọi path.index
        Route::get('/index', [PathController::class, 'target'])
            ->name('path.index');

        Route::put('/', [PathController::class, 'saveTarget'])
            ->name('path.saveTarget');

        // /path/level -> hiển thị 6 trình độ
        Route::get('/level', [PathController::class, 'levels'])
            ->name('path.levels');

        // /path/A1 -> hiển thị 3 phần (part 1, part 2, part 3)
        Route::get('/{level}', [PathController::class, 'parts'])
            ->whereIn('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
            ->name('path.parts');

        // /path/A1/part-1 -> xem danh sách test của part đã chọn
        Route::get('/{level}/part-{part}', [PathController::class, 'tests'])
            ->whereIn('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
            ->whereIn('part', ['1', '2', '3'])
            ->name('path.tests');

        // /path/A1/test-1/take
        Route::get('/{level}/test-{test}/take', [TestController::class, 'take'])
            ->whereIn('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
            ->whereNumber('test')
            ->name('path.test.take');

        // submit bài
        Route::post('/{level}/test-{test}/submit', [ResultController::class, 'store'])
            ->whereIn('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
            ->whereNumber('test')
            ->name('path.test.submit');
    });

    Route::prefix('results')->group(function () {
        Route::get('/', [ResultController::class, 'index'])->name('results.index');
        Route::get('/{result}', [ResultController::class, 'show'])->name('results.show');
    });

    Route::get('/progress', [ProgressController::class, 'index'])
        ->name('progress.index');

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('profile.index');
        Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
    });

});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    Route::get('/', AdminDashboardController::class)->name('admin.dashboard');

    Route::get('/users', fn () => inertia('Admin/Users'))
        ->name('admin.users');

    // TEST CRUD
    Route::get('/tests', [TestController::class, 'adminIndex'])->name('admin.tests');
    Route::get('/tests/create', [TestController::class, 'create'])->name('tests.create');
    Route::post('/tests', [TestController::class, 'store'])->name('tests.store');
    Route::get('/tests/{test}/edit', [TestController::class, 'edit'])->name('tests.edit');
    Route::put('/tests/{test}', [TestController::class, 'update'])->name('tests.update');
    Route::delete('/tests/{test}', [TestController::class, 'destroy'])->name('tests.destroy');

    Route::get('/results', fn () => inertia('Admin/Results'))->name('admin.results');
    Route::get('/analytics', fn () => inertia('Admin/Analytics'))->name('admin.analytics');
});
