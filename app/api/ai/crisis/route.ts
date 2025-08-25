import { NextRequest, NextResponse } from 'next/server';
import { aiEngine, TherapyContext } from '@/lib/ai/ai-engine';

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile, severity } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required for crisis support' },
        { status: 400 }
      );
    }

    // Default user profile for crisis situations
    const defaultProfile = {
      codename: 'CRISIS_USER',
      phase: 'CRISIS_MODE',
      emotionalTone: 'crisis',
      attachmentStyle: 'unknown',
      distressLevel: severity || 9,
      noContactDays: 0,
    };

    const profile = userProfile || defaultProfile;

    // Generate crisis intervention response
    const response = await aiEngine.handleCrisisIntervention(message, profile);

    // Always include crisis resources in the response
    const crisisResources = {
      immediate: [
        {
          name: '988 Suicide & Crisis Lifeline',
          action: 'call',
          contact: '988',
          description: 'Call or text 988 for immediate crisis support'
        },
        {
          name: 'Crisis Text Line',
          action: 'text',
          contact: '741741',
          description: 'Text HOME to 741741 for crisis counseling'
        }
      ],
      specialized: [
        {
          name: 'National Domestic Violence Hotline',
          action: 'call',
          contact: '1-800-799-7233',
          description: 'If you\'re in an abusive relationship'
        },
        {
          name: 'LGBTQ National Hotline',
          action: 'call',
          contact: '1-888-843-4564',
          description: 'Support for LGBTQ+ individuals'
        }
      ]
    };

    // Immediate safety check keywords
    const safetyKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'die'];
    const containsSafetyRisk = safetyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    return NextResponse.json({
      success: true,
      response: response.message,
      emotionalTone: response.emotionalTone,
      actionSuggestions: response.actionSuggestions || [
        'Take slow, deep breaths',
        'Call a trusted friend or family member',
        'Use the crisis resources provided',
        'Focus on staying safe right now'
      ],
      crisisResources,
      immediateActions: containsSafetyRisk ? [
        'If you are in immediate danger, call 911',
        'Call 988 for crisis support',
        'Go to your nearest emergency room',
        'Don\'t be alone - call someone to be with you'
      ] : [
        'Take it one moment at a time',
        'You don\'t have to suffer alone',
        'This feeling is temporary',
        'Reach out for support'
      ],
      rewards: {
        bytes: response.byteReward || 15,
      },
      priority: containsSafetyRisk ? 'emergency' : 'urgent'
    });

  } catch (error) {
    console.error('Crisis Support API Error:', error);
    
    // Even if AI fails, provide crisis resources
    return NextResponse.json({
      success: false,
      error: 'Crisis support system temporarily unavailable',
      fallbackResponse: {
        message: "I'm experiencing technical difficulties, but your safety is the priority. Please reach out to crisis support immediately.",
        crisisResources: {
          immediate: [
            {
              name: '988 Suicide & Crisis Lifeline',
              action: 'call',
              contact: '988',
              description: 'Call or text 988 for immediate crisis support'
            },
            {
              name: 'Crisis Text Line',
              action: 'text',
              contact: '741741',
              description: 'Text HOME to 741741 for crisis counseling'
            }
          ]
        },
        immediateActions: [
          'Call 988 or 911 if you are in danger',
          'Go to your nearest emergency room',
          'Call a trusted friend or family member',
          'You are not alone - help is available'
        ]
      }
    }, { status: 500 });
  }
}
