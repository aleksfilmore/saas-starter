export default async function BlogSitemap() {
  // In a real app, you'd fetch this from your CMS or database
  const blogPosts = [
    {
      slug: 'neuroscience-no-contact-brain',
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      slug: 'rewire-brain-for-love',
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      slug: 'toxic-relationship-patterns',
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      slug: 'ai-therapy-vs-traditional-therapy',
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      slug: 'healing-after-narcissistic-abuse',
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      slug: 'self-worth-building-exercises',
      lastModified: new Date(),
      priority: 0.7,
    }
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ctrlaltblock.com';

  return blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: post.priority,
  }));
}
