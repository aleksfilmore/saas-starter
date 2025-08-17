'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Share2, 
  Copy, 
  Users, 
  Gift, 
  TrendingUp,
  Star,
  Trophy,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

import { safeClipboardCopy } from '@/lib/utils';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  stats: {
    totalReferrals: number;
    pending: number;
    completed: number;
    rewarded: number;
    totalRewards: number;
    conversionRate: number;
    referrals: Array<{
      id: string;
      status: string;
      clickedAt: Date | null;
      signedUpAt: Date | null;
      completedAt: Date | null;
      rewardAmount: number;
    }>;
  };
}

export function ReferralDashboard() {
  const [referralData, setReferralData] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/referrals');
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    if (!referralData) return;
    
    try {
      setCopying(true);
      const success = await safeClipboardCopy(
        referralData.referralLink,
        `Please copy this referral link manually: ${referralData.referralLink}`
      );
      if (success) {
        toast.success('Referral link copied to clipboard!');
      } else {
        toast.info('Referral link shown for manual copying');
      }
    } catch (error) {
      toast.error('Failed to copy link');
    } finally {
      setCopying(false);
    }
  };

  const shareReferralLink = async () => {
    if (!referralData) return;

    const shareData = {
      title: 'Join CTRL+ALT+BLOCK - Break Free from Toxic Relationships',
      text: 'I found this amazing app that helps break free from toxic relationships. Join me!',
      url: referralData.referralLink
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyReferralLink();
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load referral data</p>
        <Button onClick={fetchReferralData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const { stats } = referralData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
          <p className="text-gray-600">
            Share with friends and earn rewards together
          </p>
        </div>
        <Button onClick={fetchReferralData} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Referral Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends to start earning rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={referralData.referralLink} 
              readOnly 
              className="flex-1"
            />
            <Button 
              onClick={copyReferralLink} 
              disabled={copying}
              variant="outline"
            >
              <Copy className="h-4 w-4" />
              {copying ? 'Copying...' : 'Copy'}
            </Button>
            <Button onClick={shareReferralLink}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="font-mono text-lg font-bold text-purple-600">
              {referralData.referralCode}
            </p>
            <p className="text-sm text-gray-600">
              Your unique referral code
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Friends invited
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Signups</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.conversionRate.toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRewards}</div>
            <p className="text-xs text-muted-foreground">
              Bytes earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Progress</CardTitle>
          <CardDescription>
            Track how your referrals progress through the signup process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Links Clicked</span>
              <span className="text-sm text-gray-600">{stats.totalReferrals}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Signups Completed</span>
              <span className="text-sm text-gray-600">{stats.completed}</span>
            </div>
            <Progress 
              value={stats.totalReferrals > 0 ? (stats.completed / stats.totalReferrals) * 100 : 0} 
              className="h-2" 
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Rewards Distributed</span>
              <span className="text-sm text-gray-600">{stats.rewarded}</span>
            </div>
            <Progress 
              value={stats.completed > 0 ? (stats.rewarded / stats.completed) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>
            Recent referral activity and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No referrals yet</p>
              <p className="text-sm">Share your link to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.referrals.slice(0, 10).map((referral, index) => (
                <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Referral #{referral.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {referral.clickedAt 
                          ? `Clicked ${new Date(referral.clickedAt).toLocaleDateString()}`
                          : 'Not clicked yet'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {referral.rewardAmount > 0 && (
                      <Badge variant="secondary">
                        +{referral.rewardAmount} bytes
                      </Badge>
                    )}
                    <Badge 
                      variant={
                        referral.status === 'completed' ? 'default' :
                        referral.status === 'pending' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {referral.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rewards Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            How Referral Rewards Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">For You</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  100 bytes when friend signs up
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  500 bytes if they subscribe
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  10% off your next subscription
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">For Your Friend</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  50 bonus bytes on signup
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Access to exclusive content
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Priority support
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
