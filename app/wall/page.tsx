'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import useSWR from 'swr';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { BreathingExercise } from '@/components/quick-actions/BreathingExercise';
import { NotificationDisplay } from '@/components/notifications/NotificationDisplay';
import { 
  Send, 
  MessageCircle, 
  Users,
  Heart,
  RefreshCw,
  ChevronDown,
  Shield,
  ArrowLeft,
  Sparkles,
  ChevronUp,
  Settings,
  User as UserIcon,
  Coins,
  Star,
  LogOut,
  Wind,
  Brain,
  Crown,
  AlertTriangle,
  Info
} from 'lucide-react';
import { WALL_CATEGORIES, getWallCategoryConfig } from '@/lib/wall/categories';
import { useWallReaction } from '@/lib/hooks/useWallReaction';
// Use client-side tracker instead of server AnalyticsService to prevent postgres from entering client bundle
import { trackEvent } from '@/lib/analytics/client';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

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

interface Post {
  id: string;
  content: string;
  glitchCategory: string;
  glitchTitle: string;
  isAnonymous: boolean;
  createdAt: string;
  authorId?: string;
  authorEmail?: string;
  authorLevel?: number;
  resonateCount: number;
  sameLoopCount: number;
  draggedMeTooCount: number;
  stoneColdCount: number;
  cleansedCount: number;
  commentCount: number;
  isOraclePost: boolean;
  isFeatured: boolean;
  totalReactions: number;
  timeAgo: string;
  userReaction?: string | null;
}

// Map standardized categories to display meta (reusing original emoji aesthetics)
const CATEGORY_EMOJIS: Record<string,string> = {
  system_error: '💥',
  loop_detected: '🔁',
  memory_leak: '🧠',
  buffer_overflow: '📈',
  syntax_error: '🧩',
  null_pointer: '🫥',
  stack_overflow: '⚡',
  access_denied: '🚫'
};

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export default function OptimizedWallPage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState('recent');
  const [postContent, setPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [posting, setPosting] = useState(false);
  // Reactions handled by shared hook
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { toggleReaction } = useWallReaction({ endpoint: '/api/wall/react' });

  // User premium status
  const isPremium = authUser?.subscriptionTier === 'premium' || 
                     (authUser as any)?.subscription_tier === 'premium' || 
                     (authUser as any)?.tier === 'firewall' ||
                     (authUser as any)?.ritual_tier === 'firewall';

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        localStorage.clear();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  // Use SWR for intelligent data fetching
  const { data: feedData, error, isLoading, mutate: refresh } = useSWR(
    isAuthenticated ? `/api/wall/feed?filter=${filter}` : null,
    fetcher,
    {
      dedupingInterval: 30000, // 30 seconds
      revalidateOnFocus: false,
      refreshInterval: 60000, // 1 minute auto-refresh
      errorRetryCount: 3,
    }
  );

  const posts: Post[] = feedData?.posts || [];

  // Heart reaction via shared hook mapped onto resonateCount
  const handleHeartReaction = async (post: Post) => {
    try {
      await toggleReaction({ id: post.id, hearts: post.resonateCount, userReaction: post.userReaction } as any, (updater, shouldRevalidate)=>{
        if(typeof updater === 'function') {
          refresh((prev: any)=>{
            if(!prev) return prev;
            // Build temp with hearts
            const temp = { ...prev, posts: prev.posts.map((p: any)=> ({ ...p, hearts: p.resonateCount })) };
            const updated = updater(temp);
            if(updated){
              updated.posts = updated.posts.map((p:any)=>{
                const { hearts, ...rest } = p; return { ...rest, resonateCount: hearts };
              });
            }
            return updated;
          }, shouldRevalidate);
        }
      });
  trackEvent(AnalyticsEvents.WALL_POST_LIKED, { postId: post.id, category: post.glitchCategory });
    } catch {
      toast.error('Unable to react');
    }
  };

  // Post submission handler
  const handleSubmitPost = async () => {
  if (!postContent.trim() || !selectedCategory || posting) return;

    setPosting(true);
    try {
      const response = await fetch('/api/wall/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: postContent,
          glitchCategory: selectedCategory,
          glitchTitle: getWallCategoryConfig(selectedCategory!)?.label || selectedCategory,
          isAnonymous: true
        })
      });

      if (response.ok) {
        setPostContent('');
  setSelectedCategory(null);
        refresh(); // Refresh feed after posting
        toast.success('Your healing story has been shared with the community 💜');
      } else {
        const errorData = await response.json();
        console.error('Failed to submit post:', errorData);
        toast.error(errorData.error || 'Unable to share post - please try again');
      }
    } catch (error) {
      console.error('Post submission failed:', error);
      toast.error('Connection issue - your post was not shared');
    } finally {
      setPosting(false);
    }
  };

  const getReactionIcon = (type: string) => {
    const icons: Record<string, string> = {
      resonate: '💫',
      same_loop: '🔄',
      dragged_me_too: '😔',
      stone_cold: '🗿',
      cleansed: '✨'
    };
    return icons[type] || '👍';
  };

  const getEmotionData = (category: string) => {
    const cfg = getWallCategoryConfig(category);
    if(!cfg) return { label:'Unknown', badgeClass:'bg-slate-700 text-slate-300', containerClass:'bg-slate-800/40 border-slate-600/40', accentClass:'text-slate-400', emoji:'❔' } as any;
    return { ...cfg, emoji: CATEGORY_EMOJIS[cfg.id] || '❔' };
  };

  // Early returns for auth states
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Initializing connection to the Wall...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Users className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Join the Community</h2>
          <p className="text-gray-300 mb-6">
            Sign in to access the Wall of Wounds - our anonymous healing community where you can share your journey and connect with others.
          </p>
          <div className="space-y-3">
            <Link href="/sign-in">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                <Users className="h-4 w-4 mr-2" />
                Sign In to Join
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                Create Account
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-container">
      <FloatingParticles />
        
      {/* Dashboard Header */}
      <div className="relative z-10">
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
                    Wall of Wounds
                  </span>
                </div>
              </div>
              
              {/* Right side - Actions and User */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                
                {/* User Tier Badge */}
                <div className="hidden md:flex">
                  {isPremium ? (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 text-xs font-semibold shadow-lg border border-purple-400/50">
                      <Crown className="h-3 w-3 mr-1.5" />
                      FIREWALL MODE
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-500 text-gray-300 px-3 py-1.5 text-xs font-medium bg-gray-800/50">
                      <span className="text-gray-400 mr-1">👻</span>
                      GHOST MODE
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
                
                {/* Dashboard Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/dashboard'}
                  className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 flex items-center gap-1 text-xs p-2"
                >
                  <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden lg:inline">Dashboard</span>
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
                  user={authUser as any} 
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
      </div>
      
      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-4">
        
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center brand-glow">
            ✨ Wall of Wounds
          </h1>
          <div className="flex items-center text-sm text-brand-primary brand-glow">
            <Users className="h-4 w-4 mr-1" />
            {posts.length} posts loaded
          </div>
        </div>

        {/* Unified Compose Area */}
        <Card className="card-brand border-red-500/30 mb-6">
          <CardContent className="p-6">
            
            {/* Emoji Tag Selector */}
            <div className="mb-4">
              <div className="relative">
                <button
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="flex items-center justify-between w-full p-3 bg-brand-dark/50 hover:bg-brand-dark/70 border border-brand-light neon-border rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {selectedCategory ? (
                      <>
                        <span className="text-lg">{CATEGORY_EMOJIS[selectedCategory]||'❔'}</span>
                        <span className="text-white">{getWallCategoryConfig(selectedCategory)?.label}</span>
                      </>
                    ) : <span className="text-gray-400">Choose a glitch category</span>}
                  </div>
                  {showTagDropdown ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>
                
                <AnimatePresence>
                  {showTagDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto"
                    >
                      {WALL_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={()=>{ setSelectedCategory(cat.id); setShowTagDropdown(false); trackEvent(AnalyticsEvents.WALL_CATEGORY_SELECTED, { category: cat.id }); }}
                          className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{CATEGORY_EMOJIS[cat.id]||'❔'}</span>
                            <span className="text-white">{cat.label}</span>
                          </div>
                          <span className="text-xs text-gray-400 max-w-[160px] line-clamp-1" title={cat.description}>{cat.description}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-3">
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSubmitPost();
                  }
                }}
                placeholder={selectedCategory ? `${CATEGORY_EMOJIS[selectedCategory]} Share your ${getWallCategoryConfig(selectedCategory)?.label?.toLowerCase()} fragment...` : 'Choose a glitch category, then share your fragment...'}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[120px] resize-none focus:border-red-500/50 focus:ring-red-500/20"
                maxLength={500}
                disabled={!selectedCategory}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-gray-400">
                    <Shield className="h-3 w-3 mr-1" />
                    Anonymous & encrypted
                  </div>
                  <div className="text-xs text-gray-500">
                    {postContent.length}/500
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500">
                    Ctrl+Enter to post
                  </div>
                  <Button 
                    onClick={handleSubmitPost}
                    disabled={!postContent.trim() || posting || !selectedCategory}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    {posting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Options */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white">View:</span>
            {['recent', 'viral', 'pulse', 'oracle'].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className={`${filter === filterOption ? "bg-purple-600" : "text-gray-400 hover:text-white"}`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refresh()}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Posts Feed - 3 Column Spotify-Style Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading confessions from the void...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load posts</p>
            <Button onClick={() => refresh()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const emotionData = getEmotionData(post.glitchCategory);
              const totalReactions = post.resonateCount + post.sameLoopCount + post.cleansedCount;
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-fit"
                >
                  <Card className={`backdrop-blur-sm border h-full ${emotionData.containerClass} hover:shadow-lg transition-all duration-300`}> 
                    <CardContent className="p-5">
                      
                      {/* Post Header with Emotion Tag */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium flex items-center space-x-2 border ${emotionData.badgeClass}`} title={emotionData.description}>
                            <span className="text-lg">{emotionData.emoji}</span>
                            <span>{emotionData.label}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{post.timeAgo}</span>
                      </div>

                      {/* Badges */}
                      {(post.isOraclePost || post.isFeatured) && (
                        <div className="flex items-center space-x-2 mb-3">
                          {post.isOraclePost && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                              ⚡ Oracle
                            </Badge>
                          )}
                          {post.isFeatured && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              ✨ Featured
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Post Content */}
                      <p className="text-white leading-relaxed mb-4 line-clamp-6">{post.content}</p>

                      {/* Actions - Consistent Heart Reaction like Dashboard */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleHeartReaction(post)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                            post.userReaction === 'resonate'
                              ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                              : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.userReaction === 'resonate' ? 'fill-current' : ''}`} />
                          <span className="font-medium">
                            {post.resonateCount}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {posts.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12">
                <div className="text-4xl mb-4">✨</div>
                <p className="text-gray-400 text-lg">No confessions found</p>
                <p className="text-gray-500 text-sm mt-2">Be the first to share your healing journey</p>
              </div>
            )}
          </div>
        )}

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
              Load More Confessions
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
