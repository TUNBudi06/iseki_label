<?php


// API routes for print history
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PrintHistoryController;

Route::prefix('print-history')->group(function () {
    Route::post('/reprint/{id}', [PrintHistoryController::class, 'reprintSingle'])->name('api.print-history.reprint-single');
    Route::post('/reprint-multiple', [PrintHistoryController::class, 'reprintMultiple'])->name('api.print-history.reprint-multiple');
    Route::delete('/{id}', [PrintHistoryController::class, 'destroy'])->name('api.print-history.destroy');
    Route::delete('/', [PrintHistoryController::class, 'destroyMultiple'])->name('api.print-history.destroy-multiple');
});

// API routes for queue management
Route::prefix('queue-label-prints')->group(function () {
    Route::delete('/{id}', [HomeController::class, 'destroy'])->name('api.queue-label-prints.destroy');
});

Route::prefix('auto-print')->group(function () {
    Route::get('/list', [\App\Http\Controllers\AutoPrintController::class, 'getAutoPrintList'])->name('api.auto-print.list-auto');
});
