"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Trophy, Zap, Heart, Timer, ArrowLeft } from 'lucide-react';

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
  onComplete: (xp: number, bytes: number) => void;
}

export default function WeeklyTherapySession({ userXP, userWeek, onComplete }: WeeklyTherapySessionProps) {
  const [currentScenario, setCurrentScenario] = useState<TherapyScenario | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<TherapyChoice | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const availableScenario = THERAPY_SCENARIOS.find(s => s.week === userWeek) || THERAPY_SCENARIOS[0];

  const startSession = () => {
    setCurrentScenario(availableScenario);
    setIsSessionStarted(true);
  };

  const handleChoiceSelect = (choice: TherapyChoice) => {
    setSelectedChoice(choice);
    setShowResult(true);
  };

  const completeSession = () => {
    if (selectedChoice) {
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
            🎮 WEEKLY AI THERAPY
          </CardTitle>
          <p className="text-purple-400 text-lg font-medium">
            Choose-your-path healing session
          </p>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 mx-auto">
            Week {userWeek}: {availableScenario.title}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-white text-lg mb-4 leading-relaxed">
              Black Mirror meets therapy. Navigate emotional scenarios, get XP for growth choices.
            </p>
            <p className="text-fuchsia-400 text-sm font-medium">
              ⚡ Each path leads to unique AI guidance and rewards
            </p>
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
        </CardContent>
      </Card>
    );
  }

  if (showResult && selectedChoice && currentScenario) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-pink-900/20 border-2 border-purple-500/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              AI Therapist Response
            </CardTitle>
            <Badge className={`${
              selectedChoice.emotion === 'growth' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
              selectedChoice.emotion === 'angry' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
              selectedChoice.emotion === 'vulnerable' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
            }`}>
              {selectedChoice.emotion.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
            <p className="text-white text-lg leading-relaxed font-medium">
              {selectedChoice.followUp}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <Trophy className="h-6 w-6 text-green-400 mr-2" />
              <div>
                <p className="text-green-400 font-bold text-lg">+{selectedChoice.xpReward} XP</p>
                <p className="text-green-400/70 text-sm">Emotional Growth</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <Zap className="h-6 w-6 text-blue-400 mr-2" />
              <div>
                <p className="text-blue-400 font-bold text-lg">+{selectedChoice.byteReward} Bytes</p>
                <p className="text-blue-400/70 text-sm">Healing Currency</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={resetSession}
              variant="outline"
              className="border-gray-500 text-gray-400 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Different Path
            </Button>
            <Button
              onClick={completeSession}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-bold px-8"
            >
              Complete Session <ChevronRight className="h-4 w-4 ml-2" />
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
