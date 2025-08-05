import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  try {
    console.log('🔧 Attempting to send reset email to:', email);
    console.log('🔧 Using token:', token.substring(0, 8) + '...');
    console.log('🔧 API Key configured:', !!process.env.EMAIL_API_KEY);
    console.log('🔧 From email:', process.env.EMAIL_FROM);

    if (!process.env.EMAIL_API_KEY) {
      throw new Error('EMAIL_API_KEY is not configured');
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM is not configured');
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ctrlaltblock.com'}/reset-password?token=${token}`;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🔐 CTRL+ALT+BLOCK - Reset Your Access Codes',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); font-family: 'Courier New', monospace;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #00ff9f; font-size: 32px; font-weight: bold; margin: 0; text-shadow: 0 0 10px rgba(0, 255, 159, 0.3);">
                CTRL+ALT+BLOCK™
              </h1>
              <p style="color: #8b5cf6; font-size: 14px; margin: 5px 0;">
                GLITCH-CORE HEALING PROTOCOL
              </p>
            </div>

            <!-- Main Content -->
            <div style="background: rgba(30, 30, 60, 0.8); border: 1px solid #8b5cf6; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
              <h2 style="color: #00ff9f; font-size: 24px; margin: 0 0 20px; text-align: center;">
                🔐 ACCESS CODE RESET INITIATED
              </h2>
              
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                ${name ? `Hello ${name},` : 'Hello,'}
              </p>
              
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Someone requested a password reset for your CTRL+ALT+BLOCK account. If this was you, click the button below to reset your access codes:
              </p>

              <!-- Reset Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); transition: all 0.3s ease;">
                  🚀 RESET ACCESS CODES
                </a>
              </div>

              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                If the button doesn't work, copy and paste this URL into your browser:
              </p>
              
              <p style="color: #8b5cf6; font-size: 14px; word-break: break-all; background: rgba(139, 92, 246, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #8b5cf6;">
                ${resetUrl}
              </p>
            </div>

            <!-- Security Notice -->
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h3 style="color: #ef4444; font-size: 16px; margin: 0 0 10px;">
                ⚠️ SECURITY PROTOCOL
              </h3>
              <ul style="color: #e2e8f0; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>This reset link expires in 1 hour</li>
                <li>If you didn't request this, ignore this email</li>
                <li>Never share your access codes with anyone</li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">
                This is an automated message from CTRL+ALT+BLOCK™
              </p>
              <p style="margin: 5px 0 0;">
                Need help? Contact support at your dashboard
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
      text: `
CTRL+ALT+BLOCK™ - Reset Your Access Codes

${name ? `Hello ${name},` : 'Hello,'}

Someone requested a password reset for your account. If this was you, visit this link to reset your password:

${resetUrl}

This link expires in 1 hour. If you didn't request this reset, you can safely ignore this email.

Security reminders:
- Never share your access codes
- Always log out on shared devices
- Contact support if you notice suspicious activity

CTRL+ALT+BLOCK™ Team
      `,
      // Disable Resend's click tracking to prevent URL wrapping
      tags: [{ name: 'category', value: 'password_reset' }],
      headers: {
        'X-Resend-Track-Links': 'false',
        'X-Resend-Track-Opens': 'false'
      }
    });

    console.log('✅ Email sent successfully:', result);
    return { success: true, messageId: result.data?.id };

  } catch (error) {
    console.error('❌ Failed to send reset email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
