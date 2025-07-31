import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';

interface EnhancedSignUpRequest {
  email: string;
  password: string;
  alias: string;
  emotionalTone: 'numb' | 'vengeance' | 'logic' | 'helpOthers';
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhancedSignUpRequest = await request.json();
    const { email, password, alias, emotionalTone } = body;

    // Enhanced validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!alias || alias.length < 3) {
      return NextResponse.json({ error: 'Alias must be at least 3 characters' }, { status: 400 });
    }

    if (!['numb', 'vengeance', 'logic', 'helpOthers'].includes(emotionalTone)) {
      return NextResponse.json({ error: 'Invalid emotional tone' }, { status: 400 });
    }

    // Check if user already exists (mock implementation)
    // In real app: check database for existing email/alias
    const existingUserCheck = Math.random() > 0.95; // 5% chance of "existing user"
    if (existingUserCheck) {
      return NextResponse.json({ error: 'Email or alias already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await new Argon2id().hash(password);
    
    // Create user (mock implementation)
    const userId = generateId(15);
    const newUser = {
      id: userId,
      email,
      alias,
      emotionalTone,
      hashedPassword,
      xp: 50, // Starting XP bonus
      week: 1,
      tier: 'free' as const,
      dailyXP: 50,
      weeklyXPTarget: 500,
      streakDays: 1,
      totalSessions: 0,
      joinedAt: new Date(),
      lastActive: new Date()
    };

    // In real app: Save user to database
    console.log('Created enhanced user:', { ...newUser, hashedPassword: '[REDACTED]' });

    // Create session
    const session = await lucia.createSession(userId, {
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1'
    });

    const sessionCookie = lucia.createSessionCookie(session.id);
    
    // Set cookie
    const cookieStore = cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Enhanced response with onboarding data
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        alias: newUser.alias,
        emotionalTone: newUser.emotionalTone,
        xp: newUser.xp,
        tier: newUser.tier
      },
      achievements: [
        {
          id: 'welcome-aboard',
          title: 'Welcome Aboard',
          description: 'Joined the CTRL+ALT+BLOCK™ community',
          type: 'standard' as const,
          xpValue: 50,
          unlockedAt: new Date()
        }
      ],
      nextSteps: {
        onboarding: true,
        firstSession: true,
        communityIntro: true
      }
    });

  } catch (error) {
    console.error('Enhanced signup error:', error);
    return NextResponse.json({ 
      error: 'Account creation failed. Please try again.' 
    }, { status: 500 });
  }
}
