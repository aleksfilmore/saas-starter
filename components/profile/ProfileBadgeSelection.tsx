import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface ProfileBadge {
  id: string;
  name: string;
  icon_url: string;
  tier_scope: string;
  archetype_scope: string | null;
  discount_percent: number;
  earned_at: string;
}

interface ProfileBadgeSelectionProps {
  userId: string;
  userTier: 'ghost' | 'firewall';
  className?: string;
}

export function ProfileBadgeSelection({ userId, userTier, className }: ProfileBadgeSelectionProps) {
  const [earnedBadges, setEarnedBadges] = useState<ProfileBadge[]>([]);
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  const [autoApply, setAutoApply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadProfileBadgeData();
  }, [userId]);

  const loadProfileBadgeData = async () => {
    try {
      const response = await fetch(`/api/profile/badges?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setEarnedBadges(data.earnedBadges);
        setCurrentSelection(data.displayedBadgeId);
        setAutoApply(data.autoApplyLatest);
      }
    } catch (error) {
      console.error('Failed to load profile badge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBadgeSelection = async (badgeId: string | null) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/profile/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          displayedBadgeId: badgeId,
          autoApplyLatest: autoApply
        })
      });

      if (response.ok) {
        setCurrentSelection(badgeId);
      } else {
        console.error('Failed to update badge selection');
      }
    } catch (error) {
      console.error('Failed to update badge selection:', error);
    } finally {
      setUpdating(false);
    }
  };

  const toggleAutoApply = async () => {
    const newAutoApply = !autoApply;
    setAutoApply(newAutoApply);

    try {
      const response = await fetch('/api/profile/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          displayedBadgeId: currentSelection,
          autoApplyLatest: newAutoApply
        })
      });

      if (!response.ok) {
        setAutoApply(!newAutoApply); // Revert on error
        console.error('Failed to update auto-apply setting');
      }
    } catch (error) {
      console.error('Failed to update auto-apply setting:', error);
      setAutoApply(!newAutoApply); // Revert on error
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Profile Badge Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading badge selection...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedBadge = earnedBadges.find(b => b.id === currentSelection);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profile Badge Selection</CardTitle>
        <p className="text-sm text-muted-foreground">
          {userTier === 'ghost' 
            ? 'Ghost users: Latest badge auto-applies to profile' 
            : 'Firewall users: Choose which badge to display on your profile'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-apply toggle for Ghost users */}
        {userTier === 'ghost' && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium">Auto-apply Latest Badge</h3>
              <p className="text-sm text-muted-foreground">
                Automatically display your most recently earned badge
              </p>
            </div>
            <Switch
              checked={autoApply}
              onCheckedChange={toggleAutoApply}
              disabled={updating}
            />
          </div>
        )}

        {/* Current selection display */}
        {currentSelection && displayedBadge && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Currently Displayed Badge</h4>
            <div className="flex items-center space-x-3">
              <img 
                src={displayedBadge.icon_url} 
                alt={displayedBadge.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{displayedBadge.name}</p>
                <p className="text-sm text-muted-foreground">
                  {displayedBadge.tier_scope} tier • {displayedBadge.discount_percent}% discount
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Badge selection grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Your Earned Badges</h3>
            <Badge variant="outline">
              {earnedBadges.length} badge{earnedBadges.length !== 1 ? 's' : ''} earned
            </Badge>
          </div>
          
          {earnedBadges.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-muted-foreground mb-2">No badges earned yet</p>
              <p className="text-sm text-muted-foreground">
                Complete daily check-ins and rituals to earn your first badge!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* No badge option */}
              <Button
                variant={currentSelection === null ? "default" : "outline"}
                onClick={() => updateBadgeSelection(null)}
                disabled={updating || (userTier === 'ghost' && autoApply)}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 border-2 border-dashed border-current rounded-full flex items-center justify-center opacity-50">
                  <span className="text-xs">None</span>
                </div>
                <span className="text-xs">No Badge</span>
              </Button>

              {/* Earned badges */}
              {earnedBadges.map((badge) => (
                <Button
                  key={badge.id}
                  variant={currentSelection === badge.id ? "default" : "outline"}
                  onClick={() => updateBadgeSelection(badge.id)}
                  disabled={updating || (userTier === 'ghost' && autoApply)}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <img 
                    src={badge.icon_url} 
                    alt={badge.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium leading-tight">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.discount_percent}% off
                    </p>
                  </div>
                  {currentSelection === badge.id && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="text-xs text-muted-foreground space-y-1">
          {userTier === 'ghost' && autoApply && (
            <p>• Auto-apply is enabled - your newest badge will automatically display</p>
          )}
          {userTier === 'firewall' && (
            <p>• You can manually select which badge to display on your profile</p>
          )}
          <p>• Your displayed badge shows on your profile and provides its discount percentage</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileBadgeSelection;
