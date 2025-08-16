// CTRL+ALT+BLOCK™ Badge Locker
// Shows user's earned badges and allows profile badge selection for Firewall users

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Star, Award, Lock, Crown, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// =====================================
// TYPES
// =====================================

interface BadgeData {
  id: string;
  name: string;
  description: string;
  category: string;
  tierScope: 'ghost' | 'firewall';
  archetypeScope: string | null;
  discountPercent: number;
  imageUrl?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  isProfile: boolean;
  badge: BadgeData;
}

interface BadgeLockerData {
  user: {
    tier: 'ghost' | 'firewall';
    archetype: string | null;
    profileBadgeId: string | null;
  };
  badges: UserBadge[];
  totalAvailable: number;
  completionPercent: number;
}

interface ShareCardData {
  shareCardUrl: string;
  badge: BadgeData;
  format: 'png' | 'jpg';
}

// =====================================
// BADGE VISUAL THEMES
// =====================================

const ARCHETYPE_THEMES = {
  DF: {
    name: 'Data Flooder',
    colors: 'from-cyan-400 to-blue-600',
    icon: '💧',
    description: 'Signal overflow waveform patterns'
  },
  FB: {
    name: 'Firewall Builder', 
    colors: 'from-red-400 to-orange-600',
    icon: '🔥',
    description: 'Protective barrier constructions'
  },
  GS: {
    name: 'Ghost in the Shell',
    colors: 'from-green-400 to-emerald-600', 
    icon: '👻',
    description: 'Ethereal presence manifestations'
  },
  SN: {
    name: 'Secure Node',
    colors: 'from-purple-400 to-violet-600',
    icon: '🔒',
    description: 'Encrypted connection networks'
  }
};

const RARITY_THEMES = {
  common: { 
    colors: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-400/20',
    icon: Star
  },
  rare: {
    colors: 'from-blue-400 to-blue-600', 
    glow: 'shadow-blue-400/30',
    icon: Award
  },
  epic: {
    colors: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-400/40', 
    icon: Crown
  },
  legendary: {
    colors: 'from-yellow-400 to-orange-600',
    glow: 'shadow-yellow-400/50',
    icon: Zap
  }
};

// =====================================
// BADGE CARD COMPONENT
// =====================================

interface BadgeCardProps {
  userBadge: UserBadge;
  isSelected?: boolean;
  isProfileBadge?: boolean;
  canSelectProfile?: boolean;
  onSelectProfile?: (badgeId: string) => void;
  onShareCard?: (badgeId: string) => void;
}

function BadgeCard({ 
  userBadge, 
  isSelected, 
  isProfileBadge,
  canSelectProfile,
  onSelectProfile,
  onShareCard 
}: BadgeCardProps) {
  const { badge } = userBadge;
  const rarity = badge.rarity || 'common';
  const theme = RARITY_THEMES[rarity];
  const Icon = theme.icon;
  
  // Get archetype theme if badge is archetype-specific
  const archetypeTheme = badge.archetypeScope ? ARCHETYPE_THEMES[badge.archetypeScope as keyof typeof ARCHETYPE_THEMES] : null;

  return (
    <Card className={cn(
      "relative cursor-pointer transition-all duration-200 hover:scale-105",
      isSelected && "ring-2 ring-primary",
      isProfileBadge && "ring-2 ring-yellow-400",
      theme.glow
    )}>
      {/* Profile Badge Indicator */}
      {isProfileBadge && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-yellow-400 text-yellow-900 rounded-full p-1">
            <Crown className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Rarity Indicator */}
      <div className={cn(
        "absolute top-2 left-2 rounded-full p-1",
        `bg-gradient-to-r ${theme.colors}`
      )}>
        <Icon className="h-3 w-3 text-white" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{badge.name}</CardTitle>
          {badge.discountPercent > 0 && (
            <Badge variant="secondary" className="text-xs">
              {badge.discountPercent}% OFF
            </Badge>
          )}
        </div>
        
        {/* Archetype Theme */}
        {archetypeTheme && (
          <div className={cn(
            "inline-flex items-center gap-1 text-xs rounded-full px-2 py-1",
            `bg-gradient-to-r ${archetypeTheme.colors} text-white`
          )}>
            <span>{archetypeTheme.icon}</span>
            <span>{archetypeTheme.name}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-xs mb-3">
          {badge.description}
        </CardDescription>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Earned {new Date(userBadge.earnedAt).toLocaleDateString()}</span>
          <span className="capitalize">{badge.category}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          {canSelectProfile && (
            <Button
              size="sm"
              variant={isProfileBadge ? "default" : "outline"}
              className="flex-1 text-xs"
              onClick={() => onSelectProfile?.(badge.id)}
            >
              {isProfileBadge ? "Profile Badge" : "Set as Profile"}
            </Button>
          )}
          
          <Button
            size="sm" 
            variant="outline"
            className="text-xs"
            onClick={() => onShareCard?.(badge.id)}
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================
// EMPTY STATE COMPONENT
// =====================================

function EmptyBadgeSlot({ tier }: { tier: 'ghost' | 'firewall' }) {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/10">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Lock className="h-8 w-8 text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground mb-1">Badge Slot</p>
        <p className="text-xs text-muted-foreground/60">
          {tier === 'ghost' ? 'Complete rituals to unlock' : 'Exclusive Firewall badge'}
        </p>
      </CardContent>
    </Card>
  );
}

// =====================================
// MAIN BADGE LOCKER COMPONENT
// =====================================

export default function BadgeLocker() {
  const [data, setData] = useState<BadgeLockerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
  const [sharingBadge, setSharingBadge] = useState<string | null>(null);

  // Load badge data
  useEffect(() => {
    async function loadBadges() {
      try {
        const response = await fetch('/api/badges/locker');
        if (!response.ok) throw new Error('Failed to load badges');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Badge loading error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBadges();
  }, []);

  // Set profile badge (Firewall only)
  const handleSetProfileBadge = async (badgeId: string) => {
    if (!data || data.user.tier !== 'firewall') return;

    try {
      const response = await fetch('/api/badges/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId })
      });

      if (!response.ok) throw new Error('Failed to set profile badge');
      
      // Update local state
      setData(prev => prev ? {
        ...prev,
        user: { ...prev.user, profileBadgeId: badgeId },
        badges: prev.badges.map(ub => ({
          ...ub,
          isProfile: ub.badgeId === badgeId
        }))
      } : null);
      
    } catch (error) {
      console.error('Profile badge error:', error);
    }
  };

  // Generate share card
  const handleShareCard = async (badgeId: string) => {
    setSharingBadge(badgeId);
    try {
      const response = await fetch('/api/badges/share-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId, format: 'png' })
      });

      if (!response.ok) throw new Error('Failed to generate share card');
      
      const result = await response.json();
      setShareCardData(result);
    } catch (error) {
      console.error('Share card error:', error);
    } finally {
      setSharingBadge(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading your badges...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Unable to load badges. Please try again.</p>
      </div>
    );
  }

  // Filter badges by category
  const categories = ['all', ...new Set(data.badges.map(ub => ub.badge.category))];
  const filteredBadges = selectedCategory === 'all' 
    ? data.badges 
    : data.badges.filter(ub => ub.badge.category === selectedCategory);

  // Calculate empty slots for Ghost users (max 4 badges)
  const maxBadges = data.user.tier === 'ghost' ? 4 : 10;
  const emptySlots = Math.max(0, maxBadges - data.badges.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Badge Locker</h2>
        <p className="text-muted-foreground mb-4">
          Your collection of earned achievements
        </p>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-1">
            <span>{data.badges.length} earned</span>
            <span>{data.completionPercent}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tier Status */}
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "rounded-full p-2",
                data.user.tier === 'firewall' 
                  ? "bg-orange-100 text-orange-600" 
                  : "bg-gray-100 text-gray-600"
              )}>
                {data.user.tier === 'firewall' ? <Shield className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-medium capitalize">{data.user.tier} Tier</p>
                <p className="text-xs text-muted-foreground">
                  {data.user.tier === 'firewall' ? 'Full access + profile selection' : 'Up to 4 badges'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{data.badges.length}/{maxBadges}</p>
              <p className="text-xs text-muted-foreground">badges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {categories.slice(0, 4).map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map(userBadge => (
          <BadgeCard
            key={userBadge.id}
            userBadge={userBadge}
            isProfileBadge={userBadge.isProfile}
            canSelectProfile={data.user.tier === 'firewall'}
            onSelectProfile={handleSetProfileBadge}
            onShareCard={handleShareCard}
          />
        ))}
        
        {/* Empty Slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <EmptyBadgeSlot key={`empty-${i}`} tier={data.user.tier} />
        ))}
      </div>

      {/* Share Card Dialog */}
      {shareCardData && (
        <Dialog open={!!shareCardData} onOpenChange={() => setShareCardData(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Badge</DialogTitle>
              <DialogDescription>
                Show off your {shareCardData.badge.name} achievement!
              </DialogDescription>
            </DialogHeader>
            <div className="text-center">
              <img 
                src={shareCardData.shareCardUrl} 
                alt={`${shareCardData.badge.name} share card`}
                className="mx-auto mb-4 rounded-lg shadow-lg max-w-full"
              />
              <Button onClick={() => {
                navigator.clipboard.writeText(shareCardData.shareCardUrl);
                // Could add toast notification here
              }}>
                Copy Share Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Empty State */}
      {data.badges.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No badges yet</h3>
          <p className="text-muted-foreground mb-4">
            Complete daily rituals, engage with the wall, and try AI therapy to start earning badges!
          </p>
          <Button>Start Your Journey</Button>
        </div>
      )}
    </div>
  );
}
