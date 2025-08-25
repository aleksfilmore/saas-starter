import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

/**
 * PATCH /api/badges/profile
 * Body: { badgeId: string }
 * Sets the user's profile badge (Firewall only). Ghost users auto-apply newest badge and cannot manually change.
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(()=>({}));
    const { badgeId } = body || {};
    if (!badgeId) return NextResponse.json({ error: 'badgeId required' }, { status: 400 });

    // Load user tier & verify ownership of badge
    const urows = await db.execute(sql`SELECT tier FROM users WHERE id = ${user.id}`);
    if (!urows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const tier = (urows[0] as any).tier as string;
    if (tier !== 'firewall') return NextResponse.json({ error: 'Only Firewall users can pick profile badge' }, { status: 403 });

    const owned = await db.execute(sql`SELECT 1 FROM user_badges WHERE user_id = ${user.id} AND badge_id = ${badgeId} LIMIT 1`);
    if (!owned.length) return NextResponse.json({ error: 'Badge not owned' }, { status: 400 });

    await db.execute(sql`UPDATE users SET profile_badge_id = ${badgeId} WHERE id = ${user.id}`);
    return NextResponse.json({ success: true, profileBadgeId: badgeId });
  } catch (e) {
    console.error('Profile badge update error', e);
    return NextResponse.json({ error: 'Failed to update profile badge' }, { status: 500 });
  }
}
