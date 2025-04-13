<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;

Route::post('/posts', function (Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'nullable|string',
        'tags' => 'nullable|array|max:3',
        'tags.*' => 'nullable|string|max:50',
        'image' => 'nullable|image|max:2048', // max 2MB
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('images', 'public');
    }

    $post = Post::create([
        'title' => $validated['title'],
        'body' => $validated['body'] ?? '',
        'tags' => $validated['tags'] ?? [],
        'image_path' => $imagePath,
    ]);

    return response()->json($post, 201);
});

Route::get('/posts', function () {
    return Post::orderBy('created_at', 'desc')->get();
});

Route::delete('/posts/{id}', function ($id) {
    $post = Post::findOrFail($id);

    if ($post->image_path && Storage::disk('public')->exists($post->image_path)) {
        Storage::disk('public')->delete($post->image_path);
    }

    $post->delete();

    return response()->json(['message' => '削除しました']);
});
