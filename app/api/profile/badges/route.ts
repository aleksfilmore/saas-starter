import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, userBadges, badges } from '@/lib/db/badges-schema';
import { eq, and, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's earned badges with badge details
    const earnedBadges = await db
      .select({
        id: badges.id,
        name: badges.name,
        iconUrl: badges.iconUrl,
        tierScope: badges.tierScope,
        archetypeScope: badges.archetypeScope,
        discountPercent: badges.discountPercent,
        earnedAt: userBadges.earnedAt
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));

    // Get current profile badge settings
    const profileSettings = await db.execute(sql`
      SELECT displayed_badge_id, auto_apply_latest
      FROM user_profile_badges
      WHERE user_id = ${userId}
    `);

    const settings = profileSettings[0] || { displayed_badge_id: null, auto_apply_latest: false };

    return NextResponse.json({
      success: true,
      earnedBadges: earnedBadges.map(badge => ({
        id: badge.id,
        name: badge.name,
        icon_url: badge.iconUrl,
        tier_scope: badge.tierScope,
        archetype_scope: badge.archetypeScope,
        discount_percent: badge.discountPercent,
        earned_at: badge.earnedAt
      })),
      displayedBadgeId: settings.displayed_badge_id,
      autoApplyLatest: settings.auto_apply_latest
    });

  } catch (error) {
    console.error('Error fetching profile badges:', error);
    return NextResponse.json({ error: 'Failed to fetch profile badges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, displayedBadgeId, autoApplyLatest } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Verify the badge exists and is owned by the user if displayedBadgeId is provided
    if (displayedBadgeId) {
      const ownsBadge = await db
        .select()
        .from(userBadges)
        .where(and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, displayedBadgeId)
        ))
        .limit(1);

      if (ownsBadge.length === 0) {
        return NextResponse.json({ error: 'Badge not owned by user' }, { status: 400 });
      }
    }

    // Update or insert profile badge settings
    await db.execute(sql`
      INSERT INTO user_profile_badges (user_id, displayed_badge_id, auto_apply_latest, updated_at)
      VALUES (${userId}, ${displayedBadgeId}, ${autoApplyLatest}, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        displayed_badge_id = ${displayedBadgeId},
        auto_apply_latest = ${autoApplyLatest},
        updated_at = NOW()
    `);

    return NextResponse.json({ 
      success: true,
      message: 'Profile badge settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating profile badges:', error);
    return NextResponse.json({ error: 'Failed to update profile badges' }, { status: 500 });
  }
}
