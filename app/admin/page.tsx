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

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Brain className="h-12 w-12 text-purple-400" />,
      title: "AI Therapy Chat",
      description: "24/7 access to AI-powered therapeutic conversations with specialized personas tailored to your healing journey.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Calendar className="h-12 w-12 text-blue-400" />,
      title: "Daily Healing Rituals",
      description: "Science-backed micro-activities designed to rebuild your confidence and emotional strength systematically.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Target className="h-12 w-12 text-red-400" />,
      title: "No-Contact Tracker",
      description: "Gamified streak tracking to help you maintain healthy boundaries and resist the urge to reconnect.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: <Users className="h-12 w-12 text-green-400" />,
      title: "Wall of Wounds",
      description: "Anonymous community space to share your journey, connect with others, and celebrate healing milestones.",
      gradient: "from-green-500 to-emerald-500"
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
      question: "Can I use this if I'm not tech-savvy?",
      answer: "Absolutely! The platform is designed to be intuitive and user-friendly. Our gamified approach makes complex psychological concepts accessible and engaging for everyone."
    },
    {
      question: "What if I need crisis support?",
      answer: "While our AI provides great support, for crisis situations we always recommend contacting emergency services or crisis hotlines. We also provide resources for professional therapy when needed."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.png)',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-purple-900/75 to-blue-900/85" />
      
      <div className="relative z-10">
        <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 hover:bg-gray-800/90">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-white tracking-tight">
                  CTRL+ALT+<span className="text-purple-400">BLOCK</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/quiz">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 text-white border-0 hover:scale-105 transition-all"
                  >
                    Start Healing Scan
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-gray-500 text-gray-300 hover:text-white hover:border-purple-400 transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              The Future of Heartbreak Recovery
            </div>
            
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text mb-4 tracking-wide">
              UNINSTALL YOUR EX.
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-mono">
                INSTALL YOUR NEW SELF.
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The first AI-powered platform that gamifies your healing journey. Track progress, 
              unlock achievements, and connect with a supportive community—all while maintaining complete anonymity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/quiz">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12 py-4 text-lg text-white border-0 hover:scale-105 transition-all font-bold"
                >
                  Discover Your Healing Archetype
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-gray-500 text-gray-300 hover:text-white hover:border-purple-400 px-8 py-4 text-lg transition-all"
                >
                  See How It Works
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Start free
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Anonymous community
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Revolutionary Healing Technology
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Combining AI therapy, gamification, and community support to create 
                the most effective heartbreak recovery experience ever built.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Healing Stories from Our Community
              </h2>
              <p className="text-xl text-gray-300">
                Real progress from real people (anonymously shared)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-purple-400 mb-4" />
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-purple-300 text-sm">{testimonial.archetype}</div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
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
        <section id="pricing" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Choose Your Healing Path
              </h2>
              <p className="text-xl text-gray-300">
                Start free, upgrade when you're ready for advanced features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <Card className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Ghost Mode</h3>
                    <div className="text-4xl font-bold text-white mb-2">Free</div>
                    <p className="text-gray-400">Perfect for getting started</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Basic healing rituals</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">No-contact tracker</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Community access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Progress tracking</span>
                    </div>
                  </div>
                  
                  <Link href="/sign-up">
                    <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
                      Start Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-purple-500/50 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    MOST POPULAR
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Firewall Mode</h3>
                    <div className="text-4xl font-bold text-white mb-2">$9.99</div>
                    <p className="text-purple-200">per month</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Everything in Ghost Mode</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Unlimited AI therapy chat</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Advanced healing rituals</span>
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
                      Start Firewall Mode
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-300">
                Everything you need to know about your healing journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-gray-800/60 border-gray-600/50 hover:border-purple-500/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {faq.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-b from-gray-900 to-purple-900/30 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Healing Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands of people who've transformed their heartbreak into their comeback.
                Start your healing journey today — free to join, cancel anytime.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <Link href="/quiz">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12 py-4 text-lg text-white border-0 hover:scale-105 transition-all font-bold"
                  >
                    Start Free Scan
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-gray-500 text-gray-300 hover:text-white hover:border-purple-400 px-8 py-4 text-lg transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-gray-400">Start free. Upgrade anytime. Cancel with one click.</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
