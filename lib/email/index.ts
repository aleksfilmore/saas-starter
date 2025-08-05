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
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your CTRL+ALT+BLOCK Password</title>
          <style>
            /* Reset styles */
            body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
            
            /* Base styles */
            body {
              margin: 0;
              padding: 0;
              width: 100% !important;
              min-width: 100%;
              background: linear-gradient(135deg, #0f0f23 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f0f23 100%);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #e2e8f0;
              min-height: 100vh;
            }
            
            /* Container */
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: transparent;
              padding: 20px;
            }
            
            /* Header */
            .header {
              text-align: center;
              padding: 40px 0 20px;
            }
            
            .logo {
              font-size: 32px;
              font-weight: 900;
              letter-spacing: -0.5px;
              margin-bottom: 8px;
            }
            
            .logo-ctrl { color: #ffffff; }
            .logo-plus { color: #94a3b8; }
            .logo-alt { color: #ffffff; }
            .logo-plus2 { color: #94a3b8; }
            .logo-block { 
              background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .tagline {
              color: #94a3b8;
              font-size: 14px;
              margin-top: 8px;
              font-weight: 500;
            }
            
            /* Main content card */
            .content-card {
              background: rgba(17, 24, 39, 0.95);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(75, 85, 99, 0.3);
              border-radius: 16px;
              padding: 48px 40px;
              margin: 20px 0;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              position: relative;
              overflow: hidden;
            }
            
            .content-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 2px;
              background: linear-gradient(90deg, #a855f7, #ec4899, #f59e0b, #10b981);
            }
            
            /* Typography */
            .title {
              font-size: 28px;
              font-weight: 800;
              margin: 0 0 24px;
              background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-align: center;
            }
            
            .subtitle {
              font-size: 18px;
              color: #d1d5db;
              margin: 0 0 32px;
              text-align: center;
              font-weight: 500;
            }
            
            .message {
              font-size: 16px;
              color: #e5e7eb;
              margin: 0 0 32px;
              line-height: 1.7;
            }
            
            /* Button */
            .button-container {
              text-align: center;
              margin: 40px 0;
            }
            
            .reset-button {
              display: inline-block;
              padding: 18px 36px;
              background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 16px;
              letter-spacing: 0.5px;
              box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.4);
              transition: all 0.2s ease;
              border: none;
              text-transform: uppercase;
            }
            
            .reset-button:hover {
              transform: translateY(-1px);
              box-shadow: 0 12px 30px -5px rgba(168, 85, 247, 0.5);
            }
            
            /* Security notice */
            .security-notice {
              background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%);
              border: 1px solid rgba(245, 158, 11, 0.3);
              border-radius: 12px;
              padding: 20px;
              margin: 32px 0;
            }
            
            .security-notice-title {
              color: #fbbf24;
              font-weight: 700;
              font-size: 14px;
              margin: 0 0 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .security-notice-text {
              color: #fde68a;
              font-size: 14px;
              margin: 0;
              line-height: 1.5;
            }
            
            /* Link fallback */
            .link-fallback {
              background: rgba(55, 65, 81, 0.5);
              border: 1px solid rgba(75, 85, 99, 0.3);
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            
            .link-fallback-text {
              color: #9ca3af;
              font-size: 14px;
              margin: 0 0 8px;
            }
            
            .link-url {
              word-break: break-all;
              color: #a855f7;
              font-size: 13px;
              font-family: 'Monaco', 'Menlo', monospace;
              background: rgba(17, 24, 39, 0.8);
              padding: 8px;
              border-radius: 4px;
              border: 1px solid rgba(75, 85, 99, 0.2);
            }
            
            /* Footer */
            .footer {
              text-align: center;
              padding: 40px 20px 20px;
            }
            
            .footer-text {
              color: #6b7280;
              font-size: 14px;
              margin: 0 0 8px;
            }
            
            .footer-brand {
              color: #9ca3af;
              font-size: 12px;
              margin: 0;
              font-weight: 600;
            }
            
            /* Responsive */
            @media only screen and (max-width: 600px) {
              .email-container { padding: 10px; }
              .content-card { padding: 32px 24px; }
              .title { font-size: 24px; }
              .subtitle { font-size: 16px; }
              .reset-button { padding: 16px 28px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <div class="logo">
                <span class="logo-ctrl">CTRL</span><span class="logo-plus">+</span><span class="logo-alt">ALT</span><span class="logo-plus2">+</span><span class="logo-block">BLOCK</span>
              </div>
              <div class="tagline">Digital Healing Platform</div>
            </div>
            
            <!-- Main Content -->
            <div class="content-card">
              <h1 class="title">Reset Your Password</h1>
              <p class="subtitle">Secure access to your healing journey</p>
              
              <p class="message">
                We received a request to reset the password for your CTRL+ALT+BLOCK account. 
                Click the button below to create a new secure password and continue your healing journey.
              </p>
              
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              
              <div class="security-notice">
                <div class="security-notice-title">🔒 Security Notice</div>
                <div class="security-notice-text">
                  This link will expire in 1 hour for your security. If you didn't request this password reset, 
                  please ignore this email and your account will remain secure.
                </div>
              </div>
              
              <div class="link-fallback">
                <p class="link-fallback-text">If the button doesn't work, copy and paste this link:</p>
                <div class="link-url">${resetUrl}</div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">This email was sent by CTRL+ALT+BLOCK</p>
              <p class="footer-brand">Your privacy-first healing platform</p>
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
