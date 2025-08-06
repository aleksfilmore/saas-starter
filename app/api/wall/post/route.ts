import { NextResponse } from 'next/server';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
  var wallPosts: Map<string, any>;
  var wallReactions: Map<string, any>;
}

// Initialize wall storage if not exists
if (!global.wallPosts) {
  global.wallPosts = new Map();
}
if (!global.wallReactions) {
  global.wallReactions = new Map();
}

// Content moderation keywords
const SENSITIVE_KEYWORDS = [
  'kill myself', 'suicide', 'end my life', 'want to die', 'hurt myself',
  'self harm', 'cutting', 'overdose', 'can\'t go on', 'no point living'
];

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

    const { content, isAnonymous = true, category } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: 'Content too long (max 500 characters)' }, { status: 400 });
    }

    // Check for crisis content
    const lowerContent = content.toLowerCase();
    const hasCrisisLanguage = SENSITIVE_KEYWORDS.some(keyword => 
      lowerContent.includes(keyword)
    );

    if (hasCrisisLanguage) {
      return NextResponse.json({
        error: 'Crisis content detected',
        message: 'Your post contains concerning language. Please reach out for support.',
        resources: {
          crisis: 'text HOME to 741741',
          suicide: '988',
          emergency: '911'
        }
      }, { status: 400 });
    }

    // Auto-detect category from content
    const detectedCategory = detectGlitchCategory(content);
    const finalCategory = category || detectedCategory;

    // Cast user to include database attributes
    const dbUser = user as any;

    // Create post
    const postId = crypto.randomUUID();
    const glitchTitle = generateGlitchTitle(finalCategory);
    
    const post = {
      id: postId,
      content: content.trim(),
      glitchCategory: finalCategory,
      glitchTitle,
      isAnonymous,
      createdAt: new Date(),
      authorId: isAnonymous ? null : session.userId,
      authorEmail: isAnonymous ? null : dbUser.email,
      authorLevel: isAnonymous ? null : dbUser.level,
      resonateCount: 0,
      sameLoopCount: 0,
      draggedMeTooCount: 0,
      stoneColdCount: 0,
      cleansedCount: 0,
      commentCount: 0,
      isOraclePost: false,
      isFeatured: false,
      totalReactions: 0,
      timeAgo: 'just_transmitted'
    };

    // Store post
    global.wallPosts.set(postId, post);

    // Award XP for posting
    user.xp = (user.xp || 0) + 10;
    user.bytes = (user.bytes || 0) + 5;

    return NextResponse.json({
      success: true,
      post,
      message: 'Confession transmitted to the void'
    });

  } catch (error) {
    console.error('Wall post error:', error);
    return NextResponse.json(
      { error: 'Failed to transmit confession' },
      { status: 500 }
    );
  }
}

function detectGlitchCategory(content: string): string {
  const lower = content.toLowerCase();
  
  if (lower.includes('ex') || lower.includes('relationship') || lower.includes('breakup')) {
    return 'system_error';
  }
  if (lower.includes('think') || lower.includes('thought') || lower.includes('mind')) {
    return 'loop_detected';
  }
  if (lower.includes('memory') || lower.includes('remember') || lower.includes('forget')) {
    return 'memory_leak';
  }
  if (lower.includes('feel') || lower.includes('emotion') || lower.includes('overwhelm')) {
    return 'buffer_overflow';
  }
  if (lower.includes('understand') || lower.includes('confus') || lower.includes('lost')) {
    return 'syntax_error';
  }
  if (lower.includes('block') || lower.includes('cut') || lower.includes('access')) {
    return 'access_denied';
  }
  if (lower.includes('empty') || lower.includes('void') || lower.includes('nothing')) {
    return 'null_pointer';
  }
  if (lower.includes('too much') || lower.includes('overwhelm') || lower.includes('crash')) {
    return 'stack_overflow';
  }
  
  return 'system_error'; // default
}

function generateGlitchTitle(category: string): string {
  const titles = {
    system_error: '5Y5T3M_3RR0R_D3T3CT3D',
    loop_detected: 'L00P_1NF1N1T3_D3T3CT3D', 
    memory_leak: 'M3M0RY_L34K_1D3NT1F13D',
    buffer_overflow: 'BUFF3R_0V3RFL0W_W4RN1NG',
    syntax_error: '5YNT4X_3RR0R_L1N3_0',
    null_pointer: 'NULL_P01NT3R_3XC3PT10N',
    stack_overflow: '5T4CK_0V3RFL0W_3XC3PT10N',
    access_denied: '4CC355_D3N13D_3RR0R_403'
  };
  
  return titles[category as keyof typeof titles] || 'UNK0WN_3RR0R';
}
