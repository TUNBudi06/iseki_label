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
    Route::post('mark-as-printed', [HomeController::class, 'markAsPrinted'])->name('home.mark-as-printed');
    Route::get('/about', [AboutController::class, 'index'])->name('about');
    Route::prefix('print')->group(function () {
        Route::get('history', [PrintHistoryController::class, 'index'])->name('print.history');
        Route::get('label',[\App\Http\Controllers\PagePrintController::class,'index'])->name('print.label');
        Route::get('automation',[\App\Http\Controllers\AutoPrintController::class,'index'])->name('print.autoPrint');
    });
});

Route::get('multi-page',function(){
    return Inertia::render('test/MultiPageExample');
});
