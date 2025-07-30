// Wall of Wounds API - REACTIONS (Mock Version)
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

// Force Node.js runtime
export const runtime = 'nodejs';

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

    const body: ReactToPostRequest = await request.json();
    const { postId, reactionType } = body;

    // Validate reaction type
    const validReactions = [
      'resonate', // "This resonates with my core"
      'same_loop', // "Same infinite loop here" 
      'dragged_me_too', // "This dragged me down too"
      'stone_cold', // "Stone cold accuracy"
      'cleansed' // "I felt cleansed reading this"
    ];

    if (!validReactions.includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    // Check if post exists
    const post = await db.query.anonymousPosts.findFirst({
      where: eq(anonymousPosts.id, postId),
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user already reacted to this post
    const existingReaction = await db.query.wallPostReactions.findFirst({
      where: and(
        eq(wallPostReactions.userId, user.id),
        eq(wallPostReactions.postId, postId)
      ),
    });

    if (existingReaction) {
      // If same reaction, remove it (toggle off)
      if (existingReaction.reactionType === reactionType) {
        await db.delete(wallPostReactions)
          .where(eq(wallPostReactions.id, existingReaction.id));

        // Decrement counter on post
        await updateReactionCounter(postId, reactionType, -1);

        return NextResponse.json({ 
          success: true, 
          action: 'removed',
          reactionType 
        });
      } else {
        // Different reaction - update existing
        const oldReactionType = existingReaction.reactionType;
        
        await db.update(wallPostReactions)
          .set({ 
            reactionType,
            updatedAt: new Date()
          })
          .where(eq(wallPostReactions.id, existingReaction.id));

        // Update counters (decrement old, increment new)
        await updateReactionCounter(postId, oldReactionType, -1);
        await updateReactionCounter(postId, reactionType, 1);

        return NextResponse.json({ 
          success: true, 
          action: 'updated',
          oldReaction: oldReactionType,
          newReaction: reactionType 
        });
      }
    } else {
      // New reaction
      await db.insert(wallPostReactions).values({
        id: generateId(15),
        userId: user.id,
        postId,
        reactionType,
      });

      // Increment counter on post
      await updateReactionCounter(postId, reactionType, 1);

      // Award bytes to the post author (if not self-reaction and author exists)
      if (post.userId && post.userId !== user.id) {
        await awardBytes(post.userId, BYTE_REWARDS.UPVOTE_RECEIVED);
      }

      // Check if post went viral (10+ total reactions)
      const updatedPost = await db.query.anonymousPosts.findFirst({
        where: eq(anonymousPosts.id, postId),
      });

      if (updatedPost) {
        const totalReactions = (updatedPost.resonateCount || 0) + 
                              (updatedPost.sameLoopCount || 0) + 
                              (updatedPost.draggedMeTooCount || 0) + 
                              (updatedPost.stoneColdCount || 0) + 
                              (updatedPost.cleansedCount || 0);

        if (totalReactions >= 10 && !updatedPost.isViralAwarded && post.userId) {
          // Award viral bonus to post author
          await awardBytes(post.userId, {
            amount: 100,
            source: 'wall_viral',
            description: 'Post went viral (10+ reactions)',
            relatedId: postId,
          });

          // Mark as viral awarded to prevent duplicate rewards
          await db.update(anonymousPosts)
            .set({ isViralAwarded: true })
            .where(eq(anonymousPosts.id, postId));
        }
      }

      return NextResponse.json({ 
        success: true, 
        action: 'added',
        reactionType 
      });
    }

  } catch (error) {
    console.error('Wall reaction error:', error);
    return NextResponse.json({ 
      error: 'Failed to process emotional reaction' 
    }, { status: 500 });
  }
}

async function updateReactionCounter(postId: string, reactionType: string, increment: number) {
  const columnMap = {
    resonate: 'resonateCount',
    same_loop: 'sameLoopCount', 
    dragged_me_too: 'draggedMeTooCount',
    stone_cold: 'stoneColdCount',
    cleansed: 'cleansedCount'
  };

  const column = columnMap[reactionType as keyof typeof columnMap];
  if (!column) return;

  await db.update(anonymousPosts)
    .set({
      [column]: sql`${anonymousPosts[column as keyof typeof anonymousPosts]} + ${increment}`,
      updatedAt: new Date()
    })
    .where(eq(anonymousPosts.id, postId));
}
