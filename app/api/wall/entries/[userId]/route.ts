import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return mock data since wall implementation needs to be integrated
    // This maintains API compatibility with mobile app
    const mockEntries = [
      {
        id: '1',
        title: 'First Heartbreak',
        description: 'Learning to heal from my first serious relationship ending.',
        category: 'heartbreak',
        isPrivate: false,
        reactions: { heart: 5, fire: 2, cry: 1 },
        userReaction: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        userId: resolvedParams.userId
      },
      {
        id: '2', 
        title: 'Trust Issues',
        description: 'Working through my fear of trusting someone new.',
        category: 'trust',
        isPrivate: true,
        reactions: { heart: 0, fire: 0, cry: 0 },
        userReaction: null,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        userId: resolvedParams.userId
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockEntries
    });

  } catch (error) {
    console.error('Get wall entries API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { user: sessionUser } = await validateRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only create entries for themselves
    if (sessionUser.id !== resolvedParams.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
      userId: resolvedParams.userId
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
