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
  // Digital Products
  AUDIOBOOK: {
    id: 'audiobook_worst_boyfriends',
    name: 'The Worst Boyfriends Ever (Audiobook)',
    description: 'Full audiobook narrated by the author. Stream instantly after purchase.',
    category: 'digital',
    type: 'audiobook',
    bytePrice: 300,
    cashPrice: 299, // $2.99
    isDigital: true,
    requiresShipping: false,
    printifyProductId: null,
    variants: null,
    digitalContent: '/audiobook/worst-boyfriends-ever',
    tags: ['healing', 'humor', 'audiobook', 'instant'],
    images: ['/products/audiobook-cover.jpg']
  },
  
  WORKBOOK: {
    id: 'workbook_ctrlaltblock',
    name: 'CTRL+ALT+BLOCK Workbook (Digital)',
    description: 'Interactive healing workbook with exercises and prompts. Instant download.',
    category: 'digital', 
    type: 'ebook',
    bytePrice: null, // Tier-based unlock
    cashPrice: 1999, // $19.99
    isDigital: true,
    requiresShipping: false,
    printifyProductId: null,
    variants: null,
    digitalContent: '/workbook/ctrl-alt-block-workbook',
    tags: ['workbook', 'exercises', 'healing', 'pdf'],
    images: ['/products/workbook-cover.jpg']
  },
  
  // Physical Products - Mugs
  MUG_WHITE_SELF_CARE: {
    id: 'mug_white_self_care',
    name: 'Sipping on Self-Care Mug (White)',
    description: 'White ceramic mug with "Sipping on Self-Care" text. 11oz.',
    category: 'physical',
    type: 'mug',
    bytePrice: 1000,
    cashPrice: 1599, // $15.99
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'mug_white_001',
    variants: JSON.stringify([{ color: 'white', size: '11oz' }]),
    digitalContent: null,
    tags: ['mug', 'self-care', 'white', 'ceramic'],
    images: ['/products/mug-white-self-care.jpg']
  },
  
  MUG_BLACK_HEALING: {
    id: 'mug_black_healing',
    name: 'Healing One Sip at a Time Mug (Black)',
    description: 'Black ceramic mug with "Healing One Sip at a Time" text. 11oz.',
    category: 'physical',
    type: 'mug',
    bytePrice: 1000,
    cashPrice: 1599,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'mug_black_001',
    variants: JSON.stringify([{ color: 'black', size: '11oz' }]),
    digitalContent: null,
    tags: ['mug', 'healing', 'black', 'ceramic'],
    images: ['/products/mug-black-healing.jpg']
  },
  
  MUG_BLUE_BYTE: {
    id: 'mug_blue_byte',
    name: 'Byte by Byte Healing Mug (Blue)',
    description: 'Blue ceramic mug with "Byte by Byte Healing" text. 11oz.',
    category: 'physical',
    type: 'mug',
    bytePrice: 1000,
    cashPrice: 1599,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'mug_blue_001',
    variants: JSON.stringify([{ color: 'blue', size: '11oz' }]),
    digitalContent: null,
    tags: ['mug', 'byte', 'blue', 'ceramic', 'tech'],
    images: ['/products/mug-blue-byte.jpg']
  },
  
  // Signed Books
  SIGNED_PAPERBACK: {
    id: 'signed_worst_boyfriends',
    name: 'The Worst Boyfriends Ever (Signed Paperback)',
    description: 'Personally signed author copy. Limited edition collectible.',
    category: 'physical',
    type: 'signed_book',
    bytePrice: 2500,
    cashPrice: 2999, // $29.99
    isDigital: false,
    requiresShipping: true,
    printifyProductId: null,
    variants: null,
    digitalContent: null,
    tags: ['signed', 'collectible', 'book', 'author', 'limited'],
    images: ['/products/signed-book.jpg']
  },
  
  // Blankets
  BLANKET_BREAKUP_BUNKER: {
    id: 'blanket_breakup_bunker',
    name: 'Breakup Bunker Blanket',
    description: 'Ultra-soft fleece blanket perfect for emotional recovery. 50"x60".',
    category: 'physical',
    type: 'blanket',
    bytePrice: 5000,
    cashPrice: 4999, // $49.99
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'blanket_001',
    variants: JSON.stringify([{ size: '50x60', material: 'fleece' }]),
    digitalContent: null,
    tags: ['blanket', 'comfort', 'fleece', 'breakup', 'cozy'],
    images: ['/products/blanket-bunker.jpg']
  },
  
  BLANKET_CRY_PROOF: {
    id: 'blanket_cry_proof',
    name: 'Cry-Proof Comfort Cloak',
    description: 'Premium comfort blanket for those tough healing days. 50"x60".',
    category: 'physical',
    type: 'blanket',
    bytePrice: 5000,
    cashPrice: 4999,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'blanket_002',
    variants: JSON.stringify([{ size: '50x60', material: 'fleece' }]),
    digitalContent: null,
    tags: ['blanket', 'comfort', 'fleece', 'healing', 'premium'],
    images: ['/products/blanket-cry-proof.jpg']
  },
  
  // Hoodies
  HOODIE_GHOSTED: {
    id: 'hoodie_got_ghosted',
    name: 'Got Ghosted, Got This Hoodie',
    description: 'Premium hoodie for survivors. Available in multiple colors and sizes.',
    category: 'physical',
    type: 'hoodie',
    bytePrice: 8000,
    cashPrice: 5999, // $59.99
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'hoodie_001',
    variants: JSON.stringify([
      { color: 'white', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { color: 'black', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { color: 'gray', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { color: 'blue', sizes: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]),
    digitalContent: null,
    tags: ['hoodie', 'ghosted', 'survivor', 'premium', 'multiple-colors'],
    images: ['/products/hoodie-ghosted-white.jpg', '/products/hoodie-ghosted-black.jpg']
  },
  
  HOODIE_CTRL_ALT_RECOVER: {
    id: 'hoodie_ctrl_alt_recover',
    name: 'Ctrl+Alt+Recover Hoodie',
    description: 'Ultimate recovery hoodie for the healing tech generation.',
    category: 'physical',
    type: 'hoodie',
    bytePrice: 8000,
    cashPrice: 5999,
    isDigital: false,
    requiresShipping: true,
    printifyProductId: 'hoodie_002',
    variants: JSON.stringify([
      { color: 'white', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { color: 'black', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { color: 'gray', sizes: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]),
    digitalContent: null,
    tags: ['hoodie', 'tech', 'recover', 'premium', 'ultimate'],
    images: ['/products/hoodie-recover-white.jpg', '/products/hoodie-recover-black.jpg']
  }
} as const;

// =====================================
// PRICING TIERS
// =====================================

export const BYTE_TO_DOLLAR_RATE = 100; // 100 Bytes = $1

export const REWARD_TIERS = {
  QUICK_WIN: {
    timeframe: '1-2 weeks',
    products: ['AUDIOBOOK'],
    description: 'Early motivation rewards'
  },
  MONTHLY: {
    timeframe: '1 month',
    products: ['MUG_WHITE_SELF_CARE', 'MUG_BLACK_HEALING', 'MUG_BLUE_BYTE'],
    description: 'First tangible milestone'
  },
  COLLECTOR: {
    timeframe: '2-3 months', 
    products: ['SIGNED_PAPERBACK'],
    description: 'Collectible tier'
  },
  PREMIUM: {
    timeframe: '5 months',
    products: ['BLANKET_BREAKUP_BUNKER', 'BLANKET_CRY_PROOF'],
    description: 'Premium comfort items'
  },
  ULTIMATE: {
    timeframe: '8+ months',
    products: ['HOODIE_GHOSTED', 'HOODIE_CTRL_ALT_RECOVER'],
    description: 'Ultimate prestige rewards'
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
