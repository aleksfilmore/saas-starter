"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, 
  Trophy, 
  Zap, 
  Target, 
  Calendar,
  Star,
  Award,
  TrendingUp,
  Clock,
  Heart,
  Brain,
  Shield
} from 'lucide-react'
import { RITUAL_CATEGORIES, RITUAL_BANK, type RitualCategory } from '@/lib/rituals/ritual-bank'

interface RitualProgressProps {
  userTier: 'ghost' | 'firewall' | 'deep-reset'
  currentStreak: number
  totalXP: number
  totalBytes: number
  completedRituals: string[]
  weeklyProgress: {
    day: string
    completed: boolean
    ritualId?: string
  }[]
}

const tierBenefits = {
  'ghost': {
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
    name: 'Ghost Mode',
    description: 'Free tier with essential healing rituals',
    ritualAccess: '20% of ritual vault',
    features: ['Basic ritual access', 'Daily streak tracking', 'Community wall access']
  },
  'firewall': {
    color: 'text-blue-400',
    bgColor: 'bg-blue-100',
    name: 'Firewall Mode',
    description: 'Enhanced protection with advanced rituals',
    ritualAccess: '70% of ritual vault',
    features: ['Advanced rituals', 'AI therapy sessions', 'Priority support', 'Custom ritual scheduling']
  },
  'deep-reset': {
    color: 'text-purple-400',
    bgColor: 'bg-purple-100',
    name: 'Deep Reset Protocol',
    description: 'Complete emotional system override',
    ritualAccess: '100% of ritual vault',
    features: ['Full ritual vault', 'Personalized therapy', '1-on-1 coaching', 'Custom ritual creation', 'Advanced analytics']
  }
}

export default function RitualProgressDashboard({ 
  userTier, 
  currentStreak, 
  totalXP, 
  totalBytes, 
  completedRituals,
  weeklyProgress 
}: RitualProgressProps) {
  const [selectedCategory, setSelectedCategory] = useState<RitualCategory>('grief-cycle')
  
  const getTierHierarchy = () => ({ 'ghost': 0, 'firewall': 1, 'deep-reset': 2 })
  const userTierLevel = getTierHierarchy()[userTier]
  
  const accessibleRituals = RITUAL_BANK.filter(ritual => {
    const ritualTierLevel = getTierHierarchy()[ritual.tier]
    return ritualTierLevel <= userTierLevel
  })
  
  const categoryProgress = Object.keys(RITUAL_CATEGORIES).map(category => {
    const categoryRituals = accessibleRituals.filter(r => r.category === category)
    const completedInCategory = categoryRituals.filter(r => completedRituals.includes(r.id))
    return {
      category: category as RitualCategory,
      total: categoryRituals.length,
      completed: completedInCategory.length,
      percentage: categoryRituals.length > 0 ? (completedInCategory.length / categoryRituals.length) * 100 : 0
    }
  })

  const overallProgress = accessibleRituals.length > 0 
    ? (completedRituals.length / accessibleRituals.length) * 100 
    : 0

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: 'Transcendent', icon: '🌟', color: 'text-yellow-400' }
    if (streak >= 21) return { level: 'Devoted', icon: '🔥', color: 'text-orange-400' }
    if (streak >= 14) return { level: 'Committed', icon: '💪', color: 'text-blue-400' }
    if (streak >= 7) return { level: 'Consistent', icon: '📅', color: 'text-green-400' }
    if (streak >= 3) return { level: 'Building', icon: '🌱', color: 'text-emerald-400' }
    return { level: 'Starting', icon: '✨', color: 'text-gray-400' }
  }

  const streakInfo = getStreakLevel(currentStreak)
  const tier = tierBenefits[userTier]

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold">{currentStreak} days</p>
                <p className={`text-xs ${streakInfo.color}`}>
                  {streakInfo.icon} {streakInfo.level}
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
                <p className="text-xs text-green-600">
                  ⚡ Healing Power
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bytes Earned</p>
                <p className="text-2xl font-bold">{totalBytes.toLocaleString()}</p>
                <p className="text-xs text-blue-600">
                  💾 Digital Currency
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-slate-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rituals Completed</p>
                <p className="text-2xl font-bold">{completedRituals.length}</p>
                <p className="text-xs text-gray-600">
                  🏆 Total Ceremonies
                </p>
              </div>
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Status */}
      <Card className="border-2 border-dashed border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className={`h-6 w-6 ${tier.color}`} />
            {tier.name}
            <Badge className={`${tier.bgColor} ${tier.color} border-0`}>
              ACTIVE
            </Badge>
          </CardTitle>
          <CardDescription className="text-base">
            {tier.description} • {tier.ritualAccess} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-2">Tier Benefits:</p>
              <ul className="space-y-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Vault Access:</p>
              <Progress value={(accessibleRituals.length / RITUAL_BANK.length) * 100} className="mb-2" />
              <p className="text-sm text-gray-600">
                {accessibleRituals.length} of {RITUAL_BANK.length} rituals unlocked
              </p>
              {userTier !== 'deep-reset' && (
                <Button variant="outline" size="sm" className="mt-2">
                  Upgrade Tier
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Ritual Progress
          </CardTitle>
          <CardDescription>
            Your daily ritual completion journey this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs font-medium text-gray-500 mb-2">{day.day}</p>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                  day.completed 
                    ? 'bg-green-100 border-2 border-green-500' 
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}>
                  {day.completed ? (
                    <Award className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  {day.completed ? 'Complete' : 'Pending'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Ritual Category Mastery
          </CardTitle>
          <CardDescription>
            Your progress across the 8 sacred healing categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryProgress.map((category) => {
              const config = RITUAL_CATEGORIES[category.category]
              return (
                <div key={category.category} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{config.title}</h4>
                    <Badge variant="outline">
                      {category.completed}/{category.total}
                    </Badge>
                  </div>
                  <Progress value={category.percentage} className="mb-2" />
                  <p className="text-xs text-gray-600">{config.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Healing Achievements
          </CardTitle>
          <CardDescription>
            Milestones in your emotional transformation journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${currentStreak >= 7 ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className="text-2xl mb-2">🔥</div>
                <h4 className="font-medium">Week Warrior</h4>
                <p className="text-xs text-gray-600">7-day streak</p>
                {currentStreak >= 7 && <Badge className="mt-2 bg-green-100 text-green-800">UNLOCKED</Badge>}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${completedRituals.length >= 10 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-medium">Ritual Adept</h4>
                <p className="text-xs text-gray-600">10 rituals completed</p>
                {completedRituals.length >= 10 && <Badge className="mt-2 bg-blue-100 text-blue-800">UNLOCKED</Badge>}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${overallProgress >= 50 ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className="text-2xl mb-2">🌟</div>
                <h4 className="font-medium">Vault Explorer</h4>
                <p className="text-xs text-gray-600">50% progress</p>
                {overallProgress >= 50 && <Badge className="mt-2 bg-purple-100 text-purple-800">UNLOCKED</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
