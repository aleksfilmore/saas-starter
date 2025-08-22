import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { ReferralService } from '@/lib/referrals/service';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's referral stats
    const stats = await ReferralService.getUserReferralStats(user.id);
    
    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Referrals API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate or get existing referral code
    const referralCode = await ReferralService.getUserReferralCode(user.id);
    const referralLink = ReferralService.getReferralLink(referralCode);
    
    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        referralLink
      }
    });

  } catch (error) {
    console.error('Generate referral code error:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    );
  }
}
