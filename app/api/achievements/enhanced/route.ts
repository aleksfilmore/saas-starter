import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';

interface AchievementRequest {
  action: 'unlock' | 'claim' | 'share' | 'list';
  achievementId?: string;
  shareData?: {
    platform: 'twitter' | 'discord' | 'reddit' | 'copy';
    message?: string;
  };
}

const ACHIEVEMENT_REGISTRY = {
  // Onboarding Achievements
  'welcome-aboard': {
    id: 'welcome-aboard',
    title: 'Welcome Aboard',
    description: 'Joined the CTRL+ALT+BLOCK™ community',
    type: 'standard' as const,
    bytesValue: 25,
    category: 'onboarding',
    icon: '🎯',
    rarity: 'common'
  },
  'first-session': {
    id: 'first-session',
    title: 'First Steps',
    description: 'Completed your first therapy session',
    type: 'standard' as const,
    bytesValue: 50,
    category: 'therapy',
    icon: '🎮',
    rarity: 'common'
  },

  // Streak Achievements
  'week-streak': {
    id: 'week-streak',
    title: 'Week Warrior',
    description: '7-day session streak',
    type: 'milestone' as const,
    bytesValue: 100,
    category: 'consistency',
    icon: '🔥',
    rarity: 'uncommon'
  },
  'month-streak': {
    id: 'month-streak',
    title: 'Month Master',
    description: '30-day session streak',
    type: 'milestone' as const,
    bytesValue: 250,
    category: 'consistency',
    icon: '🏆',
    rarity: 'rare'
  },

  // Community Achievements
  'wall-warrior': {
    id: 'wall-warrior',
    title: 'Wall Warrior',
    description: 'Posted 10 times on Wall of Wounds',
    type: 'standard' as const,
    bytesValue: 75,
    category: 'community',
    icon: '📱',
    rarity: 'common'
  },
  'helper-healer': {
    id: 'helper-healer',
    title: 'Helper Healer',
    description: 'Supported 50 community members',
    type: 'milestone' as const,
    bytesValue: 150,
    category: 'community',
    icon: '🤝',
    rarity: 'uncommon'
  },

  // Byte Milestones (replacing former XP milestones)
  'bytes-1000': {
    id: 'bytes-1000',
    title: 'Rising Phoenix',
    description: 'Accumulated 1,000 bytes',
    type: 'milestone' as const,
    bytesValue: 50,
    category: 'progression',
    icon: '🔥',
    rarity: 'uncommon'
  },
  'bytes-5000': {
    id: 'bytes-5000',
    title: 'Digital Sage',
    description: 'Accumulated 5,000 bytes',
    type: 'milestone' as const,
    bytesValue: 125,
    category: 'progression',
    icon: '✨',
    rarity: 'rare'
  },

  // Tier-Specific Achievements
  'firewall-upgrade': {
    id: 'firewall-upgrade',
    title: 'Firewall Activated',
    description: 'Upgraded to Firewall tier',
    type: 'milestone' as const,
    bytesValue: 100,
    category: 'tier',
    icon: '🛡️',
    rarity: 'uncommon'
  },
  'cult-leader-ascension': {
    id: 'cult-leader-ascension',
    title: 'Cult Leader Ascension',
    description: 'Achieved ultimate healing tier',
    type: 'legendary' as const,
    bytesValue: 250,
    category: 'tier',
    icon: '👑',
    rarity: 'legendary'
  },

  // Special Achievements
  'glitch-master': {
    id: 'glitch-master',
    title: 'Glitch Master',
    description: 'Experienced exclusive Cult Leader content',
    type: 'legendary' as const,
    bytesValue: 50,
    category: 'special',
    icon: '⚡',
    rarity: 'legendary'
  },
  'protocol-ghost': {
    id: 'protocol-ghost',
    title: 'Protocol Ghost',
    description: 'Had an extended conversation with the AI ghost',
    type: 'standard' as const,
    bytesValue: 35,
    category: 'special',
    icon: '👻',
    rarity: 'uncommon'
  }
};

const SHARE_TEMPLATES = {
  twitter: {
    'welcome-aboard': "Just joined CTRL+ALT+BLOCK™ - the next generation of digital healing! 🎯 Ready to start my journey. #DigitalHealing #CTRLALTBLOCk",
    'week-streak': "7 days of consistent healing work! 🔥 Building momentum with CTRL+ALT+BLOCK™. #HealingStreak #DigitalWellness",
    'cult-leader-ascension': "Achieved Cult Leader status in CTRL+ALT+BLOCK™! 👑 Leading the digital healing revolution. #CTRLALTBLOCk #HealingLeader"
  },
  discord: {
    'welcome-aboard': "🎯 **New Member Alert!** Just joined the CTRL+ALT+BLOCK™ community. Ready to level up my healing game!",
    'week-streak': "🔥 **Week Streak Unlocked!** 7 days of consistent progress on CTRL+ALT+BLOCK™. The momentum is real!",
    'cult-leader-ascension': "👑 **CULT LEADER ASCENDED!** Reached the ultimate tier in CTRL+ALT+BLOCK™. The healing revolution continues!"
  }
};

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AchievementRequest = await request.json();
    const { action, achievementId, shareData } = body;

    switch (action) {
      case 'list':
        // Return user's achievements (mock implementation)
        const userAchievements = [
          {
            ...ACHIEVEMENT_REGISTRY['welcome-aboard'],
            unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            claimed: true
          },
          {
            ...ACHIEVEMENT_REGISTRY['first-session'],
            unlockedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            claimed: true
          },
          {
            ...ACHIEVEMENT_REGISTRY['wall-warrior'],
            unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            claimed: false
          }
        ];

        return NextResponse.json({
          achievements: userAchievements,
          stats: {
            totalUnlocked: userAchievements.length,
            totalClaimed: userAchievements.filter(a => a.claimed).length,
            totalBytes: userAchievements.reduce((sum, a) => sum + (a.claimed ? (a as any).bytesValue : 0), 0),
            categories: {
              onboarding: userAchievements.filter(a => a.category === 'onboarding').length,
              therapy: userAchievements.filter(a => a.category === 'therapy').length,
              community: userAchievements.filter(a => a.category === 'community').length,
              progression: userAchievements.filter(a => a.category === 'progression').length
            }
          }
        });

      case 'unlock':
        if (!achievementId || !(achievementId in ACHIEVEMENT_REGISTRY)) {
          return NextResponse.json({ error: 'Invalid achievement ID' }, { status: 400 });
        }

        const achievement = ACHIEVEMENT_REGISTRY[achievementId as keyof typeof ACHIEVEMENT_REGISTRY];
        
        // Mock unlock logic - in real app, check if user meets criteria
        const canUnlock = true; // Replace with actual validation
        
        if (!canUnlock) {
          return NextResponse.json({ error: 'Achievement criteria not met' }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'Achievement unlocked!',
          achievement: {
            ...achievement,
            unlockedAt: new Date(),
            claimed: false
          },
          celebration: {
            effect: achievement.rarity === 'legendary' ? 'glitch' : 'sparkle',
            duration: achievement.rarity === 'legendary' ? 5000 : 3000,
            sound: achievement.rarity === 'legendary' ? 'legendary' : 'standard'
          }
        });

      case 'claim':
        if (!achievementId || !(achievementId in ACHIEVEMENT_REGISTRY)) {
          return NextResponse.json({ error: 'Invalid achievement ID' }, { status: 400 });
        }

  const claimAchievement = ACHIEVEMENT_REGISTRY[achievementId as keyof typeof ACHIEVEMENT_REGISTRY];
        
        // Mock claim logic - in real app, check if user has unlocked this achievement
        return NextResponse.json({
          success: true,
          message: 'Reward claimed!',
          rewards: {
            bytes: claimAchievement.bytesValue,
            badgeUnlocked: true
          },
          achievement: {
            ...claimAchievement,
            claimed: true,
            claimedAt: new Date()
          }
        });

      case 'share':
        if (!achievementId || !shareData) {
          return NextResponse.json({ error: 'Missing share data' }, { status: 400 });
        }

        if (!(achievementId in ACHIEVEMENT_REGISTRY)) {
          return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
        }

  const shareAchievement = ACHIEVEMENT_REGISTRY[achievementId as keyof typeof ACHIEVEMENT_REGISTRY];

        // Generate share content
        const shareContent = shareData.message || 
          (shareData.platform in SHARE_TEMPLATES && 
           achievementId in SHARE_TEMPLATES[shareData.platform as keyof typeof SHARE_TEMPLATES] ? 
           SHARE_TEMPLATES[shareData.platform as keyof typeof SHARE_TEMPLATES][achievementId as keyof typeof SHARE_TEMPLATES[keyof typeof SHARE_TEMPLATES]] : 
           null) ||
          `Just unlocked "${shareAchievement.title}" in CTRL+ALT+BLOCK™! 🎯`;

        // Generate share URLs
        const shareUrls = {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`,
          discord: shareContent, // Discord bots would handle this differently
          reddit: `https://reddit.com/submit?title=${encodeURIComponent(shareAchievement.title)}&text=${encodeURIComponent(shareContent)}`,
          copy: shareContent
        };

        return NextResponse.json({
          success: true,
          shareContent,
          shareUrl: shareUrls[shareData.platform],
          achievement: shareAchievement,
          bonusReward: {
            bytes: 10,
            message: 'Bonus bytes for sharing your achievement!'
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Enhanced achievements error:', error);
    return NextResponse.json({ 
      error: 'Achievement system temporarily unavailable' 
    }, { status: 500 });
  }
}
