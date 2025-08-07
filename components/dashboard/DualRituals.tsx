import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Dices, Clock, Target, CheckCircle, Flame, Crown, Plus, Coins } from 'lucide-react'
import { getTodaysRituals, getRitualById, getRandomRituals, type Ritual } from '@/lib/ritual-bank'

interface DualRitualsProps {
  userSubscription?: 'free' | 'premium'
  onRitualComplete?: (ritualId: string, xpGained: number, bytesGained: number) => void
  completedRituals?: string[]
}

// XP and Bytes calculation based on difficulty
const getRewards = (difficulty: string): { xp: number, bytes: number } => {
  switch (difficulty) {
    case 'easy': return { xp: 25, bytes: 5 }
    case 'medium': return { xp: 50, bytes: 10 }
    case 'hard': return { xp: 100, bytes: 20 }
    default: return { xp: 25, bytes: 5 }
  }
}

export function DualRituals({ 
  userSubscription = 'free', 
  onRitualComplete,
  completedRituals = [] 
}: DualRitualsProps) {
  const [todaysRituals, setTodaysRituals] = useState<Ritual[]>([])
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)
  const [hasRerolledToday, setHasRerolledToday] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [completingRitual, setCompletingRitual] = useState<string | null>(null)

  // Load today's rituals on mount
  useEffect(() => {
    const storedDate = localStorage.getItem('rituals-date')
    const storedRituals = localStorage.getItem('todays-rituals')
    const storedReroll = localStorage.getItem('has-rerolled-today')
    const today = new Date().toDateString()
    
    if (storedDate === today && storedRituals) {
      // Load existing rituals for today
      setTodaysRituals(JSON.parse(storedRituals))
      setHasRerolledToday(storedReroll === 'true')
    } else {
      // Generate new rituals for new day
      const newRituals = getTodaysRituals()
      setTodaysRituals(newRituals)
      setHasRerolledToday(false)
      
      // Store in localStorage
      localStorage.setItem('rituals-date', today)
      localStorage.setItem('todays-rituals', JSON.stringify(newRituals))
      localStorage.setItem('has-rerolled-today', 'false')
    }
  }, [])

  const handleReroll = () => {
    if (hasRerolledToday) return
    
    const newRituals = getRandomRituals(undefined, 2)
    setTodaysRituals(newRituals)
    setHasRerolledToday(true)
    
    // Update localStorage
    localStorage.setItem('todays-rituals', JSON.stringify(newRituals))
    localStorage.setItem('has-rerolled-today', 'true')
  }

  const handleRitualClick = (ritual: Ritual) => {
    setSelectedRitual(ritual)
    setIsModalOpen(true)
  }

  const handleCompleteRitual = async (ritualId: string) => {
    setCompletingRitual(ritualId)
    
    // Get the ritual to calculate rewards
    const ritual = todaysRituals.find(r => r.id === ritualId)
    if (!ritual) return
    
    const rewards = getRewards(ritual.difficulty)
    
    try {
      // Call the existing API with the ritual completion
      const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com'
      const response = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify({ 
          ritualId,
          notes: `Completed ${ritual.title}`,
          mood: 'good'
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (onRitualComplete) {
          onRitualComplete(ritualId, result.rewards.xp, result.rewards.bytes)
        }
      } else {
        // If API fails, still complete locally with calculated rewards
        if (onRitualComplete) {
          onRitualComplete(ritualId, rewards.xp, rewards.bytes)
        }
      }
    } catch (error) {
      console.error('Failed to complete ritual:', error)
      // Fallback to local completion
      if (onRitualComplete) {
        onRitualComplete(ritualId, rewards.xp, rewards.bytes)
      }
    }
    
    setCompletingRitual(null)
    setIsModalOpen(false)
    setSelectedRitual(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'hard': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      'grief-cycle': '💔',
      'petty-purge': '🗑️',
      'glow-up-forge': '✨',
      'level-up-labs': '⚗️',
      'ego-armor': '🛡️',
      'fuck-around-therapy': '🎭',
      'mindful-mayhem': '🧘‍♀️',
      'revenge-body': '💪'
    }
    return iconMap[category] || '🎯'
  }

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Today's Rituals</h3>
            <p className="text-sm text-zinc-400">
              Complete daily practices to level up your journey
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {userSubscription === 'premium' && (
              <Crown className="w-4 h-4 text-yellow-500" />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReroll}
              disabled={hasRerolledToday}
              className="border-zinc-700 hover:border-zinc-600"
            >
              <Dices className="w-4 h-4 mr-2" />
              {hasRerolledToday ? 'Rerolled' : 'Reroll'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {todaysRituals
            .filter(ritual => {
              // For free users, only show non-premium rituals
              if (userSubscription === 'free') {
                return !ritual.isPremium
              }
              // Premium users see all rituals
              return true
            })
            .map((ritual, index) => {
            const isCompleted = completedRituals.includes(ritual.id)
            
            return (
              <motion.div
                key={ritual.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-violet-500/50 ${
                    isCompleted 
                      ? 'bg-green-900/30 border-green-700' 
                      : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70'
                  }`}
                  onClick={() => handleRitualClick(ritual)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(ritual.category)}</span>
                        <div>
                          <h4 className="font-semibold text-white text-sm">
                            {ritual.title}
                          </h4>
                          <p className="text-xs text-zinc-400 capitalize">
                            {ritual.category.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
                      {ritual.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={getDifficultyColor(ritual.difficulty)}
                        >
                          {ritual.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {ritual.duration}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Ritual {index + 1}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {hasRerolledToday && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-zinc-500">
              ✨ Reroll used for today. New rituals tomorrow!
            </p>
          </motion.div>
        )}
      </CardContent>

      {/* Ritual Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">{selectedRitual && getCategoryIcon(selectedRitual.category)}</span>
              {selectedRitual?.title}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedRitual?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedRitual && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">{selectedRitual.duration}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={getDifficultyColor(selectedRitual.difficulty)}
                >
                  {selectedRitual.difficulty}
                </Badge>
                <div className="text-sm text-zinc-400 capitalize">
                  {selectedRitual.category.replace('-', ' ')}
                </div>
              </div>

              {userSubscription === 'premium' && selectedRitual.isPremium && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Crown className="w-4 h-4" />
                    Premium Personalized Ritual
                  </div>
                </div>
              )}

              {/* Reward Display */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-2">Completion Rewards:</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-green-400">
                    <Plus className="w-4 h-4" />
                    <span className="font-semibold">{getRewards(selectedRitual?.difficulty || 'easy').xp}</span>
                    <span className="text-sm">XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">{getRewards(selectedRitual?.difficulty || 'easy').bytes}</span>
                    <span className="text-sm">Bytes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-zinc-700"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => selectedRitual && handleCompleteRitual(selectedRitual.id)}
              disabled={completingRitual === selectedRitual?.id || completedRituals.includes(selectedRitual?.id || '')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
            >
              {completingRitual === selectedRitual?.id ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : completedRituals.includes(selectedRitual?.id || '') ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Start Ritual
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
