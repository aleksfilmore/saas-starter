"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
  {
    id: 'progressive-onboarding',
    icon: '🎯',
    title: 'Progressive Onboarding',
    description: 'Step-by-step guided introduction with visual progress indicators and XP rewards',
    benefits: ['Clear step indicators', 'Time estimates', 'Completion rewards', 'Skip options'],
    demoPath: '/enhanced-features-demo?tab=onboarding'
  },
  {
    id: 'enhanced-therapy',
    icon: '🎮',
    title: 'Enhanced AI Therapy',
    description: 'Adaptive AI personality that responds to your emotional tone with tier-specific features',
    benefits: ['AI personality adaptation', 'Achievement celebrations', 'Tier-based unlocks', 'XP visualization'],
    demoPath: '/enhanced-features-demo?tab=therapy'
  },
  {
    id: 'progress-visualization',
    icon: '📊',
    title: 'Advanced Progress Tracking',
    description: 'Multi-metric progress visualization with achievement celebrations and milestone tracking',
    benefits: ['Animated progress rings', 'Achievement celebrations', 'Social sharing', 'Milestone rewards'],
    demoPath: '/enhanced-features-demo?tab=progress'
  },
  {
    id: 'wall-enhancement',
    icon: '📱',
    title: 'Enhanced Community Wall',
    description: 'Viral mechanics with emotional tagging, filtering, and tier-based engagement features',
    benefits: ['Emotional reactions', 'Content filtering', 'Tier indicators', 'Community engagement'],
    demoPath: '/enhanced-features-demo?tab=community'
  }
];

const tiers = [
  {
    name: 'Free',
    price: 'FREE',
    period: '',
    description: 'Core tools to get you started',
    features: [
      '🛡️ No Contact Tracker',
      '🧠 1x Weekly AI Therapy',
      '📅 30-Day Recovery Protocol',
      '💸 XP Emergency Unlocks'
    ],
    cta: 'Start Free',
    popular: false,
    color: 'blue'
  },
  {
    name: 'Firewall Mode',
    price: '$19',
    period: 'month',
    description: 'Unlock the full 90-day deep reset',
    features: [
      '🔥 Unlimited AI Therapy',
      '📊 90-Day Deep Reset Protocol', 
      '🏪 Earn + Spend Bytes',
      '👑 Cult-Only Drops Access',
      '⚡ Reduced XP Unlock Costs'
    ],
    cta: 'Upgrade to Firewall',
    popular: true,
    color: 'orange'
  },
  {
    name: 'Cult Leader',
    price: '$49',
    period: 'month',
    description: 'Beta access + exclusive features',
    features: [
      '👑 Everything in Firewall Mode',
      '🎭 Custom Tools & Avatars',
      '🔮 Exclusive Glitch Effects',
      '⚡ Priority Support',
      '🚀 Beta Feature Access'
    ],
    cta: 'Become Cult Leader',
    popular: false,
    color: 'purple'
  }
];

const stats = [
  { label: 'Active Healers', value: '12,847', icon: '👥' },
  { label: 'Sessions Completed', value: '847,293', icon: '🎮' },
  { label: 'XP Earned', value: '2.4M', icon: '⚡' },
  { label: 'Achievements Unlocked', value: '156,729', icon: '🏆' }
];

export default function EnhancedLandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black text-white leading-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                CTRL+ALT+<span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>BLOCK</span>™
              </h1>
              <div className="text-3xl md:text-4xl font-black text-glitch-pink mb-6" style={{
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(255,20,147,0.8)'
              }}>
                TERMINATE. FORMAT. GLOW-UP.
              </div>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                The Post-Breakup Ritual Portal™ with three core tools: 
                <span className="text-red-400 font-bold"> No Contact Tracker</span>, 
                <span className="text-purple-400 font-bold"> AI Therapy Sessions</span>, and 
                <span className="text-green-400 font-bold"> Daily Recovery Protocols</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/glow-up-console">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-glitch-pink to-purple-500 hover:from-pink-600 hover:to-purple-600 text-lg px-8 py-4 font-black"
                >
                  🚀 ENTER THE CONSOLE
                </Button>
              </Link>
              <Link href="/ai-therapy-demo">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 text-lg px-8 py-4 font-bold"
                >
                  🎮 Try AI Therapy Demo
                </Button>
              </Link>
            </div>

            {/* Three Core Pillars Preview */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
              <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">No Contact Tracker</h3>
                <p className="text-red-300/70">Anti-relapse streak counter. Daily reason to log in. Feels like progress even when you're doing nothing.</p>
              </div>
              <div className="bg-purple-900/20 border-2 border-purple-500/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">AI Therapy Sessions</h3>
                <p className="text-purple-300/70">Choose-your-path breakup therapy. Once a week. Structured. Intimate. Premium feeling.</p>
              </div>
              <div className="bg-green-900/20 border-2 border-green-500/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">30/90 Day Protocols</h3>
                <p className="text-green-300/70">Your heartbreak recovery OS. One ritual daily. Unlocks slowly. Builds unbreakable habits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            🎯 ENHANCED FEATURES
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every aspect of the platform has been enhanced with advanced psychology, 
            gamification, and community-driven healing mechanics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.id} 
              className={`bg-gray-800/50 border transition-all duration-300 hover:transform hover:scale-105 ${
                index === currentFeature 
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20' 
                  : 'border-gray-600'
              }`}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href={feature.demoPath}>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    🎮 Try Interactive Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Wall of Wounds Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🖤 Live from the Wall of Wounds
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real healing happening in real-time. Vote, share, and connect with fellow warriors.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "The Ghost Protocol Activated",
              emotion: "grief",
              content: "Deleted their number, blocked on everything, even changed my Netflix password. Still crying but at least I'm crying with dignity.",
              reactions: { fire: 247, realness: 89, strength: 156 },
              timeAgo: "2h ago",
              glitchCode: "GRIEF_PROTOCOL_ACTIVE",
              color: "from-blue-900/40 to-blue-800/40",
              borderColor: "border-blue-500/40"
            },
            {
              title: "Validation Addiction: Day 1", 
              emotion: "freefall",
              content: "Caught myself checking if they viewed my story 47 times today. My dopamine receptors are filed for divorce.",
              reactions: { relatable: 312, humor: 198, truth: 267 },
              timeAgo: "4h ago",
              glitchCode: "FREEFALL_DETECTED",
              color: "from-purple-900/40 to-purple-800/40", 
              borderColor: "border-purple-500/40"
            },
            {
              title: "Plot Twist: I'm the Villain",
              emotion: "glow-up",
              content: "Spent 6 months painting them as toxic. Therapy session revealed: I was the red flag factory all along. Oops.",
              reactions: { growth: 423, brutal: 201, redemption: 178 },
              timeAgo: "1d ago",
              glitchCode: "GLOW_UP_INITIATED", 
              color: "from-green-900/40 to-green-800/40",
              borderColor: "border-green-500/40"
            }
          ].map((card, index) => (
            <Card key={index} className={`bg-gradient-to-br ${card.color} border-2 ${card.borderColor} hover:border-opacity-80 transition-all duration-300 group`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {card.emotion === 'grief' ? '😢' :
                       card.emotion === 'rage' ? '😡' :
                       card.emotion === 'relapse' ? '😵' :
                       card.emotion === 'petty' ? '😒' :
                       card.emotion === 'freefall' ? '😨' : '✨'}
                    </span>
                    <Badge className={`${card.emotion === 'grief' ? 'bg-blue-600/80' :
                                     card.emotion === 'rage' ? 'bg-red-600/80' :
                                     card.emotion === 'relapse' ? 'bg-orange-600/80' :
                                     card.emotion === 'petty' ? 'bg-yellow-600/80' :
                                     card.emotion === 'freefall' ? 'bg-purple-600/80' : 'bg-green-600/80'} text-white text-xs`}>
                      {card.emotion.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">{card.timeAgo}</span>
                </div>
                <CardTitle className="text-lg text-white group-hover:text-gray-200 transition-colors">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">{card.content}</p>
                
                <div className="bg-black/30 p-2 rounded border border-green-500/30">
                  <div className="text-green-400 text-xs font-mono">{card.glitchCode}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    {Object.entries(card.reactions).map(([emotion, count]) => (
                      <button 
                        key={emotion}
                        className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        <span>
                          {emotion === 'fire' ? '🔥' : 
                           emotion === 'realness' ? '💯' :
                           emotion === 'strength' ? '💪' :
                           emotion === 'relatable' ? '👀' :
                           emotion === 'humor' ? '😭' :
                           emotion === 'truth' ? '⚡' :
                           emotion === 'growth' ? '🌱' :
                           emotion === 'brutal' ? '🗡️' : '✨'}
                        </span>
                        <span>{count}</span>
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    📤 Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/wall-enhanced">
            <Button className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-lg px-8 py-3">
              🖤 Enter the Wall of Wounds
            </Button>
          </Link>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            The Post-Breakup Ritual Portal™
          </h2>
          <div className="text-2xl text-glitch-pink font-black mb-4" style={{
            textShadow: '0 0 20px rgba(255,20,147,0.8)',
            fontFamily: 'monospace'
          }}>
            TERMINATE. FORMAT. GLOW-UP.
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            **The Three Core Tools:** No Contact Tracker (your anti-relapse streak), 
            AI Therapy Sessions (choose-your-path breakup therapy), and 30/90-Day Protocols 
            (structured heartbreak recovery OS). Everything else is unlockable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <Card 
              key={tier.name} 
              className={`relative bg-gray-800/50 border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                tier.popular 
                  ? 'border-orange-500 shadow-2xl shadow-orange-500/20' 
                  : 'border-gray-600'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-1 text-sm">
                    🔥 Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className={`text-2xl font-bold ${
                  tier.color === 'blue' ? 'text-blue-400' :
                  tier.color === 'orange' ? 'text-orange-400' : 'text-purple-400'
                }`}>
                  {tier.name} Tier
                </CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-white">
                    {tier.price}
                    <span className="text-lg text-gray-400">/{tier.period}</span>
                  </div>
                  <p className="text-gray-400">{tier.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href="/signup">
                  <Button 
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
          <CardContent className="p-12 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Ready to Begin Your Enhanced Healing Journey?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of digital healers experiencing the next generation of therapeutic technology. 
              AI adaptation, gamified progress, and community-driven healing await.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-4"
                >
                  🚀 Start Enhanced Journey - Free
                </Button>
              </Link>
              <Link href="/enhanced-features-demo">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-4"
                >
                  🎮 Explore Interactive Demo
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-400">
              Free tier includes all enhanced features • No credit card required • Upgrade anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
