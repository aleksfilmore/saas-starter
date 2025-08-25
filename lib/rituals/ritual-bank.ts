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
  byteReward: number;
  tags: string[];
  tier: 'ghost' | 'firewall';
  estimatedTime: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
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
  // xpReward removed (deprecated)
    byteReward: 75,
    tags: ['streak', 'consistency', 'community'],
    tier: 'firewall',
    estimatedTime: '5 minutes daily',
    difficultyLevel: 2
  }
  ,
  // --- EXPANDED GHOST RITUAL BANK BELOW (goal: 90 ghost-tier rituals total) ---
  // GRIEF CYCLE (additional)
  {
    id: 'grief-04',
    title: 'Voice Memo Burial',
    description: 'Record a 60s uncensored memo about the breakup then archive it.',
    instructions: [
      'Open your phone voice memo app',
      'Record a raw 60 second stream-of-consciousness message to your past self',
      'Do not edit or replay; immediately rename it "Buried Packet"',
      'Archive or move it to a hidden folder—no relistening today'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    byteReward: 28,
    tags: ['voice', 'release', 'one-take'],
    tier: 'ghost',
    estimatedTime: '5-8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'grief-05',
    title: 'Pixel Altar',
    description: 'Assemble a tiny digital collage and then delete it ceremonially.',
    instructions: [
      'Create a collage of 5–7 images that represent what you lost (no actual photos of them)',
      'Look at the collage for 30 quiet seconds',
      'Say: "I can keep the meaning without keeping the ghost"',
      'Delete the collage and empty trash'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'create',
    byteReward: 32,
    tags: ['collage', 'symbolism', 'closure'],
    tier: 'ghost',
    estimatedTime: '12-18 minutes',
    difficultyLevel: 3
  },
  {
    id: 'grief-06',
    title: 'The Unsent Receipt',
    description: 'List what you gave that wasn\'t seen; keep it for you.',
    instructions: [
      'Write a bullet list titled "What Wasn\'t Valued"',
      'List 5–10 lines (effort, kindness, patience, etc.)',
      'Add a final line: "Still mine. Not wasted"',
      'Store it in a locked note—not to send'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    byteReward: 24,
    tags: ['writing', 'validation', 'self-worth'],
    tier: 'ghost',
    estimatedTime: '8-10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'grief-07',
    title: 'Somatic Download',
    description: 'Locate where the ache sits in your body and map it.',
    instructions: [
      'Sit still and scan your body for tension linked to the breakup',
      'Describe the sensation in three textures (e.g., static, lead, glass)',
      'Place your hand there and breathe in for 4, out for 6, ten times',
      'Log what changed (if anything) in a sentence'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    byteReward: 30,
    tags: ['somatic', 'breath', 'awareness'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 3
  },
  {
    id: 'grief-08',
    title: 'Tear Data Log',
    description: 'Track your crying like a quantified mystic.',
    instructions: [
      'When you cry today, note start + stop time (no judgment)',
      'After, log intensity 1–5 and dominant emotion word',
      'Add a short compassionate note to yourself',
      'File it under a "System Recovery" note'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    byteReward: 22,
    tags: ['tracking', 'self-compassion', 'data'],
    tier: 'ghost',
    estimatedTime: '5 minutes (plus crying time)',
    difficultyLevel: 1
  },
  {
    id: 'grief-09',
    title: 'Echo Rewrite',
    description: 'Rewrite a phrase they used to say to you—make it yours.',
    instructions: [
      'Pick a phrase they said often (pet name, critique, compliment)',
      'Write it verbatim',
      'Under it, write a reclaim version that serves you now',
      'Read the new line out loud three times'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'create',
    byteReward: 26,
    tags: ['reclaiming', 'language', 'identity'],
    tier: 'ghost',
    estimatedTime: '6-8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'grief-10',
    title: 'Trigger Sandbox',
    description: 'Expose yourself gently to one mild trigger with boundaries.',
    instructions: [
      'Choose a low-intensity trigger (song, location in Maps, emoji)',
      'Set a timer for 2 minutes of intentional exposure',
      'Notice body sensations and label them neutrally',
      'End with grounding: name 5 objects around you'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    byteReward: 34,
    tags: ['exposure', 'resilience', 'grounding'],
    tier: 'ghost',
    estimatedTime: '7-9 minutes',
    difficultyLevel: 4
  },
  {
    id: 'grief-11',
    title: 'Memory Fragment Audit',
    description: 'List 5 memories and rate how distorted they feel now.',
    instructions: [
      'List 5 memorable scenes (no paragraphs)',
      'Next to each, rate Believability vs Reality (B/R) 1–5',
      'Pick one and note what context was missing then',
      'Add a reframe sentence rewriting the meaning'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    byteReward: 30,
    tags: ['memory', 'reframing', 'clarity'],
    tier: 'ghost',
    estimatedTime: '10-12 minutes',
    difficultyLevel: 3
  },
  {
    id: 'grief-12',
    title: 'Goodbye to a Micro-Habit',
    description: 'Retire one tiny habit you only did for them.',
    instructions: [
      'Identify a micro-habit (checking phone at 11:11, saving memes)',
      'State out loud: "This belonged to a dead system state"',
      'Replace it with a neutral or nurturing alternative',
      'Log the replacement in a ritual tracker'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'digital',
    byteReward: 20,
    tags: ['habit', 'replacement', 'closure'],
    tier: 'ghost',
    estimatedTime: '5-6 minutes',
    difficultyLevel: 1
  },
  {
    id: 'grief-13',
    title: 'Future Letter (90 Seconds)',
    description: 'Write a letter FROM future-you who is indifferent.',
    instructions: [
      'Set a 90 second timer',
      'Write as future-you describing a day where this barely registers',
      'Do not edit—even if messy',
      'Seal it in a hidden note titled "Latency Drop"'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'create',
    byteReward: 27,
    tags: ['future-self', 'hope', 'perspective'],
    tier: 'ghost',
    estimatedTime: '3-4 minutes',
    difficultyLevel: 1
  },
  {
    id: 'grief-14',
    title: 'Weather Sync',
    description: 'Match your grief to today\'s weather and narrate it.',
    instructions: [
      'Look outside and name the weather pattern plainly',
      'Write one sentence mapping weather to your internal state',
      'Breathe it in for 3 slow cycles',
      'Release the mapping—note one difference between you and the sky'
    ],
    category: 'grief-cycle',
    emotionalTone: 'grief',
    actionType: 'reflect',
    byteReward: 18,
    tags: ['mindfulness', 'metaphor', 'weather'],
    tier: 'ghost',
    estimatedTime: '4-5 minutes',
    difficultyLevel: 1
  },
  // PETTY PURGE (additional)
  {
    id: 'petty-03',
    title: 'Algorithm Detox',
    description: 'Train your feed away from their archetype.',
    instructions: [
      'Open a social app and search three totally unrelated topics',
      'Like/save five pieces of content in each new lane',
      'Mute or hide any recommended similar-to-them profiles',
      'Clear watch history if applicable'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'digital',
    byteReward: 33,
    tags: ['algorithm', 'social-media', 'detox'],
    tier: 'ghost',
    estimatedTime: '10-12 minutes',
    difficultyLevel: 2
  },
  {
    id: 'petty-04',
    title: 'Petty Playlist Purge',
    description: 'Archive a shared playlist and spawn a new mood.',
    instructions: [
      'Locate any playlist tied to them',
      'Duplicate it, rename the copy something irreverent',
      'Delete 3 songs that hurt the most',
      'Add 3 songs that feel like upgrade energy'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'digital',
    byteReward: 29,
    tags: ['music', 'reclaiming', 'curation'],
    tier: 'ghost',
    estimatedTime: '8-10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'petty-05',
    title: 'Judgment Recode',
    description: 'List 5 silent judgments you held back—then neutralize them.',
    instructions: [
      'Write 5 petty judgments you never said out loud',
      'For each, write a neutral redesign (remove venom, keep truth)',
      'Delete or shred the original venom list',
      'Keep only the neutral insights'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'reflect',
    byteReward: 26,
    tags: ['writing', 'processing', 'neutralization'],
    tier: 'ghost',
    estimatedTime: '10-12 minutes',
    difficultyLevel: 3
  },
  {
    id: 'petty-06',
    title: 'Nickname Nullifier',
    description: 'Erase their pet name from all systems.',
    instructions: [
      'Search your notes, photos, messages for their nickname',
      'Delete or rename any leftover references',
      'Replace one with a sarcastic placeholder for closure',
      'Log completion in a tiny note titled "Freed Bytes"'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'digital',
    byteReward: 24,
    tags: ['cleanup', 'naming', 'digital-hygiene'],
    tier: 'ghost',
    estimatedTime: '7-9 minutes',
    difficultyLevel: 2
  },
  {
    id: 'petty-07',
    title: 'Silent Roast Draft',
    description: 'Write a comedic roast—never send it.',
    instructions: [
      'Open a blank note titled "Disposable Roast"',
      'Write punchy lines about habits that annoyed you',
      'Stop at 10 lines max',
      'Delete file after a deep breath'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'create',
    byteReward: 22,
    tags: ['humor', 'release', 'writing'],
    tier: 'ghost',
    estimatedTime: '6-7 minutes',
    difficultyLevel: 1
  },
  {
    id: 'petty-08',
    title: 'Blocked + Beautified',
    description: 'After blocking, customize your wallpaper for post-ex energy.',
    instructions: [
      'Confirm they are blocked everywhere',
      'Design or pick a new lock screen that encodes your upgrade era',
      'Add a single affirmation line',
      'Screenshot it for progress tracking'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'digital',
    byteReward: 27,
    tags: ['aesthetic', 'phone', 'affirmation'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'petty-09',
    title: 'Subtweet Transmute',
    description: 'Turn a subtweet urge into a private satire line.',
    instructions: [
      'Notice the urge to post something pointed',
      'Write the raw subtweet line unfiltered',
      'Rewrite it as an absurd metaphor',
      'Archive the metaphor only'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'reflect',
    byteReward: 19,
    tags: ['impulse-control', 'rewrite', 'humor'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },
  {
    id: 'petty-10',
    title: 'Hate-Follow Purge',
    description: 'Unfollow 5 accounts you monitor out of habit.',
    instructions: [
      'Open following list',
      'Identify 5 accounts tied to comparison loops',
      'Unfollow or mute each',
      'Note energy reclaimed in one line'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'digital',
    byteReward: 30,
    tags: ['unfollow', 'comparison', 'detox'],
    tier: 'ghost',
    estimatedTime: '8-9 minutes',
    difficultyLevel: 2
  },
  {
    id: 'petty-11',
    title: 'Breadcrumb Firewall',
    description: 'Document last 3 low-effort pings you tolerated.',
    instructions: [
      'List the last 3 low-effort interactions (likes, half-replies)',
      'Write why each felt unsatisfying',
      'Draft a boundary sentence you\'ll use next time',
      'Commit to deploying at first recurrence'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'reflect',
    byteReward: 31,
    tags: ['boundaries', 'clarity', 'patterns'],
    tier: 'ghost',
    estimatedTime: '12 minutes',
    difficultyLevel: 3
  },
  {
    id: 'petty-12',
    title: 'Status Vacuum',
    description: 'Remove one platform status/bio line referencing heartbreak.',
    instructions: [
      'Audit your bios/status lines',
      'Delete one cryptic heartbreak reference',
      'Replace with a value or interest (not a person)',
      'Take a before/after screenshot (optional)'
    ],
    category: 'petty-purge',
    emotionalTone: 'spite',
    actionType: 'digital',
    byteReward: 23,
    tags: ['bio', 'rewrite', 'identity'],
    tier: 'ghost',
    estimatedTime: '6 minutes',
    difficultyLevel: 1
  },
  // GLOW-UP FORGE (additional)
  {
    id: 'glow-03',
    title: 'Identity Moodboard v1',
    description: 'Collect 9 images of who you\'re becoming—no couple aesthetics.',
    instructions: [
      'Open Pinterest or similar',
      'Save 9 images representing your next chapter qualities',
      'Discard any chosen purely out of reaction to them',
      'Name board "Recompile v1"'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'create',
    byteReward: 34,
    tags: ['visualization', 'identity', 'future-self'],
    tier: 'ghost',
    estimatedTime: '15 minutes',
    difficultyLevel: 3
  },
  {
    id: 'glow-04',
    title: 'Micro-Upgrade Task',
    description: 'Choose one 5-minute chore symbolic of re-entry.',
    instructions: [
      'Pick a micro task (wipe desk, wash mug, rename a folder)',
      'State intention: "This action boots a cleaner build"',
      'Complete it with focused breathing',
      'Log completion in journal'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'create',
    byteReward: 21,
    tags: ['environment', 'activation', 'symbolic'],
    tier: 'ghost',
    estimatedTime: '5-7 minutes',
    difficultyLevel: 1
  },
  {
    id: 'glow-05',
    title: 'Embodied Walk Patch',
    description: 'Walk for 7 minutes narrating traits you\'re compiling.',
    instructions: [
      'Start a timer for 7 minute walk',
      'Each minute, name one trait you\'re installing (e.g., patience, discernment)',
      'On last minute, say all traits in sequence',
      'Hydrate after'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 28,
    tags: ['movement', 'affirmation', 'embodiment'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'glow-06',
    title: 'Wardrobe Recompile',
    description: 'Assemble one outfit replacing an ex-influenced item.',
    instructions: [
      'Identify an item you wore to please them',
      'Create an outfit without it',
      'Photograph for private log',
      'Donate or box the old item (if ready)'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'create',
    byteReward: 32,
    tags: ['style', 'agency', 'reinvention'],
    tier: 'ghost',
    estimatedTime: '15 minutes',
    difficultyLevel: 3
  },
  {
    id: 'glow-07',
    title: 'Self-Intro Rewrite',
    description: 'Write a new 2-line bio excluding relationship descriptors.',
    instructions: [
      'Write your current go-to self intro',
      'Cross out any relational anchor (girlfriend, partner, etc.)',
      'Rewrite into skill/value/curiosity focus',
      'Practice speaking aloud once'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 24,
    tags: ['bio', 'identity', 'communication'],
    tier: 'ghost',
    estimatedTime: '6-7 minutes',
    difficultyLevel: 2
  },
  {
    id: 'glow-08',
    title: 'System Integrity Scan',
    description: 'Rate 6 life domains 1–5; pick one upgrade micro-step.',
    instructions: [
      'Domains: Sleep, Nutrition, Movement, Focus, Social, Creative',
      'Rate each honestly 1–5',
      'Pick the lowest and define a single-step patch',
      'Schedule it for today'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 29,
    tags: ['self-audit', 'optimization', 'planning'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'glow-09',
    title: 'Body Neutral Mirror',
    description: 'Observe 3 body parts functionally—no aesthetic judgment.',
    instructions: [
      'Stand at mirror and choose 3 body parts',
      'Describe each by function only (e.g., "legs move me to safety")',
      'Thank each part once',
      'Leave mirror without correction attempts'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 23,
    tags: ['body-neutrality', 'mindfulness'],
    tier: 'ghost',
    estimatedTime: '5-6 minutes',
    difficultyLevel: 1
  },
  {
    id: 'glow-10',
    title: 'Micro-Skill Install',
    description: 'Spend 8 minutes practicing a tiny skill (not related to them).',
    instructions: [
      'Pick a micro skill: finger stretch, chord shape, micro doodle pattern',
      'Set 8 minute timer',
      'Practice without evaluating progress',
      'Log how focus felt afterwards'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'create',
    byteReward: 31,
    tags: ['learning', 'focus', 'flow'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 3
  },
  {
    id: 'glow-11',
    title: 'Upgrade Declaration Clip',
    description: 'Record a 5 second hype line for yourself.',
    instructions: [
      'Open camera (front or back)',
      'Record a 5 second line naming your next chapter',
      'Save it to a locked/hidden album',
      'Tag file name with today\'s date'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'create',
    byteReward: 27,
    tags: ['video', 'affirmation', 'future-self'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },
  {
    id: 'glow-12',
    title: 'Digital Folder Reset',
    description: 'Reorganize one cluttered folder representing old era sprawl.',
    instructions: [
      'Pick one folder (photos, docs, notes)',
      'Archive or delete 10 obsolete items',
      'Create a new folder named after a value (e.g., CLARITY)',
      'Move 2 inspiring files inside'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 30,
    tags: ['organization', 'minimalism', 'digital-declutter'],
    tier: 'ghost',
    estimatedTime: '12 minutes',
    difficultyLevel: 2
  },
  {
    id: 'glow-13',
    title: 'Sleep Environment Patch',
    description: 'Change one element of your sleep space to mark a reset.',
    instructions: [
      'Identify one friction point (light, noise, clutter)',
      'Apply a 10-minute improvement',
      'State: "Rest fuels rebuild"',
      'Note in journal if mood shifts tomorrow'
    ],
    category: 'glow-up-forge',
    emotionalTone: 'neutral',
    actionType: 'create',
    byteReward: 26,
    tags: ['sleep', 'environment', 'rest'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },
  // REFRAME LOOP (additional)
  {
    id: 'reframe-02',
    title: 'Binary Breaker',
    description: 'Take a black/white thought and generate 3 grey variants.',
    instructions: [
      'Write the absolute thought (e.g., "I always pick the wrong person")',
      'List three alternative nuanced statements',
      'Circle the most balanced one',
      'Read it aloud twice'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 22,
    tags: ['cognition', 'nuance', 'thought-work'],
    tier: 'ghost',
    estimatedTime: '6-7 minutes',
    difficultyLevel: 2
  },
  {
    id: 'reframe-03',
    title: 'Timeline Distortion Check',
    description: 'Plot 5 key events chronologically to reality-test.',
    instructions: [
      'List 5 milestone events from relationship',
      'Write the month/year for each (estimate okay)',
      'Note one emotion you felt then vs now',
      'Underline any fabricated golden period'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 27,
    tags: ['timeline', 'memory', 'reality-check'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 3
  },
  {
    id: 'reframe-04',
    title: 'Outcome Swap',
    description: 'Swap a painful outcome with a protective interpretation.',
    instructions: [
      'Write one painful event or rejection',
      'Describe the protective function it accidentally served',
      'Add one sentence: "If it stayed, cost would have been..."',
      'Sit with that cost for 20 seconds'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 25,
    tags: ['protection', 'meaning-making'],
    tier: 'ghost',
    estimatedTime: '7-8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'reframe-05',
    title: 'Selective Memory Patch',
    description: 'Counter one rose-washed memory with 3 factual contrasts.',
    instructions: [
      'Write the glowing memory title',
      'List 3 factual elements you forgot that complicate it',
      'Bold the most grounding fact',
      'Store in a "Reality Patches" note'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 24,
    tags: ['memory', 'contrast', 'grounding'],
    tier: 'ghost',
    estimatedTime: '6-7 minutes',
    difficultyLevel: 2
  },
  {
    id: 'reframe-06',
    title: 'Value Drift Scan',
    description: 'List top 5 values now vs during relationship.',
    instructions: [
      'Write two columns: THEN / NOW',
      'Fill each with 5 values',
      'Circle any that vanished or emerged',
      'Write one sentence about the drift pattern'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 23,
    tags: ['values', 'growth', 'awareness'],
    tier: 'ghost',
    estimatedTime: '8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'reframe-07',
    title: 'Projection Detector',
    description: 'Identify one thing you projected onto them that wasn\'t there.',
    instructions: [
      'Write a trait you believed they had',
      'List evidence FOR and AGAINST from memory',
      'Decide if it was projection, partial, or real',
      'Note what need fueled projection'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 29,
    tags: ['projection', 'introspection', 'clarity'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 3
  },
  {
    id: 'reframe-08',
    title: 'Evidence Ledger',
    description: 'Document 3 signals you ignored and why.',
    instructions: [
      'List three ignored signals/red flags',
      'For each, write the story you told yourself',
      'Then write a neutral objective description',
      'Conclude with one pattern you\'ll watch for'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 30,
    tags: ['red-flags', 'accountability'],
    tier: 'ghost',
    estimatedTime: '12 minutes',
    difficultyLevel: 3
  },
  {
    id: 'reframe-09',
    title: 'Self-Blame Debug',
    description: 'Trace one blame loop to its origin belief.',
    instructions: [
      'Write the blame statement',
      'Ask "What would have to be true for this to be fully my fault?"',
      'List the assumptions that surfaces',
      'Challenge one assumption with counter-evidence'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 31,
    tags: ['cognitive', 'beliefs', 'self-compassion'],
    tier: 'ghost',
    estimatedTime: '10-12 minutes',
    difficultyLevel: 4
  },
  {
    id: 'reframe-10',
    title: 'Attachment Recode',
    description: 'Name your past attachment pattern; draft new micro-behavior.',
    instructions: [
      'Identify one past attachment style tendency',
      'Describe a micro-behavior that fed it',
      'Create a substitute micro-behavior',
      'Commit to testing it once this week'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 33,
    tags: ['attachment', 'behavior', 'growth'],
    tier: 'ghost',
    estimatedTime: '12 minutes',
    difficultyLevel: 4
  },
  {
    id: 'reframe-11',
    title: 'Identity Gap Map',
    description: 'Map who you performed as vs who you were internally.',
    instructions: [
      'Draw two columns: Performed / Felt',
      'List 5 mismatches',
      'Circle the costliest mismatch',
      'Write how you\'ll close that gap in one sentence'
    ],
    category: 'reframe-loop',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 28,
    tags: ['authenticity', 'identity', 'alignment'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 3
  },
  // GHOST CLEANSE (additional)
  {
    id: 'ghost-02',
    title: 'App Icon Shuffle',
    description: 'Rearrange or hide an app tied to obsessive checking.',
    instructions: [
      'Identify one app linked to rumination',
      'Move it off your home screen or into a folder named "Quarantine"',
      'Add one uplifting widget or note in its place',
      'Observe craving intensity for 30 seconds'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 25,
    tags: ['habit-break', 'phone', 'environment'],
    tier: 'ghost',
    estimatedTime: '5-6 minutes',
    difficultyLevel: 1
  },
  {
    id: 'ghost-03',
    title: 'Archive Vault',
    description: 'Move a batch of old media into a cold storage folder.',
    instructions: [
      'Create a folder named "Cold Storage - Do Not Reopen"',
      'Select 10+ photos/screenshots indirectly tied to them',
      'Move them without previewing',
      'Collapse folder and do not reopen today'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 34,
    tags: ['photos', 'archiving', 'boundaries'],
    tier: 'ghost',
    estimatedTime: '12 minutes',
    difficultyLevel: 3
  },
  {
    id: 'ghost-04',
    title: 'Search History Flush',
    description: 'Clear search history containing their name/initials.',
    instructions: [
      'Open app/site search history',
      'Delete entries referencing them',
      'Replace last 3 searches with neutral topics',
      'Close app intentionally'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 22,
    tags: ['search', 'cleanup', 'replacement'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },
  {
    id: 'ghost-05',
    title: 'Notification Audit',
    description: 'Disable 3 non-essential notifications fueling anxious loops.',
    instructions: [
      'Open notification settings',
      'Identify 3 sources of micro-spikes',
      'Disable or switch to digest mode',
      'Note emotional baseline after 1 hour (later)'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 27,
    tags: ['notifications', 'anxiety', 'digital-hygiene'],
    tier: 'ghost',
    estimatedTime: '7-8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'ghost-06',
    title: 'Sleep Mode Lock',
    description: 'Set a nightly downtime or focus mode to block late spirals.',
    instructions: [
      'Open focus/do not disturb settings',
      'Configure a nightly window (e.g., 10pm–7am)',
      'Exclude only essential contacts',
      'Activate it immediately'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 30,
    tags: ['focus-mode', 'boundaries', 'sleep'],
    tier: 'ghost',
    estimatedTime: '8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'ghost-07',
    title: 'Reminder Purge',
    description: 'Delete calendar/reminder items seeded by the relationship.',
    instructions: [
      'Scan calendar for recurring or leftover reminders tied to them',
      'Delete minimum 3',
      'Add a new recurring reminder supporting healing (hydrate, stretch)',
      'Sync across devices'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 28,
    tags: ['calendar', 'cleanup', 'replacement'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'ghost-08',
    title: 'Emoji Detox',
    description: 'Remove 5 emojis from favorites list associated with them.',
    instructions: [
      'Open frequently used emojis panel',
      'Spam-send random neutral emojis to push out sentimental ones',
      'Add one new empowering symbol (🔥🗡️⚡ etc.)',
      'Clear chat history used for spam (if needed)'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 21,
    tags: ['emoji', 'micro-habit', 'repattern'],
    tier: 'ghost',
    estimatedTime: '5-6 minutes',
    difficultyLevel: 1
  },
  {
    id: 'ghost-09',
    title: 'Memory Anchor Swap',
    description: 'Replace one lock screen widget/complication evoke loop.',
    instructions: [
      'Identify a lock screen element that triggers recall',
      'Replace with a neutral data point (weather, steps)',
      'Take a before/after',
      'Delete before shot after review'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 24,
    tags: ['lock-screen', 'trigger', 'swap'],
    tier: 'ghost',
    estimatedTime: '6-7 minutes',
    difficultyLevel: 2
  },
  {
    id: 'ghost-10',
    title: 'Contact Tag Recode',
    description: 'Retag emotional contact groups with neutral names.',
    instructions: [
      'Open contacts or group labels',
      'Rename one cluster to a neutral/functional label',
      'Remove any heart/romance emoji',
      'Back up contacts (optional)'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 23,
    tags: ['contacts', 'naming', 'detachment'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },
  {
    id: 'ghost-11',
    title: 'App Timer Install',
    description: 'Add a 15m/day limit to one doom-scroll platform.',
    instructions: [
      'Pick the worst time-sink app',
      'Install or enable usage limit for 15 minutes',
      'Accept the small friction as self-protection',
      'Log first day compliance later'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 29,
    tags: ['limits', 'screen-time', 'behavior'],
    tier: 'ghost',
    estimatedTime: '7 minutes',
    difficultyLevel: 2
  },
  {
    id: 'ghost-12',
    title: 'Two-Factor Boundary',
    description: 'Enable 2FA on an account you shared access to indirectly.',
    instructions: [
      'Select an account (email, streaming, cloud)',
      'Enable or rotate 2FA method',
      'Revoke any old device sessions',
      'Note increased control feeling'
    ],
    category: 'ghost-cleanse',
    emotionalTone: 'neutral',
    actionType: 'digital',
    byteReward: 35,
    tags: ['security', 'ownership', 'closure'],
    tier: 'ghost',
    estimatedTime: '15 minutes',
    difficultyLevel: 3
  },
  // PUBLIC FACE (additional)
  {
    id: 'public-02',
    title: 'Neutral Script Draft',
    description: 'Write a 1-line response for small talk about breakup.',
    instructions: [
      'Draft one neutral sentence ("Doing a lot of reset work lately")',
      'Practice saying it flat and calm',
      'Add a redirect question you can ask back',
      'Store in notes'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'create',
    byteReward: 20,
    tags: ['script', 'social', 'boundaries'],
    tier: 'ghost',
    estimatedTime: '5-6 minutes',
    difficultyLevel: 1
  },
  {
    id: 'public-03',
    title: 'Social Armor Breath',
    description: 'Before entering a social space, do 3 grounding breaths.',
    instructions: [
      'Stand still before entering space',
      'Inhale 4, hold 2, exhale 6 (repeat x3)',
      'Set intention: one genuine connection > performance',
      'Enter calmly'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 18,
    tags: ['breathing', 'anxiety', 'prep'],
    tier: 'ghost',
    estimatedTime: '3 minutes',
    difficultyLevel: 1
  },
  {
    id: 'public-04',
    title: 'Event Exit Plan',
    description: 'Design a graceful exit phrase before going out.',
    instructions: [
      'Write a polite exit script',
      'Choose a signal (time or body cue) to deploy it',
      'Share script with one ally (optional)',
      'Use it guilt-free if triggered'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 24,
    tags: ['planning', 'boundaries', 'self-trust'],
    tier: 'ghost',
    estimatedTime: '8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'public-05',
    title: 'Micro Eye Contact Practice',
    description: 'Hold 2s eye contact with 3 people today.',
    instructions: [
      'During routine interactions, maintain soft eye contact for 2 seconds',
      'Exhale gently after each',
      'Note if anxiety shifts by the third',
      'Log one observation'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 19,
    tags: ['social-anxiety', 'confidence'],
    tier: 'ghost',
    estimatedTime: 'Day-long micro',
    difficultyLevel: 2
  },
  {
    id: 'public-06',
    title: 'Signal Phrase Prep',
    description: 'Create a one-word signal with a friend for overwhelm exits.',
    instructions: [
      'Pick a friend or safe contact',
      'Decide on one uncommon word',
      'Set expectation for what happens when used',
      'Add to both notes apps'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 26,
    tags: ['support', 'communication', 'safety'],
    tier: 'ghost',
    estimatedTime: '7 minutes',
    difficultyLevel: 2
  },
  {
    id: 'public-07',
    title: 'Post-Social Decompress',
    description: 'After an event, list 3 wins that had nothing to do with them.',
    instructions: [
      'Open a note titled "Social Wins"',
      'List 3 small positive things you managed',
      'Underline any that felt new',
      'Close with a self high-five gesture'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 22,
    tags: ['integration', 'confidence'],
    tier: 'ghost',
    estimatedTime: '6 minutes',
    difficultyLevel: 1
  },
  {
    id: 'public-08',
    title: 'Silence Tolerance Drill',
    description: 'Allow 2 full seconds of silence before replying 5 times.',
    instructions: [
      'In conversations today pause 2 seconds before 5 replies',
      'Notice any urge to fill space',
      'Label the urge mentally (anxiety / appease)',
      'Log whether tolerance improved'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 25,
    tags: ['communication', 'presence'],
    tier: 'ghost',
    estimatedTime: 'Day-long micro',
    difficultyLevel: 3
  },
  {
    id: 'public-09',
    title: 'Compliment Buffer',
    description: 'Practice receiving a compliment with just “Thank you.”',
    instructions: [
      'When complimented, respond only with "Thank you" + eye contact',
      'Resist deflection or minimizing',
      'After interaction note how regulated you felt',
      'Track across 3 occurrences'
    ],
    category: 'public-face',
    emotionalTone: 'neutral',
    actionType: 'reflect',
    byteReward: 23,
    tags: ['reception', 'self-worth'],
    tier: 'ghost',
    estimatedTime: 'Day-long micro',
    difficultyLevel: 3
  },
  // SOFT RESET (additional)
  {
    id: 'soft-02',
    title: 'Box Breathing Patch',
    description: 'Do 4 cycles of 4-4-4-4 breathing.',
    instructions: [
      'Inhale 4',
      'Hold 4',
      'Exhale 4',
      'Hold 4 (repeat x4)' 
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 16,
    tags: ['breathwork', 'calming'],
    tier: 'ghost',
    estimatedTime: '4 minutes',
    difficultyLevel: 1
  },
  {
    id: 'soft-03',
    title: 'Weighted Ground',
    description: 'Place a weighted object on chest for nervous system cue.',
    instructions: [
      'Lie down comfortably',
      'Place a weighted blanket/book over sternum',
      'Track breath for 10 cycles',
      'Remove and notice shift'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 19,
    tags: ['somatic', 'self-soothing'],
    tier: 'ghost',
    estimatedTime: '8 minutes',
    difficultyLevel: 1
  },
  {
    id: 'soft-04',
    title: 'Five Sensory Anchors',
    description: 'List 5 things you can see/hear/feel/smell/taste (1 each).',
    instructions: [
      'Pause and scan environment',
      'State one thing for each sense out loud',
      'Finish with a slow exhale',
      'Log baseline anxiety shift (1–5)'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 17,
    tags: ['grounding', 'sensory'],
    tier: 'ghost',
    estimatedTime: '4-5 minutes',
    difficultyLevel: 1
  },
  {
    id: 'soft-05',
    title: 'Hydration Ritual',
    description: 'Drink a full glass of water with 30 seconds mindful focus.',
    instructions: [
      'Fill a glass fully',
      'Sip slowly imagining it cooling system heat',
      'Note one body sensation after',
      'Record quick log (optional)'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 14,
    tags: ['hydration', 'mindful'],
    tier: 'ghost',
    estimatedTime: '3 minutes',
    difficultyLevel: 1
  },
  {
    id: 'soft-06',
    title: 'Gentle Stretch Cycle',
    description: '3 stretches: neck roll, shoulder roll, spine curl (2 rounds).',
    instructions: [
      'Neck roll each direction slowly',
      'Roll shoulders forward/back 5x',
      'Slow standing spinal curl + rise',
      'Repeat sequence twice'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 18,
    tags: ['stretch', 'movement', 'release'],
    tier: 'ghost',
    estimatedTime: '6 minutes',
    difficultyLevel: 1
  },
  {
    id: 'soft-07',
    title: 'Ambient Sound Bath',
    description: 'Play a neutral ambient track and breathe for 5 minutes.',
    instructions: [
      'Select a neutral ambient/no lyric track',
      'Sit upright or reclined',
      'Close eyes and follow one sound layer',
      'Open eyes slowly after track segment'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 20,
    tags: ['sound', 'calm', 'audio'],
    tier: 'ghost',
    estimatedTime: '7 minutes',
    difficultyLevel: 2
  },
  {
    id: 'soft-08',
    title: 'Self-Compassion Line',
    description: 'Write one kind sentence addressed to current you.',
    instructions: [
      'Open notes',
      'Write: "Even while ____ I still deserve ____"',
      'Fill blanks honestly',
      'Read sentence twice slowly'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 15,
    tags: ['self-kindness', 'language'],
    tier: 'ghost',
    estimatedTime: '3-4 minutes',
    difficultyLevel: 1
  },
  {
    id: 'soft-09',
    title: 'Morning Light Sync',
    description: 'Expose eyes to natural light within 30 mins of waking.',
    instructions: [
      'Go outside or window-facing for 2 minutes',
      'Look (not directly at sun) and breathe evenly',
      'Feel feet grounded',
      'Log wakefulness level after'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 19,
    tags: ['circadian', 'morning', 'energy'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 2
  },
  {
    id: 'soft-10',
    title: 'Body Scan Minute',
    description: 'Do a 60 second head-to-toe scan calling out neutral labels.',
    instructions: [
      'Set 60 second timer',
      'Move attention from crown to toes',
      'Label sensations neutrally (warm, pressure, buzz)',
      'End with one intentional deeper inhale'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 16,
    tags: ['awareness', 'scan', 'presence'],
    tier: 'ghost',
    estimatedTime: '2 minutes',
    difficultyLevel: 1
  },
  {
    id: 'soft-11',
    title: 'Nightly Shutdown Line',
    description: 'Create a simple nightly phrase to end rumination.',
    instructions: [
      'Write a phrase like "System powers down—rumination queued for daylight"',
      'Say it once with lights low',
      'Store it on a bedside card',
      'Repeat for 3 nights (commitment)'
    ],
    category: 'soft-reset',
    emotionalTone: 'softness',
    actionType: 'reflect',
    byteReward: 18,
    tags: ['sleep', 'evening', 'routine'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },
  // CULT MISSIONS (ghost-tier expansion)
  {
    id: 'cult-02',
    title: 'Daily Log Trio',
    description: 'Log 3 emotions for 3 consecutive days (start today).',
    instructions: [
      'Create a note titled EMOTION TRIO',
      'List today\'s top 3 emotions + 1 word need for each',
      'Schedule two follow-up reminders',
      'Return next days to complete'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 36,
    tags: ['tracking', 'consistency'],
    tier: 'ghost',
    estimatedTime: '5 minutes daily',
    difficultyLevel: 2
  },
  {
    id: 'cult-03',
    title: 'Ritual Chain x2',
    description: 'Complete any two ghost rituals back-to-back.',
    instructions: [
      'Select two short ghost rituals',
      'Complete them sequentially without phone scrolling between',
      'Log pair in a chain note',
      'Aim to repeat new chain tomorrow'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 38,
    tags: ['stacking', 'momentum'],
    tier: 'ghost',
    estimatedTime: '15-20 minutes',
    difficultyLevel: 3
  },
  {
    id: 'cult-04',
    title: 'Reflection Streak Seed',
    description: 'Write one 10-word summary line 3 nights in a row (start).',
    instructions: [
      'Write a 10-word max nightly summary line',
      'Tag it with today\'s date',
      'Schedule reminder for next two nights',
      'Keep lines in one note'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 34,
    tags: ['reflection', 'habit'],
    tier: 'ghost',
    estimatedTime: '3 minutes nightly',
    difficultyLevel: 2
  },
  {
    id: 'cult-05',
    title: 'Value Broadcast',
    description: 'Share (privately or publicly) one core value you\'re centering.',
    instructions: [
      'Choose one value word',
      'Write a sentence about how it will show up this week',
      'Optionally post or send to an accountability friend',
      'Log any feedback received'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 32,
    tags: ['values', 'accountability'],
    tier: 'ghost',
    estimatedTime: '8 minutes',
    difficultyLevel: 2
  },
  {
    id: 'cult-06',
    title: 'Morning Ritual Launch',
    description: 'Do one ghost ritual within 60 minutes of waking.',
    instructions: [
      'Pick any short ghost ritual the night before',
      'Complete it within first hour awake',
      'Note energy baseline after',
      'Schedule repeat tomorrow'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 37,
    tags: ['morning', 'activation'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 3
  },
  {
    id: 'cult-07',
    title: 'Night Ritual Anchor',
    description: 'End day with any soft-reset ritual 2 nights in a row (start).',
    instructions: [
      'Select a soft-reset ghost ritual',
      'Complete before sleep tonight',
      'Set reminder for tomorrow',
      'Log how sleep quality felt (subjective)' 
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 31,
    tags: ['evening', 'consistency'],
    tier: 'ghost',
    estimatedTime: '10 minutes',
    difficultyLevel: 2
  },
  {
    id: 'cult-08',
    title: 'Tag + Track',
    description: 'Use a custom tag to track 3 rituals this week (start).',
    instructions: [
      'Pick a unique tag name (e.g., REBUILD-W1)',
      'Add it to today\'s ritual note/log',
      'Plan two more placements later this week',
      'Review occurrences end of week'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 29,
    tags: ['tagging', 'metrics'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 2
  },
  {
    id: 'cult-09',
    title: 'Support Ping',
    description: 'Send a non-drama check-in to a stable friend.',
    instructions: [
      'Pick friend you haven\'t leaned on excessively',
      'Send a short grounded update (not vent dump)',
      'State one win and one intention',
      'Log their response tone'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 28,
    tags: ['connection', 'support'],
    tier: 'ghost',
    estimatedTime: '5 minutes',
    difficultyLevel: 1
  },
  {
    id: 'cult-10',
    title: 'Reflection Stack x3',
    description: 'Complete three reflection-type rituals in one week (start).',
    instructions: [
      'Identify three reflection rituals to attempt this week',
      'Log first today',
      'Schedule placeholder time blocks',
      'Review stack completion at week end'
    ],
    category: 'cult-missions',
    emotionalTone: 'neutral',
    actionType: 'share',
    byteReward: 39,
    tags: ['planning', 'reflection', 'stacking'],
    tier: 'ghost',
    estimatedTime: '15 minutes (distributed)',
    difficultyLevel: 4
  }
];

// Derived metadata
export const GHOST_RITUAL_COUNT = RITUAL_BANK.filter(r => r.tier === 'ghost').length; // should be 90

// Utility functions
export function getRitualsByCategory(category: RitualCategory): Ritual[] {
  return RITUAL_BANK.filter(ritual => ritual.category === category);
}

export function getRitualsByTier(tier: 'ghost' | 'firewall'): Ritual[] {
  return RITUAL_BANK.filter(ritual => ritual.tier === tier);
}

export function getRandomRitual(userTier: 'ghost' | 'firewall' = 'ghost'): Ritual {
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
