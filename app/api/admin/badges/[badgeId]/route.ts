import { NextRequest, NextResponse } from 'next/server';

// Import the badges array from the main route
// In a real implementation, this would be from your database
let badges: any[] = [];

export async function PUT(
  request: NextRequest,
  { params }: { params: { badgeId: string } }
) {
  try {
    const { badgeId } = params;
    const data = await request.json();

    // Find and update the badge
    const badgeIndex = badges.findIndex(badge => badge.id === badgeId);
    
    if (badgeIndex === -1) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      );
    }

    badges[badgeIndex] = {
      ...badges[badgeIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      badge: badges[badgeIndex]
    });

  } catch (error) {
    console.error('Error updating badge:', error);
    return NextResponse.json(
      { error: 'Failed to update badge' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { badgeId: string } }
) {
  try {
    const { badgeId } = params;

    // Find and remove the badge
    const badgeIndex = badges.findIndex(badge => badge.id === badgeId);
    
    if (badgeIndex === -1) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      );
    }

    badges.splice(badgeIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Badge deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting badge:', error);
    return NextResponse.json(
      { error: 'Failed to delete badge' },
      { status: 500 }
    );
  }
}
