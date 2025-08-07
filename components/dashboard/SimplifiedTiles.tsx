'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, MessageSquare, Brain, Lock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getNoContactMessage } from '@/lib/no-contact-messages'

interface SimplifiedTilesProps {
  user: {
    noContactDays: number
    wallPosts: number
  }
  featureGates: {
    noContactTracker: boolean
    aiTherapy: boolean
    wallRead: boolean
  }
  aiQuota: {
    msgsLeft: number
    totalQuota: number
  }
}

export function SimplifiedTiles({ user, featureGates, aiQuota }: SimplifiedTilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Streak Tracker */}
      <Link href="/no-contact" className="block h-full">
        <Card className={`dashboard-card p-6 h-full transition-all ${
          featureGates.noContactTracker ? 'hover:scale-105' : 'opacity-60'
        }`}>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Streak Tracker</h3>
                  {user.noContactDays >= 7 && (
                    <span className="text-xs">🌙</span>
                  )}
                  {!featureGates.noContactTracker && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-xs text-gray-400">Keep ghosts out of your DMs</p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              {featureGates.noContactTracker ? (
                <div>
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-indigo-400 mb-1">
                      {user.noContactDays}
                    </div>
                    <p className="text-sm text-gray-300">days</p>
                  </div>
                  {user.noContactDays > 0 && (
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-300 leading-relaxed">
                        "{getNoContactMessage(user.noContactDays)}"
                      </p>
                    </div>
                  )}
                  {user.noContactDays === 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">
                        💡 Tap ✔️ tomorrow to start your streak.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-indigo-200 text-sm">
                  Stay accountable with daily check-ins and streak tracking
                </p>
              )}
            </div>
            
            {featureGates.noContactTracker ? (
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                View Tracker
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <div className="bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm text-center">
                Complete ritual to unlock
              </div>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* AI Therapy - Premium Access */}
      <Link href="/ai-therapy" className="block h-full">
        <Card className={`dashboard-card p-6 h-full transition-all ${
          featureGates.aiTherapy ? 'hover:scale-105' : 'opacity-60'
        }`}>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">AI Therapy</h3>
                  {!featureGates.aiTherapy && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-xs text-gray-400">
                  {featureGates.aiTherapy 
                    ? 'Unlimited sessions with fair-usage'
                    : 'Complete ritual to unlock'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              {featureGates.aiTherapy ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-300 text-sm font-medium">Premium Access</span>
                    <span className="text-green-400 text-sm font-bold">∞ Unlimited</span>
                  </div>
                  <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-500/30">
                    <p className="text-xs text-indigo-300">
                      💬 Get personalized guidance from your AI co-pilot 24/7
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-indigo-200 text-sm">
                  Unlock AI-powered therapy sessions and emotional support
                </p>
              )}
            </div>
            
            {featureGates.aiTherapy ? (
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                Start Session
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <div className="bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm text-center">
                Complete ritual to unlock
              </div>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* Community Wall - Full Access */}
      <Link href="/wall" className="block h-full">
        <Card className={`dashboard-card p-6 h-full transition-all ${
          featureGates.wallRead ? 'hover:scale-105' : 'opacity-60'
        }`}>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Community Wall</h3>
                  {user.wallPosts > 0 && (
                    <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 text-xs">
                      {user.wallPosts} shared
                    </Badge>
                  )}
                  {!featureGates.wallRead && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-xs text-gray-400">Anonymous confessions</p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              {featureGates.wallRead ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-300 text-sm font-medium">Premium Access</span>
                    <span className="text-green-400 text-sm font-bold">Full Access</span>
                  </div>
                  <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-500/30">
                    <p className="text-xs text-indigo-300">
                      💬 Post unlimited + react + send DMs
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-indigo-200 text-sm">
                  Join the anonymous community support network
                </p>
              )}
            </div>
            
            {featureGates.wallRead ? (
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                Share Your Story →
              </Button>
            ) : (
              <div className="bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm text-center">
                Reach level 5 or day 5
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
