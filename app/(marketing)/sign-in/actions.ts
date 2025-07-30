// File: app/sign-in/actions.ts

'use server';

// This is the fix: We now export this interface so other files can use it.
export interface ActionResult {
  error: string | null;
  success: boolean;
}

export async function login(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || !email.includes('@')) {
    return { error: 'Please enter a valid email.', success: false };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.', success: false };
  }

  // Temporary: Just return success to test if the action is working
  console.log('Login attempt for email:', email.toLowerCase());
  return { error: 'Authentication temporarily disabled for testing. Please check back soon.', success: false };
}
