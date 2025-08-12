"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="text-purple-400 hover:text-purple-300">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Choose Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Protection</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you need basic boundaries or full defensive protocols, we have the right plan for your healing journey.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Ghost Mode */}
            <Card className="bg-gray-800/80 border-gray-600/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Zap className="h-6 w-6 text-gray-400" />
              </div>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">Ghost Mode</CardTitle>
                <div className="text-5xl font-black text-white mb-2">Free</div>
                <p className="text-gray-400">Always free • Essential healing toolkit</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    1 daily ritual from free pool
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic no-contact tracker (24h shield)
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Wall of Wounds: read + react only
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    AI chat: 5 free messages/day
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic progress tracking
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Crisis support resources
                  </li>
                </ul>
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white" asChild>
                  <Link href="/sign-up">Start Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Firewall Mode */}
            <Card className="bg-gradient-to-br from-gray-800/80 to-purple-900/80 border-purple-500/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -top-1 -right-1 p-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  MOST POPULAR
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl font-bold text-white">Firewall Mode</CardTitle>
                <div className="text-5xl font-black text-white mb-2">$9.99</div>
                <p className="text-gray-400">Per month • Complete protection suite</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Ghost Mode
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    2 personalized daily rituals + reroll
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Enhanced no-contact tracker (48h + auto-shield)
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Wall of Wounds: read + react + post
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Unlimited AI chat with personas
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Advanced pattern analysis & insights
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" asChild>
                  <Link href="/sign-up">Start Firewall Mode</Link>
                </Button>
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
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Break the Cycle?
              </h2>
              <p className="text-gray-300 mb-6">
                Join thousands of people already healing their attachment patterns with CTRL+ALT+BLOCK
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg" asChild>
                <Link href="/sign-up">Start Your Journey Today</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
