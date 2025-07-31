// REFORMAT PROTOCOL™ Onboarding System
// Handles multi-step onboarding with assessments and codename generation

import { db } from '../db/connection';
import { users, onboardingResponses } from '../db/reformat-schema';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { awardXP, awardBytes } from '../gamification/engine';

// =====================================
// CODENAME GENERATION
// =====================================

const CODENAME_PREFIXES = [
  // Tech/Digital
  'BYTE', 'PIXEL', 'CODE', 'DATA', 'LINK', 'NODE', 'CORE', 'SYNC', 'FLUX', 'WIRE',
  'GRID', 'LOOP', 'CACHE', 'STACK', 'FRAME', 'SHIFT', 'MERGE', 'PARSE', 'QUERY',
  
  // Emotional/Recovery
  'GHOST', 'ECHO', 'VOID', 'NUMB', 'RAGE', 'LOST', 'TORN', 'BURN', 'COLD', 'SHARP',
  'DARK', 'WILD', 'BROKEN', 'FIERCE', 'STORM', 'SHADOW', 'FROST', 'EMBER', 'STEEL',
  
  // Mystical/Aesthetic
  'NOVA', 'ZERO', 'NEON', 'CYBER', 'GLITCH', 'VIRUS', 'MATRIX', 'PRISM', 'LASER',
  'CHROME', 'VAPOR', 'DIGITAL', 'NEURAL', 'QUANTUM', 'HOLOGRAM', 'CIRCUIT'
];

const CODENAME_SUFFIXES = [
  // Numbers
  '01', '02', '99', '404', '500', '666', '777', '808', '911', '1337',
  
  // Tech Terms
  'EXE', 'DLL', 'ZIP', 'RAM', 'CPU', 'GPU', 'SSD', 'USB', 'API', 'SQL',
  'HTTP', 'JSON', 'HTML', 'CSS', 'JS', 'AI', 'ML', 'VR', 'AR', 'IoT',
  
  // Emotional States
  'ACHE', 'SCAR', 'TEAR', 'WOUND', 'HURT', 'PAIN', 'LOSS', 'GONE', 'DEAD',
  'VOID', 'NULL', 'EMPTY', 'HOLLOW', 'BROKEN', 'SHATTERED', 'RUINED',
  
  // Recovery Terms
  'HEAL', 'MEND', 'GROW', 'RISE', 'GLOW', 'SHINE', 'STRONG', 'FREE', 'NEW',
  'REBORN', 'PURE', 'CLEAN', 'FRESH', 'CLEAR', 'BRIGHT', 'WHOLE'
];

export function generateCodename(): string {
  const prefix = CODENAME_PREFIXES[Math.floor(Math.random() * CODENAME_PREFIXES.length)];
  const suffix = CODENAME_SUFFIXES[Math.floor(Math.random() * CODENAME_SUFFIXES.length)];
  return `${prefix}_${suffix}`;
}

export function generateCodenameOptions(count: number = 5): string[] {
  const options = new Set<string>();
  while (options.size < count) {
    options.add(generateCodename());
  }
  return Array.from(options);
}

// =====================================
// ATTACHMENT STYLE ASSESSMENT
// =====================================

export interface AttachmentQuestion {
  id: string;
  text: string;
  type: 'scale' | 'choice';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: [string, string];
}

export const ATTACHMENT_QUESTIONS: AttachmentQuestion[] = [
  {
    id: 'worry_abandonment',
    text: 'I worry about being abandoned or left behind in relationships',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'uncomfortable_closeness',
    text: 'I find it difficult to get close to romantic partners',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'need_approval',
    text: 'I need a lot of approval from my partner',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'prefer_independence',
    text: 'I prefer not to show others how I feel deep down',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'fear_rejection',
    text: 'I worry that romantic partners won\'t care about me as much as I care about them',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'nervous_depending',
    text: 'I get nervous when partners want to be very close',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ['Never true', 'Always true']
  },
  {
    id: 'relationship_patterns',
    text: 'Which pattern best describes your relationships?',
    type: 'choice',
    options: [
      'I form deep bonds quickly and worry constantly about losing them',
      'I keep my distance and prefer emotional independence', 
      'I want closeness but also fear it - I push and pull',
      'I feel secure and comfortable with intimacy and independence'
    ]
  }
];

export function calculateAttachmentStyle(responses: Record<string, number | string>): {
  style: 'anxious' | 'avoidant' | 'disorganized' | 'secure';
  scores: Record<string, number>;
  description: string;
} {
  // Simplified scoring algorithm
  const anxiousItems = ['worry_abandonment', 'need_approval', 'fear_rejection'];
  const avoidantItems = ['uncomfortable_closeness', 'prefer_independence', 'nervous_depending'];
  
  const anxiousScore = anxiousItems.reduce((sum, item) => {
    return sum + (typeof responses[item] === 'number' ? responses[item] as number : 0);
  }, 0) / anxiousItems.length;
  
  const avoidantScore = avoidantItems.reduce((sum, item) => {
    return sum + (typeof responses[item] === 'number' ? responses[item] as number : 0);
  }, 0) / avoidantItems.length;

  let style: 'anxious' | 'avoidant' | 'disorganized' | 'secure';
  let description: string;

  if (anxiousScore >= 5 && avoidantScore >= 5) {
    style = 'disorganized';
    description = 'You experience both high anxiety and avoidance in relationships - wanting closeness but fearing it.';
  } else if (anxiousScore >= 5) {
    style = 'anxious';
    description = 'You tend to worry about relationships and seek high levels of closeness and reassurance.';
  } else if (avoidantScore >= 5) {
    style = 'avoidant';
    description = 'You value independence and may feel uncomfortable with too much emotional closeness.';
  } else {
    style = 'secure';
    description = 'You generally feel comfortable with intimacy and independence in relationships.';
  }

  return {
    style,
    scores: { anxious: anxiousScore, avoidant: avoidantScore },
    description
  };
}

// =====================================
// DISTRESS INDEX (BDI-5 Simplified)
// =====================================

export const DISTRESS_QUESTIONS = [
  {
    id: 'sadness',
    text: 'How much have you been feeling sad or empty?',
    options: [
      'Not at all',
      'A little bit', 
      'Moderately',
      'Quite a bit',
      'Extremely'
    ]
  },
  {
    id: 'hopelessness',
    text: 'How hopeless have you been feeling about the future?',
    options: [
      'Not at all',
      'A little bit',
      'Moderately', 
      'Quite a bit',
      'Extremely'
    ]
  },
  {
    id: 'self_worth',
    text: 'How much have you been feeling bad about yourself?',
    options: [
      'Not at all',
      'A little bit',
      'Moderately',
      'Quite a bit', 
      'Extremely'
    ]
  },
  {
    id: 'concentration',
    text: 'How difficult has it been to concentrate?',
    options: [
      'Not at all',
      'A little bit',
      'Moderately',
      'Quite a bit',
      'Extremely'
    ]
  },
  {
    id: 'fatigue',
    text: 'How tired or low on energy have you been feeling?',
    options: [
      'Not at all',
      'A little bit',
      'Moderately',
      'Quite a bit',
      'Extremely'
    ]
  }
];

export function calculateDistressLevel(responses: Record<string, number>): {
  level: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  description: string;
} {
  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  
  let severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  let description: string;

  if (totalScore <= 5) {
    severity = 'minimal';
    description = 'You\'re experiencing minimal distress. You\'re in a good place to focus on growth.';
  } else if (totalScore <= 10) {
    severity = 'mild';
    description = 'You\'re experiencing mild distress. The healing tools here can really help.';
  } else if (totalScore <= 15) {
    severity = 'moderate';
    description = 'You\'re going through a tough time. The support here will be valuable.';
  } else {
    severity = 'severe';
    description = 'You\'re in significant distress. Please also consider professional support alongside these tools.';
  }

  return {
    level: totalScore,
    severity,
    description
  };
}

// =====================================
// ONBOARDING FLOW MANAGEMENT
// =====================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isComplete: boolean;
  data?: any;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  userId: string;
}

export async function initializeOnboarding(userId: string): Promise<OnboardingProgress> {
  const steps: OnboardingStep[] = [
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
  ];

  return {
    currentStep: 0,
    totalSteps: steps.length,
    steps,
    userId
  };
}

export async function saveOnboardingStep(
  userId: string,
  stepId: string,
  responses: Record<string, any>
): Promise<{ success: boolean; nextStep?: string; error?: string }> {
  try {
    // Save responses to database
    await db.insert(onboardingResponses).values({
      id: generateId(15),
      userId,
      step: stepId,
      responses,
      scores: calculateStepScores(stepId, responses),
    });

    // Handle specific step completion logic
    if (stepId === 'codename') {
      await db.update(users)
        .set({ codename: responses.selectedCodename })
        .where(eq(users.id, userId));
    }
    
    if (stepId === 'avatar') {
      await db.update(users)
        .set({ avatar: responses.selectedAvatar })
        .where(eq(users.id, userId));
    }

    if (stepId === 'attachment_assessment') {
      const attachment = calculateAttachmentStyle(responses);
      await db.update(users)
        .set({ attachmentStyle: attachment.style })
        .where(eq(users.id, userId));
    }

    if (stepId === 'distress_index') {
      const distress = calculateDistressLevel(responses);
      await db.update(users)
        .set({ distressLevel: distress.level })
        .where(eq(users.id, userId));
    }

    if (stepId === 'program_selection') {
      await db.update(users)
        .set({ 
          programPath: responses.selectedProgram,
          dailyRitualCount: responses.ritualFrequency 
        })
        .where(eq(users.id, userId));
    }

    // Check if this is the final step
    if (stepId === 'complete') {
      await db.update(users)
        .set({ 
          onboardingCompleted: true,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      // Award completion bonuses
      await awardXP(userId, 'ONBOARDING_COMPLETE', 100, 'Onboarding completed!');
      await awardBytes(userId, 100, 'BONUS', 'Welcome bonus for completing onboarding!');
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving onboarding step:', error);
    return { success: false, error: 'Failed to save onboarding progress' };
  }
}

function calculateStepScores(stepId: string, responses: Record<string, any>): any {
  switch (stepId) {
    case 'attachment_assessment':
      return calculateAttachmentStyle(responses);
    case 'distress_index':
      return calculateDistressLevel(responses);
    default:
      return null;
  }
}

export async function getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
  try {
    // Get user's completed steps
    const completedSteps = await db.select()
      .from(onboardingResponses)
      .where(eq(onboardingResponses.userId, userId));

    const progress = await initializeOnboarding(userId);
    
    // Mark completed steps
    const completedStepIds = new Set(completedSteps.map(step => step.step));
    progress.steps.forEach(step => {
      step.isComplete = completedStepIds.has(step.id);
    });

    // Find current step (first incomplete step)
    const currentStepIndex = progress.steps.findIndex(step => !step.isComplete);
    progress.currentStep = currentStepIndex === -1 ? progress.steps.length - 1 : currentStepIndex;

    return progress;
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    return null;
  }
}

// =====================================
// AVATAR SYSTEM
// =====================================

export const AVATAR_OPTIONS = [
  { id: 'neon_ghost', name: 'Neon Ghost', category: 'digital', mood: 'mysterious' },
  { id: 'cyber_wolf', name: 'Cyber Wolf', category: 'digital', mood: 'fierce' },
  { id: 'glitch_cat', name: 'Glitch Cat', category: 'digital', mood: 'playful' },
  { id: 'void_phoenix', name: 'Void Phoenix', category: 'mystical', mood: 'rising' },
  { id: 'frost_dragon', name: 'Frost Dragon', category: 'mystical', mood: 'powerful' },
  { id: 'broken_angel', name: 'Broken Angel', category: 'dark', mood: 'wounded' },
  { id: 'rage_demon', name: 'Rage Demon', category: 'dark', mood: 'angry' },
  { id: 'shadow_ninja', name: 'Shadow Ninja', category: 'dark', mood: 'hidden' },
  { id: 'numb_robot', name: 'Numb Robot', category: 'digital', mood: 'disconnected' },
  { id: 'healing_crystal', name: 'Healing Crystal', category: 'mystical', mood: 'peaceful' },
];

export function getAvatarsByMood(attachmentStyle?: string, distressLevel?: number) {
  // Suggest avatars based on assessment results
  if (distressLevel && distressLevel > 15) {
    return AVATAR_OPTIONS.filter(avatar => 
      ['wounded', 'angry', 'disconnected'].includes(avatar.mood)
    );
  }
  
  if (attachmentStyle === 'anxious') {
    return AVATAR_OPTIONS.filter(avatar => 
      ['mysterious', 'wounded', 'hidden'].includes(avatar.mood)
    );
  }
  
  if (attachmentStyle === 'avoidant') {
    return AVATAR_OPTIONS.filter(avatar => 
      ['fierce', 'powerful', 'disconnected'].includes(avatar.mood)
    );
  }

  return AVATAR_OPTIONS; // Show all options
}
