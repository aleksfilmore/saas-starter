/**
 * Onboarding Plan Selection API
 * CTRL+ALT+BLOCK™ Specification Section 4 & 12
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tier, quizResult } = await request.json();

    if (!tier || !quizResult) {
      return NextResponse.json(
        { error: 'Missing tier or quiz result' },
        { status: 400 }
      );
    }

    // For free tier, set up user account directly
    if (tier === 'ghost') {
      // In production, this would:
      // 1. Create/update user record with tier=ghost
      // 2. Set archetype from quiz result
      // 3. Initialize default settings
      // 4. Create session/auth tokens
      
      const userData = {
        tier: 'ghost',
        archetype: quizResult.archetypeCode,
        archetype_details: {
          attachment_style: quizResult.attachmentStyle,
          recommended_persona: quizResult.recommendedPersona,
          cbt_cue: quizResult.cbtCue,
          healing_focus: quizResult.focusBullets,
          traits: quizResult.traits,
          completed_at: quizResult.completedAt
        },
        entitlements: {
          daily_rituals: 1,
          can_reroll_rituals: false,
          shield_duration_hours: 24,
          weekly_auto_shield: false,
          can_post_wall: false,
          can_redeem_bytes: false,
          unlimited_chat: false,
          voice_minutes: 0
        },
        settings: {
          notifications: true,
          anonymous_wall: true,
          preferred_ritual_time: '09:00'
        }
      };

      console.log('Setting up ghost mode user:', userData);

      return NextResponse.json({
        success: true,
        tier: 'ghost',
        redirect: '/dashboard',
        user: userData
      });
    }

    // For paid tier, should redirect to Stripe (handled by frontend)
    return NextResponse.json({
      success: true,
      tier: 'firewall',
      redirect: '/stripe-checkout'
    });

  } catch (error) {
    console.error('Plan selection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
