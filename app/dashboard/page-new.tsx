'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
import { useAuth } from '@/contexts/AuthContext'

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

interface DashboardData {
  user: UserData
  todayRituals: Ritual[]
  featureGates: {
    noContactTracker: boolean
    aiTherapy: boolean
    wallRead: boolean
    progressAnalytics: boolean
    [key: string]: boolean
  }
  aiQuota: {
    msgsLeft: number
    totalQuota: number
    resetAt: string
    canPurchaseMore: boolean
    purchaseCost: number
  }
  stats: {
    ritualsCompleted: number
    totalRituals: number
    streakActive: boolean
    canReroll: boolean
    rerollsLeft: number
  }
}

export default function DashboardPage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading, updateUser, refetchUser } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [noContactStatus, setNoContactStatus] = useState<any>(null)
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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!authUser) return
    
    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          'x-user-email': authUser.email
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch no-contact status
  const fetchNoContactStatus = async () => {
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
  }

  // Initial data fetch
  useEffect(() => {
    if (authUser && isAuthenticated && !authLoading) {
      fetchDashboardData()
      fetchNoContactStatus()
    }
  }, [authUser, isAuthenticated, authLoading])

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

  const handleQuickMood = () => {
    setShowMoodModal(true)
  }

  const handleBreathing = () => {
    setShowBreathingModal(true)
  }

  const handleCrisis = () => {
    window.location.href = '/crisis-support'
  }

  if (authLoading || loading || !authUser || !isAuthenticated) {
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

  const { user: dashboardUser, todayRituals, featureGates, aiQuota, stats } = dashboardData
  const todayRitual = todayRituals?.[0] || null
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
        showShield={hasShield}
        onQuickMood={handleQuickMood}
        onBreathing={handleBreathing}
        onCrisis={handleCrisis}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SimplifiedHeroRitualCard
              ritual={todayRitual}
              user={authUser}
              onComplete={handleRitualComplete}
              isCompleted={todayRitual ? completedRituals.includes(todayRitual.id) : false}
            />

            <DualRituals
              user={authUser}
              onComplete={handleRitualComplete}
              completedRituals={completedRituals}
            />

            {authUser.subscriptionTier === 'free' ? (
              <FreeDashboardTiles
                user={authUser}
                featureGates={featureGates}
                aiQuota={aiQuota}
                stats={stats}
                noContactStatus={noContactStatus}
                onNoContactCheckin={() => setShowCheckinModal(true)}
              />
            ) : (
              <SimplifiedTiles
                user={authUser}
                featureGates={featureGates}
                aiQuota={aiQuota}
                stats={stats}
                noContactStatus={noContactStatus}
                onNoContactCheckin={() => setShowCheckinModal(true)}
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
          onCheckin={handleNoContactCheckin}
          currentDays={authUser.noContactDays}
        />
      )}

      {showMoodModal && (
        <MoodCheckIn
          isOpen={showMoodModal}
          onClose={() => setShowMoodModal(false)}
        />
      )}

      {showBreathingModal && (
        <BreathingExercise
          isOpen={showBreathingModal}
          onClose={() => setShowBreathingModal(false)}
        />
      )}

      <LumoOnboarding />
    </div>
  )
}
