import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NovelCraft - AI Writing Assistant',
  description: 'AI-powered web novel creation assistant built with Next.js and GPT-4o',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
