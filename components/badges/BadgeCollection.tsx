"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Lock, Zap } from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  category: string;
  earned?: boolean;
  earned_at?: string;
}

interface BadgeCollectionProps {
  userId?: string;
  compact?: boolean;
  userTier?: string; // Add user tier prop
}

export function BadgeCollection({ userId, compact = false, userTier }: BadgeCollectionProps) {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const response = await fetch(`/api/badges/locker`, {
        headers: {
          'x-user-id': userId || ''
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
        // Show completion progress
        if (data.totalAvailable) {
          console.log(`Badge progress: ${data.completionPercent}% (${data.badges?.length}/${data.totalAvailable})`);
        }
      }
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArchetypeIcon = (archetype: string | null) => {
    // Use actual user tier if provided
    if (userTier) {
      switch (userTier.toLowerCase()) {
        case 'firewall': return '🛡️'; 
        case 'premium': return '👑';
        case 'ghost': return '👻';
        default: return '👻';
      }
    }
    
    // Fallback to archetype-based icons
    switch (archetype) {
      case 'DF': return '🌊'; // Data Flooder
      case 'FB': return '🛡️'; // Firewall Builder  
      case 'GS': return '👻'; // Ghost in the Shell
      case 'SN': return '🔐'; // Secure Node
      default: return '⚡'; // Default/Ghost tier
    }
  };

  const getArchetypeName = (archetype: string | null) => {
    // Use actual user tier if provided
    if (userTier) {
      switch (userTier.toLowerCase()) {
        case 'firewall': return 'Firewall Tier';
        case 'premium': return 'Premium Tier';
        case 'ghost': return 'Ghost Tier';
        default: return 'Ghost Tier';
      }
    }
    
    // Fallback to archetype-based naming
    switch (archetype) {
      case 'DF': return 'Data Flooder';
      case 'FB': return 'Firewall Builder';
      case 'GS': return 'Ghost in the Shell'; 
      case 'SN': return 'Secure Node';
      default: return 'Ghost Tier';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentBadges = badges.slice(-3);
  const totalBadges = badges.length;

  if (compact) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Badge Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getArchetypeIcon(selectedArchetype)}</span>
              <div>
                <div className="text-sm font-medium text-white">
                  {getArchetypeName(selectedArchetype)}
                </div>
                <div className="text-xs text-gray-400">
                  {totalBadges} badges earned
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
              {totalBadges}/24
            </Badge>
          </div>
          
          {recentBadges.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Latest badges:</div>
              <div className="flex gap-1">
                {recentBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs"
                    title={badge.name}
                  >
                    <Star className="h-3 w-3 text-white" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Badge Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center relative group cursor-pointer"
              title={`${badge.name} - ${badge.description}`}
            >
              <Star className="h-6 w-6 text-white" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors" />
            </div>
          ))}
          
          {/* Show locked slots */}
          {Array.from({ length: Math.max(0, 24 - badges.length) }).map((_, i) => (
            <div
              key={`locked-${i}`}
              className="aspect-square rounded-lg bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center"
            >
              <Lock className="h-4 w-4 text-gray-500" />
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Current Archetype</div>
              <div className="text-lg flex items-center gap-2 mt-1">
                <span>{getArchetypeIcon(selectedArchetype)}</span>
                <span className="text-white">{getArchetypeName(selectedArchetype)}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600">
              View All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BadgeCollection;
