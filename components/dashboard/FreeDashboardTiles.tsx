import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, MessageSquare, Brain, Lock, ChevronRight, Crown, Zap, Loader2 } from 'lucide-react'
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  
  const handleAITherapyPurchase = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isProcessingPayment) return
    
    setIsProcessingPayment(true)
    
    try {
      const response = await fetch('/api/ai-therapy/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsProcessingPayment(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Premium Upgrade Banner */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                🚀 Unlock Your Full Healing Journey
              </h3>
              <p className="text-purple-200 text-sm mb-3">
                Get dual rituals, unlimited rerolls, AI therapy, community posting, and more premium features
              </p>
              <div className="flex items-center gap-4 text-xs text-purple-300">
                <span className="flex items-center gap-1">
                  ✨ Dual Daily Rituals
                </span>
                <span className="flex items-center gap-1">
                  🔄 Unlimited Rerolls
                </span>
                <span className="flex items-center gap-1">
                  💬 Post on Community Wall
                </span>
              </div>
            </div>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600">
                Upgrade Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Feature Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Streak Tracker - Free Access */}
      <Link href="/no-contact" className="block h-full">
        <Card className="dashboard-card p-6 h-full transition-all hover:scale-105">
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
                  <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 text-xs">
                    FREE
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">Keep ghosts out of your DMs</p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
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
            </div>
            
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              View Tracker
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </Link>

      {/* AI Therapy - Pay per 300 messages */}
      <div className="block h-full">
        <Card className="dashboard-card p-6 h-full transition-all hover:scale-105 border-violet-500/30">
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
                    ? 'Instant break-up advice'
                    : 'Complete ritual to unlock'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              {featureGates.aiTherapy ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-violet-300 text-sm font-medium">300 Messages</span>
                    <span className="text-white text-lg font-bold">$3.99</span>
                  </div>
                  <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/30">
                    <p className="text-xs text-violet-300">
                      💬 Chat with AI co-pilot when you need it most
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-violet-200 text-sm">
                  Unlock AI-powered therapy sessions and emotional support
                </p>
              )}
            </div>
            
            {featureGates.aiTherapy ? (
              <Button 
                onClick={handleAITherapyPurchase}
                disabled={isProcessingPayment}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white border-violet-500 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get 300 messages $3.99 →'
                )}
              </Button>
            ) : (
              <Link href="/ai-therapy" className="block">
                <div className="bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm text-center hover:bg-gray-500 transition-colors">
                  Complete ritual to unlock
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Community Wall - Read Only for Free */}
      <Link href="/wall" className="block h-full">
        <Card className="dashboard-card p-6 h-full transition-all hover:scale-105">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Community Wall</h3>
                  <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 text-xs">
                    READ
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Anonymous confessions
                </p>
              </div>
            </div>
            
            <div className="flex-1 mb-4">
              <p className="text-indigo-200 text-sm">
                Read others' stories, react with empathy, and find healing through shared experiences.
              </p>
              
              <div className="mt-3 p-2 bg-indigo-900/30 rounded border border-indigo-500/30">
                <p className="text-xs text-indigo-300">
                  ✅ Read & React ⚫ Premium: Post & DM
                </p>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              Browse Confessions →
            </Button>
          </CardContent>
        </Card>
      </Link>
      </div>
    </div>
  )
}
