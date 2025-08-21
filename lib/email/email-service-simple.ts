import { Resend } from 'resend';
import { ApiUsageTracker } from '@/lib/api-usage-tracker';
import { 
  EmailTemplates, 
  sendEnhancedVerificationEmail, 
  sendEnhancedWelcomeEmail, 
  sendEnhancedPasswordResetEmail,
  sendDailyReminderEmail 
} from './enhanced-templates';

const resend = new Resend(process.env.EMAIL_API_KEY);

// Email verification using enhanced template
export async function sendEmailVerificationEmail(email: string, verificationToken: string, name?: string) {
  try {
    // Track email usage
    await ApiUsageTracker.track({
      service: 'resend',
      endpoint: 'email_verification',
      success: true
    });

    // Use enhanced template
    return await sendEnhancedVerificationEmail(email, verificationToken, name);

  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    
    // Track failed email usage
    await ApiUsageTracker.track({
      service: 'resend',
      endpoint: 'email_verification',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Password reset using enhanced template
export async function sendPasswordResetEmail(email: string, resetToken: string, name?: string) {
  try {
    // Track email usage
    await ApiUsageTracker.track({
      service: 'resend',
      endpoint: 'password_reset',
      success: true
    });

    // Use enhanced template
    return await sendEnhancedPasswordResetEmail(email, resetToken, name);

  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    
    // Track failed email usage
    await ApiUsageTracker.track({
      service: 'resend',
      endpoint: 'password_reset',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Welcome email using enhanced template
export async function sendWelcomeEmail(email: string, name?: string, verificationToken?: string) {
  try {
    // Track email usage
    await ApiUsageTracker.track({
      service: 'resend',
      endpoint: 'welcome',
      success: true
    });

    // Use enhanced template
    return await sendEnhancedWelcomeEmail(email, name, verificationToken);

  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    
    // Track failed email usage
    await ApiUsageTracker.track({
      service: 'resend',
      endpoint: 'welcome',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Export enhanced templates for direct use
export { sendDailyReminderEmail };
export { sendEnhancedVerificationEmail, sendEnhancedWelcomeEmail, sendEnhancedPasswordResetEmail };
