'use client';

import { useEffect, useState, FormEvent } from 'react';

type Tag = {
  id: number;
  name: string;
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const res = await fetch('http://localhost:8080/api/tags');
    const data = await res.json();
    setTags(data);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tags.length >= 15) {
        setError('タグは15個までです');
        return;
    }

    const res = await fetch('http://localhost:8080/api/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: tagName }),
    });

    if (res.ok) {
      setTagName('');
      fetchTags();
    } else {
      const data = await res.json();
      setError(data.error || '登録失敗');
    }
  };

  const handleDelete = async (id: number) => {
    const ok = confirm('このタグを削除しますか？');
    if (!ok) return;

    const res = await fetch(`http://localhost:8080/api/tags/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchTags();
    } else {
      alert('削除失敗');
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">タグ管理</h1>

        {tags.length <= 15 && (
            <p className="mb-2 text-basic text-red-700 font-bold">
                登録できるタグはあと <span className="font-bold">{15 - tags.length}</span> 個です。
            </p>
        )}

      <form onSubmit={handleSubmit} className="flex space-x-2 mb-6">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="タグ名（30文字以内）"
          className="border p-2 rounded w-full"
        />
        <button
            type="submit"
            disabled={tags.length >= 15 || tagName.trim() === ''}
            className={`px-4 py-2 rounded text-white ${
                tags.length >= 15 || tagName.trim() === ''
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          登録
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-2">
        {tags.map((tag) => (
          <li key={tag.id} className="flex justify-between items-center border p-2 rounded">
            <span>{tag.name}</span>
            <button
              onClick={() => handleDelete(tag.id)}
              className="text-red-500 underline text-sm"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
