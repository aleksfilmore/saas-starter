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
  { emoji: '💔', label: 'Heartbreak', category: 'heartbreak' },
  { emoji: '😢', label: 'Sadness', category: 'sadness' },
  { emoji: '😤', label: 'Anger', category: 'anger' },
  { emoji: '😰', label: 'Anxiety', category: 'anxiety' },
  { emoji: '🔥', label: 'Rage', category: 'rage' },
  { emoji: '💭', label: 'Confusion', category: 'confusion' },
  { emoji: '🌟', label: 'Hope', category: 'hope' },
  { emoji: '⚡', label: 'Breakthrough', category: 'breakthrough' },
  { emoji: '🎭', label: 'Identity', category: 'identity' },
  { emoji: '🔮', label: 'Future', category: 'future' }
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

  // Optimistic reaction handler
  const handleReaction = async (postId: string, reactionType: string = 'resonate') => {
    // Optimistically update the reaction count
    setOptimisticReactions(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));

    try {
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId, reactionType })
      });

      if (response.ok) {
        // Refresh data in background
        refresh();
      } else {
        // Revert optimistic update on failure
        setOptimisticReactions(prev => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1)
        }));
        
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to react to post:', errorData);
        toast.error('Failed to register reaction');
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticReactions(prev => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 0) - 1)
      }));
      
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      heartbreak: 'border-red-500/30',
      sadness: 'border-blue-500/30',
      anger: 'border-orange-500/30',
      anxiety: 'border-yellow-500/30',
      rage: 'border-red-600/30',
      confusion: 'border-purple-500/30',
      hope: 'border-green-500/30',
      breakthrough: 'border-cyan-500/30',
      identity: 'border-pink-500/30',
      future: 'border-indigo-500/30'
    };
    return colors[category] || 'border-gray-500/30';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        
      {/* SimplifiedHeader */}
      <SimplifiedHeader 
        user={{
          username: authUser?.username || 'User',
          streak: 34,
          bytes: 730,
          level: 3,
          noContactDays: 12,
          subscriptionTier: (authUser?.subscriptionTier || 'free') as 'free' | 'premium'
        }}
        hasShield={true}
        onCheckin={() => console.log('Check-in clicked')}
        onBreathing={() => {
          // Use dashboard instead of non-existent /breathing route
          window.location.href = '/dashboard';
        }}
        onCrisis={() => window.location.href = '/crisis-support'}
      />
      
      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 pb-4">
        
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            ✨ Wall of Wounds
          </h1>
          <div className="flex items-center text-sm text-purple-300">
            <Users className="h-4 w-4 mr-1" />
            {posts.length} posts loaded
          </div>
        </div>

        {/* Unified Compose Area */}
        <Card className="bg-gray-800/80 border border-red-500/30 mb-6">
          <CardContent className="p-6">
            
            {/* Emoji Tag Selector */}
            <div className="mb-4">
              <div className="relative">
                <button
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="flex items-center justify-between w-full p-3 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 rounded-lg transition-colors"
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

        {/* Posts Feed */}
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
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`bg-gray-800/80 border ${getCategoryColor(post.glitchCategory)}`}>
                  <CardContent className="p-4">
                    
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1">
                          {EMOJI_TAGS.find(tag => tag.category === post.glitchCategory)?.emoji} {post.glitchTitle}
                        </Badge>
                        {post.isOraclePost && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                            ⚡ Oracle
                          </Badge>
                        )}
                        {post.isFeatured && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{post.timeAgo}</span>
                    </div>

                    {/* Post Content */}
                    <p className="text-white leading-relaxed mb-4">{post.content}</p>

                    {/* Reactions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {[
                          { type: 'resonate', count: post.resonateCount },
                          { type: 'same_loop', count: post.sameLoopCount },
                          { type: 'cleansed', count: post.cleansedCount }
                        ].map(({ type, count }) => (
                          <button
                            key={type}
                            onClick={() => handleReaction(post.id, type)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                              post.userReaction === type 
                                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <span>{getReactionIcon(type)}</span>
                            <span>{count + (optimisticReactions[post.id] || 0)}</span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span className="text-xs">{post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {posts.length === 0 && !isLoading && (
              <div className="text-center py-12">
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
