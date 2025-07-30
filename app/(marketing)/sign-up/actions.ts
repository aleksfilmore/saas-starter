// File: app/sign-up/actions.ts

'use server';

// This interface defines the shape of the state object.
export interface ActionResult {
  error: string | null;
  success: boolean;
}

// This is the fix: The function's 'prevState' is now correctly typed to match
// the 'initialState' object from the page component.
export async function signup(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email');
  const password = formData.get('password');
  const acceptTerms = formData.get('acceptTerms');
  const acceptPrivacy = formData.get('acceptPrivacy');

  // Email validation
  if (typeof email !== 'string' || !email.includes('@')) {
    return { error: 'Please enter a valid email address.', success: false };
  }

  // Password validation
  if (typeof password !== 'string') {
    return { error: 'Password is required.', success: false };
  }
  
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.', success: false };
  }
  
  if (password.length > 50) {
    return { error: 'Password must be no more than 50 characters long.', success: false };
  }
  
  // Check for at least one uppercase letter and one number (recommended)
  const hasUppercase = password.match(/[A-Z]/) !== null;
  const hasNumber = password.match(/\d/) !== null;
  
  if (!hasUppercase || !hasNumber) {
    return { error: 'Password should contain at least 1 uppercase letter and 1 number for better security.', success: false };
  }

  // Terms and Privacy validation
  if (!acceptTerms) {
    return { error: 'You must agree to the Terms of Service to continue.', success: false };
  }
  
  if (!acceptPrivacy) {
    return { error: 'You must agree to the Privacy Policy to continue.', success: false };
  }

  // Temporary: Just return success to test if the action is working
  console.log('Signup attempt for email:', email.toLowerCase());
  return { error: 'Registration temporarily disabled for testing. Please check back soon.', success: false };
}
