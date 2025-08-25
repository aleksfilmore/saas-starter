import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { dailyRitualService } from '@/lib/rituals/daily-ritual-service-drizzle';
import { PAID_RITUALS_DATABASE } from '@/lib/rituals/paid-rituals-database';
import { RITUAL_BANK } from '@/lib/rituals/ritual-bank';

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const m = Math.floor(diff/60000); 
  const h = Math.floor(diff/3600000); 
  const d = Math.floor(diff/86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString();
}

// Helper function to get human-readable emotion tag from glitch category
function getEmotionTagFromCategory(category: string): string {
  const emotionMap: Record<string, string> = {
    'system_error': 'Breaking Down',
    'memory_leak': 'Breakthrough',
    'buffer_overflow': 'Overwhelmed',
    'loop_detected': 'Stuck Pattern',
    'syntax_error': 'Confusion',
    'null_pointer': 'Empty Inside',
    'stack_overflow': 'Too Much',
    'access_denied': 'Blocked Out'
  };
  return emotionMap[category] || 'Raw Emotion';
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  // Get fresh user data using SQL (include last_no_contact_checkin if exists for threat logic)
    const userDataResult = await db.execute(sql`
      SELECT 
        id, email, tier, archetype, bytes,
        ritual_streak, no_contact_streak, profile_badge_id,
        last_checkin, last_ritual, created_at, last_no_contact_checkin, no_contact_days
      FROM users 
      WHERE id = ${user.id}
    `);

    if (userDataResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDataResult[0] as any;

  // XP system removed: bytes & badges only

    // Calculate streaks using correct field names
  const ritualStreak = userData.ritual_streak || 0;
  const noContactStreak = userData.no_contact_streak || userData.no_contact_days || 0;

    // Unified daily rituals (premium = 2 guided, free = 1 lightweight)
    const isFirewall = userData.tier === 'firewall' || userData.tier === 'premium';
  let todaysRituals: Array<{ id: string; title: string; difficulty: 'easy'|'medium'|'hard'; completed: boolean; duration?: string; category?: string }>= [];
  let canReroll = false; let paidAssignmentId: number | undefined = undefined;
    let firewallSyntheticNeeded = false;
    try {
      if (isFirewall) {
  const paid = await dailyRitualService.getTodaysRituals(user.id);
  paidAssignmentId = (paid.assignments as any)?.id;
  todaysRituals = paid.rituals.map(r => ({
          id: r.ritual.id,
            title: r.ritual.title,
            difficulty: r.ritual.difficulty === 'beginner' ? 'easy' : r.ritual.difficulty === 'intermediate' ? 'medium' : 'hard',
            completed: r.state === 'completed',
            duration: r.ritual.estimatedMinutes ? `${r.ritual.estimatedMinutes} min` : undefined,
            category: r.ritual.category
        }));
        canReroll = paid.canReroll;
        // Fallback: if somehow no rituals were returned, force create one random pair
        if (!todaysRituals.length) {
          try {
            const paid2 = await dailyRitualService.getTodaysRituals(user.id);
            paidAssignmentId = (paid2.assignments as any)?.id;
            todaysRituals = paid2.rituals.map(r => ({
              id: r.ritual.id,
              title: r.ritual.title,
              difficulty: r.ritual.difficulty === 'beginner' ? 'easy' : r.ritual.difficulty === 'intermediate' ? 'medium' : 'hard',
              completed: r.state === 'completed',
              duration: r.ritual.estimatedMinutes ? `${r.ritual.estimatedMinutes} min` : undefined,
              category: r.ritual.category
            }));
          } catch {}
        }
        // Absolute fallback: if still empty, randomly select two paid rituals (distinct) so UI never shows blank
        if (!todaysRituals.length) {
          try {
            const pool = PAID_RITUALS_DATABASE.slice();
            if (pool.length >= 2) {
              // simple shuffle
              for (let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
              const pick = pool.slice(0,2);
              todaysRituals = pick.map(r=>({
                id: r.id,
                title: r.title,
                difficulty: r.difficulty === 'beginner' ? 'easy' : r.difficulty === 'intermediate' ? 'medium' : 'hard',
                completed: false,
                duration: r.estimatedMinutes ? `${r.estimatedMinutes} min` : undefined,
                category: r.category
              }));
              canReroll = true; // allow reroll since these are synthetic
              console.warn('[hub] Used synthetic paid ritual fallback for user', user.id);
            }
          } catch (e) {
            console.error('[hub] Failed synthetic ritual fallback', e);
          }
        }
      } else {
        // Ghost user daily ritual using new ghost_daily_assignments table (stable until local midnight)
  const timezone = userData.timezone || 'UTC';
  const now = new Date();
  // Compute YYYY-MM-DD in user timezone reliably
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year:'numeric', month:'2-digit', day:'2-digit' });
  const todayLocal = fmt.format(now); // already YYYY-MM-DD for en-CA
        let assignment: any[] = [];
        try {
          assignment = await db.execute(sql`SELECT ritual_id FROM ghost_daily_assignments WHERE user_id = ${user.id} AND assigned_date = ${todayLocal}`);
        } catch {}
        let ritualId = assignment[0]?.ritual_id as string | undefined;
        if (!ritualId) {
          // gather recent last 7 days to avoid repeats
          let recent: string[] = [];
          try {
            const rows: any[] = await db.execute(sql`SELECT ritual_id, last_assigned_date FROM user_ritual_history WHERE user_id = ${user.id} AND last_assigned_date >= (CURRENT_DATE - INTERVAL '7 days')`);
            recent = rows.map(r=> r.ritual_id);
          } catch {}
          const free = RITUAL_BANK.filter(r=> r.tier==='ghost');
          const pool = free.filter(r=> !recent.includes(r.id));
          const pick = (pool.length? pool: free)[Math.floor(Math.random()* (pool.length? pool.length: free.length))];
          ritualId = pick.id;
          // Concurrency guard / retry for race conditions
          for (let attempt=0; attempt<3; attempt++) {
            try {
              await db.execute(sql`INSERT INTO ghost_daily_assignments (user_id, assigned_date, timezone, ritual_id) VALUES (${user.id}, ${todayLocal}, ${timezone}, ${ritualId}) ON CONFLICT (user_id, assigned_date) DO NOTHING`);
              await db.execute(sql`INSERT INTO user_ritual_history (user_id, ritual_id, last_assigned_date, completion_count) VALUES (${user.id}, ${ritualId}, CURRENT_DATE, 0) ON CONFLICT (user_id, ritual_id) DO UPDATE SET last_assigned_date = EXCLUDED.last_assigned_date`);
              break;
            } catch (e) {
              if (attempt === 2) console.error('ghost assignment concurrency failure', e);
              await new Promise(r=> setTimeout(r, 25 * (attempt+1)));
            }
          }
        }
        const ritualDef = RITUAL_BANK.find(r=> r.id === ritualId) || RITUAL_BANK.find(r=> r.tier==='ghost');
        if (ritualDef) {
          const diff = ritualDef.difficultyLevel <=2 ? 'easy' : ritualDef.difficultyLevel ===3 ? 'medium' : 'hard';
          todaysRituals = [{ id: ritualDef.id, title: ritualDef.title, difficulty: diff, completed: false, duration: ritualDef.estimatedTime, category: ritualDef.category }];
        }
      }
    } catch (e) {
      console.error('Failed to build ritual list:', e);
      if (isFirewall) firewallSyntheticNeeded = true; // mark for fallback after catch
      todaysRituals = [];
    }
    // Final synthetic firewall fallback (outer) if everything failed
    if (isFirewall && !todaysRituals.length) {
      try {
        const pool = PAID_RITUALS_DATABASE.slice();
        if (pool.length >= 2) {
          for (let i=pool.length-1;i>0;i--){ const j=Math.random()* (i+1) | 0; [pool[i],pool[j]]=[pool[j],pool[i]]; }
          const pick = pool.slice(0,2);
          todaysRituals = pick.map(r=>({
            id: r.id,
            title: r.title,
            difficulty: r.difficulty === 'beginner' ? 'easy' : r.difficulty === 'intermediate' ? 'medium' : 'hard',
            completed: false,
            duration: r.estimatedMinutes ? `${r.estimatedMinutes} min` : undefined,
            category: r.category
          }));
          canReroll = true;
          console.warn('[hub] Applied outer synthetic ritual fallback for user', user.id);
        }
      } catch (e2) {
        console.error('[hub] Outer synthetic fallback failed', e2);
      }
    }

    // Get real wall posts with emotion categories
    let wallPosts = [];
    try {
      const wallPostsResult = await db.execute(sql`
        SELECT 
          id, content, glitch_category, glitch_title, created_at,
          resonate_count, same_loop_count, dragged_me_too_count, 
          stone_cold_count, cleansed_count
        FROM anonymous_posts 
        WHERE is_active = true
        ORDER BY created_at DESC 
        LIMIT 8
      `);

      wallPosts = wallPostsResult.map((post: any) => {
        const timeAgo = formatTimeAgo(new Date(post.created_at));
        const totalReactions = (post.resonate_count || 0) + (post.same_loop_count || 0) + 
                              (post.dragged_me_too_count || 0) + (post.stone_cold_count || 0) + 
                              (post.cleansed_count || 0);
        
        return {
          id: post.id,
          content: post.content,
          glitchCategory: post.glitch_category,
          glitchTitle: post.glitch_title,
          emotionTag: getEmotionTagFromCategory(post.glitch_category),
          timeAgo: timeAgo,
          reactions: totalReactions,
          anonymous: true
        };
      });
    } catch (error) {
      console.error('Failed to fetch real wall posts:', error);
      // Fallback to mock wall posts with emotion categories
      wallPosts = [
        {
          id: '1',
          content: 'Just realized I deserve better treatment. Small win but it feels huge.',
          glitchCategory: 'memory_leak',
          emotionTag: 'Breakthrough Moment',
          timeAgo: '2m',
          reactions: 8,
          anonymous: true
        },
        {
          id: '2',
          content: 'Three weeks no contact. The urge to text is still there but getting weaker.',
          glitchCategory: 'system_error',
          emotionTag: 'Progress Update',
          timeAgo: '15m',
          reactions: 12,
          anonymous: true
        },
        {
          id: '3',
          content: 'Had my first boundary conversation today. Scary but proud of myself.',
          glitchCategory: 'buffer_overflow',
          emotionTag: 'Courage Moment',
          timeAgo: '1h',
          reactions: 15,
          anonymous: true
        }
      ];
    }

    // Badges removed from primary payload (loaded lazily via /api/dashboard/badges)
  let badges = [] as any[];
    try {
      // Import from the correct schema location
      const userBadgeData = await db.execute(sql`
        SELECT badge_id, earned_at 
        FROM user_badges 
        WHERE user_id = ${user.id}
      `);

      // Get badge details
      const allBadges = await db.execute(sql`
        SELECT id, name, icon_url, is_active, tier_scope, archetype_scope, rarity, kind
        FROM badges
        WHERE is_active = true
          AND (tier_scope = 'both' OR tier_scope = ${userData.tier})
          AND (archetype_scope IS NULL OR archetype_scope = ${userData.archetype})
      `);

      const earnedBadgeIds = new Set(userBadgeData.map((b: any) => b.badge_id));
      
      badges = allBadges.map((badge: any) => ({
        id: badge.id,
        name: badge.name,
        icon: badge.icon_url,
        unlocked: earnedBadgeIds.has(badge.id),
        rarity: badge.rarity || 'common',
        kind: badge.kind || 'progression',
        isProfile: userData.profile_badge_id === badge.id
      }));
    } catch (error) {
      console.error('Failed to fetch real badges:', error);
      // Fallback to mock badges
    badges = [
        {
          id: '1',
          name: 'First Steps',
          icon: '👟',
      unlocked: (userData.bytes || 0) >= 50,
      rarity: 'common'
        },
        {
          id: '2',
          name: 'Week Warrior',
          icon: '⚔️',
      unlocked: ritualStreak >= 7,
      rarity: 'common'
        },
        {
          id: '3',
          name: 'AI Explorer',
      icon: '🤖',
      unlocked: true,
      rarity: 'rare'
        },
        {
          id: '4',
          name: 'No Contact Champion',
          icon: '🛡️',
      unlocked: noContactStreak >= 30,
      rarity: 'rare'
        },
        {
          id: '5',
          name: 'Community Helper',
          icon: '❤️',
      unlocked: (userData.bytes || 0) >= 500,
      rarity: 'legendary'
        }
      ];
    }

    // Generate daily insight based on user's progress
    const insights = [
      "Your consistent ritual practice is building new neural pathways. Each small action compounds.",
      "Progress isn't always linear. Celebrate the small victories on your healing journey.",
      "Remember: You're not broken, you're breaking free from patterns that no longer serve you.",
      "Every boundary you set is a gift to your future self.",
      "The fact that you're here shows incredible courage and self-awareness."
    ];
    
    const dailyInsight = insights[Math.floor(Math.random() * insights.length)];

    // Calculate motivation meter
  const recentActivity = Math.min(10, ritualStreak + ((userData.bytes || 0) % 50) / 10);
    const motivationLevel = Math.max(1, Math.min(10, Math.floor(recentActivity) + 1));
    
    const motivationMessages = [
      'Just Getting Started', 'Building Momentum', 'Finding Your Rhythm', 
      'Making Progress', 'Steady Growth', 'Strong Foundation', 
      'Momentum Building!', 'On Fire!', 'Unstoppable!', 'Transformation Master!'
    ];

    // Real completed rituals count (simplified)
    let completedRituals = 0;
    try {
      const countResult = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM user_ritual_assignments 
        WHERE user_id = ${user.id} AND completed_at IS NOT NULL
      `);
      completedRituals = (countResult[0] as any)?.count || 0;
    } catch (e) {
      console.warn('Failed to count completed rituals, using streak estimate');
      completedRituals = ritualStreak * 3;
    }

    // Build simplified streak history
    let streakHistory: Array<{ date: string; completed: boolean }> = [];
    try {
      const days = 14;
      for (let i = 0; i < days; i++) {
        const daysAgo = 13 - i;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const inStreak = daysAgo < ritualStreak;
        streakHistory.push({ 
          date: date.toISOString().slice(0,10), 
          completed: inStreak 
        });
      }
    } catch (e) {
      console.warn('Failed to build streak history');
      streakHistory = [];
    }

    // today actions
    let todayActionsRow: any = null;
    try {
      const t = await db.execute(sql`SELECT checkin, no_contact, ritual, wall_interact, ai_chat, wall_post FROM user_daily_actions WHERE user_id = ${user.id} AND action_date = CURRENT_DATE`);
      todayActionsRow = t[0] || null;
    } catch {}

    // Determine streak threat (threatened if last_no_contact_checkin > 36h ago)
    let noContactThreat = false; let hoursSinceCheck=0; let shieldAvailable=false;
    if (userData.last_no_contact_checkin) {
      const last = new Date(userData.last_no_contact_checkin);
      hoursSinceCheck = (Date.now() - last.getTime())/36e5;
      if (hoursSinceCheck >= 36) noContactThreat = true; else if (hoursSinceCheck >= 24) shieldAvailable = true;
    } else {
      noContactThreat = true; // never checked in
    }

  // Derive totals & bytes economy & mood
  let totalCheckIns = 0, bytesToday = 0, bytes7d = 0, bytes30d = 0; let moodToday: any = null;
  let moodSeries30: Array<{ date: string; mood: number | null }> = [];
  let moodAvg7 = null as number | null; let moodAvg30 = null as number | null;
    try {
      const r = await db.execute(sql`SELECT COUNT(*) as c FROM user_daily_actions WHERE user_id = ${user.id} AND checkin = true`);
      totalCheckIns = parseInt(((r[0] as any)?.c ?? '0').toString(),10);
    } catch {}
    try {
      const m = await db.execute(sql`SELECT mood, notes FROM daily_mood_logs WHERE user_id = ${user.id} AND log_date = CURRENT_DATE`);
      moodToday = m[0] || null;
      // Build 30-day mood series (including days with no entry as null)
      const rows = await db.execute(sql`SELECT log_date, mood FROM daily_mood_logs WHERE user_id = ${user.id} AND log_date >= CURRENT_DATE - INTERVAL '30 days' ORDER BY log_date ASC`);
      const map: Record<string, number> = {};
      rows.forEach((r:any)=>{ const key = (r.log_date instanceof Date ? r.log_date : new Date(r.log_date)).toISOString().slice(0,10); map[key] = Number(r.mood); });
      for (let i=29;i>=0;i--) { const dt = new Date(); dt.setDate(dt.getDate()-i); const key = dt.toISOString().slice(0,10); moodSeries30.push({ date: key, mood: map[key] ?? null }); }
      const last7 = moodSeries30.slice(-7).map(d=>d.mood).filter(m=>typeof m === 'number') as number[];
      const last30 = moodSeries30.map(d=>d.mood).filter(m=>typeof m === 'number') as number[];
      if (last7.length) moodAvg7 = +(last7.reduce((a,b)=>a+b,0)/last7.length).toFixed(2);
      if (last30.length) moodAvg30 = +(last30.reduce((a,b)=>a+b,0)/last30.length).toFixed(2);
    } catch {}
    try {
      const t = await db.execute(sql`SELECT COALESCE(SUM(amount),0) as s FROM user_byte_history WHERE user_id = ${user.id} AND amount > 0 AND DATE(created_at)=CURRENT_DATE`);
      bytesToday = Number((t[0] as any)?.s||0);
      const w = await db.execute(sql`SELECT COALESCE(SUM(amount),0) as s FROM user_byte_history WHERE user_id = ${user.id} AND amount > 0 AND created_at >= NOW() - INTERVAL '7 days'`);
      bytes7d = Number((w[0] as any)?.s||0);
      const m30 = await db.execute(sql`SELECT COALESCE(SUM(amount),0) as s FROM user_byte_history WHERE user_id = ${user.id} AND amount > 0 AND created_at >= NOW() - INTERVAL '30 days'`);
      bytes30d = Number((m30[0] as any)?.s||0);
    } catch {}

    // Build 30-day bytes series
    let bytesSeries: Array<{ date: string; earned: number }> = [];
    try {
      const rows = await db.execute(sql`SELECT DATE(created_at) as d, SUM(amount) as s FROM user_byte_history WHERE user_id = ${user.id} AND amount > 0 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY 1 ORDER BY 1`);
      const map: Record<string, number> = {};
      rows.forEach((r:any)=>{ const key = (r.d instanceof Date ? r.d : new Date(r.d)).toISOString().slice(0,10); map[key] = Number(r.s)||0; });
      for (let i=29;i>=0;i--) { const dt = new Date(); dt.setDate(dt.getDate()-i); const key = dt.toISOString().slice(0,10); bytesSeries.push({ date: key, earned: map[key]||0 }); }
    } catch {}

    const dashboardData = {
      streaks: {
        rituals: ritualStreak,
        noContact: noContactStreak,
        noContactThreat,
        noContactHoursSince: +hoursSinceCheck.toFixed(2),
        noContactShieldAvailable: shieldAvailable
      },
  // xp removed
  badges: [], // defer
  todaysRituals,
      wallPosts: wallPosts,
      dailyInsight: dailyInsight,
      motivationMeter: {
        level: motivationLevel,
        message: motivationMessages[motivationLevel - 1]
      },
      completedRituals,
      streakHistory,
      todayActions: {
        checkIn: !!todayActionsRow?.checkin,
        noContact: !!todayActionsRow?.no_contact,
        ritual: !!todayActionsRow?.ritual,
        wallInteract: !!todayActionsRow?.wall_interact,
        aiChat: !!todayActionsRow?.ai_chat,
        wallPost: !!todayActionsRow?.wall_post
      },
      recentActions: [
        // TODO: Implement actual recent actions from database
        // For now, providing empty array to prevent errors
      ],
      user: {
        totalCheckIns,
        totalNoContacts: noContactStreak,
        totalRituals: completedRituals,
        bytes: userData.bytes || 0,
        streak: ritualStreak,
        profileBadgeId: userData.profile_badge_id || null
      },
  badgeMeta: { lazy: true },
      bytesEconomy: {
        today: bytesToday,
        last7d: bytes7d,
        last30d: bytes30d,
        balance: userData.bytes || 0,
        series30d: bytesSeries
      },
      moodToday: moodToday ? { mood: moodToday.mood, notes: moodToday.notes } : null,
      moodTrends: {
        avg7: moodAvg7,
        avg30: moodAvg30,
        series30: moodSeries30
      },
      ritualMeta: {
        canReroll,
        mode: isFirewall ? 'firewall' : 'ghost',
        assignmentId: paidAssignmentId
      },
      ritualSwaps: await (async ()=>{
        try {
          const rows = await db.execute(sql`SELECT COUNT(*) FILTER (WHERE DATE(created_at)=CURRENT_DATE) as today_c, COUNT(*) as total_c FROM user_ritual_swaps WHERE user_id = ${user.id}`);
          const r = rows[0] as any; return {
            today: Number(r.today_c||0),
            total: Number(r.total_c||0),
            dailyLimit: userData.tier === 'firewall' ? 3 : 1
          };
        } catch { return { today: 0, total: 0, dailyLimit: userData.tier === 'firewall' ? 3 : 1 }; }
      })()
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard hub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
