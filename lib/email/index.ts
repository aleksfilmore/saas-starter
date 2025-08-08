// Email service setup - supports both Resend and SendGrid
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private provider: 'resend' | 'sendgrid';

  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@ctrlaltblock.com';
    this.provider = (process.env.EMAIL_PROVIDER as 'resend' | 'sendgrid') || 'resend';
  }

  async sendEmail({ to, subject, html, from }: EmailOptions): Promise<EmailResponse> {
    if (!this.apiKey) {
      console.error('Email API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const fromAddress = from || this.fromEmail;

    try {
      if (this.provider === 'resend') {
        return await this.sendWithResend({ to, subject, html, from: fromAddress });
      } else {
        return await this.sendWithSendGrid({ to, subject, html, from: fromAddress });
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async sendWithResend({ to, subject, html, from }: Required<EmailOptions>): Promise<EmailResponse> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Resend API error' };
    }

    return { success: true, messageId: data.id };
  }

  private async sendWithSendGrid({ to, subject, html, from }: Required<EmailOptions>): Promise<EmailResponse> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: { email: from },
        subject,
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { success: false, error: `SendGrid API error: ${errorData}` };
    }

    return { success: true, messageId: response.headers.get('x-message-id') || 'unknown' };
  }

  // Password reset email template
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<EmailResponse> {
    const resetUrl = `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your CTRL+ALT+BLOCK Password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f0f23; color: #e2e8f0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #a855f7; }
            .content { background: #1a1a2e; padding: 40px; border-radius: 12px; border: 1px solid #374151; }
            .title { font-size: 28px; font-weight: bold; margin-bottom: 20px; background: linear-gradient(to right, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .button { display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #a855f7, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 14px; }
            .warning { background: #fef3c7; color: #92400e; padding: 16px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">CTRL+ALT+BLOCK</div>
            </div>
            <div class="content">
              <h1 class="title">Reset Your Password</h1>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #a855f7;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>This email was sent by CTRL+ALT+BLOCK. If you need help, contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject: 'Reset Your CTRL+ALT+BLOCK Password',
      html,
    });
  }
}

export const emailService = new EmailService();
