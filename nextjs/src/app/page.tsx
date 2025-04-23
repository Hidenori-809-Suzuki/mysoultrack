'use client';

import { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';
import type { Tag } from '../types';

type Post = {
  id: number;
  title: string;
  body: string;
  tags: Tag[];
  image_path: string | null;
  created_at: string;
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tokyo',
  });
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);


  useEffect(() => {
    fetch('http://localhost:8080/api/tags')
      .then((res) => res.json())
      .then((data) => setAvailableTags(data));

      fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('http://localhost:8080/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);

    selectedTagIds.forEach((tagId, i) => {
      formData.append(`tags[${i}]`, String(tagId));
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const endpoint = editingId
      ? `http://localhost:8080/api/posts/${editingId}?_method=PUT` // ← Laravel用トリック（PUTメソッドサポート）
      : 'http://localhost:8080/api/posts';

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setTitle('');
      setBody('');
      setImageFile(null);
      setEditingId(null);
      fetchPosts();
    } else {
      alert('更新失敗。Laravelがなにか文句を言ってるかも');
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('本当に削除しますか？');
    if (!confirm) return;

    const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchPosts(); // 最新の一覧に更新
    } else {
      alert('削除失敗。Laravelに怒られたかも');
    }
  };


  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">SoulTrack 🧠</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="本文"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
        <select
          multiple
          value={selectedTagIds.map(String)}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions);
            const ids = options.map((opt) => Number(opt.value)).slice(0, 3);
            setSelectedTagIds(ids);
          }}
          className="w-full border p-2 rounded"
        >
          {availableTags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-lg font-bold">
          {editingId ? '更新' : '投稿'}
        </button>
      </form>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 font-bold">{formatDate(post.created_at)}</p>
            <p className="font-bold">{post.body}</p>
              {post.image_path && (
                <div className='relative w-full max-w-md h-60'>
                  <Image
                    src={`http://localhost:8080/storage/${post.image_path}`}
                    alt="uploaded"
                    fill
                    className="object-contain rounded"
                    unoptimized
                  />
                </div>
              )}
            <div className="mt-2 text-lg text-blue-600 tracking-wide font-semibold">
              {post.tags.map((tag) => (
                <span key={tag.id} className="mr-2">#{tag.name}</span>
              ))}
            </div>
            <div className="mt-3 border-t pt-4">
              <button
                onClick={() => {
                  setTitle(post.title);
                  setBody(post.body);
                  setSelectedTagIds(post.tags.map((tag) => tag.id));
                  setEditingId(post.id);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded mr-6 font-semibold text-lg"
              >
                編集
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold text-lg"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
