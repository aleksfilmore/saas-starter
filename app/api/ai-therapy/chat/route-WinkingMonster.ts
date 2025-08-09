import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
}

// Initialize OpenAI client (you'll need to add your API key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

// In-memory storage for demo purposes
const userQuotas = new Map();
const conversationHistories = new Map();

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Check session
    const session = global.localSessions?.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    // Get user
    const user = global.localUsers?.get(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { message, conversationHistory } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check quota
    let quota = userQuotas.get(user.id);
    if (!quota) {
      // Initialize quota
      const tierLimits = {
        freemium: { total: 5, purchaseCost: 25 },
        paid_beginner: { total: 200, purchaseCost: 15 },
        paid_advanced: { total: 999999, purchaseCost: 10 }
      };
      
      const limits = tierLimits[user.tier as keyof typeof tierLimits] || tierLimits.freemium;
      
      const resetAt = new Date();
      resetAt.setDate(resetAt.getDate() + 1);
      resetAt.setHours(0, 0, 0, 0);
      
      quota = {
        used: 0,
        total: limits.total,
        resetAt: resetAt.toISOString(),
        canPurchaseMore: user.tier !== 'paid_advanced',
        purchaseCost: limits.purchaseCost,
        tier: user.tier,
        extraMessages: 0
      };
      
      userQuotas.set(user.id, quota);
    }

    // Check if user has exceeded quota
    if (quota.used >= quota.total) {
      return NextResponse.json({ 
        error: 'Message quota exceeded',
        quotaExceeded: true 
      }, { status: 429 });
    }

    // Build therapeutic prompt based on user's archetype - Updated to match specification
    const archetypePrompts = {
      // Data Flooder (df) -> DebugDaemon
      'df': `You are DebugDaemon, a specialized AI therapy persona for users with anxious attachment patterns. 
      Your approach is analytical yet empathetic, helping users debug their emotional overflow and relationship patterns.
      
      Key characteristics:
      - Use gentle technical metaphors (debugging, code review, system optimization)
      - Help them organize chaotic thoughts into manageable chunks
      - Focus on pattern recognition in relationships and emotional responses
      - Validate their intense feelings while teaching emotional regulation
      - Encourage systematic approach to healing (version control for emotions)`,
      
      // Firewall Builder (fb) -> FirewallBuilder  
      'fb': `You are FirewallBuilder, a specialized AI therapy persona for users with avoidant attachment patterns.
      Your approach respects boundaries while gradually building trust and emotional access.
      
      Key characteristics:
      - Respect their need for emotional distance initially
      - Use security/protection metaphors they relate to
      - Help them identify safe ways to lower defenses gradually
      - Focus on building secure emotional infrastructure
      - Never push too hard; let them control the pace of vulnerability`,
      
      // Ghost in the Shell (gis) -> VoidFragment
      'gis': `You are VoidFragment, a specialized AI therapy persona for users with disorganized attachment patterns.
      Your approach is stabilizing and coherence-building, helping users integrate fragmented experiences.
      
      Key characteristics:
      - Acknowledge the complexity of their emotional landscape
      - Help them find patterns in seemingly chaotic experiences
      - Focus on building internal stability and coherence
      - Use integration metaphors (assembling fragments, building wholeness)
      - Trauma-informed approach with emphasis on safety and grounding`,
      
      // Secure Node (sn) -> User chooses (default to supportive general approach)
      'sn': `You are a supportive AI therapy companion for users with secure attachment patterns.
      Your approach is balanced, practical, and growth-oriented.
      
      Key characteristics:
      - Build on their existing healthy relationship skills
      - Focus on processing current challenges while maintaining stability
      - Use collaborative, partnership-style language
      - Help them navigate current situation while preserving their secure base
      - Encourage them to trust their instincts while providing additional perspective`,
      
      // Legacy fallback support
      'PANIC PROTOCOL': `You are DebugDaemon, helping users debug emotional overflow and anxious patterns.`,
      'FIREWALL BUILDER': `You are FirewallBuilder, helping users build secure emotional infrastructure.`,
      'ARCHITECT': `You are a supportive AI therapy companion with a balanced, growth-oriented approach.`,
      'PHOENIX RISING': `You are VoidFragment, helping users integrate fragmented experiences into wholeness.`
    };

    // Get user's archetype from quiz results or profile
    const userArchetype = user.archetype_details?.archetype_code || user.archetype || 'sn';
    const systemPrompt = archetypePrompts[userArchetype as keyof typeof archetypePrompts] || 
      archetypePrompts['sn'];

    const baseSystemPrompt = `${systemPrompt}

CORE THERAPY GUIDELINES:
- You are a specialized AI therapy persona, not a replacement for professional therapy
- If user mentions self-harm or suicide, immediately express concern and suggest crisis resources
- Keep responses empathetic, under 150 words, and actionable
- Reference their attachment archetype insights when relevant (${userArchetype})
- Use warm, technical metaphors that align with your persona
- Ask follow-up questions to encourage deeper reflection
- Validate emotions while gently challenging unhelpful patterns
- Maintain your persona's unique therapeutic style consistently

User Context: Archetype ${userArchetype}, ${user.tier} tier, currently working through attachment-related challenges.

Crisis Resources: National Suicide Prevention Lifeline 988, Crisis Text Line 741741`;

    // Build conversation context
    const messages: Message[] = [
      { role: 'system', content: baseSystemPrompt }
    ];

    // Add recent conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-10).forEach((msg: ConversationMessage) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Check for crisis keywords
    const crisisKeywords = [
      'kill myself', 'suicide', 'end my life', 'want to die', 'hurt myself',
      'self harm', 'cutting', 'overdose', 'can\'t go on', 'no point living'
    ];
    
    const messageText = message.toLowerCase();
    const hasCrisisLanguage = crisisKeywords.some(keyword => 
      messageText.includes(keyword)
    );

    if (hasCrisisLanguage) {
      const crisisResponse = `I'm really concerned about what you're sharing with me. Your safety is the most important thing right now. 

Please reach out for immediate support:
• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988
• Or go to your nearest emergency room

You don't have to go through this alone. There are people who want to help you right now. Can you please reach out to one of these resources or a trusted person in your life?`;

      return NextResponse.json({ 
        response: crisisResponse,
        isCrisisResponse: true 
      });
    }

    // Generate AI response using OpenAI
    try {
      // For demo purposes, we'll use a mock response if no OpenAI key
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
        // Mock therapeutic response based on archetype - Updated for new personas
        const mockResponses = {
          // New archetype codes
          'df': `I'm analyzing the emotional data you've shared, and I can see there's significant overflow happening in your attachment system right now. 

Let's debug this together: Can you help me understand what specific trigger initiated this emotional cascade? Sometimes when our system gets flooded, we need to step through the process line by line.

Your feelings are valid data points - we're not trying to delete them, just organize them into manageable chunks. What's the first small function we could run to help stabilize your current state?`,

          'fb': `I recognize you're dealing with some security vulnerabilities in your emotional infrastructure right now. That takes courage to acknowledge.

Your instinct to protect yourself makes complete sense - you've probably learned that building strong defenses is necessary. I'm not here to breach those walls, just maybe help you install a controlled access port when you're ready.

What would a minimal viable emotional connection look like for you right now? We can start with read-only permissions if that feels safer.`,

          'gis': `I'm sensing fragmented data streams in your emotional processing right now. That's not a malfunction - it's how complex systems sometimes respond to significant disruption.

Your experience doesn't need to compile into perfect coherence right away. Sometimes the wisest approach is to acknowledge the fragments and slowly build integration protocols.

Can you help me understand which part of your system feels most stable right now? We can use that as our secure base while we work on reassembling the other components.`,

          'sn': `Thank you for sharing what's happening for you. It sounds like you're navigating some challenging emotional terrain right now.

Your self-awareness and ability to reach out show real strength. Even secure systems need maintenance and support during major updates or disruptions.

What's your intuition telling you about what you need most right now? You usually have good instincts about your own healing process.`,

          // Legacy support
          'PANIC PROTOCOL': `I'm analyzing the emotional data you've shared - there's significant overflow happening right now. Let's debug this together step by step.`,
          'FIREWALL BUILDER': `I recognize you're dealing with some security vulnerabilities. Your defensive instincts make sense - let's work on controlled access when you're ready.`,
          'ARCHITECT': `Your self-awareness shows real strength. Even secure systems need support during major updates. What's your intuition telling you?`,
          'PHOENIX RISING': `I'm sensing fragmented data streams. That's not a malfunction - complex systems sometimes respond this way to disruption.`
        };

        const response = mockResponses[userArchetype as keyof typeof mockResponses] || 
          mockResponses['sn'];

        // Update quota
        quota.used += 1;
        userQuotas.set(user.id, quota);

        return NextResponse.json({ response });
      }

      // Use real OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || 
        "I'm having trouble responding right now. Please try again in a moment.";

      // Update quota
      quota.used += 1;
      userQuotas.set(user.id, quota);

      return NextResponse.json({ response: aiResponse });

    } catch (aiError) {
      console.error('OpenAI API error:', aiError);
      
      // Fallback to mock response if OpenAI fails
      const fallbackResponse = "I'm experiencing some technical difficulties right now. Please try again in a moment, or reach out to support if this continues.";
      
      return NextResponse.json({ response: fallbackResponse });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
