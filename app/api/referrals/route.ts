import { NextRequest, NextResponse } from 'next/server';
import { ReferralService } from '@/lib/referrals/service';
import { getUserId } from '@/lib/auth';

/**
 * Referral API Routes
 * GET /api/referrals - Get user's referral stats and code
 * POST /api/referrals - Generate new referral code
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

    const stats = await ReferralService.getUserReferralStats(userId);
    const referralCode = await ReferralService.getUserReferralCode(userId);
    const referralLink = ReferralService.getReferralLink(referralCode);

    return NextResponse.json({
      referralCode,
      referralLink,
      stats
    });

  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const referralCode = await ReferralService.generateReferralCode(userId);
    const referralLink = ReferralService.getReferralLink(referralCode);

    return NextResponse.json({
      referralCode,
      referralLink,
      message: 'Referral code generated successfully'
    });

  } catch (error) {
    console.error('Referral generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    );
  }
}
