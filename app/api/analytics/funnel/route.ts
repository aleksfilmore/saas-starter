import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const funnel = searchParams.get('funnel') || 'SUBSCRIPTION';
    
    const funnelMetrics = await AnalyticsService.getConversionFunnelMetrics(funnel);
    
    return NextResponse.json(funnelMetrics);
  } catch (error) {
    console.error('Funnel API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel metrics' },
      { status: 500 }
    );
  }
}
