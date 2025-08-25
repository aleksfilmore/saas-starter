"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Zap, Crown, Sparkles, Target, TrendingUp, Calendar } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'rare' | 'milestone' | 'standard' | 'cult-exclusive';
  bytesValue: number; // replaced xpValue
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface ProgressVisualizationProps {
  userBytes: number; // total accumulated bytes
  dailyBytesGained: number;
  weeklyBytesTarget: number;
  userTier: 'free' | 'firewall' | 'cult-leader';
  recentAchievements: Achievement[];
  onShareAchievement?: (achievement: Achievement) => void;
  onClaimReward?: (achievementId: string) => void;
}

export default function ProgressVisualization({
  userBytes,
  dailyBytesGained,
  weeklyBytesTarget,
  userTier,
  recentAchievements,
  onShareAchievement,
  onClaimReward
}: ProgressVisualizationProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);

  // Calculate progress metrics
  const getProgressMetrics = () => {
    const nextMilestone = Math.max(1000, Math.ceil(userBytes / 1000) * 1000);
    const milestoneProgress = (userBytes / nextMilestone) * 100;
    const weeklyProgress = Math.min((dailyBytesGained * 7) / weeklyBytesTarget * 100, 100);
    return { nextMilestone, milestoneProgress, weeklyProgress };
  };

  const metrics = getProgressMetrics();

  // Achievement celebration effect
  useEffect(() => {
    if (recentAchievements.length > 0) {
      const latestAchievement = recentAchievements[recentAchievements.length - 1];
      if (latestAchievement.unlockedAt && 
          new Date().getTime() - latestAchievement.unlockedAt.getTime() < 5000) {
        setCelebratingAchievement(latestAchievement);
        setShowCelebration(true);
        
        // Auto-dismiss celebration
        setTimeout(() => {
          setShowCelebration(false);
          setCelebratingAchievement(null);
        }, 4000);
      }
    }
  }, [recentAchievements]);

  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'rare':
        return <Star className="h-6 w-6 text-yellow-400" />;
      case 'cult-exclusive':
        return <Crown className="h-6 w-6 text-purple-400" />;
      case 'milestone':
        return <Target className="h-6 w-6 text-blue-400" />;
      default:
        return <Trophy className="h-6 w-6 text-green-400" />;
    }
  };

  const getAchievementColors = (type: Achievement['type']) => {
    switch (type) {
      case 'rare':
        return {
          bg: 'bg-yellow-900/20',
          border: 'border-yellow-500/50',
          text: 'text-yellow-400'
        };
      case 'cult-exclusive':
        return {
          bg: 'bg-purple-900/20',
          border: 'border-purple-500/50',
          text: 'text-purple-400'
        };
      case 'milestone':
        return {
          bg: 'bg-blue-900/20',
          border: 'border-blue-500/50',
          text: 'text-blue-400'
        };
      default:
        return {
          bg: 'bg-green-900/20',
          border: 'border-green-500/50',
          text: 'text-green-400'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Achievement Celebration Overlay */}
      {showCelebration && celebratingAchievement && (
        <Card className="fixed inset-4 z-50 bg-gradient-to-br from-yellow-900/95 via-orange-900/95 to-red-900/95 border-2 border-yellow-500/80 backdrop-blur-lg animate-in fade-in-0 zoom-in-95">
          <CardContent className="flex flex-col items-center justify-center h-full text-center relative overflow-hidden">
            {/* Glitch Effect for Rare Achievements */}
            {celebratingAchievement.type === 'rare' && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-blue-500/20 animate-pulse" />
            )}
            
            {/* Sparkle Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <Sparkles
                  key={i}
                  className={`absolute h-4 w-4 text-yellow-400 animate-bounce`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="text-8xl animate-bounce">🎉</div>
              
              <div>
                <h2 className="text-4xl font-black text-yellow-400 mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  ACHIEVEMENT UNLOCKED!
                </h2>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {getAchievementIcon(celebratingAchievement.type)}
                  <h3 className="text-2xl font-bold text-white">
                    {celebratingAchievement.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-300 max-w-md mx-auto">
                  {celebratingAchievement.description}
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
                <Zap className="h-8 w-8 text-blue-400" />
                <span className="text-blue-400">+{celebratingAchievement.bytesValue} Bytes</span>
              </div>
              
              <div className="flex space-x-4">
                {onShareAchievement && (
                  <Button
                    onClick={() => onShareAchievement(celebratingAchievement)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold"
                  >
                    📱 Share Achievement
                  </Button>
                )}
                <Button
                  onClick={() => setShowCelebration(false)}
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-800"
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

  {/* Bytes Progress Visualization */}
      <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/30 to-blue-900/20 border-2 border-purple-500/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            📊 PROGRESSION CONSOLE
          </CardTitle>
          <Badge className={`mx-auto ${
            userTier === 'free' ? 'bg-blue-500/20 text-blue-400' :
            userTier === 'firewall' ? 'bg-orange-500/20 text-orange-400' :
            'bg-purple-500/20 text-purple-400'
          }`}>
            {userTier.toUpperCase()} TIER
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Bytes Ring */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              {/* Background Ring */}
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgb(75 85 99)"
                  strokeWidth="2"
                />
                {/* Milestone Progress (bytes) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${metrics.milestoneProgress}, 100`}
                  className="transition-all duration-1000"
                />
        {/* Daily Bytes Glow Effect */}
        {dailyBytesGained > 0 && (
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgb(250 204 21)"
                    strokeWidth="1"
          strokeDasharray={`${(dailyBytesGained / 25) * 100}, 100`}
                    className="animate-pulse"
                  />
                )}
              </svg>
              
              {/* Gradient Definition */}
              <svg className="absolute inset-0 w-0 h-0">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(168 85 247)" />
                    <stop offset="50%" stopColor="rgb(236 72 153)" />
                    <stop offset="100%" stopColor="rgb(59 130 246)" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl font-black text-white">{userBytes}</div>
                <div className="text-xs text-purple-400 font-bold">TOTAL BYTES</div>
                <div className="text-xs text-gray-400">{Math.max(0, Math.round(metrics.nextMilestone - userBytes))} to {metrics.nextMilestone}</div>
                {dailyBytesGained > 0 && (
                  <div className="text-xs text-yellow-400 font-bold animate-pulse">+{dailyBytesGained} today</div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {/* Daily Progress */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-bold">Today</span>
                </div>
                <span className="text-green-400 font-bold">+{dailyBytesGained}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((dailyBytesGained / 25) * 100, 100)}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">Target: 25 bytes/day</p>
            </div>

            {/* Weekly Progress */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-bold">Weekly</span>
                </div>
                <span className="text-blue-400 font-bold">
                  {Math.round(metrics.weeklyProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.weeklyProgress}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">Target: {weeklyBytesTarget} bytes</p>
            </div>

            {/* Milestone Progress */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-bold">Milestone</span>
                </div>
                <span className="text-purple-400 font-bold">
                  {Math.round(metrics.milestoneProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.milestoneProgress}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">Next: {metrics.nextMilestone} bytes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="bg-gradient-to-br from-yellow-900/20 via-orange-900/30 to-red-900/20 border-2 border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              🏆 RECENT ACHIEVEMENTS
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {recentAchievements.slice(-3).map((achievement) => {
              const colors = getAchievementColors(achievement.type);
              
              return (
                <div
                  key={achievement.id}
                  className={`${colors.bg} border ${colors.border} rounded-xl p-4 relative overflow-hidden`}
                >
                  {achievement.type === 'rare' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse" />
                  )}
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      {getAchievementIcon(achievement.type)}
                      <div>
                        <h4 className={`font-bold ${colors.text}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {achievement.description}
                        </p>
                        <span className="text-blue-400 font-bold">+{achievement.bytesValue}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-400 font-bold">+{achievement.bytesValue}</span>
                      </div>
                      {onClaimReward && (
                        <Button
                          size="sm"
                          onClick={() => onClaimReward(achievement.id)}
                          className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs mt-1"
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
