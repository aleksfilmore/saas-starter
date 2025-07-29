// CTRL+ALT+BLOCK™ Prescribed Daily Rituals
// Curated rituals for heartbreak reprogramming

export interface PrescribedRitual {
  key: string;
  title: string;
  description: string;
  category: 'release' | 'reflection' | 'reprogramming' | 'retribution' | 'glow_up' | 'wild_card';
  instructions: string;
  expectedOutcome: string;
  intensity: 1 | 2 | 3 | 4 | 5; // 1 = gentle, 5 = intense
}

export const PRESCRIBED_RITUALS: PrescribedRitual[] = [
  // 🔁 RELEASE RITUALS
  {
    key: 'emotional_dump',
    title: 'The Emotional Dump',
    description: 'Write every raw, unfiltered thought in 5 minutes. Then purge.',
    category: 'release',
    instructions: 'Set a 5-minute timer. Write everything you feel without stopping. When done, delete or burn the paper.',
    expectedOutcome: 'Emotional release and mental clarity',
    intensity: 3
  },
  {
    key: 'text_never_send',
    title: 'Say It Like It\'s a Text',
    description: 'Draft the message you\'ll never send.',
    category: 'release',
    instructions: 'Open your notes app. Write the text you want to send them. Pour your heart out. Save it. Never send it.',
    expectedOutcome: 'Cathartic expression without consequences',
    intensity: 4
  },
  {
    key: 'playlist_purge',
    title: 'The Playlist Purge',
    description: 'Delete every song they ruined. Make a new playlist for your future self.',
    category: 'release',
    instructions: 'Go through your music. Delete songs that remind you of them. Create a new playlist with 5 empowering songs.',
    expectedOutcome: 'Reclaim your soundtrack',
    intensity: 2
  },
  {
    key: 'ugly_cry_countdown',
    title: 'Ugly Cry Countdown',
    description: 'Set a 3-minute timer and cry on purpose. No interruptions.',
    category: 'release',
    instructions: 'Find a private space. Set a 3-minute timer. Let yourself cry fully. When it ends, take 3 deep breaths.',
    expectedOutcome: 'Emotional release and reset',
    intensity: 4
  },
  {
    key: 'scream_script',
    title: 'Scream Script',
    description: 'Write out what you wish you\'d screamed at them. Then whisper it out loud.',
    category: 'release',
    instructions: 'Write everything you wanted to scream. Read it out loud in a whisper. Feel the power without the chaos.',
    expectedOutcome: 'Controlled anger release',
    intensity: 3
  },
  {
    key: 'dead_chat_ritual',
    title: 'Dead Chat Ritual',
    description: 'Open a chat with their name. Type until the pain stops. Delete it.',
    category: 'release',
    instructions: 'Create a fake chat conversation with their name. Type everything you need to say. When done, delete it all.',
    expectedOutcome: 'Safe emotional expression',
    intensity: 4
  },
  {
    key: 'mirror_glare',
    title: 'The Mirror Glare',
    description: 'Stare at yourself for 1 full minute. No filter. No pity.',
    category: 'release',
    instructions: 'Look in the mirror for 60 seconds straight. See yourself without judgment. Just observe.',
    expectedOutcome: 'Self-awareness and presence',
    intensity: 2
  },
  {
    key: 'destroy_to_create',
    title: 'Destroy to Create',
    description: 'Print an old photo or message. Rip it. Burn it. Bury it. Post-burial breath.',
    category: 'release',
    instructions: 'Find something physical that represents them. Safely destroy it with intention. Take a deep breath afterward.',
    expectedOutcome: 'Symbolic closure and empowerment',
    intensity: 5
  },
  {
    key: 'name_red_flags',
    title: 'Name Their Red Flags',
    description: 'List their toxic traits like items on a menu. Order none.',
    category: 'release',
    instructions: 'Write their red flags as a restaurant menu. Be creative and funny. End with "ORDER: None of the above."',
    expectedOutcome: 'Clarity through humor',
    intensity: 2
  },
  {
    key: 'trash_talk_manifesto',
    title: 'Trash Talk Manifesto',
    description: 'Write 3 savage truths about why this breakup was a blessing.',
    category: 'release',
    instructions: 'List 3 brutal but honest reasons why ending this relationship saved your life. Be ruthless but truthful.',
    expectedOutcome: 'Perspective shift and empowerment',
    intensity: 3
  },

  // 🧠 REFLECTION RITUALS
  {
    key: 'timeline_sketch',
    title: 'Timeline Sketch',
    description: 'Map your relationship from spark to crash. Mark the first red flag.',
    category: 'reflection',
    instructions: 'Draw a timeline of your relationship. Mark major events. Circle the first red flag you ignored.',
    expectedOutcome: 'Pattern recognition and learning',
    intensity: 2
  },
  {
    key: 'loop_detector',
    title: 'The Loop Detector',
    description: 'What patterns have repeated? List your Top 3 heartbreak deja-vus.',
    category: 'reflection',
    instructions: 'Think about past relationships. Write 3 patterns that keep repeating. Be honest about your role.',
    expectedOutcome: 'Self-awareness and growth opportunity',
    intensity: 3
  },
  {
    key: 'shadow_diary',
    title: 'The Shadow Diary',
    description: 'What part of you chose them? Write without self-blame.',
    category: 'reflection',
    instructions: 'Explore what drew you to them initially. Write with curiosity, not judgment. What need were they meeting?',
    expectedOutcome: 'Self-understanding and compassion',
    intensity: 4
  },
  {
    key: 'emotional_audit',
    title: 'Emotional Audit',
    description: 'What 3 emotions are strongest today? Label, don\'t judge.',
    category: 'reflection',
    instructions: 'Identify your top 3 emotions right now. Name them without trying to change them. Just observe.',
    expectedOutcome: 'Emotional awareness and acceptance',
    intensity: 1
  },
  {
    key: 'trigger_tracker',
    title: 'Trigger Tracker',
    description: 'What set you off today? Identify. Deconstruct. Log it.',
    category: 'reflection',
    instructions: 'Think about what triggered you today. Break down: What happened? How did you react? What would help next time?',
    expectedOutcome: 'Trigger awareness and coping strategies',
    intensity: 2
  },

  // 🔒 REPROGRAMMING RITUALS
  {
    key: 'rejection_immunization',
    title: 'Rejection Immunization',
    description: 'Recall a time you were rejected... and survived.',
    category: 'reprogramming',
    instructions: 'Remember a past rejection that hurt but led to something better. Write how surviving it made you stronger.',
    expectedOutcome: 'Resilience building and perspective',
    intensity: 2
  },
  {
    key: 'self_hype_letter',
    title: 'Self-Hype Letter',
    description: 'Write a brag letter about everything you\'ve done right lately.',
    category: 'reprogramming',
    instructions: 'Write yourself a letter listing recent wins, growth, and positive changes. Be your own hype person.',
    expectedOutcome: 'Self-appreciation and confidence boost',
    intensity: 1
  },
  {
    key: 'emotion_scheduling',
    title: 'Emotion Scheduling',
    description: 'Pick a time to feel sad. Stick to it. Outside that, redirect.',
    category: 'reprogramming',
    instructions: 'Set a 15-minute "sadness appointment" today. Feel everything during that time. Outside it, redirect focus.',
    expectedOutcome: 'Emotional regulation and control',
    intensity: 3
  },
  {
    key: 'future_you_broadcast',
    title: 'Future-You Broadcast',
    description: 'Write a voice memo or letter from your future healed self.',
    category: 'reprogramming',
    instructions: 'Imagine yourself 1 year from now, completely healed. Write a message to current you with advice and encouragement.',
    expectedOutcome: 'Hope and forward-thinking perspective',
    intensity: 2
  },
  {
    key: 'reframe_what_if',
    title: 'Reframe the "What If"',
    description: 'Take one "what if" and flip it: "What if this saved me?"',
    category: 'reprogramming',
    instructions: 'Pick one "what if we stayed together" thought. Rewrite it as "what if breaking up saved me from..." Be specific.',
    expectedOutcome: 'Perspective shift and gratitude',
    intensity: 2
  },

  // 🩸 RETRIBUTIVE RITUALS
  {
    key: 'petty_text_machine',
    title: 'The Petty Text Machine',
    description: 'Draft a response they\'ll never deserve. Laugh. Delete.',
    category: 'retribution',
    instructions: 'Write the pettiest, most savage response to their last message. Make it ridiculous. Laugh at it. Delete it.',
    expectedOutcome: 'Cathartic humor and emotional release',
    intensity: 3
  },
  {
    key: 'block_party',
    title: 'The Block Party',
    description: 'Pick one app/platform. Block someone that drains you. Instant power.',
    category: 'retribution',
    instructions: 'Choose one social media platform. Block someone who drains your energy (doesn\'t have to be your ex). Feel the power.',
    expectedOutcome: 'Boundary setting and empowerment',
    intensity: 2
  },
  {
    key: 'revenge_fantasy_vault',
    title: 'The Revenge Fantasy Vault',
    description: 'Write your ultimate revenge story. File it under "For Later."',
    category: 'retribution',
    instructions: 'Write an elaborate, movie-worthy revenge fantasy. Make it cinematic. Save it. Never act on it, but enjoy it.',
    expectedOutcome: 'Safe fantasy outlet and humor',
    intensity: 4
  },
  {
    key: 'post_power_pic',
    title: 'Post Your Power Pic',
    description: 'Take a photo today that screams "I\'m unbothered."',
    category: 'retribution',
    instructions: 'Take a confident selfie or photo that shows your best life. Post it or just save it for your own empowerment.',
    expectedOutcome: 'Confidence boost and self-love',
    intensity: 1
  },
  {
    key: 'reclaim_the_place',
    title: 'Reclaim the Place',
    description: 'Go somewhere you went together. Do it alone. Leave a new memory.',
    category: 'retribution',
    instructions: 'Visit a place you shared together. Go alone or with a friend. Create a new, better memory there.',
    expectedOutcome: 'Space reclamation and new associations',
    intensity: 3
  },

  // 🌿 GLOW-UP RITUALS
  {
    key: 'glow_up_checklist',
    title: 'Glow-Up Checklist',
    description: '3 small things today that improve your space, face, or energy.',
    category: 'glow_up',
    instructions: 'Do 3 small improvements: tidy one area, try a new skincare step, and do something that boosts your energy.',
    expectedOutcome: 'Self-care and environmental improvement',
    intensity: 1
  },
  {
    key: 'compliment_hijack',
    title: 'Compliment Hijack',
    description: 'Give a compliment to someone else that you need to hear.',
    category: 'glow_up',
    instructions: 'Think of a compliment you need to hear. Give that exact compliment to someone else today. Notice how it feels.',
    expectedOutcome: 'Connection and indirect self-affirmation',
    intensity: 1
  },
  {
    key: 'joy_repetition_drill',
    title: 'Joy Repetition Drill',
    description: 'Repeat a tiny moment of joy today. Twice.',
    category: 'glow_up',
    instructions: 'Notice one small moment that brings you joy. Intentionally repeat it twice today. Savor it each time.',
    expectedOutcome: 'Joy amplification and mindfulness',
    intensity: 1
  },
  {
    key: 'curiosity_quest',
    title: 'Curiosity Quest',
    description: 'Try one thing you\'ve never done, even if you hate it.',
    category: 'glow_up',
    instructions: 'Do something completely new today, even if it\'s small. Try a new food, take a different route, learn a random fact.',
    expectedOutcome: 'Growth mindset and novelty',
    intensity: 2
  },
  {
    key: 'reconnect_platonic_love',
    title: 'Reconnect With Non-Romantic Love',
    description: 'Text someone who loves you platonically.',
    category: 'glow_up',
    instructions: 'Reach out to a friend or family member who loves you unconditionally. Send them a genuine, loving message.',
    expectedOutcome: 'Connection reminder and support activation',
    intensity: 1
  },

  // 🌀 WILD CARD RITUALS
  {
    key: 'emotion_meme_generator',
    title: 'Emotion Meme Generator',
    description: 'Describe your mood as a meme. Bonus: make it real and share it.',
    category: 'wild_card',
    instructions: 'Create a meme that perfectly captures your current emotional state. Use a meme generator or just describe it.',
    expectedOutcome: 'Humor and creative expression',
    intensity: 2
  },
  {
    key: 'burn_love_song',
    title: 'Burn a Love Song',
    description: 'Play a love song. Rewrite the lyrics. Make it about yourself.',
    category: 'wild_card',
    instructions: 'Pick a love song that hits different now. Rewrite the lyrics to be about loving yourself or your freedom.',
    expectedOutcome: 'Creative expression and self-love',
    intensity: 3
  },
  {
    key: 'plot_twist_prompt',
    title: 'Plot Twist Prompt',
    description: 'The breakup wasn\'t the ending. It was the ____. Fill in 3 answers.',
    category: 'wild_card',
    instructions: 'Complete this sentence 3 different ways: "The breakup wasn\'t the ending. It was the ____." Be creative.',
    expectedOutcome: 'Reframing and narrative control',
    intensity: 2
  },
  {
    key: 'oracle_ritual',
    title: 'Oracle Ritual',
    description: 'Pull a random word from a book. Use it as your emotional theme for the day.',
    category: 'wild_card',
    instructions: 'Open a book to a random page. Point to a word with eyes closed. Let that word guide your emotional focus today.',
    expectedOutcome: 'Mindfulness and intentional focus',
    intensity: 1
  },
  {
    key: 'emoji_forecast',
    title: 'Emoji Forecast',
    description: 'Pick 3 emojis to describe today\'s emotional weather. Predict tomorrow\'s.',
    category: 'wild_card',
    instructions: 'Choose 3 emojis for today\'s emotional state. Then predict tomorrow\'s emotional weather with 3 different emojis.',
    expectedOutcome: 'Emotional awareness and optimism',
    intensity: 1
  }
];

export function getRandomRitual(excludeKeys: string[] = []): PrescribedRitual {
  const availableRituals = PRESCRIBED_RITUALS.filter(ritual => !excludeKeys.includes(ritual.key));
  const randomIndex = Math.floor(Math.random() * availableRituals.length);
  return availableRituals[randomIndex];
}

export function getRitualByKey(key: string): PrescribedRitual | undefined {
  return PRESCRIBED_RITUALS.find(ritual => ritual.key === key);
}

export function getCategoryColor(category: PrescribedRitual['category']): string {
  const colors = {
    release: 'text-red-400 border-red-500/30',
    reflection: 'text-blue-400 border-blue-500/30',
    reprogramming: 'text-green-400 border-green-500/30',
    retribution: 'text-orange-400 border-orange-500/30',
    glow_up: 'text-pink-400 border-pink-500/30',
    wild_card: 'text-purple-400 border-purple-500/30'
  };
  return colors[category];
}

export function getCategoryIcon(category: PrescribedRitual['category']): string {
  const icons = {
    release: '🔁',
    reflection: '🧠',
    reprogramming: '🔒',
    retribution: '🩸',
    glow_up: '🌿',
    wild_card: '🌀'
  };
  return icons[category];
}
