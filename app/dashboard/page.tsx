'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Calendar, 
  Sparkles, 
  MessageSquare, 
  BarChart3,
  Flame,
  Coins,
  Zap,
  Award,
  Heart,
  Target,
  Play,
  Lock,
  AlertTriangle,
  ChevronRight,
  Users,
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react'

// Components
import { 
  DashboardLayout,
  WelcomeSection,
  HeroSection,
  StatsStrip,
  SecondaryTiles,
  QuickActionRow,
  CommunityFeed
} from '@/components/dashboard/DashboardLayout'
import { HeroRitualCard } from '@/components/dashboard/HeroRitualCard'
import { useFeatureGates } from '@/hooks/useFeatureGates'
import { MoodCheckIn } from '@/components/quick-actions/MoodCheckIn'
import { BreathingExercise } from '@/components/quick-actions/BreathingExercise'
import { GratitudeJournal } from '@/components/quick-actions/GratitudeJournal'
import { NoContactCheckinModal } from '@/components/dashboard/NoContactCheckinModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AuthWrapper from '@/components/AuthWrapper'

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
  featureGates: Record<string, boolean>
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
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeUntilReset, setTimeUntilReset] = useState(0)
  const [noContactStatus, setNoContactStatus] = useState<any>(null)
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const { useFeatureGate } = useFeatureGates()

  useEffect(() => {
    fetchDashboardData()
    fetchNoContactStatus()
    
    // Update timer every minute
    const timer = setInterval(() => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      setTimeUntilReset(tomorrow.getTime() - now.getTime())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Get user email from localStorage (set during login)
      const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com'
      
      const response = await fetch('/api/dashboard', {
        headers: {
          'x-user-email': userEmail
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        console.error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNoContactStatus = async () => {
    try {
      const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com'
      
      const response = await fetch('/api/no-contact/checkin', {
        headers: {
          'x-user-email': userEmail
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNoContactStatus(data)
      }
    } catch (error) {
      console.error('No-contact status fetch error:', error)
    }
  }

  const handleRitualComplete = async (ritualId: string) => {
    try {
      const response = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ritualId }),
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to complete ritual:', error)
      throw error
    }
  }

  const handleRitualReroll = async () => {
    try {
      const response = await fetch('/api/rituals/reroll', {
        method: 'POST',
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
      } else {
        const error = await response.json()
        throw new Error(error.error)
      }
    } catch (error) {
      console.error('Failed to reroll ritual:', error)
      throw error
    }
  }

  const handleAIQuotaPurchase = async () => {
    try {
      const response = await fetch('/api/ai/quota', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'purchase' }),
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to purchase AI quota:', error)
    }
  }

  const handleUseShield = async () => {
    try {
      const response = await fetch('/api/no-contact/use-shield', {
        method: 'PATCH',
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to use shield:', error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-purple-200">Loading your healing console...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-300">Failed to load dashboard. Please try refreshing.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { user, todayRituals, featureGates, aiQuota, stats } = dashboardData
  const todayRitual = todayRituals[0] || null

  return (
    <AuthWrapper>
      <DashboardLayout>
        {/* Enhanced Header with Navigation to Advanced Console */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Healing Dashboard
              </h1>
              <p className="text-purple-300">Your personalized recovery command center</p>
            </div>
            
            {/* Quick Access to Advanced Features */}
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/glow-up-console">
                <Button className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold px-4 py-2">
                  <Star className="h-4 w-4 mr-2" />
                  GLOW-UP CONSOLE
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/ai-therapy">
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Therapy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      {/* Welcome + Level Bar */}
      <WelcomeSection>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl mr-4">
              {user.avatar || '🔥'}
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome back, {user.username || 'Warrior'}
              </h1>
              <div className="flex items-center gap-2 text-purple-200">
                <span>Level {user.level}</span>
                <span>•</span>
                <span className="capitalize">{user.uxStage?.replace('_', ' ')} Stage</span>
              </div>
            </div>
          </div>
          
          {/* Level Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Level {user.level}</span>
              <span>{user.xp.toLocaleString()} / {user.nextLevelXP.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${user.progressToNext}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </WelcomeSection>

      {/* Today's Ritual (Hero Card) */}
      <HeroSection>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2">Today's Healing Protocol</h2>
          <p className="text-purple-200 text-sm">Your personalized ritual for growth and healing</p>
        </div>
        <HeroRitualCard
          ritual={todayRitual}
          timeUntilReset={timeUntilReset}
          canReroll={stats.canReroll}
          onComplete={handleRitualComplete}
          onReroll={handleRitualReroll}
          className="mobile-hero"
        />
      </HeroSection>

      {/* Streak + Bytes Strip */}
      <StatsStrip>
        <div className="dashboard-card p-4 flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-400" />
          <div>
            <p className="text-sm text-gray-400">Streak</p>
            <p className="text-lg font-bold text-orange-400">{user.streak} days</p>
          </div>
        </div>
        
        <div className="dashboard-card p-4 flex items-center gap-3">
          <Coins className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-sm text-gray-400">Bytes</p>
            <p className="text-lg font-bold text-yellow-400">{user.bytes}</p>
          </div>
        </div>
        
        {/* No-Contact Check-in Pill */}
        <div 
          className={`dashboard-card p-4 flex items-center gap-3 cursor-pointer transition-all hover:scale-105 ${
            noContactStatus?.status === 'need_check' ? 'bg-yellow-500/20 border-yellow-500/50' :
            noContactStatus?.status === 'threatened' ? 'bg-red-500/20 border-red-500/50' :
            'bg-blue-500/20 border-blue-500/50'
          }`}
          onClick={() => {
            if (noContactStatus?.canCheckIn) {
              setShowCheckinModal(true);
            }
          }}
        >
          <Shield className={`w-6 h-6 ${
            noContactStatus?.status === 'need_check' ? 'text-yellow-400' :
            noContactStatus?.status === 'threatened' ? 'text-red-400' :
            'text-blue-400'
          }`} />
          <div>
            <p className="text-sm text-gray-400">
              {noContactStatus?.status === 'need_check' ? 'Check-in Needed' :
               noContactStatus?.status === 'threatened' ? 'Streak Threatened' :
               'No-Contact'}
            </p>
            <p className={`text-lg font-bold ${
              noContactStatus?.status === 'need_check' ? 'text-yellow-400' :
              noContactStatus?.status === 'threatened' ? 'text-red-400' :
              'text-blue-400'
            }`}>
              {user.noContactDays} days
            </p>
          </div>
        </div>
        
        <div className="dashboard-card p-4 flex items-center gap-3">
          <Award className="w-6 h-6 text-pink-400" />
          <div>
            <p className="text-sm text-gray-400">Level</p>
            <p className="text-lg font-bold text-pink-400">{user.level}</p>
          </div>
        </div>
      </StatsStrip>

      {/* Secondary Tiles (2x2 Grid) */}
      <SecondaryTiles>
        {/* No-Contact Tracker */}
        <FeatureTile
          icon={Shield}
          title="No-Contact Tracker"
          description="Track your journey to freedom"
          ctaText="Track Day"
          ctaColor="from-blue-500 to-cyan-500"
          isGated={!featureGates.noContactTracker}
          gateReason="Always available"
          href="/no-contact"
          badge={`${user.noContactDays} days`}
        />

        {/* Daily Logs */}
        <FeatureTile
          icon={Calendar}
          title="Daily Logs"
          description="Track your mood and progress"
          ctaText="Add Mood"
          ctaColor="from-green-500 to-teal-500"
          isGated={!featureGates.dailyLogs}
          gateReason="Complete your first ritual"
          href="/daily-rituals"
        />

        {/* AI Therapy */}
        <FeatureTile
          icon={Sparkles}
          title="AI Therapy"
          description="Chat with your healing companion"
          ctaText={`Start Chat (${aiQuota.msgsLeft} left)`}
          ctaColor="from-purple-500 to-pink-500"
          isGated={!featureGates.aiTherapy}
          gateReason="Reach level 3 or day 3"
          href="/ai-therapy"
          onSecondaryAction={aiQuota.canPurchaseMore ? handleAIQuotaPurchase : undefined}
          secondaryActionText={`+20 msgs (${aiQuota.purchaseCost} bytes)`}
        />

        {/* Wall Read */}
        <FeatureTile
          icon={MessageSquare}
          title="Wall of Wounds"
          description="Connect with the community"
          ctaText="View Confessions"
          ctaColor="from-orange-500 to-red-500"
          isGated={!featureGates.wallRead}
          gateReason="Reach level 5 or day 5"
          href="/wall"
          badge={`${user.wallPosts} shared`}
        />
      </SecondaryTiles>

      {/* Quick Action Row (Icon Chips) */}
      <QuickActionRow>
        <MoodCheckIn onComplete={async (mood) => {
          try {
            const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com';
            const response = await fetch('/api/mood', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': userEmail
              },
              body: JSON.stringify({ mood: mood.value, notes: '' })
            });
            
            if (response.ok) {
              await fetchDashboardData(); // Refresh to show updated XP/Bytes
            }
          } catch (error) {
            console.error('Failed to log mood:', error);
          }
        }} />
        
        <BreathingExercise onComplete={async (pattern, cycles) => {
          try {
            const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com';
            const response = await fetch('/api/breathing', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': userEmail
              },
              body: JSON.stringify({ pattern, completedCycles: cycles })
            });
            
            if (response.ok) {
              await fetchDashboardData(); // Refresh to show updated XP/Bytes
            }
          } catch (error) {
            console.error('Failed to log breathing exercise:', error);
          }
        }} />
        
        <GratitudeJournal onComplete={async (entries) => {
          try {
            const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com';
            const response = await fetch('/api/gratitude', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': userEmail
              },
              body: JSON.stringify({ entries })
            });
            
            if (response.ok) {
              await fetchDashboardData(); // Refresh to show updated XP/Bytes
            }
          } catch (error) {
            console.error('Failed to save gratitude entries:', error);
          }
        }} />
        
        <QuickActionChip
          icon={Shield}
          label="Use Shield"
          onClick={handleUseShield}
          disabled={user.streak < 7} // Require 7-day streak
        />
        <QuickActionChip
          icon={Users}
          label="Community"
          onClick={() => window.location.href = '/wall'}
        />
      </QuickActionRow>

      {/* Resources Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Healing Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Crisis Support */}
          <Card className="dashboard-card p-4 hover:scale-105 transition-all">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Crisis Support</h3>
                  <p className="text-xs text-gray-400">24/7 Emergency Help</p>
                </div>
              </div>
              <p className="text-sm text-purple-200 mb-3">
                Immediate support when you need it most
              </p>
              <Button 
                size="sm" 
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={() => window.location.href = '/crisis-support'}
              >
                Get Help Now
              </Button>
            </CardContent>
          </Card>

          {/* Healing Library */}
          <Card className="dashboard-card p-4 hover:scale-105 transition-all">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Ritual Library</h3>
                  <p className="text-xs text-gray-400">Browse All Exercises</p>
                </div>
              </div>
              <p className="text-sm text-purple-200 mb-3">
                Explore healing protocols and exercises
              </p>
              <Button 
                size="sm" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => window.location.href = '/daily-rituals'}
              >
                Browse Library
              </Button>
            </CardContent>
          </Card>

          {/* Progress Analytics */}
          <Card className="dashboard-card p-4 hover:scale-105 transition-all">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Progress Analytics</h3>
                  <p className="text-xs text-gray-400">Track Your Growth</p>
                </div>
              </div>
              <p className="text-sm text-purple-200 mb-3">
                Visualize your healing journey
              </p>
              <Button 
                size="sm" 
                className={`w-full ${featureGates.progressAnalytics 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-600 cursor-not-allowed'}`}
                disabled={!featureGates.progressAnalytics}
                onClick={() => featureGates.progressAnalytics && (window.location.href = '/progress')}
              >
                {featureGates.progressAnalytics ? 'View Analytics' : 'Upgrade to Unlock'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Feed Preview */}
      <CommunityFeed>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Community Activity</h2>
          <Link 
            href="/wall" 
            className="text-purple-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="text-sm">Visit Wall</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <Card className="dashboard-card p-6">
          <div className="text-center text-purple-200">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <p className="mb-4">Connect with others on their healing journey</p>
            <Button 
              className="cta-button"
              onClick={() => window.location.href = '/wall'}
            >
              Enter the Wall
            </Button>
          </div>
        </Card>
      </CommunityFeed>

      {/* No-Contact Check-in Modal */}
      <NoContactCheckinModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        currentStreak={user.noContactDays}
        onCheckinComplete={() => {
          fetchDashboardData();
          fetchNoContactStatus();
        }}
      />
      </DashboardLayout>
    </AuthWrapper>
  )
}

// Helper Components
interface FeatureTileProps {
  icon: React.ElementType
  title: string
  description: string
  ctaText: string
  ctaColor: string
  isGated: boolean
  gateReason?: string
  href?: string
  badge?: string
  onSecondaryAction?: () => void
  secondaryActionText?: string
}

function FeatureTile({
  icon: Icon,
  title,
  description,
  ctaText,
  ctaColor,
  isGated,
  gateReason,
  href,
  badge,
  onSecondaryAction,
  secondaryActionText
}: FeatureTileProps) {
  const content = (
    <Card className={`dashboard-card p-6 h-full transition-all ${isGated ? 'tile-gated' : 'hover:scale-105'}`}>
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${ctaColor}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{title}</h3>
              {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
              {isGated && <Lock className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
        </div>
        
        <p className="text-purple-200 text-sm mb-4 flex-1">{description}</p>
        
        {isGated ? (
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">{gateReason}</p>
            <div className="bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm">
              Locked
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button className={`w-full bg-gradient-to-r ${ctaColor} text-white border-0 transition-all hover:scale-105`}>
              {ctaText}
            </Button>
            {onSecondaryAction && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onSecondaryAction()
                }}
                className="w-full text-xs text-purple-300 hover:text-white"
              >
                {secondaryActionText}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (isGated || !href) {
    return content
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  )
}

interface QuickActionChipProps {
  icon: React.ElementType
  label: string
  onClick: () => void
  disabled?: boolean
}

function QuickActionChip({ icon: Icon, label, onClick, disabled = false }: QuickActionChipProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-purple-500/20 hover:text-white hover:scale-105'
      } text-purple-300`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Button>
  )
}