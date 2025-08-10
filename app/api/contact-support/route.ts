import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, priority } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = {
      to: 'support@ctrlaltblock.com',
      from: 'noreply@ctrlaltblock.com',
      subject: `[${priority.toUpperCase()}] Support Request: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Priority: ${priority}
Subject: ${subject}

Message:
${message}

---
Sent from CTRL+ALT+BLOCK Contact Form
Time: ${new Date().toISOString()}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7C3AED;">New Support Request</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Priority:</strong> <span style="text-transform: uppercase; color: ${getPriorityColor(priority)};">${priority}</span></p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="color: #666; font-size: 12px;">
            Sent from CTRL+ALT+BLOCK Contact Form<br />
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll just log it and return success
    console.log('📧 Contact form submission:', emailContent);

    // In a real implementation, you'd send the email here:
    // await sendEmail(emailContent);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return '#DC2626';
    case 'high': return '#EA580C';
    case 'normal': return '#059669';
    case 'low': return '#0284C7';
    default: return '#6B7280';
  }
}
