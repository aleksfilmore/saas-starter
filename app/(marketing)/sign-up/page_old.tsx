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
    <div className="relative min-h-screen bg-gray-950 text-foreground overflow-hidden">
      {/* Background with same style as homepage */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/5 left-1/5 w-3 h-3 bg-glitch-pink rounded-full animate-float opacity-40"></div>
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/5 right-1/5 w-2 h-2 bg-glitch-cyan rounded-full animate-float opacity-30" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="mx-auto grid w-[450px] gap-8 p-10 border-2 border-purple-400/50 rounded-2xl bg-gray-900/60 backdrop-blur-sm shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <div className="grid gap-4 text-center">
            <h1 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '1px #ec4899'}}>
              JOIN THE <span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>RITUAL</span>
            </h1>
            <p className="text-lg text-fuchsia-400 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>
              Begin your emotional OS upgrade — <span className="text-blue-400 font-bold">FREE</span>
            </p>
          </div>
          <form action={formAction} className="grid gap-6">
            <div className="grid gap-3">
              <label htmlFor="email" className="text-white font-semibold text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your.email@domain.com"
                required
                autoComplete="email"
                className="bg-gray-800/80 border-2 border-purple-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                aria-invalid={!!state?.error}
                aria-describedby={state?.error ? 'signup-error' : undefined}
              />
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