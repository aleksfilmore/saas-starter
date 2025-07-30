'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface ActionResult {
  error: string | null;
  success: boolean;
}

function SignUpButton({ isPending }: { isPending: boolean }) {
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
      {isPending ? 'INITIALIZING RITUAL...' : 'BEGIN THE RITUAL FREE'}
    </button>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ActionResult>({ error: null, success: false });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      try {
        console.log('About to call signup API...');
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          body: formData,
        });
        
        const result: ActionResult = await response.json();
        console.log('Signup result received:', result);
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
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-pink-500 mb-2">
              CTRL+ALT+BLOCK
            </h1>
            <p className="text-gray-400">
              Join the Ritual - Start your emotional OS upgrade
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="your.email@domain.com"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={50}
                autoComplete="new-password"
                placeholder="Create a strong password"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                8-50 characters, recommend uppercase + numbers
              </p>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  required
                  className="mt-1 w-4 h-4 bg-gray-800 border border-gray-600 rounded"
                />
                <span className="text-sm text-gray-300">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptPrivacy"
                  required
                  className="mt-1 w-4 h-4 bg-gray-800 border border-gray-600 rounded"
                />
                <span className="text-sm text-gray-300">
                  I agree to the{' '}
                  <Link href="/privacy" target="_blank" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailUpdates"
                  className="mt-1 w-4 h-4 bg-gray-800 border border-gray-600 rounded"
                />
                <span className="text-sm text-gray-300">
                  <span className="text-gray-400">(Optional)</span> Send me ritual updates
                </span>
              </label>
            </div>
            
            {state?.error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/50 rounded p-3">
                {state.error}
              </div>
            )}
            
            <SignUpButton isPending={isPending} />
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already in the system?{' '}
              <Link href="/signin" className="text-pink-500 hover:text-pink-400 underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
