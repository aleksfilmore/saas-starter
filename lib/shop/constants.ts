// CTRL+ALT+BLOCK Byte Economy & Shop Constants

// =====================================
// BYTE EARNING SYSTEM
// =====================================

export const BYTE_EARNING_ACTIVITIES = {
  // Core Rituals (Main earning engine)
  DAILY_RITUAL_1: {
    activity: 'daily_ritual_1',
    bytes: 8,
    dailyLimit: 1,
    description: 'Complete first daily ritual'
  },
  DAILY_RITUAL_2: {
    activity: 'daily_ritual_2', 
    bytes: 8,
    dailyLimit: 1,
    description: 'Complete second daily ritual'
  },
  
  // Self-Tracking & Reflection
  DAILY_CHECKIN: {
    activity: 'daily_checkin',
    bytes: 4,
    dailyLimit: 1,
    description: 'Complete daily mood/status check-in'
  },
  JOURNAL_PROMPT: {
    activity: 'journal_prompt',
    bytes: 4,
    dailyLimit: 1,
    description: 'Complete daily journal prompt'
  },
  NO_CONTACT_STREAK: {
    activity: 'no_contact_checkin',
    bytes: 4,
    dailyLimit: 1,
    description: 'Confirm no-contact streak maintained'
  },
  
  // Community & AI Engagement  
  WALL_POST: {
    activity: 'wall_post',
    bytes: 4,
    dailyLimit: 2,
    description: 'Create a Wall of Wounds post'
  },
  WALL_REACTION: {
    activity: 'wall_reaction',
    bytes: 1,
    dailyLimit: 3,
    description: 'React to or support a Wall post'
  },
  AI_THERAPY_SESSION: {
    activity: 'ai_therapy',
    bytes: 8,
    dailyLimit: 1,
    weeklyLimit: 1,
    description: 'Complete AI therapy chat session (once per week)'
  }
} as const;

// Add type for weekly limits
export type ByteEarningActivity = {
  activity: string;
  bytes: number;
  dailyLimit?: number;
  weeklyLimit?: number;
  description: string;
};

// =====================================
// STREAK BONUSES
// =====================================

export const STREAK_BONUSES = {
  RITUAL_7_DAY: {
    days: 7,
    bytes: 25,
    badge: 'ritual_apprentice',
    description: '7-day ritual streak bonus'
  },
  RITUAL_14_DAY: {
    days: 14,
    bytes: 60,
    badge: 'protocol_disciple', 
    description: '14-day ritual streak bonus'
  },
  RITUAL_30_DAY: {
    days: 30,
    bytes: 150,
    badge: 'firewall_zealot',
    description: '30-day ritual streak bonus'
  },
  RITUAL_60_DAY: {
    days: 60,
    bytes: 300,
    badge: 'glitch_prophet',
    description: '60-day ritual streak bonus'
  },
  RITUAL_90_DAY: {
    days: 90,
    bytes: 500,
    badge: 'cult_leader',
    description: '90-day ritual streak bonus'
  }
} as const;

// =====================================
// SURPRISE BONUSES
// =====================================

export const GLITCH_BONUSES = {
  SMALL: { min: 10, max: 25, weight: 70 },
  MEDIUM: { min: 25, max: 50, weight: 25 },
  LARGE: { min: 50, max: 100, weight: 5 }
} as const;

// =====================================
// PRODUCT CATALOG
// =====================================

export const SHOP_PRODUCTS = {
  // === CTRL+ALT+BLOCK™ FINAL 7 PRODUCTS ===
  
  // 1. FREE WORKBOOK (Instant for Firewall, 1 week for Ghost)
  WORKBOOK: {
    id: 'workbook_ctrlaltblock',
    name: 'CTRL+ALT+BLOCK Workbook',
    shortName: 'Workbook',
    description: 'Your starter kit for heartbreak survival. Firewall users get it now, Ghosts unlock it after 1 week of streaks. This is your first tool for closure.',
    category: 'digital',
    type: 'workbook',
    bytePrice: 0, // FREE
    isDigital: true,
    requiresShipping: false,
    unlockRequirement: 'firewall_immediate_or_ghost_7_days',
    printifyProductId: null,
    variants: null,
    digitalContent: '/workbook/ctrl-alt-block-workbook',
    tags: ['starter', 'healing', 'workbook', 'free'],
    images: ['/products/workbook-cover.jpg'],
    imageUrl: '/products/workbook-cover.jpg',
    timeToEarn: 'Instant (Firewall) / 1 week (Ghost)',
    userPerception: 'Your starter kit for healing.',
    heroTagline: 'Free. Essential. Yours.',
    isHero: false
  },

  // 2. AUDIOBOOK (900 bytes, ~1 month)
  AUDIOBOOK: {
    id: 'audiobook_worst_boyfriends',
    name: 'The Worst Boyfriends Ever (Audiobook)',
    shortName: 'Audiobook',
    description: 'The chaos, the cringe, the comedy — in your earbuds. Laugh, wince, and heal on the go. One month of healing unlocks the messiest love stories ever told.',
    category: 'digital',
    type: 'audiobook',
    bytePrice: 900,
    isDigital: true,
    requiresShipping: false,
    printifyProductId: null,
    variants: null,
    digitalContent: '/audiobook/worst-boyfriends-ever',
    tags: ['chaos', 'comedy', 'healing', 'audiobook'],
  images: ['/shop/audiobook.png'],
  imageUrl: '/shop/audiobook.png',
    timeToEarn: '~1 month',
    userPerception: 'The chaos in your earbuds.',
    heroTagline: '900 Bytes. Pure Chaos. Total Healing.',
    isHero: false
  },

  // 3. SIGNED AUTHOR COPY (3000 bytes, ~3 months)
  SIGNED_PAPERBACK: {
    id: 'signed_worst_boyfriends',
    name: 'The Worst Boyfriends Ever (Signed Author Copy)',
    shortName: 'Signed Author Copy',
    description: 'A book that lived it all — signed, with a personal note just for you. Your heartbreak trophy, shipped worldwide. This isn\'t merch, it\'s a milestone.',
    category: 'physical',
    type: 'signed_book',
    bytePrice: 3000,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: null,
    variants: null,
    digitalContent: null,
    tags: ['signed', 'milestone', 'trophy', 'personal'],
  images: ['/shop/signed copy.png'],
  imageUrl: '/shop/signed copy.png',
    timeToEarn: '~3 months',
    userPerception: 'Personal note, signed just for you.',
    heroTagline: '3000 Bytes. One Signature. Your Milestone.',
    isHero: false,
    features: ['Personally signed by author', 'Personal note included', 'Worldwide shipping', 'Heartbreak trophy', 'Limited edition']
  },

  // 4. CHILL WINE TUMBLER (4000 bytes, ~4 months)
  CHILL_WINE_TUMBLER: {
    id: 'tumbler_chill_block',
    name: 'CTRL+ALT+BLOCK Chill Wine Tumbler',
    shortName: 'Wine Tumbler',
    description: 'Cold sip, calm nervous system. A relapse-text shield disguised as a sleek insulated vessel — earn comfort, don\'t impulse buy it.',
    category: 'physical',
    type: 'tumbler',
    bytePrice: 4000,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'tumbler_001',
    variants: JSON.stringify([{ color: 'white', size: '12oz' }]),
    digitalContent: null,
    tags: ['ritual', 'cooling', 'calm', 'earned'],
    images: ['/shop/chill wine tumbler.jpg'],
    imageUrl: '/shop/chill wine tumbler.jpg',
    timeToEarn: '~4 months',
    userPerception: 'Your regulated sip ritual.',
    heroTagline: '4000 Bytes. One Sip. Nervous System Reset.',
    isHero: false,
    features: ['Double-wall insulated', 'Keeps drinks cold', 'Earned calm ritual', 'Matte finish', 'Relapse-text shield']
  },

  // 5. PHONE CASE (5000 bytes, ~5 months)
  PHONE_CASE: {
    id: 'phone_case_ctrlaltblock',
    name: 'CTRL+ALT+BLOCK Phone Case',
    shortName: 'Phone Case',
    description: 'CTRL+ALT+BLOCK in your pocket. A shield against late-night relapse texts and a reminder that you\'re stronger than the urge to reach out.',
    category: 'physical',
    type: 'phone_case',
    bytePrice: 5000,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'phone_case_001',
    variants: JSON.stringify([
      { device: 'iPhone 15', sizes: ['Standard', 'Plus', 'Pro', 'Pro Max'] },
      { device: 'iPhone 14', sizes: ['Standard', 'Plus', 'Pro', 'Pro Max'] },
      { device: 'Samsung Galaxy S24', sizes: ['Standard', 'Plus', 'Ultra'] }
    ]),
    digitalContent: null,
    tags: ['shield', 'protection', 'pocket', 'reminder'],
  images: ['/shop/phone case.jpg'],
  imageUrl: '/shop/phone case.jpg',
    timeToEarn: '~5 months',
    userPerception: 'CTRL+ALT+BLOCK in your pocket.',
    heroTagline: '5000 Bytes. One Shield. Pocket Protection.',
    isHero: false,
    features: ['Shock-absorbing protection', 'Anti-relapse reminder', 'Multiple device options', 'Durable design', 'Daily strength boost']
  },

  // 6. HOODIE (8000 bytes, ~8 months)
  HOODIE: {
    id: 'hoodie_wear_healing',
    name: 'CTRL+ALT+BLOCK Healing Hoodie',
    shortName: 'Hoodie',
    description: 'Wear your healing. Every streak, every ritual, every night you didn\'t text your ex — stitched into a hoodie you earned, not bought.',
    category: 'physical',
    type: 'hoodie',
    bytePrice: 8000,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'hoodie_healing_001',
    variants: JSON.stringify([
      { color: 'black', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { color: 'gray', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { color: 'navy', sizes: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]),
    digitalContent: null,
    tags: ['earned', 'healing', 'wearable', 'strength'],
  images: ['/shop/hoodie.png'],
  imageUrl: '/shop/hoodie.png',
    timeToEarn: '~8 months',
    userPerception: 'Wear your healing.',
    heroTagline: '8000 Bytes. Earned Comfort. Worn Strength.',
    isHero: false,
    features: ['Premium cotton blend', 'Earned, not bought', 'Symbol of strength', 'Comfortable fit', 'Healing reminder']
  },

  // 7. BLANKET (10,000 bytes, ~10 months) - HERO PRODUCT
  BLANKET: {
    id: 'blanket_cocoon_closure',
    name: 'The Ultimate Cocoon of Closure',
    shortName: 'Blanket',
    description: 'The ultimate cocoon of closure. Wrap yourself in the proof you made it through. Legendary status unlocked: you survived, you thrived, you\'re done.',
    category: 'physical',
    type: 'blanket',
    bytePrice: 10000,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'blanket_cocoon_001',
    variants: JSON.stringify([{ size: '60x80', material: 'premium_fleece' }]),
    digitalContent: null,
    tags: ['legendary', 'cocoon', 'closure', 'ultimate', 'graduation'],
  images: ['/shop/cocoon blanket.jpg'],
  imageUrl: '/shop/cocoon blanket.jpg',
    timeToEarn: '~10 months',
    userPerception: 'The ultimate cocoon of closure.',
    heroTagline: '10,000 Bytes. One Cocoon. Total Closure.',
    isHero: true, // HERO PRODUCT - always highlighted
    isLegendary: true,
    features: ['Legendary status reward', 'Premium fleece material', 'Symbol of completion', 'Ultimate comfort', 'Proof you made it']
  }

} as const;

// =====================================
// PRICING TIERS
// =====================================

export const BYTE_TO_DOLLAR_RATE = 100; // 100 Bytes = $1

export const REWARD_TIERS = {
  STARTER: {
    timeframe: 'Instant / 1 week',
    products: ['WORKBOOK'],
    description: 'Essential healing starter kit'
  },
  DIGITAL_HEALING: {
    timeframe: '1 month',
    products: ['AUDIOBOOK'],
    description: 'Comedy and chaos for healing'
  },
  FIRST_PHYSICAL: {
    timeframe: '3 months', 
    products: ['SIGNED_PAPERBACK'],
    description: 'Your first heartbreak trophy'
  },
  RITUAL_OBJECTS: {
    timeframe: '4-5 months',
  products: ['CHILL_WINE_TUMBLER', 'PHONE_CASE'],
    description: 'Tools for daily healing'
  },
  EARNED_COMFORT: {
    timeframe: '8 months',
    products: ['HOODIE'],
    description: 'Wearable proof of strength'
  },
  LEGENDARY: {
    timeframe: '10 months',
    products: ['BLANKET'],
    description: 'Ultimate graduation reward'
  }
} as const;

// =====================================
// BADGE DEFINITIONS
// =====================================

export const STREAK_BADGES = {
  ritual_apprentice: {
    id: 'ritual_apprentice',
    name: 'Ritual Apprentice',
    description: 'You showed up for a full week. Initiation complete.',
    icon: '🕯️',
    requirement: '7-day ritual streak',
    rarity: 'common'
  },
  protocol_disciple: {
    id: 'protocol_disciple', 
    name: 'Protocol Disciple',
    description: 'Two weeks in and still resisting the relapse.',
    icon: '💔⚡',
    requirement: '14-day ritual streak',
    rarity: 'uncommon'
  },
  firewall_zealot: {
    id: 'firewall_zealot',
    name: 'Firewall Zealot',
    description: 'One month strong. Your ex is officially obsolete.',
    icon: '🛡️✨',
    requirement: '30-day ritual streak',
    rarity: 'rare'
  },
  glitch_prophet: {
    id: 'glitch_prophet',
    name: 'Glitch Prophet',
    description: 'Two months of rituals. You now speak in errors and wisdom.',
    icon: '👑💫',
    requirement: '60-day ritual streak',
    rarity: 'epic'
  },
  cult_leader: {
    id: 'cult_leader',
    name: 'Cult Leader',
    description: 'Three months consistent. You don\'t just follow the Protocol — you are the Protocol.',
    icon: '🎭🔮',
    requirement: '90-day ritual streak',
    rarity: 'legendary'
  }
} as const;

// Helper functions
export const calculateDailyBytesPotential = () => {
  const activities = Object.values(BYTE_EARNING_ACTIVITIES);
  return activities.reduce((total, activity) => {
    return total + (activity.bytes * (activity.dailyLimit || 1));
  }, 0);
};

export const calculateMonthlyBytesPotential = () => {
  return calculateDailyBytesPotential() * 30;
};

export const getProductsByTier = (tierKey: keyof typeof REWARD_TIERS) => {
  const tier = REWARD_TIERS[tierKey];
  return tier.products.map(productKey => SHOP_PRODUCTS[productKey as keyof typeof SHOP_PRODUCTS]);
};

export const formatBytes = (bytes: number): string => {
  return `${bytes.toLocaleString()} Bytes`;
};

export const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

// Daily potential: ~35 Bytes
// Monthly potential: ~1,000 Bytes
console.log('📊 Byte Economy Summary:');
console.log(`Daily potential: ${calculateDailyBytesPotential()} Bytes`);
console.log(`Monthly potential: ${calculateMonthlyBytesPotential()} Bytes`);
