<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect()->route('home');
});

Route::prefix('home')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/about', [AboutController::class, 'index'])->name('about');
    Route::get('/print-history', function () {
        return Inertia::render('PrintHistory');
    })->name('print.history');
    Route::get('/print-label',[\App\Http\Controllers\PagePrintController::class,'index'])->name('print.label');
});
