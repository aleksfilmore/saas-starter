'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { SimplifiedHeader } from '@/components/dashboard/SimplifiedHeader'
import { SimplifiedHeroRitualCard } from '@/components/dashboard/SimplifiedHeroRitualCard'
import { SimplifiedTiles } from '@/components/dashboard/SimplifiedTiles'
import { FreeDashboardTiles } from '@/components/dashboard/FreeDashboardTiles'
import { SimplifiedCommunityFeed } from '@/components/dashboard/SimplifiedCommunityFeed'
import { NoContactCheckinModal } from '@/components/dashboard/NoContactCheckinModal'
import { MoodCheckIn } from '@/components/quick-actions/MoodCheckIn'
import { BreathingExercise } from '@/components/quick-actions/BreathingExercise'
import { LumoOnboarding } from '@/components/onboarding/LumoOnboarding'
import { DualRituals } from '@/components/dashboard/DualRituals'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'

// Types
interface UserData {
  id: string
  username: string
  level: number
  xp: number
  nextLevelXP: number
  progressToNext: number
  bytes: number
  streak: number
  longestStreak: number
  noContactDays: number
  avatar: string
  uxStage: string
  wallPosts: number
  subscriptionTier?: 'free' | 'premium'
}

interface Ritual {
  id: string
  title: string
  description: string
  category: string
  intensity: number
  duration: number
  isCompleted: boolean
  completedAt?: string
}

export default function DashboardPage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading, updateUser, refetchUser } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading, canAccessWallPreview, hasAIQuota, aiQuota } = useDashboard()
  const [noContactStatus, setNoContactStatus] = useState<{isNoContact: boolean} | null>(null)
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [showBreathingModal, setShowBreathingModal] = useState(false)
  const [showMoodModal, setShowMoodModal] = useState(false)
  const [completedRituals, setCompletedRituals] = useState<string[]>([])

  // Load completed rituals from localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const completed = localStorage.getItem(`completed-rituals-${today}`)
    if (completed) {
      setCompletedRituals(JSON.parse(completed))
    }
  }, [])

  // Fetch no-contact status
  const fetchNoContactStatus = useCallback(async () => {
    if (!authUser) return
    
    try {
      const response = await fetch('/api/no-contact/status')
      if (response.ok) {
        const data = await response.json()
        setNoContactStatus(data)
      }
    } catch (error) {
      console.error('Error fetching no-contact status:', error)
    }
  }, [authUser]);

  // Initial data fetch
  useEffect(() => {
    if (authUser && isAuthenticated && !authLoading) {
      fetchNoContactStatus()
    }
  }, [authUser, isAuthenticated, authLoading, fetchNoContactStatus])

  // Handle hero ritual completion
  const handleHeroRitualComplete = async (ritualId: string) => {
    await handleRitualComplete(ritualId, 'medium') // Default to medium for hero ritual
  }

  const handleReroll = async () => {
    // TODO: Implement reroll functionality
    console.log('Reroll requested')
  }
  const handleDualRitualComplete = async (ritualId: string, xpGained: number) => {
    try {
      // Map xp to difficulty - rough approximation
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy'
      if (xpGained >= 100) difficulty = 'hard'
      else if (xpGained >= 50) difficulty = 'medium'
      
      const response = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ritualId, difficulty })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update local state
        const today = new Date().toDateString()
        const newCompleted = [...completedRituals, ritualId]
        setCompletedRituals(newCompleted)
        localStorage.setItem(`completed-rituals-${today}`, JSON.stringify(newCompleted))
        
        // Update user data
        if (result.user) {
          await updateUser(result.user)
        }
        
        console.log('Ritual completed!', result)
      }
    } catch (error) {
      console.error('Error completing ritual:', error)
    }
  }

  // Handle ritual completion
  const handleRitualComplete = async (ritualId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      const response = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ritualId, difficulty })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update local state
        const today = new Date().toDateString()
        const newCompleted = [...completedRituals, ritualId]
        setCompletedRituals(newCompleted)
        localStorage.setItem(`completed-rituals-${today}`, JSON.stringify(newCompleted))
        
        // Update user data
        if (result.user) {
          await updateUser(result.user)
        }
        
        // Show success message or modal
        console.log('Ritual completed!', result)
      }
    } catch (error) {
      console.error('Error completing ritual:', error)
    }
  }

  const handleNoContactCheckin = async () => {
    try {
      const response = await fetch('/api/no-contact/checkin', {
        method: 'POST'
      })
      
      if (response.ok) {
        await refetchUser()
        await fetchNoContactStatus()
        setShowCheckinModal(false)
      }
    } catch (error) {
      console.error('Error with no-contact checkin:', error)
    }
  }

  const handleBreathing = () => {
    setShowBreathingModal(true)
  }

  const handleCrisis = () => {
    window.location.href = '/crisis-support'
  }

  if (authLoading || dashboardLoading || !authUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Failed to load dashboard. Please refresh the page.</p>
        </div>
      </div>
    )
  }

  // Use helper methods from the hook instead of destructuring
  const todayRitual = dashboardData?.ritual || null
  
  // Transform the dashboard ritual to match component interface
  const transformedRitual = todayRitual ? {
    id: todayRitual.id,
    title: todayRitual.name,
    description: todayRitual.description,
    category: 'daily', // Default category
    intensity: todayRitual.difficulty,
    duration: 15, // Default duration
    isCompleted: completedRituals.includes(todayRitual.id)
  } : null
  const hasShield = authUser.streak >= 7

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <SimplifiedHeader
        user={{
          username: authUser.username,
          streak: authUser.streak,
          bytes: authUser.bytes,
          level: authUser.level,
          noContactDays: authUser.noContactDays,
          subscriptionTier: authUser.subscriptionTier
        }}
        hasShield={hasShield}
        onCheckin={() => setShowCheckinModal(true)}
        onBreathing={handleBreathing}
        onCrisis={handleCrisis}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section with Subtitle */}
            <div className="text-center mb-6">
              <p className="text-purple-200 text-lg font-medium">
                Build your Firewall — one breath at a time.
              </p>
            </div>
            
            <SimplifiedHeroRitualCard
              ritual={transformedRitual}
              onComplete={handleHeroRitualComplete}
              onReroll={handleReroll}
            />

            {/* Conditional Ritual Display */}
            {authUser.subscriptionTier === 'premium' ? (
              <DualRituals
                userSubscription={authUser.subscriptionTier}
                onRitualComplete={handleDualRitualComplete}
                completedRituals={completedRituals}
              />
            ) : (
              /* Free users get simplified ritual experience within FreeDashboardTiles */
              null
            )}

            {authUser.subscriptionTier === 'free' ? (
              <FreeDashboardTiles
                user={{
                  noContactDays: authUser.noContactDays,
                  wallPosts: 0
                }}
                featureGates={{ noContactTracker: true, aiTherapy: hasAIQuota, wallRead: canAccessWallPreview }}
              />
            ) : (
              <SimplifiedTiles
                user={{
                  noContactDays: authUser.noContactDays,
                  wallPosts: 0
                }}
                featureGates={{ noContactTracker: true, aiTherapy: hasAIQuota, wallRead: canAccessWallPreview }}
                aiQuota={{ msgsLeft: aiQuota, totalQuota: aiQuota }}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <SimplifiedCommunityFeed />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCheckinModal && (
        <NoContactCheckinModal
          isOpen={showCheckinModal}
          onClose={() => setShowCheckinModal(false)}
          currentStreak={authUser.noContactDays}
          onCheckinComplete={async () => {
            await handleNoContactCheckin()
          }}
        />
      )}

      {showMoodModal && (
        <Dialog open={showMoodModal} onOpenChange={() => setShowMoodModal(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>How are you feeling?</DialogTitle>
            </DialogHeader>
            <MoodCheckIn
              onComplete={(mood) => {
                console.log('Mood selected:', mood)
                setShowMoodModal(false)
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {showBreathingModal && (
        <Dialog open={showBreathingModal} onOpenChange={() => setShowBreathingModal(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Breathing Exercise</DialogTitle>
            </DialogHeader>
            <BreathingExercise
              onComplete={(pattern, cycles) => {
                console.log('Breathing exercise completed:', pattern, cycles)
                setShowBreathingModal(false)
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <LumoOnboarding
        isFirstTimeUser={false}
        onDismiss={() => console.log('Onboarding dismissed')}
        onStartNoContact={() => window.location.href = '/no-contact'}
        onViewRituals={() => window.location.href = '/ritual'}
      />
    </div>
  )
}
