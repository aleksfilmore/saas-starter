"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Target, Timer, Users, Star, ArrowRight, 
  Brain, Zap, MessageSquare, Sparkles
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

export default function HowItWorksPage() {
  const steps = [
    {
      number: "1️⃣",
      title: "Run the 2-Minute System Scan",
      description: "Attachment quiz in disguise. No real names. Just archetypes.",
      icon: <Target className="h-10 w-10" />,
      gradient: "bg-gradient-to-br from-purple-600 to-pink-500"
    },
    {
      number: "2️⃣",
      title: "Receive Daily Ritual Protocols",
      description: "3–5 micro-quests dropped at optimal times. Multimedia, XP, and mood slider feedback.",
      icon: <Timer className="h-10 w-10" />,
      gradient: "bg-gradient-to-br from-blue-500 to-purple-600"
    },
    {
      number: "3️⃣",
      title: "Level Up via AI & Community",
      description: "Chat with the AI goblin, dump secrets on the Wall, collect Byte loot. Streaks trigger bigger rituals.",
      icon: <Users className="h-10 w-10" />,
      gradient: "bg-gradient-to-br from-green-500 to-blue-500"
    },
    {
      number: "4️⃣",
      title: "Break Free & Glow-Up",
      description: "30-Day Reformat or 90-Day Deep Reset. Exit with receipts, badges, and a timeline your ex wishes they kept.",
      icon: <Star className="h-10 w-10" />,
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="brand-container">
      <FloatingParticles />

      {/* Header */}
      <header className="w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent brand-glitch" data-text="BLOCK">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  Back to Home
                </Button>
              </Link>
              <Link href="/quiz">
                <Button className="btn-brand-primary">
                  Start Healing
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-brand-glow leading-tight mb-6">
          Your Healing Journey in 
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Four Glitchy Steps
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
          From heartbreak to breakthrough—here's how we guide you through the transformation process.
        </p>
      </div>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="text-6xl font-black text-purple-400 mb-4 flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${step.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Technology Behind the Magic
          </h2>
          <p className="text-gray-400 text-lg">
            Powered by cutting-edge psychology and gamification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Brain className="h-8 w-8" />,
              title: "AI-Powered",
              description: "Smart algorithms adapt to your healing style"
            },
            {
              icon: <Zap className="h-8 w-8" />,
              title: "Gamified",
              description: "XP, levels, and achievements make progress fun"
            },
            {
              icon: <MessageSquare className="h-8 w-8" />,
              title: "Anonymous",
              description: "Share and heal without compromising privacy"
            },
            {
              icon: <Star className="h-8 w-8" />,
              title: "Evidence-Based",
              description: "Backed by attachment theory and psychology"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Take the first step and discover your unique healing path.
          </p>
          <Link href="/quiz">
            <Button 
              size="lg"
              className="btn-brand-primary text-lg px-12 py-4"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start System Scan
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
