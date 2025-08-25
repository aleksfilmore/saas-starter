/**
 * Daily Rituals Database for Paid Users (Firewall Mode)
 * 1 rituals/day, guided progression through categories
 * Reset every 90 days, no duplicates for 30 days
 */

export interface PaidRitual {
  id: string;
  category: string;
  title: string;
  description: string;
  journalPrompt: string;
  lesson: string;
  /** @deprecated remove after frontend no longer references XP */
  xpReward?: never; // enforce no new xp usage
  bytesReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  journalSteps?: string[]; // multi-step guided journaling
  reflectionQuestions?: string[]; // optional deeper prompts
  complexityScore?: number; // 1-5 synthesized difficulty/effort rating
}

export const PAID_RITUAL_CATEGORIES = {
  'grief-cycle': {
    name: 'The Grief Cycle',
    icon: '💔',
    color: 'text-blue-400',
    bgColor: 'bg-blue-600/20',
    borderColor: 'border-blue-500/30',
    description: 'Processing loss and letting go',
  progressWeight: 1, // Early journey
  // baseXP: 10, // deprecated
    baseBytes: 5
  },
  'petty-purge': {
    name: 'The Petty Purge',
    icon: '🔥',
    color: 'text-red-400',
    bgColor: 'bg-red-600/20',
    borderColor: 'border-red-500/30',
    description: 'Strategic boundaries and digital detox',
  progressWeight: 1,
  // baseXP: 10,
    baseBytes: 5
  },
  'glow-up-forge': {
    name: 'The Glow-Up Forge',
    icon: '✨',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-600/20',
    borderColor: 'border-yellow-500/30',
    description: 'Self-reinvention and confidence building',
  progressWeight: 2,
  // baseXP: 12,
    baseBytes: 5
  },
  'reframe-loop': {
    name: 'The Reframe Loop',
    icon: '🔄',
    color: 'text-purple-400',
    bgColor: 'bg-purple-600/20',
    borderColor: 'border-purple-500/30',
    description: 'Mind rewiring and perspective shifts',
  progressWeight: 2,
  // baseXP: 12,
    baseBytes: 5
  },
  'ghost-cleanse': {
    name: 'The Ghost Cleanse',
    icon: '👻',
    color: 'text-gray-400',
    bgColor: 'bg-gray-600/20',
    borderColor: 'border-gray-500/30',
    description: 'Boundary maintenance and emotional firewalling',
  progressWeight: 3,
  // baseXP: 14,
    baseBytes: 7
  },
  'public-face': {
    name: 'The Public Face',
    icon: '🎭',
    color: 'text-green-400',
    bgColor: 'bg-green-600/20',
    borderColor: 'border-green-500/30',
    description: 'Confidence theatre and strategic social presence',
  progressWeight: 3,
  // baseXP: 14,
    baseBytes: 7
  },
  'soft-reset': {
    name: 'The Soft Reset',
    icon: '🌸',
    color: 'text-pink-400',
    bgColor: 'bg-pink-600/20',
    borderColor: 'border-pink-500/30',
    description: 'Gentle grounding and micro-rituals',
  progressWeight: 2,
  // baseXP: 12,
    baseBytes: 5
  },
  'cult-missions': {
    name: 'The Cult Missions',
    icon: '⚡',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-600/20',
    borderColor: 'border-indigo-500/30',
    description: 'Communal mischief and platform engagement',
  progressWeight: 4,
  // baseXP: 16,
    baseBytes: 8
  }
} as const;

export const PAID_RITUALS_DATABASE: PaidRitual[] = [
  // The Grief Cycle — 20 Rituals
  {
    id: 'grief-inbox-funeral',
    category: 'grief-cycle',
    title: 'Inbox Funeral',
    description: 'Open your old chats, scroll just far enough to feel it in your gut, and start deleting. Treat each "delete" like lowering the lid on a coffin.',
    journalPrompt: 'Which message was the hardest to erase, and why?',
    lesson: 'They\'re not coming back for their words — and you don\'t have to keep holding them for safekeeping.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    journalSteps: [
      'Scan message list without opening threads',
      'Delete or archive without rereading',
      'Pause: notice body reaction (name it)',
      'Write one sentence of release'
    ],
    reflectionQuestions: [ 'What did deleting physically feel like?', 'What narrative were you holding onto?' ],
    complexityScore: 2
  },
  {
    id: 'grief-candle-ghost',
    category: 'grief-cycle',
    title: 'Candle for the Ghost',
    description: 'Light a candle, say their name out loud, and let one thought about them rise with the flame. Blow it out deliberately.',
    journalPrompt: 'What did that moment feel like — relief, sadness, or both?',
    lesson: 'Closure is sometimes just a breath you control.',
    bytesReward: 5,
    difficulty: 'beginner',
  estimatedMinutes: 10,
  journalSteps: [ 'Prepare candle + quiet space', 'Speak name + surface thought', 'Observe feeling shift', 'Extinguish with intention' ],
  reflectionQuestions: [ 'What emotion surfaced most strongly?', 'Did releasing feel complete or partial?' ],
  complexityScore: 2
  },
  {
    id: 'grief-one-song-cry',
    category: 'grief-cycle',
    title: 'One-Song Cry',
    description: 'Pick the saddest track you own. Let it wreck you for exactly one playthrough, then stop.',
    journalPrompt: 'Which lyric hit hardest, and why?',
    lesson: 'Grief needs a container, or it will pour into everything.',
    bytesReward: 5,
    difficulty: 'beginner',
  estimatedMinutes: 5,
  journalSteps: [ 'Pick song', 'Allow full release (single play)', 'Hydrate + grounding breath', 'One-sentence summary' ],
  reflectionQuestions: [ 'What lyric carried the weight?', 'What shifted after the container ended?' ],
  complexityScore: 1
  },
  {
    id: 'grief-memory-box-exile',
    category: 'grief-cycle',
    title: 'Memory Box Exile',
    description: 'Gather all physical reminders, put them in a box, and hide it somewhere inconvenient to reach.',
    journalPrompt: 'Which object felt heaviest to pack away?',
    lesson: 'Out of sight is the first step to out of heart.',
    bytesReward: 5,
    difficulty: 'intermediate',
  estimatedMinutes: 20,
  journalSteps: [ 'Collect artifacts', 'Place in box without rereading', 'Hide box (inconvenient spot)', 'Note emotional residue' ],
  reflectionQuestions: [ 'Which item was hardest?', 'What did removing them free up?' ],
  complexityScore: 3
  },
  {
    id: 'grief-three-things-lost',
    category: 'grief-cycle',
    title: 'Three Things Lost',
    description: 'List three things you lost in the breakup, then one unexpected upside for each.',
    journalPrompt: 'Which upside surprised you most?',
    lesson: 'Not every loss is a tragedy — some are quiet wins.',
  bytesReward: 5,
  difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'grief-last-words-letter',
    category: 'grief-cycle',
    title: 'Last Words Letter',
    description: 'Write the words you never got to say — kind, cruel, or chaotic. Then hide or burn it.',
    journalPrompt: 'Did the act of writing change how you feel?',
    lesson: 'Closure isn\'t a reply, it\'s getting the weight out of your chest.',
  bytesReward: 5,
  difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'grief-echo-detox',
    category: 'grief-cycle',
    title: 'Echo Detox',
    description: 'Walk through your space and remove anything that still carries their smell, sound, or image.',
    journalPrompt: 'Which "echo" lingered the longest?',
    lesson: 'Your home should be haunted only by things you love.',
  bytesReward: 5,
  difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'grief-walk',
    category: 'grief-cycle',
    title: 'Grief Walk',
    description: 'Take a phone-free walk, letting memories come as they wish. Name each one aloud, then keep walking.',
    journalPrompt: 'Which memory stayed with you after?',
    lesson: 'Naming things makes them less scary — even ghosts.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'grief-photo-reclaim',
    category: 'grief-cycle',
    title: 'Photo Reclaim',
    description: 'Go through shared photos and keep only the ones where you look like you.',
    journalPrompt: 'Which photo felt the most yours?',
    lesson: 'Your story didn\'t start with them and doesn\'t end here.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'grief-season-marker',
    category: 'grief-cycle',
    title: 'Season Marker',
    description: 'Choose an object, song, or scent to mark this grief season. Retire it when you\'re ready.',
    journalPrompt: 'Why did you choose it, and when will you know it\'s time to let it go?',
    lesson: 'Endings deserve rituals too.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'grief-empty-chair',
    category: 'grief-cycle',
    title: 'The Empty Chair',
    description: 'Sit in a chair opposite an empty one. Say what you need to say to that space.',
    journalPrompt: 'What did you say that surprised you?',
    lesson: 'Silence is the loudest response you\'ll ever get.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'grief-sob-pass',
    category: 'grief-cycle',
    title: '24-Hour Sob Pass',
    description: 'Give yourself exactly one day to wallow — ugly crying, messy hair, the works.',
    journalPrompt: 'What did you notice when the clock ran out?',
    lesson: 'Feeling it all now hurts less than dragging it forever.',
    bytesReward: 5,
    difficulty: 'advanced',
    estimatedMinutes: 60
  },
  {
    id: 'grief-graveyard-playlist',
    category: 'grief-cycle',
    title: 'Graveyard Playlist',
    description: 'Create a playlist of songs you can no longer listen to without a pang. Play it once, then archive it.',
    journalPrompt: 'Which song will you miss most?',
    lesson: 'Music is emotional Velcro — cut the cords you don\'t want sticking.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'grief-timeline-scrub',
    category: 'grief-cycle',
    title: 'Timeline Scrub',
    description: 'Archive or delete old social media posts featuring them.',
    journalPrompt: 'Which post told the truest story — and why?',
    lesson: 'The internet doesn\'t need to remember what you\'ve chosen to forget.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'grief-voice-note-release',
    category: 'grief-cycle',
    title: 'Voice Note Release',
    description: 'Record yourself saying what\'s on your mind, then delete the file immediately.',
    journalPrompt: 'Did you hesitate to delete it?',
    lesson: 'You don\'t need a record to prove you felt something.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'grief-mirror-apology',
    category: 'grief-cycle',
    title: 'The Mirror Apology',
    description: 'Look at yourself in the mirror and apologise for the times you ignored your own needs for them.',
    journalPrompt: 'Which apology felt most needed?',
    lesson: 'Self-betrayal leaves bruises you can\'t see.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 10
  },
  {
    id: 'grief-mourning-outfit',
    category: 'grief-cycle',
    title: 'Mourning Outfit',
    description: 'Dress deliberately for grief — black, mismatched, or whatever feels right — and spend the day in it.',
    journalPrompt: 'How did people react to your look?',
    lesson: 'You don\'t have to hide your mourning to make others comfortable.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'grief-anniversary-armor',
    category: 'grief-cycle',
    title: 'Anniversary Armor',
    description: 'On an anniversary date, wear something that makes you feel untouchable.',
    journalPrompt: 'How did it feel to reclaim the date?',
    lesson: 'You own your calendar, not your memories.',
    bytesReward: 5,
    difficulty: 'advanced',
    estimatedMinutes: 20
  },
  {
    id: 'grief-farewell-feast',
    category: 'grief-cycle',
    title: 'Farewell Feast',
    description: 'Cook or order the food you used to share, and eat it alone with intention.',
    journalPrompt: 'What memory did each bite bring back?',
    lesson: 'You can digest the past, literally.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 45
  },
  {
    id: 'grief-sky-burial',
    category: 'grief-cycle',
    title: 'Sky Burial',
    description: 'Write one memory on paper, fold it into a plane, and throw it into the wind.',
    journalPrompt: 'Which direction did it fly, and how did that feel?',
    lesson: 'Letting go can be messy, imperfect, and still beautiful.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },

  // The Petty Purge — 20 Rituals
  {
    id: 'petty-contact-cemetery',
    category: 'petty-purge',
    title: 'Contact Cemetery',
    description: 'Delete or block every number, handle, and email they could use to sneak back in. Imagine you\'re sealing a tomb.',
    journalPrompt: 'Which one felt the most satisfying to erase?',
    lesson: 'They can\'t text you at 2 AM if they don\'t exist in your phone.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'petty-algorithm-cleanse',
    category: 'petty-purge',
    title: 'Algorithm Cleanse',
    description: 'Mute, unfollow, and hide their digital footprint until your feed forgets them entirely.',
    journalPrompt: 'Which mute made your shoulders drop in relief?',
    lesson: 'Your peace is worth more than "but what if I miss something?"',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'petty-playlist',
    category: 'petty-purge',
    title: 'Petty Playlist',
    description: 'Make a playlist that roasts their bad habits. Extra credit if the titles alone tell the story.',
    journalPrompt: 'Which song is your favourite jab?',
    lesson: 'Music can be a weapon and a shield at the same time.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'petty-bio-rewrite',
    category: 'petty-purge',
    title: 'Bio Rewrite',
    description: 'Update your dating or social profile with unapologetic main-character energy.',
    journalPrompt: 'What\'s the boldest new line you added?',
    lesson: 'Your narrative is yours to write — and edit aggressively.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'petty-clothes-exorcism',
    category: 'petty-purge',
    title: 'Clothes Exorcism',
    description: 'Donate or destroy anything of theirs in your space. Bonus points for dramatic flair.',
    journalPrompt: 'What item felt most cursed to touch?',
    lesson: 'Energy clings to fabric longer than you think.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'petty-receipt-burn',
    category: 'petty-purge',
    title: 'Receipt Burn',
    description: 'Print or copy a hurtful message and burn it safely. Watch every word disappear.',
    journalPrompt: 'What line disappeared first?',
    lesson: 'Fire eats faster than your brain does — let it help.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'petty-emoji-ban',
    category: 'petty-purge',
    title: 'Emoji Ban',
    description: 'Retire the emoji you overused with them. Replace it with one that screams "new era."',
    journalPrompt: 'Which replacement did you choose, and why?',
    lesson: 'Tiny symbols hold big ghosts.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'petty-postcard',
    category: 'petty-purge',
    title: 'Petty Postcard',
    description: 'Write a fake vacation postcard to your future self, bragging about your glow-up. Hide it somewhere you\'ll forget.',
    journalPrompt: 'What\'s the most outrageous brag you wrote?',
    lesson: 'Sometimes the best audience for your petty is you.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'petty-dm-nowhere',
    category: 'petty-purge',
    title: 'DM to Nowhere',
    description: 'Draft the message you wish you could send, then delete it instantly.',
    journalPrompt: 'What was your opening line?',
    lesson: 'Not every thought deserves a delivery.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'petty-revenge-planting',
    category: 'petty-purge',
    title: 'Revenge Planting',
    description: 'Change their contact name to something ridiculous before you block them.',
    journalPrompt: 'What name made you laugh most?',
    lesson: 'Humour is the cheapest revenge.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'petty-screenshot-purge',
    category: 'petty-purge',
    title: 'The Screenshot Purge',
    description: 'Delete all screenshots of your fights, receipts, and proof.',
    journalPrompt: 'Which one was hardest to let go of?',
    lesson: 'You don\'t need to keep evidence for a trial that\'s never coming.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'petty-pet-name-reclaim',
    category: 'petty-purge',
    title: 'Pet Name Reclaim',
    description: 'Take back a pet name they used for you and repurpose it — use it on yourself in a loving way.',
    journalPrompt: 'How does it feel when you say it now?',
    lesson: 'Words only sting if you let them keep their teeth.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 10
  },
  {
    id: 'petty-app-divorce',
    category: 'petty-purge',
    title: 'App Divorce',
    description: 'Remove any shared apps (banking, food delivery, streaming). Change the passwords.',
    journalPrompt: 'Which login felt like a liberation?',
    lesson: 'Boundaries start at the login screen.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'petty-song-skip-ceremony',
    category: 'petty-purge',
    title: 'Song Skip Ceremony',
    description: 'Skip the song that guts you every time and replace it with a "power track."',
    journalPrompt: 'What\'s your replacement anthem?',
    lesson: 'You can DJ your own healing.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'petty-kitchen-exorcism',
    category: 'petty-purge',
    title: 'Kitchen Exorcism',
    description: 'Throw out any food or drink tied to them. Replace it with something indulgent and entirely yours.',
    journalPrompt: 'What did you choose as the replacement?',
    lesson: 'Your fridge should only feed the life you want now.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'petty-digital-will',
    category: 'petty-purge',
    title: 'Digital Will',
    description: 'Create a "do not resurrect" list of photos, videos, and files. Lock or archive them far away.',
    journalPrompt: 'What made the list instantly?',
    lesson: 'You control the resurrection spell.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'petty-gossip-gift',
    category: 'petty-purge',
    title: 'Gossip Gift',
    description: 'Tell one trusted friend a petty detail you\'ve never shared — just to get it out.',
    journalPrompt: 'How did it feel to finally say it?',
    lesson: 'Sometimes you have to vent the steam before you explode.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'petty-calendar-purge',
    category: 'petty-purge',
    title: 'Calendar Purge',
    description: 'Remove all their birthdays, anniversaries, and reminders from your devices.',
    journalPrompt: 'Which date was the hardest to delete?',
    lesson: 'Memory doesn\'t live in your phone unless you feed it.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'petty-prophecy',
    category: 'petty-purge',
    title: 'Petty Prophecy',
    description: 'Write a fake horoscope about their future — the more dramatic, the better.',
    journalPrompt: 'What fate did you give them?',
    lesson: 'You can\'t predict the future, but you can make yourself laugh about it.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'petty-photo-crop-therapy',
    category: 'petty-purge',
    title: 'Photo Crop Therapy',
    description: 'Take one old photo with them in it, and crop them out creatively.',
    journalPrompt: 'How did the edited photo make you feel?',
    lesson: 'You\'re the main subject, always were.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },

  // The Glow-Up Forge — 20 Rituals
  {
    id: 'glow-two-minute-mirror',
    category: 'glow-up-forge',
    title: 'Two-Minute Mirror',
    description: 'Stand in front of a mirror and hype yourself up like you\'re about to headline a sold-out show. No fake modesty.',
    journalPrompt: 'What\'s the line you want to remember on bad days?',
    lesson: 'Confidence can be manufactured — and you\'re the factory.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'glow-skill-spark',
    category: 'glow-up-forge',
    title: 'Skill Spark',
    description: 'Spend 15 minutes learning a skill you wanted before they slowed you down. No productivity pressure — just curiosity.',
    journalPrompt: 'How did it feel to focus on something for you?',
    lesson: 'Investing in yourself always pays compound interest.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'glow-body-motion',
    category: 'glow-up-forge',
    title: 'Body in Motion',
    description: 'Move in whatever way feels good — dance, walk, stretch, jump rope. The goal is pleasure, not calories.',
    journalPrompt: 'How did your body feel at the end?',
    lesson: 'Movement is medicine you can prescribe yourself.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'glow-room-reset',
    category: 'glow-up-forge',
    title: 'Room Reset',
    description: 'Pick one space and completely reset it until it looks like the new you lives there.',
    journalPrompt: 'What\'s the one change that made the biggest difference?',
    lesson: 'Your environment is a mirror — polish it.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'glow-style-upgrade',
    category: 'glow-up-forge',
    title: 'Style Upgrade',
    description: 'Add one small but bold change to your appearance — nails, hair, accessories.',
    journalPrompt: 'What reaction (yours or someone else\'s) stood out?',
    lesson: 'A single detail can shift your entire vibe.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'glow-power-pose-drill',
    category: 'glow-up-forge',
    title: 'Power Pose Drill',
    description: 'Hold the most over-the-top power pose you can for two minutes. Bonus points if you look unhinged.',
    journalPrompt: 'Did you feel different after holding it?',
    lesson: 'Sometimes you fake it — and your body believes you.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'glow-compliment-hunt',
    category: 'glow-up-forge',
    title: 'Compliment Hunt',
    description: 'Collect three compliments today — earned, fished, or manufactured.',
    journalPrompt: 'Which one landed hardest?',
    lesson: 'External validation isn\'t everything, but it tastes great.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'glow-flirt-future',
    category: 'glow-up-forge',
    title: 'Flirt with Your Future',
    description: 'Book or plan one thing Future-You will brag about.',
    journalPrompt: 'How does it feel knowing it\'s on the horizon?',
    lesson: 'Anticipation is a high worth chasing.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'glow-selfie-liberation',
    category: 'glow-up-forge',
    title: 'Selfie Liberation',
    description: 'Take 20 selfies. Delete until only the one remains.',
    journalPrompt: 'Why did that one win?',
    lesson: 'You\'re the curator of your own gallery.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'glow-hobby-tease',
    category: 'glow-up-forge',
    title: 'New Hobby Tease',
    description: 'Research a hobby just enough to drop it into conversation like a pro.',
    journalPrompt: 'What\'s your hook line?',
    lesson: 'You don\'t need mastery to own the room — just confidence.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'glow-wardrobe-wildcard',
    category: 'glow-up-forge',
    title: 'Wardrobe Wildcard',
    description: 'Wear something today that you\'ve been "saving" for the right occasion.',
    journalPrompt: 'How did it feel to stop saving it?',
    lesson: 'The right occasion is you being alive.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'glow-signature-move',
    category: 'glow-up-forge',
    title: 'Signature Move',
    description: 'Develop one small, memorable action or quirk you can "own" in public — a wave, a wink, a phrase.',
    journalPrompt: 'What\'s your move?',
    lesson: 'Charisma is just consistency in style.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'glow-reverse-inspiration',
    category: 'glow-up-forge',
    title: 'Reverse Inspiration Scroll',
    description: 'Scroll social media and screenshot three things that inspire you — no jealousy allowed.',
    journalPrompt: 'Which screenshot made you want to act?',
    lesson: 'Comparison can be fuel if you burn it right.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'glow-audit',
    category: 'glow-up-forge',
    title: 'Glow Audit',
    description: 'List five things that make you feel attractive — do one immediately.',
    journalPrompt: 'Which one felt most powerful today?',
    lesson: 'Attraction starts with how you see yourself.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'glow-playlist-power',
    category: 'glow-up-forge',
    title: 'Playlist for Power',
    description: 'Create a playlist that makes you walk like you\'re the villain in Act Two.',
    journalPrompt: 'Which track changes your posture instantly?',
    lesson: 'Soundtracks are just mood spells.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'glow-future-proof-photo',
    category: 'glow-up-forge',
    title: 'Future Proof Photo',
    description: 'Take a photo you want to look back on in a year and think, that was my turning point.',
    journalPrompt: 'What\'s the story behind it?',
    lesson: 'Your glow-up has timestamps.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'glow-skill-show-off',
    category: 'glow-up-forge',
    title: 'Skill Show-Off',
    description: 'Share a small skill online or with friends — own your competence.',
    journalPrompt: 'How did sharing feel?',
    lesson: 'Pride isn\'t arrogance if it\'s deserved.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'glow-comfort-swap',
    category: 'glow-up-forge',
    title: 'Comfort Swap',
    description: 'Replace one comfort habit that keeps you stagnant with something that nudges you forward.',
    journalPrompt: 'What did you swap?',
    lesson: 'Growth requires a little discomfort.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'glow-upgrade-hour',
    category: 'glow-up-forge',
    title: 'Upgrade Hour',
    description: 'Spend one uninterrupted hour improving one corner of your life — no phone, no multitasking.',
    journalPrompt: 'What changed in that hour?',
    lesson: 'Focus is a flex.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 60
  },
  {
    id: 'glow-compliment-mirror',
    category: 'glow-up-forge',
    title: 'Compliment Mirror',
    description: 'Write three compliments about yourself on sticky notes and put them where you\'ll see them tomorrow.',
    journalPrompt: 'Which one will be hardest to believe?',
    lesson: 'Repetition turns disbelief into truth.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },

  // The Reframe Loop — 20 Rituals
  {
    id: 'reframe-red-flag-autopsy',
    category: 'reframe-loop',
    title: 'Red Flag Autopsy',
    description: 'Take one awful moment and dissect it like you\'re hosting a true crime podcast — motives, timeline, evidence.',
    journalPrompt: 'What\'s your "case closed" takeaway?',
    lesson: 'Clarity kills nostalgia.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'reframe-3-to-1-gratitude',
    category: 'reframe-loop',
    title: '3-to-1 Gratitude',
    description: 'For every bad thought about them, list three unrelated good things about your life right now.',
    journalPrompt: 'Which good thing surprised you most?',
    lesson: 'Gratitude is the cheapest antidepressant.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'reframe-future-you-letter',
    category: 'reframe-loop',
    title: 'Future You Letter',
    description: 'Write to yourself from six months ahead, like a bossy older sibling.',
    journalPrompt: 'What\'s the bluntest advice you gave?',
    lesson: 'You already know what you need to hear.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'reframe-trigger-map',
    category: 'reframe-loop',
    title: 'Trigger Map',
    description: 'Sketch or list your emotional landmines. Label each with a safe route around it.',
    journalPrompt: 'Which trigger feels most manageable now?',
    lesson: 'Avoidance is smart if it\'s strategic.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'reframe-spin-doctor',
    category: 'reframe-loop',
    title: 'Spin Doctor',
    description: 'Rewrite one ugly breakup fact into an empowering story.',
    journalPrompt: 'How did it change the way you see it?',
    lesson: 'Same facts, different spin, whole new life.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'reframe-delulu-drill',
    category: 'reframe-loop',
    title: 'Delulu Drill',
    description: 'Spend three minutes imagining the absolute best-case scenario for your future.',
    journalPrompt: 'Did you feel your posture change?',
    lesson: 'Delusion is just optimism without the boring parts.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'reframe-villain-origin',
    category: 'reframe-loop',
    title: 'Villain Origin Draft',
    description: 'Write the opening scene of your "this is when I snapped" movie.',
    journalPrompt: 'What\'s the first line?',
    lesson: 'Villains get good lighting for a reason.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'reframe-green-flag-parade',
    category: 'reframe-loop',
    title: 'Green Flag Parade',
    description: 'List your must-have healthy traits in a future partner, no exceptions.',
    journalPrompt: 'Which one is the hill you\'ll die on?',
    lesson: 'Standards aren\'t walls — they\'re filters.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'reframe-ex-as-meme',
    category: 'reframe-loop',
    title: 'Ex as a Meme',
    description: 'Summarise them in a meme — but keep it for your eyes only.',
    journalPrompt: 'Why did that meme fit?',
    lesson: 'Comedy is free therapy with better punchlines.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'reframe-plot-twist-day',
    category: 'reframe-loop',
    title: 'Plot Twist Day',
    description: 'Do one thing completely out of your usual character.',
    journalPrompt: 'What did it feel like to break your own pattern?',
    lesson: 'Predictability is boring, especially to yourself.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'reframe-reverse-red-flag',
    category: 'reframe-loop',
    title: 'Reverse Red Flag',
    description: 'Take one "red flag" about yourself they didn\'t like and imagine how it\'s actually a strength.',
    journalPrompt: 'How can you use it to your advantage?',
    lesson: 'Your flaws are just features they couldn\'t handle.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'reframe-myth-busting',
    category: 'reframe-loop',
    title: 'Emotional Myth-Busting',
    description: 'Pick one story you tell yourself about the breakup and list all the reasons it might not be true.',
    journalPrompt: 'Which part felt like the biggest lie?',
    lesson: 'Memory is a creative writer.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'reframe-gratitude-grenade',
    category: 'reframe-loop',
    title: 'Gratitude Grenade',
    description: 'Send a thank-you message to someone unrelated to the breakup, out of the blue.',
    journalPrompt: 'How did they respond?',
    lesson: 'Kindness hits harder when unexpected.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'reframe-complaint-reversal',
    category: 'reframe-loop',
    title: 'Complaint Reversal',
    description: 'Take one complaint they had about you and turn it into a compliment.',
    journalPrompt: 'What\'s your reframe?',
    lesson: 'Criticism often says more about the critic.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'reframe-what-if-flip',
    category: 'reframe-loop',
    title: 'The "What If" Flip',
    description: 'Write your biggest breakup "what if" and then a positive "what if" that could happen instead.',
    journalPrompt: 'Which feels more possible now?',
    lesson: 'Possibility works both ways.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'reframe-heros-journey',
    category: 'reframe-loop',
    title: 'Hero\'s Journey Check',
    description: 'Map your breakup recovery like a movie plot, marking where you are now.',
    journalPrompt: 'What\'s the next "scene" you want to see?',
    lesson: 'You\'re the main character, not a side quest.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'reframe-compliment-rewrite',
    category: 'reframe-loop',
    title: 'Compliment Rewrite',
    description: 'Rewrite one genuine compliment they gave you so it feels even more powerful.',
    journalPrompt: 'What\'s your upgraded version?',
    lesson: 'You decide which words stick.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'reframe-alternate-ending',
    category: 'reframe-loop',
    title: 'Alternate Ending',
    description: 'Write the last conversation you wish you\'d had, but make it empowering for you.',
    journalPrompt: 'How did it feel to "win" the ending?',
    lesson: 'Closure is a creative act.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'reframe-mood-board-revenge',
    category: 'reframe-loop',
    title: 'Mood Board for Revenge',
    description: 'Create a visual board of your post-breakup life goals — aesthetic first, details later.',
    journalPrompt: 'Which image feels most like the future you want?',
    lesson: 'Vision boards are just witchcraft with scissors.',
    bytesReward: 5,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'reframe-shadow-work-lite',
    category: 'reframe-loop',
    title: 'Shadow Work Lite',
    description: 'Write down one uncomfortable truth about yourself and one plan to improve it.',
    journalPrompt: 'How does owning it feel?',
    lesson: 'Growth starts where excuses end.',
    bytesReward: 5,
    difficulty: 'advanced',
    estimatedMinutes: 25
  },

  // The Ghost Cleanse — 20 Rituals
  {
    id: 'ghost-shield-window-check',
    category: 'ghost-cleanse',
    title: 'Shield Window Check',
    description: 'Look at your no-contact streak counter. Imagine it doubling — and how proud Future-You will be.',
    journalPrompt: 'How does that number feel in your body?',
    lesson: 'Progress is addictive if you let yourself measure it.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'ghost-boundary-affirmations',
    category: 'ghost-cleanse',
    title: 'Boundary Affirmations',
    description: 'Read your personal boundaries aloud like they\'re commandments. Bonus if you use your best "cult leader" voice.',
    journalPrompt: 'Which one hits hardest right now?',
    lesson: 'Boundaries aren\'t mean — they\'re maintenance.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'ghost-silent-hours',
    category: 'ghost-cleanse',
    title: 'Silent Hours',
    description: 'Choose one hour to go completely unreachable — phone silenced, DMs closed, notifications off.',
    journalPrompt: 'What did you do instead?',
    lesson: 'The world keeps spinning without your instant availability.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 60
  },
  {
    id: 'ghost-pattern-break',
    category: 'ghost-cleanse',
    title: 'Pattern Break',
    description: 'Identify one habit they could predict (same café, same commute) and change it.',
    journalPrompt: 'How did the change feel?',
    lesson: 'Routine is comforting until it\'s a cage.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'ghost-exit-script',
    category: 'ghost-cleanse',
    title: 'Exit Script',
    description: 'Write and rehearse a short, polite "no" for any accidental contact.',
    journalPrompt: 'How did it feel to hear yourself say it?',
    lesson: 'Preparedness kills panic.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'ghost-mute-mutuals',
    category: 'ghost-cleanse',
    title: 'Mute the Mutuals',
    description: 'Temporarily mute any mutual friends who still post about them.',
    journalPrompt: 'Which account was hardest to mute?',
    lesson: 'Your peace is worth a temporary silence.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'ghost-digital-gatekeeper',
    category: 'ghost-cleanse',
    title: 'Digital Gatekeeper',
    description: 'Change passwords, add two-factor authentication, review privacy settings.',
    journalPrompt: 'Which change gave you the biggest sense of control?',
    lesson: 'Your accounts are part of your emotional perimeter.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'ghost-outfit',
    category: 'ghost-cleanse',
    title: 'Ghost Outfit',
    description: 'Wear something you\'d never wear around them — and wear it with intent.',
    journalPrompt: 'How did it feel to walk out like that?',
    lesson: 'Clothes are a language; change your dialect.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'ghost-inbox-fortress',
    category: 'ghost-cleanse',
    title: 'Inbox Fortress',
    description: 'Set up filters to catch any emails from them before they hit your inbox.',
    journalPrompt: 'How does knowing they can\'t reach you feel?',
    lesson: 'Prevention beats reaction every time.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'ghost-no-contact-confetti',
    category: 'ghost-cleanse',
    title: 'No-Contact Confetti',
    description: 'Celebrate your streak with a small reward — a coffee, a bath bomb, a new playlist.',
    journalPrompt: 'What did you choose?',
    lesson: 'Positive reinforcement works on humans, too.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'ghost-platform-audit',
    category: 'ghost-cleanse',
    title: 'Social Platform Audit',
    description: 'Go through every app and check if they still have access or visibility — fix it.',
    journalPrompt: 'Which app was the most surprising leak?',
    lesson: 'Your privacy is only as strong as your laziest settings.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'ghost-shield-symbol',
    category: 'ghost-cleanse',
    title: 'Shield Symbol',
    description: 'Pick a physical object (ring, bracelet, keychain) to represent your boundary.',
    journalPrompt: 'How does touching it make you feel?',
    lesson: 'Talismans aren\'t just for fantasy novels.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'ghost-gps-ghosting',
    category: 'ghost-cleanse',
    title: 'GPS Ghosting',
    description: 'Disable location sharing everywhere, even with friends who might overshare.',
    journalPrompt: 'Did you feel lighter after?',
    lesson: 'Not everyone needs to know where you are — especially them.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'ghost-call-block-blitz',
    category: 'ghost-cleanse',
    title: 'Call Block Blitz',
    description: 'Block every number they might use — including "unknown" if you can.',
    journalPrompt: 'How many did you block?',
    lesson: 'You owe no one a direct line.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'ghost-playlist-swap',
    category: 'ghost-cleanse',
    title: 'Playlist Swap',
    description: 'Replace any playlist they\'re linked to with one that fits your new era.',
    journalPrompt: 'What\'s the new vibe?',
    lesson: 'Your soundtrack should match your storyline.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'ghost-memory-route-reroute',
    category: 'ghost-cleanse',
    title: 'Memory Route Reroute',
    description: 'Avoid a shared hangout spot for a week and try a new one instead.',
    journalPrompt: 'Did the new spot feel safer?',
    lesson: 'Geography is emotional — redraw your map.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'ghost-phone-detox-day',
    category: 'ghost-cleanse',
    title: 'Phone Detox Day',
    description: 'One full day without your phone in arm\'s reach.',
    journalPrompt: 'What\'s the first thing you noticed?',
    lesson: 'Accessibility isn\'t love, and absence isn\'t loss.',
    bytesReward: 7,
    difficulty: 'advanced',
    estimatedMinutes: 60
  },
  {
    id: 'ghost-stranger-mantra',
    category: 'ghost-cleanse',
    title: '"They\'re a Stranger" Mantra',
    description: 'Repeat: "They\'re just another person now" ten times in a row.',
    journalPrompt: 'Did it get easier to believe?',
    lesson: 'Strangers don\'t deserve your energy.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'ghost-auto-responder-armor',
    category: 'ghost-cleanse',
    title: 'Auto-Responder Armor',
    description: 'Set up an automatic response that politely says "Unavailable" to unknown contacts.',
    journalPrompt: 'How does knowing you\'ll never be caught off-guard feel?',
    lesson: 'Automation is self-care in code form.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'ghost-ritual-lock-in',
    category: 'ghost-cleanse',
    title: 'Ritual Lock-In',
    description: 'Commit to doing at least one Ghost Cleanse ritual a week for a month.',
    journalPrompt: 'Which one will you start with?',
    lesson: 'Boundaries aren\'t one-off events — they\'re a practice.',
    bytesReward: 7,
    difficulty: 'advanced',
    estimatedMinutes: 20
  },

  // The Public Face — 20 Rituals
  {
    id: 'public-good-photo-day',
    category: 'public-face',
    title: 'Good Photo Day',
    description: 'Capture & post a photo where you look unmistakably alive and thriving. No filters that hide your expression — let them see your eyes.',
    journalPrompt: 'What story does this photo tell about you now?',
    lesson: 'The best revenge is looking convincingly unbothered.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'public-social-anchor',
    category: 'public-face',
    title: 'Social Anchor',
    description: 'Book a hangout with a safe, supportive friend — and post a subtle snap from it.',
    journalPrompt: 'How did the invite feel to send?',
    lesson: 'Presence beats appearances, but appearances still work.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'public-confession-plant',
    category: 'public-face',
    title: 'Confession to a Plant',
    description: 'Vent to your houseplant, garden, or a patch of grass. Bonus points for dramatic pauses.',
    journalPrompt: 'Did saying it out loud make it lose power?',
    lesson: 'A listener doesn\'t need ears to help you process.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'public-outfit-armour',
    category: 'public-face',
    title: 'Outfit Armour',
    description: 'Wear something that makes you feel untouchable — whether that\'s power heels or your weirdest vintage jacket.',
    journalPrompt: 'How did people react to your look?',
    lesson: 'Wardrobe can be war paint.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'public-tiny-win',
    category: 'public-face',
    title: 'Tiny Public Win',
    description: 'Share a recent achievement with zero breakup context.',
    journalPrompt: 'How did it feel to post without explaining?',
    lesson: 'Not all victories need backstory to shine.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'public-signature-scent',
    category: 'public-face',
    title: 'Signature Scent Day',
    description: 'Wear a scent they\'ve never smelled on you and take it somewhere new.',
    journalPrompt: 'Did the scent shift your mood?',
    lesson: 'Smell is memory — give yourself fresh ones.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'public-audience-swap',
    category: 'public-face',
    title: 'Audience Swap',
    description: 'Post on a platform or in a community you\'ve never engaged with before.',
    journalPrompt: 'How did the vibe compare to your usual spaces?',
    lesson: 'Sometimes you just need a new room.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'public-victory-lap',
    category: 'public-face',
    title: 'Public Victory Lap',
    description: 'Share a milestone — gym goal, art project, career win — with confidence.',
    journalPrompt: 'What response surprised you most?',
    lesson: 'Let people root for you.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'public-photobomb-feed',
    category: 'public-face',
    title: 'Photobomb the Feed',
    description: 'Insert yourself unexpectedly into someone else\'s fun photo — with consent.',
    journalPrompt: 'How did it feel to be spontaneous?',
    lesson: 'Joy is contagious when you crash it.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'public-speechless-story',
    category: 'public-face',
    title: 'Speechless Story',
    description: 'Post a striking visual with no caption and watch people project their own ideas.',
    journalPrompt: 'What reactions did you get?',
    lesson: 'Mystery builds curiosity.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 10
  },
  {
    id: 'public-compliment-chain',
    category: 'public-face',
    title: 'Compliment Chain Reaction',
    description: 'Give 5 genuine compliments online today — watch the ripple.',
    journalPrompt: 'Which one felt best to give?',
    lesson: 'Attention given comes back brighter.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'public-group-photo-flex',
    category: 'public-face',
    title: 'Group Photo Flex',
    description: 'Post a shot with multiple friends — no single focal point on you, but your vibe still dominates.',
    journalPrompt: 'How does it feel to blend and shine at the same time?',
    lesson: 'Presence can be soft and still powerful.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'public-unfiltered-minute',
    category: 'public-face',
    title: 'Unfiltered Minute',
    description: 'Share a 60-second video of you doing something you love, no edits.',
    journalPrompt: 'What was most vulnerable about sharing it?',
    lesson: 'Authenticity wins long games.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'public-throwback-twist',
    category: 'public-face',
    title: 'Throwback With a Twist',
    description: 'Post an old photo from before the relationship, with a caption about now.',
    journalPrompt: 'How did it feel to revisit pre-them you?',
    lesson: 'You existed — and thrived — long before.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'public-skill-drop',
    category: 'public-face',
    title: 'Public Skill Drop',
    description: 'Demonstrate a talent online — sing, code, sketch — without apology.',
    journalPrompt: 'What was the hardest part of putting it out there?',
    lesson: 'Skill speaks louder than self-doubt.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 25
  },
  {
    id: 'public-feed-refresh',
    category: 'public-face',
    title: 'Feed Refresh',
    description: 'Curate your socials by archiving posts that no longer reflect who you are.',
    journalPrompt: 'Which post felt best to remove?',
    lesson: 'Your story should match your current chapter.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'public-event-planting',
    category: 'public-face',
    title: 'Event Planting',
    description: 'RSVP to an event that makes you excited — even if you go alone.',
    journalPrompt: 'What are you hoping to get from it?',
    lesson: 'Visibility is an active choice.',
    bytesReward: 7,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'public-crowd-energy-borrow',
    category: 'public-face',
    title: 'Crowd Energy Borrow',
    description: 'Go somewhere bustling and soak up the energy without engaging.',
    journalPrompt: 'How did it shift your mood?',
    lesson: 'Confidence is sometimes just borrowed from the air.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 30
  },
  {
    id: 'public-spotlight-swap',
    category: 'public-face',
    title: 'Spotlight Swap',
    description: 'Share someone else\'s win publicly.',
    journalPrompt: 'How did celebrating them make you feel?',
    lesson: 'Lifting others lifts you, too.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'public-quiet-flex',
    category: 'public-face',
    title: 'The Quiet Flex',
    description: 'Wear or use something new and beautiful without pointing it out. Let people notice.',
    journalPrompt: 'Who clocked it first?',
    lesson: 'Confidence whispers.',
    bytesReward: 7,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },

  // The Soft Reset — 20 Rituals
  {
    id: 'soft-5-sense-scan',
    category: 'soft-reset',
    title: '5-Sense Scan',
    description: 'Name one thing you can see, hear, smell, taste, and touch. Pause between each.',
    journalPrompt: 'Which sense felt strongest today?',
    lesson: 'The present moment is hiding in your senses.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'soft-hydration-domination',
    category: 'soft-reset',
    title: 'Hydration Domination',
    description: 'Drink a full glass of water slowly, like it\'s the main event.',
    journalPrompt: 'Did you feel different being mindful with it?',
    lesson: 'Small acts keep the bigger machine running.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'soft-micro-stretch',
    category: 'soft-reset',
    title: 'Micro-Stretch',
    description: 'Stretch three body parts you usually ignore — neck, wrists, jaw.',
    journalPrompt: 'Which stretch gave the most relief?',
    lesson: 'Tiny movements undo giant knots.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-sunlight-sip',
    category: 'soft-reset',
    title: 'Sunlight Sip',
    description: 'Have your morning drink in direct sunlight.',
    journalPrompt: 'What did you notice in those minutes?',
    lesson: 'Light is a mood-altering drug you can get for free.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-cozy-corner',
    category: 'soft-reset',
    title: 'Cozy Corner',
    description: 'Rearrange your softest space for maximum comfort.',
    journalPrompt: 'How does it feel to sit there now?',
    lesson: 'Comfort is a form of strategy.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'soft-weighted-blanket-time',
    category: 'soft-reset',
    title: 'Weighted Blanket Time',
    description: 'Wrap yourself in a heavy blanket for 10 minutes, phone-free.',
    journalPrompt: 'How did your body respond?',
    lesson: 'Pressure can be grounding in the right form.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-cloud-watch',
    category: 'soft-reset',
    title: 'Cloud Watch',
    description: 'Lie down and watch the sky until your brain slows down.',
    journalPrompt: 'What shapes stood out to you?',
    lesson: 'Daydreaming is rest, not laziness.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  {
    id: 'soft-warm-hands-ritual',
    category: 'soft-reset',
    title: 'Warm Hands Ritual',
    description: 'Hold a warm mug in both hands, breathe in for 5 counts, out for 7.',
    journalPrompt: 'Did it calm your nervous system?',
    lesson: 'Your body listens when you slow down.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-sock-upgrade',
    category: 'soft-reset',
    title: 'Sock Upgrade',
    description: 'Swap into your coziest or funniest socks and notice how it changes your mood.',
    journalPrompt: 'Why did you choose those?',
    lesson: 'The smallest comforts can have the biggest impact.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'soft-one-page-escape',
    category: 'soft-reset',
    title: 'One-Page Escape',
    description: 'Read one page of a book purely for pleasure.',
    journalPrompt: 'How did it shift your focus?',
    lesson: 'Even brief escapes are still escapes.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'soft-breath-box',
    category: 'soft-reset',
    title: 'Breath Box',
    description: 'Breathe in for 4, hold 4, out for 4, hold 4 — repeat four times.',
    journalPrompt: 'How do you feel compared to before?',
    lesson: 'Your breath is a built-in reset button.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'soft-candle-companion',
    category: 'soft-reset',
    title: 'Candle Companion',
    description: 'Light a candle and watch the flame for a few minutes without distraction.',
    journalPrompt: 'What thoughts surfaced while watching?',
    lesson: 'Fire hypnotises for a reason — it demands presence.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-gratitude-grain',
    category: 'soft-reset',
    title: 'Gratitude Grain',
    description: 'Think of one small thing you\'re grateful for that happened today.',
    journalPrompt: 'How does focusing on it feel?',
    lesson: 'Gratitude compounds.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'soft-digital-dimmer',
    category: 'soft-reset',
    title: 'Digital Dimmer',
    description: 'Lower your screen brightness for the evening and notice your body\'s reaction.',
    journalPrompt: 'Did it change how you felt?',
    lesson: 'Light controls mood more than you realise.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-gentle-soundtrack',
    category: 'soft-reset',
    title: 'Gentle Soundtrack',
    description: 'Play calming music or nature sounds for 10 minutes.',
    journalPrompt: 'Which sound stood out?',
    lesson: 'Soundscapes are environments for your brain.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-low-effort-nourish',
    category: 'soft-reset',
    title: 'Low-Effort Nourish',
    description: 'Prepare or order a simple, comforting meal — no guilt about effort.',
    journalPrompt: 'How did it feel to just feed yourself without fuss?',
    lesson: 'You don\'t have to earn care.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 20
  },
  {
    id: 'soft-colour-therapy',
    category: 'soft-reset',
    title: 'Colour Therapy',
    description: 'Surround yourself with one colour (clothes, blankets, objects) for an hour.',
    journalPrompt: 'How did it affect your mood?',
    lesson: 'Colours speak directly to your nervous system.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 60
  },
  {
    id: 'soft-pet-time',
    category: 'soft-reset',
    title: 'Pet Time',
    description: 'If you have a pet, spend 5 uninterrupted minutes with them. If not, watch videos of your favourite animals.',
    journalPrompt: 'How did it shift your feelings?',
    lesson: 'Connection doesn\'t always have to be human.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-declutter-five',
    category: 'soft-reset',
    title: 'Declutter Five',
    description: 'Remove or tidy just five items in your space.',
    journalPrompt: 'Did it change how the room feels?',
    lesson: 'Small order can ease big chaos.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'soft-mini-mantra',
    category: 'soft-reset',
    title: 'Mini Mantra',
    description: 'Repeat a short phrase (e.g., "I am safe here") 10 times slowly.',
    journalPrompt: 'How did it land by the tenth time?',
    lesson: 'The brain learns through repetition — use that.',
    bytesReward: 5,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },

  // The Cult Missions — 20 Rituals
  {
    id: 'cult-recruit-conspirator',
    category: 'cult-missions',
    title: 'Recruit a Co-Conspirator',
    description: 'Convince one friend to join CTRL+ALT+BLOCK™. Bonus points if you don\'t explain why right away.',
    journalPrompt: 'How did you pitch it?',
    lesson: 'Shared chaos is better than solo chaos.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'cult-hidden-glyph-hunt',
    category: 'cult-missions',
    title: 'Hidden Glyph Hunt',
    description: 'Spot one of the platform\'s easter-egg symbols or messages and screenshot it for your personal collection.',
    journalPrompt: 'Where did you find it?',
    lesson: 'Details reward the observant.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'cult-byte-heist',
    category: 'cult-missions',
    title: 'Byte Heist',
    description: 'Complete three rituals in one day. No skipping journaling steps.',
    journalPrompt: 'Which one gave you the biggest rush?',
    lesson: 'Momentum is addictive.',
    bytesReward: 8,
    difficulty: 'advanced',
    estimatedMinutes: 90
  },
  {
    id: 'cult-cipher',
    category: 'cult-missions',
    title: 'Cult Cipher',
    description: 'Decode the weekly hidden message in the app.',
    journalPrompt: 'What did it say, and how did you interpret it?',
    lesson: 'Secrets are more fun when they\'re shared selectively.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'cult-glitch-selfie',
    category: 'cult-missions',
    title: 'Glitch Selfie',
    description: 'Post a glitch-aesthetic selfie to the Wall of Wounds™.',
    journalPrompt: 'What editing tricks did you use?',
    lesson: 'Imperfection can be aesthetic.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'cult-meme-drop',
    category: 'cult-missions',
    title: 'Meme Drop',
    description: 'Create or share a breakup meme that hits just the right nerve.',
    journalPrompt: 'Did anyone respond in a surprising way?',
    lesson: 'Humour travels faster than pity.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'cult-badge-speedrun',
    category: 'cult-missions',
    title: 'Badge Speedrun',
    description: 'Try to unlock any badge in under 24 hours.',
    journalPrompt: 'Which badge did you target, and why?',
    lesson: 'Goals are more fun when they\'re a little arbitrary.',
    bytesReward: 8,
    difficulty: 'advanced',
    estimatedMinutes: 60
  },
  {
    id: 'cult-xp-double-dare',
    category: 'cult-missions',
    title: 'XP Double Dare',
    description: 'Do one ritual from every category in a single day.',
    journalPrompt: 'Which category was hardest to knock out?',
    lesson: 'Range is a skill.',
    bytesReward: 8,
    difficulty: 'advanced',
    estimatedMinutes: 120
  },
  {
    id: 'cult-emoji-flood',
    category: 'cult-missions',
    title: 'Emoji Flood',
    description: 'React to 10 Wall posts in 60 seconds.',
    journalPrompt: 'Which emoji dominated your spree?',
    lesson: 'Over-communication can be liberating.',
    bytesReward: 8,
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  {
    id: 'cult-ritual-roulette',
    category: 'cult-missions',
    title: 'Ritual Roulette',
    description: 'Use the randomiser to pick your next challenge — no rerolls.',
    journalPrompt: 'What came up, and how did you feel about it?',
    lesson: 'Not everything in life should be planned.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 30
  },
  {
    id: 'cult-anonymous-confessional',
    category: 'cult-missions',
    title: 'Anonymous Confessional',
    description: 'Post an anonymous, outrageous confession in the Wall feed.',
    journalPrompt: 'How did it feel to share without ownership?',
    lesson: 'Freedom lives in anonymity.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'cult-cross-category-combo',
    category: 'cult-missions',
    title: 'Cross-Category Combo',
    description: 'Blend two rituals from different categories into one mega-ritual.',
    journalPrompt: 'Which combo did you create?',
    lesson: 'Rules bend if you\'re creative.',
    bytesReward: 8,
    difficulty: 'advanced',
    estimatedMinutes: 45
  },
  {
    id: 'cult-reaction-relay',
    category: 'cult-missions',
    title: 'Reaction Relay',
    description: 'Reply to someone\'s Wall post with a supportive or absurd comment.',
    journalPrompt: 'How did they respond?',
    lesson: 'Interaction fuels community.',
    bytesReward: 8,
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  {
    id: 'cult-byte-gamble',
    category: 'cult-missions',
    title: 'Byte Gamble',
    description: 'Spend Bytes on a mystery reward in the shop.',
    journalPrompt: 'How did you feel about what you got?',
    lesson: 'Risk is its own reward.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 10
  },
  {
    id: 'cult-24-hour-theme',
    category: 'cult-missions',
    title: '24-Hour Theme Day',
    description: 'Pick a theme (colour, mood, aesthetic) and commit to it all day.',
    journalPrompt: 'How did it change your behaviour?',
    lesson: 'Immersion changes perspective.',
    bytesReward: 8,
    difficulty: 'advanced',
    estimatedMinutes: 60
  },
  {
    id: 'cult-wall-streak-challenge',
    category: 'cult-missions',
    title: 'Wall Streak Challenge',
    description: 'Post to the Wall three days in a row.',
    journalPrompt: 'Which post got the best engagement?',
    lesson: 'Consistency builds presence.',
    bytesReward: 8,
    difficulty: 'advanced',
    estimatedMinutes: 30
  },
  {
    id: 'cult-byte-matchmaker',
    category: 'cult-missions',
    title: 'Byte Matchmaker',
    description: 'Gift Bytes to a stranger on the platform.',
    journalPrompt: 'How did it feel to give something intangible?',
    lesson: 'Generosity hits harder when it\'s not expected.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 10
  },
  {
    id: 'cult-easter-egg-planting',
    category: 'cult-missions',
    title: 'Easter Egg Planting',
    description: 'Hide a small personal "signature" in a Wall post for others to notice.',
    journalPrompt: 'Did anyone catch it?',
    lesson: 'Connection can be subtle.',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 15
  },
  {
    id: 'cult-ritual-swap',
    category: 'cult-missions',
    title: 'Ritual Swap',
    description: 'Ask someone in the community to pick a ritual for you.',
    journalPrompt: 'How did you feel about their choice?',
    lesson: 'Surrender builds trust (and sometimes annoyance).',
    bytesReward: 8,
    difficulty: 'intermediate',
    estimatedMinutes: 20
  },
  {
    id: 'cult-public-dare',
    category: 'cult-missions',
    title: 'Public Dare',
    description: 'Accept a playful dare from another member and document it (safely).',
    journalPrompt: 'What did you do, and would you repeat it?',
    lesson: 'Sometimes you have to let others steer for a minute.',
    bytesReward: 8,
    difficulty: 'advanced',
    estimatedMinutes: 30
  }
];

export function getPaidRitualsByCategory(category: string): PaidRitual[] {
  return PAID_RITUALS_DATABASE.filter(ritual => ritual.category === category);
}

export function getPaidRitualById(id: string): PaidRitual | undefined {
  return PAID_RITUALS_DATABASE.find(ritual => ritual.id === id);
}

export function getRandomPaidRituals(count: number, excludeIds: string[] = []): PaidRitual[] {
  const available = PAID_RITUALS_DATABASE.filter(ritual => !excludeIds.includes(ritual.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getGuidedPathRituals(
  userWeeks: number,
  count: number = 2,
  excludeIds: string[] = []
): PaidRitual[] {
  const categoryWeights = getProgressWeights(userWeeks);
  const selectedRituals: PaidRitual[] = [];
  
  for (let i = 0; i < count; i++) {
    const availableByCategory = Object.entries(categoryWeights).map(([category, weight]) => ({
      category,
      weight,
      rituals: getPaidRitualsByCategory(category).filter(
        ritual => !excludeIds.includes(ritual.id) && !selectedRituals.some(s => s.id === ritual.id)
      )
    })).filter(cat => cat.rituals.length > 0);
    
    if (availableByCategory.length === 0) break;
    
    // Weighted random selection
    const totalWeight = availableByCategory.reduce((sum, cat) => sum + cat.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedCategory;
    for (const cat of availableByCategory) {
      random -= cat.weight;
      if (random <= 0) {
        selectedCategory = cat;
        break;
      }
    }
    
    if (selectedCategory && selectedCategory.rituals.length > 0) {
      const randomRitual = selectedCategory.rituals[Math.floor(Math.random() * selectedCategory.rituals.length)];
      selectedRituals.push(randomRitual);
    }
  }
  
  return selectedRituals;
}

function getProgressWeights(userWeeks: number): Record<string, number> {
  if (userWeeks <= 2) {
    // Weeks 1-2: 60% early, 40% intermediate
    return {
      'grief-cycle': 30,
      'petty-purge': 30,
      'soft-reset': 20,
      'reframe-loop': 20,
      'glow-up-forge': 0,
      'ghost-cleanse': 0,
      'public-face': 0,
      'cult-missions': 0
    };
  } else if (userWeeks <= 4) {
    // Weeks 3-4: 30% early, 70% intermediate/advanced
    return {
      'grief-cycle': 15,
      'petty-purge': 15,
      'soft-reset': 10,
      'reframe-loop': 25,
      'glow-up-forge': 25,
      'ghost-cleanse': 10,
      'public-face': 0,
      'cult-missions': 0
    };
  } else if (userWeeks <= 8) {
    // Weeks 5-8: 20% early, 80% advanced
    return {
      'grief-cycle': 10,
      'petty-purge': 10,
      'soft-reset': 5,
      'reframe-loop': 15,
      'glow-up-forge': 20,
      'ghost-cleanse': 20,
      'public-face': 15,
      'cult-missions': 5
    };
  } else {
    // Week 9+: Full access, emphasis on advanced
    return {
      'grief-cycle': 5,
      'petty-purge': 5,
      'soft-reset': 10,
      'reframe-loop': 10,
      'glow-up-forge': 20,
      'ghost-cleanse': 20,
      'public-face': 20,
      'cult-missions': 10
    };
  }
}
