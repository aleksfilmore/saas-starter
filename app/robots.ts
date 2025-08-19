import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ctrlaltblock.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/how-it-works',
          '/blog/*',
          '/privacy',
          '/terms'
        ],
        disallow: [
          '/dashboard/*',
          '/admin/*',
          '/api/*',
          '/settings/*',
          '/sign-in',
          '/sign-up',
          '/wall',
          '/ai-therapy/*',
          '/daily-rituals/*',
          '/no-contact/*'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
