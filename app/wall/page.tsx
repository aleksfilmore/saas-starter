"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Users,
  Send,
  AlertTriangle,
  Filter,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  RefreshCw
} from 'lucide-react';

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

interface WallStats {
  activeHealers: number;
  heartsGiven: number;
  supportMessages: number;
}

export default function WallEnhancedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState('recent');
  const [wallStats, setWallStats] = useState<WallStats>({
    activeHealers: 1247,
    heartsGiven: 89423,
    supportMessages: 12891
  });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/wall/feed?filter=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
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
  };

  const submitPost = async () => {
    if (!postContent.trim() || posting) return;

    setPosting(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/wall/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: postContent.trim(),
          isAnonymous: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPostContent('');
        // Add new post to top of feed
        setPosts(prev => [data.post, ...prev]);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to post confession');
      }
    } catch (error) {
      console.error('Failed to post:', error);
      alert('Failed to post confession. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const reactToPost = async (postId: string, reactionType: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/wall/react', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId,
          reactionType
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update post in state
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              ...data.updatedCounts,
              userReaction: data.userReaction
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  const getReactionIcon = (type: string) => {
    const icons = {
      resonate: '🔄',
      same_loop: '🤝', 
      dragged_me_too: '😭',
      stone_cold: '🗿',
      cleansed: '✨'
    };
    return icons[type as keyof typeof icons] || '❓';
  };

  const getReactionLabel = (type: string) => {
    const labels = {
      resonate: 'Resonate',
      same_loop: 'Same Loop',
      dragged_me_too: 'Dragged Me Too',
      stone_cold: 'Stone Cold',
      cleansed: 'Cleansed'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      system_error: 'border-red-500/30 bg-red-500/5',
      loop_detected: 'border-yellow-500/30 bg-yellow-500/5',
      memory_leak: 'border-blue-500/30 bg-blue-500/5',
      buffer_overflow: 'border-purple-500/30 bg-purple-500/5',
      syntax_error: 'border-green-500/30 bg-green-500/5',
      access_denied: 'border-orange-500/30 bg-orange-500/5',
      null_pointer: 'border-gray-500/30 bg-gray-500/5',
      stack_overflow: 'border-pink-500/30 bg-pink-500/5'
    };
    return colors[category as keyof typeof colors] || 'border-gray-500/30 bg-gray-500/5';
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              ✨ Wall of Wounds™
            </h1>
            <p className="text-xl text-red-400">
              Anonymous healing confessions
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Share Section */}
          <Card className={`bg-gray-800/80 border border-red-500/30`}>
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-red-400" />
                Share Your Healing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your healing journey anonymously... What wound are you transforming today?"
                  className="bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 min-h-[120px] resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-400">
                      <Shield className="h-4 w-4 inline mr-1" />
                      Anonymous & encrypted
                    </p>
                    <p className="text-xs text-gray-500">
                      {postContent.length}/500
                    </p>
                  </div>
                  <Button 
                    onClick={submitPost}
                    disabled={!postContent.trim() || posting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {posting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Share Confession
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {[
                  { key: 'recent', label: 'Recent', icon: Clock },
                  { key: 'viral', label: 'Viral', icon: TrendingUp },
                  { key: 'oracle', label: 'Oracle', icon: Zap },
                  { key: 'pulse', label: 'Pulse', icon: Heart }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={filter === key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(key)}
                    className={filter === key ? "bg-purple-600" : "text-gray-400 hover:text-white"}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchPosts}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border border-gray-600/50 text-center">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{wallStats.activeHealers.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Active Healers</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border border-gray-600/50 text-center">
              <CardContent className="p-4">
                <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{wallStats.heartsGiven.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Hearts Given</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border border-gray-600/50 text-center">
              <CardContent className="p-4">
                <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{wallStats.supportMessages.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Support Messages</div>
              </CardContent>
            </Card>
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
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300 font-mono text-xs">
                          {post.glitchTitle}
                        </Badge>
                        {post.isOraclePost && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Zap className="h-3 w-3 mr-1" />
                            Oracle
                          </Badge>
                        )}
                        {post.isFeatured && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">{post.timeAgo}</span>
                    </div>

                    {/* Post Content */}
                    <p className="text-white text-lg leading-relaxed mb-4">{post.content}</p>

                    {/* Reactions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-wrap gap-2">
                        {[
                          { type: 'resonate', count: post.resonateCount },
                          { type: 'same_loop', count: post.sameLoopCount },
                          { type: 'dragged_me_too', count: post.draggedMeTooCount },
                          { type: 'stone_cold', count: post.stoneColdCount },
                          { type: 'cleansed', count: post.cleansedCount }
                        ].map(({ type, count }) => (
                          <button
                            key={type}
                            onClick={() => reactToPost(post.id, type)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                              post.userReaction === type 
                                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <span className="text-sm">{getReactionIcon(type)}</span>
                            <span className="text-xs">{count}</span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.commentCount}</span>
                        </div>
                        <div className="text-sm">{post.totalReactions} reactions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {posts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No confessions found in the void</p>
                  <p className="text-gray-500 text-sm mt-2">Be the first to share your healing journey</p>
                </div>
              )}
            </div>
          )}

          {/* Load More */}
          {posts.length > 0 && (
            <div className="text-center">
              <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
                Load More Confessions
              </Button>
            </div>
          )}

        </div>

      </div>
    </AuthWrapper>
  );
}
