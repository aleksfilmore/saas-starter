"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

      {/* Main Content */}
      <div className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 brand-glow">
              Choose Your <span className="brand-text-gradient brand-glitch">Healing Plan</span>
            </h1>
            <p className="text-xl text-brand-light max-w-3xl mx-auto">
              Whether you need basic support or comprehensive AI therapy, we have the right plan for your healing journey.
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
                    1 Daily healing ritual
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    No-contact tracker
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Daily check-ins & journaling
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Read Wall of Wounds posts
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Customer support via LUMO
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
                  href="/quiz"
                  className="btn-brand-secondary w-full"
                >
                  Start Healing Journey
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
                <div className="text-5xl font-black text-white mb-2 brand-glow">$9.99</div>
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
                    2 Personalized daily healing rituals
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Unlimited AI therapy chat
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Post on Wall of Wounds
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Advanced progress tracking
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Unlock exclusive badges & features
                  </li>
                  <li className="flex items-center text-brand-light">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Priority customer support
                  </li>
                </ul>
                <Link 
                  href="/quiz"
                  className="btn-brand-primary w-full"
                >
                  Start Healing Journey
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
                    <td className="text-center py-4 text-gray-300">2 personalized rituals/day</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">No-contact tracker</td>
                    <td className="text-center py-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                    <td className="text-center py-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">AI therapy chat</td>
                    <td className="text-center py-4 text-gray-500">—</td>
                    <td className="text-center py-4 text-gray-300">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Wall of Wounds posting</td>
                    <td className="text-center py-4 text-gray-500">Read only</td>
                    <td className="text-center py-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Customer support</td>
                    <td className="text-center py-4 text-gray-300">LUMO support</td>
                    <td className="text-center py-4 text-gray-300">Priority LUMO support</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Badges & exclusive features</td>
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
                Ready to Start Your Healing Journey?
              </h2>
              <p className="text-brand-light mb-6">
                Join thousands of people already healing their attachment patterns with CTRL+ALT+BLOCK
              </p>
              <Link 
                href="/quiz"
                className="btn-brand-primary text-lg px-8 py-3"
              >
                Start Healing Journey
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
