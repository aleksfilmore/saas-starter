'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { signup } from './actions';
import Link from 'next/link';

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary"
    >
      {pending ? 'Creating Account...' : 'Create Account'}
    </button>
  );
}

const initialState = {
  error: null,
  success: false,
};

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(signup, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-[350px] gap-6 p-8 border border-border rounded-lg bg-card shadow-lg">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold text-primary">Create an Account</h1>
          <p className="text-balance text-muted-foreground">
            Start your emotional reformat today.
          </p>
        </div>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              autoComplete="email"
              className="bg-muted border border-border text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block w-full p-2.5"
              aria-invalid={!!state?.error}
              aria-describedby={state?.error ? 'signup-error' : undefined}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-foreground">
                Password
              </label>
              <span className="text-xs text-muted-foreground">Min. 6 characters</span>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="bg-muted border border-border text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block w-full p-2.5"
              aria-invalid={!!state?.error}
              aria-describedby={state?.error ? 'signup-error' : undefined}
            />
          </div>
          {state?.error && (
            <div
              id="signup-error"
              className="text-sm font-medium text-destructive text-center"
              role="alert"
            >
              {state.error}
            </div>
          )}
          <SignUpButton />
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="underline text-accent hover:text-accent-foreground">
            Log in
          </Link>
        </div>
      </div>
      </div>
    );
  }