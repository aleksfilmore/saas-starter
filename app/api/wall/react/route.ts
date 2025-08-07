import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

// Global storage reference
declare global {
  var wallPosts: Map<string, any>;
  var wallReactions: Map<string, any>;
}

// Initialize wall storage if not exists
if (!global.wallPosts) {
  global.wallPosts = new Map();
}
if (!global.wallReactions) {
  global.wallReactions = new Map();
}

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

    // Check if post exists
    const post = global.wallPosts.get(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const reactionKey = `${user.id}-${postId}`;
    const existingReaction = global.wallReactions.get(reactionKey);

    // If user already reacted, remove old reaction
    if (existingReaction) {
      const oldType = existingReaction.reactionType;
      post[`${oldType}Count`] = Math.max(0, (post[`${oldType}Count`] || 0) - 1);
      
      // If same reaction, remove it (toggle off)
      if (oldType === reactionType) {
        global.wallReactions.delete(reactionKey);
        post.totalReactions = calculateTotalReactions(post);
        
        return NextResponse.json({
          success: true,
          message: 'Reaction removed',
          action: 'removed',
          updatedCounts: getReactionCounts(post),
          userReaction: null
        });
      }
    }

    // Add new reaction
    const reaction = {
      userId: user.id,
      postId,
      reactionType,
      createdAt: new Date()
    };

    global.wallReactions.set(reactionKey, reaction);
    
    // Update post counts
    const countField = `${reactionType}Count`;
    post[countField] = (post[countField] || 0) + 1;
    post.totalReactions = calculateTotalReactions(post);

    // Award XP to post author if not anonymous and not self-reaction
    if (post.authorId && post.authorId !== user.id) {
      // Note: In real implementation, this would update the database
      console.log(`Awarding XP to post author ${post.authorId} for reaction`);
    }

    return NextResponse.json({
      success: true,
      message: 'Reaction recorded',
      action: existingReaction ? 'changed' : 'added',
      reaction: {
        postId,
        reactionType,
        userId: session.userId
      },
      updatedCounts: getReactionCounts(post),
      userReaction: reactionType
    });

  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json({ 
      error: 'Failed to process emotional resonance' 
    }, { status: 500 });
  }
}

interface WallPost {
  resonateCount?: number;
  sameLoopCount?: number;
  draggedMeTooCount?: number;
  stoneColdCount?: number;
  cleansedCount?: number;
  totalReactions?: number;
  [key: string]: any;
}

function calculateTotalReactions(post: WallPost): number {
  return (post.resonateCount || 0) + 
         (post.sameLoopCount || 0) + 
         (post.draggedMeTooCount || 0) + 
         (post.stoneColdCount || 0) + 
         (post.cleansedCount || 0);
}

function getReactionCounts(post: WallPost) {
  return {
    resonateCount: post.resonateCount || 0,
    sameLoopCount: post.sameLoopCount || 0,
    draggedMeTooCount: post.draggedMeTooCount || 0,
    stoneColdCount: post.stoneColdCount || 0,
    cleansedCount: post.cleansedCount || 0,
    totalReactions: post.totalReactions || 0
  };
}