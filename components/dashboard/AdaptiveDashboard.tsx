"use client";

import { useState, useEffect } from 'react';
import { User } from 'lucia';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useAuth } from '@/contexts/AuthContext';
import { useHealingHub } from '@/contexts/HealingHubContext';
import { BadgeCollection } from '@/components/badges/BadgeCollection';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Heart, 
  Shield, 
  Zap, 
  RefreshCw, 
  Play, 
  MessageSquare,
  Mic,
  Crown,
  Settings,
  User as UserIcon,
  Flame,
  Target,
  Calendar,
  TrendingUp,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  Lock,
  Coins,
  Star,
  Eye,
  Wind,
  AlertTriangle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { BreathingExercise } from '@/components/quick-actions/BreathingExercise';
import { LumoProvider } from '@/components/lumo/LumoProvider';
import Lumo from '@/components/lumo/LumoBubble';
import SmartLumo from '@/components/lumo/SmartLumo';
import { LumoOnboarding, useLumoOnboarding } from '@/components/onboarding/LumoOnboarding';
import { RitualModal } from '@/components/dashboard/modals/RitualModal';
import { CheckInModal } from '@/components/dashboard/modals/CheckInModal';
import AITherapyModal from '@/components/dashboard/modals/AITherapyModal';
import { AITherapyPurchaseModal } from '@/components/dashboard/modals/AITherapyPurchaseModal';
import { NoContactModal } from '@/components/dashboard/modals/NoContactModal';
import { UpgradeModal } from './modals/UpgradeModal';
import { VoiceTherapyModal } from './modals/VoiceTherapyModal';
import { NotificationDisplay } from '@/components/notifications/NotificationDisplay';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface Props {
  user: User;
}

const EMOJI_TAGS = [
  { emoji: '💔', label: 'Heartbreak', category: 'heartbreak', color: 'from-red-500 to-pink-600', border: 'border-red-500/50', bg: 'bg-red-500/10' },
  { emoji: '😢', label: 'Sadness', category: 'sadness', color: 'from-blue-500 to-indigo-600', border: 'border-blue-500/50', bg: 'bg-blue-500/10' },
  { emoji: '😤', label: 'Anger', category: 'anger', color: 'from-orange-500 to-red-600', border: 'border-orange-500/50', bg: 'bg-orange-500/10' },
  { emoji: '😰', label: 'Anxiety', category: 'anxiety', color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500/50', bg: 'bg-yellow-500/10' },
  { emoji: '🔥', label: 'Rage', category: 'rage', color: 'from-red-600 to-red-700', border: 'border-red-600/50', bg: 'bg-red-600/10' },
  { emoji: '💭', label: 'Confusion', category: 'confusion', color: 'from-purple-500 to-violet-600', border: 'border-purple-500/50', bg: 'bg-purple-500/10' },
  { emoji: '🌟', label: 'Hope', category: 'hope', color: 'from-green-500 to-emerald-600', border: 'border-green-500/50', bg: 'bg-green-500/10' },
  { emoji: '⚡', label: 'Breakthrough', category: 'breakthrough', color: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/50', bg: 'bg-cyan-500/10' },
  { emoji: '🎭', label: 'Identity', category: 'identity', color: 'from-pink-500 to-purple-600', border: 'border-pink-500/50', bg: 'bg-pink-500/10' },
  { emoji: '🔮', label: 'Future', category: 'future', color: 'from-indigo-500 to-purple-600', border: 'border-indigo-500/50', bg: 'bg-indigo-500/10' }
];

const AI_PERSONAS = [
  { 
    id: 'supportive-guide', 
    name: 'Supportive Guide', 
    icon: '🌟', 
    description: 'Gentle, encouraging companion',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/40',
    accent: 'text-pink-400'
  },
  { 
    id: 'strategic-analyst', 
    name: 'Strategic Analyst', 
    icon: '🧠', 
    description: 'Data-driven insights & patterns',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/40', 
    accent: 'text-blue-400'
  },
  { 
    id: 'emotional-healer', 
    name: 'Emotional Healer', 
    icon: '💝', 
    description: 'Deep emotional understanding',
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/40',
    accent: 'text-purple-400'
  }
];

function AdaptiveDashboard({ user }: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('supportive-guide');
  const [customInsight, setCustomInsight] = useState<string>('');
  const [noContactEncouragement, setNoContactEncouragement] = useState<string>('');
  const [wallPostContent, setWallPostContent] = useState<string>(''); // Add state for wall post
  const [selectedTag, setSelectedTag] = useState<typeof EMOJI_TAGS[0] | null>(null); // Add emotion tag state
  const [showTagDropdown, setShowTagDropdown] = useState(false); // Add dropdown state
  const [posting, setPosting] = useState(false); // Add posting state
  const [optimisticReactions, setOptimisticReactions] = useState<Record<string, number>>({}); // Track optimistic reactions
  
  // Helper function to get emotion tag from category
  const getEmotionTagFromCategory = (category: string) => {
    return EMOJI_TAGS.find(tag => tag.category === category) || EMOJI_TAGS[0];
  };

  const { tasks, markTask, progressFraction } = useDailyTasks();
  const { user: authUser } = useAuth();
  const { 
    hubLoading, 
    streaks, 
    ritual, 
    dailyInsight, 
    wallPosts, 
    completeRitual, 
    rerollRitual, 
    rerollCooldownHoursLeft,
    noContact,
    refresh
  } = useHealingHub();

  // Lumo onboarding integration
  const { 
    showLumo: showOnboarding, 
    isFirstTimeUser, 
    dismissLumo: dismissOnboarding, 
    startNoContact: navigateToNoContact, 
    viewRituals: scrollToRituals,
    openChat: openLumoChat
  } = useLumoOnboarding();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTagDropdown) {
        setShowTagDropdown(false);
      }
    };

    if (showTagDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showTagDropdown]);

  // Fetch custom daily insight and no-contact encouragement
  useEffect(() => {
    const fetchInsightAndEncouragement = async () => {
      try {
        // Fetch daily insight
        const insightResponse = await fetch('/api/seed-insights');
        if (insightResponse.ok) {
          const insightData = await insightResponse.json();
          if (insightData.success && insightData.insight) {
            setCustomInsight(insightData.insight.text);
          }
        }

        // Fetch no-contact encouragement for current day
        const currentDay = noContact?.currentStreak || 0;
        if (currentDay > 0) {
          const encouragementResponse = await fetch(`/api/no-contact/message/${currentDay}`);
          if (encouragementResponse.ok) {
            const encouragementData = await encouragementResponse.json();
            if (encouragementData.success && encouragementData.message) {
              setNoContactEncouragement(encouragementData.message.body);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch insight/encouragement:', error);
      }
    };

    fetchInsightAndEncouragement();
  }, [noContact?.currentStreak]);

  const isPremium = authUser?.subscriptionTier === 'premium' || 
                     (user as any)?.subscription_tier === 'premium' || 
                     (user as any)?.tier === 'firewall' ||
                     (user as any)?.ritual_tier === 'firewall';
                     
  // Debug log to track tier detection
  console.log('🔍 Tier Detection:', {
    authUserSubTier: authUser?.subscriptionTier,
    userSubTier: (user as any)?.subscription_tier,
    userTier: (user as any)?.tier,
    userRitualTier: (user as any)?.ritual_tier,
    isPremium: isPremium,
    userEmail: (user as any)?.email
  });
  const canReroll = rerollCooldownHoursLeft === 0;
  const completedToday = Object.values(tasks).filter(Boolean).length;
  const totalTasks = Object.keys(tasks).length;

  // Handle sign out functionality
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear any local storage
        localStorage.clear();
        // Redirect to homepage
        window.location.href = '/';
      } else {
        console.error('Logout failed');
        alert('Failed to sign out. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  // Handle wall post submission with emotion tags
  const handleWallPost = async () => {
    if (!wallPostContent.trim() || !selectedTag) return;
    
    setPosting(true);
    
    try {
      const response = await fetch('/api/wall/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: wallPostContent.trim(),
          glitchCategory: selectedTag.category,
          glitchTitle: selectedTag.label,
          anonymous: true
        })
      });
      
      if (response.ok) {
        setWallPostContent('');
        setSelectedTag(null);
        markTask('community');
        // Refresh the healing hub data to show new post
        refresh();
      } else {
        console.error('Failed to post to wall');
      }
    } catch (error) {
      console.error('Failed to post to wall:', error);
    } finally {
      setPosting(false);
    }
  };

  // Handle optimistic wall post reactions with proper duplicate prevention
  const handleWallReaction = async (postId: string, reactionType: string = 'resonate') => {
    const currentPost = wallPosts.find(p => p.id === postId);
    if (!currentPost) return;

    const hasUserReacted = currentPost.userReaction === reactionType;
    
    // Optimistically update the reaction count
    setOptimisticReactions(prev => ({
      ...prev,
      [postId]: hasUserReacted ? -1 : 1 // Remove if already reacted, add if not
    }));

    try {
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          reactionType
        })
      });
      
      if (response.ok) {
        // Mark community task as completed
        markTask('community');
        
        // Refresh the healing hub data to get updated wall posts
        refresh();
      } else {
        // Revert optimistic update on failure
        setOptimisticReactions(prev => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1)
        }));
        
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to react to post:', errorData);
        alert('Failed to register your reaction. Please try again.');
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticReactions(prev => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 0) - 1)
      }));
      
      console.error('Failed to react to post:', error);
      alert('Failed to register your reaction. Please try again.');
    }
  };

  return (
    <LumoProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Floating Particles */}
        <div className="particle-system">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`particle ${
                ['particle-purple', 'particle-pink', 'particle-blue', 'particle-green'][i % 4]
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

      {/* Enhanced Header */}
      <header className="border-b border-purple-500/20 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            
            {/* Left side - Branding */}
            <div className="flex items-center">
              <div className="flex items-center gap-1 text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight">
                <span className="text-white">CTRL</span>
                <span className="text-gray-400">+</span>
                <span className="text-white">ALT</span>
                <span className="text-gray-400">+</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent brand-glitch" data-text="BLOCK">BLOCK</span>
                <span className="text-gray-400 mx-1 sm:mx-2">–</span>
                <span className="text-sm sm:text-base md:text-lg font-bold text-brand-glow">
                  Healing Hub
                </span>
              </div>
            </div>
            
            {/* Right side - Actions and User */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* User Tier Badge */}
              <div className="hidden md:flex">
                {isPremium ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    FIREWALL
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-gray-400 text-gray-300 px-2 sm:px-3 py-1 text-xs">
                    GHOST
                  </Badge>
                )}
              </div>
              
              {/* Breathing Exercise Button */}
              <BreathingExercise onComplete={(pattern, cycles) => {
                console.log(`Completed ${pattern.name} breathing exercise with ${cycles} cycles`);
              }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-teal-300 hover:text-teal-200 hover:bg-teal-500/10 flex items-center gap-1 text-xs p-2"
                >
                  <Wind className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden lg:inline">Breathing</span>
                </Button>
              </BreathingExercise>
              
              {/* Mindfulness Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal('mindfulness')}
                className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 flex items-center gap-1 text-xs p-2"
              >
                <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden lg:inline">Mindfulness</span>
              </Button>
              
              {/* Crisis Center Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/crisis-support'}
                className="text-red-300 hover:text-red-200 hover:bg-red-500/10 flex items-center gap-1 text-xs p-2"
              >
                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden lg:inline">Crisis</span>
              </Button>
              
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal('settings')}
                className="text-purple-300 hover:text-white flex items-center gap-1 text-xs p-2"
              >
                <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden lg:inline">Settings</span>
              </Button>
              
              {/* Notifications */}
              <NotificationDisplay className="hidden sm:block" />
              
              {/* User Avatar */}
              <UserAvatar 
                user={user} 
                size="md" 
                onProfileClick={() => setActiveModal('settings')}
              />
              
              {/* Sign Out Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-300 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1 text-xs p-2"
              >
                <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden lg:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Sidebar - Reorganized Layout */}
          <div className="xl:col-span-3 space-y-4">

            {/* Enhanced Today's Healing Journey with Prominent Mindset Goal */}
            <Card className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-400/40 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl font-bold">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  Today's Healing Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mindset Goal - More Prominent */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-yellow-300 mb-2">Mindset Goal</h4>
                      <blockquote className="text-xs sm:text-sm text-gray-200 leading-relaxed italic border-l-2 border-yellow-400/30 pl-2 sm:pl-3">
                        "{customInsight || dailyInsight || 'Your sensitivity isn\'t a flaw—it\'s a feature to be honored.'}"
                      </blockquote>
                    </div>
                  </div>
                </div>

                {/* Progress Display */}
                <div className="bg-black/20 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-white">{Math.round(progressFraction * 100)}%</span>
                    <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-400/50 text-xs sm:text-sm px-2 sm:px-3 py-1">
                      Activities
                    </Badge>
                  </div>
                  <Progress value={progressFraction * 100} className="h-2 sm:h-3 mb-3 sm:mb-4" />
                  <div className="space-y-2">
                    <TaskItem label="Daily Check-In" completed={tasks.checkIn} />
                    <TaskItem label="Track No-Contact" completed={tasks.noContact} />
                    <TaskItem label="Perform Healing Rituals" completed={tasks.ritual} />
                    <TaskItem label="Use the AI Therapy" completed={tasks.aiTherapy} premium={!isPremium} />
                    <TaskItem label="Like Wall posts to encourage others" completed={tasks.community} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Cards Row: Check-In, No-Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Daily Check-In - Improved Layout */}
              <Card className="bg-gradient-to-br from-blue-900/50 to-slate-800/50 border-blue-500/30">
                <CardContent className="pt-4 pb-4">
                  <div className="text-center space-y-2">
                    <MessageSquare className="h-6 w-6 mx-auto text-blue-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Check-In</h3>
                      <p className="text-xs text-blue-200">How are you?</p>
                    </div>
                    <Button 
                      onClick={() => setActiveModal('checkin')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-7"
                      disabled={tasks.checkIn}
                    >
                      {tasks.checkIn ? 'Done' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* No-Contact Streak - Improved Layout */}
              <Card 
                className="bg-gradient-to-br from-emerald-900/50 to-slate-800/50 border-emerald-500/30 cursor-pointer hover:border-emerald-400/50 transition-colors"
                onClick={() => setActiveModal('no-contact')}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="text-center space-y-2">
                    <Shield className="h-6 w-6 mx-auto text-emerald-400" />
                    <div>
                      <div className="text-lg font-bold text-white">{noContact?.currentStreak || 0}</div>
                      <div className="text-xs text-emerald-300">No Contact</div>
                    </div>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModal('no-contact');
                      }}
                      size="sm" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs h-7"
                    >
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upgrade Card - Separate Row for Non-Premium Users */}
            {!isPremium && (
              <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-slate-800/50">
                <CardContent className="pt-4 pb-4">
                  <div className="text-center space-y-2">
                    <Crown className="h-6 w-6 mx-auto text-yellow-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Firewall</h3>
                      <p className="text-xs text-yellow-200">Upgrade</p>
                    </div>
                    <Button 
                      onClick={() => setActiveModal('upgrade')}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold text-xs h-7"
                    >
                      Upgrade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Daily Encouragement for No-Contact (if exists) */}
            {noContactEncouragement && (
              <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-800/50 border-emerald-500/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-emerald-400 mb-1">Daily Encouragement</h4>
                      <p className="text-xs text-emerald-200 leading-relaxed italic">
                        "{noContactEncouragement}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badge Collection */}
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="pt-4 pb-4">
                <div className="mb-4">
                  <BadgeCollection userId={user.id} compact={true} userTier={(user as any)?.tier || 'ghost'} />
                </div>
                <div className="border-t border-slate-600/30 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    onClick={() => window.location.href = '/dashboard/progress'}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress & Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-6 space-y-8">
            
            {/* Daily Rituals Section */}
            <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/40 border-purple-500/40 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Flame className="h-6 w-6 text-orange-400" />
                  {isPremium ? "Today's Healing Rituals" : "Today's Healing Ritual"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isPremium ? (
                  /* FIREWALL USERS: 2 Rituals */
                  <div className="space-y-6">
                    {ritual ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">{ritual.title}</h3>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-purple-500/20 text-purple-300">
                                {ritual.difficulty}
                              </Badge>
                              <span className="text-sm text-slate-300 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {ritual.estimatedTime || '5-10'} min
                              </span>
                            </div>
                          </div>
                          {ritual.isCompleted ? (
                            <div className="flex items-center gap-2 text-emerald-400">
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="text-sm font-medium">Completed</span>
                            </div>
                          ) : null}
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => setActiveModal(`ritual-${ritual.id}`)}
                            disabled={ritual.isCompleted}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {ritual.isCompleted ? 'Completed' : 'Start Ritual'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-400">
                        <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Loading your personalized ritual...</p>
                      </div>
                    )}

                    {/* Second Ritual for Premium Users */}
                    <div className="border-t border-purple-500/20 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-purple-300">Personalized Ritual #2</span>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Heart className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">Self-Hype Letter</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Badge className="bg-green-500/20 text-green-300 text-xs">Easy</Badge>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                5-8 min
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                          Write a brag letter about everything you've done right lately. Be your own hype person.
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                          onClick={() => setActiveModal('ritual-secondary')}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Second Ritual
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* FREE USERS: 1 Ritual + Upgrade CTA */
                  <div className="space-y-6">
                    {ritual ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">{ritual.title}</h3>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-slate-500/20 text-slate-300">
                                {ritual.difficulty}
                              </Badge>
                              <span className="text-sm text-slate-300 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {ritual.estimatedTime || '5-10'} min
                              </span>
                            </div>
                          </div>
                          {ritual.isCompleted ? (
                            <div className="flex items-center gap-2 text-emerald-400">
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="text-sm font-medium">Completed</span>
                            </div>
                          ) : null}
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => setActiveModal(`ritual-${ritual.id}`)}
                            disabled={ritual.isCompleted}
                            className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {ritual.isCompleted ? 'Completed' : 'Start Ritual'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-400">
                        <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Loading your ritual...</p>
                      </div>
                    )}

                    {/* Premium Upgrade CTA for Free Users */}
                    <div className="border-t border-purple-500/20 pt-4">
                      <div className="p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-500/30">
                        <div className="flex items-start gap-3 mb-3">
                          <Crown className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-white font-medium mb-1">Unlock Your Full Healing Potential</h4>
                            <p className="text-sm text-yellow-200 leading-relaxed">
                              Firewall subscribers receive 2 daily personalized rituals specifically designed for your healing journey, plus the ability to reroll once per day.
                            </p>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
                          onClick={() => setActiveModal('upgrade')}
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Subscribe to Firewall
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Therapy Section */}
            <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-800/50 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-400" />
                  AI Therapy & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPremium ? (
                  /* FIREWALL USERS: Full AI Therapy Access */
                  <>
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-300">Firewall Premium</span>
                      </div>
                      <p className="text-xs text-green-200">
                        ✨ Click any AI personality below for unlimited chat-based therapy sessions
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {AI_PERSONAS.map((persona) => (
                        <Button
                          key={persona.id}
                          onClick={() => {
                            setSelectedPersona(persona.id);
                            setActiveModal('ai-therapy');
                          }}
                          variant={selectedPersona === persona.id ? "default" : "outline"}
                          className={`h-auto p-4 flex flex-col items-center text-center space-y-2 relative bg-gradient-to-br ${persona.color} border ${persona.border} hover:bg-opacity-80 transition-all`}
                        >
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1 py-0">
                              Free
                            </Badge>
                          </div>
                          <span className="text-2xl">{persona.icon}</span>
                          <div>
                            <div className={`font-medium text-sm ${persona.accent}`}>{persona.name}</div>
                            <div className="text-xs text-slate-300">{persona.description}</div>
                            <div className="text-xs text-green-400 mt-1">Unlimited Chat</div>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Voice AI Therapy for Premium Users */}
                    <div className="border-t border-indigo-500/20 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-500/30">
                        <div className="flex items-center gap-3">
                          <Mic className="h-6 w-6 text-indigo-400" />
                          <div>
                            <div className="font-medium text-white">Voice AI Therapy</div>
                            <div className="text-sm text-indigo-300">Real-time voice session</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">$9.99</div>
                          <div className="text-xs text-slate-400">per 15 min</div>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => setActiveModal('voice-therapy')}
                      >
                        Start Voice Session
                      </Button>
                    </div>
                  </>
                ) : (
                  /* FREE USERS: Purchase CTA for AI Therapy */
                  <div className="text-center space-y-4">
                    <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-500/30">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
                      <h3 className="text-xl font-semibold text-white mb-2">AI Therapy Chat</h3>
                      <p className="text-sm text-indigo-200 mb-4 leading-relaxed">
                        Get personalized support with our AI therapy companions. Choose from different therapeutic approaches designed to help you heal.
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">300</div>
                          <div className="text-xs text-indigo-300">Messages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">30</div>
                          <div className="text-xs text-indigo-300">Days Valid</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">$3.99</div>
                          <div className="text-xs text-indigo-300">One-time</div>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold"
                        onClick={() => setActiveModal('ai-therapy-purchase')}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Purchase AI Therapy Chat
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Wall of Wounds */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-400" />
                    <span className="text-sm sm:text-base">Wall of Wounds</span>
                  </div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Quick Post with Emotion Selector (Premium) */}
                {isPremium ? (
                  <div className="space-y-3">
                    {/* Emotion Tag Selector */}
                    <div className="relative">
                      <button
                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                        className={`w-full p-2 sm:p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-left flex items-center justify-between text-xs sm:text-sm ${
                          selectedTag 
                            ? `bg-gradient-to-r ${selectedTag.color} ${selectedTag.bg} ${selectedTag.border}`
                            : 'text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {selectedTag ? (
                            <>
                              <span className="text-base">{selectedTag.emoji}</span>
                              <span className="text-white">{selectedTag.label}</span>
                            </>
                          ) : (
                            'Select an emotion...'
                          )}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {showTagDropdown && (
                        <div className="absolute z-50 top-full mt-2 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {EMOJI_TAGS.map((tag) => (
                            <button
                              key={tag.category}
                              onClick={() => {
                                setSelectedTag(tag);
                                setShowTagDropdown(false);
                              }}
                              className={`w-full p-3 text-left hover:bg-slate-700 flex items-center gap-3 text-sm transition-colors border-l-2 ${tag.border}`}
                            >
                              <span className="text-lg">{tag.emoji}</span>
                              <span className="text-white">{tag.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <textarea
                      placeholder="Share your healing journey..."
                      className="w-full p-2 sm:p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-xs sm:text-sm resize-none"
                      rows={3}
                      value={wallPostContent}
                      onChange={(e) => setWallPostContent(e.target.value)}
                    />
                    
                    {/* Submit Button */}
                    <Button 
                      size="sm" 
                      className="w-full bg-pink-600 hover:bg-pink-700 text-xs sm:text-sm"
                      onClick={handleWallPost}
                      disabled={!wallPostContent.trim() || !selectedTag || posting}
                    >
                      {posting ? (
                        <>
                          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Share Anonymously
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-lg border border-pink-500/30 text-center">
                    <Lock className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-pink-400" />
                    <p className="text-xs sm:text-sm text-pink-300 mb-2">Posting requires Premium</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-pink-500/50 text-pink-300 text-xs"
                      onClick={() => setActiveModal('upgrade')}
                    >
                      Upgrade to Share
                    </Button>
                  </div>
                )}

                {/* Recent Posts with Emotion-Based Styling */}
                <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                  {wallPosts?.slice(0, 12).map((post) => {
                    const emotionTag = post.glitchCategory ? getEmotionTagFromCategory(post.glitchCategory) : EMOJI_TAGS[0];
                    return (
                      <div 
                        key={post.id} 
                        className={`p-3 rounded-lg border-l-4 ${emotionTag.border} bg-gradient-to-r ${emotionTag.bg} backdrop-blur-sm`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{emotionTag.emoji}</span>
                            <Badge className={`${emotionTag.bg} ${emotionTag.border} text-white text-xs`}>
                              {emotionTag.label}
                            </Badge>
                          </div>
                          <span className="text-xs text-slate-400">{post.timeAgo}</span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed mb-3">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-400 hover:text-pink-400 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              handleWallReaction(post.id, 'resonate');
                            }}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            {post.reactions + (optimisticReactions[post.id] || 0)}
                          </Button>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="text-center py-6 text-slate-400">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Community is quiet right now</p>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-slate-600/50 text-slate-300"
                  onClick={() => window.location.href = '/wall'}
                >
                  See All Posts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal?.startsWith('ritual-') && ritual && (
        <RitualModal 
          ritualId={ritual.id}
          rituals={[{
            id: ritual.id,
            title: ritual.title,
            difficulty: (ritual.difficulty as any) || 'easy',
            completed: ritual.isCompleted || false,
            duration: typeof ritual.estimatedTime === 'number' ? `${ritual.estimatedTime} min` : (ritual.estimatedTime || '—'),
            icon: '🌀',
            steps: ritual.steps as any
          }]}
          onClose={() => setActiveModal(null)}
          onComplete={async (ritualId: string) => {
            const success = await completeRitual(ritualId, ritual.difficulty as any);
            if (success) {
              markTask('ritual');
              setActiveModal(null);
            }
            return success;
          }}
        />
      )}

      {/* Secondary ritual modal for premium users */}
      {activeModal === 'ritual-secondary' && (
        <RitualModal 
          ritualId="self-hype-letter"
          rituals={[{
            id: "self-hype-letter",
            title: "Self-Hype Letter",
            difficulty: "easy",
            completed: false,
            duration: "5-8 min",
            icon: '💝',
            steps: [
              {
                title: "Set up your space",
                description: "Find a comfortable place to write - digital or paper, whatever feels right.",
                duration: 1
              },
              {
                title: "List your recent wins",
                description: "Write down everything you've accomplished lately - big or small. Include any growth, positive changes, or moments you handled well.",
                duration: 3
              },
              {
                title: "Write your hype letter",
                description: "Address yourself by name and write like you're your biggest fan. Celebrate your strengths, acknowledge your progress, and remind yourself of your worth.",
                duration: 3
              },
              {
                title: "Read it aloud",
                description: "Read your letter out loud to yourself. Let those words sink in and feel the impact of your own encouragement.",
                duration: 1
              }
            ]
          }]}
          onClose={() => setActiveModal(null)}
          onComplete={async (ritualId: string) => {
            // For secondary ritual, we don't mark the main ritual task but can give XP
            setActiveModal(null);
            return true;
          }}
        />
      )}

      {activeModal === 'checkin' && (
        <CheckInModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            markTask('checkIn');
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'ai-therapy' && (
        <AITherapyModal 
          onClose={() => setActiveModal(null)}
          onFirstUserMessage={() => markTask('aiTherapy')}
          selectedPersona={selectedPersona}
        />
      )}

      {activeModal === 'ai-therapy-purchase' && (
        <AITherapyPurchaseModal 
          open={true}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'no-contact' && (
        <NoContactModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            markTask('noContact');
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'upgrade' && (
        <UpgradeModal onClose={() => setActiveModal(null)} />
      )}
      
      {activeModal === 'mindfulness' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-400" />
                Quick Mindfulness
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Take a moment to center yourself with these quick mindfulness exercises:
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🧘‍♀️</span>
                    <span className="text-white font-medium">5-Minute Grounding</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Take 5 deep breaths. Notice your surroundings. You are here, you are safe, you are healing.
                  </p>
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
                    💙 Practice box breathing: In for 4, hold for 4, out for 4, hold for 4
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">💭</span>
                    <span className="text-white font-medium">Thought Awareness</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Notice your thoughts without judgment. They are just thoughts, not facts. Let them pass like clouds.
                  </p>
                  <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-300">
                    🌙 Observe, acknowledge, release. You are not your thoughts.
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">❤️</span>
                    <span className="text-white font-medium">Self-Compassion</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Place your hand on your heart. Feel it beating. Thank your body for carrying you through this healing journey.
                  </p>
                  <div className="mt-3 p-3 bg-pink-500/10 border border-pink-500/30 rounded text-xs text-pink-300">
                    💝 You deserve the same kindness you give others
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <Button 
                  onClick={() => setActiveModal(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue Healing 🌟
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeModal === 'voice-therapy' && (
        <VoiceTherapyModal 
          onClose={() => setActiveModal(null)} 
          isPremium={isPremium}
        />
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Settings
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>
                ×
              </Button>
            </div>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setActiveModal(null);
                  window.location.href = '/settings';
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setActiveModal(null);
                  window.location.href = '/change-password';
                }}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setActiveModal(null);
                  window.location.href = '/subscription';
                }}
              >
                <Crown className="h-4 w-4 mr-2" />
                Subscription Management
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lumo AI Assistant */}
      <Lumo />
      <SmartLumo />
      
      {/* Lumo Onboarding */}
      {showOnboarding && (
        <LumoOnboarding
          isFirstTimeUser={isFirstTimeUser}
          onDismiss={dismissOnboarding}
          onStartNoContact={navigateToNoContact}
          onViewRituals={scrollToRituals}
        />
      )}
    </div>
    </LumoProvider>
  );
}

function TaskItem({ label, completed, premium }: { label: string; completed: boolean; premium?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${completed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
        <span className={`text-sm ${completed ? 'text-emerald-300' : 'text-slate-300'}`}>
          {label}
        </span>
        {premium && <Lock className="h-3 w-3 text-yellow-400" />}
      </div>
      {completed && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
    </div>
  );
}

export function AdaptiveDashboardWithProvider(props: Props) {
  return <AdaptiveDashboard {...props} />;
}

export default AdaptiveDashboard;
