// Local login API for development when database is unreachable
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Simple ID generator
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// These should match the ones from signup-local
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
  console.log('=== Local Login API Called ===');
  
  try {
    const formData = await request.formData();
    const login = formData.get('login')?.toString(); // email or username
    const password = formData.get('password')?.toString();
    
    console.log('Login attempt:', { login });
    
    // Validation
    if (!login || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email/username and password are required'
      }, { status: 400 });
    }
    
    // Find user by email or username
    let foundUser = null;
    for (const [id, user] of global.localUsers) {
      if (user.email === login || user.username === login) {
        foundUser = user;
        break;
      }
    }
    
    if (!foundUser) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 400 });
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, foundUser.hashedPassword);
    
    if (!passwordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 400 });
    }
    
    // Create new session
    const sessionId = generateId();
    const session = {
      id: sessionId,
      userId: foundUser.id,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    global.localSessions.set(sessionId, session);
    
    console.log('✅ User logged in successfully:', { 
      userId: foundUser.id, 
      email: foundUser.email, 
      username: foundUser.username 
    });
    
    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        xp: foundUser.xp || 0,
        bytes: foundUser.bytes || 0,
        level: foundUser.level || 1
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
    console.error('❌ Login error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
