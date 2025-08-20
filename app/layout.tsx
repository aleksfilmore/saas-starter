import "./globals.css";
import ClientProviders from '@/components/ClientProviders';
import ErrorBoundary from '@/components/ErrorBoundary';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'CTRL+ALT+BLOCK™ - Break Toxic Patterns, Build Self-Worth',
    template: '%s | CTRL+ALT+BLOCK™'
  },
  description: 'Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy to help you break toxic relationship patterns and build unshakeable self-worth. Get personalized healing rituals, AI therapy, and anonymous community support.',
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
    'self improvement',
    'narcissistic abuse recovery',
    'emotional trauma healing',
    'mental health app',
    'breakup support',
    'toxic relationship recovery',
    'self-love journey',
    'healing journey',
    'digital therapy platform',
    'relationship recovery app',
    'emotional wellness'
  ],
  authors: [{ name: 'CTRL+ALT+BLOCK Team' }],
  creator: 'CTRL+ALT+BLOCK',
  publisher: 'CTRL+ALT+BLOCK',
  category: 'Mental Health & Wellness',
  classification: 'Health Application',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ctrlaltblock.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CTRL+ALT+BLOCK™ - Break Toxic Patterns, Build Self-Worth',
    description: 'Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy to help you break toxic relationship patterns and build unshakeable self-worth.',
    siteName: 'CTRL+ALT+BLOCK',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CTRL+ALT+BLOCK - Digital Healing Platform for Toxic Relationship Recovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CTRL+ALT+BLOCK™ - Break Toxic Patterns, Build Self-Worth',
    description: 'Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy to help you break toxic relationship patterns.',
    images: ['/twitter-image.png'],
    creator: '@ctrlaltblock',
    site: '@ctrlaltblock',
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
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
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  other: {
    'msapplication-TileColor': '#8B5FE6',
    'msapplication-config': '/browserconfig.xml',
    'google-analytics': 'G-XC7EY4PTX0',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CTRL+ALT+BLOCK" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5FE6" />
        <meta name="background-color" content="#1A1A1F" />
      </head>
      <body>
        <GoogleAnalytics />
        <ErrorBoundary>
          <ClientProviders>
            {children}
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
