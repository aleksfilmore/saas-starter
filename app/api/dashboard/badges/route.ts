import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { badgeProgressDefinitions, computeProgressForBadge, UserAggregateStats } from '@/lib/badges/progress-definitions';
import crypto from 'crypto';

export const revalidate = 0; // dynamic

function etagFor(payload: any){
  const json = JSON.stringify(payload);
  return 'W/"'+crypto.createHash('sha1').update(json).digest('base64').slice(0,27)+'"';
}

export async function GET(req: NextRequest){
  try {
    const { user } = await validateRequest();
    if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userRow = await db.execute(sql`SELECT tier, archetype, profile_badge_id FROM users WHERE id=${user.id}`);
    const u = userRow[0] as any;

  const userBadgeRows = await db.execute(sql`SELECT badge_id FROM user_badges WHERE user_id=${user.id}`);
    const earnedIds = new Set(userBadgeRows.map((r:any)=> r.badge_id));
    const badgeRows = await db.execute(sql`SELECT id, name, icon_url, rarity, kind, is_active, tier_scope, archetype_scope FROM badges WHERE is_active=true AND (tier_scope='both' OR tier_scope=${u.tier}) AND (archetype_scope IS NULL OR archetype_scope=${u.archetype})`);

    // Aggregate stats for progress computations (single roundtrip best-effort; fallbacks default 0)
    // Recompute aggregate stats with defensive fallback if tables missing
    let stats: UserAggregateStats = { totalRituals:0,totalCheckIns:0,totalNoContacts:0,ritualStreak:0,maxRitualStreak:0,ritualSwaps:0,bytesBalance:0 };
    try {
      const aggregates = await db.execute(sql`
        SELECT
          (SELECT COUNT(*) FROM daily_ritual_completions WHERE user_id=${user.id}) AS total_rituals,
          (SELECT COUNT(*) FROM daily_mood_logs WHERE user_id=${user.id}) AS total_check_ins,
          (SELECT COUNT(*) FROM user_daily_actions WHERE user_id=${user.id} AND no_contact = true) AS total_no_contacts,
          (SELECT bytes FROM users WHERE id=${user.id}) AS bytes_balance,
          COALESCE((SELECT ritual_streak FROM users WHERE id=${user.id}),0) AS ritual_streak,
          COALESCE((SELECT ritual_streak FROM users WHERE id=${user.id}),0) AS max_ritual_streak,
          (SELECT COUNT(*) FROM user_ritual_swaps WHERE user_id=${user.id}) AS ritual_swaps
      `);
      const a = aggregates[0] as any;
      stats = {
        totalRituals: Number(a?.total_rituals)||0,
        totalCheckIns: Number(a?.total_check_ins)||0,
        totalNoContacts: Number(a?.total_no_contacts)||0,
        ritualStreak: Number(a?.ritual_streak)||0,
        maxRitualStreak: Number(a?.max_ritual_streak)||0,
        ritualSwaps: Number(a?.ritual_swaps)||0,
        bytesBalance: Number(a?.bytes_balance)||0,
      };
    } catch (aggErr) {
      console.warn('[badges] Aggregate query failed, using zeros fallback', aggErr);
      try {
        const bal = await db.execute(sql`SELECT bytes FROM users WHERE id=${user.id}`);
        stats.bytesBalance = Number((bal[0] as any)?.bytes)||0;
      } catch {}
    }

    const isGhost = u.tier === 'ghost' || u.tier === 'free';
    const badges = badgeRows.map((b:any)=> {
      const base = {
        id: b.id,
        name: b.name,
        icon: b.icon_url,
        unlocked: earnedIds.has(b.id),
        rarity: b.rarity || 'common',
        kind: b.kind || 'progression',
        isProfile: u.profile_badge_id === b.id
      } as any;
      if(!base.unlocked && badgeProgressDefinitions[b.id]){
        const prog = computeProgressForBadge(b.id, stats);
        if(prog){ base.progress = prog; }
        const def = badgeProgressDefinitions[b.id];
        if(isGhost && def.requiresUpgrade){
          base.upgradeLocked = true;
          base.progress = undefined; // hide exact progress behind upgrade
          base.name = '???';
          base.icon = 'swap-cycle'; // neutral icon silhouette alternative
        }
      }
      return base;
    });

    const gatedCount = badges.filter((b:any)=> b.upgradeLocked).length;
    const visibleCount = badges.length - gatedCount;
    const payload = {
      badges,
      meta: {
        total: badges.length,
        unlocked: badges.filter(b=>b.unlocked).length,
        visible: visibleCount,
        gated: gatedCount,
        rarityBreakdown: badges.reduce((acc:any,b:any)=>{acc[b.rarity]=(acc[b.rarity]||0)+1; return acc;},{}),
        unlockedRarityBreakdown: badges.filter((b:any)=>b.unlocked).reduce((acc:any,b:any)=>{acc[b.rarity]=(acc[b.rarity]||0)+1; return acc;},{}),
        progressAttached: true,
        upgradeGated: isGhost,
      }
    };

    const tag = etagFor(payload);
    if(req.headers.get('if-none-match') === tag){
      return new NextResponse(null,{ status:304, headers:{ 'ETag': tag } });
    }
    return NextResponse.json(payload,{ headers:{ 'Cache-Control':'private, max-age=30', 'ETag': tag } });
  } catch (e){
    console.error('Badges endpoint error', e);
    return NextResponse.json({ error: 'Failed to load badges'}, { status: 500 });
  }
}