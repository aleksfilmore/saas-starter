'use client';

// Force dynamic rendering for auth-dependent pages
export const dynamic = 'force-dynamic';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Subscription Management
            </h1>
            <p className="text-gray-300">
              Manage your CTRL+ALT+BLOCK subscription and billing
            </p>
          </div>
        </div>

        {/* Subscription Manager Component */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-lg shadow-xl p-6">
          <SubscriptionManager />
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Need help? Contact support at{' '}
            <a 
              href="mailto:support@ctrl-alt-block.com" 
              className="text-purple-400 hover:text-purple-300 underline"
            >
              support@ctrl-alt-block.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
