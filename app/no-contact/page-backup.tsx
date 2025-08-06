'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [data, setData] = useState<NoContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [showMilestones, setShowMilestones] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [canCheckIn, setCanCheckIn] = useState(true)
  const [hoursUntilNext, setHoursUntilNext] = useState(0)

  // Redirect if not authenticated
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

  useEffect(() => {
    if (authUser) {
      fetchNoContactData()
    }
  }, [authUser])

  const fetchNoContactData = async () => {
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
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async () => {
    setCheckingIn(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Update streak
      if (data) {
        setData({
          ...data,
          currentStreak: data.currentStreak + 1,
          progress: ((data.currentStreak + 1) / data.targetDays) * 100
        })
      }
    } catch (error) {
      console.error('Check-in failed:', error)
    } finally {
      setCheckingIn(false)
    }
  }

  const useShield = async () => {
    if (!data?.hasShield) return
    
    try {
      // Mock shield usage
      setData({
        ...data,
        hasShield: false,
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          
          {/* Consolidated Streak Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="dashboard-card p-8 relative">
              
              {/* Settings Kebab Menu */}
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  
                  <AnimatePresence>
                    {showSettingsMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50"
                      >
                        <div className="py-2">
                          <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            📊 Resources
                          </button>
                          <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            📈 Analytics
                          </button>
                          <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            ⚙️ Settings
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                  <Shield className="h-8 w-8 text-blue-400" />
                  No-Contact Tracker
                </h1>

                {/* Main Streak Display */}
                <div className="mb-8">
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    {/* Progress Ring */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#progress-gradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${data.progress * 2.83} 283`}
                        className="transition-all duration-500"
                      />
                      <defs>
                        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Flame className="h-8 w-8 text-orange-400 mb-2" />
                      <div className="text-4xl font-bold text-white">{data.currentStreak}</div>
                      <div className="text-gray-400 text-sm">days strong</div>
                    </div>
                  </div>

                  <div className="text-gray-300 mb-6">
                    <span className="text-lg">{Math.round(data.progress)}% to {data.targetDays} days</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    onClick={handleCheckin}
                    disabled={checkingIn}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
                  >
                    {checkingIn ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Checking In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Check In</span>
                      </div>
                    )}
                  </Button>

                  {data.hasShield && (
                    <Button
                      onClick={useShield}
                      variant="outline"
                      className="border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20 px-6 py-3"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Use Shield
                    </Button>
                  )}
                </div>

                {/* Shield Status */}
                {!data.hasShield && (
                  <p className="text-gray-400 text-sm">
                    Shield reloads in {7 - (data.currentStreak % 7)} days
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Accordion Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            
            {/* History Accordion */}
            <Card className="dashboard-card">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">History ({data.recentCheckIns.length})</span>
                </div>
                {showHistory ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="pt-0 pb-6">
                      <div className="space-y-3">
                        {data.recentCheckIns.map((checkIn) => (
                          <div key={checkIn.id} className="border-l-2 border-blue-500/30 pl-4 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium">{checkIn.date}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-blue-400">Mood: {checkIn.mood}/10</span>
                                {checkIn.hadTemptation && (
                                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/50">
                                    Had temptation
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {checkIn.notes && (
                              <p className="text-gray-300 text-sm">{checkIn.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Milestones Accordion */}
            <Card className="dashboard-card">
              <button
                onClick={() => setShowMilestones(!showMilestones)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-medium">Milestones</span>
                </div>
                {showMilestones ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {showMilestones && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="pt-0 pb-6">
                      <div className="flex items-center gap-4 justify-center">
                        {data.milestones.map((milestone) => (
                          <div
                            key={milestone}
                            className={`flex flex-col items-center p-3 rounded-lg border ${
                              data.currentStreak >= milestone
                                ? 'border-green-500/50 bg-green-500/10'
                                : 'border-gray-600/50 bg-gray-800/50'
                            }`}
                          >
                            {data.currentStreak >= milestone ? (
                              <Award className="h-6 w-6 text-green-400 mb-1" />
                            ) : (
                              <Target className="h-6 w-6 text-gray-400 mb-1" />
                            )}
                            <span className={`font-bold ${
                              data.currentStreak >= milestone ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {milestone}
                            </span>
                            <span className="text-xs text-gray-500">days</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Back to Dashboard */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
