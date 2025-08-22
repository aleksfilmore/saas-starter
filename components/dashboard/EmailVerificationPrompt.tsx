'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Gift, X, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface EmailVerificationPromptProps {
  userEmail: string;
  onDismiss?: () => void;
  className?: string;
}

export function EmailVerificationPrompt({ userEmail, onDismiss, className = "" }: EmailVerificationPromptProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleSendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('📧 Verification email sent! Check your inbox.');
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className={`bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/40 ${className}`}>
      <CardContent className="p-4">
        {/* Success/Error Messages */}
        {message && (
          <Alert className="mb-3 border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-300 text-sm">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-3 border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-300 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-purple-400" />
              <h3 className="text-white font-semibold text-sm">Verify Your Email</h3>
              <Gift className="h-4 w-4 text-yellow-400" />
            </div>
            
            <p className="text-gray-300 text-xs mb-3 leading-relaxed">
              Unlock <span className="text-yellow-400 font-semibold">+20 Bytes</span>, priority support, and exclusive badges by verifying {userEmail}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleSendVerification}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3 flex-1"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Get Rewards
                  </>
                )}
              </Button>
              
              <Link href="/verify-email">
                <Button variant="outline" className="bg-transparent border-purple-400/50 text-purple-300 hover:bg-purple-500/10 text-xs h-8 px-3">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-200 p-1 h-6 w-6 ml-2 flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
