import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

interface ReactToPostRequest {
  postId: string;
  reactionType: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ReactToPostRequest = await request.json();
    const { postId, reactionType } = body;

    // Mock response - replace with real database operations once database is properly set up
    console.log(`Mock reaction: User ${user.id} reacted to post ${postId} with ${reactionType}`);

    return NextResponse.json({
      success: true,
      message: 'Reaction recorded',
      reaction: {
        postId,
        reactionType,
        userId: user.id
      },
      // Mock updated counts
      updatedCounts: {
        resonateCount: Math.floor(Math.random() * 50),
        sameLoopCount: Math.floor(Math.random() * 20),
        draggedMeTooCount: Math.floor(Math.random() * 10),
        stoneColdCount: Math.floor(Math.random() * 30),
        cleansedCount: Math.floor(Math.random() * 15)
      }
    });

  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json({ 
      error: 'Failed to process emotional resonance' 
    }, { status: 500 });
  }
}