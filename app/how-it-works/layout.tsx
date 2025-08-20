import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works - CTRL+ALT+BLOCK Healing Platform',
  description: 'Discover how CTRL+ALT+BLOCK uses AI therapy, neuroscience, and gamification to help you break toxic relationship patterns. Get personalized healing rituals, track your no-contact streak, and build unshakeable self-worth.',
  keywords: [
    'how it works',
    'toxic relationship recovery',
    'AI therapy platform',
    'healing process',
    'no contact method',
    'neuroscience healing',
    'breakup recovery steps',
    'emotional healing journey',
    'self worth building',
    'relationship trauma recovery'
  ],
  openGraph: {
    title: 'How CTRL+ALT+BLOCK Works - Your Healing Journey',
    description: 'Step-by-step guide to breaking free from toxic patterns using AI therapy, neuroscience, and gamified healing rituals.',
    url: '/how-it-works',
    type: 'article',
    images: [
      {
        url: '/og-how-it-works.png',
        width: 1200,
        height: 630,
        alt: 'CTRL+ALT+BLOCK How It Works Process',
      },
    ],
  },
  twitter: {
    title: 'How CTRL+ALT+BLOCK Works - Your Healing Journey',
    description: 'Step-by-step guide to breaking free from toxic patterns using AI therapy, neuroscience, and gamified healing rituals.',
    images: ['/twitter-how-it-works.png'],
  },
  alternates: {
    canonical: '/how-it-works',
  },
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
