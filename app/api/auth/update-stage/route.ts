import { NextRequest, NextResponse } from 'next/server';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('session')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }
    
    // Check session
    const session = global.localSessions?.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Get user
    const user = global.localUsers?.get(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const { ux_stage } = await request.json();
    
    if (!ux_stage || !['welcome', 'starter', 'core', 'power'].includes(ux_stage)) {
      return NextResponse.json(
        { error: 'Invalid UX stage' },
        { status: 400 }
      );
    }
    
    // Update user's UX stage
    user.ux_stage = ux_stage;
    user.updatedAt = new Date().toISOString();
    
    global.localUsers.set(session.userId, user);
    
    return NextResponse.json({
      success: true,
      message: 'UX stage updated successfully',
      ux_stage
    });
    
  } catch (error) {
    console.error('Update stage error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
