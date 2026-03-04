<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AutoPrintController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoggerPerubahanController;
use App\Http\Controllers\PrintHistoryController;
use App\Http\Controllers\RackController;
use App\Http\Controllers\RackPartListController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminOnlyMiddleware;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect()->route('home');
});

Route::prefix('home')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::post('mark-as-printed', [HomeController::class, 'markAsPrinted'])->name('home.mark-as-printed');
    Route::get('/about', [AboutController::class, 'index'])->name('about');
    Route::prefix('print')->group(function () {
        Route::get('history', [PrintHistoryController::class, 'index'])->name('print.history');
        Route::get('label', [\App\Http\Controllers\PagePrintController::class, 'index'])->name('print.label');
        Route::get('automation', [AutoPrintController::class, 'index'])->name('print.autoPrint');
    });
});

Route::prefix('user')->group(function () {
    Route::get('/login', [\App\Http\Controllers\AuthController::class, 'authUser'])->name('user.login');
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'authUserPost'])->name('user.loginpost');
    Route::get('/logout', [\App\Http\Controllers\AuthController::class, 'logoutUser'])->name('user.logout');

    // User management (admin only)
    Route::prefix('list')->middleware([AdminOnlyMiddleware::class])->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user.manage');
        Route::post('/store', [UserController::class, 'store'])->name('user.userStore');
        Route::put('/update', [UserController::class, 'update'])->name('user.userUpdate');
        Route::post('/delete', [UserController::class, 'destroy'])->name('user.userDestroy');
    });
});

Route::prefix('rack')->middleware([AuthMiddleware::class])->group(function () {
    Route::get('/', [RackPartListController::class, 'index'])->name('rack.rackIndex');
    Route::get('/export', [RackPartListController::class, 'export'])->name('rack.export');
    Route::post('/import', [RackPartListController::class, 'import'])->name('rack.import');
    Route::get('/template', [RackPartListController::class, 'template'])->name('rack.template');
    Route::post('/store', [RackPartListController::class, 'store'])->name('rack.rackStore');
    Route::post('/update/{id}', [RackPartListController::class, 'update'])->name('rack.rackUpdate');
    Route::delete('/delete/{id}', [RackPartListController::class, 'destroy'])->name('rack.rackDestroy');
});

Route::get('/logger-perubahan', [LoggerPerubahanController::class, 'index'])
    ->name('logger-perubahan.logIndex');

Route::delete('/logger-perubahan/{id}', [LoggerPerubahanController::class, 'destroy'])
    ->name('logger-perubahan.logDestroy');

// ─── API Routes (session-based, must be in web.php for session auth) ──────────

Route::prefix('api')->group(function () {
    // Print History
    Route::prefix('print-history')->group(function () {
        Route::post('/reprint/{id}', [PrintHistoryController::class, 'reprintSingle'])->name('api.print-history.reprint-single');
        Route::post('/reprint-multiple', [PrintHistoryController::class, 'reprintMultiple'])->name('api.print-history.reprint-multiple');
        Route::delete('/{id}', [PrintHistoryController::class, 'destroy'])->name('api.print-history.destroy');
        Route::delete('/', [PrintHistoryController::class, 'destroyMultiple'])->name('api.print-history.destroy-multiple');
        Route::post('/return-to-queue/{id}', [PrintHistoryController::class, 'returnToQueue'])->name('api.print-history.return-to-queue');
        Route::post('/return-to-queue-multiple', [PrintHistoryController::class, 'returnToQueueMultiple'])->name('api.print-history.return-to-queue-multiple');
    });

    // Queue Label Prints
    Route::prefix('queue-label-prints')->group(function () {
        Route::delete('/{id}', [HomeController::class, 'destroy'])->name('api.queue-label-prints.destroy');
        Route::patch('/{id}/toggle-auto-print', [HomeController::class, 'toggleAutoPrint'])->name('api.queue-label-prints.toggle-auto-print');
    });

    // Auto Print
    Route::prefix('auto-print')->group(function () {
        Route::get('/list', [AutoPrintController::class, 'getAutoPrintList'])->name('api.auto-print.list-auto');
        Route::post('/mark-as-printed', [AutoPrintController::class, 'markAsPrinted'])->name('api.auto-print.mark-auto-print');
    });

    // Rack
    Route::prefix('rack')->group(function () {
        Route::get('/table-fetching', [RackController::class, 'dataFetching'])->name('api.rack.data-fetching');
        Route::get('single/{id}', [RackController::class, 'getSingleRack'])->name('api.rack.get-single');
    });
});

