// API endpoint for getting onboarding progress
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Mock onboarding progress structure
const createOnboardingProgress = (userId: string) => ({
  currentStep: 0,
  totalSteps: 9,
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to REFORMAT PROTOCOL™',
      description: 'Your journey to systematic heartbreak recovery begins here.',
      component: 'WelcomeStep',
      isComplete: false
    },
    {
      id: 'codename',
      title: 'Choose Your Digital Identity',
      description: 'Select a codename that represents your new chapter.',
      component: 'CodenameStep', 
      isComplete: false
    },
    {
      id: 'avatar',
      title: 'Customize Your Avatar',
      description: 'Pick an avatar that matches your vibe.',
      component: 'AvatarStep',
      isComplete: false
    },
    {
      id: 'attachment_assessment',
      title: 'Attachment Style Scan',
      description: 'Understanding your relationship patterns helps us customize your experience.',
      component: 'AttachmentAssessment',
      isComplete: false
    },
    {
      id: 'heart_state_assessment',
      title: 'State of Heart Analysis', 
      description: 'Tell us about your current heartbreak situation so we can personalize your healing journey.',
      component: 'HeartStateAssessment',
      isComplete: false
    },
    {
      id: 'distress_index',
      title: 'Current State Analysis',
      description: 'Let\'s gauge where you\'re at emotionally right now.',
      component: 'DistressAssessment',
      isComplete: false
    },
    {
      id: 'program_selection',
      title: 'Choose Your Protocol',
      description: 'Select your recovery timeline and commitment level.',
      component: 'ProgramSelection',
      isComplete: false
    },
    {
      id: 'ritual_preferences',
      title: 'Ritual Customization',
      description: 'Set up your daily ritual preferences and schedule.',
      component: 'RitualPreferences',
      isComplete: false
    },
    {
      id: 'complete',
      title: 'Protocol Initialized',
      description: 'Your REFORMAT PROTOCOL™ is ready. Let the healing begin.',
      component: 'CompletionStep',
      isComplete: false
    }
  ],
  userId
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // In a full implementation, this would check the database for completed steps
    // For now, return a fresh onboarding progress
    const progress = createOnboardingProgress(userId);

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get onboarding progress' },
      { status: 500 }
    );
  }
}
