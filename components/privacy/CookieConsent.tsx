'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Settings, Shield } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  onCustomize: () => void;
}

export function CookieConsent({ onAccept, onDecline, onCustomize }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
    onCustomize();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="bg-gray-900/95 border-purple-500/30 backdrop-blur-sm max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Privacy & Cookies</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-gray-300 mb-4">
            We use cookies and analytics to improve your healing journey experience, 
            understand user behavior, and provide personalized content. Your privacy matters to us.
          </p>

          {showDetails && (
            <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Cookie Categories:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <strong className="text-white">Essential:</strong> Required for basic site functionality
                </div>
                <div>
                  <strong className="text-white">Analytics:</strong> Google Analytics to understand usage patterns
                </div>
                <div>
                  <strong className="text-white">Functional:</strong> Remember your preferences and progress
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleAccept}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Accept All
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Decline Optional
            </Button>
            <Button
              onClick={handleCustomize}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide' : 'Customize'}
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            By continuing to use our platform, you agree to our{' '}
            <a href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</a> and{' '}
            <a href="/terms" className="text-purple-400 hover:underline">Terms of Service</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing cookie consent
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    setHasConsent(consent === 'accepted');
  }, []);

  const updateConsent = (accepted: boolean) => {
    localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined');
    setHasConsent(accepted);
  };

  return {
    hasConsent,
    giveConsent: () => updateConsent(true),
    revokeConsent: () => updateConsent(false),
  };
}
