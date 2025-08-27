import { NextRequest, NextResponse } from 'next/server';
// No lucia usage — enhanced signup creates local user then redirects to Auth0 hosted signup for session
import { generateId } from '@/lib/utils';
import bcrypt from 'bcryptjs';
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
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user (mock implementation)
  const userId = generateId();
    const newUser = {
      id: userId,
      email,
      alias,
      emotionalTone,
      hashedPassword,
  bytes: 200, // Starting bytes bonus
      week: 1,
      tier: 'free' as const,
  dailyBytes: 200,
  weeklyBytesTarget: 2000,
      streakDays: 1,
      totalSessions: 0,
      joinedAt: new Date(),
      lastActive: new Date()
    };

    // In real app: Save user to database
    console.log('Created enhanced user:', { ...newUser, hashedPassword: '[REDACTED]' });

  // After creating the user, redirect clients to Auth0 hosted signup to complete session establishment.
  const redirectUrl = new URL('/api/auth/signup', request.url);
  return NextResponse.redirect(redirectUrl, 303);

    // Enhanced response with onboarding data
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        alias: newUser.alias,
        emotionalTone: newUser.emotionalTone,
  bytes: newUser.bytes,
        tier: newUser.tier
      },
      achievements: [
        {
          id: 'welcome-aboard',
          title: 'Welcome Aboard',
          description: 'Joined the CTRL+ALT+BLOCK™ community',
          type: 'standard' as const,
          bytesValue: 200,
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
