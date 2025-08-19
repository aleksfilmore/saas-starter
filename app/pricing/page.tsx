"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
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

export default function PricingPage() {
  return (
    <div className="brand-container">
      <FloatingParticles />
      {/* Header */}
      <header className="relative z-10 w-full border-b border-brand-primary/30 bg-brand-dark/60 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white brand-glitch">
              <span>CTRL</span>
              <span className="text-brand-light">+</span>
              <span>ALT</span>
              <span className="text-brand-light">+</span>
              <span className="brand-text-gradient">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="text-brand-primary hover:text-brand-secondary brand-glow">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-brand-primary">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 brand-glow">
              Choose Your <span className="brand-text-gradient brand-glitch">Protection</span>
            </h1>
            <p className="text-xl text-brand-light max-w-3xl mx-auto">
              Whether you need basic boundaries or full defensive protocols, we have the right plan for your healing journey.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Ghost Mode */}
            <Card className="card-brand relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Zap className="h-6 w-6 text-brand-light" />
              </div>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white brand-glow">Ghost Mode</CardTitle>
                <div className="text-5xl font-black text-white mb-2 brand-glow">Free</div>
                <p className="text-brand-light">Always free • Essential healing toolkit</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    1 daily ritual from free pool
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic no-contact tracker (24h shield)
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Wall of Wounds: read + react only
                  </li>
                  <li className="flex items-center text-gray-500">
                    <Shield className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="line-through">AI Therapy Chat</span>
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic progress tracking
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Crisis support resources
                  </li>
                </ul>
                <Link 
                  href="/sign-up"
                  className="btn-brand-secondary w-full"
                >
                  Start Free
                </Link>
              </CardContent>
            </Card>

            {/* Firewall Mode */}
            <Card className="card-brand border-brand-primary/50 relative overflow-hidden neon-border">
              <div className="absolute -top-1 -right-1 p-2">
                <div className="bg-brand-gradient text-white px-4 py-1 rounded-full text-sm font-bold flex items-center neon-border">
                  <Star className="h-4 w-4 mr-1" />
                  MOST POPULAR
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Shield className="h-6 w-6 text-brand-primary brand-glow" />
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl font-bold text-white brand-glow">Firewall Mode</CardTitle>
                <div className="text-5xl font-black text-white mb-2 brand-glow">$3.99</div>
                <p className="text-brand-light">Per month • Complete protection suite</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Ghost Mode
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    2 personalized daily rituals + reroll
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Enhanced no-contact tracker (48h + auto-shield)
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Wall of Wounds: read + react + post
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-brand-primary mr-3" />
                    <strong>AI Therapy Chat: 300 messages/month</strong>
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Advanced pattern analysis & insights
                  </li>
                </ul>
                <Link 
                  href="/sign-up"
                  className="btn-brand-primary w-full"
                >
                  Start Firewall Mode
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Comparison */}
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Compare Features
            </h2>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-4 text-white font-semibold">Feature</th>
                    <th className="text-center py-4 text-white font-semibold">Ghost Mode</th>
                    <th className="text-center py-4 text-white font-semibold">Firewall Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  <tr>
                    <td className="py-4 text-gray-300">Daily healing rituals</td>
                    <td className="text-center py-4 text-gray-500">1 ritual/day</td>
                    <td className="text-center py-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">No-contact tracker</td>
                    <td className="text-center py-4 text-gray-500">24h shield</td>
                    <td className="text-center py-4 text-gray-300">48h + auto-shield</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">AI chat messages</td>
                    <td className="text-center py-4 text-gray-500">5/day</td>
                    <td className="text-center py-4 text-gray-300">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Wall of Wounds posting</td>
                    <td className="text-center py-4 text-gray-500">—</td>
                    <td className="text-center py-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Ritual rerolls</td>
                    <td className="text-center py-4 text-gray-500">—</td>
                    <td className="text-center py-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Advanced analytics</td>
                    <td className="text-center py-4 text-gray-500">—</td>
                    <td className="text-center py-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Can I switch between plans?</h3>
                <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">What's included for free users?</h3>
                <p className="text-gray-300">Ghost Mode users get access to basic healing rituals, no-contact tracking, community features, and progress tracking completely free.</p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Is my data secure?</h3>
                <p className="text-gray-300">Absolutely. All data is encrypted end-to-end, and we never share personal information with third parties.</p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Can I cancel anytime?</h3>
                <p className="text-gray-300">Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <div className="card-brand border-brand-primary/30 p-8 max-w-2xl mx-auto neon-border">
              <h2 className="text-3xl font-bold text-white mb-4 brand-glow">
                Ready to Break the Cycle?
              </h2>
              <p className="text-brand-light mb-6">
                Join thousands of people already healing their attachment patterns with CTRL+ALT+BLOCK
              </p>
              <Link 
                href="/sign-up"
                className="btn-brand-primary text-lg px-8 py-3"
              >
                Start Your Journey Today
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
