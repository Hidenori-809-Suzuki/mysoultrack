'use client';

import { useEffect, useState, FormEvent } from 'react';

type Tag = {
  id: number;
  name: string;
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// XSRF-TOKEN をクッキーから取得して decode
const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch(`${baseURL}/api/tags`, {
        credentials: 'include',
      });
      const data = await res.json();
      setTags(data);
    } catch (error) {
      console.error('タグ取得失敗', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tags.length >= 15) {
      setError('タグは15個までです');
      return;
    }

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      setError('CSRFトークン取得失敗');
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ name: tagName }),
      });

      if (res.ok) {
        setTagName('');
        fetchTags();
      } else {
        const text = await res.text();
        console.error('登録失敗', text);
        setError('登録失敗');
      }
    } catch (error) {
      console.error('登録失敗', error);
      setError('登録失敗');
    }
  };

  const updateTag = async (id: number) => {
    if (!editingTagName.trim()) {
      alert('タグ名を入力してください');
      return;
    }

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      alert('CSRFトークン取得失敗');
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/tags/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ name: editingTagName }),
      });

      if (res.ok) {
        setEditingTagId(null);
        setEditingTagName('');
        fetchTags();
      } else {
        const text = await res.text();
        console.error('更新失敗', text);
        alert('更新失敗！');
      }
    } catch (error) {
      console.error('更新失敗', error);
      alert('更新失敗！');
    }
  };

  const handleDelete = async (id: number) => {
    const ok = confirm('このタグを削除しますか？');
    if (!ok) return;

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      alert('CSRFトークン取得失敗');
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/tags/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
      });

      if (res.ok) {
        fetchTags();
      } else {
        const text = await res.text();
        console.error('削除失敗', text);
        alert('削除失敗');
      }
    } catch (error) {
      console.error('削除失敗', error);
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
          <div key={tag.id} className="flex items-center space-x-2 mb-2">
            {editingTagId === tag.id ? (
              <>
                <input
                  type="text"
                  value={editingTagName}
                  onChange={(e) => setEditingTagName(e.target.value)}
                  className="border p-1 rounded"
                />
                <button
                  onClick={() => {
                    const ok = confirm('このタグ名で更新しますか？');
                    if (!ok) return;
                    updateTag(tag.id);
                  }}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  更新
                </button>
                <button
                  onClick={() => {
                    setEditingTagId(null);
                    setEditingTagName('');
                  }}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{tag.name}</span>
                <button
                  onClick={() => {
                    setEditingTagId(tag.id);
                    setEditingTagName(tag.name);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded font-bold text-sm"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  削除
                </button>
              </>
            )}
          </div>
        ))}
      </ul>
    </main>
  );
}
