'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react';

interface ByteBalanceProps {
  showTrend?: boolean;
  showDetails?: boolean;
  className?: string;
}

interface ByteData {
  balance: number;
  todayEarnings: number;
  weeklyEarnings: number;
  allTimeEarnings: number;
  currentStreak: number;
}

export default function ByteBalance({ 
  showTrend = false, 
  showDetails = false, 
  className = "" 
}: ByteBalanceProps) {
  const [byteData, setByteData] = useState<ByteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchByteData();
  }, []);

  const fetchByteData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/bytes/balance', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch byte data');
      }

      const data = await response.json();
      setByteData(data);
    } catch (err) {
      console.error('Error fetching byte data:', err);
      setError('Failed to load byte balance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !byteData) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Unable to load balance</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { balance, todayEarnings, weeklyEarnings, currentStreak } = byteData;

  // Compact display (default)
  if (!showDetails) {
    return (
      <div className={`flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full ${className}`}>
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-600">
          {balance.toLocaleString()} Bytes
        </span>
      </div>
    );
  }

  // Detailed display
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-600">Your Bytes</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {balance.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Today</div>
              <div className="font-semibold text-green-600">
                +{todayEarnings.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">This Week</div>
              <div className="font-semibold text-blue-600">
                +{weeklyEarnings.toLocaleString()}
              </div>
            </div>
          </div>

          {currentStreak > 0 && (
            <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">
                {currentStreak} day streak! 🔥
              </span>
            </div>
          )}

          <div className="text-xs text-center text-muted-foreground">
            Complete rituals, post on the wall, and check in daily to earn more Bytes!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
