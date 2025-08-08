import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualEntries, users } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate session
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: ritualId } = await params; // This will be the ritual ID, not code
    const body = await request.json();
    
    const { 
      mood, 
      whatIDid, 
      howIFeel, 
      tags, 
      source = 'text',
      timeSpent,
      ritualTitle
    } = body;

    // Validate required fields
    if (!whatIDid && !howIFeel) {
      return NextResponse.json({ 
        error: 'At least one journal entry is required' 
      }, { status: 400 });
    }

    // Calculate text length for XP validation
    const combinedText = `${whatIDid || ''} ${howIFeel || ''}`.trim();
    const textLength = combinedText.length;
    
    // XP/Bytes validation criteria
    const minTextLength = 20; // Minimum characters
    const minTimeSpent = 20; // Minimum seconds
    const meetsTextCriteria = textLength >= minTextLength;
    const meetsTimeCriteria = timeSpent >= minTimeSpent;
    const qualifiesForReward = meetsTextCriteria && meetsTimeCriteria;

    // Get user data for tier checking
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];
    const isPremium = user.subscriptionTier === 'premium';

    // Calculate rewards based on tier
    const baseXP = isPremium ? 12 : 10;
    const baseBytes = isPremium ? 3 : 2;
    const xpAwarded = qualifiesForReward ? baseXP : 0;
    const bytesAwarded = qualifiesForReward ? baseBytes : 0;

    // Create journal entry
    const entryId = randomUUID();
    await db.insert(ritualEntries).values({
      id: entryId,
      userId: sessionUser.id,
      ritualCode: ritualId, // Store ritual ID as code for now
      ritualTitle,
      mood,
      whatIDid,
      howIFeel,
      tags: isPremium ? tags : null, // Tags only for premium users
      source,
      timeSpent,
      textLength,
      xpAwarded,
      bytesAwarded,
      performedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Award XP and Bytes if criteria met
    if (qualifiesForReward) {
      await db
        .update(users)
        .set({
          xp: sql`${users.xp} + ${xpAwarded}`,
          bytes: sql`${users.bytes} + ${bytesAwarded}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, sessionUser.id));
    }

    // Get updated user stats
    const updatedUser = await db
      .select({ xp: users.xp, bytes: users.bytes })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      entry: {
        id: entryId,
        ritualCode: ritualId,
        mood,
        textLength,
        qualifiesForReward,
        xpAwarded,
        bytesAwarded
      },
      user: {
        xp: updatedUser[0]?.xp || 0,
        bytes: updatedUser[0]?.bytes || 0
      },
      criteria: {
        textLength: {
          required: minTextLength,
          actual: textLength,
          met: meetsTextCriteria
        },
        timeSpent: {
          required: minTimeSpent,
          actual: timeSpent,
          met: meetsTimeCriteria
        }
      }
    });

  } catch (error) {
    console.error('Journal creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get journal entries for a specific ritual
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate session
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: ritualId } = await params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const cursor = url.searchParams.get('cursor');

    // Get user data for tier checking
    const userData = await db
      .select({ subscriptionTier: users.subscriptionTier })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    const isPremium = userData[0]?.subscriptionTier === 'premium';
    const maxLimit = isPremium ? 50 : 14; // Premium gets full history, free gets last 14

    // Build query conditions
    const conditions = [eq(ritualEntries.userId, sessionUser.id)];

    if (ritualId !== 'all') {
      conditions.push(eq(ritualEntries.ritualCode, ritualId));
    }

    if (cursor) {
      conditions.push(sql`${ritualEntries.createdAt} < ${new Date(cursor)}`);
    }

    // Execute query with all conditions
    const entries = await db
      .select()
      .from(ritualEntries)
      .where(and(...conditions))
      .orderBy(sql`${ritualEntries.createdAt} DESC`)
      .limit(Math.min(limit, maxLimit));

    // For free users, only return last 14 entries total
    const limitedEntries = isPremium ? entries : entries.slice(0, 14);

    return NextResponse.json({
      success: true,
      entries: limitedEntries,
      isPremium,
      hasMore: entries.length === Math.min(limit, maxLimit),
      nextCursor: entries.length > 0 ? entries[entries.length - 1].createdAt : null
    });

  } catch (error) {
    console.error('Journal fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
