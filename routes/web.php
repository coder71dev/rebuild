<?php

use App\Http\Controllers\AISuggestController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('pages.index');
});

Route::resource('pages', PageController::class);
Route::post('/ai/suggest', [AISuggestController::class, 'suggest'])->name('ai.suggest');
