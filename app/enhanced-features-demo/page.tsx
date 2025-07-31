"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WeeklyTherapySession from '@/components/ai-therapy/WeeklyTherapySession';
import ProgressVisualization from '@/components/gamification/ProgressVisualization';
import ProgressiveOnboarding from '@/components/onboarding/ProgressiveOnboarding';
import EnhancedWallOfWounds from '@/components/wall/EnhancedWallOfWounds';

// Mock data for demo
const mockAchievements = [
  {
    id: 'first-week',
    title: 'First Week Complete',
    description: 'Completed your first week of healing rituals',
    type: 'standard' as const,
    xpValue: 100,
    unlockedAt: new Date(Date.now() - 10000) // 10 seconds ago
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: '7-day ritual streak achieved',
    type: 'milestone' as const,
    xpValue: 250,
    unlockedAt: new Date(Date.now() - 60000) // 1 minute ago
  }
];

const mockWallPosts = [
  {
    id: '1',
    alias: 'DigitalPhoenix',
    avatar: '🔥',
    content: 'Three months post-breakup and I finally deleted all their photos. Small win, but it feels massive. The urge to check their stories is still there but getting weaker.',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    emotionalTags: { numb: 2, vengeance: 1, logic: 5, helpOthers: 8 },
    upvotes: 47,
    commentCount: 12,
    isTopGlitch: true,
    userTier: 'firewall' as const
  },
  {
    id: '2',
    alias: 'VoidSeeker',
    avatar: '👻',
    content: 'Anyone else feel like they\'re just going through the motions? Work, eat, sleep, repeat. I know I should be grateful but everything just feels... gray.',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    emotionalTags: { numb: 23, vengeance: 0, logic: 3, helpOthers: 1 },
    upvotes: 31,
    commentCount: 8,
    isRelatableStream: true,
    userTier: 'free' as const
  }
];

export default function EnhancedFeaturesDemo() {
  const [currentDemo, setCurrentDemo] = useState<'therapy' | 'progress' | 'onboarding' | 'wall'>('therapy');
  const [userXP, setUserXP] = useState(347);
  const [userWeek, setUserWeek] = useState(2);
  const [userTier, setUserTier] = useState<'free' | 'firewall' | 'cult-leader'>('firewall');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [dailyXP, setDailyXP] = useState(45);

  const handleTherapyComplete = (xp: number, bytes: number) => {
    setUserXP(prev => prev + xp);
    setDailyXP(prev => prev + xp);
    alert(`Session completed! +${xp} XP, +${bytes} Bytes earned!`);
  };

  const handleAchievementUnlock = (achievement: any) => {
    alert(`🎉 Achievement Unlocked: ${achievement.title}!`);
  };

  const handleOnboardingStepComplete = (stepId: string, data: any) => {
    console.log('Onboarding step completed:', stepId, data);
    if (stepId !== 'back') {
      setOnboardingStep(prev => Math.min(prev + 1, 4));
    } else {
      setOnboardingStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleWallActions = {
    onSubmitPost: (content: string) => {
      console.log('New post:', content);
      alert('Post submitted to the Wall of Wounds!');
    },
    onReactToPost: (postId: string, reaction: string) => {
      console.log('React to post:', postId, reaction);
    },
    onCommentOnPost: (postId: string, comment: string) => {
      console.log('Comment on post:', postId, comment);
    },
    onSharePost: (postId: string) => {
      console.log('Share post:', postId);
      alert('Post shared! Spreading the healing vibes.');
    },
    onReportPost: (postId: string) => {
      console.log('Report post:', postId);
      alert('Post reported. Our AI moderation will review it.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white text-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              🚀 CTRL+ALT+BLOCK™ ENHANCED FEATURES
            </CardTitle>
            <p className="text-purple-400 text-center text-lg">
              Experience the next level of digital healing platform
            </p>
            
            {/* User Stats */}
            <div className="flex justify-center space-x-4 mt-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                {userXP} XP
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                Week {userWeek}
              </Badge>
              <Badge className={`${
                userTier === 'free' ? 'bg-blue-500/20 text-blue-400' :
                userTier === 'firewall' ? 'bg-orange-500/20 text-orange-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {userTier.toUpperCase()} TIER
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setCurrentDemo('therapy')}
            variant={currentDemo === 'therapy' ? 'default' : 'outline'}
            className={currentDemo === 'therapy' ? 'bg-purple-500 text-white' : 'border-gray-600 text-gray-400'}
          >
            🎮 Enhanced Therapy
          </Button>
          <Button
            onClick={() => setCurrentDemo('progress')}
            variant={currentDemo === 'progress' ? 'default' : 'outline'}
            className={currentDemo === 'progress' ? 'bg-purple-500 text-white' : 'border-gray-600 text-gray-400'}
          >
            📊 Progress Visualization
          </Button>
          <Button
            onClick={() => setCurrentDemo('onboarding')}
            variant={currentDemo === 'onboarding' ? 'default' : 'outline'}
            className={currentDemo === 'onboarding' ? 'bg-purple-500 text-white' : 'border-gray-600 text-gray-400'}
          >
            🎯 Progressive Onboarding
          </Button>
          <Button
            onClick={() => setCurrentDemo('wall')}
            variant={currentDemo === 'wall' ? 'default' : 'outline'}
            className={currentDemo === 'wall' ? 'bg-purple-500 text-white' : 'border-gray-600 text-gray-400'}
          >
            📱 Enhanced Wall
          </Button>
        </div>

        {/* Demo Content */}
        <div className="space-y-6">
          {currentDemo === 'therapy' && (
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400">🎮 Enhanced AI Therapy Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-300 space-y-2">
                    <li>✨ <strong>AI Personality Adaptation:</strong> Response style changes based on your emotional tone</li>
                    <li>🎉 <strong>Achievement Celebrations:</strong> Real-time XP milestones with visual effects</li>
                    <li>📊 <strong>Enhanced Progress Rings:</strong> XP visualization with daily/weekly breakdown</li>
                    <li>⚡ <strong>Error Handling:</strong> Graceful degradation with branded error messages</li>
                    <li>👑 <strong>Tier-Specific Features:</strong> Cult Leader exclusive glitch effects</li>
                  </ul>
                </CardContent>
              </Card>
              
              <WeeklyTherapySession
                userXP={userXP}
                userWeek={userWeek}
                userTier={userTier}
                onComplete={handleTherapyComplete}
                onAchievementUnlock={handleAchievementUnlock}
                dailyXPGained={dailyXP}
                weeklyXPTarget={500}
                emotionalToneDial="logic"
                onXPUnlock={(cost) => {
                  setUserXP(prev => prev - cost);
                  alert(`Session unlocked with ${cost} XP!`);
                }}
                onPurchaseSession={() => alert('Emergency session purchased for $5!')}
              />
            </div>
          )}

          {currentDemo === 'progress' && (
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400">📊 Enhanced Progress Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-300 space-y-2">
                    <li>🎯 <strong>Multi-Metric Progress:</strong> Daily, weekly, and milestone tracking</li>
                    <li>🏆 <strong>Achievement Celebrations:</strong> Full-screen celebrations with glitch effects</li>
                    <li>📈 <strong>Visual Progress Rings:</strong> Animated XP circles with glow effects</li>
                    <li>✨ <strong>Micro-Animations:</strong> Sparkle effects and smooth transitions</li>
                    <li>🎊 <strong>Share System:</strong> Social sharing for major achievements</li>
                  </ul>
                </CardContent>
              </Card>
              
              <ProgressVisualization
                userXP={userXP}
                dailyXPGained={dailyXP}
                weeklyXPTarget={500}
                userTier={userTier}
                recentAchievements={mockAchievements}
                onShareAchievement={(achievement) => alert(`Sharing: ${achievement.title}`)}
                onClaimReward={(id) => alert(`Claimed reward for ${id}!`)}
              />
            </div>
          )}

          {currentDemo === 'onboarding' && (
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-400">🎯 Progressive Onboarding System</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-300 space-y-2">
                    <li>📋 <strong>Step-by-Step Guidance:</strong> Clear progress indicators with time estimates</li>
                    <li>🎨 <strong>Visual Step Indicators:</strong> Animated progress with completion states</li>
                    <li>⚡ <strong>XP Rewards:</strong> Immediate feedback for each completed step</li>
                    <li>🔄 <strong>Error Recovery:</strong> Graceful handling of onboarding failures</li>
                    <li>⏭️ <strong>Skip Options:</strong> Flexible flow for returning users</li>
                  </ul>
                </CardContent>
              </Card>
              
              <ProgressiveOnboarding
                currentStep={onboardingStep}
                onStepComplete={handleOnboardingStepComplete}
                onSkipStep={(stepId) => {
                  console.log('Skipped step:', stepId);
                  setOnboardingStep(prev => Math.min(prev + 1, 4));
                }}
                userAlias="DemoUser"
                emotionalTone="logic"
              />
            </div>
          )}

          {currentDemo === 'wall' && (
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border border-pink-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-pink-400">📱 Enhanced Wall of Wounds</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-300 space-y-2">
                    <li>🔥 <strong>Viral Mechanics:</strong> "Weekly Top Glitch" and "Relatable Stream" filters</li>
                    <li>💭 <strong>Emotional Tagging:</strong> React with specific emotional tones</li>
                    <li>👑 <strong>Tier Indicators:</strong> Visual badges for user tiers</li>
                    <li>🎯 <strong>Personalized Feed:</strong> "My Vibe" filter based on emotional tone</li>
                    <li>📊 <strong>Engagement Metrics:</strong> Enhanced view and interaction counts</li>
                  </ul>
                </CardContent>
              </Card>
              
              <EnhancedWallOfWounds
                posts={mockWallPosts}
                userAlias="DemoHealer"
                userTier={userTier}
                userEmotionalTone="logic"
                {...handleWallActions}
              />
            </div>
          )}
        </div>

        {/* Enhancement Summary */}
        <Card className="bg-gradient-to-br from-green-900/20 via-blue-900/30 to-purple-900/20 border-2 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-white text-center">
              🎯 IMPLEMENTATION STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-green-400 font-bold mb-3">✅ COMPLETED ENHANCEMENTS</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Progressive onboarding with step indicators</li>
                <li>• Enhanced XP visualization with progress rings</li>
                <li>• Achievement celebration system</li>
                <li>• AI personality adaptation</li>
                <li>• Error handling with graceful degradation</li>
                <li>• Viral mechanics for Wall of Wounds</li>
                <li>• Emotional tagging system</li>
                <li>• Tier-specific visual effects</li>
              </ul>
            </div>
            <div>
              <h4 className="text-blue-400 font-bold mb-3">🔄 READY FOR INTEGRATION</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Dashboard personalization based on user level</li>
                <li>• Emergency protocol refinement</li>
                <li>• Performance optimizations</li>
                <li>• Accessibility improvements</li>
                <li>• Community features expansion</li>
                <li>• Monetization optimizations</li>
                <li>• Cult Leader exclusive features</li>
                <li>• Bundle size optimization</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
