import type { Metadata } from "next";
import "./globals.css";
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'SoulTrack',
  description: 'A memory tracking app. Or whatever you think it is.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
