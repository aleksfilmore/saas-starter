import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return that user has no credits (to trigger purchase flow)
    // In a real implementation, you'd check a voice_therapy_credits table
    return NextResponse.json({
      hasCredits: false,
      remainingMinutes: 0
    });
  } catch (error) {
    console.error('Voice therapy credits check error:', error);
    return NextResponse.json(
      { error: 'Failed to check credits' },
      { status: 500 }
    );
  }
}
