<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/print-history', function () {
    return Inertia::render('PrintHistory');
})->name('print.history');

Route::get('/multi-page', function () {
    return Inertia::render('MultiPageExample');
})->name('multipage.example');

