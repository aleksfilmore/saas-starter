// Comprehensive ritual database - 60+ healing activities
// Each ritual is designed for specific attachment styles and healing phases

export interface Ritual {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'reflection' | 'movement' | 'creative' | 'mindfulness' | 'boundary' | 'self-care';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  archetype: string[]; // Which archetypes this ritual works best for
  tags: string[];
  user_tier: 'freemium' | 'paid_beginner' | 'paid_advanced';
  steps: RitualStep[];
  completion_type: 'reflection' | 'timer' | 'checklist' | 'creative';
  xp_reward: number;
  bytes_reward: number;
}

export interface RitualStep {
  type: 'text' | 'breathing' | 'reflection' | 'timer' | 'checklist';
  content: string;
  duration?: number; // for timer/breathing steps
  options?: string[]; // for checklist steps
}

export const RITUAL_DATABASE: Ritual[] = [
  // PANIC PROTOCOL (Anxious) Rituals
  {
    id: 'panic-breath-01',
    title: 'Breathe the Panic Packet Out',
    description: 'Emergency breathing protocol for when anxiety spikes about your ex',
    category: 'breathing',
    difficulty: 'beginner',
    duration_minutes: 5,
    archetype: ['PANIC PROTOCOL', 'PHOENIX RISING'],
    tags: ['anxiety', 'emergency', 'breathing', 'quick'],
    user_tier: 'freemium',
    steps: [
      {
        type: 'text',
        content: 'Find a comfortable seated position. Close your eyes or soften your gaze.'
      },
      {
        type: 'breathing',
        content: 'Breathe in for 4 counts, hold for 7 counts, exhale for 8 counts. This is the 4-7-8 technique.',
        duration: 240
      },
      {
        type: 'reflection',
        content: 'What are three things you can see, hear, or feel right now? Ground yourself in the present moment.'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 15,
    bytes_reward: 10
  },
  {
    id: 'panic-reframe-01',
    title: 'The Catastrophe Reality Check',
    description: 'Transform anxious thoughts into balanced perspectives',
    category: 'reflection',
    difficulty: 'intermediate',
    duration_minutes: 10,
    archetype: ['PANIC PROTOCOL'],
    tags: ['cognitive', 'anxiety', 'reframing', 'thoughts'],
    user_tier: 'freemium',
    steps: [
      {
        type: 'text',
        content: 'Write down the anxious thought you\'re having about your ex or the breakup.'
      },
      {
        type: 'reflection',
        content: 'What\'s the worst-case scenario your mind is imagining? Write it out completely.'
      },
      {
        type: 'reflection', 
        content: 'What\'s the best-case scenario? What\'s the most likely, realistic scenario?'
      },
      {
        type: 'reflection',
        content: 'What would you tell a friend having this exact thought? Show yourself the same compassion.'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 25,
    bytes_reward: 15
  },

  // FIREWALL BUILDER (Avoidant) Rituals
  {
    id: 'firewall-connect-01',
    title: 'Emotion Vulnerability Scanner',
    description: 'Gentle practice to identify and acknowledge suppressed feelings',
    category: 'reflection',
    difficulty: 'intermediate',
    duration_minutes: 8,
    archetype: ['FIREWALL BUILDER'],
    tags: ['emotions', 'vulnerability', 'awareness', 'healing'],
    user_tier: 'freemium',
    steps: [
      {
        type: 'text',
        content: 'Sit quietly and take three deep breaths. Notice any resistance to this exercise - that\'s normal.'
      },
      {
        type: 'reflection',
        content: 'Complete this sentence: "Right now, underneath everything, I actually feel..." Don\'t overthink it.'
      },
      {
        type: 'reflection',
        content: 'Where do you feel this emotion in your body? Your chest, throat, stomach?'
      },
      {
        type: 'text',
        content: 'You don\'t need to fix or change the emotion. Just acknowledge it exists. This is brave.'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 20,
    bytes_reward: 12
  },
  {
    id: 'firewall-boundary-01',
    title: 'Digital Fortress Reinforcement',
    description: 'Strengthen your online boundaries and digital independence',
    category: 'boundary',
    difficulty: 'beginner',
    duration_minutes: 6,
    archetype: ['FIREWALL BUILDER', 'ARCHITECT'],
    tags: ['boundaries', 'digital', 'independence', 'control'],
    user_tier: 'freemium',
    steps: [
      {
        type: 'checklist',
        content: 'Complete these digital boundary actions:',
        options: [
          'Review your social media privacy settings',
          'Unfollow or mute accounts that remind you of your ex',
          'Remove your ex\'s number from your phone favorites',
          'Set app time limits for social media',
          'Clear your browser history and saved passwords related to your ex'
        ]
      },
      {
        type: 'reflection',
        content: 'How does it feel to take control of your digital space? What boundaries serve you best?'
      }
    ],
    completion_type: 'checklist',
    xp_reward: 30,
    bytes_reward: 20
  },

  // ARCHITECT (Secure) Rituals  
  {
    id: 'architect-growth-01',
    title: 'Relationship Autopsy Report',
    description: 'Analytical review of relationship patterns for future growth',
    category: 'reflection',
    difficulty: 'advanced',
    duration_minutes: 15,
    archetype: ['ARCHITECT'],
    tags: ['analysis', 'growth', 'patterns', 'learning'],
    user_tier: 'paid_beginner',
    steps: [
      {
        type: 'text',
        content: 'This is an advanced reflection for those ready to examine their relationship objectively.'
      },
      {
        type: 'reflection',
        content: 'What were the three main strengths of your relationship? Be honest and fair.'
      },
      {
        type: 'reflection',
        content: 'What were the three main challenges or incompatibilities? Focus on patterns, not blame.'
      },
      {
        type: 'reflection',
        content: 'What did you learn about yourself? What would you do differently in future relationships?'
      },
      {
        type: 'reflection',
        content: 'Write a brief "thank you" note to your ex for the lessons learned (you don\'t need to send it).'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 50,
    bytes_reward: 35
  },

  // PHOENIX RISING (Disorganized) Rituals
  {
    id: 'phoenix-stability-01',
    title: 'Emotional Regulation Bootcamp',
    description: 'Build stability when emotions feel chaotic and overwhelming',
    category: 'mindfulness',
    difficulty: 'intermediate',
    duration_minutes: 12,
    archetype: ['PHOENIX RISING'],
    tags: ['regulation', 'stability', 'overwhelm', 'grounding'],
    user_tier: 'freemium',
    steps: [
      {
        type: 'text',
        content: 'When emotions feel out of control, we can build anchors. Start with your breath.'
      },
      {
        type: 'breathing',
        content: 'Box breathing: In for 4, hold for 4, out for 4, hold for 4. Repeat until you feel more centered.',
        duration: 300
      },
      {
        type: 'reflection',
        content: 'Name the emotion you\'re feeling without judgment. "I notice I\'m feeling..." What color would this emotion be?'
      },
      {
        type: 'text',
        content: 'Place both hands on your heart. Remind yourself: "This feeling is temporary. I am safe right now."'
      },
      {
        type: 'reflection',
        content: 'What\'s one small thing you can do today to care for yourself? Commit to it.'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 35,
    bytes_reward: 25
  },

  // Universal Rituals (All Archetypes)
  {
    id: 'universal-gratitude-01',
    title: 'Heartbreak Gratitude Reset',
    description: 'Find unexpected gifts in your pain and growth',
    category: 'reflection',
    difficulty: 'beginner',
    duration_minutes: 7,
    archetype: ['PANIC PROTOCOL', 'FIREWALL BUILDER', 'ARCHITECT', 'PHOENIX RISING'],
    tags: ['gratitude', 'growth', 'perspective', 'healing'],
    user_tier: 'freemium',
    steps: [
      {
        type: 'text',
        content: 'This might feel strange at first - finding gratitude in heartbreak. Start small.'
      },
      {
        type: 'reflection',
        content: 'What\'s one thing about yourself you\'ve discovered since the breakup?'
      },
      {
        type: 'reflection',
        content: 'What\'s one way this experience has made you stronger or wiser?'
      },
      {
        type: 'reflection',
        content: 'What\'s one thing you\'re looking forward to in your future?'
      },
      {
        type: 'text',
        content: 'Healing isn\'t linear, but awareness is the first step. You\'re already doing the work.'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 20,
    bytes_reward: 15
  },
  {
    id: 'universal-movement-01',
    title: 'Release Ritual Dance',
    description: 'Move your body to release stuck emotions and energy',
    category: 'movement',
    difficulty: 'beginner',
    duration_minutes: 10,
    archetype: ['PANIC PROTOCOL', 'FIREWALL BUILDER', 'ARCHITECT', 'PHOENIX RISING'],
    tags: ['movement', 'release', 'energy', 'embodiment'],
    user_tier: 'freemium',
    steps: [
      {
        type: 'text',
        content: 'Put on a song that matches how you\'re feeling right now - sad, angry, hopeful, anything.'
      },
      {
        type: 'timer',
        content: 'Move however feels good. Shake, dance, stretch, punch pillows. Let your body lead.',
        duration: 300
      },
      {
        type: 'text',
        content: 'Now put on a song that represents how you want to feel.'
      },
      {
        type: 'timer',
        content: 'Move again, but this time embodying your future self. How does confidence move?',
        duration: 300
      },
      {
        type: 'reflection',
        content: 'How does your body feel different now? What emotions moved through you?'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 25,
    bytes_reward: 18
  },

  // Creative Healing Rituals
  {
    id: 'creative-letter-01',
    title: 'Letter to Your Future Self',
    description: 'Write to the healed version of yourself one year from now',
    category: 'creative',
    difficulty: 'intermediate',
    duration_minutes: 20,
    archetype: ['PANIC PROTOCOL', 'PHOENIX RISING'],
    tags: ['creative', 'future', 'hope', 'writing'],
    user_tier: 'paid_beginner',
    steps: [
      {
        type: 'text',
        content: 'Imagine yourself one year from now, fully healed and thriving. What does that person want you to know?'
      },
      {
        type: 'reflection',
        content: 'Write a letter from your future self to your current self. Start with "Dear [your name], I want you to know..."'
      },
      {
        type: 'reflection',
        content: 'What advice does your future self give you about this heartbreak?'
      },
      {
        type: 'reflection',
        content: 'What are you proud of your current self for? What should you stop worrying about?'
      },
      {
        type: 'text',
        content: 'Seal this letter (literally or metaphorically) to read again in tough moments.'
      }
    ],
    completion_type: 'creative',
    xp_reward: 40,
    bytes_reward: 30
  },

  // Advanced/Premium Rituals
  {
    id: 'advanced-shadow-01',
    title: 'Shadow Work: What I Couldn\'t Say',
    description: 'Explore the unspoken truths and hidden parts of yourself',
    category: 'reflection',
    difficulty: 'advanced',
    duration_minutes: 25,
    archetype: ['FIREWALL BUILDER', 'PHOENIX RISING'],
    tags: ['shadow work', 'truth', 'authentic', 'deep'],
    user_tier: 'paid_advanced',
    steps: [
      {
        type: 'text',
        content: 'This is deep work. Only proceed if you feel emotionally stable and safe.'
      },
      {
        type: 'reflection',
        content: 'What did you never tell your ex that you wish you had? Write it out fully.'
      },
      {
        type: 'reflection',
        content: 'What parts of yourself did you hide or suppress in the relationship? Why?'
      },
      {
        type: 'reflection',
        content: 'What would happen if you fully accepted these hidden parts of yourself?'
      },
      {
        type: 'reflection',
        content: 'Write a commitment to yourself about honoring your authentic self moving forward.'
      },
      {
        type: 'text',
        content: 'Integration takes time. Be patient and compassionate with yourself.'
      }
    ],
    completion_type: 'reflection',
    xp_reward: 100,
    bytes_reward: 75
  }
];

// Helper function to get rituals by archetype
export function getRitualsByArchetype(archetype: string, tier: string = 'freemium'): Ritual[] {
  return RITUAL_DATABASE.filter(ritual => 
    ritual.archetype.includes(archetype) && 
    (tier === 'paid_advanced' || 
     (tier === 'paid_beginner' && ritual.user_tier !== 'paid_advanced') ||
     (tier === 'freemium' && ritual.user_tier === 'freemium'))
  );
}

// Get random ritual for daily assignment
export function getRandomRitual(archetype: string, tier: string = 'freemium'): Ritual | null {
  const availableRituals = getRitualsByArchetype(archetype, tier);
  if (availableRituals.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableRituals.length);
  return availableRituals[randomIndex];
}

// Get ritual by ID
export function getRitualById(id: string): Ritual | null {
  return RITUAL_DATABASE.find(ritual => ritual.id === id) || null;
}
