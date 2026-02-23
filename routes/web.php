<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PrintHistoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RackPartListController;
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

Route::prefix('user')->group(function () {
    Route::get('/login', [\App\Http\Controllers\AuthController::class, 'authUser'])->name('user.login');
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'authUserPost'])->name('user.loginpost');
    Route::get('/logout', [\App\Http\Controllers\AuthController::class, 'logoutUser'])->name('user.logout');

    // User management (admin only)
    Route::prefix('list')->middleware([\App\Http\Middleware\AdminOnlyMiddleware::class])->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user.manage');
        Route::post('/store', [UserController::class, 'store'])->name('user.userStore');
        Route::put('/update', [UserController::class, 'update'])->name('user.userUpdate');
        Route::post('/delete', [UserController::class, 'destroy'])->name('user.userDestroy');
    });
});

Route::prefix('rack')->group(function () {
    Route::get('/',          [RackPartListController::class, 'index'])->name('rack.rackIndex');
    Route::get('/export',    [RackPartListController::class, 'export'])->name('rack.export');
    Route::post('/import',   [RackPartListController::class, 'import'])->name('rack.import');
    Route::get('/template',  [RackPartListController::class, 'template'])->name('rack.template');
});
