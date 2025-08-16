// CTRL+ALT+BLOCK™ Badge Check-in API Route
// Handles daily check-in badge evaluations

import { processBadgeEvent } from '@/lib/badges/badge-evaluator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body - expecting { userId, eventType, payload }
    const { userId, eventType, payload } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!eventType || !payload) {
      return NextResponse.json({ error: 'Missing eventType or payload' }, { status: 400 });
    }

    // Process the badge event
    const badgeIds = await processBadgeEvent(userId, eventType, payload);

    return NextResponse.json({
      success: true,
      badgesAwarded: badgeIds,
      message: badgeIds.length > 0 
        ? `Congratulations! You earned ${badgeIds.length} new badge(s)!`
        : 'Event processed successfully!'
    });

  } catch (error) {
    console.error('Badge event processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process badge event' }, 
      { status: 500 }
    );
  }
}
