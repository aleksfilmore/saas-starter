'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface ActionResult {
  error: string | null;
  success: boolean;
}

function LoginButton({ isPending }: { isPending: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full text-lg font-black bg-glitch-pink hover:bg-glitch-pink/90 text-white rounded-xl py-4 px-8 shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] border-2 border-glitch-pink hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
      style={{
        textShadow: '0 2px 4px rgba(0,0,0,0.8)', 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        fontWeight: '900'
      }}
    >
      {isPending ? 'ACCESSING SYSTEM...' : 'ENTER THE RITUAL'}
    </button>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ActionResult>({ error: null, success: false });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      try {
        console.log('About to call login API...');
        const response = await fetch('/api/login', {
          method: 'POST',
          body: formData,
        });
        
        const result: ActionResult = await response.json();
        console.log('Login result received:', result);
        setState(result);
        if (result && result.success) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
        setState({ error: 'Failed to connect to server. Please try again.', success: false });
      }
    });
  };

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
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-glitch-pink rounded-full opacity-40" style={{animation: 'float 3s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-60" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full opacity-30" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '2s'}}></div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="mx-auto grid w-[420px] gap-8 p-10 border-2 border-glitch-pink/50 rounded-2xl bg-gray-900/60 backdrop-blur-sm shadow-[0_0_40px_rgba(255,20,147,0.3)]">
          <div className="grid gap-4 text-center">
            <h1 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '1px #ec4899'}}>
              SYSTEM <span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>ACCESS</span>
            </h1>
            <p className="text-lg text-fuchsia-400 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>
              Re-enter the emotional reformat zone
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-3">
              <label htmlFor="email" className="text-white font-semibold text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your.email@domain.com"
                required
                autoComplete="email"
                className="bg-gray-800/80 border-2 border-blue-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                aria-invalid={!!state?.error}
                aria-describedby={state?.error ? 'login-error' : undefined}
              />
            </div>
            <div className="grid gap-3">
              <label htmlFor="password" className="text-white font-semibold text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="bg-gray-800/80 border-2 border-blue-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                aria-invalid={!!state?.error}
                aria-describedby={state?.error ? 'login-error' : undefined}
              />
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-glitch-pink underline font-medium transition-colors duration-300"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            {state?.error && (
              <div
                id="login-error"
                className="text-lg font-bold text-red-400 text-center bg-red-900/20 border border-red-400/50 rounded-xl py-3 px-4"
                style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                role="alert"
              >
                {state.error}
              </div>
            )}
            <LoginButton isPending={isPending} />
          </form>
          <div className="mt-6 text-center text-lg">
            <span className="text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Need to join the ritual?</span>{' '}
            <Link href="/sign-up" className="underline text-glitch-pink hover:text-fuchsia-400 font-bold transition-colors duration-300" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Sign up FREE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}