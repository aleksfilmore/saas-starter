'use client';

import React, { useState } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DailyRitual } from '@/components/rituals/DailyRitual';
import Link from 'next/link';
import { 
  Shield, 
  Brain, 
  Calendar,
  Flame,
  Zap,
  ArrowRight,
  Crown,
  Target,
  Timer
} from 'lucide-react';

export default function GlowUpConsolePage() {
  const [ritualStreak, setRitualStreak] = useState(12);
  
  // Mock user data - replace with real data later
  const user = {
    noContactStreak: 23,
    codename: "DigitalPhoenix",
    avatar: "🔥",
    bytes: 342,
    level: 3,
    tier: "firewall" as const, // ghost, firewall, deep-reset
    nextTherapySession: "3 days",
    todaysProtocol: {
      title: "Delete One Photo",
      description: "Remove one digital trace that triggers you",
      completed: false
    }
  };

  const handleRitualComplete = (ritualId: string, proof?: string) => {
    // Update streak and user stats
    setRitualStreak(prev => prev + 1);
    
    // In real app, this would call an API to update user progress
    console.log('Ritual completed:', ritualId, proof);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        
        {/* Header: Identity & Status */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{user.avatar}</div>
            <div>
              <h1 className="text-3xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                {user.codename}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge className={`${
                  user.tier === 'free' ? 'bg-blue-500/20 text-blue-400' :
                  user.tier === 'firewall' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {user.tier === 'cult_leader' ? '👑 CULT LEADER' : 
                   user.tier === 'firewall' ? '🔥 FIREWALL MODE' : '⚡ FREE TIER'}
                </Badge>
                <span className="text-gray-400 text-sm">Level {user.level}</span>
              </div>
            </div>
          </div>
          
          {/* Floating Byte Counter */}
          <div className="bg-gray-900/80 border-2 border-purple-500/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              <span className="text-2xl font-black text-white">{user.bytes}</span>
              <span className="text-purple-400 font-bold">BYTES</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
            >
              Get More
            </Button>
          </div>
        </div>

        {/* DAILY RITUAL SECTION */}
        <div className="mb-8">
          <DailyRitual 
            userId={user.codename}
            userTier={user.tier}
            streak={ritualStreak}
            onRitualComplete={handleRitualComplete}
          />
        </div>

        {/* THE THREE CORE PILLARS */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* 🛡️ PILLAR 1: No Contact Tracker */}
          <Card className="bg-gradient-to-br from-red-900/40 to-orange-900/30 border-2 border-red-500/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-red-400" />
                  <div>
                    <CardTitle className="text-xl font-black text-white">No Contact Tracker</CardTitle>
                    <p className="text-red-300/70 text-sm">Your anti-relapse streak counter</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              
              {/* Massive Streak Display */}
              <div className="text-center py-6 bg-gray-950/50 rounded-xl border border-red-500/30">
                <div className="text-6xl font-black text-red-400 mb-2">
                  {user.noContactStreak}
                </div>
                <div className="text-red-300 font-bold text-lg">
                  DAYS CLEAN
                </div>
                <div className="text-red-200/60 text-sm mt-1">
                  {user.noContactStreak > 21 ? "🔥 FIREWALL STATUS" : 
                   user.noContactStreak > 7 ? "⚡ BUILDING MOMENTUM" : "🌱 EARLY RECOVERY"}
                </div>
              </div>

              <Link href="/dashboard/tracker">
                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold">
                  <Target className="h-4 w-4 mr-2" />
                  Update Streak
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 🧠 PILLAR 2: AI Therapy Sessions */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/30 border-2 border-purple-500/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-purple-400" />
                  <div>
                    <CardTitle className="text-xl font-black text-white">AI Therapy</CardTitle>
                    <p className="text-purple-300/70 text-sm">Choose-your-path breakup therapy</p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {user.tier === 'free' ? 'Monthly' : 'Bi-weekly'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              
              {/* Session Status */}
              <div className="bg-gray-950/50 rounded-xl border border-purple-500/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-400 font-bold text-sm">NEXT SESSION</span>
                  <Timer className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">
                  {user.nextTherapySession}
                </div>
                <div className="text-purple-300/60 text-sm">
                  Scenario-based healing journey
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/ai-therapy-demo">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold">
                    <Brain className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                  size="sm"
                >
                  Emergency Unlock: 100 Bytes or $5
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 📅 PILLAR 3: 30/90 Day Protocol */}
          <Card className="bg-gradient-to-br from-green-900/40 to-cyan-900/30 border-2 border-green-500/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/10"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-green-400" />
                  <div>
                    <CardTitle className="text-xl font-black text-white">Daily Protocol</CardTitle>
                    <p className="text-green-300/70 text-sm">Your structured heartbreak recovery OS</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400">
                  {user.tier === 'free' ? '30-Day' : '90-Day'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              
              {/* Today's Task */}
              <div className="bg-gray-950/50 rounded-xl border border-green-500/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-400 font-bold text-sm">TODAY'S RITUAL</span>
                  <div className={`w-3 h-3 rounded-full ${
                    user.todaysProtocol.completed ? 'bg-green-400' : 'bg-gray-600'
                  }`} />
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  "{user.todaysProtocol.title}"
                </div>
                <div className="text-green-300/60 text-sm">
                  {user.todaysProtocol.description}
                </div>
              </div>

              {/* Action Button */}
              <Link href="/dashboard/rituals">
                <Button className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold">
                  {user.todaysProtocol.completed ? (
                    <>✓ Completed - View Next</>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Complete Ritual
                    </>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gray-900/60 border-2 border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Quick Access</h3>
              <p className="text-gray-400 text-sm">One-click to your most-used tools</p>
            </div>
            <div className="flex gap-3">
              <Link href="/wall">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  💬 Wall of Wounds
                </Button>
              </Link>
              <Link href="/dashboard/security">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  🔒 Security
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              >
                🛍️ Byte Store
              </Button>
            </div>
          </div>
        </div>

        {/* Glitchy Affirmation */}
        <div className="text-center mt-8">
          <div className="text-glitch-pink font-black text-lg" style={{
            fontFamily: 'monospace',
            textShadow: '0 0 20px rgba(255,20,147,0.8)'
          }}>
            &gt; You're not healing wrong. The system is rigged. &lt;
          </div>
          <div className="text-gray-500 text-sm mt-1 font-mono">
            EMOTIONAL_HACKER_LEVEL_{user.level} • BUILD_2025.07.31
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
