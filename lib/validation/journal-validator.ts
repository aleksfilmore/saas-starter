/**
 * Journal Entry Validation
 * Validates journal entries for ritual completion
 */

export interface JournalValidationResult {
  isValid: boolean;
  errors: string[];
  wordCount: number;
  characterCount: number;
}

export interface JournalEntry {
  text: string;
  userId: string;
  timingSeconds: number;
}

/**
 * Validates a journal entry for ritual completion
 */
export function validateJournalEntry(
  entry: JournalEntry,
  lastEntry?: string | null
): JournalValidationResult {
  const errors: string[] = [];
  const text = entry.text;
  
  // Word count validation (minimum 10 words)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  if (wordCount < 10) {
    errors.push('Journal entry must be at least 10 words long');
  }
  
  // Character count validation (minimum 50 characters)
  const characterCount = text.trim().length;
  
  if (characterCount < 50) {
    errors.push('Journal entry must be at least 50 characters long');
  }
  
  // Maximum length validation (2000 characters)
  if (characterCount > 2000) {
    errors.push('Journal entry cannot exceed 2000 characters');
  }
  
  // Check for duplicate content if lastEntry is provided
  if (lastEntry && text.trim() === lastEntry.trim()) {
    errors.push('Journal entry cannot be identical to your previous entry');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    wordCount,
    characterCount
  };
}

/**
 * Rate limiting check for journal entries
 */
export function checkRateLimit(userId: string): boolean {
  // Simple rate limiting logic - could be enhanced with actual storage
  return true;
}

/**
 * Validates language content quality
 */
export function validateLanguageContent(text: string): boolean {
  // Basic language content validation
  // Check for minimum meaningful content
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  
  // Must have at least 10 words
  if (words.length < 10) {
    return false;
  }
  
  // Check for excessive repetition (more than 50% repeated words)
  const uniqueWords = new Set(words.map(word => word.toLowerCase()));
  const repetitionRatio = uniqueWords.size / words.length;
  
  if (repetitionRatio < 0.5) {
    return false;
  }
  
  return true;
}

/**
 * Quick validation for minimum requirements
 */
export function isValidJournalEntry(entry: string): boolean {
  return validateJournalEntry({ text: entry, userId: '', timingSeconds: 0 }).isValid;
}