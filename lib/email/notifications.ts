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
        subject: "Your shield is ticking — log in today.",
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
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Shield is Ticking</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #0f0f23;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a2e;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .shield-icon {
      font-size: 40px;
      margin-bottom: 10px;
    }
    .content {
      padding: 30px 20px;
      color: #e2e8f0;
    }
    .streak-box {
      background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .streak-number {
      font-size: 36px;
      font-weight: bold;
      color: white;
      margin: 0;
    }
    .streak-label {
      color: #fbbf24;
      font-weight: 500;
      margin-top: 5px;
    }
    .ritual-preview {
      background: #334155;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
      margin: 20px 0;
    }
    .ritual-title {
      font-size: 18px;
      font-weight: 600;
      color: #f1f5f9;
      margin: 0 0 8px 0;
    }
    .ritual-meta {
      color: #94a3b8;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      padding: 20px;
      text-align: center;
      color: #64748b;
      font-size: 12px;
      border-top: 1px solid #334155;
    }
    .unsubscribe {
      color: #64748b;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="shield-icon">🛡️</div>
      <h1>Your Shield is Ticking</h1>
    </div>
    
    <div class="content">
      <p>Hey ${data.username},</p>
      
      <p>Your healing journey continues today. Time to check in and keep your momentum strong.</p>
      
      <div class="streak-box">
        <div class="streak-number">${data.streakDays}</div>
        <div class="streak-label">Day Streak</div>
      </div>
      
      <div class="ritual-preview">
        <div class="ritual-title">Today's Ritual: ${data.todayRitual.title}</div>
        <div class="ritual-meta">
          ${data.todayRitual.difficulty.charAt(0).toUpperCase() + data.todayRitual.difficulty.slice(1)} • 
          ${data.todayRitual.estimatedTime}
        </div>
      </div>
      
      <p>Ready to fortify your defenses? Your dashboard is waiting.</p>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
          Enter Dashboard →
        </a>
      </div>
      
      <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
        Remember: Every small action builds your resilience. You've got this.
      </p>
    </div>
    
    <div class="footer">
      <p>CTRL+ALT+BLOCK - Your Digital Healing Companion</p>
      <p>
        <a href="${data.unsubscribeUrl}" class="unsubscribe">Unsubscribe from daily reminders</a>
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  private static generateDailyReminderText(data: DailyNotificationData): string {
    return `
Your Shield is Ticking 🛡️

Hey ${data.username},

Your healing journey continues today. Time to check in and keep your momentum strong.

Current Streak: ${data.streakDays} days

Today's Ritual: ${data.todayRitual.title}
${data.todayRitual.difficulty.charAt(0).toUpperCase() + data.todayRitual.difficulty.slice(1)} • ${data.todayRitual.estimatedTime}

Ready to fortify your defenses? Visit your dashboard:
${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Remember: Every small action builds your resilience. You've got this.

---
CTRL+ALT+BLOCK - Your Digital Healing Companion

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
