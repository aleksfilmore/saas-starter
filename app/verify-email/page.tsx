'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Mail, AlertTriangle, Clock, Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SiteFooter } from '@/components/layout/SiteFooter';

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
    </div>
  )
}

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle URL parameters
  useEffect(() => {
    const success = searchParams?.get('success');
    const errorParam = searchParams?.get('error');
    const token = searchParams?.get('token');
    
    // If there's a token in the URL, automatically verify it
    if (token && !success && !errorParam) {
      handleTokenVerification(token);
      return;
    }
    
    if (success === 'verified') {
      setMessage('🎉 Email verified successfully! You earned 50 bonus XP points.');
    } else if (success === 'already_verified') {
      setMessage('✅ Your email is already verified.');
    } else if (errorParam === 'invalid_token') {
      setError('Invalid verification token. Please request a new verification email.');
    } else if (errorParam === 'expired_token') {
      setError('Verification token has expired. Please request a new verification email.');
    } else if (errorParam === 'missing_token') {
      setError('No verification token provided.');
    } else if (errorParam === 'server_error') {
      setError('Server error occurred. Please try again later.');
    }
  }, [searchParams]);

  const handleTokenVerification = async (token: string) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.alreadyVerified) {
          setMessage('✅ Your email is already verified.');
        } else {
          setMessage('🎉 Email verified successfully! You earned 50 bonus XP points.');
        }
        // Clear the form since verification is complete
        setEmail('');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('📧 Verification email sent! Check your inbox and click the link to claim your rewards.');
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-container">
      <FloatingParticles />
      
      {/* Header */}
      <header className="relative z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                <span className="hidden sm:inline">CTRL+ALT+</span>
                <span className="sm:hidden">CAB+</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 brand-glitch" data-text="BLOCK">BLOCK</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard">
                <Button className="btn-brand-secondary px-3 sm:px-6 text-xs sm:text-sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 py-24 px-4">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-8">
            <Mail className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4 brand-glow">
              Email Verification
            </h1>
            <p className="text-xl text-brand-light">
              Verify your email to unlock exclusive healing rewards
            </p>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <Alert className="mb-6 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-300">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Rewards Card */}
          <Card className="card-brand mb-8 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Gift className="h-5 w-5 mr-2 text-purple-400" />
                Verification Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <span className="text-brand-light">+50 Bonus XP Points</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-brand-light">Verified User Badge</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-brand-light">Email Notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span className="text-brand-light">Priority Support</span>
                </div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-purple-300">
                  <strong>Account Security:</strong> Verified emails enable password recovery and protect your healing progress.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Send Verification Form */}
          <Card className="card-brand">
            <CardHeader>
              <CardTitle className="text-white">Send Verification Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendVerification} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-brand-primary"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Email
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-600">
                <p className="text-sm text-gray-400 text-center">
                  Already verified? <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">Go to Dashboard</Link>
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Don't want to verify? No problem! You can continue using CTRL+ALT+BLOCK without verification.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
}
