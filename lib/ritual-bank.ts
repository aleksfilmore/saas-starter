// Daily Ritual Bank - Premium AI-Generated vs Free Simple Rituals
export type RitualCategory = 
  | "grief-cycle" 
  | "petty-purge" 
  | "glow-up-forge" 
  | "level-up-labs" 
  | "ego-armor" 
  | "fuck-around-therapy" 
  | "mindful-mayhem" 
  | "revenge-body"

export interface Ritual {
  id: string
  title: string
  description: string
  duration: string
  category: RitualCategory
  difficulty: "easy" | "medium" | "hard"
  isPremium?: boolean
}

// Free User Ritual Bank (60-90 simple rituals)
export const FREE_RITUALS: Ritual[] = [
  // Grief Cycle (10 rituals)
  {
    id: "grief-001",
    title: "Ugly Cry Permission Slip",
    description: "Set a 15-minute timer. Cry about whatever needs crying about—breakup, bad day, burnt toast. No judgment, just release.",
    duration: "15 min",
    category: "grief-cycle",
    difficulty: "easy"
  },
  {
    id: "grief-002", 
    title: "Letter to Past Self",
    description: "Write a letter to yourself from 6 months ago. Tell them what you wish you'd known then. Burn it or keep it—your choice.",
    duration: "20 min",
    category: "grief-cycle", 
    difficulty: "easy"
  },
  {
    id: "grief-003",
    title: "Memory Box Exile",
    description: "Collect 3 physical reminders of what you're grieving. Put them in a box. Decide: storage or trash. Both are valid.",
    duration: "25 min",
    category: "grief-cycle",
    difficulty: "medium"
  },
  {
    id: "grief-004",
    title: "Scream Into Pillow Protocol",
    description: "Grab a pillow. Scream everything you can't say out loud. Punch it if needed. Pillow therapy is real therapy.",
    duration: "10 min",
    category: "grief-cycle",
    difficulty: "easy"
  },
  {
    id: "grief-005",
    title: "Sad Song Catharsis",
    description: "Play the saddest song you know. Feel every note. When it ends, play something that makes you feel powerful.",
    duration: "8 min",
    category: "grief-cycle", 
    difficulty: "easy"
  },
  {
    id: "grief-006",
    title: "Rain Rage Walk",
    description: "If it's raining, walk in it. If not, take a cold shower. Let water wash away what words can't fix.",
    duration: "15 min",
    category: "grief-cycle",
    difficulty: "medium"
  },
  {
    id: "grief-007",
    title: "Voice Note Purge",
    description: "Record a voice note saying everything you need to say. Play it back once. Delete it. Your truth was heard.",
    duration: "10 min", 
    category: "grief-cycle",
    difficulty: "easy"
  },
  {
    id: "grief-008",
    title: "Empty Chair Conversation",
    description: "Set up a chair. Imagine who/what you're grieving is sitting there. Say your piece. They can't interrupt now.",
    duration: "20 min",
    category: "grief-cycle",
    difficulty: "medium"
  },
  {
    id: "grief-009",
    title: "Grief Playlist Construction",
    description: "Make a playlist with 7 songs that capture your loss. Play it once. Save it as \"Survived This.\"",
    duration: "30 min",
    category: "grief-cycle",
    difficulty: "easy"
  },
  {
    id: "grief-010",
    title: "Candle Ritual Release",
    description: "Light a candle. Watch the flame for 5 minutes while thinking of what you're letting go. Blow it out when ready.",
    duration: "10 min",
    category: "grief-cycle",
    difficulty: "easy"
  },

  // Petty Purge (10 rituals)
  {
    id: "petty-001",
    title: "Social Media Archaeological Dig",
    description: "Go through old photos on your phone. Delete 10 that make you cringe. Keep 1 that makes you smile.",
    duration: "15 min",
    category: "petty-purge",
    difficulty: "easy"
  },
  {
    id: "petty-002",
    title: "Contacts Cleanse Ceremony",
    description: "Review your contacts. Delete 5 people you wouldn't call in an emergency. Your phone will thank you.",
    duration: "10 min",
    category: "petty-purge",
    difficulty: "easy"
  },
  {
    id: "petty-003",
    title: "Ex-Stuff Garage Sale Simulation",
    description: "Gather items that remind you of exes/past drama. Price them like you're having a garage sale. Donate or trash.",
    duration: "30 min",
    category: "petty-purge",
    difficulty: "medium"
  },
  {
    id: "petty-004",
    title: "Unfollow Spree of Freedom",
    description: "Unfollow 10 accounts that make you feel bad about your life. Follow 3 that make you laugh instead.",
    duration: "10 min",
    category: "petty-purge",
    difficulty: "easy"
  },
  {
    id: "petty-005",
    title: "Passive-Aggressive Text Delete",
    description: "Find the most passive-aggressive text in your drafts. Read it. Laugh at it. Delete it. Growth.",
    duration: "5 min",
    category: "petty-purge",
    difficulty: "easy"
  },
  {
    id: "petty-006",
    title: "Outfit That Made You Feel Bad Eviction",
    description: "Find one piece of clothing you wore during a bad time. Try it on. If it still feels bad, evict it.",
    duration: "15 min",
    category: "petty-purge",
    difficulty: "medium"
  },
  {
    id: "petty-007",
    title: "Screenshot Evidence Disposal",
    description: "Delete 5 screenshots of drama you saved for \"evidence.\" The case is closed. You won by moving on.",
    duration: "10 min",
    category: "petty-purge",
    difficulty: "easy"
  },
  {
    id: "petty-008",
    title: "Playlist Purge & Rebuild",
    description: "Delete one sad playlist. Create a new one called \"Petty & Proud\" with songs that make you feel superior.",
    duration: "20 min",
    category: "petty-purge",
    difficulty: "easy"
  },
  {
    id: "petty-009",
    title: "Mirror Affirmation Hit List",
    description: "Look in the mirror. List 3 things about yourself that your haters wish they had. Say them out loud.",
    duration: "5 min",
    category: "petty-purge",
    difficulty: "easy"
  },
  {
    id: "petty-010",
    title: "Energy Vampire Contact Block",
    description: "Block one person who always drains your energy when they text. Protect your peace like a bouncer.",
    duration: "2 min",
    category: "petty-purge",
    difficulty: "easy"
  },

  // Glow-Up Forge (10 rituals)
  {
    id: "glow-001",
    title: "Face Mask Power Hour",
    description: "Put on a face mask. While it sets, write down 3 ways you've improved since your lowest point. Glow inside and out.",
    duration: "30 min",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-002",
    title: "Closet Main Character Moment",
    description: "Try on 3 outfits that make you feel like the main character. Take photos. Save them for confidence emergencies.",
    duration: "20 min",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-003",
    title: "Hot Girl Walk (Any Gender)",
    description: "Walk for 15 minutes like you're on a runway. Play music that makes you feel unstoppable. Own every step.",
    duration: "15 min",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-004",
    title: "Skill Stack Session",
    description: "Spend 20 minutes learning something new—YouTube tutorial, duolingo, anything that levels you up.",
    duration: "20 min",
    category: "glow-up-forge",
    difficulty: "medium"
  },
  {
    id: "glow-005",
    title: "Compliment Collection Mission",
    description: "Write down every compliment you've received this month. Read them. Screenshot them. You are that person.",
    duration: "10 min",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-006",
    title: "Future Self Vision Board Micro",
    description: "Find 5 images that represent who you're becoming. Save them to a phone album called \"Leveling Up.\"",
    duration: "15 min",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-007",
    title: "Posture Power Reset",
    description: "Set 5 random alarms today. When they go off, check your posture. Adjust. Stand like you own the room.",
    duration: "All day",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-008",
    title: "Water Royalty Challenge",
    description: "Drink water like you're a royal staying hydrated for your coronation. Track 8 glasses. Crown yourself when complete.",
    duration: "All day",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-009",
    title: "Bedroom Sanctuary Upgrade",
    description: "Make your bed like a 5-star hotel. Light a candle. Arrange pillows. Your space reflects your energy.",
    duration: "15 min",
    category: "glow-up-forge",
    difficulty: "easy"
  },
  {
    id: "glow-010",
    title: "Mirror Pep Talk Practice",
    description: "Give yourself a 2-minute pep talk in the mirror. Use your name. Be specific about why you're amazing.",
    duration: "5 min",
    category: "glow-up-forge",
    difficulty: "easy"
  },

  // Level-Up Labs (10 rituals) 
  {
    id: "level-001",
    title: "15-Minute Skill Sprint",
    description: "Pick one skill you want to improve. Practice it for 15 focused minutes. No phone, no distractions. Pure growth.",
    duration: "15 min",
    category: "level-up-labs",
    difficulty: "medium"
  },
  {
    id: "level-002",
    title: "Goal Archaeology Dig",
    description: "Find an old goal you abandoned. Spend 10 minutes figuring out why. Decide: resurrect, revise, or bury with honor.",
    duration: "10 min",
    category: "level-up-labs",
    difficulty: "easy"
  },
  {
    id: "level-003",
    title: "Network Expansion Mission",
    description: "Message one person you admire but never talk to. Comment on their post. Plant seeds for future connections.",
    duration: "5 min",
    category: "level-up-labs",
    difficulty: "medium"
  },
  {
    id: "level-004",
    title: "Money Date With Reality",
    description: "Check your bank account. No judgment, just awareness. Set one small financial goal for this week.",
    duration: "10 min",
    category: "level-up-labs",
    difficulty: "medium"
  },
  {
    id: "level-005",
    title: "Calendar Audit & Optimization",
    description: "Review this week's calendar. Find 1 hour being wasted. Replace it with something that serves your growth.",
    duration: "15 min",
    category: "level-up-labs",
    difficulty: "medium"
  },
  {
    id: "level-006",
    title: "Skill Portfolio Update",
    description: "List 10 skills you have. Rate each 1-10. Pick the one you want to improve and research how.",
    duration: "20 min",
    category: "level-up-labs",
    difficulty: "easy"
  },
  {
    id: "level-007",
    title: "Fear Inventory & Action Plan",
    description: "Write down one fear holding you back. Break it into smaller, less scary pieces. Pick the tiniest piece to tackle.",
    duration: "15 min",
    category: "level-up-labs",
    difficulty: "medium"
  },
  {
    id: "level-008",
    title: "Habit Stack Engineering",
    description: "Pick a habit you want to build. Attach it to something you already do daily. Engineer automatic improvement.",
    duration: "10 min",
    category: "level-up-labs",
    difficulty: "medium"
  },
  {
    id: "level-009",
    title: "Knowledge Gap Hunt",
    description: "Identify one thing everyone seems to know that you don't. Spend 20 minutes learning the basics. Close the gap.",
    duration: "20 min",
    category: "level-up-labs",
    difficulty: "medium"
  },
  {
    id: "level-010",
    title: "Future Self Job Interview",
    description: "Write 5 questions your future successful self would ask current you. Answer them honestly. Take notes for improvement.",
    duration: "15 min",
    category: "level-up-labs",
    difficulty: "medium"
  },

  // Ego Armor (8 rituals)
  {
    id: "ego-001",
    title: "Achievements Victory Lap",
    description: "List 5 things you've accomplished this year, no matter how small. Read them aloud. Take a victory lap around your room.",
    duration: "10 min",
    category: "ego-armor",
    difficulty: "easy"
  },
  {
    id: "ego-002",
    title: "Hater Proof Vest Construction",
    description: "Write down the meanest thing someone said about you. Next to it, write why they were wrong. Armor equipped.",
    duration: "10 min",
    category: "ego-armor",
    difficulty: "easy"
  },
  {
    id: "ego-003",
    title: "Confidence Historical Archive",
    description: "Remember a time you felt unstoppable. Write down every detail. Save it as your confidence emergency contact.",
    duration: "15 min",
    category: "ego-armor",
    difficulty: "easy"
  },
  {
    id: "ego-004",
    title: "Main Character Monologue",
    description: "Write a 2-minute monologue about why you're the main character of your story. Practice it. Own your narrative.",
    duration: "15 min",
    category: "ego-armor",
    difficulty: "medium"
  },
  {
    id: "ego-005",
    title: "Upgrade Documentation Project",
    description: "Compare current you to you from 1 year ago. Document 3 major upgrades. Evidence-based confidence building.",
    duration: "20 min",
    category: "ego-armor",
    difficulty: "easy"
  },
  {
    id: "ego-006",
    title: "Power Stance Training Session",
    description: "Practice 3 different power poses for 2 minutes each. Find your signature stance. Deploy in real life.",
    duration: "10 min",
    category: "ego-armor",
    difficulty: "easy"
  },
  {
    id: "ego-007",
    title: "Rejection Collection Celebration",
    description: "List 3 rejections that led to better opportunities. Thank the universe for its excellent filtering system.",
    duration: "10 min",
    category: "ego-armor",
    difficulty: "easy"
  },
  {
    id: "ego-008",
    title: "Energy Match Frequency Check",
    description: "Rate your energy 1-10. If below 7, do 10 jumping jacks and play your hype song. Match your highest frequency.",
    duration: "5 min",
    category: "ego-armor",
    difficulty: "easy"
  },

  // Fuck-Around Therapy (8 rituals)
  {
    id: "therapy-001",
    title: "Chaos Theory Dance Break",
    description: "Put on the weirdest song you have. Dance like nobody's watching because nobody is. Embrace the chaos.",
    duration: "5 min",
    category: "fuck-around-therapy",
    difficulty: "easy"
  },
  {
    id: "therapy-002",
    title: "Random Acts of Self Love",
    description: "Do something ridiculous nice for yourself. Buy yourself flowers, write yourself a love note, take a selfie.",
    duration: "15 min",
    category: "fuck-around-therapy",
    difficulty: "easy"
  },
  {
    id: "therapy-003",
    title: "Weird Hobby 15-Minute Trial",
    description: "Try something completely random for 15 minutes. Origami, beatboxing, whatever. Life's too short for boring.",
    duration: "15 min",
    category: "fuck-around-therapy",
    difficulty: "medium"
  },
  {
    id: "therapy-004",
    title: "Backwards Day Experiment",
    description: "Do 3 routine things backwards. Brush teeth with opposite hand, walk backwards, wear clothes inside-out. Question reality.",
    duration: "20 min",
    category: "fuck-around-therapy",
    difficulty: "easy"
  },
  {
    id: "therapy-005",
    title: "Voice Message to Past Self",
    description: "Record a voice message to yourself from 5 years ago. Tell them something that would blow their mind.",
    duration: "5 min",
    category: "fuck-around-therapy",
    difficulty: "easy"
  },
  {
    id: "therapy-006",
    title: "Adult Blanket Fort Engineering",
    description: "Build a blanket fort. Sit in it for 10 minutes. Remember when the world was magical. It still is.",
    duration: "20 min",
    category: "fuck-around-therapy",
    difficulty: "easy"
  },
  {
    id: "therapy-007",
    title: "Personality Swap Experiment",
    description: "Spend 15 minutes acting like your opposite personality. Introvert? Be loud. Planner? Be spontaneous. Experiment.",
    duration: "15 min",
    category: "fuck-around-therapy",
    difficulty: "medium"
  },
  {
    id: "therapy-008",
    title: "Ridiculous Talent Development",
    description: "Pick the most useless talent you can think of. Practice it for 10 minutes. Master something completely pointless.",
    duration: "10 min",
    category: "fuck-around-therapy",
    difficulty: "easy"
  },

  // Mindful Mayhem (7 rituals)
  {
    id: "mindful-001",
    title: "Aggressive Gratitude Session",
    description: "List 10 things you're grateful for, but write them like you're mad about how good they are. \"I'm SO grateful for...\"",
    duration: "10 min",
    category: "mindful-mayhem",
    difficulty: "easy"
  },
  {
    id: "mindful-002",
    title: "Chaos Meditation Circle",
    description: "Sit quietly for 5 minutes while intentionally thinking the most random thoughts possible. Then sit in the silence after.",
    duration: "10 min",
    category: "mindful-mayhem",
    difficulty: "medium"
  },
  {
    id: "mindful-003",
    title: "Breath Work Rage Edition",
    description: "Do 4-7-8 breathing (inhale 4, hold 7, exhale 8) but imagine you're breathing out frustration and breathing in power.",
    duration: "10 min",
    category: "mindful-mayhem",
    difficulty: "easy"
  },
  {
    id: "mindful-004",
    title: "Present Moment Punk Rock",
    description: "Notice 5 things you can see, 4 you can hear, 3 you can feel, 2 you can smell, 1 you can taste. But do it aggressively.",
    duration: "5 min",
    category: "mindful-mayhem",
    difficulty: "easy"
  },
  {
    id: "mindful-005",
    title: "Walking Meditation Rebellion",
    description: "Walk mindfully for 10 minutes, but every few steps, do something slightly rebellious. Skip, spin, moonwalk.",
    duration: "10 min",
    category: "mindful-mayhem",
    difficulty: "easy"
  },
  {
    id: "mindful-006",
    title: "Mindful Multitasking Paradox",
    description: "Try to mindfully do 3 things at once. Notice how impossible it is. Laugh. Do one thing mindfully instead.",
    duration: "15 min",
    category: "mindful-mayhem",
    difficulty: "medium"
  },
  {
    id: "mindful-007",
    title: "Emotional Weather Report",
    description: "Check in with your emotions like a weather reporter. \"Today's forecast: 70% sarcastic with a chance of productivity.\"",
    duration: "5 min",
    category: "mindful-mayhem",
    difficulty: "easy"
  },

  // Revenge Body (7 rituals)
  {
    id: "revenge-001",
    title: "Villain Era Workout Session",
    description: "Do 15 minutes of any exercise while imagining you're training for your villain era. Channel that energy productively.",
    duration: "15 min",
    category: "revenge-body",
    difficulty: "medium"
  },
  {
    id: "revenge-002",
    title: "Posture of Power Training",
    description: "Spend 10 minutes practicing perfect posture. Stand against a wall, shoulders back. Train your body to take up space.",
    duration: "10 min",
    category: "revenge-body",
    difficulty: "easy"
  },
  {
    id: "revenge-003",
    title: "Mirror Affirmation Flex",
    description: "Look in the mirror and flex. Tell your reflection 3 things your body has done for you lately. Appreciation gains.",
    duration: "5 min",
    category: "revenge-body",
    difficulty: "easy"
  },
  {
    id: "revenge-004",
    title: "Hydration Domination Protocol",
    description: "Drink a full glass of water while maintaining eye contact with yourself in a mirror. Hydration intimidation tactics.",
    duration: "2 min",
    category: "revenge-body",
    difficulty: "easy"
  },
  {
    id: "revenge-005",
    title: "Dance Like They're Watching",
    description: "Dance for 10 minutes like your ex is watching and crying. Make every move a statement. You're thriving.",
    duration: "10 min",
    category: "revenge-body",
    difficulty: "easy"
  },
  {
    id: "revenge-006",
    title: "Skincare Ritual of Superiority",
    description: "Do your skincare routine while repeating \"I'm getting hotter while they get bitter.\" Glow-up mindset activation.",
    duration: "15 min",
    category: "revenge-body",
    difficulty: "easy"
  },
  {
    id: "revenge-007",
    title: "Power Nap Recharge Station",
    description: "Take a 20-minute power nap. Set intention before sleeping: \"I wake up more powerful.\" Rest is revenge against burnout.",
    duration: "20 min",
    category: "revenge-body",
    difficulty: "easy"
  }
]

// Premium User Ritual Bank (30+ advanced AI-style rituals)
export const PREMIUM_RITUALS: Ritual[] = [
  // Premium Grief Cycle (5 rituals)
  {
    id: "premium-grief-001",
    title: "Deep Shadow Work Integration",
    description: "An advanced 45-minute process to explore the hidden aspects of your grief. Includes guided meditation, journaling prompts, and energy release techniques designed to transform pain into wisdom.",
    duration: "45 min",
    category: "grief-cycle",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-grief-002",
    title: "Ancestral Healing Ritual",
    description: "Connect with your lineage to understand inherited patterns of love and loss. This ritual combines visualization, breathwork, and symbolic actions to heal generational wounds.",
    duration: "35 min",
    category: "grief-cycle",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-grief-003",
    title: "Somatic Grief Release",
    description: "Use body-based techniques to release trapped grief energy. Combines gentle movement, breathing, and tension release to help your nervous system process loss.",
    duration: "30 min",
    category: "grief-cycle",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-grief-004",
    title: "Future Self Dialogue",
    description: "A powerful visualization technique where you connect with your healed future self. Receive wisdom, comfort, and guidance from the version of you who has moved through this pain.",
    duration: "25 min",
    category: "grief-cycle",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-grief-005",
    title: "Grief Alchemy Transformation",
    description: "Transform your pain into creative power through this advanced ritual combining art therapy, energy work, and intention setting to alchemize suffering into strength.",
    duration: "40 min",
    category: "grief-cycle",
    difficulty: "hard",
    isPremium: true
  },

  // Premium Petty Purge (5 rituals)
  {
    id: "premium-petty-001",
    title: "Digital Detox Ceremony",
    description: "A comprehensive digital cleansing ritual that goes beyond unfollowing. Clear your energetic attachment to past connections through mindful technology use and boundary setting.",
    duration: "50 min",
    category: "petty-purge",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-petty-002",
    title: "Energetic Cord Cutting Ritual",
    description: "Use advanced visualization and energetic techniques to cut psychic cords with people who no longer serve your highest good. Includes protection and blessing practices.",
    duration: "30 min",
    category: "petty-purge",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-petty-003",
    title: "Resentment Release Matrix",
    description: "A systematic approach to identifying and releasing all forms of resentment. Combines cognitive restructuring with emotional release techniques for complete liberation.",
    duration: "35 min",
    category: "petty-purge",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-petty-004",
    title: "Forgiveness Frequency Attunement",
    description: "Tune into the vibrational frequency of forgiveness through sound healing, breathwork, and heart-centered meditation. Release grudges at the cellular level.",
    duration: "25 min",
    category: "petty-purge",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-petty-005",
    title: "Toxic Pattern Interrupt Protocol",
    description: "Identify and interrupt unconscious patterns that keep you connected to toxic dynamics. Includes NLP techniques and somatic awareness practices.",
    duration: "40 min",
    category: "petty-purge",
    difficulty: "hard",
    isPremium: true
  },

  // Premium Glow-Up Forge (5 rituals)
  {
    id: "premium-glow-001",
    title: "Magnetic Presence Activation",
    description: "Develop an irresistible personal magnetism through confidence-building exercises, posture work, voice training, and energetic alignment practices.",
    duration: "45 min",
    category: "glow-up-forge",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-glow-002",
    title: "Beauty Frequency Embodiment",
    description: "Align with your natural beauty frequency through mirror work, self-love practices, and energetic beauty enhancement techniques that work from the inside out.",
    duration: "30 min",
    category: "glow-up-forge",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-glow-003",
    title: "Confidence DNA Reconstruction",
    description: "Rebuild your confidence blueprint through deep subconscious reprogramming, power pose sequences, and victory state anchoring techniques.",
    duration: "35 min",
    category: "glow-up-forge",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-glow-004",
    title: "Charisma Cultivation Laboratory",
    description: "Develop magnetic charisma through communication skills practice, presence exercises, and social confidence building in a structured environment.",
    duration: "40 min",
    category: "glow-up-forge",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-glow-005",
    title: "Radiance Ritual Mastery",
    description: "Master the art of inner radiance through energy cultivation, emotional regulation, and authentic self-expression practices that make you shine from within.",
    duration: "50 min",
    category: "glow-up-forge",
    difficulty: "hard",
    isPremium: true
  },

  // Premium Level-Up Labs (5 rituals)
  {
    id: "premium-level-001",
    title: "Quantum Goal Achievement System",
    description: "Harness quantum principles for manifestation. Includes visualization techniques, frequency alignment, and reality-shifting practices for accelerated goal achievement.",
    duration: "45 min",
    category: "level-up-labs",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-level-002",
    title: "Neural Pathway Optimization",
    description: "Rewire your brain for success through neuroplasticity exercises, cognitive enhancement techniques, and learning acceleration methods.",
    duration: "35 min",
    category: "level-up-labs",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-level-003",
    title: "High-Performance Mindset Installation",
    description: "Install the mindset of elite performers through mental conditioning, peak state training, and excellence habit formation techniques.",
    duration: "40 min",
    category: "level-up-labs",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-level-004",
    title: "Abundance Frequency Calibration",
    description: "Calibrate your internal frequency to match abundance and success through energy work, belief restructuring, and prosperity consciousness activation.",
    duration: "30 min",
    category: "level-up-labs",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-level-005",
    title: "Limitless Potential Activation",
    description: "Break through perceived limitations and access your full potential through advanced consciousness techniques and reality expansion practices.",
    duration: "50 min",
    category: "level-up-labs",
    difficulty: "hard",
    isPremium: true
  },

  // Premium Ego Armor (3 rituals)
  {
    id: "premium-ego-001",
    title: "Unshakeable Self-Worth Foundation",
    description: "Build an unshakeable foundation of self-worth through deep inner work, childhood healing, and self-value anchoring techniques.",
    duration: "45 min",
    category: "ego-armor",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-ego-002",
    title: "Criticism Immunity Shield",
    description: "Develop immunity to criticism and negative opinions through resilience training, boundary work, and inner critic transformation.",
    duration: "35 min",
    category: "ego-armor",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-ego-003",
    title: "Authentic Power Reclamation",
    description: "Reclaim your authentic power through shadow integration, false self-dissolution, and true self-empowerment practices.",
    duration: "40 min",
    category: "ego-armor",
    difficulty: "hard",
    isPremium: true
  },

  // Premium Fuck-Around Therapy (3 rituals)
  {
    id: "premium-therapy-001",
    title: "Sacred Rebellion Ritual",
    description: "Channel rebellious energy into sacred activism and authentic self-expression through creative destruction and reconstruction practices.",
    duration: "35 min",
    category: "fuck-around-therapy",
    difficulty: "medium",
    isPremium: true
  },
  {
    id: "premium-therapy-002",
    title: "Chaos Magic for Healing",
    description: "Use chaos magic principles to break through stagnation and create breakthrough healing through unconventional magical practices.",
    duration: "40 min",
    category: "fuck-around-therapy",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-therapy-003",
    title: "Wild Self Liberation",
    description: "Liberate your wild, untamed self through primal expression, instinctual reconnection, and societal conditioning release.",
    duration: "45 min",
    category: "fuck-around-therapy",
    difficulty: "hard",
    isPremium: true
  },

  // Premium Mindful Mayhem (2 rituals)
  {
    id: "premium-mindful-001",
    title: "Transcendent Chaos Meditation",
    description: "Achieve transcendent states through controlled chaos meditation, paradox integration, and consciousness expansion techniques.",
    duration: "30 min",
    category: "mindful-mayhem",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-mindful-002",
    title: "Divine Madness Integration",
    description: "Integrate the wisdom of divine madness through shamanic practices, ecstatic techniques, and sacred disruption methods.",
    duration: "50 min",
    category: "mindful-mayhem",
    difficulty: "hard",
    isPremium: true
  },

  // Premium Revenge Body (2 rituals)
  {
    id: "premium-revenge-001",
    title: "Phoenix Body Transformation",
    description: "Transform your body into a phoenix through advanced fitness psychology, body image healing, and physical empowerment practices.",
    duration: "60 min",
    category: "revenge-body",
    difficulty: "hard",
    isPremium: true
  },
  {
    id: "premium-revenge-002",
    title: "Goddess/God Body Activation",
    description: "Activate your divine body template through sacred sexuality practices, body worship rituals, and physical sovereignty reclamation.",
    duration: "45 min",
    category: "revenge-body",
    difficulty: "hard",
    isPremium: true
  }
]

// Combined ritual arrays
export const ALL_RITUALS = [...FREE_RITUALS, ...PREMIUM_RITUALS]

// Ritual management functions
export function getRandomRituals(category?: RitualCategory, count: number = 2): Ritual[] {
  const rituals = category 
    ? FREE_RITUALS.filter(r => r.category === category)
    : FREE_RITUALS
  
  // Shuffle and take the requested count
  const shuffled = rituals.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getRitualsByCategory(category: RitualCategory): Ritual[] {
  return FREE_RITUALS.filter(r => r.category === category)
}

export function getRitualById(id: string): Ritual | undefined {
  return FREE_RITUALS.find(r => r.id === id)
}

export function getTodaysRituals(): Ritual[] {
  // Use date as seed for consistent daily rituals
  const today = new Date().toDateString()
  const hash = today.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  // Use hash to pick 2 consistent rituals for the day
  const index1 = Math.abs(hash) % FREE_RITUALS.length
  const index2 = Math.abs(hash * 2) % FREE_RITUALS.length
  
  return [FREE_RITUALS[index1], FREE_RITUALS[index2]]
}

// For premium users - placeholder for AI-generated rituals
export function generatePersonalizedRitual(
  userGoals: string[], 
  recentEmotions: string[], 
  category: RitualCategory
): Ritual {
  // This would connect to AI service in real implementation
  return {
    id: `ai-${Date.now()}`,
    title: "AI-Generated Personal Ritual",
    description: "This would be a personalized ritual generated based on your goals, emotions, and preferences.",
    duration: "15-30 min",
    category,
    difficulty: "medium",
    isPremium: true
  }
}
