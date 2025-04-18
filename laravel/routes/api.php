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

Route::put('/posts/{id}', function (Request $request, $id) {
    $post = Post::findOrFail($id);

    $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'nullable|string',
        'tags' => 'nullable|array|max:3',
        'tags.*' => 'nullable|string|max:50',
        'image' => 'nullable|image|max:2048',
    ]);

    $post->title = $request->input('title');
    $post->body = $request->input('body');
    $post->tags = $request->input('tags', []);

    if ($request->hasFile('image')) {
        // 旧画像を削除（画像がある場合のみ）
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $imagePath = $request->file('image')->store('images', 'public');
        $post->image_path = $imagePath;
    }

    $post->save();

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
    return Tag::latest()->get();
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
