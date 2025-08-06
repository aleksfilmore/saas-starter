// File: app/layout.tsx

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'CTRL+ALT+BLOCK™ | Enhanced Digital Healing Platform',
  description: 'Next-generation therapeutic technology with AI personality adaptation, gamified progress tracking, and viral community healing mechanics. The reprogramming ritual evolved.',
  keywords: 'digital healing, AI therapy, mental health, gamification, community support, emotional wellness, enhanced platform',
  openGraph: {
    title: 'CTRL+ALT+BLOCK™ - Enhanced Digital Healing',
    description: 'Experience the evolution of digital healing with adaptive AI, achievement celebrations, and community-driven recovery.',
    url: 'https://ctrl-alt-block.com',
    siteName: 'CTRL+ALT+BLOCK™',
    images: [
      {
        url: '/hero-illustration.png',
        width: 1200,
        height: 630,
        alt: 'CTRL+ALT+BLOCK™ Enhanced Platform'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CTRL+ALT+BLOCK™ - Enhanced Digital Healing',
    description: 'AI-powered therapy, gamified progress, viral community healing.',
    images: ['/hero-illustration.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark bg-background text-foreground ${manrope.className}`}>
      <body className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
