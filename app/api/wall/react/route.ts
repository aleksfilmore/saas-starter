import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { reactToPost } from '@/lib/wall/wall-service';
import { AnalyticsService } from '@/lib/analytics/service';
import { AnalyticsEvents } from '@/lib/analytics/events';

const VALID_REACTIONS = ['resonate', 'same_loop', 'dragged_me_too', 'stone_cold', 'cleansed'];

export async function POST(request: Request) {
  try {
    // Use Lucia authentication - all users can react to posts
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, reactionType } = await request.json();

    if (!postId || !reactionType) {
      return NextResponse.json({ error: 'Post ID and reaction type required' }, { status: 400 });
    }

    if (!VALID_REACTIONS.includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const result = await reactToPost({ userId: session.userId, postId, reactionType });
    AnalyticsService.track({
      userId: session.userId,
      event: AnalyticsEvents.WALL_POST_LIKED,
      properties: { postId, reactionType, action: result.action }
    });
    return NextResponse.json({ success: true, message: 'Reaction processed', ...result });

  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json({ 
      error: 'Failed to process emotional resonance' 
    }, { status: 500 });
  }
}

// in-memory helpers removed (now handled by service)