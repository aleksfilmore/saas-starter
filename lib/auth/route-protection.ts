/**
 * Route Protection Middleware
 * Enforces tier permissions across protected routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { canAccessRoute, getUpgradeMessage, type LegacyTier } from '@/lib/auth/tier-permissions';

// Mock function to get user tier - in real app would query database
async function getUserTier(userId: string): Promise<LegacyTier> {
  // Mock implementation - would query actual user database
  return 'freemium'; // Default to freemium/ghost mode
}

/**
 * Middleware to check route access based on user tier
 */
export async function withTierProtection(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  try {
    const pathname = request.nextUrl.pathname;
    
    // Get user ID from session/auth (simplified)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Check session (simplified for demo)
    const session = global.localSessions?.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    const userId = session.userId;
    const userTier = await getUserTier(userId);
    
    // Check route access
    const hasAccess = canAccessRoute(userTier, pathname);
    
    if (!hasAccess) {
      const feature = getFeatureFromRoute(pathname);
      const upgradeMessage = getUpgradeMessage(feature);
      
      return NextResponse.json({ 
        error: 'Access denied',
        message: upgradeMessage,
        requiresUpgrade: true,
        feature
      }, { status: 403 });
    }
    
    // User has access, proceed with request
    return handler(request);
    
  } catch (error) {
    console.error('Error in tier protection middleware:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * Extract feature name from route for upgrade messaging
 */
function getFeatureFromRoute(pathname: string): string {
  if (pathname.includes('/ai-therapy')) return 'AI Therapy';
  if (pathname.includes('/wall')) return 'Wall of Wounds';
  if (pathname.includes('/achievements')) return 'Achievements & Gamification';
  if (pathname.includes('/crisis-support')) return 'Crisis Support';
  if (pathname.includes('/voice-therapy')) return 'Voice Therapy';
  
  return 'this feature';
}

/**
 * Client-side tier checking utility
 */
export function createTierGuard() {
  return {
    checkAccess: (userTier: LegacyTier, route: string) => {
      return canAccessRoute(userTier, route);
    },
    
    getUpgradePrompt: (feature: string) => {
      return getUpgradeMessage(feature);
    },
    
    shouldShowUpgrade: (userTier: string, feature: string) => {
      return userTier === 'freemium' || userTier === 'ghost';
    }
  };
}
