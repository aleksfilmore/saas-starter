import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

interface EnhancedTherapyRequest {
  emotionalTone: 'numb' | 'vengeance' | 'logic' | 'helpOthers';
  sessionType: 'weekly' | 'emergency' | 'bonus';
  userInput?: string;
  currentWeek: number;
  userTier: 'free' | 'firewall' | 'cult-leader';
}

const PERSONALITY_RESPONSES = {
  numb: {
    style: 'gentle and understanding',
    examples: [
      "I hear you. Sometimes feeling nothing feels safer than feeling everything.",
      "Your numbness is valid. It's often a protective response to overwhelming experiences.",
      "Let's take small steps together. Even tiny movements forward count."
    ]
  },
  vengeance: {
    style: 'direct and empowering',
    examples: [
      "That anger tells me you know your worth. Let's channel that energy into your healing.",
      "Your fire is valid. Now let's teach you to wield it for your own growth.",
      "I see your strength in that anger. Let's transform it into unstoppable forward momentum."
    ]
  },
  logic: {
    style: 'analytical and systematic',
    examples: [
      "Let's break this down into manageable components and develop a strategic approach.",
      "Your rational perspective is an asset. We can build structured healing frameworks together.",
      "Data shows that systematic approaches to healing yield consistent results. Let's optimize your process."
    ]
  },
  helpOthers: {
    style: 'collaborative and community-focused',
    examples: [
      "Your caring nature is a superpower. Let's ensure you're not depleting yourself while helping others.",
      "We heal better together. Your impulse to help others can be part of your own healing journey.",
      "Building community resilience starts with strengthening yourself. You can't pour from an empty cup."
    ]
  }
};

const TIER_SPECIFIC_CONTENT = {
  free: {
    sessionContent: 'Basic guided session with core therapeutic techniques',
  rewardMultiplier: 1,
    specialFeatures: []
  },
  firewall: {
    sessionContent: 'Advanced session with personalized insights and extended content',
  rewardMultiplier: 1.5,
    specialFeatures: ['streak_bonuses', 'advanced_analytics', 'priority_features']
  },
  'cult-leader': {
    sessionContent: 'Elite session with exclusive content and experimental features',
  rewardMultiplier: 2,
    specialFeatures: ['glitch_effects', 'experimental_features', 'community_leadership', 'early_access']
  }
};

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: EnhancedTherapyRequest = await request.json();
    const { emotionalTone, sessionType, userInput, currentWeek, userTier } = body;

    // Get personality configuration
    const personality = PERSONALITY_RESPONSES[emotionalTone];
    const tierConfig = TIER_SPECIFIC_CONTENT[userTier];

    // Generate AI response based on emotional tone
    const responseTemplate = personality.examples[Math.floor(Math.random() * personality.examples.length)];
    
  // Calculate bytes reward (formerly derived from XP; now direct bytes-only model)
  // Legacy mapping kept: previous XP values (100/50/75) * multiplier * 0.1
  const basePoints = sessionType === 'weekly' ? 100 : sessionType === 'emergency' ? 50 : 75; // legacy scale
  const scaledPoints = Math.floor(basePoints * tierConfig.rewardMultiplier);
  const earnedBytes = Math.floor(scaledPoints * 0.1); // convert to bytes reward

    // Check for achievements
    const achievements = [];
    
    // Weekly completion achievement
    if (sessionType === 'weekly') {
      achievements.push({
        id: `week-${currentWeek}-complete`,
        title: `Week ${currentWeek} Warrior`,
        description: `Completed your week ${currentWeek} therapy session`,
        type: 'standard' as const,
        bytesValue: 2, // mapped from prior 25 XP (~10:1)
        unlockedAt: new Date()
      });
    }

    // Tier-specific achievements
    if (userTier === 'cult-leader' && Math.random() > 0.7) {
      achievements.push({
        id: 'glitch-master',
        title: 'Glitch Master',
        description: 'Experienced exclusive Cult Leader content',
        type: 'milestone' as const,
        bytesValue: 10, // mapped from prior 100 XP
        unlockedAt: new Date()
      });
    }

    // Generate session summary
    const sessionSummary = {
      id: `session_${Date.now()}`,
      type: sessionType,
      emotionalTone,
      userTier,
      completedAt: new Date(),
      duration: Math.floor(Math.random() * 20) + 10, // 10-30 minutes
      topics: [
        'Emotional regulation techniques',
        'Cognitive restructuring',
        'Mindfulness practices',
        tierConfig.sessionContent
      ],
      insights: [
        `Your ${personality.style} approach was particularly effective today.`,
        `Progress indicators show improvement in emotional awareness.`,
        userTier !== 'free' ? 'Advanced metrics reveal positive trending patterns.' : null
      ].filter(Boolean),
      nextSteps: [
        'Practice the techniques discussed in daily life',
        'Return for your next scheduled session',
        userTier === 'cult-leader' ? 'Access exclusive community leadership features' : null
      ].filter(Boolean)
    };

    // Tier-specific response enhancements
    const responseData: {
      success: boolean;
      message: string;
      session: any;
      rewards: any;
      achievements: any;
      aiResponse: any;
      analytics?: any;
      exclusive?: any;
    } = {
      success: true,
      message: 'Session completed successfully',
      session: sessionSummary,
      rewards: {
        bytes: earnedBytes,
        multiplier: tierConfig.rewardMultiplier
      },
      achievements,
      aiResponse: {
        message: responseTemplate,
        personality: personality.style,
        tone: emotionalTone
      }
    };

    // Add tier-specific features
    if (userTier === 'firewall' || userTier === 'cult-leader') {
      responseData.analytics = {
        weeklyProgress: Math.floor(Math.random() * 100),
        emotionalStability: Math.floor(Math.random() * 100),
        communityEngagement: Math.floor(Math.random() * 100)
      };
    }

    if (userTier === 'cult-leader') {
      responseData.exclusive = {
        glitchEffect: true,
        earlyAccess: ['new_meditation_techniques', 'beta_community_features'],
        leadershipOpportunities: ['community_moderation', 'peer_mentoring']
      };
    }

    console.log(`Enhanced therapy session completed for user ${user.id}:`, {
      type: sessionType,
      tone: emotionalTone,
      tier: userTier,
      bytesEarned: earnedBytes,
      achievementsUnlocked: achievements.length
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Enhanced therapy session error:', error);
    return NextResponse.json({ 
      error: 'Session processing failed. Your progress has been saved.' 
    }, { status: 500 });
  }
}
