'use client'

import React from 'react'
// DEPRECATED: Use DashboardTiles instead.
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, MessageSquare, Brain, Lock, ChevronRight, Calendar, Mic, BarChart3 } from 'lucide-react'
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
  subscription?: string
}

export function SimplifiedTiles({ user, featureGates, aiQuota, subscription = 'free' }: SimplifiedTilesProps) {
  return (
    <div className="space-y-6">
      {/* Top Row - Core Premium Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
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
                    <h3 className="font-semibold text-white">AI Text Therapy</h3>
                    {!featureGates.aiTherapy && <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-xs text-gray-400">
                    {featureGates.aiTherapy 
                      ? subscription === 'premium' ? 'Unlimited messaging' : '$3.99 for 300 messages'
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

        {/* Progress Dashboard */}
        <Link href="/progress" className="block h-full">
          <Card className="dashboard-card p-6 h-full transition-all hover:scale-105">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Progress Insights</h3>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-xs">
                      NEW
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">Live metrics & analytics</p>
                </div>
              </div>
              
              <div className="flex-1 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-300 text-sm font-medium">Live Tracking</span>
                    <span className="text-green-400 text-sm font-bold">Full Access</span>
                  </div>
                  <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-500/30">
                    <p className="text-xs text-emerald-300">
                      📊 Quality metrics, emotional trends, achievement tracking
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                View Progress
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Bottom Row - Additional Premium Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Guidance */}
        <div className="block h-full">
          <Card className="dashboard-card p-6 h-full transition-all hover:scale-105">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Daily Guidance</h3>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 text-xs">
                      NEW
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">30-day commitment framework</p>
                </div>
              </div>
              
              <div className="flex-1 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 text-sm font-medium">Personalized</span>
                    <span className="text-green-400 text-sm font-bold">Premium</span>
                  </div>
                  <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-500/30">
                    <p className="text-xs text-amber-300">
                      🎯 Archetype-tailored daily guidance for your healing journey
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
                onClick={() => {
                  // For now, direct to ritual page as guidance is integrated there
                  window.location.href = '/ritual'
                }}
              >
                Today's Guidance
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Voice Therapy */}
        <div className="block h-full">
          <Card className="dashboard-card p-6 h-full transition-all hover:scale-105">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Voice AI Therapy</h3>
                    <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 text-xs">
                      PREMIUM
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">$9.99 per 15 minutes</p>
                </div>
              </div>
              
              <div className="flex-1 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-violet-300 text-sm font-medium">Real-Time Voice</span>
                    <span className="text-green-400 text-sm font-bold">Premium</span>
                  </div>
                  <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/30">
                    <p className="text-xs text-violet-300">
                      �️ Real-time voice sessions with AI - minute-based billing
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0"
                onClick={() => {
                  window.location.href = '/voice-therapy'
                }}
              >
                Start Voice Session
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

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
    </div>
  )
}
