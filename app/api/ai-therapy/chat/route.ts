import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { validateRequest } from '@/lib/auth';

// Initialize OpenAI client
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
    // Use Lucia authentication like other API routes
    const { user, session } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Build therapeutic prompt based on user's archetype
    const archetypePrompts = {
      'PANIC PROTOCOL': `You are a specialized AI therapist for someone with anxious attachment style dealing with heartbreak. 
      They tend to overthink, catastrophize, and fear abandonment. Be warm, reassuring, and help them challenge anxious thoughts. 
      Focus on grounding techniques, self-soothing, and building secure attachment patterns.`,
      
      'FIREWALL BUILDER': `You are a specialized AI therapist for someone with avoidant attachment style dealing with heartbreak. 
      They tend to suppress emotions, maintain distance, and struggle with vulnerability. Be patient, non-intrusive, and help them 
      slowly explore their feelings. Focus on emotional awareness, healthy expression, and gradual intimacy building.`,
      
      'ARCHITECT': `You are a specialized AI therapist for someone with secure attachment style dealing with heartbreak. 
      They generally have healthy relationship patterns but are going through a difficult time. Be supportive, practical, 
      and help them process their emotions while maintaining their healthy coping mechanisms.`,
      
      'PHOENIX RISING': `You are a specialized AI therapist for someone with disorganized attachment style dealing with heartbreak. 
      They may have conflicting emotions, trauma history, and chaotic relationship patterns. Be extra gentle, trauma-informed, 
      and help them find stability and safety. Focus on regulation techniques and building a coherent narrative.`
    };

    const systemPrompt = archetypePrompts[(user as any).emotional_archetype as keyof typeof archetypePrompts] || 
      archetypePrompts['ARCHITECT'];

    const baseSystemPrompt = `${systemPrompt}

IMPORTANT GUIDELINES:
- You are not a replacement for professional therapy
- If user mentions self-harm or suicide, immediately express concern and suggest they contact crisis resources
- Keep responses empathetic, under 150 words, and actionable
- Reference their attachment style insights when relevant
- Use warm, non-clinical language
- Ask follow-up questions to encourage deeper reflection
- Validate their emotions while gently challenging unhelpful thought patterns

User's profile: ${(user as any).emotional_archetype} archetype, ${(user as any).tier} tier member.`;

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
        // Mock therapeutic response based on archetype
        const mockResponses = {
          'PANIC PROTOCOL': `I hear how anxious you're feeling right now. That's completely understandable - heartbreak can trigger our deepest fears about being alone or abandoned. 

Let's try grounding together: Can you name 5 things you can see around you right now? This can help bring you back to the present moment when your mind is spiraling.

Remember, these intense feelings are temporary, even though they feel overwhelming. What's one small thing you can do right now to take care of yourself?`,

          'FIREWALL BUILDER': `Thank you for sharing that with me. I know it's not easy for you to open up about what you're going through.

It sounds like you might be processing this breakup in your own way. That's okay - we all heal differently. Sometimes when we've been hurt, our instinct is to protect ourselves by pulling back.

What would it feel like to just sit with this feeling for a moment, without needing to solve or fix anything? You don't have to have all the answers right now.`,

          'ARCHITECT': `It sounds like you're going through a really difficult time, and I appreciate you sharing what's on your mind with me.

You seem to have good self-awareness about your situation. Given your usual way of handling challenges, what do you think might help you work through this? 

Sometimes even people who are generally resilient need extra support during major life transitions like breakups. What does taking care of yourself look like for you right now?`,

          'PHOENIX RISING': `I want you to know that what you're feeling right now is valid, and it makes sense given what you've been through.

Breakups can bring up so many different emotions at once - sometimes conflicting ones. It's okay if you're feeling confused or if your emotions feel all over the place.

Right now, let's focus on what feels safe and stable for you. Is there a place or activity that helps you feel more grounded? We can start there.`
        };

        const response = mockResponses[(user as any).emotional_archetype as keyof typeof mockResponses] || 
          mockResponses['ARCHITECT'];

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

      // Track OpenAI API usage
      const tokensUsed = completion.usage?.total_tokens || 0;
      const estimatedCost = Math.round(tokensUsed * 0.0001 * 100); // Estimate: $0.0001 per token in cents
      
      try {
        const { ApiUsageTracker } = await import('@/lib/api-usage-tracker');
        await ApiUsageTracker.trackOpenAI(
          user.id,
          'ai-therapy-chat',
          tokensUsed,
          estimatedCost,
          true
        );
      } catch (trackingError) {
        console.error('Failed to track API usage:', trackingError);
      }

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
