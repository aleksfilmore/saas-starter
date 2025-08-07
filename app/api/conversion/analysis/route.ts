import { NextRequest, NextResponse } from 'next/server';
import { ConversionOptimizer } from '@/lib/conversion/optimizer';
import { getUserId } from '@/lib/auth';

/**
 * Conversion Analysis API
 * GET /api/conversion/analysis - Get conversion funnel analysis and recommendations
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
    
    const url = new URL(request.url);
    const funnel = url.searchParams.get('funnel') || 'SIGN_UP';
    const days = parseInt(url.searchParams.get('days') || '30');

    // Get funnel analysis
    const analysis = await ConversionOptimizer.analyzeDropoffPoints(funnel, days);

    return NextResponse.json({
      funnel,
      period: { days },
      analysis,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Conversion analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze conversion funnel' },
      { status: 500 }
    );
  }
}

/**
 * User engagement and churn risk API
 * POST /api/conversion/analysis - Analyze specific user engagement
 */
export async function POST(request: NextRequest) {
  try {
    const currentUserId = await getUserId();
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId, action } = await request.json();
    const targetUserId = userId || currentUserId;

    switch (action) {
      case 'engagement_score': {
        const score = await ConversionOptimizer.calculateEngagementScore(targetUserId);
        return NextResponse.json({ userId: targetUserId, engagementScore: score });
      }

      case 'churn_risk': {
        const risk = await ConversionOptimizer.assessChurnRisk(targetUserId);
        return NextResponse.json({ userId: targetUserId, churnRisk: risk });
      }

      case 'ab_variant': {
        const { testName } = await request.json();
        if (!testName) {
          return NextResponse.json(
            { error: 'Test name is required' },
            { status: 400 }
          );
        }
        const variant = ConversionOptimizer.getVariant(targetUserId, testName);
        
        // Track exposure
        await ConversionOptimizer.trackABTestExposure(targetUserId, testName, variant);
        
        return NextResponse.json({ 
          userId: targetUserId, 
          testName, 
          variant 
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('User analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze user data' },
      { status: 500 }
    );
  }
}
