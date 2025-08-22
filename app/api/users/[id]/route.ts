import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    // Users can only access their own data unless they're admin
    // Need to check isAdmin from database since session doesn't include it
    if (sessionUser.id !== resolvedParams.id) {
      const adminCheck = await db
        .select({ isAdmin: users.isAdmin })
        .from(users)
        .where(eq(users.id, sessionUser.id))
        .limit(1);
      
      if (!adminCheck.length || !adminCheck[0].isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, resolvedParams.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        tier: user.tier,
        archetype: user.emotionalArchetype,
        archetype_details: null,
        xp: user.xp,
        bytes: user.bytes,
        level: user.level,
        ritual_streak: user.streak,
        no_contact_streak: user.noContactDays,
        last_checkin: user.lastNoContactCheckin,
        last_ritual: user.lastRitualCompleted,
        is_verified: !user.isBanned,
        subscription_status: user.subscriptionTier,
        subscription_expires: null,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      }
    });

  } catch (error) {
    console.error('Get user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;

    // Users can only update their own data
    if (sessionUser.id !== resolvedParams.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { username, emotional_archetype } = body;

    const updateData: any = {};
    if (username !== undefined) updateData.username = username;
    if (emotional_archetype !== undefined) updateData.emotional_archetype = emotional_archetype;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, resolvedParams.id));

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
