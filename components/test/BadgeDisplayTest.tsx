// CTRL+ALT+BLOCK™ Badge Display Test Component
// Simple component to test badge API integration

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  tierScope: string;
  archetypeScope: string | null;
  artUrl: string;
  discountPercent: number;
  rarity: string;
}

interface UserBadge {
  id: string;
  badgeId: string;
  earnedAt: string;
  isProfile: boolean;
  sourceEvent: string;
  badge: BadgeData;
}

interface BadgeLockerData {
  user: {
    tier: string;
    archetype: string | null;
    profileBadgeId: string | null;
  };
  badges: UserBadge[];
  totalAvailable: number;
  completionPercent: number;
}

export default function BadgeDisplayTest() {
  const [badgeData, setBadgeData] = useState<BadgeLockerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBadges = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/badges/locker', {
        headers: {
          'x-user-id': 'test-user-123' // Mock user ID for testing
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load badges');
      }
      
      const data = await response.json();
      setBadgeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testCheckIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/badges/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'test-user-123'
        },
        body: JSON.stringify({
          streakCount: Math.floor(Math.random() * 30) + 1,
          shieldUsed: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process check-in');
      }
      
      const result = await response.json();
      console.log('Check-in result:', result);
      
      // Reload badges after check-in
      await loadBadges();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Badge System Test</h1>
        <p className="text-muted-foreground mb-4">
          Testing the new CTRL+ALT+BLOCK™ badge system
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={loadBadges} disabled={loading}>
            {loading ? 'Loading...' : 'Load Badges'}
          </Button>
          <Button onClick={testCheckIn} disabled={loading} variant="outline">
            Test Check-in
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {badgeData && (
        <div className="space-y-4">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Tier</p>
                  <p className="text-muted-foreground capitalize">{badgeData.user.tier}</p>
                </div>
                <div>
                  <p className="font-medium">Archetype</p>
                  <p className="text-muted-foreground">{badgeData.user.archetype || 'None'}</p>
                </div>
                <div>
                  <p className="font-medium">Badges</p>
                  <p className="text-muted-foreground">{badgeData.badges.length}/{badgeData.totalAvailable}</p>
                </div>
                <div>
                  <p className="font-medium">Completion</p>
                  <p className="text-muted-foreground">{badgeData.completionPercent}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badge Collection */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Collection</CardTitle>
            </CardHeader>
            <CardContent>
              {badgeData.badges.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No badges earned yet. Try the check-in test!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badgeData.badges.map(userBadge => (
                    <Card key={userBadge.id} className="relative">
                      {userBadge.isProfile && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">Profile</Badge>
                        </div>
                      )}
                      
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{userBadge.badge.name}</h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {userBadge.badge.rarity}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {userBadge.badge.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {new Date(userBadge.earnedAt).toLocaleDateString()}
                            </span>
                            {userBadge.badge.discountPercent > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {userBadge.badge.discountPercent}% OFF
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Source: {userBadge.sourceEvent}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
