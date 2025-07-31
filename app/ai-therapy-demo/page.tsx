"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyTherapySession from '@/components/ai-therapy/WeeklyTherapySession';
import ProtocolGhostChat from '@/components/ai-therapy/ProtocolGhostChat';
import { Trophy, Zap, Crown, Calendar, MessageCircle, TrendingUp } from 'lucide-react';

export default function AITherapyDemo() {
  const [userStats, setUserStats] = useState({
    xp: 145,
    bytes: 320,
    week: 2,
    tier: 'firewall' as 'free' | 'firewall' | 'cult-leader',
    dailyChatUsed: false,
    lastSessionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  });

  const handleTherapyComplete = (xp: number, bytes: number) => {
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + xp,
      bytes: prev.bytes + bytes,
      lastSessionDate: new Date()
    }));
  };

  const handleXPUnlock = (cost: number) => {
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp - cost,
      lastSessionDate: new Date() // Reset cooldown
    }));
  };

  const handlePurchaseSession = () => {
    // In real app, this would trigger Stripe payment
    console.log('Purchasing emergency session for $5');
    setUserStats(prev => ({
      ...prev,
      lastSessionDate: new Date() // Reset cooldown after purchase
    }));
  };

  const handleChatUsed = () => {
    setUserStats(prev => ({
      ...prev,
      dailyChatUsed: true
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
            🎮 AI THERAPY FEATURES DEMO
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Experience the unique healing mechanics that make CTRL+ALT+BLOCK™ different
          </p>
          
          {/* User Stats */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30">
              <Trophy className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">{userStats.xp}</p>
              <p className="text-xs text-gray-400">XP</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/30">
              <Zap className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">{userStats.bytes}</p>
              <p className="text-xs text-gray-400">Bytes</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/30">
              <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">Week {userStats.week}</p>
              <p className="text-xs text-gray-400">Progress</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/30">
              <Crown className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-orange-400 capitalize">{userStats.tier}</p>
              <p className="text-xs text-gray-400">Tier</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="therapy" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 p-1 rounded-xl">
            <TabsTrigger 
              value="therapy" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 data-[state=active]:border-purple-500/50"
            >
              🎮 Weekly AI Therapy
            </TabsTrigger>
            <TabsTrigger 
              value="ghost" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500/50"
            >
              👻 Protocol Ghost Chat
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/50"
            >
              📊 Feature Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="therapy" className="space-y-6">
            <Card className="bg-gray-900/30 border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-purple-400 flex items-center">
                  🎮 Choose-Your-Path Therapy Sessions
                  <Badge className="ml-3 bg-purple-500/20 text-purple-400">Interactive</Badge>
                </CardTitle>
                <p className="text-gray-400">
                  Black Mirror meets therapy. Navigate real emotional scenarios, make choices, get personalized AI guidance and XP rewards.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/30">
                      <h4 className="font-bold text-white mb-2">📝 How It Works</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Monthly therapy sessions (not weekly)</li>
                        <li>• 4 different response paths per scenario</li>
                        <li>• Emergency unlock: 200 XP or $5</li>
                        <li>• XP rewards scale with emotional growth choices</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30">
                      <h4 className="font-bold text-white mb-2">🎯 Example Scenarios</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• "You almost texted them at 2 AM..."</li>
                        <li>• "Your friend mentions seeing your ex..."</li>
                        <li>• "You drafted the perfect closure message..."</li>
                        <li>• "They viewed your story but didn't reply..."</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <WeeklyTherapySession 
                  userXP={userStats.xp}
                  userWeek={userStats.week}
                  userTier={userStats.tier}
                  lastSessionDate={userStats.lastSessionDate}
                  onComplete={handleTherapyComplete}
                  onXPUnlock={handleXPUnlock}
                  onPurchaseSession={handlePurchaseSession}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ghost" className="space-y-6">
            <Card className="bg-gray-900/30 border border-green-500/30">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-green-400 flex items-center">
                  👻 Protocol Ghost - Always-On AI Confidant
                  <Badge className="ml-3 bg-green-500/20 text-green-400">24/7 Available</Badge>
                </CardTitle>
                <p className="text-gray-400">
                  Your AI emotional support system. Floating chat bubble with personality options, memory, and tier-based features.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                      <h4 className="font-bold text-blue-400 mb-2 flex items-center">
                        FREE TIER
                        <Badge className="ml-2 bg-blue-500/20 text-blue-400 text-xs">Basic</Badge>
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• 1 short chat per day</li>
                        <li>• 300-500 token limit</li>
                        <li>• No conversation memory</li>
                        <li>• Basic supportive responses</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
                      <h4 className="font-bold text-orange-400 mb-2 flex items-center">
                        FIREWALL MODE
                        <Badge className="ml-2 bg-orange-500/20 text-orange-400 text-xs">$9/mo</Badge>
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Unlimited chat sessions</li>
                        <li>• Full conversation memory</li>
                        <li>• Emotional tone tracking</li>
                        <li>• Context-aware responses</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                      <h4 className="font-bold text-purple-400 mb-2 flex items-center">
                        CULT LEADER
                        <Badge className="ml-2 bg-purple-500/20 text-purple-400 text-xs">$19.90/3mo</Badge>
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Multiple AI personalities</li>
                        <li>• "Chaotic Bestie Mode"</li>
                        <li>• "Spicy Revenge Bot"</li>
                        <li>• "Inner Parent" support</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold text-white mb-3">🎭 Personality Examples (Cult Leader Tier)</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3">
                      <p className="text-pink-400 font-medium text-sm">💅 Chaotic Bestie:</p>
                      <p className="text-gray-300 text-sm italic">"Bestie, you're giving them way too much real estate in your head. They're not paying rent up there."</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-400 font-medium text-sm">🤗 Inner Parent:</p>
                      <p className="text-gray-300 text-sm italic">"You're not broken, baby. You're breaking open. Let me hold space for this transformation."</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400 font-medium text-sm">🌶️ Spicy Revenge Bot:</p>
                      <p className="text-gray-300 text-sm italic">"Instead of texting them, text yourself a list of all the ways you're about to be unrecognizable in 6 months."</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-purple-400 font-medium text-sm">🧠 Wise Therapist:</p>
                      <p className="text-gray-300 text-sm italic">"This heartbreak is your hero's journey. You're collecting power right now."</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30">
                  <p className="text-green-400 font-medium mb-2">👻 Try the chat bubble!</p>
                  <p className="text-gray-300 text-sm">
                    Look for the floating green bubble in the bottom-right corner. Click to start a conversation with Protocol Ghost.
                    The demo is set to "{userStats.tier}" tier with {userStats.tier === 'free' && userStats.dailyChatUsed ? 'daily limit reached' : 'chat available'}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="bg-gray-900/30 border border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-blue-400">
                  📊 Complete Feature Comparison
                </CardTitle>
                <p className="text-gray-400">
                  How these AI therapy features stack up across membership tiers
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-white font-bold">Feature</th>
                        <th className="text-center p-4 text-blue-400 font-bold">FREE</th>
                        <th className="text-center p-4 text-orange-400 font-bold">FIREWALL</th>
                        <th className="text-center p-4 text-purple-400 font-bold">CULT LEADER</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">AI Therapy Session Frequency</td>
                        <td className="p-4 text-center text-blue-400">Monthly</td>
                        <td className="p-4 text-center text-orange-400">Bi-weekly</td>
                        <td className="p-4 text-center text-purple-400">Bi-weekly + Priority</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">Emergency Session Unlock</td>
                        <td className="p-4 text-center text-blue-400">200 XP or $5</td>
                        <td className="p-4 text-center text-orange-400">150 XP or $5</td>
                        <td className="p-4 text-center text-purple-400">100 XP or $5</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">Choose-Your-Path Scenarios</td>
                        <td className="p-4 text-center text-green-400">✅ Basic</td>
                        <td className="p-4 text-center text-green-400">✅ All</td>
                        <td className="p-4 text-center text-green-400">✅ + Beta Access</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">XP & Byte Rewards</td>
                        <td className="p-4 text-center text-green-400">✅</td>
                        <td className="p-4 text-center text-green-400">✅</td>
                        <td className="p-4 text-center text-green-400">✅ + Bonus</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">Protocol Ghost Chat</td>
                        <td className="p-4 text-center text-blue-400">1 chat/day</td>
                        <td className="p-4 text-center text-green-400">Unlimited</td>
                        <td className="p-4 text-center text-green-400">Unlimited</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">Chat Memory & Context</td>
                        <td className="p-4 text-center text-red-400">❌</td>
                        <td className="p-4 text-center text-green-400">✅</td>
                        <td className="p-4 text-center text-green-400">✅</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">AI Personality Options</td>
                        <td className="p-4 text-center text-red-400">❌</td>
                        <td className="p-4 text-center text-red-400">❌</td>
                        <td className="p-4 text-center text-green-400">✅ 4 personalities</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">Emotional Tone Tracking</td>
                        <td className="p-4 text-center text-red-400">❌</td>
                        <td className="p-4 text-center text-green-400">✅</td>
                        <td className="p-4 text-center text-green-400">✅ Advanced</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 text-white font-medium">Session Export & Saving</td>
                        <td className="p-4 text-center text-red-400">❌</td>
                        <td className="p-4 text-center text-green-400">✅</td>
                        <td className="p-4 text-center text-green-400">✅ + Archives</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Try Free
                  </Button>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Upgrade to Firewall
                  </Button>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    Join Cult Leaders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Protocol Ghost Chat Component */}
        <ProtocolGhostChat />
      </div>
    </div>
  );
}
