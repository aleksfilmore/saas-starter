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
  ChevronUp, Quote, Gamepad2, CheckCircle
} from 'lucide-react';

export default function HomePage() {
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
                <Badge className="bg-purple-600/80 text-white border-purple-400/50 text-xs">
                  ADMIN
                </Badge>
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

        <div className="px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              The Future of Heartbreak Recovery
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Obsessing</span><br />
              Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Healing</span>
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
                Free for 7 days
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

        <div className="bg-gradient-to-b from-gray-900 to-purple-900/30 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Healing Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
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
              
              <p className="text-sm text-gray-400">Start free. Upgrade anytime.</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
