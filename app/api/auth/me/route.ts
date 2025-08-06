import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';

// Production Lucia-based authentication
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Auth/me called');
    
    // Check what cookies we have
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('🍪 Available cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 10)}...`));
    
    // Validate session using Lucia
    const { user, session } = await validateRequest();
    
    console.log('👤 Session validation result:', { 
      hasUser: !!user, 
      hasSession: !!session,
      userId: user?.id,
      sessionId: session?.id 
    });
    
    if (!user || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        tier: user.tier,
        archetype: user.archetype,
        xp: user.xp,
        bytes: user.bytes,
        level: user.level,
        ritual_streak: user.ritual_streak,
        no_contact_streak: user.no_contact_streak,
        is_verified: user.is_verified,
        subscription_status: user.subscription_status
      }
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
