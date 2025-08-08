import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualEntries } from '@/lib/db/schema';
import { eq, isNull, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Validate session
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all non-deleted journal entries for the user
    const entries = await db
      .select()
      .from(ritualEntries)
      .where(and(
        eq(ritualEntries.userId, sessionUser.id),
        isNull(ritualEntries.deletedAt)
      ))
      .orderBy(ritualEntries.createdAt);

    // Format data for export
    const exportData = {
      user_id: sessionUser.id,
      export_date: new Date().toISOString(),
      journal_entries: entries.map((entry: any) => ({
        id: entry.id,
        ritual_code: entry.ritualCode,
        ritual_title: entry.ritualTitle,
        performed_at: entry.performedAt?.toISOString(),
        mood: entry.mood,
        what_i_did: entry.whatIDid,
        how_i_feel: entry.howIFeel,
        tags: entry.tags,
        source: entry.source,
        time_spent_seconds: entry.timeSpent,
        text_length: entry.textLength,
        xp_awarded: entry.xpAwarded,
        bytes_awarded: entry.bytesAwarded,
        sentiment: entry.sentiment,
        created_at: entry.createdAt?.toISOString(),
        updated_at: entry.updatedAt?.toISOString()
      })),
      total_entries: entries.length,
      privacy_note: "This data is private and belongs to you. Journal entries are not shared with other users or used for marketing purposes."
    };

    // Return as downloadable JSON
    const fileName = `ritual-journal-export-${new Date().toISOString().split('T')[0]}.json`;
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Journal export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
