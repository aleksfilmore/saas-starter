'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StreakShieldProps {
  periodId: string;
  streakShieldsUsed: number;
  maxStreakShieldsPerWeek: number;
  onShieldUsed: () => void;
}

export default function StreakShield({ 
  periodId, 
  streakShieldsUsed, 
  maxStreakShieldsPerWeek, 
  onShieldUsed 
}: StreakShieldProps) {
  const [isUsing, setIsUsing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canUseShield = streakShieldsUsed < maxStreakShieldsPerWeek;
  const remainingShields = maxStreakShieldsPerWeek - streakShieldsUsed;

  const handleUseShield = async () => {
    if (!canUseShield) return;

    setIsUsing(true);

    try {
      const response = await fetch('/api/tracker/streak-shield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ periodId }),
      });

      if (response.ok) {
        onShieldUsed();
        setShowConfirm(false);
      } else {
        console.error('Failed to use streak shield');
      }
    } catch (error) {
      console.error('Error using streak shield:', error);
    } finally {
      setIsUsing(false);
    }
  };

  if (!showConfirm) {
    return (
      <Card className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold flex items-center gap-2">
              🛡️ Streak Shield
            </h4>
            <p className="text-purple-200 text-sm">
              Get out of jail free card • {remainingShields} remaining this week
            </p>
          </div>
          
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={!canUseShield}
            variant="outline"
            className={`${
              canUseShield 
                ? 'border-purple-400 text-purple-300 hover:bg-purple-700' 
                : 'border-gray-600 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canUseShield ? 'Use Shield' : 'No Shields Left'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900 to-purple-800 border-purple-500/30">
      <div className="text-center">
        <div className="text-4xl mb-4">🛡️</div>
        <h3 className="text-white text-lg font-bold mb-2">Use Streak Shield?</h3>
        <p className="text-purple-200 text-sm mb-6">
          This will protect your streak from today's slip-up. You have {remainingShields} shields remaining this week.
        </p>
        
        <div className="flex gap-3">
          <Button
            onClick={() => setShowConfirm(false)}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUseShield}
            disabled={isUsing}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {isUsing ? 'Using...' : 'Use Shield'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
