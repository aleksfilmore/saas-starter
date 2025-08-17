import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { duration } = await request.json();

    // In a real implementation, you'd:
    // 1. End the voice session
    // 2. Update user's remaining credits
    // 3. Save session data for analytics
    
    return NextResponse.json({
      success: true,
      message: 'Voice therapy session ended',
      durationUsed: duration || 0
    });
  } catch (error) {
    console.error('Voice therapy end error:', error);
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    );
  }
}
