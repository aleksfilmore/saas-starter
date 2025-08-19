import "./globals.css";
import ClientProviders from '@/components/ClientProviders';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'CTRL+ALT+BLOCK™ - Break Toxic Patterns, Build Self-Worth',
    template: '%s | CTRL+ALT+BLOCK™'
  },
  description: 'Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy to help you break toxic relationship patterns and build unshakeable self-worth.',
  keywords: [
    'toxic relationships',
    'no contact',
    'self worth',
    'healing',
    'neuroscience',
    'AI therapy',
    'breakup recovery',
    'emotional healing',
    'relationship trauma',
    'self improvement'
  ],
  authors: [{ name: 'CTRL+ALT+BLOCK Team' }],
  creator: 'CTRL+ALT+BLOCK',
  publisher: 'CTRL+ALT+BLOCK',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ctrlaltblock.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CTRL+ALT+BLOCK™ - Break Toxic Patterns, Build Self-Worth',
    description: 'Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy to help you break toxic relationship patterns.',
    siteName: 'CTRL+ALT+BLOCK',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CTRL+ALT+BLOCK - Digital Healing Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CTRL+ALT+BLOCK™ - Break Toxic Patterns, Build Self-Worth',
    description: 'Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy.',
    images: ['/twitter-image.png'],
    creator: '@ctrlaltblock',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7C3AED" />
      </head>
      <body>
        <ErrorBoundary>
          <ClientProviders>
            {children}
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
