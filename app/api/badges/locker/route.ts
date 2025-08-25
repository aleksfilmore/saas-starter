// CTRL+ALT+BLOCK™ Badge Locker API Route
// Returns user's badge collection and completion status

import { db } from '@/lib/db/drizzle';
export const dynamic = 'force-dynamic';
import { badges, userBadges, users } from '@/lib/db/unified-schema';
import { eq, and, count, isNull } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const { user: sessionUser } = await validateRequest();
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user details
    const user = await db.select({
      id: users.id,
      email: users.email,
      tier: users.tier,
      archetype: users.archetype
    }).from(users).where(eq(users.id, sessionUser.id)).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user[0];

    // Get user's earned badges with badge details
    const userBadgeData = await db.select({
      id: userBadges.id,
      userId: userBadges.userId,
      badgeId: userBadges.badgeId,
      earnedAt: userBadges.earnedAt,
      appliedAsProfile: userBadges.appliedAsProfile,
      sourceEvent: userBadges.sourceEvent,
      badge: {
        id: badges.id,
        name: badges.name,
        description: badges.description,
        tierScope: badges.tierScope,
        archetypeScope: badges.archetypeScope,
        artUrl: badges.artUrl,
        discountPercent: badges.discountPercent,
        discountCap: badges.discountCap
      }
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userData.id))
    .orderBy(userBadges.earnedAt);

    // Get total available badges for this user's tier
    const availableBadgesQuery = db.select({ count: count() })
      .from(badges)
      .where(
        and(
          eq(badges.isActive, true),
          // Tier filtering
          userData.tier === 'ghost'
            ? eq(badges.tierScope, 'ghost')
            : eq(badges.tierScope, 'firewall'),
          // Archetype filtering (null = global badges)
          userData.archetype 
            ? eq(badges.archetypeScope, userData.archetype)
            : isNull(badges.archetypeScope)
        )
      );

    const availableBadges = await availableBadgesQuery;
    const totalAvailable = availableBadges[0]?.count || 0;

    // Calculate completion percentage
    const completionPercent = totalAvailable > 0 
      ? Math.round((userBadgeData.length / totalAvailable) * 100)
      : 0;

    // Find current profile badge
    const profileBadge = userBadgeData.find(ub => ub.appliedAsProfile);

    // Format response
    const response = {
      user: {
        tier: userData.tier,
        archetype: userData.archetype,
        profileBadgeId: profileBadge?.badgeId || null
      },
      badges: userBadgeData.map(ub => ({
        id: ub.id,
        userId: ub.userId,
        badgeId: ub.badgeId,
        earnedAt: ub.earnedAt.toISOString(),
        isProfile: ub.appliedAsProfile,
        sourceEvent: ub.sourceEvent,
        badge: {
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          tierScope: ub.badge.tierScope,
          archetypeScope: ub.badge.archetypeScope,
          artUrl: ub.badge.artUrl,
          discountPercent: ub.badge.discountPercent || 0,
          rarity: getBadgeRarity(ub.badge.id)
        }
      })),
      totalAvailable,
      completionPercent
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Badge locker API error:', error);
    return NextResponse.json(
      { error: 'Failed to load badge collection' }, 
      { status: 500 }
    );
  }
}

// Helper function to determine badge rarity
function getBadgeRarity(badgeId: string): 'common' | 'rare' | 'epic' | 'legendary' {
  if (badgeId.startsWith('G0') || badgeId.startsWith('F1')) return 'common';
  if (badgeId.startsWith('G1') || badgeId.startsWith('F2')) return 'rare';
  if (badgeId.startsWith('G2') || badgeId.startsWith('F3')) return 'epic';
  if (badgeId.startsWith('G3') || badgeId.startsWith('F4') || badgeId.startsWith('X')) return 'legendary';
  return 'common';
}
