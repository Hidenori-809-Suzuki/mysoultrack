<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/laravel-check', function () {
    return 'Laravel is alive!';
});

Route::prefix('api')->middleware('api')->group(function () {
    Route::get('/ping', fn () => response()->json(['message' => 'pong']));
});
