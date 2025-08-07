import { NextRequest, NextResponse } from 'next/server';
import { ReferralService } from '@/lib/referrals/service';

/**
 * Referral Click Tracking API
 * POST /api/referrals/click - Track when someone clicks a referral link
 */

export async function POST(request: NextRequest) {
  try {
    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    if (!ReferralService.isValidReferralCode(referralCode)) {
      return NextResponse.json(
        { error: 'Invalid referral code format' },
        { status: 400 }
      );
    }

    // Extract request metadata
    const userAgent = request.headers.get('user-agent') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || undefined;

    await ReferralService.trackReferralClick(referralCode, ip, userAgent);

    return NextResponse.json({ 
      success: true,
      message: 'Referral click tracked' 
    });

  } catch (error) {
    console.error('Referral click tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track referral click' },
      { status: 500 }
    );
  }
}
