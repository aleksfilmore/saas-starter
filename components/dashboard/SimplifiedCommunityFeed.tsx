'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface CommunityPost {
  id: string
  content: string
  timestamp: string
  reactionsCount: number
  category: string
}

interface SimplifiedCommunityFeedProps {
  className?: string
}

// Mock community posts - in real app, fetch from API
const mockPosts: CommunityPost[] = [
  {
    id: '1',
    content: 'Day 30 no contact. The urge to text is still there but I am learning to sit with the discomfort instead of reaching for my phone.',
    timestamp: '2 hours ago',
    reactionsCount: 12,
    category: 'Progress'
  },
  {
    id: '2', 
    content: 'Anyone else find that journaling before bed helps process the day? Started writing 3 things I am grateful for and it is shifting my perspective.',
    timestamp: '4 hours ago',
    reactionsCount: 8,
    category: 'Insight'
  },
  {
    id: '3',
    content: 'Had a moment today where I realized I can love someone and still choose to protect my peace. Growth hits different.',
    timestamp: '6 hours ago',
    reactionsCount: 24,
    category: 'Breakthrough'
  },
  {
    id: '4',
    content: 'To whoever needs to hear this: You are not healing wrong, you are healing at your own pace. Trust the process.',
    timestamp: '8 hours ago',
    reactionsCount: 31,
    category: 'Support'
  }
]

export function SimplifiedCommunityFeed({ className }: SimplifiedCommunityFeedProps) {
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-carousel effect
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentPostIndex(prev => (prev + 1) % mockPosts.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentPost = mockPosts[currentPostIndex]

  const nextPost = () => {
    setCurrentPostIndex(prev => (prev + 1) % mockPosts.length)
    setIsAutoPlaying(false)
  }

  const prevPost = () => {
    setCurrentPostIndex(prev => (prev - 1 + mockPosts.length) % mockPosts.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/wall" 
          className="text-xl font-bold text-white flex items-center gap-2 hover:text-purple-300 transition-colors"
        >
          <Users className="w-5 h-5" />
          Community Feed
          <span className="text-sm text-gray-400 font-normal">+1,412 live</span>
        </Link>
      </div>
      
      <div className="relative">
        <Card className="dashboard-card p-6 min-h-[200px] relative overflow-hidden">
          
          {/* Navigation Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={prevPost}
              className="p-1.5 rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPost}
              className="p-1.5 rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-play indicator */}
          <div className="absolute top-4 left-4 z-10">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              isAutoPlaying ? 'bg-green-400' : 'bg-gray-600'
            }`} />
          </div>

          {/* Post Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPost.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="pr-16 pl-8 pt-2"
            >
              <div className="mb-4">
                <div className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mb-3">
                  {currentPost.category}
                </div>
                <p className="text-gray-200 leading-relaxed text-sm">
                  "{currentPost.content}"
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{currentPost.timestamp}</span>
                <div className="flex items-center gap-1">
                  <span>❤️ {currentPost.reactionsCount}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {mockPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPostIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPostIndex 
                    ? 'bg-purple-400' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* CTA Button */}
        <div className="text-center mt-4">
          <Link href="/wall">
            <Button 
              variant="outline"
              className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Share Your Story
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
