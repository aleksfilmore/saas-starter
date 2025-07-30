"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Trophy, MessageCircle, Check } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-gray-950 text-foreground">
      {/* Hero Section - Clean, Unified Poster Layout */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-950">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Unified Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
            
            {/* Left side - Core Value Proposition */}
            <div className="text-left">
              {/* Main Title */}
              <div className="mb-8">
                <div className="text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <span className="text-white">CTRL+ALT</span>
                </div>
                <div className="text-7xl lg:text-8xl font-black tracking-tighter leading-none" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                  <span className="text-glitch-pink">BLOCK</span>
                </div>
              </div>
              
              {/* Core Promise */}
              <div className="text-xl lg:text-2xl leading-relaxed mb-12 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                <p className="text-white">
                  Stop stalking their Instagram.<br />
                  Start <span className="text-glitch-pink font-black">leveling up</span>.
                </p>
              </div>
              
              {/* Core Features - Clean List */}
              <div className="mb-12 space-y-4">
                <div className="flex items-center space-x-4">
                  <Brain className="h-6 w-6 text-purple-400" />
                  <span className="text-lg text-white font-medium">AI Therapy Sessions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MessageCircle className="h-6 w-6 text-green-400" />
                  <span className="text-lg text-white font-medium">24/7 Protocol Ghost</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg text-white font-medium">XP for Growth Choices</span>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="space-y-4">
                <a href="/sign-up">
                  <Button 
                    size="lg" 
                    className="text-lg font-black uppercase tracking-wider px-12 py-4 rounded-lg bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] border-2 border-glitch-pink hover:scale-105"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)', 
                      fontFamily: 'system-ui, -apple-system, sans-serif', 
                      fontWeight: '900'
                    }}
                  >
                    Join Free
                  </Button>
                </a>
                <div>
                  <a href="/ai-therapy-demo">
                    <Button 
                      size="lg" 
                      className="text-lg font-black uppercase tracking-wider px-12 py-4 rounded-lg bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif', 
                        fontWeight: '900'
                      }}
                    >
                      Try Demo
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right side - Figure with clean presentation */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-96 h-96 lg:w-[36rem] lg:h-[36rem] rounded-full flex items-center justify-center relative">
                  <img
                    src="/figure.png"
                    alt="Cloaked figure"
                    className="w-80 h-80 lg:w-[32rem] lg:h-[32rem] object-contain relative z-10"
                    style={{
                      filter: 'brightness(0.7) contrast(1.1) saturate(1.2)'
                    }}
                  />
                  
                  {/* Broken heart on chest */}
                  <div className="absolute bottom-32 lg:bottom-48 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="relative">
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-glitch-pink transform rotate-45 rounded-tl-full rounded-tr-full shadow-[0_0_20px_rgba(236,72,153,0.8)]"></div>
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-glitch-pink transform rotate-45 rounded-tl-full rounded-tr-full shadow-[0_0_20px_rgba(236,72,153,0.8)]"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 w-10 lg:w-14 h-0.5 bg-black transform -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Clean Process */}
      <section className="py-24 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              How It Works
            </h2>
            <p className="text-xl text-gray-400">Three steps to emotional freedom</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Therapy</h3>
              <p className="text-gray-400">Choose-your-path scenarios. Get XP for growth choices.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Protocol Ghost</h3>
              <p className="text-gray-400">24/7 AI confidant when you need support.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Level Up</h3>
              <p className="text-gray-400">Track progress. Build streaks. Unlock achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Clean Tiers */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Choose Your Path
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-4xl font-black text-white mb-6">$0</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Monthly AI therapy</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Daily Protocol Ghost</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Basic progress tracking</span>
                </div>
              </div>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                Start Free
              </Button>
            </div>

            {/* Firewall */}
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-2 border-orange-500 rounded-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Firewall</h3>
              <p className="text-4xl font-black text-white mb-6">$19<span className="text-lg text-gray-400">/mo</span></p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Bi-weekly AI therapy</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Unlimited Protocol Ghost</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Advanced analytics</span>
                </div>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Upgrade
              </Button>
            </div>

            {/* Cult Leader */}
            <div className="bg-gray-800/50 border border-purple-500 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Cult Leader</h3>
              <p className="text-4xl font-black text-white mb-6">$49<span className="text-lg text-gray-400">/mo</span></p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Priority therapy access</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Exclusive features</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Direct support line</span>
                </div>
              </div>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                Join Cult
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Clean Close */}
      <section className="py-24 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            Ready to Level Up?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands who chose themselves over chaos.
          </p>
          <a href="/sign-up">
            <Button 
              size="lg" 
              className="text-xl font-black uppercase tracking-wider px-16 py-6 rounded-lg bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] border-2 border-glitch-pink hover:scale-105"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.8)', 
                fontFamily: 'system-ui, -apple-system, sans-serif', 
                fontWeight: '900'
              }}
            >
              Start Your Journey <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
