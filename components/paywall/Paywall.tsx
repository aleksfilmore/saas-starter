'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Shield, Sparkles } from 'lucide-react';

interface PaywallProps {
  feature: string;
  title?: string;
  description?: string;
  upgradeText?: string;
  className?: string;
}

export function Paywall({ 
  feature, 
  title, 
  description, 
  upgradeText = "Upgrade to Firewall Mode",
  className = ""
}: PaywallProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'PREMIUM'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      // You could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTitle = title || `${feature} requires Firewall Mode`;
  const defaultDescription = description || `Unlock ${feature.toLowerCase()} and all premium features with Firewall Mode.`;

  return (
    <Card className={`border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            <Crown className="h-3 w-3 mr-1" />
            Premium Feature
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          {defaultTitle}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {defaultDescription}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>48h shield window + weekly auto-shield</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span>2 daily rituals science-weighted to your archetype</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Shield className="h-4 w-4 text-orange-500" />
            <span>Unlimited Wall of Wounds™ posting & editing</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Crown className="h-4 w-4 text-orange-500" />
            <span>AI Therapy Chat included (1,000 msgs/month)</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-orange-200">
          <Button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                {upgradeText} - $9.99/month
              </div>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            Cancel anytime • No hidden fees
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Higher-order component to wrap features with paywall
export function withPaywall<T extends object>(
  Component: React.ComponentType<T>,
  feature: string,
  userTier?: string
) {
  return function PaywalledComponent(props: T) {
    // Check if user has access to this feature
    if (!userTier || userTier.toUpperCase() !== 'PREMIUM') {
      return (
        <div className="p-4">
          <Paywall 
            feature={feature}
            className="max-w-md mx-auto"
          />
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

// Hook to check feature access
export function useFeatureAccess(feature: string, userTier?: string) {
  const hasAccess = userTier?.toUpperCase() === 'PREMIUM';
  
  return {
    hasAccess,
    PaywallComponent: hasAccess ? null : () => (
      <Paywall 
        feature={feature}
        className="max-w-md mx-auto"
      />
    )
  };
}
