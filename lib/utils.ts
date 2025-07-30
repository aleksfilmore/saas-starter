import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "lucia"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses a user ID from Lucia auth to an integer for database operations
 * @param user - The user object from Lucia auth
 * @returns The user ID as a number, or throws an error if invalid
 */
export function parseUserId(user: User): number {
  if (!user || !user.id) {
    throw new Error('User ID is required');
  }
  
  const parsed = parseInt(user.id, 10);
  
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid user ID: ${user.id} could not be parsed to a valid integer`);
  }
  
  return parsed;
}
