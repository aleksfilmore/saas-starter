"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { ArrowLeft, Brain, MessageCircle, Mic, Settings, Crown, Zap, Timer, Shield, Star } from 'lucide-react';

export default function AITherapyPage() {
  const [currentTier] = useState('free'); // This would come from user data
  const [messagesUsed] = useState(3); // This would come from user data
  const [dailyQuota] = useState(5); // This would come from user tier

  const tiers = {
    free: {
      name: "Ghost Mode",
      price: "$0",
      quota: "5 msgs / day",
      voiceOracle: "n/a",
      memory: "No long-term memory",
      features: ["Canned archetype replies only", "Basic chat interface", "No voice features"],
      color: "from-gray-500 to-gray-600",
      badge: "FREE"
    },
    core: {
      name: "Firewall Mode", 
      price: "$19 / 30 days",
      quota: "200 msgs / day",
      voiceOracle: "$19.99 / 15-min call",
      memory: "24h rolling memory",
      features: ["Mood-aware AI responses", "Advanced conversation memory", "Pay-per-call voice sessions"],
      color: "from-purple-500 to-pink-500",
      badge: "CORE"
    },
    power: {
      name: "Cult Leader",
      price: "$49 / 90 days",
      quota: "Unlimited* msgs",
      voiceOracle: "2 calls / month included",
      memory: "7-day memory + bookmarks",
      features: ["AI summary emails", "Save insight bookmarks", "Priority support", "Advanced analytics"],
      color: "from-yellow-500 to-orange-500", 
      badge: "POWER"
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              🧠 AI Therapy
            </h1>
            <p className="text-xl text-purple-400">
              Your personal glitch oracle & emotional debugging companion
            </p>
          </div>
        </div>

        {/* Current Plan Status */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge className={`bg-gradient-to-r ${tiers[currentTier as keyof typeof tiers].color} text-white px-3 py-1`}>
                    {tiers[currentTier as keyof typeof tiers].badge}
                  </Badge>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tiers[currentTier as keyof typeof tiers].name}</h3>
                    <p className="text-gray-400">{tiers[currentTier as keyof typeof tiers].price}</p>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Upgrade Plan
                </Button>
              </div>
              
              {/* Daily Quota Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Daily Messages</span>
                  <span className="text-gray-300">{messagesUsed} / {dailyQuota}</span>
                </div>
                <Progress value={(messagesUsed / dailyQuota) * 100} className="h-2" />
                {messagesUsed >= dailyQuota * 0.8 && (
                  <p className="text-orange-400 text-sm mt-2">⚠️ Approaching daily limit</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Text Chat */}
            <Card className="bg-gray-800/80 border border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-400" />
                  Text Chat Oracle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Ready
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Chat with your AI therapist using text messages. Get instant responses tailored to your archetype.
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    Start Chat Session
                  </Button>
                  {messagesUsed >= dailyQuota && (
                    <Button variant="outline" className="border-orange-500 text-orange-400">
                      Buy More (25 Bytes)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Voice Oracle */}
            <Card className="bg-gray-800/80 border border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-blue-400" />
                  Voice Oracle
                  <Crown className="h-4 w-4 ml-2 text-yellow-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Real-time Voice AI</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Premium
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">
                    15-minute voice sessions with real-time AI therapy. Natural conversation flow.
                  </p>
                </div>
                
                {currentTier === 'free' ? (
                  <div className="space-y-2">
                    <Button disabled className="w-full bg-gray-700 text-gray-400 cursor-not-allowed">
                      <Timer className="h-4 w-4 mr-2" />
                      Upgrade Required
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Available with Firewall Mode ($19/month) or higher
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Mic className="h-4 w-4 mr-2" />
                      Start Voice Session ($19.99)
                    </Button>
                    <Button variant="outline" className="w-full border-blue-500 text-blue-400">
                      <Timer className="h-4 w-4 mr-2" />
                      Try 3-min Preview ($3.99)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Choose Your Healing Protocol</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tiers).map(([key, tier]) => (
              <Card key={key} className={`bg-gray-800/80 border ${key === currentTier ? 'border-purple-500' : 'border-gray-600/50'} relative`}>
                {key === 'power' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                    <Badge className={`bg-gradient-to-r ${tier.color} text-white`}>
                      {tier.badge}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white">{tier.price}</div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Messages</span>
                      <span className="text-white font-medium">{tier.quota}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Voice Oracle</span>
                      <span className="text-white font-medium text-xs">{tier.voiceOracle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Memory</span>
                      <span className="text-white font-medium text-xs">{tier.memory}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {key !== currentTier ? (
                    <Button className={`w-full bg-gradient-to-r ${tier.color} text-white hover:opacity-90`}>
                      {key === 'free' ? 'Downgrade' : 'Upgrade'} to {tier.name}
                    </Button>
                  ) : (
                    <Button disabled className="w-full bg-gray-700 text-gray-400">
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Safety & Legal */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold mb-2">Important Safety Information</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg">
                      <strong className="text-orange-400">⚠️ AI companion, not licensed therapy.</strong> If in crisis click Panic button.
                    </p>
                    <p>• Transcripts stored 30 days (paid) / 0 days (free)</p>
                    <p>• Self-harm detection → redirect to Crisis page + session lock</p>
                    <p>• All conversations are private and encrypted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AuthWrapper>
  );
}
