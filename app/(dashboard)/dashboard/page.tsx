"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ShieldCheck, Zap, Award, Sparkles, Bot, Target } from 'lucide-react';

export default function DashboardPage() {
  const [noContactDays, setNoContactDays] = useState(17);

  return (
    <div className="bg-cyber-gradient min-h-screen py-10 px-2 sm:px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-glitch-pink/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-glitch-cyan/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-secondary/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <header className="mb-12 relative">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Welcome Back.
        </h1>
        <p className="text-lg text-muted-foreground mt-2 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-accent animate-pulse" />
          Your emotional reformat is in progress. Stay strong.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* No Contact Streak Card */}
          <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-primary/60 shadow-neon-pink group hover:shadow-neon-pink/80 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary mr-4 shadow-neon-pink">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </span>
                <h2 className="text-2xl font-bold text-foreground">No Contact Streak</h2>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success border border-success/30">
                    <Target className="w-3 h-3 mr-1" />
                    ON TRACK
                  </span>
                </div>
              </div>
              <div className="text-center my-8">
                <span className="text-8xl md:text-9xl font-extrabold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tighter drop-shadow-2xl animate-pulse-slow">
                  {noContactDays}
                </span>
                <span className="block text-2xl text-muted-foreground mt-2 font-medium">Days Strong</span>
              </div>
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                <p className="text-center text-foreground/90">
                  You haven't contacted your ex since <span className="font-semibold text-primary">[Date]</span>. 
                  <br />
                  <span className="text-sm text-accent">Keep crushing it! 🔥</span>
                </p>
              </div>
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary hover:shadow-neon-pink/50 transition-all duration-300 rounded-xl px-6"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Your Start Date
                </Button>
              </div>
            </div>
          </div>

          {/* Today's Ritual Card */}
          <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-secondary/40 shadow-neon-purple group hover:shadow-neon-purple/80 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-accent mr-4 shadow-neon-purple">
                  <Zap className="h-7 w-7 text-white animate-pulse" />
                </span>
                <h2 className="text-2xl font-bold text-foreground">Today's Ritual</h2>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning border border-warning/30 animate-pulse">
                    <Bot className="w-3 h-3 mr-1" />
                    AI READY
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-6 border border-secondary/20">
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-secondary" />
                    The "Pet Perspective" Generator
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your pet probably saw the whole thing. Time to hear their side of the story. Describe a memory with your ex and your pet, and our AI will generate what your furry (or scaly) friend was <em className="text-accent">really</em> thinking.
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/80 hover:to-accent/80 text-white shadow-neon-purple hover:shadow-neon-purple/80 transition-all duration-300 rounded-xl px-8 py-3 text-lg font-medium w-full md:w-auto">
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
          <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-accent/40 shadow-neon-blue">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-glitch-cyan/5 rounded-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center">
                <Award className="w-6 h-6 mr-2 text-accent" />
                Savage Badges
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-accent/10 to-glitch-cyan/10 border border-accent/20 hover:border-accent/40 transition-all duration-300">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-accent to-glitch-cyan mr-3 shadow-neon-blue">
                    <Award className="h-5 w-5 text-white" />
                  </span>
                  <span className="font-medium text-foreground">Petty Saint</span>
                </div>
                <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-success/10 to-glitch-lime/10 border border-success/20 hover:border-success/40 transition-all duration-300">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-success to-glitch-lime mr-3">
                    <Award className="h-5 w-5 text-white" />
                  </span>
                  <span className="font-medium text-foreground">Blocked and Blessed</span>
                </div>
                <div className="flex items-center p-3 rounded-xl bg-muted/20 border border-muted/30 opacity-60">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mr-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                  </span>
                  <span className="font-medium text-muted-foreground">Digital Detox Master</span>
                  <span className="ml-auto text-xs text-muted-foreground">LOCKED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-glitch-pink/40 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-glitch-pink/5 via-transparent to-primary/5 rounded-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-glitch-pink" />
                Your Progress
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                View your mood journal, past rituals, and shareable progress reports. Track your emotional transformation.
              </p>
              <Button
                variant="outline"
                className="w-full border-glitch-pink/50 text-glitch-pink hover:bg-glitch-pink/10 hover:text-glitch-pink hover:border-glitch-pink transition-all duration-300 rounded-xl"
              >
                <Target className="mr-2 h-4 w-4" />
                View Full History
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}