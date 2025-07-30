"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ShieldCheck, Zap, Award, Sparkles, Bot, Target } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';

export default function DashboardPage() {
  const [noContactDays, setNoContactDays] = useState(17);

  return (
    <AuthWrapper>
      <div className="relative min-h-screen bg-gray-950 text-foreground overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
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
          <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-glitch-cyan rounded-full animate-float opacity-50" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/6 left-2/3 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-40" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 py-10 px-2 sm:px-6">
          <header className="mb-12 relative">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '2px #ec4899'}}>
              Welcome Back, <span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>Warrior</span>
            </h1>
            <p className="text-lg text-fuchsia-400 font-medium flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 0 10px rgba(217,70,239,0.6)'}}>
              <Sparkles className="w-5 h-5 mr-2 text-glitch-pink animate-pulse" />
              Your emotional reformat is in progress. Stay strong.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* No Contact Streak Card */}
              <div className="relative bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-glitch-pink shadow-[0_0_40px_rgba(255,20,147,0.3)] hover:shadow-[0_0_50px_rgba(255,20,147,0.5)] transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-glitch-pink/10 via-transparent to-purple-500/10 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-glitch-pink mr-4 shadow-[0_0_20px_rgba(255,20,147,0.6)]">
                      <ShieldCheck className="h-7 w-7 text-white" />
                    </span>
                    <h2 className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>No Contact Streak</h2>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-green-500/20 text-green-400 border border-green-400/30" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                        <Target className="w-3 h-3 mr-1" />
                        SYSTEM ACTIVE
                      </span>
                    </div>
                  </div>
                  <div className="text-center my-8">
                    <span className="text-8xl md:text-9xl font-black bg-gradient-to-br from-glitch-pink via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tighter drop-shadow-2xl animate-pulse" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                      {noContactDays}
                    </span>
                    <span className="block text-2xl text-white mt-2 font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Days Strong</span>
                  </div>
                  <div className="bg-gray-800/60 border border-glitch-pink/30 rounded-xl p-4">
                    <p className="text-center text-white font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      You haven't contacted your ex since <span className="font-black text-glitch-pink">[Date]</span>. 
                      <br />
                      <span className="text-sm text-blue-400 font-bold">Keep crushing it! 🔥</span>
                    </p>
                  </div>
                  <div className="text-center mt-6">
                    <Button
                      className="border-2 border-blue-400 text-blue-400 bg-transparent hover:bg-blue-400 hover:text-gray-900 rounded-xl px-6 py-3 font-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Set Your Start Date
                    </Button>
                  </div>
                </div>
              </div>

              {/* Today's Ritual Card */}
              <div className="relative bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-400 mr-4 shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                      <Zap className="h-7 w-7 text-gray-900 animate-pulse" />
                    </span>
                    <h2 className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>Today's Ritual</h2>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-400/30 animate-pulse" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                        <Bot className="w-3 h-3 mr-1" />
                        AI READY
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-800/60 border border-blue-400/30 rounded-xl p-6">
                      <h3 className="text-xl font-black text-white mb-3 flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                        <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                        The "Pet Perspective" Generator
                      </h3>
                      <p className="text-white/90 leading-relaxed font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                        Your pet probably saw the whole thing. Time to hear their side of the story. Describe a memory with your ex and your pet, and our AI will generate what your furry (or scaly) friend was <em className="text-blue-400 font-bold">really</em> thinking.
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 rounded-xl px-8 py-3 text-lg font-black w-full md:w-auto" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                      <Bot className="mr-2 h-5 w-5" />
                      Generate Pet Perspective
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Savage Badges */}
              <div className="relative bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 text-white flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    <Award className="w-6 h-6 mr-2 text-purple-400" />
                    Savage Badges
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 rounded-xl bg-gray-800/60 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-purple-400 mr-3 shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                        <Award className="h-5 w-5 text-white" />
                      </span>
                      <span className="font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Petty Saint</span>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-gray-800/60 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-400 mr-3 shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                        <Award className="h-5 w-5 text-gray-900" />
                      </span>
                      <span className="font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Blocked and Blessed</span>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-gray-800/40 border border-gray-600/30 opacity-60">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-600 mr-3">
                        <Award className="h-5 w-5 text-gray-400" />
                      </span>
                      <span className="font-black text-gray-400" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>Digital Detox Master</span>
                      <span className="ml-auto text-xs text-red-400 font-black" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>LOCKED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="relative bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-glitch-pink shadow-[0_0_40px_rgba(255,20,147,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-glitch-pink/10 via-transparent to-red-500/10 rounded-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-4 text-white flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                    <Sparkles className="w-6 h-6 mr-2 text-glitch-pink" />
                    Your Progress
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    View your mood journal, past rituals, and shareable progress reports. Track your emotional transformation.
                  </p>
                  <Button
                    className="w-full border-2 border-glitch-pink text-glitch-pink bg-transparent hover:bg-glitch-pink hover:text-gray-900 rounded-xl py-3 font-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,20,147,0.5)]"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    View Full History
                  </Button>
                </div>
              </div>
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
        `}</style>
      </div>
    </AuthWrapper>
  );
}