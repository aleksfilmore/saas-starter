import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service';
import { getUserId } from '@/lib/auth';

/**
 * Analytics Tracking API
 * POST /api/analytics/track - Track an analytics event
 */

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { event, properties } = await request.json();

    if (!event) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      );
    }

    // Extract additional context
    const userAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || undefined;

    await AnalyticsService.track({
      userId: userId || undefined,
      event,
      properties,
      userAgent,
      referer,
      ip
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
