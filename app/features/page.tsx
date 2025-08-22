"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Shield, Brain, Zap, MessageSquare,
  ArrowRight, Sparkles
} from 'lucide-react';
import { SiteFooter } from '@/components/layout/SiteFooter';

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
    </div>
  )
}

export default function FeaturesPage() {
  const features = [
    {
      icon: <Brain className="h-12 w-12" />,
      title: "🧠 AI Therapy Console",
      description: "Text sessions on tap, voice oracle on demand. Not a licensed therapist—more like a brutally honest glitch-sage.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "⚡ Daily Ritual Engine",
      description: "Gamified micro-quests—guided breathwork, playlist purges, emoji forecasts—personalized by your attachment archetype.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "🛡️ No-Contact Tracker",
      description: "Block. Count. Brag. Your anti-relapse streak clocks every ghost-free day and rewards you in Bytes.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: <MessageSquare className="h-12 w-12" />,
      title: "🎭 Wall of Wounds™",
      description: "Anonymous confessions transformed into shareable confession cards. React, relate, release.",
      gradient: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="brand-container">
      <FloatingParticles />
      {/* Header */}
      <header className="relative z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-sm xs:text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight whitespace-nowrap">
                <span>CTRL+ALT+</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 brand-glitch" data-text="BLOCK">BLOCK</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/quiz">
                <Button className="btn-brand-primary px-3 sm:px-6 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Start Healing Journey</span>
                  <span className="sm:hidden">Start Journey</span>
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="btn-brand-secondary px-3 sm:px-4 text-xs sm:text-sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 brand-glow">
          Reformat heartbreak with 
          <br />
          <span className="brand-text-gradient brand-glitch">
            AI + psychology
          </span>
        </h1>
        <p className="text-xl text-brand-light max-w-3xl mx-auto leading-relaxed mb-12">
          Turn your breakup into a structured healing journey with personalized AI therapy, gamified daily rituals, and community support.
        </p>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-brand group hover:neon-border transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-6 rounded-full bg-brand-gradient mb-6 group-hover:scale-110 transition-transform duration-300 neon-border`}>
                  <div className="text-white brand-glow">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 brand-glow">
                  {feature.title}
                </h3>
                <p className="text-brand-light leading-relaxed text-lg">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="card-brand p-12 neon-border">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 brand-glow">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl text-brand-light mb-8 leading-relaxed">
            Join thousands who've discovered that healing doesn't have to be boring.
          </p>
          <Link href="/quiz">
            <Button 
              size="lg"
              className="btn-brand-primary text-lg px-12 py-4 hover:scale-105 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Healing Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
