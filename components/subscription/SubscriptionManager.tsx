'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Settings, 
  CheckCircle, 
  XCircle,
  Loader2,
  Shield,
  Zap
} from 'lucide-react';

interface SubscriptionData {
  tier: 'FREE' | 'PREMIUM';
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan: {
    name: string;
    price: number;
    features: string[];
  };
}

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setActionLoading(true);
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upgrade');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create portal session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (err) {
      console.error('Portal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-red-900/20">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="h-5 w-5" />
            <span>Error loading subscription: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return null;
  }

  const isPremium = subscription.tier === 'PREMIUM';
  const isActive = subscription.status === 'active';
  const willCancel = subscription.cancelAtPeriodEnd;

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className={`${isPremium ? 'border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20' : 'bg-gray-800/50 border-gray-700'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isPremium ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gray-700'
              }`}>
                {isPremium ? (
                  <Crown className="h-5 w-5 text-white" />
                ) : (
                  <Shield className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  {subscription.plan.name}
                  {isPremium && (
                    <Badge className="bg-orange-900/50 text-orange-300 hover:bg-orange-800/50 border-orange-500/30">
                      Premium
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isPremium ? `$${subscription.plan.price}/month` : 'Free Forever'}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isActive ? (
                <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-900/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-400 border-gray-600 bg-gray-700/20">
                  {subscription.status}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Billing Info */}
          {isPremium && subscription.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>
                {willCancel ? 'Cancels on' : 'Renews on'}{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          )}

          {willCancel && (
            <div className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <XCircle className="h-4 w-4" />
                <span>Your subscription will cancel at the end of this billing period.</span>
              </div>
            </div>
          )}

          {/* Features List */}
          <div>
            <h4 className="font-medium mb-3 text-white">What's included:</h4>
            <div className="grid gap-2">
              {subscription.plan.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
              {subscription.plan.features.length > 4 && (
                <div className="text-sm text-gray-400">
                  +{subscription.plan.features.length - 4} more features
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isPremium ? (
              <Button 
                onClick={handleUpgrade}
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Crown className="h-4 w-4 mr-2" />
                )}
                Upgrade to Firewall Mode
              </Button>
            ) : (
              <Button 
                onClick={handleManageSubscription}
                disabled={actionLoading}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                Manage Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Benefits (for free users) */}
      {!isPremium && (
        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-orange-400" />
              Unlock Firewall Mode Benefits
            </CardTitle>
            <CardDescription className="text-gray-400">
              Get the complete healing experience with premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300"><strong className="text-white">48h shield window</strong> + weekly auto-shield protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300"><strong className="text-white">2 daily rituals</strong> science-weighted to your archetype</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300"><strong className="text-white">AI Therapy Chat included</strong> (1,000 messages/month)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300"><strong className="text-white">Unlimited</strong> Wall of Wounds™ posting & editing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
