import { NextRequest, NextResponse } from 'next/server';
import { ConversionOptimizer } from '@/lib/conversion/optimizer';
import { getUserId } from '@/lib/auth';

/**
 * Conversion Tracking API
 * POST /api/conversion/track - Track conversion events and funnel steps
 */

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { 
      type, 
      funnel, 
      step, 
      feature, 
      action, 
      metadata 
    } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Tracking type is required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'funnel_step':
        if (!funnel || !step) {
          return NextResponse.json(
            { error: 'Funnel and step are required for funnel tracking' },
            { status: 400 }
          );
        }
        await ConversionOptimizer.trackFunnelStep(userId || undefined, funnel, step, metadata);
        break;

      case 'paywall_interaction':
        if (!feature || !action) {
          return NextResponse.json(
            { error: 'Feature and action are required for paywall tracking' },
            { status: 400 }
          );
        }
        await ConversionOptimizer.trackPaywallInteraction(
          userId || undefined, 
          feature, 
          action as 'viewed' | 'upgrade_clicked' | 'dismissed',
          metadata
        );
        break;

      case 'feature_discovery':
        if (!feature) {
          return NextResponse.json(
            { error: 'Feature is required for feature discovery tracking' },
            { status: 400 }
          );
        }
        await ConversionOptimizer.trackFeatureDiscovery(
          userId || undefined,
          feature,
          metadata?.source || 'unknown',
          metadata
        );
        break;

      case 'milestone':
        if (!userId) {
          return NextResponse.json(
            { error: 'User authentication required for milestone tracking' },
            { status: 401 }
          );
        }
        await ConversionOptimizer.trackMilestone(
          userId,
          metadata?.milestone || 'unknown',
          metadata?.daysSinceSignup || 0,
          metadata
        );
        break;

      case 'ab_test_exposure':
        if (!metadata?.testName || !metadata?.variant) {
          return NextResponse.json(
            { error: 'Test name and variant are required for A/B test tracking' },
            { status: 400 }
          );
        }
        await ConversionOptimizer.trackABTestExposure(
          userId || 'anonymous',
          metadata.testName,
          metadata.variant,
          metadata
        );
        break;

      case 'ab_test_conversion':
        if (!metadata?.testName || !metadata?.variant || !metadata?.conversionEvent) {
          return NextResponse.json(
            { error: 'Test name, variant, and conversion event are required' },
            { status: 400 }
          );
        }
        await ConversionOptimizer.trackABTestConversion(
          userId || 'anonymous',
          metadata.testName,
          metadata.variant,
          metadata.conversionEvent,
          metadata
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown tracking type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion event' },
      { status: 500 }
    );
  }
}
