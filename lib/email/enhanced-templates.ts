import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY);

// Enhanced email template system with improved design and better user experience
export const EmailTemplates = {
  // Base template wrapper with dark theme and cyber aesthetic
  createBaseTemplate: (content: string, title: string = 'CTRL+ALT+BLOCK', type: 'verification' | 'reset' | 'welcome' | 'notification' | 'reminder' = 'verification') => {
    const typeConfig = {
      verification: { 
        primary: '#00ff9f', 
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        glow: 'rgba(0, 255, 159, 0.6)',
        icon: '✅',
        bgGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 25%, #0f1419 50%, #1a1a3a 75%, #0a0a1a 100%)'
      },
      reset: { 
        primary: '#ef4444', 
        secondary: '#f59e0b',
        accent: '#8b5cf6',
        glow: 'rgba(239, 68, 68, 0.6)',
        icon: '🔐',
        bgGradient: 'linear-gradient(135deg, #1a0a0a 0%, #2e1a0a 25%, #191409 50%, #3a1a1a 75%, #1a0a0a 100%)'
      },
      welcome: { 
        primary: '#06b6d4', 
        secondary: '#8b5cf6',
        accent: '#00ff9f',
        glow: 'rgba(6, 182, 212, 0.6)',
        icon: '🎮',
        bgGradient: 'linear-gradient(135deg, #0a1a1a 0%, #0a1a2e 25%, #091419 50%, #1a1a3a 75%, #0a1a1a 100%)'
      },
      notification: { 
        primary: '#8b5cf6', 
        secondary: '#ec4899',
        accent: '#06b6d4',
        glow: 'rgba(139, 92, 246, 0.6)',
        icon: '🔔',
        bgGradient: 'linear-gradient(135deg, #1a0a1a 0%, #2e0a1a 25%, #19091f 50%, #3a1a3a 75%, #1a0a1a 100%)'
      },
      reminder: { 
        primary: '#f59e0b', 
        secondary: '#8b5cf6',
        accent: '#00ff9f',
        glow: 'rgba(245, 158, 11, 0.6)',
        icon: '⏰',
        bgGradient: 'linear-gradient(135deg, #1a1a0a 0%, #2e2e0a 25%, #191909 50%, #3a3a1a 75%, #1a1a0a 100%)'
      }
    };
    
    const config = typeConfig[type];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    /* Import optimized fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      background: ${config.bgGradient};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #e2e8f0;
      line-height: 1.7;
      min-height: 100vh;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    .email-wrapper {
      width: 100%;
      background: ${config.bgGradient};
      padding: 40px 20px;
      min-height: 100vh;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(20, 20, 40, 0.95);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 20px;
      overflow: hidden;
      backdrop-filter: blur(20px);
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, 
        rgba(139, 92, 246, 0.2) 0%, 
        rgba(236, 72, 153, 0.15) 35%,
        rgba(0, 255, 159, 0.1) 70%,
        rgba(139, 92, 246, 0.2) 100%);
      padding: 50px 40px;
      text-align: center;
      position: relative;
      border-bottom: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(ellipse at top left, ${config.glow} 0%, transparent 50%),
        radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.2) 0%, transparent 50%);
      animation: float 8s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
      33% { transform: translate(-5px, -5px) scale(1.02); opacity: 0.9; }
      66% { transform: translate(5px, -3px) scale(0.98); opacity: 0.8; }
    }
    
    .logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 28px;
      font-weight: 800;
      color: ${config.primary};
      margin-bottom: 12px;
      letter-spacing: 2px;
      text-shadow: 
        0 0 20px ${config.glow},
        0 0 40px ${config.glow},
        0 2px 4px rgba(0, 0, 0, 0.7);
      position: relative;
      z-index: 2;
    }
    
    .tagline {
      font-size: 13px;
      color: ${config.secondary};
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      opacity: 0.9;
      position: relative;
      z-index: 2;
    }
    
    .content {
      padding: 50px 40px;
    }
    
    .content h1, .content h2 {
      color: ${config.primary};
      font-weight: 700;
      margin-bottom: 20px;
      text-shadow: 0 0 10px ${config.glow};
    }
    
    .content h1 {
      font-size: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .content h2 {
      font-size: 20px;
    }
    
    .content p {
      margin-bottom: 20px;
      color: #cbd5e1;
      font-size: 16px;
    }
    
    .highlight {
      color: ${config.primary};
      font-weight: 600;
      text-shadow: 0 0 5px ${config.glow};
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${config.primary} 0%, ${config.secondary} 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 18px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      box-shadow: 
        0 8px 30px ${config.glow},
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      margin: 25px 0;
      min-width: 200px;
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 12px 40px ${config.glow},
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    
    .info-box {
      background: linear-gradient(135deg, 
        rgba(139, 92, 246, 0.1) 0%, 
        rgba(6, 182, 212, 0.05) 100%);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
      position: relative;
    }
    
    .info-box::before {
      content: '${config.icon}';
      position: absolute;
      top: -12px;
      left: 20px;
      background: rgba(20, 20, 40, 0.95);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 18px;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .warning-box {
      background: linear-gradient(135deg, 
        rgba(239, 68, 68, 0.1) 0%, 
        rgba(245, 158, 11, 0.05) 100%);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 12px;
      padding: 20px;
      margin: 25px 0;
      color: #fca5a5;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .feature-item {
      background: rgba(139, 92, 246, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 10px;
      padding: 20px;
      text-align: center;
    }
    
    .feature-icon {
      font-size: 24px;
      margin-bottom: 10px;
      display: block;
    }
    
    .footer {
      background: rgba(10, 10, 26, 0.8);
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid rgba(139, 92, 246, 0.2);
      color: #94a3b8;
      font-size: 14px;
    }
    
    .footer a {
      color: ${config.primary};
      text-decoration: none;
    }
    
    .unsubscribe {
      margin-top: 20px;
      font-size: 12px;
      color: #64748b;
    }
    
    .unsubscribe a {
      color: #94a3b8;
      text-decoration: underline;
    }
    
    /* Dark mode optimizations */
    @media (prefers-color-scheme: dark) {
      .content p {
        color: #e2e8f0;
      }
    }
    
    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }
      
      .header, .content, .footer {
        padding: 30px 25px;
      }
      
      .logo {
        font-size: 24px;
      }
      
      .content h1 {
        font-size: 20px;
      }
      
      .button {
        padding: 16px 24px;
        font-size: 15px;
        width: 100%;
        text-align: center;
      }
      
      .feature-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <div class="logo">CTRL+ALT+BLOCK</div>
        <div class="tagline">Glitch-Core Healing Protocol</div>
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p><strong>CTRL+ALT+BLOCK</strong> - Your Digital Healing Companion</p>
        <p>Built for warriors, by warriors | Powered by advanced AI therapy</p>
        
        <div class="unsubscribe">
          <p>This email was sent to support your healing journey.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Update preferences</a> | 
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">Contact support</a></p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  },

  // Enhanced email verification template
  verification: (email: string, verificationToken: string, name?: string) => {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    
    const content = `
      <h1>⚡ Verify Your Email & Unlock Rewards</h1>
      
      <p>Hey <span class="highlight">${name || 'warrior'}</span>,</p>
      
      <p>Welcome to <span class="highlight">CTRL+ALT+BLOCK</span>! You're one step away from unlocking your full healing toolkit. Verify your email to access exclusive features and earn instant rewards.</p>
      
      <div class="info-box">
        <h3 style="color: #00ff9f; margin: 0 0 15px;">🎁 Verification Rewards</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin: 8px 0; color: #cbd5e1;">🏆 <strong>+50 XP Points</strong> - Instant level boost</li>
          <li style="margin: 8px 0; color: #cbd5e1;">🛡️ <strong>Verified Badge</strong> - Show your commitment</li>
          <li style="margin: 8px 0; color: #cbd5e1;">🎯 <strong>Priority Support</strong> - Skip the queue</li>
          <li style="margin: 8px 0; color: #cbd5e1;">📊 <strong>Advanced Analytics</strong> - Track your progress</li>
          <li style="margin: 8px 0; color: #cbd5e1;">🔓 <strong>Exclusive Features</strong> - Members-only tools</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verificationUrl}" class="button">
          ✅ Verify Email & Claim Rewards
        </a>
      </div>
      
      <div class="feature-grid">
        <div class="feature-item">
          <span class="feature-icon">🤖</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">LUMO AI</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">24/7 therapeutic support</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📈</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">Progress Tracking</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">See your healing journey</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🛡️</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">No-Contact Shield</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Stay strong & protected</p>
        </div>
      </div>
      
      <div class="warning-box">
        <p style="margin: 0;"><strong>⏰ Security Notice:</strong> This verification link expires in 24 hours for your protection. Complete verification now to secure your account.</p>
      </div>
      
      <p style="font-size: 14px; color: #94a3b8; text-align: center;">
        You can continue using CTRL+ALT+BLOCK without verification, but verified users get the full experience with advanced features and priority support.
      </p>
      
      <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 30px;">
        Can't click the button? Copy and paste this link:<br>
        <code style="background: rgba(139, 92, 246, 0.1); padding: 8px; border-radius: 4px; word-break: break-all;">${verificationUrl}</code>
      </p>
    `;
    
    return EmailTemplates.createBaseTemplate(content, 'Verify Your Email - CTRL+ALT+BLOCK', 'verification');
  },

  // Enhanced welcome email template
  welcome: (email: string, name?: string, verificationToken?: string) => {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const verificationUrl = verificationToken ? `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}` : null;
    
    const content = `
      <h1>🎮 Welcome to the Healing Protocol</h1>
      
      <p>Hey <span class="highlight">${name || 'warrior'}</span>,</p>
      
      <p>You've just joined an elite community of digital warriors who refuse to let emotional pain control their lives. Your <span class="highlight">CTRL+ALT+BLOCK</span> healing protocol is now <strong>ACTIVE</strong>.</p>
      
      <div class="info-box">
        <h3 style="color: #06b6d4; margin: 0 0 15px;">🚀 Your Healing Toolkit</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin: 12px 0; color: #cbd5e1;">🛡️ <strong>Daily Rituals</strong> - Science-backed healing exercises</li>
          <li style="margin: 12px 0; color: #cbd5e1;">🤖 <strong>LUMO AI Support</strong> - 24/7 therapeutic companion</li>
          <li style="margin: 12px 0; color: #cbd5e1;">📊 <strong>Progress Tracking</strong> - See your healing journey unfold</li>
          <li style="margin: 12px 0; color: #cbd5e1;">🏆 <strong>Achievement System</strong> - Unlock badges and milestones</li>
          <li style="margin: 12px 0; color: #cbd5e1;">🧠 <strong>AI Therapy Sessions</strong> - Professional-grade support</li>
        </ul>
      </div>
      
      ${verificationUrl ? `
      <div style="background: linear-gradient(135deg, rgba(0, 255, 159, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%); border: 1px solid rgba(0, 255, 159, 0.3); border-radius: 12px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #00ff9f; margin: 0 0 15px;">⚡ Power Up: Verify Your Email</h3>
        <p style="margin: 0 0 20px; color: #cbd5e1;">Complete your setup and unlock exclusive features by verifying your email address.</p>
        <div style="text-align: center;">
          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #00ff9f 0%, #8b5cf6 100%); color: #ffffff !important; text-decoration: none; padding: 15px 30px; border-radius: 10px; font-weight: 600; font-size: 15px;">
            ✅ Verify Email & Get +50 XP
          </a>
        </div>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${dashboardUrl}" class="button">
          🚀 Enter Your Dashboard
        </a>
      </div>
      
      <div class="feature-grid">
        <div class="feature-item">
          <span class="feature-icon">🎯</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">First Steps</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Complete your first ritual</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">👤</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">Profile Setup</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Personalize your journey</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💬</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">Chat with LUMO</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Your AI companion awaits</p>
        </div>
      </div>
      
      <div class="warning-box">
        <p style="margin: 0;"><strong>🆘 Crisis Support:</strong> If you're in crisis or having thoughts of self-harm, <a href="${process.env.NEXT_PUBLIC_APP_URL}/crisis-support" style="color: #00ff9f; font-weight: bold;">get immediate help here</a>. Your wellbeing is our top priority.</p>
      </div>
      
      <p style="text-align: center; margin-top: 30px; color: #94a3b8;">
        Questions? Our support team and LUMO AI are standing by in your dashboard!
      </p>
    `;
    
    return EmailTemplates.createBaseTemplate(content, 'Welcome to CTRL+ALT+BLOCK', 'welcome');
  },

  // Enhanced password reset template
  passwordReset: (email: string, resetToken: string, name?: string) => {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const content = `
      <h1>🔐 Password Reset Protocol</h1>
      
      <p>Hello <span class="highlight">${name || 'warrior'}</span>,</p>
      
      <p>We received a request to reset your password for your <span class="highlight">CTRL+ALT+BLOCK</span> account. If this was you, click the secure link below to create a new password:</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" class="button">
          🔐 Reset My Password
        </a>
      </div>
      
      <div class="info-box">
        <h3 style="color: #ef4444; margin: 0 0 15px;">🛡️ Security Information</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin: 8px 0; color: #cbd5e1;">⏰ <strong>Expires in 1 hour</strong> - For your security</li>
          <li style="margin: 8px 0; color: #cbd5e1;">🔒 <strong>One-time use</strong> - Link becomes invalid after use</li>
          <li style="margin: 8px 0; color: #cbd5e1;">🌐 <strong>Secure connection</strong> - Encrypted data transmission</li>
          <li style="margin: 8px 0; color: #cbd5e1;">🚫 <strong>Never share</strong> - This link is for your eyes only</li>
        </ul>
      </div>
      
      <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #8b5cf6; margin: 0 0 12px; font-size: 18px;">🔧 Password Security Tips</h3>
        <ul style="margin: 0; padding-left: 20px; color: #cbd5e1;">
          <li>Use a unique, strong password (12+ characters)</li>
          <li>Include uppercase, lowercase, numbers, and symbols</li>
          <li>Never reuse passwords from other accounts</li>
          <li>Consider using a password manager</li>
          <li>Enable two-factor authentication when available</li>
        </ul>
      </div>
      
      <div class="warning-box">
        <p style="margin: 0;"><strong>Didn't request this reset?</strong> No worries - just ignore this email. If you suspect unauthorized access to your account, contact our security team immediately.</p>
      </div>
      
      <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 30px;">
        Having trouble with the button? Copy and paste this link:<br>
        <code style="background: rgba(139, 92, 246, 0.1); padding: 8px; border-radius: 4px; word-break: break-all;">${resetUrl}</code>
      </p>
    `;
    
    return EmailTemplates.createBaseTemplate(content, 'Reset Your Password - CTRL+ALT+BLOCK', 'reset');
  },

  // Daily reminder template
  dailyReminder: (email: string, name?: string, streakCount?: number, todayRituals?: any[]) => {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const ritualsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/daily-rituals`;
    
    const content = `
      <h1>⏰ Your Daily Healing Check-In</h1>
      
      <p>Good morning, <span class="highlight">${name || 'warrior'}</span>!</p>
      
      <p>Your healing journey continues today. You've got this! ${streakCount ? `You're on a <span class="highlight">${streakCount}-day streak</span> - keep the momentum going.` : 'Today is a perfect day to start building your healing streak.'}</p>
      
      ${todayRituals && todayRituals.length > 0 ? `
      <div class="info-box">
        <h3 style="color: #f59e0b; margin: 0 0 15px;">🎯 Today's Healing Rituals</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${todayRituals.map(ritual => `
            <li style="margin: 10px 0; color: #cbd5e1; padding: 10px; background: rgba(139, 92, 246, 0.05); border-radius: 6px;">
              <strong>${ritual.title}</strong><br>
              <span style="font-size: 14px; color: #94a3b8;">${ritual.description}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${ritualsUrl}" class="button">
          🚀 Start Today's Rituals
        </a>
      </div>
      
      <div class="feature-grid">
        <div class="feature-item">
          <span class="feature-icon">💪</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">Build Strength</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Every ritual makes you stronger</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔥</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">Maintain Streak</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Consistency creates transformation</p>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎯</span>
          <h4 style="color: #8b5cf6; margin: 0 0 8px;">Focus Forward</h4>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Your future self will thank you</p>
        </div>
      </div>
      
      <p style="text-align: center; margin-top: 30px; color: #94a3b8;">
        Remember: Healing isn't linear, but it's always worth it. You're stronger than you know.
      </p>
    `;
    
    return EmailTemplates.createBaseTemplate(content, 'Daily Healing Check-In - CTRL+ALT+BLOCK', 'reminder');
  }
};

// Export individual template functions for backward compatibility
export const sendEnhancedVerificationEmail = async (email: string, verificationToken: string, name?: string) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: '⚡ Verify Your Email & Unlock Rewards - CTRL+ALT+BLOCK',
      html: EmailTemplates.verification(email, verificationToken, name),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    console.log('✅ Enhanced verification email sent:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendEnhancedWelcomeEmail = async (email: string, name?: string, verificationToken?: string) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: '🎮 Welcome to CTRL+ALT+BLOCK - Your Healing Protocol is Active!',
      html: EmailTemplates.welcome(email, name, verificationToken),
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    });

    console.log('✅ Enhanced welcome email sent:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendEnhancedPasswordResetEmail = async (email: string, resetToken: string, name?: string) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: '🔐 Password Reset Request - CTRL+ALT+BLOCK',
      html: EmailTemplates.passwordReset(email, resetToken, name),
      headers: {
        'X-Priority': '2',
        'X-MSMail-Priority': 'High'
      }
    });

    console.log('✅ Enhanced password reset email sent:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendDailyReminderEmail = async (email: string, name?: string, streakCount?: number, todayRituals?: any[]) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `⏰ Your Daily Healing Check-In ${streakCount ? `(${streakCount}-day streak!)` : ''} - CTRL+ALT+BLOCK`,
      html: EmailTemplates.dailyReminder(email, name, streakCount, todayRituals),
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    });

    console.log('✅ Daily reminder email sent:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send daily reminder email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
