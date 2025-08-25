// CTRL+ALT+BLOCK™ Badge API Routes
// Handles badge-related API endpoints per spec

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
// Using badges-schema (contains badge domain tables) – users there no longer has xpPoints/byteBalance
import { badges, userBadges, users, discountCodes } from '@/lib/db/badges-schema';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { processBadgeEvent, type BadgeEventType, type EventPayload } from '@/lib/badges/badge-evaluator';

// Simple session validation (replace with your actual auth)
async function validateUser(request: NextRequest) {
  // TODO: Replace with actual session validation
  const userId = request.headers.get('x-user-id') || request.headers.get('x-user-email');
  return { user: userId ? { id: userId } : null };
}

// =====================================
// CHECK-IN ENDPOINT
// =====================================

const checkInSchema = z.object({
  timestamp: z.string(),
  streakCount: z.number(),
  shieldUsed: z.boolean().optional()
});

export async function POST_checkIn(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = checkInSchema.parse(body);

    // Process badge evaluation
    const newBadges = await processBadgeEvent(
      session.user.id,
      'check_in_completed',
      data
    );

    return NextResponse.json({
      success: true,
      newBadges,
      message: newBadges.length > 0 ? `Unlocked ${newBadges.length} new badge(s)!` : 'Check-in recorded'
    });
  } catch (error) {
    console.error('Check-in badge processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================
// RITUAL COMPLETION ENDPOINT  
// =====================================

const ritualCompleteSchema = z.object({
  ritualId: z.string(),
  journalText: z.string(),
  timeSpent: z.number(),
  category: z.string()
});

export async function POST_ritualComplete(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = ritualCompleteSchema.parse(body);

    // Validate journaling requirement (≥2 sentences or ≥20 words)
    const wordCount = data.journalText.trim().split(/\s+/).length;
    const sentenceCount = data.journalText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    if (wordCount < 20 && sentenceCount < 2) {
      return NextResponse.json({ 
        error: 'Insufficient journaling for badge progress. Please write at least 2 sentences.' 
      }, { status: 400 });
    }

    // Process badge evaluation
    const newBadges = await processBadgeEvent(
      session.user.id,
      'ritual_completed',
      {
        ritualId: data.ritualId,
        journalWordCount: wordCount,
        timeSpent: data.timeSpent,
        category: data.category
      }
    );

    return NextResponse.json({
      success: true,
      newBadges,
      wordCount,
      message: newBadges.length > 0 ? `Ritual complete! Unlocked ${newBadges.length} new badge(s)!` : 'Ritual completed'
    });
  } catch (error) {
    console.error('Ritual completion badge processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================
// WALL REACTION ENDPOINT
// =====================================

const wallReactSchema = z.object({
  postId: z.string(),
  reactionType: z.enum(['heart', 'fire', 'cry'])
});

export async function POST_wallReact(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = wallReactSchema.parse(body);

    // Process badge evaluation
    const newBadges = await processBadgeEvent(
      session.user.id,
      'wall_reaction_added',
      data
    );

    return NextResponse.json({
      success: true,
      newBadges,
      message: newBadges.length > 0 ? `Reaction added! Unlocked ${newBadges.length} new badge(s)!` : 'Reaction added'
    });
  } catch (error) {
    console.error('Wall reaction badge processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================
// GAME EVENTS ENDPOINTS
// =====================================

const bingoWinSchema = z.object({
  gameType: z.literal('bingo'),
  achievement: z.string()
});

export async function POST_bingoWin(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has Firewall tier
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user || user.tier !== 'firewall') {
      return NextResponse.json({ error: 'Game badges require Firewall tier' }, { status: 403 });
    }

    const body = await request.json();
    const data = bingoWinSchema.parse(body);

    // Process badge evaluation
    const newBadges = await processBadgeEvent(
      session.user.id,
      'game_bingo_won',
      data
    );

    return NextResponse.json({
      success: true,
      newBadges,
      message: newBadges.length > 0 ? `Bingo win! Unlocked ${newBadges.length} new badge(s)!` : 'Bingo win recorded'
    });
  } catch (error) {
    console.error('Bingo win badge processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const smashScoreSchema = z.object({
  gameType: z.literal('smash'),
  score: z.number().optional(),
  rounds: z.number().optional(),
  achievement: z.string()
});

export async function POST_smashScore(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has Firewall tier
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user || user.tier !== 'firewall') {
      return NextResponse.json({ error: 'Game badges require Firewall tier' }, { status: 403 });
    }

    const body = await request.json();
    const data = smashScoreSchema.parse(body);

    // Validate achievement threshold
    if ((data.score && data.score < 15) && (data.rounds && data.rounds < 3)) {
      return NextResponse.json({ 
        error: 'Score too low for badge unlock (need ≥15 score or ≥3 rounds)' 
      }, { status: 400 });
    }

    // Process badge evaluation
    const newBadges = await processBadgeEvent(
      session.user.id,
      'game_smash_score',
      data
    );

    return NextResponse.json({
      success: true,
      newBadges,
      score: data.score,
      rounds: data.rounds,
      message: newBadges.length > 0 ? `Smash achievement! Unlocked ${newBadges.length} new badge(s)!` : 'Score recorded'
    });
  } catch (error) {
    console.error('Smash score badge processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================
// BADGE MANAGEMENT ENDPOINTS
// =====================================

export async function GET_badges(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user context
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get earned badges
    const earnedBadges = await db
      .select({
        badge: badges,
        earnedAt: userBadges.earnedAt,
        appliedAsProfile: userBadges.appliedAsProfile,
        discountCodeId: userBadges.discountCodeId
      })
      .from(userBadges)
      .innerJoin(badges, eq(badges.id, userBadges.badgeId))
      .where(eq(userBadges.userId, session.user.id))
      .orderBy(desc(userBadges.earnedAt));

    // Get available badges for user's tier and archetype
    const availableBadges = await db
      .select()
      .from(badges)
      .where(and(
        eq(badges.isActive, true),
        // Tier filtering
        user.tier === 'ghost' 
          ? eq(badges.tierScope, 'ghost')
          : eq(badges.tierScope, 'firewall'),
        // Archetype filtering (null = global badges)
        user.archetype 
          ? eq(badges.archetypeScope, user.archetype)
          : isNull(badges.archetypeScope)
      ));

    return NextResponse.json({
      success: true,
      user: {
        tier: user.tier,
        archetype: user.archetype,
        profileBadgeId: user.profileBadgeId
      },
      earnedBadges,
      availableBadges,
      totalEarned: earnedBadges.length
    });
  } catch (error) {
    console.error('Get badges error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const applyBadgeSchema = z.object({
  badgeId: z.string()
});

export async function POST_applyBadge(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = applyBadgeSchema.parse(body);

    // Check if user has Firewall tier (Ghost can't choose profile badge)
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user || user.tier !== 'firewall') {
      return NextResponse.json({ 
        error: 'Profile badge selection requires Firewall tier' 
      }, { status: 403 });
    }

    // Verify user owns the badge
    const [userBadge] = await db
      .select()
      .from(userBadges)
      .where(and(
        eq(userBadges.userId, session.user.id),
        eq(userBadges.badgeId, data.badgeId)
      ))
      .limit(1);

    if (!userBadge) {
      return NextResponse.json({ error: 'Badge not owned by user' }, { status: 404 });
    }

    // Update profile badge
    await db.update(users)
      .set({ profileBadgeId: data.badgeId })
      .where(eq(users.id, session.user.id));

    // Update previous profile badge status
    await db.update(userBadges)
      .set({ appliedAsProfile: false })
      .where(eq(userBadges.userId, session.user.id));

    // Set new profile badge status
    await db.update(userBadges)
      .set({ appliedAsProfile: true })
      .where(and(
        eq(userBadges.userId, session.user.id),
        eq(userBadges.badgeId, data.badgeId)
      ));

    return NextResponse.json({
      success: true,
      message: 'Profile badge updated successfully'
    });
  } catch (error) {
    console.error('Apply badge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================
// SHARE CARD ENDPOINT
// =====================================

const shareCardSchema = z.object({
  badgeId: z.string(),
  format: z.enum(['portrait', 'square']).default('portrait')
});

export async function GET_shareCard(request: NextRequest) {
  try {
    const session = await validateUser(request);
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const badgeId = url.searchParams.get('badgeId');
    const format = url.searchParams.get('format') || 'portrait';

    if (!badgeId) {
      return NextResponse.json({ error: 'Badge ID required' }, { status: 400 });
    }

    // Verify user owns the badge
    const [userBadge] = await db
      .select({
        badge: badges,
        user: users
      })
      .from(userBadges)
      .innerJoin(badges, eq(badges.id, userBadges.badgeId))
      .innerJoin(users, eq(users.id, userBadges.userId))
      .where(and(
        eq(userBadges.userId, session.user.id),
        eq(userBadges.badgeId, badgeId)
      ))
      .limit(1);

    if (!userBadge) {
      return NextResponse.json({ error: 'Badge not owned by user' }, { status: 404 });
    }

    // Generate share card (placeholder URL for now)
    const shareCardUrl = await generateShareCard(userBadge.badge, userBadge.user, format);

    // Log share event for Sharewave badge
    await processBadgeEvent(
      session.user.id,
      'share_card_generated',
      { format } as any // Share card metadata
    );

    return NextResponse.json({
      success: true,
      shareCardUrl,
      badge: userBadge.badge,
      format
    });
  } catch (error) {
    console.error('Share card generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =====================================
// HELPER FUNCTIONS
// =====================================

async function generateShareCard(badge: any, user: any, format: string): Promise<string> {
  // TODO: Implement actual share card generation
  // This would use a service like Bannerbear, Canvas API, or custom image generation
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-app.com';
  return `${baseUrl}/api/share-cards/${badge.id}?format=${format}&user=${user.id}`;
}
