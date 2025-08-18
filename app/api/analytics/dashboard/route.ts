import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { AnalyticsService } from '@/lib/analytics/dashboard-service';
import { apiRateLimit } from '@/lib/middleware/rate-limiter';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you might want to add an isAdmin field to users table)
    if (user.tier !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const timeframe = (url.searchParams.get('timeframe') as '24h' | '7d' | '30d') || '30d';

    const metrics = await AnalyticsService.getDashboardMetrics(timeframe);

    return NextResponse.json({
      success: true,
      metrics,
      timeframe,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventType, properties } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    // Track the analytics event
    await AnalyticsService.trackEvent({
      userId: user.id,
      eventType,
      properties,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
