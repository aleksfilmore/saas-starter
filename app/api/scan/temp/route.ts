import { NextRequest, NextResponse } from 'next/server';

// Temporary storage for scan answers before user signup
// In production, you might want to use Redis or a similar solution
const tempStorage = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();
    
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }
    
    // Generate a temporary ID for this scan session
    const sessionId = crypto.randomUUID();
    
    // Calculate archetype based on answers
    const archetype = calculateArchetype(answers);
    
    // Store temporarily (expires in 30 minutes)
    tempStorage.set(sessionId, {
      answers,
      archetype,
      timestamp: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
    });
    
    // Clean up expired entries
    cleanupExpiredEntries();
    
    return NextResponse.json({
      success: true,
      sessionId,
      archetype: archetype.type // Don't reveal full details until signup
    });
    
  } catch (error) {
    console.error('Error storing scan answers:', error);
    return NextResponse.json(
      { error: 'Failed to store scan results' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }
    
    const data = tempStorage.get(sessionId);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Session not found or expired' },
        { status: 404 }
      );
    }
    
    // Check if expired
    if (Date.now() > data.expiresAt) {
      tempStorage.delete(sessionId);
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      archetype: data.archetype,
      answers: data.answers
    });
    
  } catch (error) {
    console.error('Error retrieving scan results:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve scan results' },
      { status: 500 }
    );
  }
}

function calculateArchetype(answers: Record<string, string>) {
  // Count weights for each attachment style
  const weights = {
    anxious: 0,
    avoidant: 0,
    secure: 0,
    disorganized: 0
  };
  
  // Mapping of answer IDs to weights (from the questions in scan page)
  const answerWeights: Record<string, keyof typeof weights> = {
    // Question 1
    '1a': 'anxious', '1b': 'avoidant', '1c': 'secure', '1d': 'disorganized',
    // Question 2  
    '2a': 'anxious', '2b': 'avoidant', '2c': 'secure', '2d': 'disorganized',
    // Question 3
    '3a': 'anxious', '3b': 'avoidant', '3c': 'secure', '3d': 'disorganized',
    // Question 4
    '4a': 'anxious', '4b': 'avoidant', '4c': 'secure', '4d': 'disorganized',
    // Question 5
    '5a': 'anxious', '5b': 'avoidant', '5c': 'secure', '5d': 'disorganized',
    // Question 6
    '6a': 'anxious', '6b': 'avoidant', '6c': 'secure', '6d': 'disorganized',
    // Question 7
    '7a': 'anxious', '7b': 'avoidant', '7c': 'secure', '7d': 'disorganized',
    // Question 8
    '8a': 'anxious', '8b': 'avoidant', '8c': 'secure', '8d': 'disorganized'
  };
  
  // Count the weights
  Object.values(answers).forEach(answerId => {
    const weight = answerWeights[answerId];
    if (weight) {
      weights[weight]++;
    }
  });
  
  // Find the dominant attachment style
  const dominantStyle = Object.entries(weights).reduce((a, b) => 
    weights[a[0] as keyof typeof weights] > weights[b[0] as keyof typeof weights] ? a : b
  )[0] as keyof typeof weights;
  
  // Return archetype details
  const archetypes = {
    anxious: {
      type: 'PANIC PROTOCOL',
      subtitle: 'aka "anxious-preoccupied"',
      description: 'You crave deep connection but fear abandonment. Your superpower is emotional intuition - you feel everything deeply and can read between the lines like a detective.',
      traits: [
        'Highly empathetic and emotionally intelligent',
        'Seeks reassurance and validation from partners', 
        'Prone to overthinking and catastrophizing',
        'Capable of intense, passionate connections'
      ],
      strengths: ['Deep emotional capacity', 'Strong intuition', 'Loyal and committed'],
      challenges: ['Fear of abandonment', 'Overthinking', 'Need for constant reassurance']
    },
    avoidant: {
      type: 'FIREWALL BUILDER', 
      subtitle: 'aka "dismissive-avoidant"',
      description: 'You value independence above all else. Your superpower is self-reliance - you can stand strong on your own and think clearly under pressure.',
      traits: [
        'Highly independent and self-sufficient',
        'Values personal space and autonomy',
        'Tends to suppress or dismiss emotions',
        'Comfortable with solitude and self-reflection'
      ],
      strengths: ['Strong sense of self', 'Emotional stability', 'Independence'],
      challenges: ['Difficulty with emotional intimacy', 'May seem distant', 'Avoids vulnerability']
    },
    secure: {
      type: 'ARCHITECT',
      subtitle: 'aka "secure attachment"', 
      description: 'You have a balanced approach to relationships. Your superpower is emotional regulation - you can stay calm in storms and build lasting connections.',
      traits: [
        'Comfortable with intimacy and independence',
        'Good at communicating needs and boundaries',
        'Emotionally stable and resilient',
        'Trusting but not naive in relationships'
      ],
      strengths: ['Emotional balance', 'Clear communication', 'Healthy boundaries'],
      challenges: ['May struggle to understand insecure partners', 'Can seem "too stable"', 'Rare archetype']
    },
    disorganized: {
      type: 'PHOENIX RISING',
      subtitle: 'aka "fearful-avoidant"',
      description: 'You contain multitudes - both the desire for closeness and the fear of being hurt. Your superpower is transformation - you can rise from any ashes.',
      traits: [
        'Complex mix of anxious and avoidant behaviors', 
        'Highly sensitive to relationship dynamics',
        'Can be intensely passionate or completely withdrawn',
        'Strong capacity for growth and change'
      ],
      strengths: ['High emotional range', 'Adaptability', 'Deep capacity for transformation'],
      challenges: ['Internal contradictions', 'Unpredictable responses', 'Fear of both intimacy and abandonment']
    }
  };
  
  return archetypes[dominantStyle];
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of tempStorage.entries()) {
    if (now > value.expiresAt) {
      tempStorage.delete(key);
    }
  }
}
