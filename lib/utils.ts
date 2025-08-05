import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "lucia"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique ID for database records
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Safely extracts a user ID from Lucia auth for database operations
 * @param user - The user object from Lucia auth
 * @returns The user ID as a string
 */
export function getUserId(user: User): string {
  if (!user || !user.id) {
    throw new Error('User ID is required');
  }
  
  // Log the user object for debugging
  console.log('getUserId: Input user object:', { 
    id: user.id, 
    type: typeof user.id
  });
  
  // User IDs are now text/UUID strings, so we just validate and return
  if (typeof user.id !== 'string' || user.id.trim() === '') {
    throw new Error(`Invalid user ID: ${user.id} must be a non-empty string`);
  }
  
  return user.id;
}
