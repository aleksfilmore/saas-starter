/**
 * Daily Ritual Card Component
 * Displays a single daily ritual with completion state and action buttons
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Zap, Check } from 'lucide-react';
import { DailyRitualCompletionModal } from './DailyRitualCompletionModal';
import { type PaidRitual, PAID_RITUAL_CATEGORIES } from '@/lib/rituals/paid-rituals-database';

interface DailyRitualCardProps {
  ritual: PaidRitual;
  state: 'available' | 'in-progress' | 'completed' | 'locked';
  canComplete: boolean;
  assignmentId: number;
  onComplete: (data: {
    xpEarned: number;
    bytesEarned: number;
    streakDays: number;
  }) => void;
}

export function DailyRitualCard({
  ritual,
  state,
  canComplete,
  assignmentId,
  onComplete
}: DailyRitualCardProps) {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Get category info for rewards
  const categoryInfo = PAID_RITUAL_CATEGORIES[ritual.category as keyof typeof PAID_RITUAL_CATEGORIES];

  const handleStartRitual = () => {
    setShowCompletionModal(true);
  };

  const handleCompleteRitual = (data: any) => {
    setShowCompletionModal(false);
    onComplete(data);
  };

  const getStateColor = () => {
    switch (state) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'locked':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200 hover:border-purple-300';
    }
  };

  const getStateIcon = () => {
    switch (state) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'locked':
        return <div className="h-5 w-5 bg-gray-300 rounded" />;
      default:
        return <Star className="h-5 w-5 text-purple-600" />;
    }
  };

  const getCategoryBadgeColor = () => {
    const categoryColors: Record<string, string> = {
      'grief-cycle': 'bg-blue-100 text-blue-800',
      'petty-purge': 'bg-red-100 text-red-800',
      'glow-up-forge': 'bg-yellow-100 text-yellow-800',
      'reframe-loop': 'bg-green-100 text-green-800',
      'ghost-cleanse': 'bg-purple-100 text-purple-800',
      'public-face': 'bg-pink-100 text-pink-800',
      'soft-reset': 'bg-indigo-100 text-indigo-800',
      'cult-missions': 'bg-orange-100 text-orange-800'
    };
    return categoryColors[ritual.category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card className={`transition-all duration-200 ${getStateColor()}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getStateIcon()}
              <Badge className={getCategoryBadgeColor()}>
                {ritual.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {ritual.estimatedMinutes}m
            </div>
          </div>
          <CardTitle className="text-lg font-semibold">
            {ritual.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {ritual.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{categoryInfo?.baseXP || ritual.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-purple-500 rounded" />
                <span className="font-medium">{categoryInfo?.baseBytes || ritual.bytesReward} Bytes</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {state === 'completed' ? (
                <Badge className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              ) : state === 'locked' ? (
                <Badge className="bg-gray-100 text-gray-500">
                  Locked
                </Badge>
              ) : (
                <Button
                  onClick={handleStartRitual}
                  disabled={!canComplete}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  Start Ritual
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showCompletionModal && (
        <DailyRitualCompletionModal
          ritual={ritual}
          assignmentId={assignmentId}
          onComplete={handleCompleteRitual}
          onCancel={() => setShowCompletionModal(false)}
        />
      )}
    </>
  );
}
