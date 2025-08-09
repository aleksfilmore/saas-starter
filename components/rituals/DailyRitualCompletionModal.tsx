/**
 * Daily Ritual Completion Modal
 * Handles the ritual completion flow with journaling and validation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Star, X } from 'lucide-react';
import { type PaidRitual, PAID_RITUAL_CATEGORIES } from '@/lib/rituals/paid-rituals-database';
import { toast } from 'sonner';

interface DailyRitualCompletionModalProps {
  ritual: PaidRitual;
  assignmentId: number;
  onComplete: (data: {
    xpEarned: number;
    bytesEarned: number;
    streakDays: number;
  }) => void;
  onCancel: () => void;
}

export function DailyRitualCompletionModal({
  ritual,
  assignmentId,
  onComplete,
  onCancel
}: DailyRitualCompletionModalProps) {
  const [journalText, setJournalText] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [dwellTimeSeconds, setDwellTimeSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  // Track dwell time
  useEffect(() => {
    const interval = setInterval(() => {
      setDwellTimeSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const categoryInfo = PAID_RITUAL_CATEGORIES[ritual.category as keyof typeof PAID_RITUAL_CATEGORIES];
  const minChars = 140;
  const minDwellTime = 20;
  const wordCount = journalText.trim().split(/\s+/).filter(word => word.length > 0).length;

  const canSubmit = journalText.length >= minChars && 
                    dwellTimeSeconds >= minDwellTime && 
                    !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/daily-rituals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          ritualId: ritual.id,
          journalText,
          moodRating,
          dwellTimeSeconds
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to complete ritual');
      }

      toast.success('Ritual completed successfully! 🎉');
      onComplete(result.data);
    } catch (error) {
      console.error('Error completing ritual:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete ritual');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (rating: number) => {
    const emojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤩'];
    return emojis[rating - 1] || '😐';
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
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Complete Ritual</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ritual Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={getCategoryBadgeColor()}>
                {ritual.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {ritual.estimatedMinutes}m
              </div>
            </div>
            
            <h3 className="text-lg font-semibold">{ritual.title}</h3>
            <p className="text-gray-700 text-sm">{ritual.description}</p>
          </div>

          {/* Ritual Instructions */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Your Ritual Instructions:</h4>
            <p className="text-purple-700 text-sm leading-relaxed">
              {ritual.lesson}
            </p>
          </div>

          {/* Journal Prompt & Input */}
          <div className="space-y-3">
            <Label htmlFor="journal" className="text-base font-medium">
              Reflection Journal
            </Label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-blue-800 text-sm font-medium mb-1">Journal Prompt:</p>
              <p className="text-blue-700 text-sm italic">
                {ritual.journalPrompt}
              </p>
            </div>
            
            <Textarea
              id="journal"
              placeholder="Share your thoughts, feelings, and insights from this ritual. Be honest and authentic in your reflection..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            
            <div className="flex items-center justify-between text-sm">
              <span className={`${journalText.length >= minChars ? 'text-green-600' : 'text-gray-500'}`}>
                {journalText.length}/{minChars} characters ({wordCount} words)
              </span>
              <span className={`${dwellTimeSeconds >= minDwellTime ? 'text-green-600' : 'text-orange-500'}`}>
                Reflection time: {dwellTimeSeconds}s (min: {minDwellTime}s)
              </span>
            </div>
          </div>

          {/* Mood Rating */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              How are you feeling after this ritual?
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMoodRating(rating)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all ${
                    moodRating === rating
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {getMoodEmoji(rating)}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Rate your mood from 1 (low) to 7 (high)
            </p>
          </div>

          {/* Rewards Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Completion Rewards:</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{categoryInfo?.baseXP || ritual.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-purple-500 rounded" />
                <span>{categoryInfo?.baseBytes || ritual.bytesReward} Bytes</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-orange-500" />
                <span>Streak Progress</span>
              </div>
            </div>
          </div>

          {/* Validation Messages */}
          {!canSubmit && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-orange-700 text-sm font-medium mb-1">Complete these requirements:</p>
              <ul className="text-orange-600 text-sm space-y-1">
                {journalText.length < minChars && (
                  <li>• Write at least {minChars - journalText.length} more characters</li>
                )}
                {dwellTimeSeconds < minDwellTime && (
                  <li>• Spend {minDwellTime - dwellTimeSeconds} more seconds reflecting</li>
                )}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? 'Completing...' : 'Complete Ritual'}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
