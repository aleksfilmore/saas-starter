/**
 * CTRL+ALT+BLOCK™ v1.1 - J    const drafts = await db
      .select()
      .from(journalDrafts)
      .where(
        and(
          eq(journalDrafts.userId, sessionUser.id),
          eq(journalDrafts.ritualId, ritualId),
          assignmentId ? eq(journalDrafts.assignmentId, assignmentId) : isNull(journalDrafts.assignmentId)
        )
      )
      .limit(1);t API
 * Handles autosave and draft management per specification section 6
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { journalDrafts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// POST - Save/update draft
export async function POST(request: NextRequest) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ritualId, assignmentId, text, timingSeconds } = body;

    if (!ritualId || !text) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create unique draft ID
    const draftId = `${sessionUser.id}_${ritualId}_${assignmentId || 'current'}`;

    // Check if draft exists
    const existingDraft = await db
      .select()
      .from(journalDrafts)
      .where(
        and(
          eq(journalDrafts.userId, sessionUser.id),
          eq(journalDrafts.ritualId, ritualId),
          assignmentId ? eq(journalDrafts.assignmentId, assignmentId) : eq(journalDrafts.assignmentId, null)
        )
      )
      .limit(1);

    const now = new Date();

    if (existingDraft.length > 0) {
      // Update existing draft
      await db
        .update(journalDrafts)
        .set({
          text,
          timingSeconds,
          lastSaved: now
        })
        .where(eq(journalDrafts.id, existingDraft[0].id));
    } else {
      // Create new draft
      await db
        .insert(journalDrafts)
        .values({
          id: draftId,
          userId: sessionUser.id,
          ritualId,
          assignmentId: assignmentId || null,
          text,
          timingSeconds: timingSeconds || 0,
          lastSaved: now,
          createdAt: now
        });
    }

    return NextResponse.json({ 
      success: true,
      draftId,
      lastSaved: now
    });

  } catch (error) {
    console.error('Draft save error:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

// GET - Fetch user drafts
export async function GET(request: NextRequest) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const ritualId = url.searchParams.get('ritualId');

    let query = db
      .select()
      .from(journalDrafts)
      .where(eq(journalDrafts.userId, sessionUser.id));

    if (ritualId) {
      query = query.where(and(
        eq(journalDrafts.userId, sessionUser.id),
        eq(journalDrafts.ritualId, ritualId)
      ));
    }

    const drafts = await query.orderBy(journalDrafts.lastSaved);

    return NextResponse.json(drafts);

  } catch (error) {
    console.error('Draft fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}

// DELETE - Remove draft
export async function DELETE(request: NextRequest) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const draftId = url.searchParams.get('draftId');

    if (!draftId) {
      return NextResponse.json({ 
        error: 'Draft ID required' 
      }, { status: 400 });
    }

    await db
      .delete(journalDrafts)
      .where(
        and(
          eq(journalDrafts.id, draftId),
          eq(journalDrafts.userId, sessionUser.id)
        )
      );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Draft delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
