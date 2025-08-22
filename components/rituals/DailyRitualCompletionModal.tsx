/**
 * Daily Ritual Completion Modal
 * CTRL+ALT+BLOCK™ v1.1 - Enhanced with specification-compliant validation
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Star, X, Save, AlertTriangle } from 'lucide-react';
import { type PaidRitual, PAID_RITUAL_CATEGORIES } from '@/lib/rituals/paid-rituals-database';
import { toast } from 'sonner';
import { validateJournalEntry, type JournalValidationResult } from '@/lib/validation/journal-validator';
import { JournalDraftManager } from '@/lib/validation/journal-draft-manager';

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
  const [validationResult, setValidationResult] = useState<JournalValidationResult | null>(null);
  const [lastEntry, setLastEntry] = useState<string>('');
  const [startTime] = useState(Date.now());
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const draftManagerRef = useRef<JournalDraftManager | null>(null);

  // Initialize draft manager
  useEffect(() => {
    // Get user ID from session/auth (you'll need to implement this)
    const userId = 'current-user'; // Replace with actual user ID
    draftManagerRef.current = new JournalDraftManager(userId, ritual.id, assignmentId);
    
    // Restore draft if exists
    const savedDraft = draftManagerRef.current.restoreDraft();
    if (savedDraft && savedDraft.text.trim()) {
      setJournalText(savedDraft.text);
      setDwellTimeSeconds(savedDraft.timingSeconds);
      toast.info('Draft restored from previous session');
    }
    
    // Start autosave system
    draftManagerRef.current.startAutosave((draft) => {
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 2000);
    });
    
    // Fetch last journal entry for similarity check
    fetchLastJournalEntry();
    
    return () => {
      if (draftManagerRef.current) {
        draftManagerRef.current.stopAutosave();
      }
    };
  }, [ritual.id, assignmentId]);

  // Track dwell time with active typing detection
  useEffect(() => {
    const interval = setInterval(() => {
      setDwellTimeSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Validate journal entry on text change
  useEffect(() => {
    if (journalText.trim().length > 0) {
      validateEntry();
    }
  }, [journalText, dwellTimeSeconds]);

  const fetchLastJournalEntry = async () => {
    try {
      const response = await fetch('/api/journal/last-entry');
      if (response.ok) {
        const data = await response.json();
        setLastEntry(data.text || '');
      }
    } catch (error) {
      console.error('Error fetching last entry:', error);
    }
  };

  const validateEntry = async () => {
    try {
      const result = await validateJournalEntry(
        {
          text: journalText,
          userId: 'current-user', // Replace with actual user ID
          timingSeconds: dwellTimeSeconds
        },
        lastEntry
      );
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalText(e.target.value);
    
    // Mark as typing for autosave
    if (draftManagerRef.current) {
      draftManagerRef.current.markTyping();
    }
  };

  const handleBlur = () => {
    // Save draft on blur
    if (draftManagerRef.current) {
      draftManagerRef.current.saveCurrentDraft(() => {
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      });
    }
  };

  const categoryInfo = PAID_RITUAL_CATEGORIES[ritual.category as keyof typeof PAID_RITUAL_CATEGORIES];
  
  // Spec-compliant validation requirements
  const canSubmit = validationResult?.isValid && !isSubmitting;
  const wordCount = journalText.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleSubmit = async () => {
    if (!canSubmit || !validationResult?.isValid) {
      toast.error('Please complete all requirements before submitting');
      return;
    }

    // Check rate limiting
    try {
      const rateLimitResponse = await fetch('/api/journal/rate-limit-check');
      const rateLimitData = await rateLimitResponse.json();
      
      if (!rateLimitData.allowed) {
        toast.error('Please wait before completing another ritual (max 2 per 10 minutes)');
        return;
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
    }

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
              ref={textareaRef}
              id="journal-textarea"
              placeholder="Share your thoughts, feelings, and insights from this ritual. Be honest and authentic in your reflection..."
              value={journalText}
              onChange={handleTextChange}
              onBlur={handleBlur}
              className="min-h-[120px] resize-none"
            />
            
            {/* Enhanced Validation Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className={`${(validationResult?.characterCount || 0) >= 120 || (validationResult?.wordCount || 0) >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
                    {validationResult?.characterCount || 0} chars / {wordCount} words
                  </span>
                  <span className={`${dwellTimeSeconds >= 45 ? 'text-green-600' : 'text-orange-500'}`}>
                    ⏱️ {dwellTimeSeconds}s / 45s min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isDraftSaved && (
                    <span className="text-green-600 text-xs flex items-center gap-1">
                      <Save className="h-3 w-3" />
                      Draft saved
                    </span>
                  )}
                </div>
              </div>
              
              {/* Quality Metrics */}
              {validationResult && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${(validationResult?.characterCount || 0) >= 50 ? 'text-green-600' : 'text-orange-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${(validationResult?.characterCount || 0) >= 50 ? 'bg-green-500' : 'bg-orange-500'}`} />
                    Length: {validationResult?.characterCount || 0} chars
                  </div>
                  <div className={`flex items-center gap-1 ${(validationResult?.wordCount || 0) >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${(validationResult?.wordCount || 0) >= 10 ? 'bg-green-500' : 'bg-gray-400'}`} />
                    Words: {validationResult?.wordCount || 0}
                  </div>
                </div>
              )}
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
                <span>{ritual.bytesReward} Bytes</span>
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

          {/* Enhanced Validation Messages */}
          {validationResult && !validationResult.isValid && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="text-orange-700 text-sm font-medium">Complete these requirements:</p>
              </div>
              <ul className="text-orange-600 text-sm space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success validation display */}
          {validationResult?.isValid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <p className="text-green-700 text-sm font-medium">Ready to complete! All requirements met.</p>
              </div>
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
