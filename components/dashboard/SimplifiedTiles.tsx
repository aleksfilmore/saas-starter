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
      
      {/* No-Contact Tracker */}
      <Link href="/no-contact" className="block h-full">
        <Card className={`dashboard-card p-6 h-full transition-all ${
          featureGates.noContactTracker ? 'hover:scale-105' : 'opacity-60'
        }`}>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">No-Contact</h3>
                  {!featureGates.noContactTracker && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-xs text-gray-400">Track your progress</p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              {featureGates.noContactTracker ? (
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
              ) : (
                <p className="text-purple-200 text-sm">
                  Stay accountable with daily check-ins and streak tracking
                </p>
              )}
            </div>
            
            {featureGates.noContactTracker ? (
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
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

      {/* AI Therapy */}
      <Link href="/ai-therapy" className="block h-full">
        <Card className={`dashboard-card p-6 h-full transition-all ${
          featureGates.aiTherapy ? 'hover:scale-105' : 'opacity-60'
        }`}>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">AI Therapy</h3>
                  {!featureGates.aiTherapy && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-xs text-gray-400">
                  {featureGates.aiTherapy 
                    ? `${aiQuota.msgsLeft}/${aiQuota.totalQuota} msgs left`
                    : 'Complete ritual to unlock'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              <p className="text-purple-200 text-sm">
                {featureGates.aiTherapy 
                  ? 'Get personalized guidance from your AI co-pilot'
                  : 'Unlock AI-powered therapy sessions and emotional support'
                }
              </p>
            </div>
            
            {featureGates.aiTherapy ? (
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
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

      {/* Wall of Wounds */}
      <Link href="/wall" className="block h-full">
        <Card className={`dashboard-card p-6 h-full transition-all ${
          featureGates.wallRead ? 'hover:scale-105' : 'opacity-60'
        }`}>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Wall of Wounds</h3>
                  {user.wallPosts > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {user.wallPosts} shared
                    </Badge>
                  )}
                  {!featureGates.wallRead && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-xs text-gray-400">Anonymous community</p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              <p className="text-purple-200 text-sm">
                {featureGates.wallRead 
                  ? 'Share and connect with others on their healing journey'
                  : 'Join the anonymous community support network'
                }
              </p>
            </div>
            
            {featureGates.wallRead ? (
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                View Confessions
                <ChevronRight className="w-4 h-4 ml-1" />
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
