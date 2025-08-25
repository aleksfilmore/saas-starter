import { db } from '@/lib/db';
import { users, anonymousPosts, wallPostReactions, wallPostComments, ritualEntries } from '@/lib/db';
import { logSchemaWarning } from '@/lib/db/schema-health-logger';
import { eq, and, gte, count, sql } from 'drizzle-orm';

export async function getDashboardSnapshot(userId: string) {
  const [dbUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if(!dbUser) throw new Error('User not found');
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
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
  // XP/level removed – placeholder level snapshot
  const levelSnapshot = { level: 1, current: 0, next: 0, progressPercent: 0 };
  return {
    user: {
      id: dbUser.id,
      username: dbUser.username || dbUser.email?.split('@')[0] || 'agent',
  level: 1,
  xp: 0,
      bytes: dbUser.bytes,
      noContactStreak: dbUser.noContactDays,
      ritualStreak: dbUser.streak,
      longestStreak: dbUser.longestStreak,
      subscriptionTier: dbUser.tier,
    },
    level: levelSnapshot,
    today: {
      posts: todayPosts[0]?.c || 0,
      reactions: todayReactions[0]?.c || 0,
      comments: todayComments[0]?.c || 0,
      rituals: todayRituals[0]?.c || 0,
    }
  };
}

export async function getEngagementSummary(range: 'today' | '24h' = 'today') {
  const now = new Date();
  const since = range === '24h' ? new Date(now.getTime() - 24*60*60*1000) : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const rawPosts = await db.select().from(anonymousPosts).where(gte(anonymousPosts.createdAt, since)).limit(200);
  const scored = rawPosts.map(p => ({
    id: p.id,
    content: p.content,
    createdAt: p.createdAt,
    reactions: (p.resonateCount||0)+(p.sameLoopCount||0)+(p.draggedMeTooCount||0)+(p.stoneColdCount||0)+(p.cleansedCount||0),
    commentCount: p.commentCount || 0
  }));
  const rising = scored
    .filter(p => p.reactions >= 2)
    .sort((a,b)=> b.reactions - a.reactions || (b.createdAt?.getTime()||0)-(a.createdAt?.getTime()||0))[0] || null;
  return {
    range,
    since: since.toISOString(),
    risingPost: rising ? { id: rising.id, content: rising.content.slice(0,220), reactions: rising.reactions, comments: rising.commentCount } : null,
    totals: {
      posts: scored.length,
      reactions: scored.reduce((acc,p)=> acc + p.reactions, 0),
      comments: scored.reduce((acc,p)=> acc + p.commentCount, 0)
    }
  };
}
