import { Resend } from 'resend';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const resend = process.env.EMAIL_API_KEY ? new Resend(process.env.EMAIL_API_KEY) : null;

interface DailyNotificationData {
  username: string;
  streakDays: number;
  todayRitual: {
    title: string;
    difficulty: string;
    estimatedTime: string;
  };
  unsubscribeUrl: string;
}

export class EmailNotificationService {
  static async sendDailyReminder(userId: string): Promise<boolean> {
    try {
      // Check if Resend is configured
      if (!resend) {
        console.log('📧 Email service not configured (missing EMAIL_API_KEY)');
        return false;
      }

      // Get user data
      const [user] = await db
        .select({
          email: users.email,
          username: users.username,
          streakDays: users.streakDays,
          emailNotifications: users.emailNotifications,
          tier: users.tier
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user || !user.emailNotifications) {
        console.log('📧 User not eligible for email notifications');
        return false; // User doesn't exist or has opted out
      }

      // Get today's ritual preview
      const todayRitual = await this.getTodaysRitualPreview(userId);
      
      // Generate unsubscribe token
      const unsubscribeToken = await this.generateUnsubscribeToken(userId);
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${unsubscribeToken}`;

      const emailData: DailyNotificationData = {
        username: user.username || 'Warrior',
        streakDays: user.streakDays || 0,
        todayRitual,
        unsubscribeUrl
      };

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'CTRL+ALT+BLOCK <noreply@ctrlaltblock.com>',
        to: user.email,
        subject: "🛡️ Daily Protocol Active - Your Streak Continues",
        html: this.generateDailyReminderHTML(emailData),
        text: this.generateDailyReminderText(emailData)
      });

      return true;
    } catch (error) {
      console.error('Failed to send daily reminder:', error);
      return false;
    }
  }

  private static async getTodaysRitualPreview(userId: string) {
    // Get today's assigned ritual or generate one
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rituals/today`, {
        headers: { 'x-user-id': userId }
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.ritual?.title || 'Mindful Check-in',
          difficulty: data.ritual?.difficulty || 'easy',
          estimatedTime: data.ritual?.estimatedTime || '3 min'
        };
      }
    } catch (error) {
      console.error('Failed to fetch ritual preview:', error);
    }

    // Fallback ritual
    return {
      title: 'Mindful Check-in',
      difficulty: 'easy',
      estimatedTime: '3 min'
    };
  }

  private static async generateUnsubscribeToken(userId: string): Promise<string> {
    // Create a time-limited token for unsubscribing
    const payload = {
      userId,
      type: 'unsubscribe',
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };
    
    // Simple base64 encoding (in production, use proper JWT)
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private static generateDailyReminderHTML(data: DailyNotificationData): string {
    const streakEmoji = data.streakDays >= 30 ? '🏆' : data.streakDays >= 14 ? '🔥' : data.streakDays >= 7 ? '⚡' : '🌱';
    
    const emailContent = `
      <div class="content-card">
        <h2>DAILY PROTOCOL INITIATED</h2>
        
        <p>Hey <span class="neon-text">${data.username}</span>,</p>
        
        <p>Your healing protocol continues today. The system has detected it's time to strengthen your digital defenses and maintain your streak.</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${data.streakDays}</div>
            <div class="stat-label">Day Streak ${streakEmoji}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.todayRitual.estimatedTime}</div>
            <div class="stat-label">Today's Session</div>
          </div>
        </div>
        
        <div class="ritual-preview">
          <h3>🎯 TODAY'S RITUAL: ${data.todayRitual.title}</h3>
          <p><strong>Difficulty:</strong> ${data.todayRitual.difficulty.charAt(0).toUpperCase() + data.todayRitual.difficulty.slice(1)}</p>
          <p><strong>Estimated Time:</strong> ${data.todayRitual.estimatedTime}</p>
          <p>Ready to level up your mental defenses? Every ritual completed strengthens your resilience matrix.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn-brand-primary">
            🚀 ENTER DASHBOARD
          </a>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/daily-rituals" class="btn-brand-secondary">
            📋 VIEW ALL RITUALS
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-top: 30px;">
          <strong>System Message:</strong> Every small action builds your resilience. The glitch is temporary—your growth is permanent.
        </p>
        
        <div class="unsubscribe-note">
          <p><strong>Notification Settings:</strong> You can manage your email preferences anytime in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #8b5cf6;">dashboard settings</a> or <a href="${data.unsubscribeUrl}" style="color: #ef4444;">unsubscribe from daily reminders</a>.</p>
        </div>
      </div>
    `;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Protocol - CTRL+ALT+BLOCK</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
      color: #e2e8f0;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .brand-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px 20px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 16px;
      position: relative;
      overflow: hidden;
    }
    .brand-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: glitch-sweep 3s infinite;
    }
    @keyframes glitch-sweep {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    .brand-logo {
      color: #00ff9f;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      text-shadow: 0 0 10px rgba(0, 255, 159, 0.5);
      letter-spacing: 2px;
      position: relative;
      z-index: 2;
    }
    .brand-tagline {
      color: #8b5cf6;
      font-size: 12px;
      margin: 8px 0 0;
      letter-spacing: 1px;
      text-transform: uppercase;
      position: relative;
      z-index: 2;
    }
    .content-card {
      background: rgba(30, 30, 60, 0.9);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      backdrop-filter: blur(10px);
    }
    .btn-brand-primary {
      display: inline-block;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      color: white !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
      transition: all 0.3s ease;
      border: 1px solid rgba(139, 92, 246, 0.5);
      margin: 10px 0;
    }
    .btn-brand-secondary {
      display: inline-block;
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6 !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      border: 1px solid rgba(139, 92, 246, 0.5);
      margin: 10px 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #00ff9f;
      text-shadow: 0 0 5px rgba(0, 255, 159, 0.3);
    }
    .stat-label {
      font-size: 12px;
      color: #8b5cf6;
      text-transform: uppercase;
      margin-top: 5px;
    }
    .ritual-preview {
      background: rgba(236, 72, 153, 0.1);
      border: 1px solid rgba(236, 72, 153, 0.3);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .neon-text {
      color: #00ff9f;
      text-shadow: 0 0 5px rgba(0, 255, 159, 0.5);
    }
    .footer {
      text-align: center;
      color: #64748b;
      font-size: 12px;
      margin-top: 40px;
      padding: 20px;
      border-top: 1px solid rgba(139, 92, 246, 0.2);
    }
    .footer a {
      color: #8b5cf6;
      text-decoration: none;
    }
    .footer a:hover {
      color: #00ff9f;
    }
    h2 {
      color: #00ff9f;
      font-size: 24px;
      margin: 0 0 20px;
      text-align: center;
      text-shadow: 0 0 8px rgba(0, 255, 159, 0.3);
    }
    h3 {
      color: #ec4899;
      font-size: 18px;
      margin: 0 0 10px;
    }
    p {
      margin: 16px 0;
      color: #e2e8f0;
    }
    .unsubscribe-note {
      background: rgba(100, 116, 139, 0.1);
      border: 1px solid rgba(100, 116, 139, 0.3);
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 13px;
      color: #94a3b8;
    }
    @media (max-width: 600px) {
      .email-container {
        padding: 10px;
      }
      .content-card {
        padding: 20px;
      }
      .btn-brand-primary, .btn-brand-secondary {
        padding: 14px 24px;
        font-size: 14px;
        display: block;
        text-align: center;
        margin: 10px 0;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    
    <!-- Brand Header -->
    <div class="brand-header">
      <h1 class="brand-logo">CTRL+ALT+BLOCK</h1>
      <p class="brand-tagline">GLITCH-CORE HEALING PROTOCOL</p>
    </div>

    ${emailContent}

    <!-- Footer -->
    <div class="footer">
      <p>This is an automated message from <strong>CTRL+ALT+BLOCK™</strong></p>
      <p>Your digital healing companion | Built for warriors, by warriors</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Dashboard</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">Settings</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/crisis-support">Crisis Support</a>
      </p>
    </div>

  </div>
</body>
</html>`;
  }

  private static generateDailyReminderText(data: DailyNotificationData): string {
    const streakEmoji = data.streakDays >= 30 ? '🏆' : data.streakDays >= 14 ? '🔥' : data.streakDays >= 7 ? '⚡' : '🌱';
    
    return `
CTRL+ALT+BLOCK™ - Daily Protocol Initiated 🛡️

Hey ${data.username},

Your healing protocol continues today. The system has detected it's time to strengthen your digital defenses and maintain your streak.

CURRENT STATS:
• Streak: ${data.streakDays} days ${streakEmoji}
• Today's Session: ${data.todayRitual.estimatedTime}

TODAY'S RITUAL: ${data.todayRitual.title}
Difficulty: ${data.todayRitual.difficulty.charAt(0).toUpperCase() + data.todayRitual.difficulty.slice(1)}
Estimated Time: ${data.todayRitual.estimatedTime}

Ready to level up your mental defenses? Every ritual completed strengthens your resilience matrix.

QUICK ACTIONS:
• Enter Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
• View All Rituals: ${process.env.NEXT_PUBLIC_APP_URL}/daily-rituals
• Crisis Support: ${process.env.NEXT_PUBLIC_APP_URL}/crisis-support

System Message: Every small action builds your resilience. The glitch is temporary—your growth is permanent.

---
CTRL+ALT+BLOCK™ - Glitch-Core Healing Protocol
Your digital healing companion | Built for warriors, by warriors

Notification Settings: ${process.env.NEXT_PUBLIC_APP_URL}/settings
Unsubscribe: ${data.unsubscribeUrl}
`;
  }

  static async sendBulkDailyReminders(): Promise<{ sent: number; failed: number }> {
    try {
      // Check if Resend is configured
      if (!resend) {
        console.log('📧 Email service not configured (missing EMAIL_API_KEY)');
        return { sent: 0, failed: 0 };
      }

      // Get all users who have email notifications enabled
      const usersToNotify = await db
        .select({ id: users.id })
        .from(users)
        .where(and(
          eq(users.emailNotifications, true),
          eq(users.status, 'active')
        ));

      let sent = 0;
      let failed = 0;

      for (const user of usersToNotify) {
        const success = await this.sendDailyReminder(user.id);
        if (success) sent++;
        else failed++;

        // Rate limiting: wait 100ms between emails
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return { sent, failed };
    } catch (error) {
      console.error('Failed to send bulk daily reminders:', error);
      return { sent: 0, failed: 0 };
    }
  }
}
