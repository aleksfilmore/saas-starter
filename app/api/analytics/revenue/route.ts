import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service';

export async function GET(request: NextRequest) {
  try {
    const revenueMetrics = await AnalyticsService.getRevenueMetrics();
    
    return NextResponse.json(revenueMetrics);
  } catch (error) {
    console.error('Revenue API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue metrics' },
      { status: 500 }
    );
  }
}
