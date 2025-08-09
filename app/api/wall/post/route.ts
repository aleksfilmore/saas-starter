import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { createWallPost } from '@/lib/wall/wall-service';
import { AnalyticsService } from '@/lib/analytics/service';
import { AnalyticsEvents } from '@/lib/analytics/events';

// Content moderation keywords
const SENSITIVE_KEYWORDS = [
  'kill myself', 'suicide', 'end my life', 'want to die', 'hurt myself',
  'self harm', 'cutting', 'overdose', 'can\'t go on', 'no point living'
];

export async function POST(request: Request) {
  try {
    // Use Lucia authentication
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const post = await createWallPost({ userId: session.userId, content: content.trim(), isAnonymous, category: finalCategory });
    // Fire and forget analytics
    AnalyticsService.track({
      userId: session.userId,
      event: AnalyticsEvents.WALL_POST_CREATED,
      properties: { postId: post.id, category: finalCategory, anonymous: isAnonymous }
    });
    return NextResponse.json({ success: true, post, message: 'Confession transmitted to the void' });

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

// glitch title generation now handled inside service
