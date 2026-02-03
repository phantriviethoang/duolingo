<?php

use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::get('/tests/1', [TestController::class, 'show']);

Route::resource('/tests', TestController::class);
