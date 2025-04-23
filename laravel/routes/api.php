<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\Tag;

Route::post('/posts', function (Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'nullable|string',
        'tags' => 'nullable|array|max:3',
        'tags.*' => 'nullable|exists:tags,id',
        'image' => 'nullable|image|max:2048', // max 2MB
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('images', 'public');
    }

    $post = Post::create([
        'title' => $validated['title'],
        'body' => $validated['body'] ?? '',
        'image_path' => $imagePath,
    ]);

    $post->tags()->sync($validated['tags'] ?? []);

    return response()->json($post, 201);
});

Route::get('/posts', function () {
    return Post::with('tags')->orderBy('created_at', 'desc')->get();
});

Route::put('/posts/{id}', function (Request $request, $id) {
    $post = Post::findOrFail($id);

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'nullable|string',
        'tags' => 'nullable|array|max:3',
        'tags.*' => 'nullable|exists:tags,id',
        'image' => 'nullable|image|max:2048',
    ]);

    $post->title = $validated['title'];
    $post->body = $validated['body'] ?? '';

    if ($request->hasFile('image')) {
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }
        $post->image_path = $request->file('image')->store('images', 'public');
    }

    $post->save();
    $post->tags()->sync($validated['tags'] ?? []);

    return response()->json(['message' => 'Updated']);
});

Route::delete('/posts/{id}', function ($id) {
    $post = Post::findOrFail($id);

    if ($post->image_path && Storage::disk('public')->exists($post->image_path)) {
        Storage::disk('public')->delete($post->image_path);
    }

    $post->delete();

    return response()->json(['message' => '削除しました']);
});

// タグ

Route::get('/tags', function () {
    return Tag::orderBy('name')->get();
});

Route::post('/tags', function (Request $request) {
    if (Tag::count() >= 15) {
        return response()->json(['error' => 'タグは15個までです'], 400);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:30|unique:tags,name',
    ]);

    $tag = Tag::create($validated);

    return response()->json($tag);
});

Route::delete('/tags/{id}', function ($id) {
    $tag = Tag::findOrFail($id);
    $tag->delete();
    return response()->json(['message' => 'タグ削除完了']);
});
