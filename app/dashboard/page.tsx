'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Calendar, Heart, Target, BookOpen, Phone, AlertTriangle, 
         Settings, User, LogOut, Home, MessageSquare, Zap, Coins, 
         Flame, Star, ChevronRight, Shield, Play, Pause, BarChart3,
         Clock, Award, Sparkles, Menu, X } from 'lucide-react';
import { PrescribedRitual, getRandomRitual, getCategoryColor, getCategoryIcon } from '../../lib/prescribed-rituals';

interface UserStats {
  codename: string;
  level: number;
  xp: number;
  nextLevelXP: number;
  progressToNext: number;
  bytes: number;
  streak: number;
  longestStreak: number;
  phase: string;
  ritualsCompleted: number;
  wallPosts: number;
  badgesEarned: number;
  avatar: string;
  heartState?: string;
  urgencyLevel?: 'immediate' | 'high' | 'moderate' | 'stable';
  lastActive: string;
  joinDate: string;
  noContactDays: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserStats>({
    codename: 'SHADOW_HEALER_42',
    level: 7,
    xp: 2450,
    nextLevelXP: 3000,
    progressToNext: 81.7,
    bytes: 156,
    streak: 12,
    longestStreak: 28,
    phase: 'firewall_active',
    ritualsCompleted: 34,
    wallPosts: 8,
    badgesEarned: 5,
    avatar: '🔥',
    heartState: 'STABLE_PROCESSING',
    urgencyLevel: 'stable',
    lastActive: '2 hours ago',
    joinDate: 'July 15, 2025',
    noContactDays: 47
  });

  const [todaysRituals, setTodaysRituals] = useState<PrescribedRitual[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);

  useEffect(() => {
    // Generate today's personalized rituals based on user's phase and progress
    const personalizedRituals = generateDailyRituals(user);
    setTodaysRituals(personalizedRituals);

    // Check if user needs crisis support
    if (user.urgencyLevel === 'immediate' || user.heartState?.includes('CRISIS')) {
      setShowCrisisSupport(true);
    }
  }, [user]);

  const generateDailyRituals = (userStats: UserStats): PrescribedRitual[] => {
    // AI-weighted ritual selection based on user phase and streak
    const rituals: PrescribedRitual[] = [];
    
    // Morning ritual - always include one for routine
    rituals.push(getRandomRitual());
    
    // Midday ritual - based on current phase
    if (userStats.phase === 'kernel_wounded') {
      rituals.push(getRandomRitual());
    } else if (userStats.phase === 'firewall_active') {
      rituals.push(getRandomRitual());
    } else {
      rituals.push(getRandomRitual());
    }
    
    // Evening ritual - for healing and closure
    rituals.push(getRandomRitual());
    
    return rituals;
  };

  const handleEmergencyCall = () => {
    window.open('tel:988', '_self');
  };

  const handleEmergencyText = () => {
    window.open('sms:741741', '_self');
  };

  const navigateToSection = (section: string) => {
    window.location.href = `/${section}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Crisis Support Banner - High Priority */}
      {showCrisisSupport && (
        <div className="bg-red-900/30 border-b border-red-500/30 p-4">
          <div className="max-w-7xl mx-auto flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-200 mb-2">
                24/7 Crisis Support Available
              </h3>
              <p className="text-red-100 mb-3 text-sm">
                If you're experiencing thoughts of self-harm or suicide, please reach out immediately. 
                You are not alone, and help is available.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleEmergencyCall}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 988 - Crisis Lifeline</span>
                </button>
                <button
                  onClick={handleEmergencyText}
                  className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Text HOME to 741741</span>
                </button>
                <button
                  onClick={() => setShowCrisisSupport(false)}
                  className="text-red-300 hover:text-white transition-colors text-sm underline"
                >
                  I'm safe right now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                CTRL+ALT+BLOCK™
              </h1>
              <span className="text-purple-300 text-sm">Healing Console</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <Link href="/no-contact" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors">
                <Shield className="w-4 h-4" />
                <span>No-Contact</span>
              </Link>
              <Link href="/daily-rituals" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Daily Rituals</span>
              </Link>
              <Link href="/wall" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Wall of Wounds</span>
              </Link>
              <Link href="/ai-therapy" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>AI Therapy</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Coins className="w-4 h-4" />
                  <span>{user.bytes}</span>
                </div>
                <div className="flex items-center space-x-1 text-orange-400">
                  <Flame className="w-4 h-4" />
                  <span>{user.streak}</span>
                </div>
              </div>
              <Bell className="w-5 h-5 text-purple-300 hover:text-white cursor-pointer transition-colors" />
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-lg">
                {user.avatar}
              </div>
              <button 
                className="md:hidden text-purple-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-purple-500/20 py-4">
              <nav className="flex flex-col space-y-3">
                <Link href="/no-contact" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors py-2">
                  <Shield className="w-4 h-4" />
                  <span>No-Contact</span>
                </Link>
                <Link href="/daily-rituals" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors py-2">
                  <Calendar className="w-4 h-4" />
                  <span>Daily Rituals</span>
                </Link>
                <Link href="/wall" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors py-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Wall of Wounds</span>
                </Link>
                <Link href="/ai-therapy" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors py-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Therapy</span>
                </Link>
                <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Coins className="w-4 h-4" />
                      <span>{user.bytes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span>{user.streak}</span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with User Stats */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl mr-4">
              {user.avatar}
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user.codename}
              </h1>
              <p className="text-purple-200">
                Level {user.level} • {user.phase.replace('_', ' ').toUpperCase()} Phase
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* XP Progress */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-purple-200 text-sm">Level Progress</p>
                <p className="text-2xl font-bold text-white">{Math.round(user.progressToNext)}%</p>
              </div>
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${user.progressToNext}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{user.xp.toLocaleString()} / {user.nextLevelXP.toLocaleString()} XP</p>
          </div>

          {/* Streak */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-orange-400">{user.streak} days</p>
              </div>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Best: {user.longestStreak} days</p>
          </div>

          {/* Bytes Currency */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Bytes Earned</p>
                <p className="text-2xl font-bold text-yellow-400">{user.bytes}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Virtual currency</p>
          </div>

          {/* Achievements */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Badges</p>
                <p className="text-2xl font-bold text-pink-400">{user.badgesEarned}</p>
              </div>
              <Award className="w-8 h-8 text-pink-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Achievements unlocked</p>
          </div>
        </div>

        {/* Today's Personalized Rituals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Today's Healing Protocol</h2>
            <Link href="/daily-rituals" className="text-purple-300 hover:text-white transition-colors flex items-center space-x-1">
              <span className="text-sm">View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {todaysRituals.map((ritual, index) => (
              <div 
                key={ritual.key}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${getCategoryColor(ritual.category)}`}>
                    {getCategoryIcon(ritual.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {ritual.title}
                    </h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {ritual.category.replace('_', ' ')} • Intensity {ritual.intensity}/5
                    </p>
                  </div>
                </div>
                <p className="text-purple-200 text-sm mb-4">
                  {ritual.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {index === 0 ? 'Morning' : index === 1 ? 'Midday' : 'Evening'}
                  </span>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Start Ritual
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid - THE 5-CARD VERSION WITH NO-CONTACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          {/* No-Contact Tracker */}
          <Link href="/no-contact" className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">No-Contact</h3>
                <p className="text-xs text-gray-400">{user.noContactDays} days strong</p>
              </div>
            </div>
            <p className="text-purple-200 mb-4 text-xs">
              Track your no-contact journey. Build strength and reclaim your power.
            </p>
            <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-semibold text-center text-sm group-hover:from-blue-700 group-hover:to-cyan-700 transition-all">
              Track Progress
            </div>
          </Link>

          {/* Daily Rituals */}
          <Link href="/daily-rituals" className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Daily Rituals</h3>
                <p className="text-xs text-gray-400">Today's healing protocol</p>
              </div>
            </div>
            <p className="text-purple-200 mb-4 text-xs">
              Personalized daily healing rituals based on your emotional state.
            </p>
            <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold text-center text-sm group-hover:from-purple-700 group-hover:to-pink-700 transition-all">
              View Rituals
            </div>
          </Link>

          {/* AI Therapy Session */}
          <Link href="/ai-therapy" className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-green-500/20 hover:border-green-400/40 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Therapy</h3>
                <p className="text-xs text-gray-400">25 Bytes per session</p>
              </div>
            </div>
            <p className="text-purple-200 mb-4 text-xs">
              Connect with your AI therapeutic companion for personalized guidance.
            </p>
            <div className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg font-semibold text-center text-sm group-hover:from-green-700 group-hover:to-teal-700 transition-all">
              Start Session
            </div>
          </Link>

          {/* Wall of Wounds */}
          <Link href="/wall" className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Wall of Wounds</h3>
                <p className="text-xs text-gray-400">{user.wallPosts} posts shared</p>
              </div>
            </div>
            <p className="text-purple-200 mb-4 text-xs">
              Share your journey anonymously with the community.
            </p>
            <div className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-lg font-semibold text-center text-sm group-hover:from-orange-700 group-hover:to-red-700 transition-all">
              Visit Wall
            </div>
          </Link>

          {/* Progress Analytics */}
          <Link href="/status" className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-yellow-500/20 hover:border-yellow-400/40 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Your Progress</h3>
                <p className="text-xs text-gray-400">{user.ritualsCompleted} rituals completed</p>
              </div>
            </div>
            <p className="text-purple-200 mb-4 text-xs">
              Visualize your healing journey with detailed analytics.
            </p>
            <div className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-2 px-4 rounded-lg font-semibold text-center text-sm group-hover:from-yellow-700 group-hover:to-orange-700 transition-all">
              View Analytics
            </div>
          </Link>
        </div>

        {/* Quick Check-ins */}
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-purple-500/10">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-purple-200 text-center text-sm">
              <Heart className="w-6 h-6 mx-auto mb-2" />
              Mood Check-in
            </button>
            <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-purple-200 text-center text-sm">
              <BookOpen className="w-6 h-6 mx-auto mb-2" />
              Gratitude Journal
            </button>
            <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-purple-200 text-center text-sm">
              <Clock className="w-6 h-6 mx-auto mb-2" />
              Breathing Exercise
            </button>
            <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-purple-200 text-center text-sm">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              Mindfulness Moment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}