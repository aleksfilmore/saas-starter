import { NextRequest, NextResponse } from 'next/server';
import { getRitualById } from '@/lib/rituals/database';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ritualId } = await params;
    
    // Get the ritual from the database
    const ritual = getRitualById(ritualId);
    
    if (!ritual) {
      return NextResponse.json(
        { error: 'Ritual not found' },
        { status: 404 }
      );
    }
    
    // Check user authentication and tier access
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('session')?.value;
    
    if (token) {
      const session = global.localSessions?.get(token);
      if (session && Date.now() <= session.expiresAt) {
        const user = global.localUsers?.get(session.userId);
        if (user) {
          // Check if user's tier can access this ritual
          const userTier = user.tier || 'freemium';
          if (ritual.user_tier === 'paid_advanced' && userTier !== 'paid_advanced') {
            return NextResponse.json(
              { error: 'Upgrade required to access this ritual' },
              { status: 403 }
            );
          }
          if (ritual.user_tier === 'paid_beginner' && userTier === 'freemium') {
            return NextResponse.json(
              { error: 'Upgrade required to access this ritual' },
              { status: 403 }
            );
          }
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      ritual
    });
    
  } catch (error) {
    console.error('Error fetching ritual:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
