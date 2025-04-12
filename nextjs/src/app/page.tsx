'use client';

import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">SoulTrack 🧠</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">{post.created_at}</p>
            <p>{post.body}</p>
            <div className="mt-2 text-sm text-blue-600">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="mr-2">#{tag}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
