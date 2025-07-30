'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface ActionResult {
  error: string | null;
  success: boolean;
}

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-lg font-black bg-glitch-pink hover:bg-glitch-pink/90 text-white rounded-xl py-4 px-8 shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] border-2 border-glitch-pink hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
      style={{
        textShadow: '0 2px 4px rgba(0,0,0,0.8)', 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        fontWeight: '900'
      }}
    >
      {pending ? (
        <span className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          INITIALIZING RITUAL...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          BEGIN THE RITUAL FREE
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      )}
    </button>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ActionResult>({ error: null, success: false });

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        console.log('About to call signup API...');
        const response = await fetch('/api/signup', {
          method: 'POST',
          body: formData,
        });
        
        const result: ActionResult = await response.json();
        console.log('Signup result received:', result);
        console.log('Result type:', typeof result);
        console.log('Result success property:', result?.success);
        setState(result);
        if (result && result.success) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Signup error:', error);
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
          <form action={handleSubmit} className="grid gap-6">
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
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-white font-semibold text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Password
                </label>
                <span className="text-sm text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  8-50 chars
                </span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={50}
                autoComplete="new-password"
                placeholder="Create a strong password"
                className="bg-gray-800/80 border-2 border-purple-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                aria-invalid={!!state?.error}
                aria-describedby={state?.error ? 'signup-error password-requirements' : 'password-requirements'}
              />
              <div id="password-requirements" className="text-xs text-gray-400 space-y-1">
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  8-50 characters (letters, numbers, symbols allowed)
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  At least 1 uppercase letter and 1 number recommended
                </p>
              </div>
            </div>
            
            {/* Terms of Service and Privacy Policy */}
            <div className="grid gap-3">
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    required
                    className="mt-1 w-4 h-4 bg-gray-800 border-2 border-purple-400/50 rounded text-glitch-pink focus:ring-2 focus:ring-glitch-pink focus:border-glitch-pink transition-all duration-300"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    I have read and agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-medium">
                      Terms of Service
                    </Link>
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acceptPrivacy"
                    required
                    className="mt-1 w-4 h-4 bg-gray-800 border-2 border-purple-400/50 rounded text-glitch-pink focus:ring-2 focus:ring-glitch-pink focus:border-glitch-pink transition-all duration-300"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    I have read and agree to the{' '}
                    <Link href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="emailUpdates"
                    className="mt-1 w-4 h-4 bg-gray-800 border-2 border-purple-400/50 rounded text-purple-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    <span className="text-gray-400">(Optional)</span> Send me ritual updates and emotional intelligence tips
                  </span>
                </label>
              </div>
            </div>
            {state?.error && (
              <div
                id="signup-error"
                className="text-lg font-bold text-red-400 text-center bg-red-900/20 border border-red-400/50 rounded-xl py-3 px-4"
                style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                role="alert"
              >
                {state.error}
              </div>
            )}
            <SignUpButton />
          </form>
          <div className="mt-6 text-center text-lg">
            <span className="text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Already in the system?</span>{' '}
            <Link href="/sign-in" className="underline text-glitch-pink hover:text-fuchsia-400 font-bold transition-colors duration-300" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Log in
            </Link>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
