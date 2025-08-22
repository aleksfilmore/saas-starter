"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid unsubscribe link. Token is missing.');
        return;
      }

      try {
        const response = await fetch('/api/email/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Successfully unsubscribed from daily email reminders');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to unsubscribe');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      }
    };

    handleUnsubscribe();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="card-brand text-center">
            <Loader2 className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-2">
              PROCESSING PROTOCOL...
            </h1>
            <p className="text-gray-300">
              Deactivating email notifications from your healing matrix...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="card-brand text-center">
            <div className="mb-6">
              <div className="relative inline-block mb-4">
                <CheckCircle className="h-16 w-16 text-neon-green mx-auto" />
                <div className="absolute inset-0 bg-neon-green opacity-20 rounded-full blur-lg"></div>
              </div>
              
              <h1 className="text-2xl font-bold text-neon-green mb-2 glitch-effect">
                PROTOCOL DEACTIVATED
              </h1>
              <p className="text-gray-300">
                {message}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <Shield className="h-4 w-4 inline mr-2 text-purple-400" />
                  Your progress continues. You can reactivate notifications anytime in your neural interface.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link href="/dashboard">
                  <button className="btn-brand-primary w-full">
                    🚀 RETURN TO DASHBOARD
                  </button>
                </Link>
                
                <Link href="/settings">
                  <button className="btn-brand-secondary w-full">
                    ⚙️ NEURAL INTERFACE SETTINGS
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <p className="text-xs text-gray-500">
                <span className="text-neon-green">●</span> Your digital healing journey continues with or without email protocols.
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="card-brand text-center">
            <div className="mb-6">
              <div className="relative inline-block mb-4">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
                <div className="absolute inset-0 bg-red-400 opacity-20 rounded-full blur-lg"></div>
              </div>
              
              <h1 className="text-2xl font-bold text-red-400 mb-2">
                PROTOCOL ERROR
              </h1>
              <p className="text-gray-300 mb-4">
                {message}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-300">
                  The unsubscribe link may have expired or been corrupted. You can manage your email preferences directly in your dashboard settings.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link href="/settings">
                  <button className="btn-brand-primary w-full">
                    📧 MANAGE EMAIL SETTINGS
                  </button>
                </Link>
                
                <Link href="/dashboard">
                  <button className="btn-brand-secondary w-full">
                    🏠 RETURN TO DASHBOARD
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="brand-logo-large mb-4">
          CTRL+ALT+BLOCK
        </div>
        <p className="brand-tagline">GLITCH-CORE HEALING PROTOCOL</p>
      </div>

      {renderContent()}

      {/* Crisis Support Notice */}
      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
        <p className="text-sm text-red-300">
          <strong>🆘 Emergency Protocol:</strong> Crisis support remains always active.
        </p>
        <Link 
          href="/crisis-support" 
          className="text-neon-green hover:text-white underline text-sm"
        >
          Access 24/7 Crisis Resources →
        </Link>
      </div>
    </>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-accent relative overflow-hidden">
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="brand-container w-full max-w-md">
          <Suspense fallback={
            <div className="card-brand text-center">
              <Loader2 className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-white mb-2">
                LOADING PROTOCOL...
              </h1>
            </div>
          }>
            <UnsubscribeContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
