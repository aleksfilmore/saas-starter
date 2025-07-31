// Ritual Bank - The Sacred Vault of Emotional Hacks

export type RitualCategory = 
  | 'grief-cycle'
  | 'petty-purge' 
  | 'glow-up-forge'
  | 'reframe-loop'
  | 'ghost-cleanse'
  | 'public-face'
  | 'soft-reset'
  | 'cult-missions';

export type EmotionalTone = 'rage' | 'softness' | 'grief' | 'spite' | 'neutral';
export type ActionType = 'reflect' | 'destroy' | 'create' | 'share' | 'digital';

export interface Ritual {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  category: RitualCategory;
  emotionalTone: EmotionalTone;
  actionType: ActionType;
  xpReward: number;
  byteReward: number;
  tags: string[];
  tier: 'ghost' | 'firewall' | 'deep-reset';
  estimatedTime: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
}

export const RITUAL_CATEGORIES = {
  'grief-cycle': {
    icon: '🩸',
    title: 'THE GRIEF CYCLE',
    subtitle: 'Emotional Decay in 8-Bit',
    description: 'Raw, tender, dissolve-yourself stuff'
  },
  'petty-purge': {
    icon: '🔥',
    title: 'THE PETTY PURGE',
    subtitle: 'Spite in Ritual Form',
    description: 'Sabotage urges alchemized into sass'
  },
  'glow-up-forge': {
    icon: '⚒️',
    title: 'THE GLOW-UP FORGE',
    subtitle: 'Identity Under Reconstruction',
    description: 'Rebuilding identity with dramatic flair'
  },
  'reframe-loop': {
    icon: '🌀',
    title: 'THE REFRAME LOOP',
    subtitle: 'Mental Gymnastics for Liberation',
    description: 'Perception-bending, "maybe I was the red flag" energy'
  },
  'ghost-cleanse': {
    icon: '👻',
    title: 'THE GHOST CLEANSE',
    subtitle: 'Exorcisms for the Modern Soul',
    description: 'Digital exorcisms, blocklists, memory purges'
  },
  'public-face': {
    icon: '🎭',
    title: 'THE PUBLIC FACE',
    subtitle: 'High-Functioning Heartbreak Rituals',
    description: 'Rituals for surviving brunch, work, or social exposure'
  },
  'soft-reset': {
    icon: '🌙',
    title: 'THE SOFT RESET',
    subtitle: 'Stillness Rituals for Glitch Recovery',
    description: 'Breathwork, self-soothing, micro-mindfulness'
  },
  'cult-missions': {
    icon: '🕹️',
    title: 'THE CULT MISSIONS',
    subtitle: 'Gamified Healing for the Emotionally Deranged',
    description: 'Gamified or social rituals to earn Bytes or badges'
  }
};

export const RITUAL_BANK: Ritual[] = [
  // GRIEF CYCLE RITUALS
  {
    id: 'grief-01',
    title: 'Name the Ruins',
    description: 'Write down three things that died with this relationship.',
    instructions: [
      'Find a quiet space with pen and paper or open a notes app',
      'Write down three things that died with this relationship - not just the person, but hopes, habits, versions of you',
      'Choose your closure method: burn the paper, delete the note, or bury the list',
      'Take a moment to acknowledge what you\'re releasing'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    xpReward: 15,
    byteReward: 25,
    tags: ['writing', 'closure', 'release'],
    tier: 'ghost',
    estimatedTime: '10-15 minutes',
    difficultyLevel: 2
  },
  {
    id: 'grief-02',
    title: 'Cry Like a System Crash',
    description: 'Set a timer for ten minutes. No distractions. Cry.',
    instructions: [
      'Set a timer for exactly 10 minutes',
      'Put your phone on silent and put it away',
      'Sit or lie down somewhere comfortable',
      'Let yourself cry - ugly, loud, like a corrupted file getting overwritten',
      'When the timer goes off, take three deep breaths and drink some water'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    xpReward: 20,
    byteReward: 30,
    tags: ['emotional-release', 'self-care', 'processing'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 3
  },
  {
    id: 'grief-03',
    title: 'Dress for the Funeral (of a Feeling)',
    description: 'Wear all black. Even if you\'re not leaving the house.',
    instructions: [
      'Put on an all-black outfit - whatever feels right',
      'Look in the mirror and acknowledge what you\'re mourning',
      'Say out loud: "Today I mourn the me that waited for a text that never came"',
      'Wear this outfit for the entire day as a ritual of acknowledgment',
      'Take one photo if you want to mark this moment'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'create',
    xpReward: 10,
    byteReward: 20,
    tags: ['ritual', 'mourning', 'acknowledgment'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },

  // PETTY PURGE RITUALS
  {
    id: 'petty-01',
    title: 'Block. Report. Smile.',
    description: 'Go through your social media. Find every trace of them.',
    instructions: [
      'Open all your social media apps one by one',
      'Search for your ex\'s name and profile',
      'Block them on every platform - Instagram, TikTok, Snapchat, Twitter, everything',
      'Block their close friends if seeing them triggers you',
      'After each block, literally smile - you\'re deleting malware',
      'Take a screenshot of one "User not found" message as proof'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'digital',
    xpReward: 25,
    byteReward: 40,
    tags: ['social-media', 'boundaries', 'digital-hygiene'],
    tier: 'ghost',
    estimatedTime: '15-20 minutes',
    difficultyLevel: 2
  },
  {
    id: 'petty-02',
    title: 'The Anti-Muse Manifesto',
    description: 'Write a poem about them with zero romanticism.',
    instructions: [
      'Open your notes app or grab a piece of paper',
      'Write a poem about your ex with brutal honesty - no romance, no softness',
      'Make it sharp, stupid, or chaotic - whatever feels true',
      'Give it a title like "This Is Why I Swiped Left on Myself"',
      'Read it out loud once, then decide: keep it or delete it',
      'Optional: Post it anonymously on the Wall of Wounds'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'create',
    xpReward: 20,
    byteReward: 35,
    tags: ['writing', 'creativity', 'truth-telling'],
    tier: 'firewall',
    estimatedTime: '15-25 minutes',
    difficultyLevel: 3
  },

  // GLOW-UP FORGE RITUALS
  {
    id: 'glow-01',
    title: 'New System Alias',
    description: 'Pick a new name. A codename. A glitch identity.',
    instructions: [
      'Think of a name that represents who you\'re becoming - not who you were',
      'It can be completely made up, a username, or just a nickname',
      'Write it somewhere sacred - mirror, phone wallpaper, journal',
      'Practice introducing yourself with this name in the mirror',
      'From now on, when you talk to yourself, use this name'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'create',
    xpReward: 15,
    byteReward: 25,
    tags: ['identity', 'reinvention', 'self-naming'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'glow-02',
    title: 'The Hot Mirror Monologue',
    description: 'Look in the mirror for two full minutes. No phone. No filter.',
    instructions: [
      'Stand in front of a mirror with no distractions',
      'Set a timer for 2 minutes and just stare at yourself',
      'No checking your phone, no adjusting anything - just look',
      'After 2 minutes, say three truths about yourself out loud',
      'These should be things that no ex gets to touch or define',
      'End with: "This face deserves better than breadcrumbs"'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    xpReward: 20,
    byteReward: 30,
    tags: ['self-love', 'affirmations', 'mirror-work'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 3
  },

  // REFRAME LOOP RITUALS
  {
    id: 'reframe-01',
    title: 'The Flag Flip',
    description: 'Take one thing you thought was cute about them.',
    instructions: [
      'Think of one trait you found "cute" or "charming" about your ex',
      'Write it down exactly as you used to think about it',
      'Now rewrite it as the red flag it actually was',
      'Example: "He was spontaneous" → "He had zero impulse control and trauma-dodged like a champ"',
      'Keep this reframe visible - screenshot it or write it on a sticky note'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    xpReward: 15,
    byteReward: 25,
    tags: ['reframing', 'red-flags', 'clarity'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },

  // GHOST CLEANSE RITUALS
  {
    id: 'ghost-01',
    title: 'The Inbox Massacre',
    description: 'Search their name in your inbox, WhatsApp, or DMs.',
    instructions: [
      'Open your messages app and search their name',
      'Do the same for WhatsApp, Instagram DMs, any messaging platform',
      'Archive or delete everything - no mercy, no rereading',
      'If you feel the urge to read old messages, close the app immediately',
      'Bonus: Uninstall one messaging app for 24 hours for a clean reset'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    xpReward: 25,
    byteReward: 40,
    tags: ['digital-cleanse', 'messages', 'boundaries'],
    tier: 'ghost',
    estimatedTime: '15 minutes',
    difficultyLevel: 3
  },

  // PUBLIC FACE RITUALS
  {
    id: 'public-01',
    title: 'Smile Like a Glitch',
    description: 'Practice a fake smile in the mirror. Not for lying. For surviving.',
    instructions: [
      'Stand in front of a mirror',
      'Practice different types of smiles - polite, mysterious, unbothered',
      'Pick one that feels like armor, not a mask',
      'Name your smile (like "The Unbothered" or "System Override")',
      'Practice deploying it when someone asks "How\'s dating?" or "You look great!"'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'create',
    xpReward: 10,
    byteReward: 20,
    tags: ['social-armor', 'public-appearance', 'survival'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },

  // SOFT RESET RITUALS
  {
    id: 'soft-01',
    title: 'The Single-Task Day',
    description: 'Pick one thing. Just one. Do it slowly.',
    instructions: [
      'Choose one simple task for today - could be making tea, organizing one drawer, taking a shower',
      'Do only this task with complete focus',
      'No multitasking, no rushing, no pressure',
      'Move slowly and intentionally, like your system is running in safe mode',
      'When complete, acknowledge: "I did one thing well today"'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    xpReward: 15,
    byteReward: 25,
    tags: ['mindfulness', 'single-tasking', 'gentleness'],
    tier: 'ghost',
    estimatedTime: 'Variable',
    difficultyLevel: 1
  },

  // CULT MISSIONS RITUALS
  {
    id: 'cult-01',
    title: 'Streak Surge',
    description: 'Log in five days in a row. Earn a badge.',
    instructions: [
      'Open the CTRL+ALT+BLOCK app',
      'Check in daily for 5 consecutive days',
      'Complete at least one ritual each day',
      'If you break the streak, write a haiku about your relapse',
      'Post the haiku on the Wall of Wounds or keep it private - your choice'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    xpReward: 50,
    byteReward: 75,
    tags: ['streak', 'consistency', 'community'],
    tier: 'firewall',
    estimatedTime: '5 minutes daily',
    difficultyLevel: 2
  }
];

// Utility functions
export function getRitualsByCategory(category: RitualCategory): Ritual[] {
  return RITUAL_BANK.filter(ritual => ritual.category === category);
}

export function getRitualsByTier(tier: 'ghost' | 'firewall' | 'deep-reset'): Ritual[] {
  return RITUAL_BANK.filter(ritual => ritual.tier === tier);
}

export function getRandomRitual(userTier: 'ghost' | 'firewall' | 'deep-reset' = 'ghost'): Ritual {
  const availableRituals = getRitualsByTier(userTier);
  return availableRituals[Math.floor(Math.random() * availableRituals.length)];
}

export function getDailyRitual(day: number, mode: 'linear' | 'random' | 'emotional' = 'linear'): Ritual {
  if (mode === 'random') {
    return getRandomRitual();
  }
  
  // Linear mode: cycle through categories by week
  const categories: RitualCategory[] = [
    'grief-cycle', 'petty-purge', 'glow-up-forge', 'reframe-loop',
    'ghost-cleanse', 'public-face', 'soft-reset', 'cult-missions'
  ];
  
  const weekNumber = Math.floor((day - 1) / 7);
  const category = categories[weekNumber % categories.length];
  const categoryRituals = getRitualsByCategory(category);
  
  const dayInWeek = (day - 1) % 7;
  return categoryRituals[dayInWeek % categoryRituals.length];
}
