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
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Weekly therapy sessions',
      'Basic progress tracking',
      'Community wall access',
      'Emotional tone selection'
    ],
    cta: 'Start Free',
    popular: false,
    color: 'blue'
  },
  {
    name: 'Firewall',
    price: '$9.99',
    period: 'month',
    description: 'Advanced healing tools',
    features: [
      'Unlimited therapy sessions',
      'Advanced progress analytics',
      'Priority community features',
      'Custom emotional tracking',
      'Weekly streak bonuses',
      'Achievement celebrations'
    ],
    cta: 'Upgrade to Firewall',
    popular: true,
    color: 'orange'
  },
  {
    name: 'Cult Leader',
    price: '$19.99',
    period: 'month',
    description: 'Ultimate healing experience',
    features: [
      'Everything in Firewall',
      'Exclusive glitch effects',
      'Community moderation tools',
      'Custom AI personality',
      'Early feature access',
      'Direct developer feedback',
      'VIP support'
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
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            CTRL+ALT+BLOCK™
          </div>
          <div className="flex space-x-4">
            <Link href="/sign-in">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up/enhanced">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Start Healing Journey
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black text-white leading-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                DIGITAL HEALING
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  EVOLVED
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Experience the next generation of therapeutic technology with AI personality adaptation, 
                gamified progress tracking, and viral community healing mechanics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up/enhanced">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-4"
                >
                  🚀 Start Enhanced Journey
                </Button>
              </Link>
              <Link href="/enhanced-features-demo">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-4"
                >
                  🎮 Try Interactive Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-gray-800/50 border border-gray-600">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
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

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            💳 TIER UPGRADES
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your level of digital healing. All tiers include the enhanced features, 
            with higher tiers unlocking exclusive capabilities.
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
                
                <Link href="/sign-up/enhanced">
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
              <Link href="/sign-up/enhanced">
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

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-black text-white mb-4">CTRL+ALT+BLOCK™</div>
              <p className="text-gray-400">
                Next-generation digital healing platform with enhanced AI therapy, 
                gamified progress tracking, and viral community mechanics.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Enhanced Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/enhanced-features-demo" className="hover:text-white">Interactive Demo</Link></li>
                <li><Link href="/dashboard/enhanced" className="hover:text-white">Enhanced Dashboard</Link></li>
                <li><Link href="/ai-therapy-demo" className="hover:text-white">AI Therapy</Link></li>
                <li><Link href="/wall" className="hover:text-white">Community Wall</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/wall" className="hover:text-white">Wall of Wounds</Link></li>
                <li><Link href="/achievements" className="hover:text-white">Achievements</Link></li>
                <li><Link href="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CTRL+ALT+BLOCK™. All rights reserved. Enhanced healing technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
