"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ThumbsUp, 
  MessageCircle, 
  Share, 
  Flag, 
  Zap,
  Timer,
  TrendingUp,
  Crown,
  Flame,
  Sparkles,
  Eye
} from 'lucide-react';

interface WallPost {
  id: string;
  alias: string;
  avatar: string;
  content: string;
  timestamp: Date;
  emotionalTags: {
    numb: number;
    vengeance: number;
    logic: number;
    helpOthers: number;
  };
  upvotes: number;
  commentCount: number;
  isTopGlitch?: boolean;
  isRelatableStream?: boolean;
  userTier: 'free' | 'firewall' | 'cult-leader';
}

interface EnhancedWallOfWoundsProps {
  posts: WallPost[];
  userAlias: string;
  userTier: 'free' | 'firewall' | 'cult-leader';
  userEmotionalTone: 'numb' | 'vengeance' | 'logic' | 'help-others';
  onSubmitPost: (content: string) => void;
  onReactToPost: (postId: string, reaction: 'upvote' | 'numb' | 'vengeance' | 'logic' | 'help-others') => void;
  onCommentOnPost: (postId: string, comment: string) => void;
  onSharePost: (postId: string) => void;
  onReportPost: (postId: string) => void;
}

export default function EnhancedWallOfWounds({
  posts,
  userAlias,
  userTier,
  userEmotionalTone,
  onSubmitPost,
  onReactToPost,
  onCommentOnPost,
  onSharePost,
  onReportPost
}: EnhancedWallOfWoundsProps) {
  const [newPost, setNewPost] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'top-glitch' | 'relatable-stream' | 'my-tone'>('all');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const getEmotionalTagColor = (tag: keyof WallPost['emotionalTags']) => {
    switch (tag) {
      case 'numb': return 'text-gray-400 bg-gray-500/20';
      case 'vengeance': return 'text-red-400 bg-red-500/20';
      case 'logic': return 'text-blue-400 bg-blue-500/20';
      case 'helpOthers': return 'text-green-400 bg-green-500/20';
    }
  };

  const getTierBadge = (tier: WallPost['userTier']) => {
    switch (tier) {
      case 'cult-leader':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'firewall':
        return <Zap className="h-4 w-4 text-orange-400" />;
      default:
        return null;
    }
  };

  const filteredPosts = posts.filter(post => {
    switch (activeFilter) {
      case 'top-glitch':
        return post.isTopGlitch;
      case 'relatable-stream':
        return post.isRelatableStream;
      case 'my-tone':
        const toneKey = userEmotionalTone === 'help-others' ? 'helpOthers' : 
                        userEmotionalTone as keyof WallPost['emotionalTags'];
        return post.emotionalTags[toneKey] > 0;
      default:
        return true;
    }
  }).sort((a, b) => {
    // Prioritize by engagement and recency
    const aScore = a.upvotes + a.commentCount + (a.isTopGlitch ? 100 : 0) + (a.isRelatableStream ? 50 : 0);
    const bScore = b.upvotes + b.commentCount + (b.isTopGlitch ? 100 : 0) + (b.isRelatableStream ? 50 : 0);
    return bScore - aScore;
  });

  const handleSubmitPost = () => {
    if (newPost.trim() && newPost.length >= 10) {
      onSubmitPost(newPost);
      setNewPost('');
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/30 to-red-900/20 border-2 border-purple-500/50">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            📱 WALL OF WOUNDS
          </CardTitle>
          <p className="text-purple-400">
            Anonymous confessions. Real healing. Zero judgment.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActiveFilter('all')}
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={activeFilter === 'all' ? 'bg-purple-500 text-white' : 'border-gray-600 text-gray-400'}
            >
              All Posts
            </Button>
            <Button
              onClick={() => setActiveFilter('top-glitch')}
              variant={activeFilter === 'top-glitch' ? 'default' : 'outline'}
              size="sm"
              className={activeFilter === 'top-glitch' ? 'bg-yellow-500 text-white' : 'border-gray-600 text-gray-400'}
            >
              <Flame className="h-4 w-4 mr-1" />
              Weekly Top Glitch
            </Button>
            <Button
              onClick={() => setActiveFilter('relatable-stream')}
              variant={activeFilter === 'relatable-stream' ? 'default' : 'outline'}
              size="sm"
              className={activeFilter === 'relatable-stream' ? 'bg-blue-500 text-white' : 'border-gray-600 text-gray-400'}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Relatable Stream
            </Button>
            <Button
              onClick={() => setActiveFilter('my-tone')}
              variant={activeFilter === 'my-tone' ? 'default' : 'outline'}
              size="sm"
              className={activeFilter === 'my-tone' ? 'bg-green-500 text-white' : 'border-gray-600 text-gray-400'}
            >
              <Heart className="h-4 w-4 mr-1" />
              My Vibe
            </Button>
          </div>

          {/* New Post Composer */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="text-2xl">👻</div>
              <span className="text-white font-bold">{userAlias}</span>
              {getTierBadge(userTier)}
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                {userEmotionalTone.toUpperCase()}
              </Badge>
            </div>
            
            <textarea
              value={newPost}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost(e.target.value)}
              placeholder="Share your truth anonymously... What's really going on?"
              className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 min-h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={500}
            />
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-400">
                {newPost.length}/500 characters
                {newPost.length < 10 && newPost.length > 0 && ' (minimum 10)'}
              </span>
              <Button
                onClick={handleSubmitPost}
                disabled={newPost.length < 10}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Share Wound
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="bg-gray-800/50 border border-gray-600">
            <CardContent className="text-center py-8">
              <div className="text-6xl mb-4">👻</div>
              <p className="text-gray-400">No posts match your current filter.</p>
              <Button
                onClick={() => setActiveFilter('all')}
                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white"
              >
                Show All Posts
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card
              key={post.id}
              className={`bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-pink-900/10 border-2 transition-all duration-300 hover:shadow-lg ${
                post.isTopGlitch 
                  ? 'border-yellow-500/50 shadow-yellow-500/20' 
                  : post.isRelatableStream
                  ? 'border-blue-500/50 shadow-blue-500/20'
                  : 'border-gray-600 hover:border-purple-500/50'
              }`}
            >
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{post.avatar}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold">{post.alias}</span>
                        {getTierBadge(post.userTier)}
                        {post.isTopGlitch && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">
                            <Flame className="h-3 w-3 mr-1" />
                            TOP GLITCH
                          </Badge>
                        )}
                        {post.isRelatableStream && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            RELATABLE
                          </Badge>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">{formatTimeAgo(post.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">
                      {post.upvotes + post.commentCount}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-white leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Emotional Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(post.emotionalTags).map(([tag, count]) => 
                    count > 0 && (
                      <Button
                        key={tag}
                        onClick={() => onReactToPost(post.id, tag as any)}
                        size="sm"
                        variant="outline"
                        className={`${getEmotionalTagColor(tag as keyof WallPost['emotionalTags'])} border-0 text-xs`}
                      >
                        {tag === 'helpOthers' ? 'Help Others' : tag.toUpperCase()} ({count})
                      </Button>
                    )
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => onReactToPost(post.id, 'upvote')}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-green-400"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.upvotes}
                    </Button>
                    
                    <Button
                      onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-blue-400"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.commentCount}
                    </Button>
                    
                    <Button
                      onClick={() => onSharePost(post.id)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-purple-400"
                    >
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => onReportPost(post.id)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm text-center">
                        💬 Comments feature coming soon...
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredPosts.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
          >
            Load More Wounds
          </Button>
        </div>
      )}
    </div>
  );
}
