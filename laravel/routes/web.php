<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Tag;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/laravel-check', function () {
    return 'Laravel is alive!';
});

// ここが重要！！！！ middlewareは "api" だけ
Route::prefix('api')->middleware('api')->group(function () {

    Route::get('/ping', fn () => response()->json(['message' => 'pong']));

    // タグ一覧
    Route::get('/tags', function () {
        return Tag::orderBy('name')->get();
    });

    // タグ作成
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

    // タグ更新
    Route::patch('/tags/{id}', function (Request $request, $id) {
        $tag = Tag::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:30|unique:tags,name,' . $tag->id,
        ]);

        $tag->update(['name' => $validated['name']]);

        return response()->json(['message' => 'タグ更新完了']);
    });

    // タグ削除
    Route::delete('/tags/{id}', function ($id) {
        $tag = Tag::findOrFail($id);
        $tag->delete();
        return response()->json(['message' => 'タグ削除完了']);
    });

});
