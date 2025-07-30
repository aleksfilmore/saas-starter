// Wall of Wounds API - CREATE (Mock Version)
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

interface CreateWallPostRequest {
  content: string;
  glitchCategory: string;
  isAnonymous: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateWallPostRequest = await request.json();
    const { content, glitchCategory, isAnonymous } = body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Content too long (max 2000 characters)' }, { status: 400 });
    }

    // Mock post creation - replace with real database operations once database is properly set up
    const mockPost = {
      id: `mock-${Date.now()}`,
      content: content.trim(),
      glitchCategory,
      glitchTitle: generateGlitchTitle(glitchCategory),
      isAnonymous,
      userId: isAnonymous ? null : user.id,
      createdAt: new Date(),
      resonateCount: 0,
      sameLoopCount: 0,
      draggedMeTooCount: 0,
      stoneColdCount: 0,
      cleansedCount: 0,
      commentCount: 0,
      isOraclePost: false,
      isFeatured: false,
      bytesEarned: 25
    };

    console.log(`Mock post created:`, mockPost);

    return NextResponse.json({
      success: true,
      message: 'Emotional data transmitted to the void',
      post: mockPost,
      rewards: {
        xp: 10,
        bytes: 25,
        badgesEarned: []
      }
    });

  } catch (error) {
    console.error('Wall post creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to transmit to the emotional void' 
    }, { status: 500 });
  }
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

    const body: CreateWallPostRequest = await request.json();
    const { content, glitchCategory, isAnonymous } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Content too long (max 2000 chars)' }, { status: 400 });
    }

    const validCategories = [
      'system_error', 'loop_detected', 'memory_leak', 'buffer_overflow',
      'syntax_error', 'null_pointer', 'stack_overflow', 'access_denied'
    ];

    if (!validCategories.includes(glitchCategory)) {
      return NextResponse.json({ error: 'Invalid glitch category' }, { status: 400 });
    }

    // Generate glitch-coded title based on category
    const glitchTitles = {
      system_error: '5Y5T3M_3RR0R_D3T3CT3D',
      loop_detected: 'L00P_1NF1N1T3_D3T3CT3D', 
      memory_leak: 'M3M0RY_L34K_1D3NT1F13D',
      buffer_overflow: 'BUFF3R_0V3RFL0W_W4RN1NG',
      syntax_error: '5YNT4X_3RR0R_L1N3_0',
      null_pointer: 'NULL_P01NT3R_3XC3PT10N',
      stack_overflow: '5T4CK_0V3RFL0W_3XC3PT10N',
      access_denied: '4CC355_D3N13D_3RR0R_403'
    };

    // Create wall post
    const postId = generateId(15);
    
    await db.insert(anonymousPosts).values({
      id: postId,
      userId: user.id,
      content: content.trim(),
      glitchCategory,
      glitchTitle: glitchTitles[glitchCategory as keyof typeof glitchTitles],
      isAnonymous,
    });

    // Award XP and Bytes for posting
    await awardXP(user.id, XP_REWARDS.WALL_POST);

    await awardBytes(user.id, BYTE_REWARDS.WALL_POST);

    // Check for wall post badges
    await checkAndAwardBadges(user.id, 'wall_post');

    return NextResponse.json({ 
      success: true, 
      postId,
      message: 'Your wounds have been processed and added to the void...' 
    });

  } catch (error) {
    console.error('Wall post creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to process your emotional data' 
    }, { status: 500 });
  }
}
