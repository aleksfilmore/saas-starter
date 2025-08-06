// Wall of Wounds API - FEED 
import { NextRequest, NextResponse } from 'next/server';

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

// Force Node.js runtime
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const filter = searchParams.get('filter') || 'recent';
    const category = searchParams.get('category');

    // Get real posts from storage
    const realPosts = Array.from(global.wallPosts.values()).map(post => ({
      ...post,
      timeAgo: formatTimeAgo(post.createdAt),
      userReaction: getUserReaction(session.userId, post.id)
    }));

    // Mock data for demonstration
    const mockPosts = [
      {
        id: 'mock-1',
        content: 'Just realized my ex was basically a human form of Windows Vista - looked promising at first but crashed constantly and made everything slower. At least Vista eventually got replaced...',
        glitchCategory: 'system_error',
        glitchTitle: '5Y5T3M_3RR0R_D3T3CT3D',
        isAnonymous: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        resonateCount: 24,
        sameLoopCount: 8,
        draggedMeTooCount: 3,
        stoneColdCount: 12,
        cleansedCount: 5,
        commentCount: 7,
        isOraclePost: false,
        isFeatured: false,
        authorId: null,
        authorEmail: null,
        authorLevel: null,
        userReaction: null,
        totalReactions: 52,
        timeAgo: '2h_ago',
        displayTitle: '5Y5T3M_3RR0R_D3T3CT3D'
      },
      {
        id: 'mock-2',
        content: 'My therapist said "you need to process your emotions" but honestly I feel like a computer trying to run Crysis on a calculator. System requirements not met, please try again in 5-10 years.',
        glitchCategory: 'buffer_overflow',
        glitchTitle: 'BUFF3R_0V3RFL0W_W4RN1NG',
        isAnonymous: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        resonateCount: 31,
        sameLoopCount: 15,
        draggedMeTooCount: 2,
        stoneColdCount: 18,
        cleansedCount: 9,
        commentCount: 12,
        isOraclePost: true,
        isFeatured: true,
        authorId: null,
        authorEmail: null,
        authorLevel: null,
        userReaction: 'resonate',
        totalReactions: 75,
        timeAgo: '5h_ago',
        displayTitle: 'BUFF3R_0V3RFL0W_W4RN1NG'
      },
      {
        id: 'mock-3',
        content: 'Every time I see a couples post on social media, my brain does this thing where it immediately calculates how long until they break up. Current accuracy rate: disturbingly high.',
        glitchCategory: 'loop_detected',
        glitchTitle: 'L00P_1NF1N1T3_D3T3CT3D',
        isAnonymous: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        resonateCount: 19,
        sameLoopCount: 22,
        draggedMeTooCount: 7,
        stoneColdCount: 26,
        cleansedCount: 3,
        commentCount: 15,
        isOraclePost: false,
        isFeatured: false,
        authorId: null,
        authorEmail: null,
        authorLevel: null,
        userReaction: 'stone_cold',
        totalReactions: 77,
        timeAgo: '1d_ago',
        displayTitle: 'L00P_1NF1N1T3_D3T3CT3D'
      }
    ];

    // Combine real and mock posts
    const allPosts = [...realPosts, ...mockPosts];

    // Apply filtering
    let filteredPosts = [...allPosts];
    
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.glitchCategory === category);
    }

    switch (filter) {
      case 'viral':
        filteredPosts = filteredPosts.filter(post => post.totalReactions >= 50);
        filteredPosts.sort((a, b) => b.totalReactions - a.totalReactions);
        break;
      case 'oracle':
        filteredPosts = filteredPosts.filter(post => post.isOraclePost);
        break;
      case 'pulse':
        // Last 24 hours, sorted by reactions
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        filteredPosts = filteredPosts.filter(post => post.createdAt.getTime() > oneDayAgo);
        filteredPosts.sort((a, b) => b.totalReactions - a.totalReactions);
        break;
      default: // recent
        filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        hasMore: offset + limit < filteredPosts.length,
      },
      filter,
      category,
    });

  } catch (error) {
    console.error('Wall feed error:', error);
    return NextResponse.json({ 
      error: 'Failed to load emotional data from the void' 
    }, { status: 500 });
  }
}

function getUserReaction(userId: string, postId: string): string | null {
  const reactionKey = `${userId}-${postId}`;
  const reaction = global.wallReactions?.get(reactionKey);
  return reaction ? reaction.reactionType : null;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just_transmitted';
  if (minutes < 60) return `${minutes}m_ago`;
  if (hours < 24) return `${hours}h_ago`;
  if (days < 7) return `${days}d_ago`;
  return date.toLocaleDateString();
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
