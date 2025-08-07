import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service';

export async function GET(request: NextRequest) {
  try {
    const retentionMetrics = await AnalyticsService.getRetentionMetrics();
    
    return NextResponse.json(retentionMetrics);
  } catch (error) {
    console.error('Retention API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch retention metrics' },
      { status: 500 }
    );
  }
}
