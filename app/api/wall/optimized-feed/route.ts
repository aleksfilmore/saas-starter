/**
 * Optimized API route for wall feed with better performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { getOptimizedWallFeed } from '@/lib/wall/optimized-wall-service';

export const runtime = 'nodejs';

// Enable edge caching for better performance
export const revalidate = 30; // Revalidate every 30 seconds

export async function GET(request: NextRequest) {
  try {
    // Use Lucia authentication
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const filter = (searchParams.get('filter') || 'recent') as any;
    const category = searchParams.get('category');
    
    // Use optimized service
    const data = await getOptimizedWallFeed({ 
      userId: session.userId, 
      page, 
      limit, 
      filter, 
      category 
    });
    
    // Add cache headers for better performance
    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;

  } catch (error) {
    console.error('Wall feed error:', error);
    return NextResponse.json({ error: 'Failed to load emotional data from the void' }, { status: 500 });
  }
}
