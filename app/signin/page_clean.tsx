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
      className="w-full text-lg font-black bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-4 px-8 transition-all duration-300 disabled:opacity-50"
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

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        console.log('About to call login API...');
        const response = await fetch('/api/login', {
          method: 'POST',
          body: formData,
        });
        
        const result: ActionResult = await response.json();
        console.log('Login result received:', result);
        
        if (result.success) {
          setState({ error: null, success: true });
          console.log('Login successful, redirecting to dashboard...');
          router.push('/dashboard');
        } else {
          setState({ error: result.error, success: false });
        }
      } catch (error) {
        console.error('Login error:', error);
        setState({ 
          error: 'Network error occurred. Please check your connection.', 
          success: false 
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" 
         style={{
           background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
         }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2" 
              style={{ 
                textShadow: '0 4px 8px rgba(0,0,0,0.8)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
            REFORMAT
          </h1>
          <div className="text-pink-400 text-sm tracking-wider" 
               style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            EMOTIONAL PROTOCOL
          </div>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {state.error && (
            <div className="text-red-400 text-sm text-center p-3 bg-red-900/20 rounded-xl border border-red-500/30">
              {state.error}
            </div>
          )}

          {state.success && (
            <div className="text-green-400 text-sm text-center p-3 bg-green-900/20 rounded-xl border border-green-500/30">
              Access granted. Redirecting to dashboard...
            </div>
          )}

          <LoginButton isPending={isPending} />
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">Don't have an account? </span>
          <Link href="/sign-up" className="text-pink-400 hover:text-pink-300 text-sm font-medium">
            Start Your Ritual
          </Link>
        </div>
      </div>
    </div>
  );
}
