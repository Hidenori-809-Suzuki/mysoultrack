// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SoulTrack 管理パネル</h1>
      <ul className="space-y-4 text-blue-600 text-lg">
        <li>
          <Link href="/posts" className="hover:underline">投稿ページ</Link>
        </li>
        <li>
          <Link href="/tags" className="hover:underline">タグ管理</Link>
        </li>
      </ul>
    </main>
  );
}
