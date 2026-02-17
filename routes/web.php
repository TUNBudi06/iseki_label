<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PrintHistoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect()->route('home');
});

Route::prefix('home')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/about', [AboutController::class, 'index'])->name('about');
    Route::prefix('print')->group(function () {
        Route::get('history', [PrintHistoryController::class, 'index'])->name('print.history');
        Route::get('label',[\App\Http\Controllers\PagePrintController::class,'index'])->name('print.label');
        Route::get('automation',[\App\Http\Controllers\AutoPrintController::class,'index'])->name('print.autoPrint');
    });
});

// API routes for print history
Route::prefix('api/print-history')->group(function () {
    Route::post('/reprint/{id}', [PrintHistoryController::class, 'reprintSingle'])->name('api.print-history.reprint-single');
    Route::post('/reprint-multiple', [PrintHistoryController::class, 'reprintMultiple'])->name('api.print-history.reprint-multiple');
    Route::delete('/{id}', [PrintHistoryController::class, 'destroy'])->name('api.print-history.destroy');
    Route::delete('/', [PrintHistoryController::class, 'destroyMultiple'])->name('api.print-history.destroy-multiple');
});

// API routes for queue management
Route::prefix('api/queue-label-prints')->group(function () {
    Route::delete('/{id}', [HomeController::class, 'destroy'])->name('api.queue-label-prints.destroy');
});

Route::get('multi-page',function(){
    return Inertia::render('test/MultiPageExample');
});
