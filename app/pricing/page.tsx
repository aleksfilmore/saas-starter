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
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Choose Your Healing Protocol
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start your recovery journey with our research-backed attachment therapy platform. 
              All plans include anonymous support and personalized healing paths.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Free Plan */}
            <Card className="bg-gray-800/50 border border-gray-600/50 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Free Protocol</CardTitle>
                <div className="text-4xl font-black text-white mb-2">$0</div>
                <p className="text-gray-400">Perfect to start your journey</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic daily rituals
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    No-contact tracker
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Anonymous community
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic progress tracking
                  </li>
                </ul>
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white" asChild>
                  <Link href="/sign-up">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 backdrop-blur-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  MOST POPULAR
                </div>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-bold text-white">Pro Protocol</CardTitle>
                <div className="text-4xl font-black text-white mb-2">$19</div>
                <p className="text-gray-400">Per month • Advanced healing tools</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Free
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    AI therapy sessions (unlimited)
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Personalized ritual plans
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" asChild>
                  <Link href="/sign-up">Start Pro Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Elite Plan */}
            <Card className="bg-gray-800/50 border border-gray-600/50 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  Elite Protocol
                  <Shield className="h-6 w-6 text-yellow-400 ml-2" />
                </CardTitle>
                <div className="text-4xl font-black text-white mb-2">$49</div>
                <p className="text-gray-400">Per month • Maximum support</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    1-on-1 coaching sessions
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Custom healing protocols
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Crisis intervention access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Direct therapist chat
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white" asChild>
                  <Link href="/sign-up">Start Elite Trial</Link>
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Features Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              All Plans Include Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">100% Anonymous</h3>
                <p className="text-gray-400">No real names, complete privacy protection</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Science-Backed</h3>
                <p className="text-gray-400">Research-based attachment therapy methods</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
                <p className="text-gray-400">Always-available community and resources</p>
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
