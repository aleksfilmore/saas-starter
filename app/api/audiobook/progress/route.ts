import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { digitalProductAccess, users } from '@/lib/db/unified-schema';
import { eq, and, sql } from 'drizzle-orm';

// Simple in-memory storage for now - in production you'd want a proper table
const userProgress = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user owns the audiobook
    const [access] = await db
      .select()
      .from(digitalProductAccess)
      .where(and(
        eq(digitalProductAccess.userId, user.id),
        eq(digitalProductAccess.productId, 'audiobook_worst_boyfriends'),
        eq(digitalProductAccess.isActive, true)
      ))
      .limit(1);

    if (!access) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get progress from memory storage (would be database in production)
    const progress = userProgress.get(user.id) || {};
    
    return NextResponse.json({
      success: true,
      progress: progress.listeningProgress || {},
      lastPlayed: progress.lastPlayed || null,
      currentTrack: progress.currentTrack || 0
    });
    
  } catch (error) {
    console.error('Audiobook progress error:', error);
    return NextResponse.json(
      { error: 'Failed to load progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { trackId, completed, currentTrack, timestamp } = await request.json();

    // Check if user owns the audiobook
    const [access] = await db
      .select()
      .from(digitalProductAccess)
      .where(and(
        eq(digitalProductAccess.userId, user.id),
        eq(digitalProductAccess.productId, 'audiobook_worst_boyfriends'),
        eq(digitalProductAccess.isActive, true)
      ))
      .limit(1);

    if (!access) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update progress in memory storage
    const currentProgress = userProgress.get(user.id) || {};
    const listeningProgress = currentProgress.listeningProgress || {};
    
    if (completed && trackId) {
      listeningProgress[trackId] = true;
    }

    const updatedProgress = {
      ...currentProgress,
      listeningProgress,
      lastPlayed: timestamp || new Date().toISOString(),
      currentTrack: currentTrack !== undefined ? currentTrack : currentProgress.currentTrack || 0
    };

    userProgress.set(user.id, updatedProgress);

    // Update last accessed time
    await db
      .update(digitalProductAccess)
      .set({
        lastAccessedAt: new Date(),
        accessCount: sql`${digitalProductAccess.accessCount} + 1`
      })
      .where(eq(digitalProductAccess.id, access.id));

    // Award bytes for first-time chapter completion
    if (completed && trackId && !currentProgress.listeningProgress?.[trackId]) {
      try {
        await db
          .update(users)
          .set({
            bytes: sql`${users.bytes} + 5` // 5 bytes per chapter completion
          })
          .where(eq(users.id, user.id));
      } catch (error) {
        console.error('Error awarding bytes for audiobook progress:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Progress saved',
      progress: updatedProgress.listeningProgress
    });
    
  } catch (error) {
    console.error('Audiobook progress save error:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}
