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
      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold rounded-xl text-base px-6 py-4 text-center disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary shadow-neon-pink hover:shadow-neon-pink/80 transition-all duration-300 group"
    >
      {pending ? (
        <span className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          Creating Account...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          Begin the Ritual
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      )}
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-secondary/10 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="mx-auto grid w-[400px] gap-8 p-10 border border-primary/30 rounded-2xl bg-card/80 backdrop-blur-sm shadow-neon-pink/30 relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="grid gap-4 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Create an Account
            </h1>
            <p className="text-balance text-muted-foreground text-lg">
              Start your <span className="text-glitch-cyan font-semibold">emotional reformat</span> today.
            </p>
          </div>
          <form action={formAction} className="grid gap-6 mt-8">
            <div className="grid gap-3">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                autoComplete="email"
                className="bg-input/50 backdrop-blur-sm border border-border/50 text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full p-4 transition-all duration-300 hover:border-primary/50"
                aria-invalid={!!state?.error}
                aria-describedby={state?.error ? 'signup-error' : undefined}
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  Min. 6 characters
                </span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="bg-input/50 backdrop-blur-sm border border-border/50 text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full p-4 transition-all duration-300 hover:border-primary/50"
                aria-invalid={!!state?.error}
                aria-describedby={state?.error ? 'signup-error' : undefined}
              />
            </div>
            {state?.error && (
              <div
                id="signup-error"
                className="text-sm font-medium text-destructive text-center bg-destructive/10 border border-destructive/30 rounded-xl p-3"
                role="alert"
              >
                {state.error}
              </div>
            )}
            <SignUpButton />
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="underline text-accent hover:text-accent/80 font-medium transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  }