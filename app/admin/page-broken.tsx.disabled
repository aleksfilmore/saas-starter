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
  ChevronUp, Quote, Gamepad2, CheckCircle,
  Star, Heart, Target, Calendar, Timer, MessageCircle
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
      icon: <Brain className="h-12 w-12 text-purple-400" />,
      title: "AI Therapy Chat",
      description: "24/7 access to AI-powered therapeutic conversations with specialized personas tailored to your healing journey.",
      gradient: "bg-gradient-to-br from-purple-600 to-pink-500",
      glowColor: "shadow-glow-purple"
    },
    {
      icon: <Calendar className="h-12 w-12 text-blue-400" />,
      title: "Daily Healing Rituals",
      description: "Science-backed micro-activities designed to rebuild your confidence and emotional strength systematically.",
      gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
      glowColor: "shadow-glow-blue"
    },
    {
      icon: <Target className="h-12 w-12 text-green-400" />,
      title: "No-Contact Tracker",
      description: "Gamified streak tracking to help you maintain healthy boundaries and resist the urge to reconnect.",
      gradient: "bg-gradient-to-br from-green-500 to-blue-500",
      glowColor: "shadow-glow-green"
    },
    {
      icon: <Users className="h-12 w-12 text-pink-400" />,
      title: "Wall of Wounds",
      description: "Anonymous community space to share your journey, connect with others, and celebrate healing milestones.",
      gradient: "bg-gradient-to-br from-pink-500 to-purple-600",
      glowColor: "shadow-glow-pink"
    }
  ];

  const testimonials = [
    {
      name: "exile_ghost",
      archetype: "Strategic Survivor",
      text: "The AI therapy sessions actually understood my attachment style. First time I felt heard in months.",
      days: 45
    },
    {
      name: "phoenix_rising",
      archetype: "Emotional Healer",
      text: "Daily rituals kept me grounded when everything felt chaotic. The progress tracking is motivating.",
      days: 72
    },
    {
      name: "digital_nomad",
      archetype: "Logical Optimizer",
      text: "Wall of Wounds community is incredible. Anonymous support when you need it most.",
      days: 156
    }
  ];

  const faqs = [
    {
      question: "How does the AI therapy actually work?",
      answer: "Our AI companions are trained on evidence-based therapeutic approaches including CBT and attachment theory. They adapt to your specific healing style and provide personalized guidance 24/7."
    },
    {
      question: "Is my data really anonymous?",
      answer: "Yes. We use cryptographic techniques to ensure complete anonymity. No real names, no contact info linked to your healing data. Your privacy is our top priority."
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
            The first AI-powered platform that gamifies your healing journey. Track progress,
            unlock achievements, and connect with a supportive community—all while maintaining complete anonymity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/quiz">
              <Button className="btn-brand-primary px-8 py-4 text-lg">
                <span className="hidden sm:inline">Discover Your Healing Archetype</span>
                <span className="sm:hidden">Start Your Healing Scan</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button className="btn-brand-secondary px-8 py-4 text-lg">
                Free to start
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-400">
            No card required • Cancel anytime • <span className="text-purple-400 font-medium">5,000+ recovering hearts</span>
          </p>
        </div>
      </section>

      <div className="section-divider"></div>

        {/* Hero Section */}
        <div className="px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-teal-100 border border-purple-200 text-purple-700 text-xs sm:text-sm mb-6 sm:mb-8 badge-warm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              The Future of Heartbreak Recovery
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500">Obsessing</span><br />
              Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Healing</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              The first AI-powered platform that gamifies your healing journey. Track progress,
              unlock achievements, and connect with a supportive community—all while maintaining complete anonymity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="w-full sm:w-auto btn-warm-primary px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg text-white border-0 hover:scale-105 transition-all font-bold"
                >
                  <span className="hidden sm:inline">Discover Your Healing Archetype</span>
                  <span className="sm:hidden">Start Your Healing Scan</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-stone-400 text-stone-600 hover:text-purple-600 hover:border-purple-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-stone-500 px-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
                Free to start
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
                Anonymous community
              </div>
            </div>
          </div>
        </div>

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
                  <div className={`p-6 rounded-xl ${feature.gradient} mb-6 w-fit ${feature.glowColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-purple-900 to-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-brand-glow mb-6">
                Healing Stories from Our <span className="text-brand-gradient">Community</span>
              </h2>
              <p className="text-xl text-gray-300">
                Real progress from real people (anonymously shared)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/30 transition-all duration-300">
                  <CardContent className="p-5 sm:p-6">
                    <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mb-3 sm:mb-4" />
                    <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</div>
                        <div className="text-purple-300 text-xs sm:text-sm">{testimonial.archetype}</div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs sm:text-sm">
                        Day {testimonial.days}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Choose Your Healing Path
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
                Start free, upgrade when you're ready for advanced features
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Free Plan */}
              <Card className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ghost Mode</h3>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">Free</div>
                    <p className="text-sm sm:text-base text-gray-400">Perfect for getting started</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3" />
                      <span className="text-gray-300 text-sm sm:text-base">Basic healing rituals</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3" />
                      <span className="text-gray-300 text-sm sm:text-base">No-contact tracker</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3" />
                      <span className="text-gray-300 text-sm sm:text-base">Community access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3" />
                      <span className="text-gray-300 text-sm sm:text-base">Progress tracking</span>
                    </div>
                  </div>

                  <Link href="/sign-up">
                    <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-sm sm:text-base">
                      Start Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-purple-500/50 relative overflow-hidden">
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1">
                    MOST POPULAR
                  </Badge>
                </div>
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Firewall Mode</h3>
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">$9.99</div>
                    <p className="text-sm sm:text-base text-purple-200">per month</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3" />
                      <span className="text-gray-300 text-sm sm:text-base">Everything in Ghost Mode</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3" />
                      <span className="text-gray-300 text-sm sm:text-base">Unlimited AI therapy chat</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-3" />
                      <span className="text-gray-300 text-sm sm:text-base">Advanced healing rituals</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Voice AI therapy sessions</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Priority support</span>
                    </div>
                  </div>

                  <Link href="/sign-up/with-plan">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Start Free Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Healing Insights & Guides
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                Evidence-based articles and guides to support your healing journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "The 7 Stages of Breakup Healing",
                  excerpt: "Understanding the natural progression of heartbreak recovery and what to expect at each stage.",
                  href: "/blog/7-stages-breakup-healing",
                  readTime: "8 min read"
                },
                {
                  title: "Why No-Contact Actually Works",
                  excerpt: "The neuroscience behind why cutting contact helps rewire your brain for healing.",
                  href: "/blog/neuroscience-no-contact-brain", 
                  readTime: "6 min read"
                },
                {
                  title: "Self-Care Rituals That Stop Overthinking",
                  excerpt: "Simple, science-backed activities to break the cycle of obsessive thoughts about your ex.",
                  href: "/blog/self-care-rituals-stop-overthinking",
                  readTime: "5 min read"
                }
              ].map((article, index) => (
                <Card key={index} className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-5 sm:p-6">
                    <div className="mb-4">
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 mb-3 text-xs sm:text-sm">
                        {article.readTime}
                      </Badge>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
                        {article.excerpt}
                      </p>
                    </div>
                    <Link href={article.href}>
                      <Button variant="ghost" className="text-purple-400 hover:text-purple-300 p-0 text-sm sm:text-base">
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button 
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400"
                >
                  View All Articles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
                Everything you need to know about your healing journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {faqs.map((faq, index) => (
                <Card 
                  key={index} 
                  className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-300 transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-b from-gray-900 to-purple-900/30 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 sm:p-12 border border-purple-500/30">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to Start Your Healing Journey?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
                Join thousands of people who've transformed their heartbreak into their comeback.
                Start your healing journey today — free to join, cancel anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 px-4">
                <Link href="/quiz">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg text-white border-0 hover:scale-105 transition-all font-bold"
                  >
                    Start Free Scan
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-gray-500 text-gray-300 hover:text-white hover:border-purple-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 px-4">Start free. Upgrade anytime. Cancel with one click.</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );

}
