import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category = 'heartbreak', isPrivate = false } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // For now, return mock success response
    // This would integrate with actual wall implementation
    const newEntry = {
      id: Date.now().toString(),
      title,
      description,
      category,
      isPrivate,
      reactions: { heart: 0, fire: 0, cry: 0 },
      userReaction: null,
      createdAt: new Date().toISOString(),
      userId: sessionUser.id
    };

    return NextResponse.json({
      success: true,
      message: 'Wall entry created successfully',
      data: newEntry
    });

  } catch (error) {
    console.error('Create wall entry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
