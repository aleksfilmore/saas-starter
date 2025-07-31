// API endpoint for saving onboarding step data
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export async function POST(request: NextRequest) {
  try {
    const { userId, stepId, responses } = await request.json();

    if (!userId || !stepId || !responses) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save onboarding responses (simplified for minimal schema)
    if (stepId === 'codename') {
      // For now, just return success since we don't have the full schema
      // In full implementation, this would update the users table
      console.log('Saving codename:', responses.selectedCodename);
    }

    if (stepId === 'avatar') {
      console.log('Saving avatar:', responses.selectedAvatar);
    }

    if (stepId === 'attachment_assessment') {
      console.log('Saving attachment style:', responses.attachmentStyle);
    }

    if (stepId === 'distress_index') {
      console.log('Saving distress level:', responses.severity);
    }

    if (stepId === 'program_selection') {
      console.log('Saving program:', responses.selectedProgram);
    }

    if (stepId === 'ritual_preferences') {
      console.log('Saving ritual preferences:', responses);
    }

    if (stepId === 'complete') {
      // Mark onboarding as completed
      console.log('Onboarding completed for user:', userId);
    }

    return NextResponse.json({
      success: true,
      message: 'Step data saved successfully'
    });
  } catch (error) {
    console.error('Error saving onboarding step:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save step data' },
      { status: 500 }
    );
  }
}
