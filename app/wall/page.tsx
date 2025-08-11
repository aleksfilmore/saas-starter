'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  Zap,
  Shield,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Flame,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function SimplifiedWallPage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [selectedTag, setSelectedTag] = useState<typeof EMOJI_TAGS[0] | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState('recent');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [user, setUser] = useState<{username: string; subscriptionTier: string; streak: number; bytes: number; level: number; noContactDays: number} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchUserData = useCallback(async () => {
    if (!authUser || !isAuthenticated) return;
    
    try {
      // Use authUser data directly
      setUser({
        username: authUser.username,
        subscriptionTier: authUser.subscriptionTier,
        streak: authUser.streak,
        bytes: authUser.bytes,
        level: authUser.level,
        noContactDays: authUser.noContactDays
      });
    } catch (error) {
      console.error('Failed to set user data:', error);
    }
  }, [authUser, isAuthenticated]);

  const fetchPosts = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({ filter });
      if (categoryFilter) {
        queryParams.append('category', categoryFilter);
      }
      const response = await fetch(`/api/wall/feed?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, categoryFilter]);

  useEffect(() => {
    if (authUser && isAuthenticated && !authLoading) {
      fetchUserData();
      fetchPosts();
    }
  }, [authUser, isAuthenticated, authLoading, fetchUserData, fetchPosts]);

  const submitPost = async () => {
    if (!postContent.trim() || posting || !selectedTag) return;

    setPosting(true);
    try {
      const response = await fetch('/api/wall/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
        await fetchPosts();
      } else {
        const errorData = await response.json();
        console.error('Failed to submit post:', errorData);
        alert(errorData.error || 'Failed to submit post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Network error occurred');
    } finally {
      setPosting(false);
    }
  };

  const reactToPost = async (postId: string, reactionType: string) => {
    try {
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId,
          reactionType
        })
      });

      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error reacting to post:', error);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitPost();
    }
  };

  const placeholderText = selectedTag 
    ? `${selectedTag.emoji} Share your ${selectedTag.label.toLowerCase()} healing journey anonymously...`
    : 'Click to choose an emotion tag, then share your healing journey...';

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading the Wall...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Please sign in to access the Wall</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        
        {/* SimplifiedHeader */}
        <SimplifiedHeader 
          user={{
            username: user?.username || 'User',
            streak: 34,
            bytes: 730,
            level: 3,
            noContactDays: 12,
            subscriptionTier: (user?.subscriptionTier || 'free') as 'free' | 'premium'
          }}
          hasShield={true}
          onCheckin={() => console.log('Check-in clicked')}
          onBreathing={() => window.location.href = '/breathing'}
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
              1.2k healers
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
                              textareaRef.current?.focus();
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
                  ref={textareaRef}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={placeholderText}
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
                      onClick={submitPost}
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

          {/* Collapsible Filters */}
          <div className="mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-gray-600/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">View Options</span>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 text-xs">
                    {filter}
                  </Badge>
                  {categoryFilter && (
                    <Badge variant="secondary" className="bg-red-600/20 text-red-300 text-xs">
                      {EMOJI_TAGS.find(tag => tag.category === categoryFilter)?.emoji} {EMOJI_TAGS.find(tag => tag.category === categoryFilter)?.label}
                    </Badge>
                  )}
                </div>
              </div>
              {showFilters ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 p-4 bg-gray-800/30 rounded-lg border border-gray-600/20"
                >
                  <div className="space-y-4">
                    {/* Filter Type Buttons */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Feed Type</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { key: 'recent', label: 'Recent', icon: '🕒' },
                          { key: 'viral', label: 'Viral', icon: '🔥' },
                          { key: 'oracle', label: 'Oracle', icon: '⚡' },
                          { key: 'pulse', label: 'Pulse', icon: '💖' }
                        ].map(({ key, label, icon }) => (
                          <Button
                            key={key}
                            variant={filter === key ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter(key)}
                            className={`${filter === key ? "bg-purple-600" : "text-gray-400 hover:text-white"} justify-start`}
                          >
                            <span className="mr-2">{icon}</span>
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Emotion Category Filters */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Filter by Emotion</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <Button
                          variant={categoryFilter === null ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCategoryFilter(null)}
                          className={`${categoryFilter === null ? "bg-red-600" : "text-gray-400 hover:text-white"} justify-start`}
                        >
                          <span className="mr-2">🌀</span>
                          All
                        </Button>
                        {EMOJI_TAGS.map((tag) => (
                          <Button
                            key={tag.category}
                            variant={categoryFilter === tag.category ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setCategoryFilter(tag.category)}
                            className={`${categoryFilter === tag.category ? "bg-red-600" : "text-gray-400 hover:text-white"} justify-start`}
                          >
                            <span className="mr-2">{tag.emoji}</span>
                            {tag.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading confessions from the void...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className={`bg-gray-800/80 border ${getCategoryColor(post.glitchCategory)}`}>
                  <CardContent className="p-4">
                    
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1">
                          {EMOJI_TAGS.find(tag => tag.category === post.glitchCategory)?.emoji} {post.glitchTitle}
                        </Badge>
                        {post.isOraclePost && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Oracle
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

                    {/* Simplified Reactions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {[
                          { type: 'resonate', count: post.resonateCount },
                          { type: 'same_loop', count: post.sameLoopCount },
                          { type: 'cleansed', count: post.cleansedCount }
                        ].map(({ type, count }) => (
                          <button
                            key={type}
                            onClick={() => reactToPost(post.id, type)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                              post.userReaction === type 
                                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <span>{getReactionIcon(type)}</span>
                            <span>{count}</span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span className="text-xs">{post.commentCount}</span>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {posts.length === 0 && !loading && (
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
