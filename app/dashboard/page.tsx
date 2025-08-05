'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Calendar, Heart, Target, BookOpen, Phone, AlertTriangle, 
         Settings, User, LogOut, Home, MessageSquare, Zap, Coins, 
         Flame, Star, ChevronRight, Shield, Play, Pause, BarChart3,
         Clock, Award, Sparkles, Menu, X } from 'lucide-react';
import { PrescribedRitual, getRandomRitual, getCategoryColor, getCategoryIcon } from '../../lib/prescribed-rituals';
import { QuickActions } from '../../components/quick-actions';
import { CrisisSupport } from '../../components/crisis/CrisisSupport';
import { UserProfileManager } from '../../components/profile/UserProfileManager';
import { ProgressTracker } from '../../components/progress/ProgressTracker';
import { LiveActivityFeed } from '../../components/wall/LiveActivityFeed';

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('user-role');
    const userEmail = localStorage.getItem('user-email');
    
    if (userRole === 'admin' || userEmail === 'system_admin@ctrlaltblock.com') {
      setIsAdmin(true);
      // Update user for admin with special data
      setUser(prev => ({
        ...prev,
        codename: 'SYSTEM_ADMIN',
        level: 99,
        xp: 999999,
        nextLevelXP: 999999,
        progressToNext: 100,
        bytes: 999999,
        avatar: '⚡',
        phase: 'system_admin',
        heartState: 'ADMIN_ACCESS'
      }));
    }

    // Generate today's personalized rituals based on user's phase and progress
    const personalizedRituals = generateDailyRituals(user);
    setTodaysRituals(personalizedRituals);

    // Check if user needs crisis support
    if (user.urgencyLevel === 'immediate' || user.heartState?.includes('CRISIS')) {
      setShowCrisisSupport(true);
    }
  }, [user.urgencyLevel, user.heartState]);

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

  const handleQuickActionComplete = (action: string, data: any) => {
    // Handle different quick actions
    switch (action) {
      case 'mood-checkin':
        console.log('Mood check-in completed:', data);
        // Update user stats or send to backend
        setUser(prev => ({
          ...prev,
          xp: prev.xp + 10,
          bytes: prev.bytes + 5
        }));
        break;
      case 'gratitude-journal':
        console.log('Gratitude journal completed:', data);
        setUser(prev => ({
          ...prev,
          xp: prev.xp + (data.length * 15),
          bytes: prev.bytes + (data.length * 10)
        }));
        break;
      case 'breathing-exercise':
        console.log('Breathing exercise completed:', data);
        setUser(prev => ({
          ...prev,
          xp: prev.xp + 25,
          bytes: prev.bytes + 15
        }));
        break;
      case 'mindfulness-moment':
        console.log('Mindfulness moment completed:', data);
        setUser(prev => ({
          ...prev,
          xp: prev.xp + (data.duration * 10),
          bytes: prev.bytes + (data.duration * 5)
        }));
        break;
    }
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
              
              {/* New Advanced Components */}
              <div className="flex items-center space-x-2">
                <CrisisSupport 
                  isEmergency={user.urgencyLevel === 'immediate'} 
                  onResourceUsed={(resource) => console.log('Crisis resource used:', resource)}
                />
                <ProgressTracker 
                  onGoalUpdate={(goalId, progress) => console.log('Goal updated:', goalId, progress)}
                  onMilestoneAchieved={(milestoneId) => console.log('Milestone achieved:', milestoneId)}
                />
                <UserProfileManager 
                  onProfileUpdate={(profile) => console.log('Profile updated:', profile)}
                />
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

        {/* Admin Panel - Only visible to admins */}
        {isAdmin && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-lg p-6 border border-red-500/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-600 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">⚡ System Administrator Panel</h2>
                  <p className="text-red-300">Full platform access & debugging tools</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/api/users" target="_blank" className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 hover:bg-red-600/30 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">User Database</span>
                  </div>
                  <p className="text-red-200 text-sm">View all registered users</p>
                </Link>

                <Link href="/wall" className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4 hover:bg-orange-600/30 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-medium">Wall of Wounds</span>
                  </div>
                  <p className="text-orange-200 text-sm">Community feed & posts</p>
                </Link>

                <Link href="/ai-therapy" className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 hover:bg-green-600/30 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">AI Therapy</span>
                  </div>
                  <p className="text-green-200 text-sm">Full AI therapy access</p>
                </Link>

                <Link href="/no-contact" className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 hover:bg-blue-600/30 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">No-Contact</span>
                  </div>
                  <p className="text-blue-200 text-sm">Tracking & support tools</p>
                </Link>

                <Link href="/daily-rituals" className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 hover:bg-purple-600/30 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Daily Rituals</span>
                  </div>
                  <p className="text-purple-200 text-sm">Healing protocols</p>
                </Link>

                <Link href="/quiz" className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-4 hover:bg-cyan-600/30 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-medium">System Scan</span>
                  </div>
                  <p className="text-cyan-200 text-sm">Attachment assessment</p>
                </Link>

                <Link href="/status" className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 hover:bg-yellow-600/30 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">Analytics</span>
                  </div>
                  <p className="text-yellow-200 text-sm">Platform metrics</p>
                </Link>

                {/* Removed old Auth Server button */}
              </div>

              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Admin Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Email: </span>
                    <span className="text-white font-mono">admin@ctrlaltblock.com</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Password: </span>
                    <span className="text-white font-mono">Admin123!@#</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Role: </span>
                    <span className="text-red-400 font-semibold">System Administrator</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Access: </span>
                    <span className="text-green-400 font-semibold">Full Platform</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Quick Actions - Fully Functional */}
        <QuickActions onActionComplete={handleQuickActionComplete} />

        {/* Live Community Feed */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Community Activity</h2>
            <Link href="/wall" className="text-purple-300 hover:text-white transition-colors flex items-center space-x-1">
              <span className="text-sm">Visit Wall</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <LiveActivityFeed />
        </div>

        {/* Support Resources Footer */}
        <div className="mt-12 pt-8 border-t border-purple-500/20">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-white">Remember, Warrior</h3>
            <p className="text-purple-200 max-w-2xl mx-auto">
              Your healing journey is unique and valid. Every day you're here is a victory. 
              You have the strength to overcome anything, and this community believes in you.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-green-400">
                <Heart className="w-4 h-4" />
                <span>You matter</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-400">
                <Shield className="w-4 h-4" />
                <span>You're protected</span>
              </div>
              <div className="flex items-center space-x-1 text-purple-400">
                <Star className="w-4 h-4" />
                <span>You're valued</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}