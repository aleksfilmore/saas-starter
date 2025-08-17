import { NextRequest, NextResponse } from 'next/server';
import { SeedService } from '@/lib/seed/dummy-users';

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from an admin
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🌱 Starting dummy data seeding...');
    
    await SeedService.seedAll();
    
    return NextResponse.json({
      success: true,
      message: 'Dummy users and content created successfully',
      details: {
        users: '5 dummy users created',
        posts: '6 wall posts created',
        badges: 'Premium badges distributed'
      }
    });

  } catch (error) {
    console.error('Seed dummy data error:', error);
    return NextResponse.json(
      { error: 'Failed to seed dummy data' },
      { status: 500 }
    );
  }
}

// Allow manual triggering for testing (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization
    const testSecret = request.nextUrl.searchParams.get('secret');
    if (testSecret !== process.env.ADMIN_TEST_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await SeedService.seedAll();
    
    return NextResponse.json({
      success: true,
      message: 'Test dummy data seeded successfully'
    });

  } catch (error) {
    console.error('Test seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed test data' },
      { status: 500 }
    );
  }
}
