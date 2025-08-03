"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Zap, Share2, Flag, Crown, Clock, Users } from "lucide-react";

interface WallPost {
  id: string;
  content: string;
  category: 'confession' | 'victory' | 'struggle' | 'advice' | 'rant';
  emotionalTone: 'raw' | 'hopeful' | 'angry' | 'grateful' | 'confused';
  anonymousId: string;
  timestamp: Date;
  reactions: {
    resonate: number;
    same_loop: number;
    wisdom: number;
    strength: number;
  };
  userReaction?: string;
  comments: number;
  isOracle: boolean; // Highlighted by community votes
  daysIntoJourney: number;
}

interface LiveFeedProps {
  userId?: string;
  onPostCreate?: (post: Omit<WallPost, 'id' | 'timestamp' | 'reactions' | 'comments'>) => void;
}

export function LiveActivityFeed({ userId, onPostCreate }: LiveFeedProps) {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WallPost['category']>('confession');
  const [isPosting, setIsPosting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'oracle' | 'recent'>('all');

  // Mock data for demonstration - in real app, this would come from API
  useEffect(() => {
    const mockPosts: WallPost[] = [
      {
        id: '1',
        content: "Day 47: Saw them at the coffee shop. Didn't run away, didn't text after. Just... existed in the same space like a normal human. Small wins count, right?",
        category: 'victory',
        emotionalTone: 'hopeful',
        anonymousId: 'GHOST_RUNNER_99',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        reactions: { resonate: 23, same_loop: 5, wisdom: 12, strength: 8 },
        comments: 7,
        isOracle: true,
        daysIntoJourney: 47
      },
      {
        id: '2',
        content: "I keep writing texts I'll never send. My drafts folder is a graveyard of 'hey' messages. Why is two letters so fucking heavy?",
        category: 'struggle',
        emotionalTone: 'raw',
        anonymousId: 'DIGITAL_PHANTOM',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        reactions: { resonate: 156, same_loop: 89, wisdom: 23, strength: 12 },
        comments: 34,
        isOracle: false,
        daysIntoJourney: 12
      },
      {
        id: '3',
        content: "Plot twist: the 'closure' you're seeking can only be given by you. They're not the final boss of your healing journey - you are.",
        category: 'advice',
        emotionalTone: 'grateful',
        anonymousId: 'WISDOM_COMPILER',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        reactions: { resonate: 78, same_loop: 12, wisdom: 145, strength: 67 },
        comments: 23,
        isOracle: true,
        daysIntoJourney: 234
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleReaction = (postId: string, reactionType: keyof WallPost['reactions']) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newReactions = { ...post.reactions };
        newReactions[reactionType] += 1;
        return { ...post, reactions: newReactions, userReaction: reactionType };
      }
      return post;
    }));
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    setIsPosting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const post: WallPost = {
      id: Date.now().toString(),
      content: newPost,
      category: selectedCategory,
      emotionalTone: 'raw', // This would be AI-detected
      anonymousId: 'YOUR_ANONYMOUS_ID',
      timestamp: new Date(),
      reactions: { resonate: 0, same_loop: 0, wisdom: 0, strength: 0 },
      comments: 0,
      isOracle: false,
      daysIntoJourney: 1
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setIsPosting(false);
    onPostCreate?.(post);
  };

  const getCategoryColor = (category: WallPost['category']) => {
    const colors = {
      confession: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      victory: 'bg-green-500/20 text-green-400 border-green-500/50',
      struggle: 'bg-red-500/20 text-red-400 border-red-500/50',
      advice: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      rant: 'bg-orange-500/20 text-orange-400 border-orange-500/50'
    };
    return colors[category];
  };

  const getCategoryEmoji = (category: WallPost['category']) => {
    const emojis = {
      confession: '💭',
      victory: '🏆',
      struggle: '💔',
      advice: '💡',
      rant: '🔥'
    };
    return emojis[category];
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'oracle') return post.isOracle;
    if (filter === 'recent') return new Date().getTime() - post.timestamp.getTime() < 1000 * 60 * 60 * 2; // 2 hours
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Post Creation */}
      <Card className="bg-gray-900/30 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Share Anonymously</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Selection */}
          <div className="flex flex-wrap gap-2">
            {(['confession', 'victory', 'struggle', 'advice', 'rant'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? getCategoryColor(category)
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {getCategoryEmoji(category)} {category}
              </button>
            ))}
          </div>

          {/* Post Input */}
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? This is a safe space..."
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
            rows={4}
            maxLength={500}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {newPost.length}/500 characters • Your identity is protected
            </span>
            <Button 
              onClick={handlePostSubmit}
              disabled={!newPost.trim() || isPosting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isPosting ? 'Posting...' : 'Share Anonymously'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Wall of Wounds</h2>
        <div className="flex space-x-2">
          {(['all', 'oracle', 'recent'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                filter === filterType
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filterType === 'oracle' && <Crown className="w-3 h-3 inline mr-1" />}
              {filterType === 'recent' && <Clock className="w-3 h-3 inline mr-1" />}
              {filterType === 'all' && <Users className="w-3 h-3 inline mr-1" />}
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className={`bg-gray-900/30 border-gray-700 ${post.isOracle ? 'ring-2 ring-yellow-500/50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {getCategoryEmoji(post.category)} {post.category}
                  </Badge>
                  {post.isOracle && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      <Crown className="w-3 h-3 mr-1" />
                      Oracle
                    </Badge>
                  )}
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div>Day {post.daysIntoJourney}</div>
                  <div>{getTimeAgo(post.timestamp)}</div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {post.anonymousId}
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Reactions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReaction(post.id, 'resonate')}
                      className={`flex items-center space-x-1 text-xs transition-colors ${
                        post.userReaction === 'resonate' 
                          ? 'text-purple-400' 
                          : 'text-gray-400 hover:text-purple-400'
                      }`}
                    >
                      <Heart className="w-3 h-3" />
                      <span>{post.reactions.resonate}</span>
                    </button>
                    <button
                      onClick={() => handleReaction(post.id, 'same_loop')}
                      className={`flex items-center space-x-1 text-xs transition-colors ${
                        post.userReaction === 'same_loop' 
                          ? 'text-blue-400' 
                          : 'text-gray-400 hover:text-blue-400'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>{post.reactions.same_loop}</span>
                    </button>
                    <button
                      onClick={() => handleReaction(post.id, 'wisdom')}
                      className={`flex items-center space-x-1 text-xs transition-colors ${
                        post.userReaction === 'wisdom' 
                          ? 'text-green-400' 
                          : 'text-gray-400 hover:text-green-400'
                      }`}
                    >
                      <Crown className="w-3 h-3" />
                      <span>{post.reactions.wisdom}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.comments}</span>
                  </button>

                  {/* Share */}
                  <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300">
                    <Share2 className="w-3 h-3" />
                  </button>

                  {/* Report */}
                  <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-400">
                    <Flag className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
          Load More Stories
        </Button>
      </div>
    </div>
  );
}
