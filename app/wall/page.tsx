"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, MessageCircle, Users } from 'lucide-react';

export default function WallEnhancedPage() {
  const confessions = [
    {
      text: "Finally blocked my ex after 3 months of hoping they'd change. Day 1 of my healing journey starts now.",
      hearts: 47,
      replies: 12,
      time: "2h ago"
    },
    {
      text: "Used to check their social media 20 times a day. Now it's been 2 weeks since I last looked. The urge is still there but getting weaker.",
      hearts: 89,
      replies: 23,
      time: "4h ago"
    },
    {
      text: "Therapy helped me realize I was addicted to the chaos. Learning to find peace in stillness now.",
      hearts: 156,
      replies: 31,
      time: "6h ago"
    }
  ];

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

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Share Section */}
          <Card className="bg-gray-800/80 border border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-red-400" />
                Share Your Healing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  placeholder="Share your healing journey anonymously... What wound are you transforming today?"
                  className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 min-h-[120px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">All posts are anonymous and encrypted</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Share Confession
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border border-gray-600/50 text-center">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-sm text-gray-400">Active Healers</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border border-gray-600/50 text-center">
              <CardContent className="p-4">
                <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">89,423</div>
                <div className="text-sm text-gray-400">Hearts Given</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border border-gray-600/50 text-center">
              <CardContent className="p-4">
                <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">12,891</div>
                <div className="text-sm text-gray-400">Support Messages</div>
              </CardContent>
            </Card>
          </div>

          {/* Confessions Feed */}
          <div className="space-y-4">
            {confessions.map((confession, index) => (
              <Card key={index} className="bg-gray-800/80 border border-gray-600/50">
                <CardContent className="p-6">
                  <p className="text-white text-lg leading-relaxed mb-4">{confession.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span>{confession.hearts}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{confession.replies}</span>
                      </button>
                    </div>
                    <span className="text-sm text-gray-400">{confession.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
              Load More Confessions
            </Button>
          </div>

        </div>

      </div>
    </AuthWrapper>
  );
}
