"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Trophy, Zap, Heart, Timer, ArrowLeft, Sparkles, Star, Crown } from 'lucide-react';
import { useErrorHandling, LoadingSpinner, ErrorDisplay } from '@/components/ui/error-handling';

interface TherapyChoice {
  id: string;
  text: string;
  emotion: 'vulnerable' | 'angry' | 'growth' | 'avoidant';
  followUp: string;
  xpReward: number;
  byteReward: number;
}

interface TherapyScenario {
  week: number;
  title: string;
  scenario: string;
  context: string;
  choices: TherapyChoice[];
}

const THERAPY_SCENARIOS: TherapyScenario[] = [
  {
    week: 1,
    title: "The Digital Stalking Spiral",
    scenario: "It's 2 AM. You're holding your phone. Their Instagram story shows them at a party, laughing.",
    context: "Your brain is screaming. Your heart is racing. What's your move?",
    choices: [
      {
        id: "stalk",
        text: "I need to see who they're with. *scrolls deeper*",
        emotion: "avoidant",
        followUp: "I see you. The digital detective work feels necessary, but it's digital self-harm. Your nervous system can't tell the difference between real danger and social media FOMO. Let's build you a better late-night ritual.",
        xpReward: 5,
        byteReward: 10
      },
      {
        id: "text",
        text: "I should text them. Just to check in.",
        emotion: "vulnerable",
        followUp: "That urge to reach out is your attachment system in panic mode. But 2 AM 'check-ins' are emotional gambling. Your future self will thank you for the self-restraint. What if we channeled that energy differently?",
        xpReward: 10,
        byteReward: 25
      },
      {
        id: "rage",
        text: "Fuck them. They're probably doing this on purpose.",
        emotion: "angry",
        followUp: "That anger is protective - and valid. But making it about them gives them power over your peace. What if this moment is actually about you reclaiming your narrative? Your healing doesn't need their cooperation.",
        xpReward: 15,
        byteReward: 30
      },
      {
        id: "close",
        text: "I close the app and put the phone away.",
        emotion: "growth",
        followUp: "Holy shit. You just chose yourself over the chaos. That's advanced-level healing right there. Your nervous system is learning that you can feel the urge without acting on it. This is how you reprogram your responses.",
        xpReward: 25,
        byteReward: 50
      }
    ]
  },
  {
    week: 2,
    title: "The Almost-Text",
    scenario: "You draft the perfect message. It's sitting in your notes app. Your thumb is hovering over send.",
    context: "Part of you thinks this will bring closure. Part of you knows it won't.",
    choices: [
      {
        id: "send_closure",
        text: "I need closure. I'm sending it.",
        emotion: "vulnerable",
        followUp: "Closure is an inside job, but sometimes we need to learn that the hard way. If you sent it, observe what happens in your body. Did it actually provide relief, or just temporary distraction from the discomfort of letting go?",
        xpReward: 8,
        byteReward: 15
      },
      {
        id: "send_hurt",
        text: "I want them to know they hurt me.",
        emotion: "angry",
        followUp: "Your pain deserves to be witnessed - but not necessarily by the person who caused it. They already know they hurt you. The question is: do you want to give them more access to your emotional state, or do you want to process this wound with people who can actually help?",
        xpReward: 12,
        byteReward: 20
      },
      {
        id: "delete",
        text: "I delete it. This won't help.",
        emotion: "growth",
        followUp: "That's emotional maturity in action. You felt the urge, honored it by writing it out, then chose not to export your internal chaos. You're learning to metabolize your emotions without making them someone else's problem. That's power.",
        xpReward: 20,
        byteReward: 40
      },
      {
        id: "save_draft",
        text: "I save it as a draft for later.",
        emotion: "avoidant",
        followUp: "The eternal maybe. You're keeping the option open, which keeps you emotionally tethered to them. Sometimes the most loving thing you can do is make the decision final. What would it feel like to choose, once and for all?",
        xpReward: 6,
        byteReward: 12
      }
    ]
  },
  {
    week: 3,
    title: "The Mutual Friend Update",
    scenario: "Your friend casually mentions seeing your ex at a coffee shop. 'They looked really good,' they say.",
    context: "Your stomach drops. Suddenly you're thinking about their life without you.",
    choices: [
      {
        id: "interrogate",
        text: "Tell me everything. Who were they with?",
        emotion: "avoidant",
        followUp: "I get it. Information feels like control. But this is how you stay stuck - consuming secondhand details of a life that's no longer yours. Your friend isn't your intelligence operative. What if you set boundaries around these updates?",
        xpReward: 5,
        byteReward: 10
      },
      {
        id: "spiral",
        text: "Of course they look good. They're fine without me.",
        emotion: "vulnerable",
        followUp: "Your brain is creating a story from one data point. 'Looking good' at a coffee shop doesn't mean they're thriving - it means they went to a coffee shop. You're comparing your inside experience to their outside appearance. That's not a fair fight.",
        xpReward: 10,
        byteReward: 20
      },
      {
        id: "competitive",
        text: "Good for them. I'm doing better anyway.",
        emotion: "angry",
        followUp: "The competitive healing approach - I see you. But making recovery a contest keeps you energetically tied to them. True healing isn't about winning or losing. It's about building a life so fulfilling that their updates become irrelevant background noise.",
        xpReward: 12,
        byteReward: 25
      },
      {
        id: "boundary",
        text: "Actually, I don't need updates about them.",
        emotion: "growth",
        followUp: "BOUNDARY BOSS. You just protected your peace in real-time. Most people can't tell the difference between caring and curiosity. You can - and you're choosing your healing over information that doesn't serve you. This is advanced-level self-care.",
        xpReward: 25,
        byteReward: 50
      }
    ]
  }
];

interface WeeklyTherapySessionProps {
  userXP: number;
  userWeek: number;
  userTier: 'free' | 'firewall' | 'cult-leader';
  lastSessionDate?: Date;
  onComplete: (xp: number, bytes: number) => void;
  onPurchaseSession?: () => void;
  onXPUnlock?: (cost: number) => void;
  // New props for enhanced UX
  onAchievementUnlock?: (achievement: { id: string; title: string; type: 'rare' | 'milestone' | 'standard' }) => void;
  dailyXPGained?: number;
  weeklyXPTarget?: number;
  emotionalToneDial?: 'numb' | 'vengeance' | 'logic' | 'help-others';
}

export default function WeeklyTherapySession({ 
  userXP, 
  userWeek, 
  userTier, 
  lastSessionDate, 
  onComplete, 
  onPurchaseSession, 
  onXPUnlock,
  onAchievementUnlock,
  dailyXPGained = 0,
  weeklyXPTarget = 500,
  emotionalToneDial = 'numb'
}: WeeklyTherapySessionProps) {
  const [currentScenario, setCurrentScenario] = useState<TherapyScenario | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<TherapyChoice | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { error, isLoading, handleAsyncOperation, clearError } = useErrorHandling();

  const availableScenario = THERAPY_SCENARIOS.find(s => s.week === userWeek) || THERAPY_SCENARIOS[0];

  // Calculate session availability
  const getSessionAvailability = () => {
    if (!lastSessionDate) return { canAccess: true, reason: 'first-session' };
    
    const now = new Date();
    const daysSinceLastSession = Math.floor((now.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const requiredDays = userTier === 'free' ? 30 : 14; // Monthly for free, bi-weekly for paid
    
    if (daysSinceLastSession >= requiredDays) {
      return { canAccess: true, reason: 'cooldown-complete' };
    }
    
    const daysRemaining = requiredDays - daysSinceLastSession;
    return { 
      canAccess: false, 
      reason: 'cooldown-active',
      daysRemaining,
      requiredDays
    };
  };

  const sessionAvailability = getSessionAvailability();
  const xpUnlockCost = userTier === 'free' ? 200 : 150; // Higher cost for free users
  const canUnlockWithXP = userXP >= xpUnlockCost;

  const startSession = () => {
    if (!sessionAvailability.canAccess) return;
    setCurrentScenario(availableScenario);
    setIsSessionStarted(true);
  };

  const handleXPUnlock = () => {
    if (onXPUnlock && canUnlockWithXP) {
      handleAsyncOperation(async () => {
        if (onXPUnlock) {
          onXPUnlock(xpUnlockCost);
          setCurrentScenario(availableScenario);
          setIsSessionStarted(true);
        }
      }, 'Failed to unlock session with XP');
    }
  };

  const handlePurchaseSession = () => {
    if (onPurchaseSession) {
      handleAsyncOperation(async () => {
        if (onPurchaseSession) {
          onPurchaseSession();
        }
      }, 'Failed to purchase emergency session');
    }
  };

  // Enhanced XP progress calculation
  const getXPProgressData = () => {
    const dailyProgress = Math.min((dailyXPGained / 50) * 100, 100); // Assume 50 XP daily target
    const weeklyProgress = Math.min((userXP / weeklyXPTarget) * 100, 100);
    const nextMilestone = Math.ceil(userXP / 100) * 100; // Next 100 XP milestone
    
    return {
      dailyProgress,
      weeklyProgress,
      nextMilestone,
      xpToNextMilestone: nextMilestone - userXP
    };
  };

  const xpData = getXPProgressData();

  // AI Personality customization based on emotional tone
  const getAIPersonality = () => {
    switch (emotionalToneDial) {
      case 'vengeance':
        return {
          name: 'Spicy Revenge Bot',
          color: 'text-red-400',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-500/50',
          responseStyle: 'bold and intense'
        };
      case 'logic':
        return {
          name: 'Logic Protocol',
          color: 'text-blue-400',
          bgColor: 'bg-blue-900/20',
          borderColor: 'border-blue-500/50',
          responseStyle: 'analytical and precise'
        };
      case 'help-others':
        return {
          name: 'Wise Therapist',
          color: 'text-green-400',
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-500/50',
          responseStyle: 'compassionate and guiding'
        };
      default: // numb
        return {
          name: 'Protocol Ghost',
          color: 'text-purple-400',
          bgColor: 'bg-purple-900/20',
          borderColor: 'border-purple-500/50',
          responseStyle: 'gentle and understanding'
        };
    }
  };

  const aiPersonality = getAIPersonality();

  // Achievement celebration trigger
  const triggerAchievementCelebration = (xpGained: number) => {
    const achievements = [];
    const nextMilestone = Math.ceil(userXP / 100) * 100;
    
    // Check for milestones
    if ((userXP + xpGained) >= nextMilestone && userXP < nextMilestone) {
      achievements.push({
        id: `xp-milestone-${nextMilestone}`,
        title: `${nextMilestone} XP Milestone Reached!`,
        type: 'milestone' as const
      });
    }
    
    // Check for session completion achievements
    if (userWeek === 1 && !isSessionStarted) {
      achievements.push({
        id: 'first-therapy-session',
        title: 'First Therapy Session Complete',
        type: 'standard' as const
      });
    }
    
    // Trigger celebrations
    achievements.forEach(achievement => {
      if (onAchievementUnlock) {
        onAchievementUnlock(achievement);
      }
    });
    
    if (achievements.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // Session locked - show unlock options
  if (!sessionAvailability.canAccess && !isSessionStarted) {
    return (
      <Card className="bg-gradient-to-br from-red-900/20 via-orange-900/30 to-yellow-900/20 border-2 border-orange-500/50 backdrop-blur-sm">
        {/* Error Display */}
        {error && <ErrorDisplay error={error} onDismiss={clearError} />}
        
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            🔒 SESSION LOCKED
          </CardTitle>
          <p className="text-orange-400 text-lg font-medium">
            {sessionAvailability.reason === 'cooldown-active' 
              ? `Next session in ${sessionAvailability.daysRemaining} days`
              : 'Therapy session on cooldown'
            }
          </p>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 mx-auto">
            {userTier === 'free' ? 'Monthly Sessions' : 'Bi-weekly Sessions'} - {userTier.toUpperCase()} Tier
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-white text-lg mb-4 leading-relaxed">
              Deep therapy sessions need time to integrate. But if you're in crisis or need extra support...
            </p>
          </div>

          {/* Enhanced XP Progress Display */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-4 mb-6">
            <h4 className="text-purple-400 font-bold mb-3 text-center">📊 Your Progress Today</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">Daily XP</span>
                  <span className="text-purple-400 font-bold">+{dailyXPGained}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${xpData.dailyProgress}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">To Next Milestone</span>
                  <span className="text-yellow-400 font-bold">{xpData.xpToNextMilestone} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${100 - (xpData.xpToNextMilestone / 100) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency unlock options */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Enhanced XP Unlock */}
            <div className="bg-purple-900/20 border-2 border-purple-500/50 rounded-xl p-6 relative overflow-hidden">
              {/* Glitch effect for cult leaders */}
              {userTier === 'cult-leader' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
              )}
              
              <div className="text-center mb-4 relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <Trophy className="h-12 w-12 text-purple-400 mr-2" />
                  {userTier === 'cult-leader' && <Crown className="h-6 w-6 text-yellow-400" />}
                </div>
                <h3 className="text-xl font-black text-purple-400" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  UNLOCK WITH XP
                </h3>
                <p className="text-white text-sm mt-2">Use your emotional growth points</p>
                {userTier === 'cult-leader' && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 mt-2">
                    CULT LEADER PRIORITY
                  </Badge>
                )}
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Cost:</span>
                  <span className="text-purple-400 font-bold">{xpUnlockCost} XP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Your XP:</span>
                  <span className={`font-bold ${userXP >= xpUnlockCost ? 'text-green-400' : 'text-red-400'}`}>
                    {userXP} XP
                  </span>
                </div>
                
                {/* XP Progress Ring */}
                <div className="flex justify-center my-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgb(75 85 99)"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgb(168 85 247)"
                        strokeWidth="2"
                        strokeDasharray={`${(userXP / xpUnlockCost) * 100}, 100`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-400">
                        {Math.round((userXP / xpUnlockCost) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleXPUnlock}
                  disabled={!canUnlockWithXP || isLoading}
                  className={`w-full mt-4 font-black ${
                    canUnlockWithXP 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" />
                  ) : canUnlockWithXP ? (
                    '🚀 UNLOCK NOW'
                  ) : (
                    '❌ NOT ENOUGH XP'
                  )}
                </Button>
                
                {!canUnlockWithXP && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Complete more rituals to earn XP
                  </p>
                )}
              </div>
            </div>

            {/* Cash Unlock */}
            <div className="bg-green-900/20 border-2 border-green-500/50 rounded-xl p-6">
              <div className="text-center mb-4">
                <Zap className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-black text-green-400" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  EMERGENCY SESSION
                </h3>
                <p className="text-white text-sm mt-2">Instant access, any time</p>
              </div>
              
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400 mb-2">$5.00</div>
                  <p className="text-gray-300 text-sm">One-time emergency unlock</p>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-xs font-medium text-center">
                    ✨ Perfect for crisis moments or when you need extra support
                  </p>
                </div>
                
                <Button
                  onClick={handlePurchaseSession}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black"
                >
                  💳 PURCHASE SESSION
                </Button>
              </div>
            </div>
          </div>

          {/* Tier upgrade suggestion */}
          <div className="bg-gray-800/50 border border-blue-500/30 rounded-xl p-4">
            <div className="text-center">
              <h4 className="text-blue-400 font-bold mb-2">💡 Want More Sessions?</h4>
              <p className="text-gray-300 text-sm mb-3">
                {userTier === 'free' 
                  ? 'Upgrade to Firewall Mode for bi-weekly sessions + unlimited Protocol Ghost'
                  : 'Cult Leader tier gets priority access + bonus XP for faster unlocks'
                }
              </p>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                {userTier === 'free' ? '⬆️ UPGRADE TO FIREWALL' : '👑 JOIN CULT LEADERS'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleChoiceSelect = (choice: TherapyChoice) => {
    setSelectedChoice(choice);
    setShowResult(true);
  };

  const completeSession = () => {
    if (selectedChoice) {
      triggerAchievementCelebration(selectedChoice.xpReward);
      onComplete(selectedChoice.xpReward, selectedChoice.byteReward);
    }
    resetSession();
  };

  const resetSession = () => {
    setCurrentScenario(null);
    setSelectedChoice(null);
    setShowResult(false);
    setIsSessionStarted(false);
  };

  if (!isSessionStarted) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/30 to-red-900/20 border-2 border-purple-500/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            🎮 AI THERAPY SESSION
          </CardTitle>
          <p className="text-purple-400 text-lg font-medium">
            Choose-your-path healing session
          </p>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              Week {userWeek}: {availableScenario.title}
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
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-white text-lg mb-4 leading-relaxed">
              Black Mirror meets therapy. Navigate emotional scenarios, get XP for growth choices.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/30 mb-4">
              <p className="text-fuchsia-400 text-sm font-medium">
                ⚡ Session frequency: {userTier === 'free' ? 'Monthly' : 'Bi-weekly'}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Emergency sessions available via XP ({xpUnlockCost} XP) or $5
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={startSession}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-black text-lg px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Session <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Session info */}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/30 rounded-lg p-3 border border-green-500/30">
              <h4 className="text-green-400 font-bold mb-1">✅ This Session</h4>
              <p className="text-gray-300">Free access available</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 border border-orange-500/30">
              <h4 className="text-orange-400 font-bold mb-1">⏰ Next Session</h4>
              <p className="text-gray-300">
                {userTier === 'free' ? '30 days' : '14 days'} from completion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResult && selectedChoice && currentScenario) {
    return (
      <Card className={`bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-pink-900/20 border-2 ${aiPersonality.borderColor} backdrop-blur-sm relative overflow-hidden`}>
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 animate-pulse" />
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {error && <ErrorDisplay error={error} onDismiss={clearError} />}
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                {aiPersonality.name} Response
              </CardTitle>
              {selectedChoice.emotion === 'growth' && (
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${
                selectedChoice.emotion === 'growth' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                selectedChoice.emotion === 'angry' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                selectedChoice.emotion === 'vulnerable' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
              }`}>
                {selectedChoice.emotion.toUpperCase()}
              </Badge>
              {userTier === 'cult-leader' && (
                <Crown className="h-5 w-5 text-yellow-400" />
              )}
            </div>
          </div>
          <p className={`text-sm ${aiPersonality.color}`}>
            Response style: {aiPersonality.responseStyle}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className={`${aiPersonality.bgColor} rounded-xl p-6 border ${aiPersonality.borderColor}`}>
            <p className={`text-white text-lg leading-relaxed font-medium ${
              emotionalToneDial === 'vengeance' ? 'font-bold' : 
              emotionalToneDial === 'logic' ? 'font-normal' :
              'font-medium'
            }`}>
              {selectedChoice.followUp}
            </p>
          </div>
          
          {/* Enhanced Reward Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center bg-green-500/10 border border-green-500/30 rounded-lg p-4 relative overflow-hidden">
              {selectedChoice.xpReward >= 20 && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-yellow-400/10 animate-pulse" />
              )}
              <Trophy className="h-6 w-6 text-green-400 mr-2 relative z-10" />
              <div className="relative z-10">
                <p className="text-green-400 font-bold text-lg">+{selectedChoice.xpReward} XP</p>
                <p className="text-green-400/70 text-sm">Emotional Growth</p>
                {selectedChoice.xpReward >= 20 && (
                  <p className="text-yellow-400 text-xs font-bold">HIGH VALUE!</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 relative overflow-hidden">
              {selectedChoice.byteReward >= 40 && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-pulse" />
              )}
              <Zap className="h-6 w-6 text-blue-400 mr-2 relative z-10" />
              <div className="relative z-10">
                <p className="text-blue-400 font-bold text-lg">+{selectedChoice.byteReward} Bytes</p>
                <p className="text-blue-400/70 text-sm">Healing Currency</p>
                {selectedChoice.byteReward >= 40 && (
                  <p className="text-purple-400 text-xs font-bold">BONUS EARNED!</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress toward next milestone */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">Progress to next milestone:</span>
              <span className="text-purple-400 font-bold text-sm">
                {Math.max(0, xpData.xpToNextMilestone - selectedChoice.xpReward)} XP remaining
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.min(100, ((userXP + selectedChoice.xpReward) / xpData.nextMilestone) * 100)}%` 
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={resetSession}
              variant="outline"
              className="border-gray-500 text-gray-400 hover:bg-gray-800"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Different Path
            </Button>
            <Button
              onClick={completeSession}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-bold px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>Complete Session <ChevronRight className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentScenario) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-pink-900/20 border-2 border-purple-500/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Week {currentScenario.week}: {currentScenario.title}
            </CardTitle>
            <div className="flex items-center text-purple-400">
              <Timer className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">~5 min</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
            <p className="text-white text-lg mb-4 leading-relaxed">
              {currentScenario.scenario}
            </p>
            <p className="text-fuchsia-400 font-medium">
              {currentScenario.context}
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-white font-bold text-lg mb-4">Choose your response:</p>
            {currentScenario.choices.map((choice, index) => (
              <Button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice)}
                variant="outline"
                className="w-full text-left p-4 h-auto border-gray-600 hover:border-purple-400 hover:bg-purple-900/20 transition-all duration-300 group"
              >
                <div className="flex items-start">
                  <span className="text-purple-400 font-bold mr-3 mt-1 text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <div>
                    <p className="text-white font-medium leading-relaxed group-hover:text-purple-200">
                      {choice.text}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge className={`text-xs ${
                        choice.emotion === 'growth' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                        choice.emotion === 'angry' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                        choice.emotion === 'vulnerable' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      }`}>
                        {choice.emotion}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        +{choice.xpReward} XP | +{choice.byteReward} Bytes
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              💡 Higher XP rewards for growth-oriented choices
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
