// Server-side username generation utility
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema'; // Use main schema
import { eq } from 'drizzle-orm';

const adjectives = [
  'anonymous', 'brave', 'calm', 'digital', 'evolved', 'free', 'guarded', 'hidden',
  'improved', 'just', 'kind', 'liberated', 'motivated', 'new', 'optimized', 'protected',
  'quiet', 'renewed', 'strong', 'transformed', 'upgraded', 'valued', 'wise', 'zen',
  'bright', 'clever', 'gentle', 'noble', 'pure', 'swift', 'fierce', 'bold',
  'serene', 'vibrant', 'peaceful', 'radiant', 'mindful', 'steady', 'clear', 'whole',
  'cosmic', 'lunar', 'solar', 'mystic', 'wild', 'epic', 'sage', 'royal',
  'ancient', 'modern', 'future', 'quantum', 'neural', 'cyber', 'neon', 'crystal',
  'steel', 'golden', 'silver', 'diamond', 'emerald', 'ruby', 'sapphire', 'jade',
  'electric', 'magnetic', 'atomic', 'stellar', 'galactic', 'infinite', 'eternal', 'prime',
  'shadow', 'crimson', 'azure', 'violet', 'amber', 'ivory', 'obsidian', 'platinum',
  'titanium', 'carbon', 'phoenix', 'storm', 'frost', 'flame', 'wind', 'earth',
  'water', 'fire', 'void', 'light', 'dark', 'gray', 'silent', 'swift',
  'rapid', 'fluid', 'solid', 'vapor', 'plasma', 'energy', 'matrix', 'vector',
  'binary', 'hex', 'alpha', 'beta', 'gamma', 'delta', 'omega', 'sigma'
];

const nouns = [
  'seeker', 'warrior', 'guardian', 'builder', 'healer', 'survivor', 'dreamer', 'fighter',
  'creator', 'explorer', 'phoenix', 'wanderer', 'architect', 'sage', 'champion', 'voyager',
  'pioneer', 'mystic', 'rebel', 'knight', 'scholar', 'artist', 'runner', 'climber',
  'soul', 'heart', 'mind', 'spirit', 'river', 'mountain', 'star', 'ocean',
  'forest', 'dawn', 'moon', 'sun', 'breeze', 'flame', 'spark', 'path',
  'journey', 'light', 'hope', 'dream', 'vision', 'voice', 'strength', 'dancer',
  'coder', 'hacker', 'ninja', 'wizard', 'mage', 'sorcerer', 'witch', 'shaman',
  'monk', 'priest', 'paladin', 'rogue', 'ranger', 'archer', 'hunter', 'tracker',
  'scout', 'pilot', 'captain', 'admiral', 'general', 'marshal', 'commander', 'leader',
  'chief', 'master', 'guru', 'sensei', 'teacher', 'student', 'learner', 'pupil',
  'ghost', 'phantom', 'specter', 'wraith', 'demon', 'angel', 'deity', 'god',
  'titan', 'giant', 'dwarf', 'elf', 'fairy', 'sprite', 'pixie', 'dragon',
  'tiger', 'lion', 'wolf', 'bear', 'eagle', 'hawk', 'raven', 'dove',
  'snake', 'spider', 'scorpion', 'shark', 'whale', 'dolphin', 'fox', 'rabbit',
  'cipher', 'code', 'algorithm', 'program', 'script', 'function', 'method', 'class',
  'object', 'array', 'string', 'boolean', 'integer', 'float', 'double', 'byte'
];

const numbers = [
  '01', '02', '03', '07', '11', '13', '17', '19', '21', '23', '29', '31', '37', '41', '43', '47',
  '53', '59', '61', '67', '71', '73', '79', '83', '89', '97', '42', '99', '88', '77', '66', '55',
  '44', '33', '22', '00', '10', '20', '30', '40', '50', '60', '70', '80', '90', '12', '34', '56',
  '78', '91', '92', '93', '94', '95', '96', '97', '98', '87', '76', '65', '54', '43', '32', '21'
];

/**
 * Check if a username is available in the database
 */
async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const existingUser = await db.select({ username: users.username })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return existingUser.length === 0;
  } catch (error) {
    console.error('Error checking username availability:', error);
    // If database check fails, assume username is taken to be safe
    return false;
  }
}

/**
 * Generate a unique username using the same algorithm as the frontend
 */
export async function generateUniqueUsername(): Promise<string> {
  let attempts = 0;
  let newUsername = '';
  let isAvailable = false;

  console.log('🔧 Starting server-side unique username generation...');

  // Try up to 20 times to generate a unique username
  while (!isAvailable && attempts < 20) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    let number;
    if (attempts < 5) {
      // First 5 attempts: use predefined numbers
      number = numbers[Math.floor(Math.random() * numbers.length)];
    } else if (attempts < 10) {
      // Next 5 attempts: random 2-digit numbers
      number = String(Math.floor(Math.random() * 90) + 10);
    } else if (attempts < 15) {
      // Next 5 attempts: random 3-digit numbers
      number = String(Math.floor(Math.random() * 900) + 100);
    } else {
      // Last 5 attempts: timestamp-based for uniqueness
      number = Date.now().toString().slice(-4);
    }
    
    newUsername = `${adjective}_${noun}_${number}`;
    console.log(`🔧 Attempt ${attempts + 1}: Trying "${newUsername}"`);
    
    try {
      isAvailable = await checkUsernameAvailability(newUsername);
      console.log(`🔧 Username "${newUsername}" available: ${isAvailable}`);
    } catch (error) {
      console.error(`🔧 Error checking username "${newUsername}":`, error);
      
      // If API completely fails after 3 attempts, just assume it's available
      if (attempts >= 3) {
        console.log('🔧 Database check failing repeatedly, assuming username is available');
        isAvailable = true;
      } else {
        isAvailable = false;
      }
    }
    
    attempts++;
  }

  if (isAvailable && newUsername) {
    console.log(`🔧 Success! Generated username: "${newUsername}"`);
    return newUsername;
  } else {
    // Fallback: use timestamp-based username
    const fallbackUsername = `user_${Date.now()}`;
    console.log(`🔧 Fallback username generated: "${fallbackUsername}"`);
    return fallbackUsername;
  }
}
