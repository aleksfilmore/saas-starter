"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import {
  Brain, Zap, Users, ArrowRight,
  Sparkles, ChevronDown,
  ChevronUp, Gamepad2, CheckCircle,
  Star, Heart, Target, Calendar, Timer, MessageCircle,
  Shield, MessageSquare
} from 'lucide-react';

// Particle component for floating effects
const FloatingParticles = () => {
  useEffect(() => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      const delay = Math.random() * 8;
      const duration = 8 + Math.random() * 4;
      const xOffset = Math.random() * 200 - 100;
      
      (particle as HTMLElement).style.animationDelay = `${delay}s`;
      (particle as HTMLElement).style.animationDuration = `${duration}s`;
      (particle as HTMLElement).style.left = `${Math.random() * 100}%`;
      (particle as HTMLElement).style.setProperty('--x-offset', `${xOffset}px`);
    });
  }, []);

  return (
    <div className="particle-system">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`particle ${
            ['particle-purple', 'particle-pink', 'particle-blue', 'particle-green'][i % 4]
          }`}
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      title: "No-Contact Tracker",
      description: "Block. Count. Brag. Your anti-relapse streak clocks every ghost-free day and rewards you in Bytes.",
      gradient: "bg-gradient-to-br from-blue-500 to-purple-500",
      glowColor: "shadow-glow-blue"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Daily Ritual Engine",
      description: "Gamified micro-quests—guided breathwork, playlist purges, emoji forecasts—personalized by your attachment archetype.",
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500",
      glowColor: "shadow-glow-yellow"
    },
    {
      icon: <Brain className="h-6 w-6 text-green-400" />,
      title: "AI Therapy Console",
      description: "Text sessions on tap, voice oracle on demand. Not a licensed therapist—more like a brutally honest glitch-sage.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
      glowColor: "shadow-glow-green"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-pink-400" />,
      title: "Wall of Wounds™",
      description: "Anonymous confessions transformed into shareable confession cards. React, relate, release.",
      gradient: "bg-gradient-to-br from-red-500 to-pink-500",
      glowColor: "shadow-glow-pink"
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does AI therapy compare to real therapy?",
      answer: "Our AI therapy is designed to complement, not replace, professional therapy. It provides 24/7 support, immediate responses, and specialized knowledge about breakup recovery that's always available when you need it most."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We use end-to-end encryption, anonymous usernames, and never share personal information. Your healing journey is completely private and secure."
    },
    {
      question: "What makes this different from other breakup apps?",
      answer: "We're the first to gamify the healing process with real psychology. Think of it as RPG character development, but for your emotional growth and attachment patterns."
    },
    {
      question: "How long does the healing process take?",
      answer: "Everyone's journey is different. Our data shows most users see significant improvement within 30-90 days of consistent engagement with the platform."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your subscription at any time with just one click. You'll retain access to premium features until the end of your billing period, and you can always restart later."
    },
    {
      question: "What if I'm not ready for a community?",
      answer: "No pressure at all! You can use all healing features privately. The Wall of Wounds is completely optional, and you control exactly how much you want to share or engage with others."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <FloatingParticles />
      
      {/* Header */}
      <header className="relative z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                <span className="hidden sm:inline">CTRL+ALT+</span>
                <span className="sm:hidden">CAB+</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 brand-glitch" data-text="BLOCK">BLOCK</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/quiz">
                <Button className="btn-brand-primary px-3 sm:px-6 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Start Healing Scan</span>
                  <span className="sm:hidden">Start Scan</span>
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
      <section className="relative z-10 hero-brand">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 text-purple-300 text-sm mb-8 neon-border-purple">
            <Sparkles className="h-4 w-4 mr-2" />
            The Future of Heartbreak Recovery
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-brand-glow">Stop </span>
            <span className="text-brand-gradient brand-glitch" data-text="Obsessing">Obsessing</span>
            <br />
            <span className="text-brand-glow">Start </span>
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Healing</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Reformat heartbreak with AI + psychology: scan your attachment style, lock your no-contact streak, run personalized rituals and journal prompts, and vent—anonymously—on the Wall of Wounds. Stop texting your ex; start stacking wins.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/quiz">
              <Button className="btn-brand-primary px-8 py-4 text-lg">
                START YOUR HEALING JOURNEY
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-400">
            Start free • No card required • Cancel anytime • <span className="text-purple-400 font-medium">Join thousands of recovering hearts</span>
          </p>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-gradient-to-br from-gray-800 to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-glow mb-6">
              Revolutionary <span className="text-brand-gradient">Healing Technology</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combining AI therapy, gamification, and proven psychological methodologies to guide you through modern heartbreak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-brand group">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-white ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-glow mb-6">
              Choose Your <span className="text-brand-gradient">Healing Path</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ghost Mode */}
            <div className="card-brand border-gray-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Ghost Mode</h3>
                <div className="text-4xl font-bold text-white mb-1">Free</div>
                <p className="text-gray-300">Basic healing features</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  No-contact tracker
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Daily Journaling
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  1 Daily Healing Ritual
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Read Wall of Wounds posts
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Forever free
                </li>
              </ul>
              
              <Link href="/quiz">
                <Button className="btn-brand-secondary w-full py-3">
                  Start Free
                </Button>
              </Link>
            </div>

            {/* Firewall Mode */}
            <div className="card-brand border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Firewall Mode</h3>
                <div className="text-4xl font-bold text-white mb-1">$9.99</div>
                <p className="text-gray-300">per month</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Everything in Ghost Mode
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  2 Personalized Daily Healing Rituals
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Advanced AI Therapy Chat
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Post on Wall of Wounds
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Earn badges to unlock exclusive features
                </li>
              </ul>
              
              <Link href="/quiz">
                <Button className="btn-brand-primary w-full py-3">
                  Start Healing Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-glow mb-6">
              How <span className="text-brand-gradient">It Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your journey from heartbreak to healing, gamified and guided by AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-brand text-center">
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-6 rounded-xl mb-6 w-fit mx-auto">
                <Target className="h-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit mx-auto">
                Step 1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Healing Archetype Scan</h3>
              <p className="text-gray-300 leading-relaxed">
                Take our AI-powered quiz to discover your unique healing archetype and get personalized recommendations for your recovery journey.
              </p>
            </div>

            <div className="card-brand text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl mb-6 w-fit mx-auto">
                <Calendar className="h-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit mx-auto">
                Step 2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Daily Healing Rituals</h3>
              <p className="text-gray-300 leading-relaxed">
                Complete personalized micro-activities designed to rebuild your confidence, establish boundaries, and strengthen emotional resilience.
              </p>
            </div>

            <div className="card-brand text-center">
              <div className="bg-gradient-to-br from-green-500 to-blue-500 p-6 rounded-xl mb-6 w-fit mx-auto">
                <Gamepad2 className="h-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit mx-auto">
                Step 3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Glow Up & Unlock</h3>
              <p className="text-gray-300 leading-relaxed">
                Track your progress, earn badges, maintain no-contact streaks, and connect with a supportive anonymous community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Blog Articles Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-glow mb-6">
              Healing <span className="text-brand-gradient">Insights & Guides</span>
            </h2>
            <p className="text-xl text-gray-300">
              Evidence-based articles to accelerate your recovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/blog/7-stages-breakup-healing" className="card-brand group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-4 rounded-xl mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                The 7 Stages of Breakup Healing
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Understanding the psychological journey from devastation to recovery, and how to accelerate each stage.
              </p>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                Read Guide <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/blog/urge-to-text-ex-how-to-stop" className="card-brand group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                Urge to Text Your Ex? How to Stop
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Practical strategies to resist contact urges and maintain healthy boundaries during recovery.
              </p>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                Read Guide <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/blog/self-care-rituals-stop-overthinking" className="card-brand group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-blue-500 p-4 rounded-xl mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                Self-Care Rituals That Stop Overthinking
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Science-backed micro-activities designed to interrupt rumination and rebuild emotional strength.
              </p>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                Read Guide <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-glow mb-6">
              Frequently Asked <span className="text-brand-gradient">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card-brand">
                <button
                  className="w-full text-left flex items-center justify-between"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-400" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <div className="mt-4 pt-4 border-t border-purple-500/20">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
