<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Post;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/laravel-check', function () {
    return 'Laravel is alive!';
});

Route::prefix('api')->middleware(['api', 'without:csrf'])->group(function () {
    Route::get('/ping', fn () => response()->json(['message' => 'pong']));

    // Route::post('/posts', function (Request $request) {
    //     $validated = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'body' => 'nullable|string',
    //         'tags' => 'nullable|array|max:3',
    //         'tags.*' => 'string|max:50',
    //     ]);

    //     $post = Post::create([
    //         'title' => $validated['title'],
    //         'body' => $validated['body'] ?? '',
    //         'tags' => $validated['tags'] ?? [],
    //     ]);

    //     return response()->json($post, 201);
    // });
});
