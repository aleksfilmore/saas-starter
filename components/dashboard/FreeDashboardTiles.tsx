import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, MessageSquare, Brain, Lock, ChevronRight, Crown, Zap } from 'lucide-react'
import Link from 'next/link'
import { getNoContactMessage } from '@/lib/no-contact-messages'

interface FreeDashboardTilesProps {
  user: {
    noContactDays: number
    wallPosts: number
  }
  featureGates: {
    noContactTracker: boolean
    aiTherapy: boolean
    wallRead: boolean
  }
}

export function FreeDashboardTiles({ user, featureGates }: FreeDashboardTilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* No-Contact Tracker - Free Access */}
      <Link href="/no-contact" className="block h-full">
        <Card className="dashboard-card p-6 h-full transition-all hover:scale-105">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">No-Contact</h3>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                    FREE
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">Track your progress</p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              <div>
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {user.noContactDays}
                  </div>
                  <p className="text-sm text-gray-300">days strong</p>
                </div>
                {user.noContactDays > 0 && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-300 leading-relaxed">
                      "{getNoContactMessage(user.noContactDays)}"
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              View Tracker
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </Link>

      {/* AI Therapy - Premium Feature with Paywall */}
      <Card className="dashboard-card p-6 h-full transition-all opacity-75 relative overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Premium overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="text-center p-4">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white mb-2">Premium Feature</p>
              <Link href="/pricing">
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500">
                  <Zap className="w-4 h-4 mr-1" />
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">AI Therapy</h3>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Premium only</p>
            </div>
          </div>
          
          <div className="flex-1 mb-4">
            <p className="text-purple-200 text-sm">
              Get personalized guidance from your AI co-pilot with unlimited sessions
            </p>
          </div>
          
          <div className="bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm text-center">
            <Crown className="w-4 h-4 inline mr-1" />
            Premium Required
          </div>
        </CardContent>
      </Card>

      {/* Wall - Limited Free Access */}
      <Link href="/wall" className="block h-full">
        <Card className="dashboard-card p-6 h-full transition-all hover:scale-105">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Community Wall</h3>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                    LIMITED
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">
                  {user.wallPosts} posts shared
                </p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              <p className="text-purple-200 text-sm">
                Share your journey and read others' stories. Free users can post 3 times per day.
              </p>
              
              <div className="mt-3 p-2 bg-purple-900/30 rounded border border-purple-500/30">
                <p className="text-xs text-purple-300">
                  💡 Premium users get unlimited posts + reactions + DMs
                </p>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              Open Wall
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
