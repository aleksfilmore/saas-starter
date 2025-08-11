import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

// POST: record a lightweight analytics / behavior event
export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // TODO: Re-enable when analyticsEvents table is added to actual-schema
    return NextResponse.json({ 
      success: true, 
      message: 'Event recording temporarily disabled during schema migration'
    });
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
    
    // TODO: Re-enable when analyticsEvents table is added to actual-schema
    return NextResponse.json({ 
      events: [],
      message: 'Event fetching temporarily disabled during schema migration'
    });
  } catch (e) {
    console.error('Fetch events error', e);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
