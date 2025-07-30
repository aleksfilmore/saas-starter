import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      subscriptionTier: user.subscriptionTier,
      xpPoints: user.xpPoints,
      byteBalance: user.byteBalance,
      glowUpLevel: user.glowUpLevel,
      isAdmin: user.isAdmin,
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
