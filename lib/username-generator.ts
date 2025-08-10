// Server-side username generation utility
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';

const adjectives = [
  'anonymous', 'brave', 'calm', 'digital', 'evolved', 'free', 'guarded', 'hidden',
  'improved', 'just', 'kind', 'liberated', 'motivated', 'new', 'optimized', 'protected',
  'quiet', 'renewed', 'strong', 'transformed', 'upgraded', 'valued', 'wise', 'zen',
  'bright', 'clever', 'gentle', 'noble', 'pure', 'swift', 'fierce', 'bold',
  'serene', 'vibrant', 'peaceful', 'radiant', 'mindful', 'steady', 'clear', 'whole',
  'cosmic', 'lunar', 'solar', 'mystic', 'wild', 'epic', 'sage', 'royal'
];

const nouns = [
  'seeker', 'warrior', 'guardian', 'builder', 'healer', 'survivor', 'dreamer', 'fighter',
  'creator', 'explorer', 'phoenix', 'wanderer', 'architect', 'sage', 'champion', 'voyager',
  'pioneer', 'mystic', 'rebel', 'knight', 'scholar', 'artist', 'runner', 'climber',
  'soul', 'heart', 'mind', 'spirit', 'river', 'mountain', 'star', 'ocean',
  'forest', 'dawn', 'moon', 'sun', 'breeze', 'flame', 'spark', 'path',
  'journey', 'light', 'hope', 'dream', 'vision', 'voice', 'strength', 'dancer'
];

const numbers = ['01', '02', '03', '07', '11', '13', '21', '42', '99'];

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
