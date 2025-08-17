'use client';

// Force dynamic rendering for auth-dependent pages
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { 
  Shield, 
  CheckCircle, 
  Flame,
  ChevronDown,
  ChevronUp,
  Calendar,
  Settings,
  MoreVertical,
  Target,
  Award
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimplifiedHeader } from '@/components/dashboard/SimplifiedHeader'
import { useAuth } from '@/contexts/AuthContext'

interface NoContactData {
  currentStreak: number
  targetDays: number
  progress: number
  hasShield: boolean
  shieldsUsed: number
  maxShields: number
  milestones: number[]
  recentCheckIns: CheckInData[]
}

interface CheckInData {
  id: string
  date: string
  mood: number
  notes?: string
  hadTemptation: boolean
}

export default function SimplifiedNoContactPage() {
  const [isMounted, setIsMounted] = useState(false)
  const authHook = isMounted ? useAuth() : { user: null, isAuthenticated: false, isLoading: true, refetchUser: () => {} }
  const { user: authUser, isAuthenticated, isLoading: authLoading, refetchUser } = authHook
  const [data, setData] = useState<NoContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  const [showMilestones, setShowMilestones] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [canCheckIn, setCanCheckIn] = useState(true)
  const [hoursUntilNext, setHoursUntilNext] = useState(0)

  // All hooks must be called before any conditional logic
  const fetchNoContactData = useCallback(async () => {
    if (!authUser) return
    
    try {
      const response = await fetch('/api/no-contact/status')
      if (response.ok) {
        const statusData = await response.json()
        
        setCanCheckIn(statusData.canCheckIn)
        setHoursUntilNext(statusData.hoursUntilNext || 0)
        
        // Use real data from the API
        const mockData: NoContactData = {
          currentStreak: statusData.currentStreak || authUser.noContactDays,
          targetDays: 90,
          progress: Math.round((statusData.currentStreak || authUser.noContactDays) / 90 * 100),
          hasShield: (statusData.currentStreak || authUser.noContactDays) >= 7,
          shieldsUsed: Math.floor((statusData.currentStreak || authUser.noContactDays) / 30),
          maxShields: 3,
          milestones: [7, 30, 90],
          recentCheckIns: []
        }
        
        setData(mockData)
      }
    } catch (error) {
      console.error('Error fetching no-contact data:', error)
      // Fallback to authUser data
      if (authUser) {
        const fallbackData: NoContactData = {
          currentStreak: authUser.noContactDays,
          targetDays: 90,
          progress: Math.round(authUser.noContactDays / 90 * 100),
          hasShield: authUser.noContactDays >= 7,
          shieldsUsed: Math.floor(authUser.noContactDays / 30),
          maxShields: 3,
          milestones: [7, 30, 90],
          recentCheckIns: []
        }
        setData(fallbackData)
      }
    } finally {
      setLoading(false)
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      fetchNoContactData()
    }
  }, [authUser, fetchNoContactData]);

  // Conditional rendering logic comes after all hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your no-contact data...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !authUser) {
    window.location.href = '/sign-in'
    return null
  }

  const handleCheckin = async () => {
    if (!canCheckIn) return
    
    setCheckingIn(true)
    try {
      const response = await fetch('/api/no-contact/checkin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Check-in successful:', result)
        
        // Update local data
        if (data) {
          setData({
            ...data,
            currentStreak: data.currentStreak + 1,
            progress: Math.round(((data.currentStreak + 1) / data.targetDays) * 100)
          })
        }
        
        // Refresh the user context to update header and dashboard
        await refetchUser()
        
        // Refresh the status to get updated check-in availability
        fetchNoContactData()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Check-in failed:', response.status, errorData)
        alert(`Check-in failed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Check-in error:', error)
    } finally {
      setCheckingIn(false)
    }
  }

  const useShield = async () => {
    if (!data?.hasShield) return
    
    try {
      // Mock shield usage - implement actual API
      setData({
        ...data,
        shieldsUsed: data.shieldsUsed + 1
      })
    } catch (error) {
      console.error('Shield usage failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading tracker...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Failed to load tracker. Please refresh the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      
      {/* Simplified Header */}
      <SimplifiedHeader
        user={authUser}
        hasShield={data.hasShield}
        onCheckin={handleCheckin}
        onBreathing={() => {}}
        onCrisis={() => window.location.href = '/crisis-support'}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Progress Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-4">
                <Flame className="text-orange-400 w-10 h-10" />
                <div>
                  <div className="text-4xl font-bold text-orange-400">{data.currentStreak}</div>
                  <div className="text-sm text-gray-300">Day Streak</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Progress to {data.targetDays} days</span>
                  <span>{data.progress}%</span>
                </div>
                <Progress value={data.progress} className="h-3" />
              </div>

              {data.hasShield && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield className="text-blue-400 w-6 h-6" />
                  <span className="text-blue-400 font-medium">Shield Active</span>
                </div>
              )}

              {/* Check-in Button */}
              <div className="mt-6">
                <Button
                  onClick={handleCheckin}
                  disabled={!canCheckIn || checkingIn}
                  className={`px-8 py-3 text-lg font-semibold ${
                    canCheckIn && !checkingIn
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {checkingIn ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Checking In...
                    </>
                  ) : canCheckIn ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Check In Today
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      Already Checked In ({Math.ceil(hoursUntilNext)}h until next)
                    </>
                  )}
                </Button>
                {canCheckIn && (
                  <p className="text-sm text-gray-300 mt-2">
                    Click to record your daily no-contact check-in
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Milestones */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Milestones
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMilestones(!showMilestones)}
                  className="text-gray-400 hover:text-white"
                >
                  {showMilestones ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
              
              <AnimatePresence>
                {showMilestones && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {data.milestones.map((milestone) => (
                      <div
                        key={milestone}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      >
                        <span className="font-medium">{milestone} Days</span>
                        {data.currentStreak >= milestone ? (
                          <CheckCircle className="text-green-400 w-5 h-5" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-500 rounded-full" />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Shield Status */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Shield Status
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Shields Used</span>
                  <span>{data.shieldsUsed}/{data.maxShields}</span>
                </div>
                
                <Progress 
                  value={(data.shieldsUsed / data.maxShields) * 100} 
                  className="h-2"
                />
                
                {data.hasShield && (
                  <Button
                    onClick={useShield}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Use Shield
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Check-ins
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-gray-400 hover:text-white"
              >
                {showHistory ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
            
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {data.recentCheckIns.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No recent check-ins. Start your journey today!
                    </p>
                  ) : (
                    data.recentCheckIns.map((checkin) => (
                      <div
                        key={checkin.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{checkin.date}</span>
                          <Badge 
                            variant={checkin.hadTemptation ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {checkin.hadTemptation ? "Had Temptation" : "Strong Day"}
                          </Badge>
                        </div>
                        {checkin.notes && (
                          <p className="text-sm text-gray-300">{checkin.notes}</p>
                        )}
                        <div className="text-xs text-gray-400 mt-2">
                          Mood: {checkin.mood}/10
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-4">
            Stay strong on your journey to freedom
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
            className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
