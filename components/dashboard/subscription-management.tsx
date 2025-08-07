'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  Star, 
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/config';

interface UserSubscription {
  tier: 'FREE' | 'PREMIUM';
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan: typeof SUBSCRIPTION_PLANS.FREE | typeof SUBSCRIPTION_PLANS.PREMIUM;
  subscriptionId?: string;
  customerId?: string;
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setActionLoading('upgrade');
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: 'PREMIUM' }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription?.customerId) return;
    
    setActionLoading('manage');
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge variant="destructive">Canceling</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'trialing':
        return <Badge variant="secondary">Trial</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="outline">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Management
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {subscription?.tier === 'PREMIUM' ? (
                <Star className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-gray-500" />
              )}
              {subscription?.plan?.name || 'Ghost Mode'}
            </h3>
            {subscription && getStatusBadge(subscription.status, subscription.cancelAtPeriodEnd)}
          </div>
          
          <p className="text-gray-600 mb-4">
            {subscription?.tier === 'FREE' 
              ? 'You are currently on the free plan with limited features.'
              : `You have access to all premium features.`
            }
          </p>
          
          {subscription?.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {subscription.cancelAtPeriodEnd ? 'Subscription ends' : 'Next billing'} on{' '}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div>
          <h4 className="font-medium mb-3">Current Plan Features</h4>
          <ul className="space-y-2">
            {subscription?.plan?.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        {subscription?.cancelAtPeriodEnd && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-900">Subscription Canceling</span>
            </div>
            <p className="text-orange-800 text-sm">
              Your subscription will end on {subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd).toLocaleDateString()}. 
              You can reactivate it anytime before then.
            </p>
          </div>
        )}

        {subscription?.status === 'past_due' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-900">Payment Issue</span>
            </div>
            <p className="text-red-800 text-sm">
              There was an issue with your last payment. Please update your payment method to continue enjoying premium features.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {subscription?.tier === 'FREE' ? (
            <Button 
              onClick={handleUpgrade}
              disabled={actionLoading === 'upgrade'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {actionLoading === 'upgrade' ? 'Processing...' : 'Upgrade to Premium'}
            </Button>
          ) : (
            <Button 
              onClick={handleManageSubscription}
              disabled={actionLoading === 'manage'}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {actionLoading === 'manage' ? 'Loading...' : 'Manage Billing'}
            </Button>
          )}
        </div>

        {/* Pricing Info */}
        {subscription?.tier === 'FREE' && (
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Upgrade to <strong>{SUBSCRIPTION_PLANS.PREMIUM.name}</strong> for ${SUBSCRIPTION_PLANS.PREMIUM.price}/month
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
