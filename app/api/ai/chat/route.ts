import { NextRequest, NextResponse } from 'next/server';
import { aiEngine, TherapyContext } from '@/lib/ai/ai-engine';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Default context if not provided
    const defaultContext: TherapyContext = {
      userProfile: {
        codename: 'ANONYMOUS_USER',
        phase: 'EARLY_PROCESSING',
        emotionalTone: 'processing',
        attachmentStyle: 'anxious',
        distressLevel: 5,
        noContactDays: 0,
      },
      conversationHistory: [],
      sessionType: 'protocol-ghost',
      personalityMode: 'savage-bestie',
    };

    const therapyContext = context || defaultContext;

    // Generate AI response
    const response = await aiEngine.generateResponse(message, therapyContext);

    return NextResponse.json({
      success: true,
      response: response.message,
      emotionalTone: response.emotionalTone,
      actionSuggestions: response.actionSuggestions,
      ritualRecommendations: response.ritualRecommendations,
      rewards: {
        xp: response.xpReward,
        bytes: response.byteReward,
      },
      triggerWarnings: response.triggerWarnings,
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'AI system temporarily unavailable',
      fallbackResponse: {
        message: "I'm experiencing a system glitch right now. While I reboot, remember: you're stronger than you think, and this feeling will pass. Try some deep breathing or reach out to a friend.",
        emotionalTone: 'supportive',
        rewards: { xp: 5, bytes: 5 }
      }
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
