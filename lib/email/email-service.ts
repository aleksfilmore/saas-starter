import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY);

// Brand-consistent email template wrapper
const createEmailTemplate = (content: string, title: string = 'CTRL+ALT+BLOCK') => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
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
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
      transition: all 0.3s ease;
      border: 1px solid rgba(139, 92, 246, 0.5);
    }
    .btn-brand-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(139, 92, 246, 0.6);
    }
    .alert-danger {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid #ef4444;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .alert-info {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .neon-text {
      color: #00ff9f;
      text-shadow: 0 0 5px rgba(0, 255, 159, 0.5);
    }
    .code-block {
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-left: 4px solid #8b5cf6;
      padding: 15px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      word-break: break-all;
      color: #8b5cf6;
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
    p {
      margin: 16px 0;
      color: #e2e8f0;
    }
    ul {
      color: #e2e8f0;
      margin: 16px 0;
      padding-left: 20px;
    }
    li {
      margin: 8px 0;
    }
    .crisis-box {
      background: rgba(239, 68, 68, 0.2);
      border: 2px solid #ef4444;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .crisis-box h3 {
      color: #ef4444;
      margin: 0 0 10px;
      font-size: 18px;
    }
    @media (max-width: 600px) {
      .email-container {
        padding: 10px;
      }
      .content-card {
        padding: 20px;
      }
      .btn-brand-primary {
        padding: 14px 24px;
        font-size: 14px;
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

    ${content}

    <!-- Footer -->
    <div class="footer">
      <p>This is an automated message from <strong>CTRL+ALT+BLOCK™</strong></p>
      <p>Your digital healing companion | Built for warriors, by warriors</p>
      <p>
        Need help? <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">Contact Support</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/crisis-support">Crisis Support</a>
      </p>
    </div>

  </div>
</body>
</html>`;
};

export async function sendPasswordResetEmail(email: string, resetToken: string, name?: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  const emailContent = `
    <div class="content-card">
      <h2>PASSWORD RESET PROTOCOL</h2>
      
      <div class="alert-info">
        <p><strong>SECURITY BREACH DETECTED:</strong> Someone (hopefully you) requested a password reset for your account.</p>
      </div>

      <p>${name ? `Hello <span class="neon-text">${name}</span>,` : 'Hello,'}</p>

      <p>A password reset request has been initiated for your <span class="neon-text">CTRL+ALT+BLOCK</span> account. If this was you, click the secure link below to create a new password:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="btn-brand-primary">
          � RESET PASSWORD
        </a>
      </div>

      <div class="code-block">
        <strong>SECURITY TOKEN:</strong> ${resetToken.substring(0, 8)}...
        <br><strong>EXPIRES:</strong> 1 hour from now
      </div>

      <div class="alert-danger">
        <p><strong>⚠️ SECURITY WARNING:</strong></p>
        <ul>
          <li>This link expires in 1 hour for your protection</li>
          <li>If you didn't request this reset, your account may be compromised</li>
          <li>Never share this link with anyone</li>
          <li>Change your password immediately if suspicious activity is detected</li>
        </ul>
      </div>

      <p>If you didn't request this password reset, please ignore this email or contact our security team immediately.</p>

      <div class="crisis-box">
        <h3>🆘 NEED IMMEDIATE SUPPORT?</h3>
        <p>If you're in crisis, <a href="${process.env.NEXT_PUBLIC_APP_URL}/crisis-support" style="color: #00ff9f; font-weight: bold;">click here for immediate resources</a></p>
      </div>
    </div>
  `;

  try {
    console.log('🔧 Attempting to send reset email to:', email);
    console.log('🔧 Using token:', resetToken.substring(0, 8) + '...');

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: '🔐 CTRL+ALT+BLOCK - Password Reset Protocol Initiated',
      html: createEmailTemplate(emailContent, 'Password Reset - CTRL+ALT+BLOCK'),
      text: `
CTRL+ALT+BLOCK™ - Password Reset Protocol

${name ? `Hello ${name},` : 'Hello,'}

A password reset request has been initiated for your account. If this was you, visit this link to reset your password:

${resetUrl}

SECURITY NOTICE:
- This link expires in 1 hour
- If you didn't request this reset, ignore this email
- Never share your access codes with anyone
- Contact support if you notice suspicious activity

Need immediate crisis support? Visit: ${process.env.NEXT_PUBLIC_APP_URL}/crisis-support

CTRL+ALT+BLOCK™ - Glitch-Core Healing Protocol
      `,
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
