<?php

use App\Http\Controllers\GalleryController;
use App\Http\Controllers\LightboxOpenController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\PhotoOrderController;
use Illuminate\Support\Facades\Route;

Route::get('/', [GalleryController::class, 'index'])->name('home');

Route::post('photos/{photo}/lightbox-opens', [LightboxOpenController::class, 'store'])
    ->middleware('throttle:60,1')
    ->name('lightbox-opens.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('photos', [PhotoController::class, 'index'])->name('photos.index');
    Route::post('photos', [PhotoController::class, 'store'])->name('photos.store');
    Route::put('photos/order', [PhotoOrderController::class, 'update'])->name('photos.order.update');
    Route::delete('photos/{photo}', [PhotoController::class, 'destroy'])->name('photos.destroy');
});

require __DIR__.'/settings.php';
