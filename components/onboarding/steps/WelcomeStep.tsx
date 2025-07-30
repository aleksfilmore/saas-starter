'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Users, Star } from 'lucide-react';

interface WelcomeStepProps {
  onNext: (data: any) => void;
  isLoading: boolean;
}

export function WelcomeStep({ onNext, isLoading }: WelcomeStepProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
          REFORMAT
        </div>
        <div className="text-2xl font-mono text-gray-300">
          PROTOCOL™
        </div>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A systematic approach to heartbreak recovery through gamified healing rituals, 
          AI-powered tools, and community support.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Gamified Progress</h3>
          </div>
          <p className="text-gray-400">
            Track your healing journey with XP points, levels, badges, and streak counters. 
            Turn recovery into an engaging RPG experience.
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Star className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI-Powered Tools</h3>
          </div>
          <p className="text-gray-400">
            Access closure simulators, letter generators, and reframing tools. 
            Get personalized support when you need it most.
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Anonymous Community</h3>
          </div>
          <p className="text-gray-400">
            Share your struggles and victories on the Wall of Wounds. 
            Connect with others without compromising privacy.
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Scientifically Grounded</h3>
          </div>
          <p className="text-gray-400">
            Based on attachment theory, CBT, and evidence-based healing practices. 
            Real psychology wrapped in engaging gamification.
          </p>
        </div>
      </div>

      {/* Process Overview */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">What to Expect</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-gray-300">Complete psychological assessments to personalize your experience</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-gray-300">Choose your digital identity and avatar</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-gray-300">Select your recovery program and ritual preferences</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <span className="text-gray-300">Begin your journey with personalized daily rituals</span>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
        <h4 className="text-blue-400 font-semibold mb-2">Privacy & Anonymity</h4>
        <p className="text-blue-200 text-sm">
          Your real identity is never shared. All community interactions use your chosen codename. 
          You control what information is visible and can participate completely anonymously.
        </p>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={() => onNext({ welcomed: true })}
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
        >
          {isLoading ? 'Initializing...' : 'Begin REFORMAT PROTOCOL™'}
        </Button>
        <p className="text-gray-500 text-sm mt-2">
          Takes about 10 minutes • Cancel anytime
        </p>
      </div>
    </div>
  );
}
