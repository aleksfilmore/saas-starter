import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { AnalyticsService } from '@/lib/analytics/service';
import { getUserId } from '@/lib/auth';

/**
 * Analytics Metrics API
 * GET /api/analytics/metrics - Get analytics metrics for admin dashboard
 */

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can access analytics

    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const funnel = url.searchParams.get('funnel') || 'SIGN_UP';

    // Get various metrics
    const [
      revenueMetrics,
      retentionMetrics,
      conversionMetrics,
      topFeatures
    ] = await Promise.all([
      AnalyticsService.getRevenueMetrics(days),
      AnalyticsService.getRetentionMetrics(),
      AnalyticsService.getConversionFunnelMetrics(funnel, days),
      AnalyticsService.getTopFeatures(days, 10)
    ]);

    return NextResponse.json({
      period: { days },
      revenue: revenueMetrics,
      retention: retentionMetrics,
      conversion: {
        funnel,
        metrics: conversionMetrics
      },
      features: topFeatures,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics metrics' },
      { status: 500 }
    );
  }
}
