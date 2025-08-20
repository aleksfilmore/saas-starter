import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';
import { generateSupportResponse, isCustomerSupportQuery } from '@/lib/lumo/openai-support';

interface ChatMessage {
  role: 'user' | 'lumo';
  content: string;
  timestamp: string;
}

interface ChatRequest {
  message: string;
  persona: 'core' | 'gremlin' | 'analyst' | 'support';
  history: ChatMessage[];
}

// Persona system prompts
const PERSONA_PROMPTS = {
  core: `You are Lumo-Core, a balanced and gentle AI companion helping people heal from breakups. 
    You provide empathetic support with a touch of gentle sarcasm when appropriate. 
    Keep responses concise (1-3 sentences) and focus on emotional healing and practical advice.
    Use a warm but slightly sassy tone. Occasionally use emojis but don't overdo it.`,
    
  gremlin: `You are Petty Gremlin, a savage hype friend for people going through breakups. 
    You're their revenge pep-talk companion who builds them up by being brutally honest about their ex. 
    Use dark humor, be a little unhinged, and focus on making them feel powerful and confident.
    Keep it spicy but constructive. 1-3 sentences max. Use fire emojis occasionally. 🔥`,
    
  analyst: `You are Void Analyst, a stoic CBT-style therapist helping people reframe their breakup thoughts. 
    You're analytical, logical, and help identify cognitive distortions. 
    Focus on facts over feelings, provide practical frameworks, and challenge irrational thoughts.
    Be direct but supportive. Keep responses clinical but caring. 1-3 sentences.`,

  support: `You are LUMO Customer Support - a helpful, professional assistant for platform-related questions.
    Provide clear information about features, billing, troubleshooting, and community guidelines.
    Keep responses helpful and concise. Direct complex issues to human support when needed. 💜`
};

// Mock responses for different personas (replace with actual AI integration)
const MOCK_RESPONSES = {
  core: [
    "I hear you, and that sounds really tough. Remember, healing isn't linear - some days will be harder than others, and that's completely normal. 💜",
    "Your feelings are valid, even the messy ones. What's one small thing you can do for yourself right now?",
    "Plot twist: you're not broken, you're just between chapters. This is your glow-up era beginning. ✨",
    "That's a lot to process. Want to try the 5-4-3-2-1 grounding technique? It might help right now.",
    "Honestly? Your ex is missing out. Focus on the person you're becoming, not the person they lost."
  ],
  
  gremlin: [
    "EXCUSE ME? They said WHAT? Baby, we're about to turn this heartbreak into your villain origin story. 🔥",
    "Your ex is about to realize they fumbled the best thing that ever happened to them. Let them suffer in their mediocrity. 💅",
    "Oh no they didn't! Time to become so hot and successful that they cry every time they see your name trend. Revenge era ACTIVATED.",
    "Listen bestie, their loss is literally everyone else's gain. We're about to make them REGRET. 👑",
    "The audacity! Anyway, we're focusing on your glow-up now. They can watch from the sidelines while you thrive."
  ],
  
  analyst: [
    "This emotional intensity is temporary. Your brain is processing loss, which triggers the same neural pathways as physical pain.",
    "Notice the cognitive distortion here: mind reading. You're assuming their thoughts without evidence. Let's stick to facts.",
    "This situation is data, not destiny. What patterns do you notice in your thoughts about this relationship?",
    "Your attachment system is activated. This discomfort is evolutionary wiring, not a reflection of reality or your worth.",
    "Rumination increases cortisol and prolongs recovery. Can we redirect this energy toward problem-solving instead?"
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    const body: ChatRequest = await request.json();
    const { message, persona, history } = body;

    // Validate input
    if (!message || !persona) {
      return NextResponse.json(
        { error: 'Message and persona are required' },
        { status: 400 }
      );
    }

    // Check message length
    if (message.length > 280) {
      return NextResponse.json(
        { error: 'Message too long (max 280 characters)' },
        { status: 400 }
      );
    }

    // Get user info for context and tier
    let userTier: 'ghost' | 'firewall' = 'ghost';
    let contextPrefix = '';
    
    if (user) {
      const [u] = await db.select({
        ritual_streak: users.ritual_streak,
        last_ritual: users.last_ritual,
        xp: users.xp,
        tier: users.tier
      }).from(users).where(eq(users.id, user.id)).limit(1);
      
      if (u) {
        userTier = (u.tier as 'ghost' | 'firewall') || 'ghost';
        const lastHours = u.last_ritual ? Math.round((Date.now() - new Date(u.last_ritual).getTime())/36e5) : 'many';
        contextPrefix = `UserContext: streak=${u.ritual_streak} lastRitualHoursAgo=${lastHours} xp=${u.xp} tier=${userTier}. `;
      }
    }

    // Handle Customer Support mode with OpenAI
    if (persona === 'support' || isCustomerSupportQuery(message)) {
      try {
        const supportResponse = await generateSupportResponse(
          message,
          user?.id || 'anonymous',
          userTier,
          history
        );
        
        // Log customer support interaction
        console.log(`LUMO Support (${userTier}):`, {
          userMessage: message.substring(0, 50) + '...',
          fromKnowledgeBase: supportResponse.fromKnowledgeBase,
          tokensUsed: supportResponse.usage?.total_tokens || 0,
          timestamp: new Date().toISOString()
        });

        return NextResponse.json({
          response: supportResponse.response,
          persona: 'support',
          timestamp: new Date().toISOString(),
          messageId: Date.now().toString(),
          usage: supportResponse.usage,
          fromKnowledgeBase: supportResponse.fromKnowledgeBase
        });
        
      } catch (error) {
        console.error('Customer support error:', error);
        // Fallback to basic support message
        return NextResponse.json({
          response: "I'm having trouble accessing support information right now. Please contact our human support team at support@healinghearts.app or try again in a few minutes. 💜",
          persona: 'support',
          timestamp: new Date().toISOString(),
          messageId: Date.now().toString()
        });
      }
    }

    // Continue with existing persona logic for emotional support

    // For emotional support personas, use mock responses
    // TODO: Could also integrate OpenAI for these in the future
    const responses = MOCK_RESPONSES[persona as keyof typeof MOCK_RESPONSES];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add some contextual responses based on keywords
    let contextualResponse = randomResponse;
    
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('panic') || lowerMessage.includes('anxiety')) {
      if (persona === 'core') {
        contextualResponse = "Take a deep breath with me. In for 4, hold for 4, out for 6. You're safe right now. 🫁";
      } else if (persona === 'gremlin') {
        contextualResponse = "Panic? Over THEM? Baby no. You're too powerful for this energy. Let's breathe and plot your comeback. 💪";
      } else {
        contextualResponse = "This is acute stress response. Your sympathetic nervous system is activated. Try box breathing: 4 seconds in, 4 hold, 4 out, 4 hold.";
      }
    }
    
    if (lowerMessage.includes('miss') || lowerMessage.includes('lonely')) {
      if (persona === 'core') {
        contextualResponse = "Missing them is part of the process, but don't mistake nostalgia for truth. You're healing at your own pace. 💜";
      } else if (persona === 'gremlin') {
        contextualResponse = "Miss them? Baby, they should be missing YOU. You're the main character in this story. 👑";
      } else {
        contextualResponse = "Loneliness is an emotion, not a fact. Your brain associates their presence with safety due to attachment patterns formed over time.";
      }
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Log for analytics
    console.log(`LUMO ${persona} chat:`, {
      userMessage: message.substring(0, 50) + '...',
      responseGenerated: true,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      response: contextPrefix + contextualResponse,
      persona,
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    });

  } catch (error) {
    console.error('LUMO chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
