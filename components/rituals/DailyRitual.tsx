"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Check, 
  Clock, 
  Flame, 
  Upload, 
  RefreshCw, 
  Zap,
  Star,
  Gift
} from 'lucide-react';
import { Ritual, getDailyRitual, RITUAL_CATEGORIES } from '@/lib/rituals/ritual-bank';

interface DailyRitualProps {
  userId: string;
  userTier: 'ghost' | 'firewall' | 'deep-reset';
  streak: number;
  onRitualComplete: (ritualId: string, proof?: string) => void;
}

export function DailyRitual({ userId, userTier, streak, onRitualComplete }: DailyRitualProps) {
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [proof, setProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get today's ritual based on day of year
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const ritual = getDailyRitual(dayOfYear, 'linear');
    setCurrentRitual(ritual);
  }, []);

  const handleCompleteRitual = async () => {
    if (!currentRitual) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsCompleted(true);
      onRitualComplete(currentRitual.id, showProof ? proof : undefined);
      
      // Show completion animation
      setTimeout(() => {
        setIsCompleted(false);
        setShowProof(false);
        setProof('');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to complete ritual:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNextRitual = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const newRitual = getDailyRitual(dayOfYear + 1, 'random');
    setCurrentRitual(newRitual);
    setIsCompleted(false);
    setShowProof(false);
    setProof('');
  };

  if (!currentRitual) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your ritual...</p>
        </CardContent>
      </Card>
    );
  }

  const categoryInfo = RITUAL_CATEGORIES[currentRitual.category];

  return (
    <div className="space-y-6">
      {/* Header with Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Today's Ritual</h2>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 font-medium">{streak} day streak</span>
          </div>
        </div>
        <Button
          onClick={getNextRitual}
          variant="outline"
          size="sm"
          className="border-gray-600 hover:bg-gray-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Ritual
        </Button>
      </div>

      {/* Main Ritual Card */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-purple-900/20 border-2 border-purple-500/50 overflow-hidden">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-purple-300">{categoryInfo.title}</h3>
              <p className="text-sm text-purple-400">{categoryInfo.subtitle}</p>
            </div>
          </div>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl text-white mb-2">
                {currentRitual.title}
              </CardTitle>
              <p className="text-gray-300 text-sm mb-4">
                {currentRitual.description}
              </p>
              
              {/* Ritual Metadata */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentRitual.estimatedTime}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  Difficulty: {currentRitual.difficultyLevel}/5
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`border-orange-500 text-orange-400 ${
                    userTier === 'ghost' && currentRitual.tier !== 'ghost' ? 'opacity-50' : ''
                  }`}
                >
                  {currentRitual.tier.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            {/* Rewards */}
            <div className="text-right">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Star className="h-4 w-4" />
                <span className="font-bold">{currentRitual.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Gift className="h-4 w-4" />
                <span className="font-bold">{currentRitual.byteReward} Bytes</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Instructions */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Instructions</h4>
            <div className="space-y-3">
              {currentRitual.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Restriction */}
          {userTier === 'ghost' && currentRitual.tier !== 'ghost' && (
            <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Upgrade Required</span>
              </div>
              <p className="text-orange-300 text-sm">
                This ritual requires {currentRitual.tier === 'firewall' ? 'Firewall Mode' : 'Deep Reset Protocol'}. 
                Upgrade to unlock advanced healing rituals.
              </p>
            </div>
          )}

          {/* Completion Section */}
          <div className="space-y-4">
            {!isCompleted && (
              <>
                {/* Optional Proof Upload */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="show-proof"
                    checked={showProof}
                    onChange={(e) => setShowProof(e.target.checked)}
                    className="rounded border-gray-600"
                  />
                  <label htmlFor="show-proof" className="text-gray-300 text-sm">
                    Share proof for bonus Bytes (+10)
                  </label>
                </div>

                {showProof && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Describe your experience (optional):
                    </label>
                    <textarea
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                      placeholder="How did this ritual feel? What did you discover?"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                      rows={3}
                    />
                  </div>
                )}

                {/* Complete Button */}
                <Button
                  onClick={handleCompleteRitual}
                  disabled={isSubmitting || (userTier === 'ghost' && currentRitual.tier !== 'ghost')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing Ritual...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Mark Ritual Complete
                    </div>
                  )}
                </Button>
              </>
            )}

            {/* Completion State */}
            {isCompleted && (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 rounded-lg p-6">
                  <div className="text-4xl mb-2">✨</div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">Ritual Complete!</h3>
                  <p className="text-green-300 mb-4">
                    You've earned {currentRitual.xpReward} XP and {currentRitual.byteReward} Bytes
                    {showProof && proof ? ' (+10 bonus Bytes for sharing)' : ''}
                  </p>
                  <div className="flex justify-center">
                    <Progress value={100} className="w-32 h-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Ritual Preview */}
      <Card className="bg-gray-900/30 border-gray-700">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Coming Tomorrow</h4>
          <p className="text-gray-300">
            Your next ritual will be selected based on your progress and emotional tone. 
            Complete today's ritual to unlock your streak rewards!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
