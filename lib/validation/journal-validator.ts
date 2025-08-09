/**
 * CTRL+ALT+BLOCK™ v1.1 - Journal Validation System
 * Implements specification-compliant journaling gate per section 6
 */

export interface JournalValidationResult {
  isValid: boolean;
  errors: string[];
  metrics: {
    charCount: number;
    wordCount: number;
    sentenceCount: number;
    uniqueCharRatio: number;
    timingSeconds: number;
    similarity?: number;
  };
}

export interface JournalEntry {
  text: string;
  userId: string;
  timingSeconds: number;
  timestamp?: Date;
}

/**
 * Calculate unique character ratio (spec: ≥0.6)
 */
function calculateUniqueCharRatio(text: string): number {
  const cleanText = text.toLowerCase().replace(/\s+/g, '');
  if (cleanText.length === 0) return 0;
  
  const uniqueChars = new Set(cleanText).size;
  return uniqueChars / cleanText.length;
}

/**
 * Count sentences using multiple delimiters
 */
function countSentences(text: string): number {
  const sentences = text
    .trim()
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0);
  return sentences.length;
}

/**
 * Calculate cosine similarity between two texts (spec: <0.9)
 */
function calculateCosineSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 0);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 0);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  // Create frequency vectors
  const allWords = [...new Set([...words1, ...words2])];
  const vector1 = allWords.map(word => words1.filter(w => w === word).length);
  const vector2 = allWords.map(word => words2.filter(w => w === word).length);
  
  // Calculate cosine similarity
  const dotProduct = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, a) => sum + a * a, 0));
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Validate journal entry against CTRL+ALT+BLOCK™ v1.1 specification
 */
export async function validateJournalEntry(
  entry: JournalEntry,
  lastEntry?: string
): Promise<JournalValidationResult> {
  const errors: string[] = [];
  const text = entry.text.trim();
  
  // Basic metrics
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const sentenceCount = countSentences(text);
  const uniqueCharRatio = calculateUniqueCharRatio(text);
  
  // Spec validation: ≥120 chars OR ≥2 sentences
  const hasMinChars = charCount >= 120;
  const hasMinSentences = sentenceCount >= 2;
  
  if (!hasMinChars && !hasMinSentences) {
    errors.push('Entry must be at least 120 characters OR contain 2+ complete sentences');
  }
  
  // Spec validation: ≥45s active typing
  if (entry.timingSeconds < 45) {
    errors.push(`Please spend at least 45 seconds writing (current: ${entry.timingSeconds}s)`);
  }
  
  // Spec validation: unique_char_ratio ≥0.6
  if (uniqueCharRatio < 0.6) {
    errors.push('Entry appears repetitive - please write more varied content');
  }
  
  // Spec validation: cosine similarity <0.9 vs last entry
  let similarity: number | undefined;
  if (lastEntry && lastEntry.trim().length > 0) {
    similarity = calculateCosineSimilarity(text, lastEntry);
    if (similarity >= 0.9) {
      errors.push('Entry too similar to previous journal - please write something new');
    }
  }
  
  // Check for obvious spam patterns
  if (text.length > 0) {
    const repeatedChar = /(.)\1{10,}/.test(text);
    const allSameWord = /^(\w+\s*)\1{5,}$/.test(text);
    
    if (repeatedChar || allSameWord) {
      errors.push('Entry appears to contain spam or repeated characters');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    metrics: {
      charCount,
      wordCount,
      sentenceCount,
      uniqueCharRatio,
      timingSeconds: entry.timingSeconds,
      similarity
    }
  };
}

/**
 * Check rate limiting: ≤2 completes/10 min (spec requirement)
 */
export function checkRateLimit(userCompletions: Date[]): boolean {
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  
  const recentCompletions = userCompletions.filter(
    completion => completion > tenMinutesAgo
  );
  
  return recentCompletions.length < 2;
}

/**
 * Language and stopword validation for anti-gaming
 */
export function validateLanguageContent(text: string): boolean {
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  // Must have some recognizable English words
  const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'out', 'say', 'she', 'use', 'what', 'will', 'with', 'feel', 'like', 'time', 'just', 'know', 'think', 'want', 'when', 'about', 'after', 'before', 'being', 'could', 'feeling', 'going', 'looking', 'maybe', 'people', 'really', 'right', 'should', 'still', 'there', 'things', 'today', 'where', 'would', 'relationship', 'breakup', 'emotion', 'thought'];
  
  const recognizedWords = words.filter(word => 
    commonWords.includes(word) || word.length >= 4
  );
  
  // At least 30% should be recognizable words
  return recognizedWords.length / Math.max(words.length, 1) >= 0.3;
}
