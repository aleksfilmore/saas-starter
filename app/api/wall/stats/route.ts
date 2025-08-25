import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { anonymousPosts, wallPostReactions } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const buildGuard = process.env.NEXT_PHASE === 'phase-production-build' || process.env.VERCEL === '1';
    if (buildGuard) {
      return NextResponse.json({ activeHealers: 0, heartsGiven: 0, supportMessages: 0, totalPosts: 0, categoryCounts: {} });
    }
    const [{ count: postCount }] = await db.execute<{ count: number }>(sql`SELECT COUNT(*)::int AS count FROM anonymous_posts`);
    let reactionCount = 0;
    try {
      const [{ count }] = await db.execute<{ count: number }>(sql`SELECT COUNT(*)::int AS count FROM wall_post_reactions`);
      reactionCount = count;
    } catch (e) {
      // Table likely missing temporarily; log at info level
      console.warn('wall_post_reactions missing, returning reactionCount=0');
    }
    const categoryRows = await db.execute<{ glitch_category: string; count: number }>(sql`SELECT glitch_category, COUNT(*)::int as count FROM anonymous_posts GROUP BY glitch_category`);
    const categoryCounts: Record<string, number> = {};
    for (const row of categoryRows) categoryCounts[row.glitch_category] = row.count;
    const stats = {
      activeHealers: 100 + Math.floor(postCount / 5),
      heartsGiven: reactionCount,
      supportMessages: postCount * 2,
      totalPosts: postCount,
      categoryCounts
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Wall stats error:', error);
  return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
