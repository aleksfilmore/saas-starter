import { NextRequest, NextResponse } from 'next/server';
import { ReferralService } from '@/lib/referrals/service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params;
    const { code } = resolvedParams;

    if (!code || !ReferralService.isValidReferralCode(code)) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Track the click
    const userAgent = request.headers.get('user-agent') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] || request.headers.get('x-real-ip') || undefined;

    await ReferralService.trackReferralClick(code, ip, userAgent);

    // Redirect to sign-up page with referral code
    const signUpUrl = new URL('/sign-up', request.url);
    signUpUrl.searchParams.set('ref', code);

    return NextResponse.redirect(signUpUrl);

  } catch (error) {
    console.error('Referral click tracking error:', error);
    
    // Still redirect to sign-up even if tracking fails
    const signUpUrl = new URL('/sign-up', request.url);
    return NextResponse.redirect(signUpUrl);
  }
}
