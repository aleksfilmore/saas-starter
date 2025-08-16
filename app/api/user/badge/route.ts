import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's selected badge
    const result = await db.execute(sql`
      SELECT 
        u.selected_badge_id,
        b.name as badge_name,
        b.icon_url,
        b.tier_scope
      FROM users u
      LEFT JOIN badges b ON u.selected_badge_id = b.id
      WHERE u.id = ${user.id}
    `);

    const userData = result[0] as any;
    
    return NextResponse.json({
      success: true,
      selectedBadge: userData?.selected_badge_id ? {
        id: userData.selected_badge_id,
        name: userData.badge_name,
        iconUrl: userData.icon_url,
        tierScope: userData.tier_scope
      } : null
    });

  } catch (error) {
    console.error('Error fetching user badge:', error);
    return NextResponse.json({ error: 'Failed to fetch user badge' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { badgeId } = await request.json();

    // Verify user owns this badge if setting one
    if (badgeId) {
      const ownsBadge = await db.execute(sql`
        SELECT 1 FROM user_badges 
        WHERE user_id = ${user.id} AND badge_id = ${badgeId}
      `);

      if (ownsBadge.length === 0) {
        return NextResponse.json({ error: 'Badge not owned' }, { status: 400 });
      }
    }

    // Update user's selected badge
    await db.execute(sql`
      UPDATE users 
      SET selected_badge_id = ${badgeId || null}
      WHERE id = ${user.id}
    `);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating user badge:', error);
    return NextResponse.json({ error: 'Failed to update user badge' }, { status: 500 });
  }
}
