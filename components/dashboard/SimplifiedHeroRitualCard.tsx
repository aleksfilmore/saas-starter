'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  Play
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface SimplifiedHeroRitualCardProps {
  ritual: Ritual | null
  canReroll?: boolean
  rerollsLeft?: number
  onComplete: (ritualId: string) => Promise<void>
  onReroll: () => Promise<void>
  className?: string
}

export function SimplifiedHeroRitualCard({ 
  ritual, 
  canReroll = true,
  rerollsLeft = 1,
  onComplete, 
  onReroll,
  className 
}: SimplifiedHeroRitualCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isRerolling, setIsRerolling] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showRerollButton, setShowRerollButton] = useState(false)

  const handleComplete = async () => {
    if (!ritual || ritual.isCompleted) return
    
    setIsCompleting(true)
    try {
      await onComplete(ritual.id)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleReroll = async () => {
    if (!canReroll) return
    
    setIsRerolling(true)
    setShowRerollButton(false)
    try {
      await onReroll()
    } finally {
      setIsRerolling(false)
    }
  }

  if (!ritual) {
    return (
      <Card className="dashboard-card p-8 text-center">
        <div className="text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-4" />
          <p>Loading today's ritual...</p>
        </div>
      </Card>
    )
  }

  if (ritual.isCompleted) {
    return (
      <Card className="dashboard-card p-8 text-center border-green-500/50 bg-green-500/10">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-400" />
        <h2 className="text-2xl font-bold text-white mb-2">Ritual Complete!</h2>
        <p className="text-green-300">
          {ritual.title} completed at {ritual.completedAt ? new Date(ritual.completedAt).toLocaleTimeString() : 'today'}
        </p>
        <p className="text-gray-400 mt-2 text-sm">
          Your next ritual unlocks tomorrow
        </p>
      </Card>
    )
  }

  return (
    <div className="relative">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: '50%', 
                  y: '50%', 
                  scale: 0, 
                  rotate: 0 
                }}
                animate={{ 
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0],
                  rotate: 360
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Card 
        className={`dashboard-card p-8 hover:scale-[1.02] transition-all duration-300 relative ${className}`}
        onMouseEnter={() => canReroll && rerollsLeft > 0 && setShowRerollButton(true)}
        onMouseLeave={() => setShowRerollButton(false)}
      >
        {/* Progress Ring - Top Right */}
        <div className="absolute top-4 right-4">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-600"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${0 * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                className="text-purple-400"
                style={{
                  transition: 'stroke-dasharray 0.3s ease'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-gray-300 font-medium">0%</span>
            </div>
          </div>
        </div>

        {/* Ritual Content */}
        <div className="text-center pr-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-3">{ritual.title}</h2>
            
            {/* Intensity dots under title - no label */}
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < ritual.intensity 
                      ? 'bg-orange-400' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-purple-200">{ritual.description}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{ritual.duration} min</span>
            </div>
          </div>

          {/* Primary Action - Full width but slimmer */}
          <Button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {isCompleting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Starting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span>Start Ritual</span>
                <span className="hidden group-hover:inline text-sm opacity-80 ml-2">+10 XP · +5 Bytes</span>
              </div>
            )}
          </Button>
        </div>

        {/* Hover Refresh Button */}
        <AnimatePresence>
          {showRerollButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 right-4"
            >
              <Button
                onClick={handleReroll}
                disabled={isRerolling || !canReroll || rerollsLeft === 0}
                variant="ghost"
                size="sm"
                className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-gray-300 hover:text-white"
                title={`${rerollsLeft} reroll${rerollsLeft === 1 ? '' : 's'} left`}
              >
                {isRerolling ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center gap-1">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-xs">{rerollsLeft}</span>
                  </div>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
