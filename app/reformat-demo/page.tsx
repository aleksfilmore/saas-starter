'use client';

import React, { useState } from 'react';
import { GlowUpConsole } from '@/components/dashboard/GlowUpConsole';
import { AdaptiveDashboard } from '@/components/dashboard/AdaptiveDashboard';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

// Mock user data for demonstration
const mockUserStats = {
  level: 15,
  xp: 2350,
  nextLevelXP: 2500,
  progressToNext: 75,
  bytes: 485,
  streak: 23,
  longestStreak: 31,
  phase: 'firewall_active',
  ritualsCompleted: 47,
  wallPosts: 12,
  badgesEarned: 8,
  codename: 'GHOST_PROTOCOL',
  avatar: '👻'
};

// Beginner user to show simplified interface
const mockBeginnerStats = {
  level: 3,
  xp: 180,
  nextLevelXP: 300,
  progressToNext: 60,
  bytes: 125,
  streak: 5,
  longestStreak: 5,
  phase: 'kernel_wounded',
  ritualsCompleted: 8,
  wallPosts: 1,
  badgesEarned: 2,
  codename: 'BYTE_HEAL',
  avatar: '🌱'
};

export default function ReformatDemoPage() {
  const [currentView, setCurrentView] = useState<'onboarding' | 'console' | 'adaptive'>('adaptive');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userType, setUserType] = useState<'beginner' | 'experienced'>('experienced');

  const handleNavigation = (section: string) => {
    console.log('Navigating to:', section);
    // In full implementation, this would route to actual sections
    alert(`Navigation to ${section} - Feature in development!`);
  };

  const startOnboarding = () => {
    setCurrentView('onboarding');
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    setCurrentView('adaptive');
    setShowOnboarding(false);
    alert('Onboarding completed! Welcome to REFORMAT PROTOCOL™');
  };

  if (currentView === 'onboarding') {
    return (
      <OnboardingFlow
        userId="demo-user-123"
        onComplete={completeOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          REFORMAT PROTOCOL™ - Interactive Demo
        </h1>
        <p className="text-gray-300 mb-4">
          Experience the future of heartbreak recovery
        </p>
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={startOnboarding}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Onboarding Flow
          </button>
          <button
            onClick={() => setCurrentView('adaptive')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Adaptive Dashboard
          </button>
          <button
            onClick={() => setCurrentView('console')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Original Console
          </button>
        </div>
        
        {/* User Type Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setUserType('beginner')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                userType === 'beginner'
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Beginner User (Level 3)
            </button>
            <button
              onClick={() => setUserType('experienced')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                userType === 'experienced'
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Experienced User (Level 15)
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      {currentView === 'adaptive' && (
        <AdaptiveDashboard
          userStats={userType === 'beginner' ? mockBeginnerStats : mockUserStats}
          onNavigate={handleNavigation}
        />
      )}
      
      {currentView === 'console' && (
        <GlowUpConsole
          userStats={userType === 'beginner' ? mockBeginnerStats : mockUserStats}
          onNavigate={handleNavigation}
        />
      )}

      {/* Demo Footer */}
      <div className="bg-gray-900 border-t border-gray-800 p-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">
            Key Features Demonstrated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Gamified Progress</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• XP rings showing level progression</li>
                <li>• Byte currency for AI tools</li>
                <li>• No-contact streak tracking</li>
                <li>• Phase-based status system</li>
                <li>• Badge and achievement system</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Comprehensive Onboarding</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Codename generation system</li>
                <li>• Avatar selection interface</li>
                <li>• Attachment style assessment</li>
                <li>• Distress level evaluation</li>
                <li>• Program customization</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">Platform Features</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Daily ritual system</li>
                <li>• Wall of Wounds community</li>
                <li>• AI-powered healing tools</li>
                <li>• Streak shield protection</li>
                <li>• Anonymous interaction</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              This demo showcases the core REFORMAT PROTOCOL™ experience. 
              Full implementation includes database integration, AI tools, subscription management, and complete community features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
