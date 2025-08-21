import { db } from '@/lib/db';
import { anonymousPosts, wallPostReactions } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export const REACTION_MAP: Record<string, keyof typeof anonymousPosts['_']['columns']> = {
  resonate: 'resonateCount',
  same_loop: 'sameLoopCount',
  dragged_me_too: 'draggedMeTooCount',
  stone_cold: 'stoneColdCount',
  cleansed: 'cleansedCount',
};

export type WallFeedFilter = 'recent' | 'viral' | 'oracle' | 'pulse';

function generateGlitchTitle(category: string): string {
  const titles: Record<string,string> = {
    system_error: '5Y5T3M_3RR0R_D3T3CT3D',
    loop_detected: 'L00P_1NF1N1T3_D3T3CT3D', 
    memory_leak: 'M3M0RY_L34K_1D3NT1F13D',
    buffer_overflow: 'BUFF3R_0V3RFL0W_W4RN1NG',
    syntax_error: '5YNT4X_3RR0R_L1N3_0',
    null_pointer: 'NULL_P01NT3R_3XC3PT10N',
    stack_overflow: '5T4CK_0V3RFL0W_3XC3PT10N',
    access_denied: '4CC355_D3N13D_3RR0R_403'
  };
  return titles[category] || 'UNK0WN_3RR0R';
}

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const m = Math.floor(diff/60000); const h = Math.floor(diff/3600000); const d = Math.floor(diff/86400000);
  if (m < 1) return 'just_transmitted';
  if (m < 60) return `${m}m_ago`;
  if (h < 24) return `${h}h_ago`;
  if (d < 7) return `${d}d_ago`;
  return date.toLocaleDateString();
}

export async function createWallPost(opts: { userId: string; content: string; isAnonymous: boolean; category?: string; }): Promise<any> {
  const { userId, content, isAnonymous, category } = opts;
  const id = crypto.randomUUID();
  const glitchCategory = category || 'system_error';
  const glitchTitle = generateGlitchTitle(glitchCategory);
  await db.insert(anonymousPosts).values({
    id,
    userId: isAnonymous ? null : userId,
    content,
    glitchCategory,
    glitchTitle,
    category: glitchCategory,
    isAnonymous,
  });
  return {
    id,
    content,
    glitchCategory,
    glitchTitle,
    isAnonymous,
    createdAt: new Date(),
    resonateCount: 0,
    sameLoopCount: 0,
    draggedMeTooCount: 0,
    stoneColdCount: 0,
    cleansedCount: 0,
    commentCount: 0,
    totalReactions: 0,
    timeAgo: 'just_transmitted',
    authorId: isAnonymous ? null : userId,
  };
}

export async function reactToPost(opts: { userId: string; postId: string; reactionType: string; }) {
  const { userId, postId, reactionType } = opts;
  if (!REACTION_MAP[reactionType]) throw new Error('Invalid reaction');
  return db.transaction(async (tx) => {
    const [post] = await tx.select().from(anonymousPosts).where(eq(anonymousPosts.id, postId)).limit(1);
    if (!post) throw new Error('Post not found');
    const [existing] = await tx.select().from(wallPostReactions).where(and(eq(wallPostReactions.postId, postId), eq(wallPostReactions.userId, userId))).limit(1);
    let action: 'added'|'removed'|'changed';
    let userReaction: string | null = reactionType;
    const colName = REACTION_MAP[reactionType] as any;
    if (existing) {
      if (existing.reactionType === reactionType) {
        await tx.delete(wallPostReactions).where(eq(wallPostReactions.id, existing.id));
        await tx.update(anonymousPosts).set({ [colName]: Math.max(0, (post as any)[colName] - 1) }).where(eq(anonymousPosts.id, postId));
        action = 'removed';
        userReaction = null;
      } else {
        const oldCol = REACTION_MAP[existing.reactionType];
        await tx.update(wallPostReactions).set({ reactionType }).where(eq(wallPostReactions.id, existing.id));
        await tx.update(anonymousPosts).set({
          [oldCol]: Math.max(0, (post as any)[oldCol] - 1),
          [colName]: (post as any)[colName] + 1,
        }).where(eq(anonymousPosts.id, postId));
        action = 'changed';
      }
    } else {
      await tx.insert(wallPostReactions).values({ id: crypto.randomUUID(), postId, userId, reactionType });
      await tx.update(anonymousPosts).set({ [colName]: (post as any)[colName] + 1 }).where(eq(anonymousPosts.id, postId));
      action = 'added';
    }
    const [updated] = await tx.select().from(anonymousPosts).where(eq(anonymousPosts.id, postId)).limit(1);
    const counts = getReactionCounts(updated as any);
    return { action, updatedCounts: counts, userReaction };
  });
}

function getReactionCounts(p: any) {
  const resonateCount = p.resonateCount || 0;
  const sameLoopCount = p.sameLoopCount || 0;
  const draggedMeTooCount = p.draggedMeTooCount || 0;
  const stoneColdCount = p.stoneColdCount || 0;
  const cleansedCount = p.cleansedCount || 0;
  const totalReactions = resonateCount + sameLoopCount + draggedMeTooCount + stoneColdCount + cleansedCount;
  return { resonateCount, sameLoopCount, draggedMeTooCount, stoneColdCount, cleansedCount, totalReactions };
}

export async function getWallFeed(opts: { userId: string; page: number; limit: number; filter: WallFeedFilter; category?: string | null; }) {
  const { userId, page, limit, filter, category } = opts;
  const offset = (page - 1) * limit;
  let rows = await db.select().from(anonymousPosts).orderBy(anonymousPosts.createdAt).limit(500);
  
  // First sort by creation time, then apply randomization
  rows = rows.sort((a,b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  
  if (category) rows = rows.filter(r => r.glitchCategory === category);
  
  switch (filter) {
    case 'viral':
      rows = rows.filter(r => totalReactions(r) >= 50).sort((a,b)=> totalReactions(b)- totalReactions(a));
      break;
    case 'oracle':
      rows = rows.filter(r => r.isOraclePost === true);
      break;
    case 'pulse':
      const oneDay = Date.now() - 24*60*60*1000;
      rows = rows.filter(r => r.createdAt && r.createdAt.getTime() > oneDay).sort((a,b)=> totalReactions(b)- totalReactions(a));
      break;
    default: 
      // For 'recent' filter, add some randomization while keeping recent posts visible
      // Shuffle posts within categories to avoid "3 per category, one after another"
      const categories: Record<string, any[]> = {};
      rows.forEach(row => {
        if (!categories[row.glitchCategory]) categories[row.glitchCategory] = [];
        categories[row.glitchCategory].push(row);
      });
      
      // Shuffle each category internally
      Object.keys(categories).forEach(cat => {
        categories[cat] = categories[cat].sort(() => Math.random() - 0.5);
      });
      
      // Interleave posts from different categories for better distribution
      const shuffledRows: any[] = [];
      const categoryKeys = Object.keys(categories);
      const maxLength = Math.max(...Object.values(categories).map(arr => arr.length));
      
      for (let i = 0; i < maxLength; i++) {
        // Randomize category order for each round
        const shuffledKeys = [...categoryKeys].sort(() => Math.random() - 0.5);
        shuffledKeys.forEach(key => {
          if (categories[key][i]) {
            shuffledRows.push(categories[key][i]);
          }
        });
      }
      
      rows = shuffledRows;
      break;
  }
  
  const paginated = rows.slice(offset, offset + limit);
  const postIds = paginated.map(p=>p.id);
  const userReactions: Record<string,string> = {};
  if (postIds.length) {
    const reactions = await db.select({ id: wallPostReactions.id, postId: wallPostReactions.postId, reactionType: wallPostReactions.reactionType })
      .from(wallPostReactions)
      .where(and(inArray(wallPostReactions.postId, postIds), eq(wallPostReactions.userId, userId)));
    for (const r of reactions) userReactions[r.postId] = r.reactionType;
  }
  const posts = paginated.map(p => {
    const counts = getReactionCounts(p as any);
    return {
      id: p.id,
      content: p.content,
      glitchCategory: p.glitchCategory,
      glitchTitle: p.glitchTitle,
      isAnonymous: p.isAnonymous,
      createdAt: p.createdAt,
      ...counts,
      commentCount: p.commentCount || 0,
      isOraclePost: p.isOraclePost,
      isFeatured: p.isFeatured,
      authorId: p.userId,
      userReaction: userReactions[p.id] || null,
      timeAgo: formatTimeAgo(p.createdAt as any),
      displayTitle: p.glitchTitle,
      totalReactions: counts.totalReactions,
    };
  });
  return { posts, pagination: { page, limit, hasMore: offset + limit < rows.length }, filter, category: category || null };
}

function totalReactions(p: any) { return (p.resonateCount||0)+(p.sameLoopCount||0)+(p.draggedMeTooCount||0)+(p.stoneColdCount||0)+(p.cleansedCount||0); }
