<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Post;

Route::post('/posts', function (Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'nullable|string',
        'tags' => 'nullable|array|max:3',
        'tags.*' => 'string|max:50',
    ]);

    $post = Post::create([
        'title' => $validated['title'],
        'body' => $validated['body'] ?? '',
        'tags' => $validated['tags'] ?? [],
    ]);

    return response()->json($post, 201);
});
