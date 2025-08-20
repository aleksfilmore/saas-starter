/**
 * OpenAI Integration Service for LUMO Customer Support
 * Includes usage guardrails and rate limiting
 */

import OpenAI from 'openai';
import { searchKnowledgeBase, formatKnowledgeBaseForAI } from './help-knowledge-base';

// Lazy initialize OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface UsageGuardrails {
  maxTokensPerRequest: number;
  maxRequestsPerUserPerHour: number;
  maxRequestsPerUserPerDay: number;
  rateLimitByTier: {
    ghost: { hourly: number; daily: number };
    firewall: { hourly: number; daily: number };
  };
}

// Usage limits to prevent abuse
export const USAGE_LIMITS: UsageGuardrails = {
  maxTokensPerRequest: 500, // Keep responses concise
  maxRequestsPerUserPerHour: 10,
  maxRequestsPerUserPerDay: 50,
  rateLimitByTier: {
    ghost: { hourly: 5, daily: 20 },      // Free tier: more limited
    firewall: { hourly: 15, daily: 100 }   // Premium tier: generous limits
  }
};

// In-memory rate limiting (in production, use Redis or database)
const rateLimitStore = new Map<string, { requests: number; lastReset: number; dailyRequests: number; dailyReset: number }>();

/**
 * Check if user has exceeded rate limits
 */
export function checkRateLimit(userId: string, userTier: 'ghost' | 'firewall'): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;
  
  const limits = USAGE_LIMITS.rateLimitByTier[userTier];
  const userData = rateLimitStore.get(userId) || { 
    requests: 0, 
    lastReset: now, 
    dailyRequests: 0, 
    dailyReset: now 
  };
  
  // Reset hourly counter if needed
  if (now - userData.lastReset > hourMs) {
    userData.requests = 0;
    userData.lastReset = now;
  }
  
  // Reset daily counter if needed
  if (now - userData.dailyReset > dayMs) {
    userData.dailyRequests = 0;
    userData.dailyReset = now;
  }
  
  // Check limits
  if (userData.requests >= limits.hourly) {
    return { allowed: false, reason: `Hourly limit reached (${limits.hourly} requests/hour for ${userTier} tier)` };
  }
  
  if (userData.dailyRequests >= limits.daily) {
    return { allowed: false, reason: `Daily limit reached (${limits.daily} requests/day for ${userTier} tier)` };
  }
  
  // Increment counters
  userData.requests++;
  userData.dailyRequests++;
  rateLimitStore.set(userId, userData);
  
  return { allowed: true };
}

/**
 * Customer Support System Prompt
 */
const CUSTOMER_SUPPORT_PROMPT = `You are LUMO Customer Support, a helpful AI assistant for a breakup healing platform called "The App That Heals Hearts."

PLATFORM OVERVIEW:
- Helps people heal from breakups through daily rituals, no-contact tracking, and community support
- Has two tiers: Ghost Mode (free) and Firewall (premium)
- Features include: healing archetypes, Wall of Wounds community, badge system, XP tracking
- AI personalities: Core (balanced), Gremlin (savage hype), Analyst (logical therapy)

YOUR ROLE:
- Provide helpful, accurate information about platform features
- Guide users through troubleshooting
- Explain billing and subscription details
- Support community guidelines and safety
- Maintain a supportive, professional tone
- Keep responses concise (1-3 sentences)

RESPONSE GUIDELINES:
- Always check the knowledge base context first
- If you don't know something, direct users to contact human support
- Never make up features or policies
- Be empathetic about breakup healing while staying professional
- Include relevant emojis occasionally but don't overuse them
- For billing issues, always mention Stripe security and suggest contacting support

LIMITATIONS:
- Don't provide therapeutic advice beyond what's in the platform
- Don't access or discuss private user data
- Don't override platform policies or make exceptions
- Redirect serious mental health concerns to professional resources`;

/**
 * Generate customer support response using OpenAI
 */
export async function generateSupportResponse(
  userMessage: string,
  userId: string,
  userTier: 'ghost' | 'firewall',
  chatHistory: Array<{ role: string; content: string }> = []
): Promise<{ response: string; usage: any; fromKnowledgeBase: boolean }> {
  
  // Check rate limits first
  const rateLimitCheck = checkRateLimit(userId, userTier);
  if (!rateLimitCheck.allowed) {
    return {
      response: `I understand you need help, but you've reached your ${userTier} tier limit. ${rateLimitCheck.reason} Please try again later or contact human support for urgent issues. 💜`,
      usage: { total_tokens: 0 },
      fromKnowledgeBase: false
    };
  }
  
  // Search knowledge base for relevant info
  const relevantArticles = searchKnowledgeBase(userMessage, 3);
  const knowledgeContext = formatKnowledgeBaseForAI(relevantArticles);
  
  // If we have good knowledge base matches, use them directly for simple queries
  if (relevantArticles.length > 0 && relevantArticles[0].relevanceScore! > 8) {
    const topArticle = relevantArticles[0];
    return {
      response: `${topArticle.content} Is there anything specific about this you'd like me to clarify? 💜`,
      usage: { total_tokens: 0 },
      fromKnowledgeBase: true
    };
  }
  
  // Prepare messages for OpenAI
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: CUSTOMER_SUPPORT_PROMPT },
  ];
  
  // Add knowledge base context if available
  if (knowledgeContext) {
    messages.push({ role: 'system', content: knowledgeContext });
  }
  
  // Add recent chat history for context (last 4 messages)
  const recentHistory = chatHistory.slice(-4);
  recentHistory.forEach(msg => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  });
  
  // Add current user message
  messages.push({ role: 'user', content: userMessage });
  
  try {
    const openaiClient = getOpenAIClient();
    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use cost-effective model for support
      messages,
      max_tokens: USAGE_LIMITS.maxTokensPerRequest,
      temperature: 0.7, // Balanced creativity/consistency
      presence_penalty: 0.1, // Slight preference for varied responses
      frequency_penalty: 0.1, // Reduce repetition
    });
    
    const response = completion.choices[0]?.message?.content || 
      "I'm having trouble processing your request right now. Please contact our human support team for assistance. 💜";
    
    return {
      response,
      usage: completion.usage,
      fromKnowledgeBase: false
    };
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to knowledge base if OpenAI fails
    if (relevantArticles.length > 0) {
      return {
        response: `Based on our help docs: ${relevantArticles[0].content} For more detailed help, please contact our support team. 💜`,
        usage: { total_tokens: 0 },
        fromKnowledgeBase: true
      };
    }
    
    return {
      response: "I'm experiencing technical difficulties. Please contact our human support team at support@healinghearts.app or try again in a few minutes. 💜",
      usage: { total_tokens: 0 },
      fromKnowledgeBase: false
    };
  }
}

/**
 * Get current usage stats for a user
 */
export function getUserUsageStats(userId: string): { hourlyUsage: number; dailyUsage: number; limits: any } {
  const userData = rateLimitStore.get(userId);
  if (!userData) {
    return { hourlyUsage: 0, dailyUsage: 0, limits: USAGE_LIMITS.rateLimitByTier };
  }
  
  return {
    hourlyUsage: userData.requests,
    dailyUsage: userData.dailyRequests,
    limits: USAGE_LIMITS.rateLimitByTier
  };
}

/**
 * Reset rate limits for a user (admin function)
 */
export function resetUserRateLimit(userId: string): void {
  rateLimitStore.delete(userId);
}

/**
 * Check if message looks like a customer support inquiry
 */
export function isCustomerSupportQuery(message: string): boolean {
  const supportKeywords = [
    'help', 'support', 'issue', 'problem', 'bug', 'error',
    'billing', 'payment', 'subscription', 'upgrade', 'premium',
    'account', 'login', 'password', 'forgot', 'reset',
    'feature', 'how to', 'how do', 'tutorial', 'guide',
    'not working', 'broken', 'cant', "can't", 'unable',
    'contact', 'email', 'phone', 'customer service'
  ];
  
  const messageLower = message.toLowerCase();
  return supportKeywords.some(keyword => messageLower.includes(keyword));
}
