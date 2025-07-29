// File: app/layout.tsx

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

export const metadata: Metadata = {
  title: 'CTRL+ALT+BLOCK | The Emotional Reformat',
  description: 'The reprogramming ritual you didn’t know you needed. Fusing savage wit with structured healing to help you reclaim your sanity after heartbreak.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark bg-background text-foreground ${manrope.className}`}>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}