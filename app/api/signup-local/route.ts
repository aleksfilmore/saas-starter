// Alternative authentication system using local storage for development
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Simple ID generator
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Global storage for persistence across requests
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
}

// Initialize global storage if not exists
if (!global.localUsers) {
  global.localUsers = new Map();
}
if (!global.localSessions) {
  global.localSessions = new Map();
}

export async function POST(request: NextRequest) {
  console.log('=== Local Signup API Called ===');
  
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();
    
    console.log('Signup attempt:', { email, username });
    
    // Validation
    if (!email || !username || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Passwords do not match'
      }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters'
      }, { status: 400 });
    }
    
    // Check if user already exists
    for (const [id, user] of global.localUsers) {
      if (user.email === email || user.username === username) {
        return NextResponse.json({
          success: false,
          error: 'User already exists with this email or username'
        }, { status: 400 });
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const userId = generateId();
    const newUser = {
      id: userId,
      email,
      username,
      hashedPassword,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      xp: 0,
      bytes: 0,
      level: 1,
      ritualStreak: 0,
      totalConfessions: 0,
      totalWallBytes: 0
    };
    
    global.localUsers.set(userId, newUser);
    
    // Create session
    const sessionId = generateId();
    const session = {
      id: sessionId,
      userId,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    global.localSessions.set(sessionId, session);
    
    console.log('✅ User created successfully:', { userId, email, username });
    console.log('Total users:', global.localUsers.size);
    
    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: userId,
        email,
        username,
        xp: 0,
        bytes: 0,
        level: 1
      }
    });
    
    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
