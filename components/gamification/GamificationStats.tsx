// Gamification Stats Component
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserStats {
  level: number;
  title: string;
  xp: number;
  bytes: number;
  badges: number;
  wallPosts: number;
  tier: string;
}

export default function GamificationStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/user/stats?endpoint=stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-green-500">
        <CardContent className="p-6">
          <div className="text-green-400 text-center">LOADING_USER_DATA...</div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-gray-900 border-red-500">
        <CardContent className="p-6">
          <div className="text-red-400 text-center">FAILED_TO_LOAD_STATS</div>
        </CardContent>
      </Card>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'ghost_mode': return 'text-gray-400';
      case 'firewall_mode': return 'text-blue-400';
      case 'cult_leader': return 'text-purple-400';
      default: return 'text-green-400';
    }
  };

  const getTierDisplay = (tier: string) => {
    switch (tier) {
      case 'ghost_mode': return 'GHOST_MODE';
      case 'firewall_mode': return 'FIREWALL_MODE';
      case 'cult_leader': return 'CULT_LEADER';
      default: return 'UNKNOWN_TIER';
    }
  };

  return (
    <Card className="bg-gray-900 border-green-500 font-mono">
      <CardHeader>
        <CardTitle className="text-green-400">
          REFORMAT_PROTOCOL™_STATUS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level & Title */}
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            LEVEL_{stats.level}
          </div>
          <div className="text-green-300">{stats.title}</div>
          <Badge className={`mt-2 ${getTierColor(stats.tier)}`}>
            {getTierDisplay(stats.tier)}
          </Badge>
        </div>

        {/* XP Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-300">GLOW_UP_XP:</span>
            <span className="text-yellow-400">{stats.xp.toLocaleString()}</span>
          </div>
          <div className="w-full bg-black border border-green-500 h-2 rounded">
            <div 
              className="bg-gradient-to-r from-green-500 to-yellow-500 h-full rounded"
              style={{ width: `${Math.min((stats.xp % 100) || 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Byte Balance */}
        <div className="flex justify-between items-center">
          <span className="text-green-300">EMOTIONAL_BYTES:</span>
          <span className="text-blue-400 font-bold">
            {stats.bytes.toLocaleString()} Ψ
          </span>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-purple-400 font-bold text-lg">{stats.badges}</div>
            <div className="text-green-300">BADGES_UNLOCKED</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 font-bold text-lg">{stats.wallPosts}</div>
            <div className="text-green-300">VOID_TRANSMISSIONS</div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="border-t border-green-500 pt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-green-300">SYSTEM_STATUS:</span>
            <span className="text-green-400">OPERATIONAL</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-green-300">FIREWALL_STATUS:</span>
            <span className="text-green-400">ACTIVE</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-green-300">EMOTIONAL_CORE:</span>
            <span className="text-yellow-400">STABILIZING</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
