// REFORMAT PROTOCOL™ - Gaming Therapy/Glow Viral Platform Homepage
// Evolution from simple heartbreak tool to comprehensive healing ecosystem

"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Trophy, MessageCircle, Check, Zap, Target, Flame, TrendingUp, ChevronRight, AlertTriangle, Sparkles, Rocket, ShieldCheck, Lock, Heart, RefreshCw, Download, Users, Star, Mail, Send, Shield, HelpCircle, Bot, Database, Globe, Eye, Settings, Trash2, GamepadIcon, Crown, Award, Coins, Timer, Activity } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';

// Animated background orbs
const Orb = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute rounded-full bg-gradient-to-t from-glitch-pink/30 to-primary/30 blur-3xl filter animate-float ${className}`}
    style={style}
  />
);

const Glow = ({ className }: { className?: string }) => (
  <div
    className={`absolute animate-pulse rounded-full bg-gradient-to-r from-glitch-pink/40 to-primary/40 blur-3xl filter ${className}`}
  />
);

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-gray-950 text-foreground">
      {/* HERO SECTION - Gaming Therapy Platform */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-950">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/60 to-pink-900/40" />
        
        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Revolutionary messaging */}
            <div className="text-left">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-4">
                  <GamepadIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-sm font-semibold tracking-wide">GAMING • THERAPY • VIRAL GROWTH</span>
                </div>
                <p className="text-fuchsia-400 text-xl font-bold tracking-wide" style={{textShadow: '0 0 10px rgba(217,70,239,0.8)', fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  The World's First Gamified Heartbreak Recovery Ecosystem
                </p>
              </div>
              
              <h1 className="mb-8">
                <div className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <span className="text-white" style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.8)', 
                    WebkitTextStroke: '2px #ec4899',
                    filter: 'drop-shadow(0 0 10px rgba(236,72,153,0.5))'
                  }}>
                    REFORMAT
                  </span>
                </div>
                <div className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <span 
                    className="font-black text-glitch-pink"
                    style={{
                      textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.6), 0 4px 8px rgba(0,0,0,0.8)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '900'
                    }}
                  >
                    PROTOCOL™
                  </span>
                </div>
                <div className="text-lg lg:text-xl text-cyan-400 font-medium tracking-wider">
                  Level Up Your Healing • Earn XP for Recovery • Build Your Glow
                </div>
              </h1>
              
              <p className="text-lg lg:text-xl text-blue-300 leading-relaxed mb-8 max-w-xl font-medium" style={{textShadow: '0 0 10px rgba(59,130,246,0.6)', fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                Turn heartbreak into a <span className="text-pink-400 font-bold">viral transformation journey</span>. 
                RPG-style progression meets therapeutic healing. Anonymous community support. 
                <span className="text-cyan-400 font-bold"> AI-powered recovery rituals</span>.
              </p>

              {/* Key Stats - Gaming Style */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">15K+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Players Healing</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">2.1M</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">XP Earned</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400">94%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Glow Success</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="/sign-up" className="flex-1">
                  <Button 
                    size="lg" 
                    className="w-full text-lg font-black uppercase tracking-wider px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,20,147,0.4)] hover:shadow-[0_0_40px_rgba(255,20,147,0.6)] border-2 border-pink-500 hover:scale-105"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)', 
                      fontFamily: 'system-ui, -apple-system, sans-serif', 
                      fontWeight: '900'
                    }}
                  >
                    <GamepadIcon className="w-5 h-5 mr-2" />
                    START MY GLOW UP
                  </Button>
                </a>
                <a href="/reformat-demo" className="flex-1">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full text-lg font-bold px-8 py-4 rounded-xl border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    WATCH DEMO
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Right side - Hooded Figure with Gaming UI */}
            <div className="flex justify-center lg:justify-end relative">
              <div className="relative">
                {/* Gaming UI overlays around the figure */}
                <div className="absolute -top-8 -left-8 bg-gray-900/80 backdrop-blur-sm border border-yellow-500/50 rounded-lg px-3 py-2 z-20">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">LVL 15</span>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-12 bg-gray-900/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-3 py-2 z-20">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 font-bold text-sm">2,850 XP</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-6 bg-gray-900/80 backdrop-blur-sm border border-pink-500/50 rounded-lg px-3 py-2 z-20">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-pink-400" />
                    <span className="text-pink-400 font-bold text-sm">23 Day Streak</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 -right-8 bg-gray-900/80 backdrop-blur-sm border border-purple-500/50 rounded-lg px-3 py-2 z-20">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-bold text-sm">485 Bytes</span>
                  </div>
                </div>

                {/* Main Figure */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  <Glow className="w-full h-full -z-10" />
                  <img 
                    src="/figure.png" 
                    alt="Hooded Figure - Gaming Therapy Guide" 
                    className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(255,20,147,0.6)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
          </div>
        </div>
      </section>

      {/* GAMING MECHANICS SECTION */}
      <section className="py-24 relative bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Healing Reimagined as <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">Epic Gaming</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We turned therapeutic recovery into an addictive RPG experience. Earn XP for healthy choices, 
              unlock achievements for healing milestones, and build your character while building yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* XP & Leveling System */}
            <div className="group bg-gray-900/60 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-8 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105">
              <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">XP & Leveling System</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Complete daily rituals, maintain no-contact streaks, share on the Wall of Wounds. 
                Every healthy choice earns XP and advances your healing phase.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Daily Ritual: +50 XP</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Streak Milestone: +200 XP</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Wall Post: +25 XP</span>
                </div>
              </div>
            </div>

            {/* Byte Currency & AI Tools */}
            <div className="group bg-gray-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 hover:border-cyan-500/60 transition-all duration-300 hover:scale-105">
              <div className="bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Coins className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Byte Currency & AI</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Earn Bytes for progress, spend on AI tools. Closure Simulator, Letter Generator, 
                Reframe Assistant, and Tarot Reader help process your journey.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Closure Sim: 50 Bytes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Letter Gen: 25 Bytes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Reframe Tool: 30 Bytes</span>
                </div>
              </div>
            </div>

            {/* Community & Viral Growth */}
            <div className="group bg-gray-900/60 backdrop-blur-sm border border-pink-500/30 rounded-xl p-8 hover:border-pink-500/60 transition-all duration-300 hover:scale-105">
              <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Viral Community</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Anonymous Wall of Wounds, resonance reactions, Oracle posts. 
                Share your glow-up journey and inspire others. TikTok-style engagement.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Wall Posts: Anonymous</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Reactions: Resonate, Same Loop</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Oracle Status: Top Healers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THERAPEUTIC DEPTH SECTION */}
      <section className="py-24 relative bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-8" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Serious Therapy</span><br />
                Disguised as Gaming
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Behind the viral mechanics lies scientifically-grounded therapeutic frameworks. 
                Attachment theory assessments, distress evaluations, and personalized Heart State analysis 
                create a healing journey as effective as it is engaging.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Heart State Assessment</h4>
                    <p className="text-gray-400">Six phases from ACUTE_CRISIS to INTEGRATION, each with customized support protocols and interface adaptations.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Adaptive Interface</h4>
                    <p className="text-gray-400">Dashboard complexity automatically adjusts based on emotional state. Crisis mode simplifies everything to essential support.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-pink-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Progressive Disclosure</h4>
                    <p className="text-gray-400">Three-tier system (Focus/Overview/Detailed) lets users control complexity as they heal and grow stronger.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Sample Assessment Results</h3>
                
                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="font-bold text-red-400">ACUTE_CRISIS</span>
                    </div>
                    <p className="text-gray-300 text-sm">Immediate support mode. Simplified interface. Daily check-ins. Crisis protocols active.</p>
                  </div>
                  
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Timer className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-yellow-400">EARLY_PROCESSING</span>
                    </div>
                    <p className="text-gray-300 text-sm">Processing mode. Educational content. No-contact tools. Emotion regulation techniques.</p>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Rocket className="w-5 h-5 text-green-400" />
                      <span className="font-bold text-green-400">ACTIVE_HEALING</span>
                    </div>
                    <p className="text-gray-300 text-sm">Growth mode. Full features unlocked. Community engagement. Advanced AI tools available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIRAL FEATURES SHOWCASE */}
      <section className="py-24 bg-gradient-to-l from-pink-900/30 via-purple-900/40 to-cyan-900/30 backdrop-blur-sm w-full relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">Viral Growth</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every feature designed for shareability. Anonymous stories go viral. 
              Transformation journeys inspire millions. Healing becomes contagious.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Wall of Wounds</h3>
              <p className="text-gray-400 text-sm">Anonymous confessions, viral vulnerability, community healing</p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm border border-pink-500/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Resonance System</h3>
              <p className="text-gray-400 text-sm">TikTok-style reactions, same_loop validation, Oracle recognition</p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Glow Tracking</h3>
              <p className="text-gray-400 text-sm">Progress visualization, before/after energy, shareable milestones</p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Achievement Unlocks</h3>
              <p className="text-gray-400 text-sm">Badge collection, streak celebrations, viral transformation moments</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Join the Revolution */}
      <section className="py-32 text-center relative bg-gradient-to-br from-purple-900/60 via-pink-900/50 to-orange-900/40 backdrop-blur-sm overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">Glow Up</span> Starts Now
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto">
            Join thousands turning their worst heartbreak into their greatest comeback. 
            <span className="text-pink-400 font-bold"> Anonymous. Gamified. Therapeutic. Viral.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <a href="/sign-up" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-xl font-black uppercase tracking-wider px-12 py-6 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,20,147,0.6)] hover:shadow-[0_0_60px_rgba(255,20,147,0.8)] border-2 border-pink-500 hover:scale-110"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)', 
                  fontFamily: 'system-ui, -apple-system, sans-serif', 
                  fontWeight: '900'
                }}
              >
                <Sparkles className="w-6 h-6 mr-3" />
                BEGIN PROTOCOL™
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </a>
          </div>
          
          <p className="text-gray-400 text-lg">
            Free to start • Anonymous forever • Glow up guaranteed
          </p>
        </div>
      </section>
    </div>
  );
}
