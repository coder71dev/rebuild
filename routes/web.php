<?php

use App\Http\Controllers\AISuggestController;
use App\Http\Controllers\PageBuilderController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('PageBuilder');
});

Route::post('/pages/publish', [PageBuilderController::class, 'publish'])->name('pages.publish');
Route::post('/ai/suggest', [AISuggestController::class, 'suggest'])->name('ai.suggest');
