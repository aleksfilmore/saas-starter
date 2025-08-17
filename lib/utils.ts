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

/**
 * Safely copy text to clipboard with fallback
 * @param text - The text to copy
 * @param fallbackMessage - Optional custom fallback message
 * @returns Promise that resolves to success boolean
 */
export async function safeClipboardCopy(text: string, fallbackMessage?: string): Promise<boolean> {
  try {
    // Check if clipboard API is available and has permissions
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback: show text to user for manual copying
      const message = fallbackMessage || `Please copy this manually: ${text}`;
      alert(message);
      return false;
    }
  } catch (error) {
    console.warn('Clipboard copy failed:', error);
    // Fallback: show text to user for manual copying
    const message = fallbackMessage || `Please copy this manually: ${text}`;
    alert(message);
    return false;
  }
}
