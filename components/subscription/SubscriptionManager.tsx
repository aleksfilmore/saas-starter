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
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
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
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-red-600">
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
      <Card className={isPremium ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isPremium ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gray-100'
              }`}>
                {isPremium ? (
                  <Crown className="h-5 w-5 text-white" />
                ) : (
                  <Shield className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {subscription.plan.name}
                  {isPremium && (
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                      Premium
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isPremium ? `$${subscription.plan.price}/month` : 'Free Forever'}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isActive ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600">
                  {subscription.status}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Billing Info */}
          {isPremium && subscription.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {willCancel ? 'Cancels on' : 'Renews on'}{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          )}

          {willCancel && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 text-sm">
                <XCircle className="h-4 w-4" />
                <span>Your subscription will cancel at the end of this billing period.</span>
              </div>
            </div>
          )}

          {/* Features List */}
          <div>
            <h4 className="font-medium mb-3">What's included:</h4>
            <div className="grid gap-2">
              {subscription.plan.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
              {subscription.plan.features.length > 4 && (
                <div className="text-sm text-gray-500">
                  +{subscription.plan.features.length - 4} more features
                </div>
              )}
            </div>
          </div>

          <Separator />

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
                className="flex-1"
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
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Unlock Firewall Mode Benefits
            </CardTitle>
            <CardDescription>
              Get the complete healing experience with premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-500" />
                <span><strong>48h shield window</strong> + weekly auto-shield protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span><strong>2 daily rituals</strong> science-weighted to your archetype</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-orange-500" />
                <span><strong>AI Therapy Chat included</strong> (1,000 messages/month)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                <span><strong>Unlimited</strong> Wall of Wounds™ posting & editing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
