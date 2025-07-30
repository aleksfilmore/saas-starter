// REFORMAT PROTOCOL™ - Gaming Therapy/Glow Viral Platform Homepage
// Evolution from simple heartbreak tool to comprehensive healing ecosystem

"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Trophy, MessageCircle, Check, Zap, Target, Flame, TrendingUp, ChevronRight, AlertTriangle, Sparkles, Rocket, ShieldCheck, Lock, Heart, RefreshCw, Download, Users, Star, Mail, Send, Shield, HelpCircle, Bot, Database, Globe, Eye, Settings, Trash2, Crown, Award, Coins, Timer, Activity } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';

// New: A component to create the animated, floating orbs for the background.
const Orb = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute rounded-full bg-gradient-to-t from-glitch-pink/30 to-primary/30 blur-3xl filter animate-float ${className}`}
    style={style}
  />
);

// New: A component to create a glowing effect behind elements.
const Glow = ({ className }: { className?: string }) => (
  <div
    className={`absolute animate-pulse rounded-full bg-gradient-to-r from-glitch-pink/40 to-primary/40 blur-3xl filter ${className}`}
  />
);

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-gray-950 text-foreground">
      {/* Hero Section with Integrated Features */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-950">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Text content */}
            <div className="text-left">
              <div className="mb-6">
                <p className="text-fuchsia-400 text-lg font-semibold tracking-wide" style={{textShadow: '0 0 10px rgba(217,70,239,0.8)', fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  The interactive breakup reprogramming ritual
                </p>
              </div>
              
              <h1 className="mb-6">
                <div className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <span className="text-white" style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.8)', 
                    WebkitTextStroke: '2px #ec4899',
                    filter: 'drop-shadow(0 0 10px rgba(236,72,153,0.5))'
                  }}>
                    CTRL+ALT
                  </span>
                </div>
                <div className="text-6xl lg:text-8xl font-black tracking-tighter leading-none" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <span 
                    className="font-black text-glitch-pink"
                    style={{
                      textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.6), 0 4px 8px rgba(0,0,0,0.8)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '900'
                    }}
                  >
                    BLOCK
                  </span>
                </div>
              </h1>
              
              <p className="text-lg lg:text-xl text-blue-400 leading-relaxed mb-12 max-w-lg font-medium" style={{textShadow: '0 0 10px rgba(59,130,246,0.6)', fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                Reclaim your sanity (and your savage) with<br />
                our AI-powered emotional recovery protocol.
              </p>
              
              <div className="mb-16">
                <a href="/sign-up">
                  <Button 
                    size="lg" 
                    className="text-lg font-black uppercase tracking-wider px-12 py-4 rounded-lg bg-glitch-pink hover:bg-glitch-pink/90 text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] border-2 border-glitch-pink hover:scale-105"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)', 
                      fontFamily: 'system-ui, -apple-system, sans-serif', 
                      fontWeight: '900'
                    }}
                  >
                    BEGIN THE RITUAL
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Right side - Figure with glow */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Figure container */}
                <div className="w-96 h-96 lg:w-[36rem] lg:h-[36rem] rounded-full flex items-center justify-center relative">
                  {/* The cloaked figure */}
                  <img
                    src="/figure.png"
                    alt="Cloaked figure"
                    className="w-80 h-80 lg:w-[32rem] lg:h-[32rem] object-contain relative z-10"
                    style={{
                      filter: 'brightness(0.7) contrast(1.1) saturate(1.2)'
                    }}
                  />
                  
                  {/* Broken heart positioned on chest area */}
                  <div className="absolute bottom-32 lg:bottom-48 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="relative">
                      {/* Heart pieces */}
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-glitch-pink transform rotate-45 rounded-tl-full rounded-tr-full shadow-[0_0_20px_rgba(236,72,153,0.8)]"></div>
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-glitch-pink transform rotate-45 rounded-tl-full rounded-tr-full shadow-[0_0_20px_rgba(236,72,153,0.8)]"></div>
                      </div>
                      {/* Crack line */}
                      <div className="absolute top-1/2 left-1/2 w-10 lg:w-14 h-0.5 bg-black transform -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
                      <div className="absolute top-1/2 left-1/2 w-10 lg:w-14 h-px bg-white/50 transform -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Integrated into Hero, positioned at bottom */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* AI TOOLS Card */}
            <div className="bg-gray-900/40 border-2 border-blue-400 rounded-lg p-6 text-left shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-400 rounded-lg flex items-center justify-center mr-6 shadow-lg">
                  <Brain className="h-10 w-10 text-gray-900 font-bold" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>AI TOOLS</h3>
                  <p className="text-white text-base font-medium leading-relaxed">
                    Digitally exorcise your ex.<br />
                    Write. Delete. Reboot. Simulated closure on demand.
                  </p>
                </div>
              </div>
            </div>
            
            {/* GAMIFIED HEALING Card */}
            <div className="bg-gray-900/40 border-2 border-glitch-pink rounded-lg p-6 text-left shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-glitch-pink rounded-lg flex items-center justify-center mr-6 shadow-lg">
                  <Trophy className="h-10 w-10 text-white font-bold" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>GAMIFIED HEALING</h3>
                  <p className="text-white text-base font-medium leading-relaxed">
                    Turn pain into points.<br />
                    Track your streaks. Win at not texting them.
                  </p>
                </div>
              </div>
            </div>
            
            {/* CONFESSIONAL Card */}
            <div className="bg-gray-900/40 border-2 border-purple-400 rounded-lg p-6 text-left shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-purple-400 rounded-lg flex items-center justify-center mr-6 shadow-lg">
                  <MessageCircle className="h-10 w-10 text-white font-bold" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>CONFESSIONAL</h3>
                  <p className="text-white text-base font-medium leading-relaxed">
                    Scream anonymously.<br />
                    Drop your heartbreak into the void. Get reactions.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* Concept & Benefits Section */}
      <section className="py-24 relative bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/20 overflow-hidden">
        {/* Smooth section transition */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-glitch-pink to-transparent opacity-60"></div>
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-950 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20 transform hover:scale-105 transition-transform duration-500">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '2px #ec4899'}}>
              Why CTRL+ALT+BLOCK™ <span className="text-blue-400" style={{textShadow: '0 0 20px rgba(59,130,246,0.8)'}}>Works</span>
            </h2>
            <p className="text-2xl lg:text-3xl text-fuchsia-400 max-w-4xl mx-auto leading-relaxed font-bold" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>
              Because breakups are bugs in your operating system.<br />
              <span className="text-blue-400">Time to debug that sh*t.</span>
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left - The Problem with modern visual design */}
            <div className="relative">
              {/* Glitch overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-gray-900/80 border border-red-400/30 rounded-3xl p-8 backdrop-blur-sm overflow-hidden">
                {/* Animated warning icon */}
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-2xl font-black text-red-400 tracking-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    SYSTEM ERROR DETECTED
                  </h3>
                </div>
                
                <p className="text-white text-xl font-bold mb-6 leading-relaxed" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  You're not just sad. You're <span className="text-red-400 animate-pulse">glitching</span>.
                </p>
                
                {/* Problem list with modern styling */}
                <div className="space-y-3">
                  {[
                    "Endless 'what if' loops",
                    "Refreshing their socials obsessively", 
                    "Writing unsent texts like scripture",
                    "Friends giving terrible advice",
                    "Therapy wait times = forever"
                  ].map((problem, index) => (
                    <div key={index} className="flex items-center text-white/90 text-lg font-medium">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-4 flex-shrink-0"></div>
                      <span style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>{problem}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-red-900/20 border border-red-400/30 rounded-xl">
                  <p className="text-red-400 font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    → You need a system reboot. <span className="text-white">Now.</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right - The Solution with modern visual design */}
            <div className="relative">
              {/* Success glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-gray-900/80 border border-blue-400/30 rounded-3xl p-8 backdrop-blur-sm overflow-hidden">
                {/* Animated success icon */}
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
                  </div>
                </div>
                
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-2xl font-black text-blue-400 tracking-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    SYSTEM UPGRADE AVAILABLE
                  </h3>
                </div>
                
                <p className="text-white text-xl font-bold mb-6 leading-relaxed" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  CTRL+ALT+BLOCK™ = your emotional OS update — <span className="text-blue-400">minus the BS</span>.
                </p>
                
                {/* Solution list with modern styling */}
                <div className="space-y-3">
                  {[
                    "AI-powered rituals (not spirals)",
                    "Break obsessive behavior loops", 
                    "Anonymous community support",
                    "Gamified healing system",
                    "Real-time progress tracking"
                  ].map((solution, index) => (
                    <div key={index} className="flex items-center text-white/90 text-lg font-medium">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-4 flex-shrink-0"></div>
                      <span style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>{solution}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-xl">
                  <p className="text-blue-400 font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    → Repattern your response to pain. <span className="text-white">On purpose.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Core Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Benefit 1 */}
            <div className="bg-gray-900/60 border-2 border-glitch-pink rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] transition-all duration-300 group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-glitch-pink rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-glitch-pink mb-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  LASER-FOCUSED HEALING
                </h3>
              </div>
              <div className="text-white text-lg leading-relaxed font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                <p>This isn't generic "love yourself" fluff.</p>
                <p>Every ritual, every tool, every prompt is built specifically for heartbreak.</p>
                <p className="text-glitch-pink font-bold">Zero spiritual bypassing. Zero bullshit.</p>
              </div>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-gray-900/60 border-2 border-blue-400 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-blue-400 mb-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  INSTANT RELIEF
                </h3>
              </div>
              <div className="text-white text-lg leading-relaxed font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                <p>You won't wait weeks for an appointment.</p>
                <p>You get catharsis on demand — closure simulator, letter tools, emotional firewalls.</p>
                <p className="text-blue-400 font-bold">Cry, write, release — in minutes, not months.</p>
              </div>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-gray-900/60 border-2 border-purple-400 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-purple-400 mb-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  ADDICTIVE PROGRESS
                </h3>
              </div>
              <div className="text-white text-lg leading-relaxed font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                <p>You're not just "healing." <span className="text-purple-400 font-bold">You're leveling up.</span></p>
                <p>Streaks. Rituals. Emotional XP.</p>
                <p className="text-purple-400 font-bold">You'll want to log in just to see how far you've come — and maybe flex on your ex's ghost.</p>
              </div>
            </div>
          </div>
          
          {/* Transformation Timeline */}
          <div className="bg-gradient-to-r from-gray-900/80 via-purple-900/50 to-pink-900/40 border-2 border-purple-500/50 rounded-3xl p-12 backdrop-blur-sm shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <h3 className="text-4xl font-black text-center text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '1px #ec4899'}}>
              Your <span className="text-glitch-pink">Glow-Up Timeline</span>
            </h3>
            <p className="text-center text-xl text-fuchsia-400 mb-12 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              WEEK → STAGE → WHAT'S HAPPENING
            </p>
            
            <div className="grid md:grid-cols-4 gap-8">
              {/* Week 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white">
                  1
                </div>
                <h4 className="text-xl font-black text-red-400 mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  WEEK 1: PURGE
                </h4>
                <p className="text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Release the emotional malware. No Contact streak begins. Screams (optional but encouraged).
                </p>
              </div>
              
              {/* Week 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white">
                  2
                </div>
                <h4 className="text-xl font-black text-orange-400 mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  WEEK 2: REBUILD
                </h4>
                <p className="text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  New routines. Emotional tools. Rituals that stick. You stop stalking their Instagram. Progress.
                </p>
              </div>
              
              {/* Week 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white">
                  3
                </div>
                <h4 className="text-xl font-black text-blue-400 mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  WEEK 3: LEVEL UP
                </h4>
                <p className="text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  You feel different. Your streak is strong. You're posting advice on the Wall. People are noticing.
                </p>
              </div>
              
              {/* Week 4+ */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white">
                  4+
                </div>
                <h4 className="text-xl font-black text-purple-400 mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  WEEK 4+: GLOW
                </h4>
                <p className="text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  You're unrecognizable. You radiate "unavailable to toxicity." You start glowing so hard it becomes suspicious.
                </p>
              </div>
            </div>
            
            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <p className="text-2xl font-black text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                This is the emotional OS upgrade you didn't know you needed.
              </p>
              <p className="text-lg text-fuchsia-400 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                Choose your plan. Start your ritual. Begin the reprogramming.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-24 relative bg-transparent">
        {/* Enhanced section transition */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-glitch-pink to-transparent opacity-60"></div>
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        
        {/* Floating background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/6 right-1/4 w-1 h-1 bg-glitch-cyan rounded-full animate-float opacity-50"></div>
          <div className="absolute bottom-1/4 left-1/6 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-500">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-4 relative tracking-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '2px #ec4899'}}>
              CTRL+ALT+BLOCK™ <span className="text-blue-400" style={{textShadow: '0 0 20px rgba(59,130,246,0.8)'}}>Pricing Plans</span>
              {/* Subtle underline effect */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-glitch-pink to-transparent"></div>
            </h2>
            <p className="text-2xl lg:text-3xl text-fuchsia-400 font-bold tracking-wide" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>
              Terminate. Format. Glow-up.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Modern Pricing Comparison Table */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-3xl border border-purple-500/30 p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <h4 className="text-xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    FEATURES
                  </h4>
                </div>
                <div className="text-center bg-blue-900/20 rounded-2xl p-4 border border-blue-400/30">
                  <div className="text-2xl font-black text-blue-400 mb-1" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    FREE
                  </div>
                  <div className="text-blue-400 text-sm font-medium">Dip your toe in</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-900/30 to-pink-900/30 rounded-2xl p-4 border-2 border-glitch-pink relative overflow-hidden">
                  <div className="absolute -top-2 -left-2 -right-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-1 rounded-t-xl">
                      <span className="text-xs font-black flex items-center justify-center">
                        <Flame className="w-3 h-3 mr-1" />
                        POPULAR
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-glitch-pink mb-1 mt-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    RITUAL MASTER
                  </div>
                  <div className="text-glitch-pink text-sm font-medium">$9/month</div>
                </div>
                <div className="text-center bg-purple-900/20 rounded-2xl p-4 border border-purple-400/30">
                  <div className="text-2xl font-black text-purple-400 mb-1" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    � CULT LEADER
                  </div>
                  <div className="text-purple-400 text-sm font-medium">$19.90/3mo</div>
                </div>
              </div>

              {/* Feature Comparison Rows */}
              <div className="space-y-3">
                {[
                  { feature: "No Contact Tracker", free: "Basic", ritual: "Full + Emotional Check-ins", cult: "Full + Relapse Recovery Kit" },
                  { feature: "AI Ritual Tools", free: "1 Tool", ritual: "All Tools + Closure Sim", cult: "All Tools + Beta Access" },
                  { feature: "Daily Rituals", free: "1/week", ritual: "Unlimited", cult: "Unlimited + Downloads" },
                  { feature: "Anonymous Wall", free: "Read + 1 post/week", ritual: "Post + Comment + React", cult: "Priority + Secret Threads" },
                  { feature: "Progress Saving", free: "✗", ritual: "✓ Full", cult: "✓ + Glow-up Level" },
                  { feature: "Email Updates", free: "Basic", ritual: "Full + Chaos", cult: "Elite + Perks" },
                  { feature: "Merch Discounts", free: "✗", ritual: "10% off", cult: "10% off + Free Ship" },
                  { feature: "Mini Cult Group", free: "✗", ritual: "✗", cult: "✓ 3 Warriors" }
                ].map((row, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors rounded-lg px-2">
                    <div className="text-white font-semibold text-left" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      {row.feature}
                    </div>
                    <div className="text-center text-blue-400 font-medium">
                      {row.free}
                    </div>
                    <div className="text-center text-glitch-pink font-medium">
                      {row.ritual}
                    </div>
                    <div className="text-center text-purple-400 font-medium">
                      {row.cult}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-4 mt-8">
                <div></div>
                <div className="text-center">
                  <a href="/sign-up" className="w-full block">
                    <button className="w-full py-3 px-6 border-2 border-blue-400 text-blue-400 rounded-xl font-black hover:bg-blue-400 hover:text-gray-900 transition-all duration-300" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                      START FREE
                    </button>
                  </a>
                </div>
                <div className="text-center">
                  <a href="/sign-up" className="w-full block">
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-black hover:scale-105 transition-all duration-300 shadow-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                      UPGRADE
                    </button>
                  </a>
                </div>
                <div className="text-center">
                  <a href="/sign-up" className="w-full block">
                    <button className="w-full py-3 px-6 border-2 border-purple-400 text-purple-400 rounded-xl font-black hover:bg-purple-400 hover:text-gray-900 transition-all duration-300" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                      LEAD CULT
                    </button>
                  </a>
                </div>
              </div>

              {/* Bottom testimonials */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-800/50">
                <div className="text-center">
                  <p className="text-fuchsia-400 italic font-medium text-sm" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    "I just need to scream into the void"
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-fuchsia-400 italic font-medium text-sm" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    "I'm here to reprogram my entire soul"
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-fuchsia-400 italic font-medium text-sm" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    "I'm starting a movement. Join or perish."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-l from-pink-900/30 via-purple-900/40 to-cyan-900/30 backdrop-blur-sm w-full relative overflow-hidden">
        {/* Enhanced section transition */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-glitch-pink to-transparent opacity-70"></div>
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-gray-950/50 to-transparent"></div>
        
        {/* Dynamic background effects */}
        <Orb className="top-20 left-20 opacity-15" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/5 left-1/5 w-3 h-3 bg-glitch-cyan rounded-full animate-float opacity-30"></div>
          <div className="absolute top-2/5 right-1/4 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-500">
            <h2 className="text-6xl lg:text-7xl font-black mb-6 tracking-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '2px #ec4899'}}>
              <span className="text-white">SYSTEM</span> <span className="text-blue-400" style={{textShadow: '0 0 20px rgba(59,130,246,0.8)'}}>QUERIES</span>
            </h2>
            <p className="text-xl lg:text-2xl text-fuchsia-400 max-w-2xl mx-auto leading-relaxed font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>Debugging the most common user <span className="text-blue-400 font-black">exceptions</span></p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-pink-900/20 backdrop-blur-sm rounded-2xl border-2 border-purple-500/50 p-8 shadow-2xl shadow-purple-500/30">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <HelpCircle className="w-5 h-5 mr-3 text-blue-400" />
                  Is this therapy?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p className="text-white font-bold">No.</p>
                  <p>This is emotional reprogramming — not licensed therapy.</p>
                  <p>We offer tools, rituals, and digital catharsis, but if you're in active distress, please contact a real human therapist, not our Closure Simulator. (Even if it's good.)</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Lock className="w-5 h-5 mr-3 text-blue-400" />
                  Is my data private?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p className="text-blue-400 font-bold">Yes. To the bone.</p>
                  <p>We don't sell trauma. Everything you enter is yours.</p>
                  <p>Confessionals are anonymized by default. Your rituals are private. No one knows you wrote a love letter to your ex and deleted it 4 seconds later.</p>
                  <p className="text-glitch-pink">[View full Privacy Protocol →]</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Heart className="w-5 h-5 mr-3 text-blue-400" />
                  What if I break my No Contact streak?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p className="text-fuchsia-400 font-bold">You're not cursed. You're human.</p>
                  <p>Use a Streak Shield if you slipped but got back up.</p>
                  <p>Or reset the counter and reclaim your power like a boss.</p>
                  <p className="text-glitch-pink font-bold">No shame. No punishment. Only reboots.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Bot className="w-5 h-5 mr-3 text-blue-400" />
                  What AI model are you using?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p>We use OpenAI's GPT-4o to power ritual guidance, letter generation, and emotional simulations. It's been trained on chaos and coded in heartbreak (not literally, but close enough).</p>
                  <p className="text-blue-400">P.S. It won't judge you for that text you almost sent. Promise.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Send className="w-5 h-5 mr-3 text-blue-400" />
                  I submitted something to the Anonymous Wall. Where did it go?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p>Your post is processed by our moderation algorithm (aka the emotional firewall) before it hits the Wall.</p>
                  <p>If it meets community guidelines, it appears shortly.</p>
                  <p className="text-glitch-pink">No hate, threats, or creepy stalker rants — only heartbreak, healing, and holy chaos allowed.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Users className="w-5 h-5 mr-3 text-blue-400" />
                  Can I use this while still living with my ex?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p className="text-blue-400">Technically, yes.</p>
                  <p className="text-fuchsia-400">Emotionally? That's a high-difficulty boss level.</p>
                  <p>We recommend activating Ritual Mode: Stealth Edition™ and using headphones. You don't need them overhearing your glow-up.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <RefreshCw className="w-5 h-5 mr-3 text-blue-400" />
                  Can I restart the 30-day ritual program?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p className="text-glitch-pink font-bold">Yes. Over and over and over again.</p>
                  <p>Each cycle hits differently, depending on the stage of your heartbreak (denial, rage, accidental DM, etc.).</p>
                  <p className="text-blue-400">There's no limit to how many times you rise from your own ashes.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="border-b border-purple-500/30">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Download className="w-5 h-5 mr-3 text-blue-400" />
                  Can I export my ritual notes or letters?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p className="text-fuchsia-400 font-bold">Yes. You can download, print, burn, or bury them.</p>
                  <p>Your healing, your format. Export options are available under your ritual log.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9" className="border-b-0">
                <AccordionTrigger className="text-xl font-black text-white hover:text-glitch-pink transition-colors tracking-tight flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <Star className="w-5 h-5 mr-3 text-blue-400" />
                  Can I really join for free?
                </AccordionTrigger>
                <AccordionContent className="text-white text-lg leading-relaxed pt-4 font-medium space-y-3" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  <p className="text-blue-400 font-bold">Yes. No tricks. No hidden heartbreak fees.</p>
                  <p>The Freemium Plan gives you access to basic rituals, the Wall, and tools to start crawling back to yourself.</p>
                  <p className="text-glitch-pink">But the deep healing? The glow-up path?</p>
                  <p className="text-fuchsia-400">That's behind the $9/month door. You'll know when it's time.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 text-center relative bg-gradient-to-br from-purple-900/60 via-pink-900/50 to-orange-900/40 backdrop-blur-sm overflow-hidden">
        {/* Dramatic background effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-glitch-cyan via-glitch-pink to-glitch-orange opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-glitch-orange via-glitch-pink to-glitch-cyan opacity-80"></div>
        
        {/* Multiple floating orbs for dramatic effect */}
        <Orb className="top-10 left-10 opacity-20" />
        <Orb className="top-20 right-20 opacity-25" />
        <Orb className="bottom-20 left-20 opacity-15" />
        <Orb className="bottom-10 right-10 opacity-30" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-glitch-cyan rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-glitch-orange rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-glitch-lime rounded-full animate-float opacity-70" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '2px #ec4899'}}>
              <span className="text-white">Ready for your</span> <span className="text-blue-400" style={{textShadow: '0 0 20px rgba(59,130,246,0.8)'}}>emotional reformat</span>?
            </h2>
            <p className="text-3xl lg:text-4xl text-fuchsia-400 max-w-3xl mx-auto leading-relaxed mb-4 font-bold" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>
              Stop doomscrolling and start reprogramming.
            </p>
            <p className="text-xl lg:text-2xl text-blue-400 max-w-2xl mx-auto font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(59,130,246,0.6)'}}>
              Your <span className="text-blue-400 font-black">future self</span> will thank you.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="/sign-up" className="group">
              <Button size="lg" className="text-2xl rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-pink-500 hover:via-orange-500 hover:to-red-500 text-white font-black shadow-2xl shadow-pink-500/60 hover:shadow-orange-500/80 transition-all duration-500 px-16 py-8 animate-pulse group-hover:animate-none transform hover:scale-110" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                <Rocket className="mr-4 h-8 w-8 group-hover:translate-x-2 transition-transform" />
                Begin the Ritual FREE
                <ArrowRight className="ml-4 h-8 w-8 group-hover:translate-x-2 transition-transform" />
              </Button>
            </a>
            
            <div className="text-center">
              <p className="text-lg text-white mb-2 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>No credit card required</p>
              <div className="flex items-center justify-center gap-2 text-base text-glitch-cyan font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span>Join 10,000+ warriors</span>
              </div>
            </div>
          </div>
          
          {/* Final encouragement */}
          <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <p className="text-2xl text-white italic font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              "The best time to plant a tree was 20 years ago. The second best time is <span className="text-glitch-pink font-black">now</span>."
            </p>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255,20,147,0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255,20,147,0.8);
            transform: scale(1.05);
          }
        }
        
        @keyframes section-fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .animate-section-fade {
          animation: section-fade-in 0.8s ease-out;
        }
        
        /* Smooth hover transitions for all interactive elements */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>
    </div>
  );
}

// New: A reusable component for the feature cards.
const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: 'primary' | 'secondary' | 'accent' }) => {
  const colorClasses = {
    primary: {
      bg: 'bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20',
      border: 'border-orange-500/50 hover:border-orange-400',
      icon: 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
      title: 'text-orange-400',
      glow: 'shadow-orange-500/30 hover:shadow-orange-500/60'
    },
    secondary: {
      bg: 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20',
      border: 'border-purple-500/50 hover:border-purple-400',
      icon: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
      title: 'text-purple-400',
      glow: 'shadow-purple-500/30 hover:shadow-purple-500/60'
    },
    accent: {
      bg: 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20',
      border: 'border-cyan-500/50 hover:border-cyan-400',
      icon: 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white',
      title: 'text-cyan-400',
      glow: 'shadow-cyan-500/30 hover:shadow-cyan-500/60'
    }
  };
  
  const currentColors = colorClasses[color];
  
  return (
    <div className={`text-center p-8 ${currentColors.bg} backdrop-blur-sm rounded-xl border-2 ${currentColors.border} ${currentColors.glow} transition-all duration-300 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className={`absolute top-4 left-4 w-2 h-2 ${currentColors.icon} rounded-full animate-float opacity-60`}></div>
        <div className={`absolute top-8 right-6 w-1 h-1 ${currentColors.icon} rounded-full animate-float opacity-40`} style={{animationDelay: '0.5s'}}></div>
        <div className={`absolute bottom-6 left-8 w-1.5 h-1.5 ${currentColors.icon} rounded-full animate-float opacity-50`} style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className={`flex items-center justify-center h-16 w-16 rounded-xl ${currentColors.icon} mx-auto transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-lg mb-6 relative z-10`}>
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className={`text-xl font-bold ${currentColors.title} mb-3`}>{title}</h3>
        <p className="text-base text-gray-300 leading-relaxed">{description}</p>
      </div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${currentColors.icon} opacity-10 rounded-bl-full`}></div>
    </div>
  );
};

// New: A reusable component for the pricing cards.
const PricingCard = ({ plan, price, priceDetail, description, features, cta, isFeatured = false }: { plan: string; price: string; priceDetail?: string; description: string; features: string[]; cta: string; isFeatured?: boolean; }) => (
  <div className={`flex flex-col p-10 backdrop-blur-sm rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group ${isFeatured ? 'border-pink-500/60 shadow-2xl shadow-pink-500/40 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-red-900/20' : 'border-cyan-500/50 hover:border-cyan-400 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-cyan-900/10 shadow-xl shadow-cyan-500/20'}`}>
    
    {/* Animated background on hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isFeatured ? 'bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-500/10' : 'bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10'}`}></div>
    
    {/* Featured badge */}
    {isFeatured && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
          ⭐ MOST POPULAR
        </div>
      </div>
    )}
    
    {/* Decorative corner elements */}
    <div className={`absolute top-0 right-0 w-24 h-24 opacity-20 rounded-bl-full ${isFeatured ? 'bg-gradient-to-bl from-pink-500 to-purple-500' : 'bg-gradient-to-bl from-cyan-500 to-blue-500'}`}></div>
    
    <div className="relative z-10">
      <h3 className={`text-4xl font-black text-center mb-3 tracking-tight ${isFeatured ? 'text-transparent bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text' : 'text-cyan-400'}`} style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>{plan}</h3>
      <p className="text-center text-white h-12 flex items-center justify-center text-lg font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>{description}</p>
      
      <div className="mt-8 text-center">
        <span className={`text-7xl font-black ${isFeatured ? 'text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 bg-clip-text' : 'text-cyan-400'}`} style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>{price}</span>
        {priceDetail && <span className="text-xl font-bold text-white ml-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>{priceDetail}</span>}
      </div>
      
      <ul className="mt-10 space-y-5 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start group/item">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-0.5 transition-transform group-hover/item:scale-110 ${isFeatured ? 'bg-gradient-to-r from-pink-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="text-white text-lg leading-relaxed font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-10">
        <a href="/sign-up" className="w-full block">
          <Button
            size="lg"
            className={`w-full text-lg rounded-2xl font-black transition-all duration-500 py-4 px-8 transform hover:scale-105 ${isFeatured ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-pink-500 hover:via-orange-500 hover:to-red-500 text-white shadow-xl shadow-pink-500/50 hover:shadow-orange-500/60 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-cyan-500/40 hover:shadow-blue-500/50'}`}
            style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
          >
            {cta}
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </a>
      </div>
    </div>
  </div>
);
