import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { analyticsEvents } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

// POST: record a lightweight analytics / behavior event
export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { eventType, properties } = body || {};
    if (!eventType || typeof eventType !== 'string') {
      return NextResponse.json({ error: 'eventType required' }, { status: 400 });
    }
    await db.insert(analyticsEvents).values({
      user_id: user.id,
      event_type: eventType,
      properties: properties || {},
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Event ingest error', e);
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}

// GET: fetch recent events (debug/personalization)
export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const rows = await db.query.analyticsEvents.findMany({
      where: eq(analyticsEvents.user_id, user.id),
      orderBy: (t, { desc }) => [desc(t.created_at)],
      limit: 25
    });
    return NextResponse.json({ events: rows });
  } catch (e) {
    console.error('Fetch events error', e);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
