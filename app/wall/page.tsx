'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import useSWR from 'swr';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { SimplifiedHeader } from '@/components/dashboard/SimplifiedHeader';
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
  ChevronUp
} from 'lucide-react';
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

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export default function OptimizedWallPage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState('recent');
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<typeof EMOJI_TAGS[0] | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [posting, setPosting] = useState(false);
  const [optimisticReactions, setOptimisticReactions] = useState<Record<string, number>>({});
  
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

  // Optimistic heart reaction handler (properly handle existing reactions)
  const handleHeartReaction = async (postId: string) => {
    const currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;

    const hasUserReacted = currentPost.userReaction === 'resonate';
    
    // Optimistically update the UI state immediately
    setOptimisticReactions(prev => ({
      ...prev,
      [postId]: hasUserReacted ? -1 : 1 // Remove if already reacted, add if not
    }));

    try {
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId, reactionType: 'resonate' })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Clear optimistic state and refresh actual data
        setOptimisticReactions(prev => {
          const newState = { ...prev };
          delete newState[postId];
          return newState;
        });
        
        // Force refresh the data to get updated userReaction state
        await refresh();
        
        if (result.action === 'added') {
          toast.success('💖 Reaction added!');
        } else if (result.action === 'removed') {
          toast.success('Reaction removed');
        }
      } else {
        // Revert optimistic update on failure
        setOptimisticReactions(prev => {
          const newState = { ...prev };
          delete newState[postId];
          return newState;
        });
        
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to react to post:', errorData);
        toast.error('Failed to register reaction');
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticReactions(prev => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });
      
      console.error('Failed to react to post:', error);
      toast.error('Failed to register reaction');
    }
  };

  // Post submission handler
  const handleSubmitPost = async () => {
    if (!postContent.trim() || !selectedTag || posting) return;

    setPosting(true);
    try {
      const response = await fetch('/api/wall/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: postContent,
          glitchCategory: selectedTag.category,
          glitchTitle: selectedTag.label,
          isAnonymous: true
        })
      });

      if (response.ok) {
        setPostContent('');
        setSelectedTag(null);
        refresh(); // Refresh feed after posting
        toast.success('Post shared successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to submit post:', errorData);
        toast.error(errorData.error || 'Failed to submit post');
      }
    } catch (error) {
      console.error('Post submission failed:', error);
      toast.error('Network error occurred');
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
    return EMOJI_TAGS.find(tag => tag.category === category) || EMOJI_TAGS[0];
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
        
      {/* SimplifiedHeader */}
      <div className="relative z-10">
        <SimplifiedHeader 
          user={{
            username: authUser?.username || authUser?.email?.split('@')[0] || 'Anonymous',
            streak: authUser?.streak || 0,
            bytes: authUser?.bytes || 0,
            level: authUser?.level || 1,
            noContactDays: authUser?.noContactDays || 0,
            subscriptionTier: authUser?.subscriptionTier || 'free'
          }}
          hasShield={authUser?.noContactDays ? authUser.noContactDays > 0 : false}
          onCheckin={() => console.log('Check-in clicked')}
          onBreathing={() => {
            // Use dashboard instead of non-existent /breathing route
            window.location.href = '/dashboard';
          }}
          onCrisis={() => window.location.href = '/crisis-support'}
        />
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
                    {selectedTag ? (
                      <>
                        <span className="text-lg">{selectedTag.emoji}</span>
                        <span className="text-white">{selectedTag.label}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Choose an emotion tag</span>
                    )}
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
                      {EMOJI_TAGS.map((tag) => (
                        <button
                          key={tag.category}
                          onClick={() => {
                            setSelectedTag(tag);
                            setShowTagDropdown(false);
                          }}
                          className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-b-0"
                        >
                          <span className="text-lg">{tag.emoji}</span>
                          <span className="text-white">{tag.label}</span>
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
                placeholder={selectedTag 
                  ? `${selectedTag.emoji} Share your ${selectedTag.label.toLowerCase()} healing journey anonymously...`
                  : 'Click to choose an emotion tag, then share your healing journey...'
                }
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[120px] resize-none focus:border-red-500/50 focus:ring-red-500/20"
                maxLength={500}
                disabled={!selectedTag}
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
                    disabled={!postContent.trim() || posting || !selectedTag}
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
                  <Card className={`bg-gradient-to-br ${emotionData.bg} backdrop-blur-sm border ${emotionData.border} hover:border-opacity-80 transition-all duration-300 h-full`}>
                    <CardContent className="p-5">
                      
                      {/* Post Header with Emotion Tag */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${emotionData.color} text-white text-sm font-medium flex items-center space-x-2`}>
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
                          onClick={() => handleHeartReaction(post.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                            post.userReaction === 'resonate'
                              ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                              : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.userReaction === 'resonate' ? 'fill-current' : ''}`} />
                          <span className="font-medium">
                            {totalReactions + (optimisticReactions[post.id] || 0)}
                          </span>
                        </Button>
                        
                        <div className="text-xs text-gray-500">
                          {post.timeAgo}
                        </div>
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
