import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

// Existing blog articles data
const EXISTING_BLOG_ARTICLES = [
  {
    title: "Day-by-Day Survival Guide for Your First 30 Days of No Contact",
    slug: "30-days-no-contact-survival",
    excerpt: "The first 30 days of no contact can feel like a marathon you didn't train for. Here's your day-by-day survival guide to make it through.",
    content: "The first 30 days of no contact can feel like a marathon you didn't train for. Your brain is literally rewiring itself, creating new neural pathways while old ones slowly fade...",
    category: "no-contact",
    tags: ["no-contact", "healing", "breakup-recovery", "self-improvement"],
    readTime: 8,
    published: true
  },
  {
    title: "The 7 Stages of Breakup Healing (And How to Navigate Each One)",
    slug: "7-stages-breakup-healing",
    excerpt: "Understanding the emotional journey of breakup recovery can help you navigate the process with more self-compassion and clarity.",
    content: "Breakup healing isn't linear, but there are common stages most people experience. Understanding these can help you navigate your journey with more self-compassion...",
    category: "healing",
    tags: ["healing", "breakup-recovery", "emotional-wellness", "psychology"],
    readTime: 10,
    published: true
  },
  {
    title: "Breaking No Contact: Understanding the Consequences",
    slug: "breaking-no-contact-consequences",
    excerpt: "What really happens when you break no contact? A honest look at the psychological and emotional consequences.",
    content: "Breaking no contact can feel tempting, especially during vulnerable moments. But understanding the real consequences can help you make better decisions...",
    category: "no-contact",
    tags: ["no-contact", "boundaries", "self-control", "healing"],
    readTime: 6,
    published: true
  },
  {
    title: "Your Breakup Emergency Kit: What to Do When You're Spiraling",
    slug: "breakup-emergency-kit-spiraling",
    excerpt: "Create your personalized emergency toolkit for those moments when the pain feels overwhelming.",
    content: "We all have those moments when the grief hits like a tsunami. Having an emergency toolkit ready can be the difference between a setback and a breakthrough...",
    category: "coping-strategies",
    tags: ["emergency-tools", "coping-strategies", "self-care", "crisis-management"],
    readTime: 7,
    published: true
  },
  {
    title: "Breakup Hacks: How to Stop Texting Your Ex (That Actually Work)",
    slug: "breakup-hacks-stop-texting-ex",
    excerpt: "Practical, tested strategies to help you resist the urge to reach out when every cell in your body wants to text them.",
    content: "The urge to text your ex can feel overwhelming. Here are proven strategies that actually work to help you maintain no contact...",
    category: "no-contact",
    tags: ["no-contact", "self-control", "boundaries", "practical-tips"],
    readTime: 5,
    published: true
  },
  {
    title: "Emotional Relapses in Recovery: How to Bounce Back Faster",
    slug: "emotional-relapses-recovery",
    excerpt: "Emotional setbacks are normal in healing. Here's how to recognize them and bounce back stronger.",
    content: "Healing isn't linear, and emotional relapses are completely normal. The key is learning how to bounce back faster each time...",
    category: "healing",
    tags: ["emotional-recovery", "resilience", "setbacks", "growth"],
    readTime: 8,
    published: true
  },
  {
    title: "Micro-Healing: Small Daily Shifts That Create Big Changes",
    slug: "micro-healing-emotional-shifts",
    excerpt: "Sometimes the smallest changes create the biggest transformations. Discover the power of micro-healing practices.",
    content: "Big healing doesn't always require big actions. Sometimes the smallest daily shifts create the most profound transformations...",
    category: "self-improvement",
    tags: ["micro-habits", "daily-practices", "small-changes", "healing"],
    readTime: 6,
    published: true
  },
  {
    title: "The Neuroscience of No Contact: What's Really Happening in Your Brain",
    slug: "neuroscience-no-contact-brain",
    excerpt: "Understanding the science behind why no contact works can help you stick to it when it gets difficult.",
    content: "Understanding what's happening in your brain during no contact can help you stick to the process when it gets difficult...",
    category: "psychology",
    tags: ["neuroscience", "brain-science", "no-contact", "psychology"],
    readTime: 9,
    published: true
  },
  {
    title: "The Power of Peer Support in Healing from Heartbreak",
    slug: "peer-support-healing-heartbreak",
    excerpt: "Why connecting with others who understand your experience can accelerate your healing journey.",
    content: "Healing in isolation can feel overwhelming. Peer support provides validation, perspective, and hope when you need it most...",
    category: "community",
    tags: ["peer-support", "community", "connection", "healing"],
    readTime: 7,
    published: true
  },
  {
    title: "How to Rewire Your Brain for Love (After Heartbreak)",
    slug: "rewire-brain-for-love",
    excerpt: "Heartbreak changes your brain, but you can actively rewire it for healthier relationships and deeper self-love.",
    content: "Heartbreak literally changes your brain's neural pathways. But the good news? You can actively rewire it for better relationships...",
    category: "psychology",
    tags: ["neuroplasticity", "self-love", "brain-training", "relationships"],
    readTime: 10,
    published: true
  },
  {
    title: "Self-Care Rituals to Stop Overthinking Your Breakup",
    slug: "self-care-rituals-stop-overthinking",
    excerpt: "Practical self-care rituals designed specifically to quiet the mental noise and overthinking that comes with breakups.",
    content: "Overthinking after a breakup is exhausting. These self-care rituals are designed to quiet your mind and center your energy...",
    category: "self-care",
    tags: ["self-care", "overthinking", "rituals", "mental-health"],
    readTime: 8,
    published: true
  },
  {
    title: "The Urge to Text Your Ex: A Step-by-Step Guide to Resistance",
    slug: "urge-to-text-ex-how-to-stop",
    excerpt: "That overwhelming urge to reach out? Here's a step-by-step process to work through it without breaking no contact.",
    content: "We've all been there - the overwhelming urge to text your ex. Here's a step-by-step process to work through it without compromising your healing...",
    category: "no-contact",
    tags: ["no-contact", "urges", "self-control", "step-by-step"],
    readTime: 6,
    published: true
  }
];

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    let importedCount = 0;

    for (const article of EXISTING_BLOG_ARTICLES) {
      // Check if article already exists by slug
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, article.slug))
        .limit(1);

      if (existing.length === 0) {
        // Import the article
        await db.insert(blogPosts).values({
          id: randomUUID(),
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          tags: article.tags,
          reading_time: article.readTime,
          status: article.published ? 'published' : 'draft',
          author_id: user.id,
          published_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        });
        importedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      total: EXISTING_BLOG_ARTICLES.length,
      message: `Successfully imported ${importedCount} blog articles`
    });

  } catch (error) {
    console.error('Error importing blog articles:', error);
    return NextResponse.json(
      { error: 'Failed to import blog articles' },
      { status: 500 }
    );
  }
}
