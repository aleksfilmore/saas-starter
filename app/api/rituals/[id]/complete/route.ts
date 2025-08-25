import { NextRequest, NextResponse } from 'next/server';
import { getRitualById } from '@/lib/rituals/database';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
  var ritualCompletions: Map<string, any>;
}

// Initialize ritual completions storage
if (!global.ritualCompletions) {
  global.ritualCompletions = new Map();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ritualId } = await params;
    const { completionData } = await request.json();
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('session')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const session = global.localSessions?.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    
    const user = global.localUsers?.get(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get the ritual
    const ritual = getRitualById(ritualId);
    if (!ritual) {
      return NextResponse.json(
        { error: 'Ritual not found' },
        { status: 404 }
      );
    }
    
    // Check if already completed today
    const today = new Date().toDateString();
    const completionKey = `${session.userId}-${ritualId}-${today}`;
    
    if (global.ritualCompletions.has(completionKey)) {
      return NextResponse.json(
        { error: 'Ritual already completed today' },
        { status: 400 }
      );
    }
    
    // Record completion
    const completion = {
      id: crypto.randomUUID(),
      userId: session.userId,
      ritualId,
      completedAt: new Date().toISOString(),
      completionData,
      bytesEarned: ritual.bytes_reward
    };
    
    global.ritualCompletions.set(completionKey, completion);
    
    // Update user stats
    user.bytes = (user.bytes || 0) + ritual.bytes_reward;
    
    // Update ritual streak (if this is daily ritual)
    const streakKey = `daily-ritual-${session.userId}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${session.userId}-daily-${yesterday.toDateString()}`;
    
    if (global.ritualCompletions.has(yesterdayKey)) {
      user.ritual_streak = (user.ritual_streak || 0) + 1;
    } else {
      user.ritual_streak = 1; // Reset streak
    }
    
    // Save updated user
    global.localUsers.set(session.userId, user);
    
    console.log(`✅ Ritual completed: ${ritual.title} by user ${session.userId}`);
  console.log(`User stats: Bytes: ${user.bytes}`);
    
    return NextResponse.json({
      success: true,
      message: 'Ritual completed successfully!',
  bytesEarned: ritual.bytes_reward,
  totalBytes: user.bytes,
      ritualStreak: user.ritual_streak || 1
    });
    
  } catch (error) {
    console.error('Error completing ritual:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
