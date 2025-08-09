// Wall of Wounds API - FEED 
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { getWallFeed } from '@/lib/wall/wall-service';

export const runtime = 'nodejs';

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
  const data = await getWallFeed({ userId: session.userId, page, limit, filter, category });
  return NextResponse.json(data);

  } catch (error) {
    console.error('Wall feed error:', error);
  return NextResponse.json({ error: 'Failed to load emotional data from the void' }, { status: 500 });
  }
}
