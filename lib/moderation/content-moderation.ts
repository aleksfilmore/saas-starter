import { db } from '@/lib/db';
import { anonymousPosts, moderationQueue, moderationLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export interface ModerationResult {
  isAllowed: boolean;
  flagReason?: string;
  severity: 'low' | 'medium' | 'high';
  requiresReview: boolean;
  suggestedAction: 'approve' | 'flag' | 'reject' | 'edit';
  detectedIssues: string[];
}

// Comprehensive profanity filter - clinical terms for mental health context
const PROFANITY_FILTER = [
  // Strong profanity
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'prick', 'dick', 'pussy', 'cock', 'whore', 'slut',
  // Moderate profanity 
  'damn', 'hell', 'ass', 'piss', 'crap', 'bastard', 'retard', 'gay', 'fag', 'homo',
  // Hate speech
  'nazi', 'hitler', 'terrorist', 'jihad', 'kike', 'nigger', 'chink', 'spic', 'wetback',
  // Extreme violence/self-harm (beyond crisis keywords)
  'murder', 'rape', 'torture', 'bomb', 'explosion', 'violence', 'beating', 'assault'
];

// Personal information patterns
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
  creditCard: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
  address: /\b\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|place|pl)\b/gi,
  zipCode: /\b\d{5}(?:-\d{4})?\b/g,
  realName: /\bmy name is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi,
  location: /\bi live in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
};

// Crisis/self-harm keywords (enhanced from existing)
const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'end my life', 'want to die', 'hurt myself',
  'self harm', 'cutting', 'overdose', 'can\'t go on', 'no point living',
  'hang myself', 'jump off', 'pills', 'razor', 'slit my wrists',
  'better off dead', 'everyone would be better', 'planning to kill',
  'goodbye forever', 'final goodbye', 'won\'t see me again'
];

// Spam/promotion keywords
const SPAM_KEYWORDS = [
  'buy now', 'click here', 'make money', 'work from home', 'free trial',
  'limited time', 'act now', 'guaranteed', 'risk free', 'no strings attached',
  'bitcoin', 'cryptocurrency', 'investment opportunity', 'get rich',
  'viagra', 'cialis', 'weight loss', 'diet pills', 'cash advance'
];

// Inappropriate content for mental health platform
const INAPPROPRIATE_KEYWORDS = [
  'porn', 'xxx', 'adult content', 'escort', 'hookup', 'one night stand',
  'drugs', 'cocaine', 'heroin', 'meth', 'weed dealer', 'buy drugs',
  'illegal weapons', 'gun for sale', 'ammunition', 'explosives'
];

export class ContentModerationService {
  
  /**
   * Main moderation function - checks all aspects of content
   */
  static async moderateContent(content: string, userId?: string): Promise<ModerationResult> {
    const detectedIssues: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'low';
    let requiresReview = false;
    let suggestedAction: 'approve' | 'flag' | 'reject' | 'edit' = 'approve';

    const lowerContent = content.toLowerCase();

    // 1. Check for crisis/self-harm content (highest priority)
    const crisisDetected = this.checkCrisisContent(lowerContent);
    if (crisisDetected.detected) {
      detectedIssues.push('Crisis/self-harm language detected');
      severity = 'high';
      requiresReview = true;
      suggestedAction = 'reject'; // Reject and provide crisis resources
      
      return {
        isAllowed: false,
        flagReason: 'Crisis content requires immediate intervention',
        severity,
        requiresReview,
        suggestedAction,
        detectedIssues
      };
    }

    // 2. Check for personal information
    const piiDetected = this.checkPersonalInformation(content);
    if (piiDetected.detected) {
      detectedIssues.push(...piiDetected.types);
      severity = 'medium';
      requiresReview = true;
      suggestedAction = 'edit'; // Suggest editing to remove PII
    }

    // 3. Check for profanity
    const profanityDetected = this.checkProfanity(lowerContent);
    if (profanityDetected.detected) {
      detectedIssues.push(`Profanity detected: ${profanityDetected.words.join(', ')}`);
      if (profanityDetected.severity === 'high') {
        severity = 'high';
        requiresReview = true;
        suggestedAction = 'reject';
      } else {
        severity = Math.max(severity === 'low' ? 0 : severity === 'medium' ? 1 : 2, 1) === 1 ? 'medium' : 'high';
        requiresReview = true;
        suggestedAction = suggestedAction === 'approve' ? 'flag' : suggestedAction;
      }
    }

    // 4. Check for spam/promotional content
    const spamDetected = this.checkSpamContent(lowerContent);
    if (spamDetected.detected) {
      detectedIssues.push('Promotional/spam content detected');
      severity = Math.max(severity === 'low' ? 0 : severity === 'medium' ? 1 : 2, 1) === 1 ? 'medium' : severity as any;
      requiresReview = true;
      suggestedAction = suggestedAction === 'approve' ? 'flag' : suggestedAction;
    }

    // 5. Check for inappropriate content
    const inappropriateDetected = this.checkInappropriateContent(lowerContent);
    if (inappropriateDetected.detected) {
      detectedIssues.push('Inappropriate content for mental health platform');
      severity = 'high';
      requiresReview = true;
      suggestedAction = 'reject';
    }

    // 6. Check content quality (length, repeated characters, etc.)
    const qualityIssues = this.checkContentQuality(content);
    if (qualityIssues.length > 0) {
      detectedIssues.push(...qualityIssues);
      if (suggestedAction === 'approve') {
        suggestedAction = 'flag';
      }
    }

    // Determine final result
    const isAllowed = !requiresReview || suggestedAction === 'approve' || suggestedAction === 'flag';

    return {
      isAllowed,
      flagReason: detectedIssues.length > 0 ? detectedIssues.join('; ') : undefined,
      severity,
      requiresReview,
      suggestedAction,
      detectedIssues
    };
  }

  /**
   * Check for crisis/self-harm content
   */
  private static checkCrisisContent(content: string): { detected: boolean; keywords: string[] } {
    const detectedKeywords: string[] = [];
    
    for (const keyword of CRISIS_KEYWORDS) {
      if (content.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    }

    return {
      detected: detectedKeywords.length > 0,
      keywords: detectedKeywords
    };
  }

  /**
   * Check for personal information
   */
  private static checkPersonalInformation(content: string): { detected: boolean; types: string[] } {
    const detectedTypes: string[] = [];

    // Check email addresses
    if (PII_PATTERNS.email.test(content)) {
      detectedTypes.push('Email address detected');
    }

    // Check phone numbers
    if (PII_PATTERNS.phone.test(content)) {
      detectedTypes.push('Phone number detected');
    }

    // Check SSN
    if (PII_PATTERNS.ssn.test(content)) {
      detectedTypes.push('Social Security Number detected');
    }

    // Check credit card numbers
    if (PII_PATTERNS.creditCard.test(content)) {
      detectedTypes.push('Credit card number detected');
    }

    // Check physical addresses
    if (PII_PATTERNS.address.test(content)) {
      detectedTypes.push('Physical address detected');
    }

    // Check zip codes
    if (PII_PATTERNS.zipCode.test(content)) {
      detectedTypes.push('Zip code detected');
    }

    // Check for names
    if (PII_PATTERNS.realName.test(content)) {
      detectedTypes.push('Full name detected');
    }

    // Check for location mentions
    if (PII_PATTERNS.location.test(content)) {
      detectedTypes.push('Specific location mentioned');
    }

    return {
      detected: detectedTypes.length > 0,
      types: detectedTypes
    };
  }

  /**
   * Check for profanity
   */
  private static checkProfanity(content: string): { detected: boolean; words: string[]; severity: 'low' | 'high' } {
    const detectedWords: string[] = [];
    const strongProfanity = ['fuck', 'shit', 'cunt', 'nigger', 'fag'];
    
    for (const word of PROFANITY_FILTER) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(content)) {
        detectedWords.push(word);
      }
    }

    const hasStrongProfanity = detectedWords.some(word => strongProfanity.includes(word));

    return {
      detected: detectedWords.length > 0,
      words: detectedWords,
      severity: hasStrongProfanity ? 'high' : 'low'
    };
  }

  /**
   * Check for spam/promotional content
   */
  private static checkSpamContent(content: string): { detected: boolean; keywords: string[] } {
    const detectedKeywords: string[] = [];
    
    for (const keyword of SPAM_KEYWORDS) {
      if (content.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    }

    // Check for repeated URLs or excessive capitalization
    const urlCount = (content.match(/https?:\/\/\S+/g) || []).length;
    const capsPercentage = (content.match(/[A-Z]/g) || []).length / content.length;
    
    if (urlCount > 2) {
      detectedKeywords.push('Multiple URLs detected');
    }
    
    if (capsPercentage > 0.5 && content.length > 20) {
      detectedKeywords.push('Excessive capitalization');
    }

    return {
      detected: detectedKeywords.length > 0,
      keywords: detectedKeywords
    };
  }

  /**
   * Check for inappropriate content
   */
  private static checkInappropriateContent(content: string): { detected: boolean; keywords: string[] } {
    const detectedKeywords: string[] = [];
    
    for (const keyword of INAPPROPRIATE_KEYWORDS) {
      if (content.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    }

    return {
      detected: detectedKeywords.length > 0,
      keywords: detectedKeywords
    };
  }

  /**
   * Check content quality
   */
  private static checkContentQuality(content: string): string[] {
    const issues: string[] = [];

    // Check for excessive repeated characters
    if (/(.)\1{10,}/.test(content)) {
      issues.push('Excessive repeated characters');
    }

    // Check for very short content
    if (content.trim().length < 5) {
      issues.push('Content too short');
    }

    // Check for all caps (if longer than 20 chars and more than 80% caps)
    const capsPercentage = (content.match(/[A-Z]/g) || []).length / content.length;
    if (content.length > 20 && capsPercentage > 0.8) {
      issues.push('Excessive use of capital letters');
    }

    // Check for excessive punctuation
    const punctuationCount = (content.match(/[!?]{3,}/g) || []).length;
    if (punctuationCount > 0) {
      issues.push('Excessive punctuation');
    }

    return issues;
  }

  /**
   * Add post to moderation queue
   */
  private static async addToModerationQueue(postId: string, moderationResult: ModerationResult): Promise<void> {
    try {
      const queueId = crypto.randomUUID();
      
      await db.insert(moderationQueue).values({
        id: queueId,
        postId,
        userId: '', // Will be filled by calling function
        content: '', // Will be filled by calling function
        flagReason: moderationResult.flagReason || 'Content flagged for review',
        severity: moderationResult.severity,
        status: 'pending',
        suggestedAction: moderationResult.suggestedAction,
        detectedIssues: JSON.stringify(moderationResult.detectedIssues),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Log the moderation action
      await db.insert(moderationLogs).values({
        id: crypto.randomUUID(),
        postId,
        action: 'auto_flagged',
        reason: moderationResult.flagReason || 'Auto-moderation flagged content',
        createdAt: new Date()
      });

      console.log(`Post ${postId} flagged for moderation:`, {
        severity: moderationResult.severity,
        reason: moderationResult.flagReason,
        suggestedAction: moderationResult.suggestedAction,
        issues: moderationResult.detectedIssues
      });
    } catch (error) {
      console.error('Failed to add post to moderation queue:', error);
    }
  }

  /**
   * Auto-moderate content and update database
   */
  static async autoModeratePost(postId: string, content: string, userId: string): Promise<void> {
    const moderationResult = await this.moderateContent(content, userId);
    
    if (moderationResult.requiresReview) {
      // Add to moderation queue with proper user and content info
      await this.addToModerationQueueWithDetails(postId, content, userId, moderationResult);
      
      // If severe, deactivate the post immediately
      if (moderationResult.severity === 'high' && moderationResult.suggestedAction === 'reject') {
        await db.update(anonymousPosts)
          .set({ 
            isActive: false,
            updatedAt: new Date()
          })
          .where(eq(anonymousPosts.id, postId));
      }
    }
  }

  /**
   * Add post to moderation queue with full details
   */
  private static async addToModerationQueueWithDetails(
    postId: string, 
    content: string, 
    userId: string, 
    moderationResult: ModerationResult
  ): Promise<void> {
    try {
      const queueId = crypto.randomUUID();
      
      await db.insert(moderationQueue).values({
        id: queueId,
        postId,
        userId,
        content,
        flagReason: moderationResult.flagReason || 'Content flagged for review',
        severity: moderationResult.severity,
        status: 'pending',
        suggestedAction: moderationResult.suggestedAction,
        detectedIssues: JSON.stringify(moderationResult.detectedIssues),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Log the moderation action
      await db.insert(moderationLogs).values({
        id: crypto.randomUUID(),
        postId,
        action: 'auto_flagged',
        reason: moderationResult.flagReason || 'Auto-moderation flagged content',
        createdAt: new Date()
      });

    } catch (error) {
      console.error('Failed to add post to moderation queue:', error);
    }
  }

  /**
   * Approve a flagged post
   */
  static async approvePost(queueId: string, moderatorId: string, notes?: string): Promise<void> {
    try {
      // Update moderation queue
      await db.update(moderationQueue)
        .set({
          status: 'approved',
          moderatorId,
          moderatorNotes: notes,
          moderatedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(moderationQueue.id, queueId));

      // Get the post details for logging
      const queueItem = await db.select()
        .from(moderationQueue)
        .where(eq(moderationQueue.id, queueId))
        .limit(1);

      if (queueItem.length > 0) {
        const item = queueItem[0];
        
        // Reactivate the post if it was deactivated
        await db.update(anonymousPosts)
          .set({ 
            isActive: true,
            updatedAt: new Date()
          })
          .where(eq(anonymousPosts.id, item.postId));

        // Log the approval
        await db.insert(moderationLogs).values({
          id: crypto.randomUUID(),
          postId: item.postId,
          action: 'manual_approved',
          moderatorId,
          reason: notes || 'Post approved by moderator',
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to approve post:', error);
    }
  }

  /**
   * Reject a flagged post
   */
  static async rejectPost(queueId: string, moderatorId: string, reason?: string): Promise<void> {
    try {
      // Update moderation queue
      await db.update(moderationQueue)
        .set({
          status: 'rejected',
          moderatorId,
          moderatorNotes: reason,
          moderatedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(moderationQueue.id, queueId));

      // Get the post details for logging
      const queueItem = await db.select()
        .from(moderationQueue)
        .where(eq(moderationQueue.id, queueId))
        .limit(1);

      if (queueItem.length > 0) {
        const item = queueItem[0];
        
        // Deactivate the post permanently
        await db.update(anonymousPosts)
          .set({ 
            isActive: false,
            updatedAt: new Date()
          })
          .where(eq(anonymousPosts.id, item.postId));

        // Log the rejection
        await db.insert(moderationLogs).values({
          id: crypto.randomUUID(),
          postId: item.postId,
          action: 'manual_rejected',
          moderatorId,
          reason: reason || 'Post rejected by moderator',
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to reject post:', error);
    }
  }

  /**
   * Edit a flagged post content
   */
  static async editPost(queueId: string, newContent: string, moderatorId: string, reason?: string): Promise<void> {
    try {
      // Get the post details
      const queueItem = await db.select()
        .from(moderationQueue)
        .where(eq(moderationQueue.id, queueId))
        .limit(1);

      if (queueItem.length > 0) {
        const item = queueItem[0];
        
        // Update the post content
        await db.update(anonymousPosts)
          .set({ 
            content: newContent,
            isActive: true,
            updatedAt: new Date()
          })
          .where(eq(anonymousPosts.id, item.postId));

        // Update moderation queue
        await db.update(moderationQueue)
          .set({
            status: 'edited',
            moderatorId,
            moderatorNotes: reason,
            moderatedAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(moderationQueue.id, queueId));

        // Log the edit
        await db.insert(moderationLogs).values({
          id: crypto.randomUUID(),
          postId: item.postId,
          action: 'edited',
          moderatorId,
          reason: reason || 'Post content edited by moderator',
          previousContent: item.content,
          newContent,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
  }
}
