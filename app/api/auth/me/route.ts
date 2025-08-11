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
    
    // Cast user to include database attributes
    const dbUser = user as any;
    
    // Determine subscription tier based on actual user data
    let subscriptionTier = 'free';
    if (dbUser.tier === 'firewall' || dbUser.subscription_tier === 'premium' || dbUser.ritual_tier === 'firewall') {
      subscriptionTier = 'premium';
    }
    
    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: dbUser.email,
        username: dbUser.email?.split('@')[0] || 'User',
        tier: dbUser.tier || 'freemium',
        subscription_tier: dbUser.subscription_tier || 'ghost_mode',
        ritual_tier: dbUser.ritual_tier || 'ghost',
        archetype: dbUser.emotional_archetype, // Use correct column name
        xp: dbUser.xp || 0,
        bytes: dbUser.bytes || 100,
        level: dbUser.level || 1,
        ritual_streak: dbUser.ritual_streak || 0,
        no_contact_streak: dbUser.no_contact_streak || 0,
        is_verified: dbUser.is_verified || false,
        subscription_status: dbUser.subscription_status || 'free',
        subscriptionTier: subscriptionTier
      }
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
