import { NextRequest, NextResponse } from 'next/server';

// For now, we'll use a simple in-memory storage since badges aren't in the schema yet
// In a real implementation, you would add badges to your database schema

let badges: any[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first ritual',
    icon: 'trophy',
    category: 'achievement',
    rarity: 'common',
    requirement: 'Complete 1 ritual',
    isActive: true,
    earnedCount: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ritual Master',
    description: 'Complete 50 rituals',
    icon: 'crown',
    category: 'milestone',
    rarity: 'epic',
    requirement: 'Complete 50 rituals',
    isActive: true,
    earnedCount: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Wall Warrior',
    description: 'Share 10 posts on the wall',
    icon: 'heart',
    category: 'achievement',
    rarity: 'rare',
    requirement: 'Share 10 wall posts',
    isActive: true,
    earnedCount: 8,
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      badges: badges,
      total: badges.length
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newBadge = {
      id: (badges.length + 1).toString(),
      ...data,
      isActive: true,
      earnedCount: 0,
      createdAt: new Date().toISOString()
    };

    badges.push(newBadge);

    return NextResponse.json({
      success: true,
      badge: newBadge
    });

  } catch (error) {
    console.error('Error creating badge:', error);
    return NextResponse.json(
      { error: 'Failed to create badge' },
      { status: 500 }
    );
  }
}
