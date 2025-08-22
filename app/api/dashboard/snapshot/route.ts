import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { anonymousPosts, wallPostReactions, wallPostComments, ritualEntries, users } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { logSchemaWarning } from '@/lib/db/schema-health-logger';
import { eq, and, gte, count } from 'drizzle-orm';

export const runtime = 'nodejs';

// GET /api/dashboard/snapshot
export async function GET(req: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    if(!user || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.userId;

    const [dbUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if(!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  // Detect if reactions / comments tables exist (may be absent temporarily after a destructive migration)
  let reactionsTableExists = true;
  let commentsTableExists = true;
  let ritualEntriesTableExists = true;
  try { await db.execute(sql`SELECT 1 FROM wall_post_reactions LIMIT 1`); } catch { reactionsTableExists = false; logSchemaWarning('missing:wall_post_reactions', "Table 'wall_post_reactions' missing; returning 0 counts."); }
  try { await db.execute(sql`SELECT 1 FROM wall_post_comments LIMIT 1`); } catch { commentsTableExists = false; logSchemaWarning('missing:wall_post_comments', "Table 'wall_post_comments' missing; returning 0 counts."); }
  try { await db.execute(sql`SELECT 1 FROM ritual_entries LIMIT 1`); } catch { ritualEntriesTableExists = false; logSchemaWarning('missing:ritual_entries', "Table 'ritual_entries' missing; returning 0 counts."); }

    const [todayPosts, todayReactions, todayComments, todayRituals] = await Promise.all([
      db.select({ c: count(anonymousPosts.id) }).from(anonymousPosts).where(and(eq(anonymousPosts.userId, userId), gte(anonymousPosts.createdAt, startOfDay))),
      reactionsTableExists
        ? db.select({ c: count(wallPostReactions.id) }).from(wallPostReactions).where(and(eq(wallPostReactions.userId, userId), gte(wallPostReactions.createdAt, startOfDay)))
        : Promise.resolve([{ c: 0 }]),
      commentsTableExists
        ? db.select({ c: count(wallPostComments.id) }).from(wallPostComments).where(and(eq(wallPostComments.userId, userId), gte(wallPostComments.createdAt, startOfDay)))
        : Promise.resolve([{ c: 0 }]),
      ritualEntriesTableExists
        ? db.select({ c: count(ritualEntries.id) }).from(ritualEntries).where(and(eq(ritualEntries.userId, userId), gte(ritualEntries.performedAt, startOfDay)))
        : Promise.resolve([{ c: 0 }])
    ]);

    // Calculate level based on Bytes (every 1000 bytes = 1 level)
    const level = Math.floor((dbUser.bytes || 0) / 1000) + 1;
    const currentLevelBytes = (dbUser.bytes || 0) % 1000;
    const nextLevelBytes = 1000;

    return NextResponse.json({
      user: {
        id: dbUser.id,
        username: dbUser.username || dbUser.email?.split('@')[0] || 'agent',
        level: level,
        xp: dbUser.bytes, // Use bytes as XP for compatibility
        bytes: dbUser.bytes,
        noContactStreak: dbUser.noContactDays,
        ritualStreak: dbUser.streak,
        longestStreak: dbUser.longestStreak,
        subscriptionTier: dbUser.tier,
      },
      level: {
        current: level,
        progress: currentLevelBytes,
        progressMax: nextLevelBytes,
        progressPercent: Math.floor((currentLevelBytes / nextLevelBytes) * 100)
      },
      today: {
        posts: todayPosts[0]?.c || 0,
        reactions: todayReactions[0]?.c || 0,
        comments: todayComments[0]?.c || 0,
        rituals: todayRituals[0]?.c || 0,
      }
    });
  } catch (e) {
    console.error('Dashboard snapshot error', e);
    return NextResponse.json({ error: 'Failed to build snapshot' }, { status: 500 });
  }
}
