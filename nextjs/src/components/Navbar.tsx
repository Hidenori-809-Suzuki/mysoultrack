'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 mb-6">
      <div className="container mx-auto">
        <ul className="flex justify-center space-x-8">
          <li>
            <Link href="/" className="hover:underline">
              管理パネル
            </Link>
          </li>
          <li>
            <Link href="/posts" className="hover:underline">
              投稿ページ
            </Link>
          </li>
          <li>
            <Link href="/tags" className="hover:underline">
              タグ管理
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
