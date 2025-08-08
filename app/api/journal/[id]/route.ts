import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualEntries } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Get individual journal entry
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

    const { id: entryId } = await params;

    const entry = await db
      .select()
      .from(ritualEntries)
      .where(and(
        eq(ritualEntries.id, entryId),
        eq(ritualEntries.userId, sessionUser.id)
      ))
      .limit(1);

    if (!entry.length) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      entry: entry[0]
    });

  } catch (error) {
    console.error('Journal entry fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update journal entry (within 15 minutes only, for typo fixes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate session
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: entryId } = await params;
    const body = await request.json();
    
    const { whatIDid, howIFeel, mood, tags } = body;

    // Get existing entry
    const existingEntry = await db
      .select()
      .from(ritualEntries)
      .where(and(
        eq(ritualEntries.id, entryId),
        eq(ritualEntries.userId, sessionUser.id)
      ))
      .limit(1);

    if (!existingEntry.length) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const entry = existingEntry[0];

    // Check if entry is within 15-minute edit window
    const now = new Date();
    const createdAt = entry.createdAt ? new Date(entry.createdAt) : now;
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (minutesSinceCreation > 15) {
      return NextResponse.json({ 
        error: 'Entry can only be edited within 15 minutes of creation' 
      }, { status: 403 });
    }

    // Calculate new text length
    const combinedText = `${whatIDid || ''} ${howIFeel || ''}`.trim();
    const textLength = combinedText.length;

    // Update entry (no retro XP changes)
    await db
      .update(ritualEntries)
      .set({
        whatIDid: whatIDid || entry.whatIDid,
        howIFeel: howIFeel || entry.howIFeel,
        mood: mood !== undefined ? mood : entry.mood,
        tags: tags !== undefined ? tags : entry.tags,
        textLength,
        updatedAt: now
      })
      .where(eq(ritualEntries.id, entryId));

    return NextResponse.json({
      success: true,
      message: 'Entry updated successfully'
    });

  } catch (error) {
    console.error('Journal entry update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Soft delete journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate session
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: entryId } = await params;

    // Check if entry exists and belongs to user
    const existingEntry = await db
      .select()
      .from(ritualEntries)
      .where(and(
        eq(ritualEntries.id, entryId),
        eq(ritualEntries.userId, sessionUser.id)
      ))
      .limit(1);

    if (!existingEntry.length) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Soft delete (set deletedAt timestamp)
    await db
      .update(ritualEntries)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(ritualEntries.id, entryId));

    return NextResponse.json({
      success: true,
      message: 'Entry deleted successfully'
    });

  } catch (error) {
    console.error('Journal entry deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
