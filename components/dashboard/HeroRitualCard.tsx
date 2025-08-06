'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Timer,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
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

interface HeroRitualCardProps {
  ritual: Ritual | null
  timeUntilReset?: number // milliseconds until 24h reset
  canReroll?: boolean
  onComplete: (ritualId: string) => Promise<void>
  onReroll: () => Promise<void>
  className?: string
}

export function HeroRitualCard({ 
  ritual, 
  timeUntilReset = 0,
  canReroll = true,
  onComplete, 
  onReroll,
  className 
}: HeroRitualCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isRerolling, setIsRerolling] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleComplete = async () => {
    if (!ritual || ritual.isCompleted) return
    
    // Navigate to ritual detail page instead of completing inline
    window.location.href = `/ritual/${ritual.id}`;
  }

  const handleReroll = async () => {
    setIsRerolling(true)
    try {
      await onReroll()
    } catch (error) {
      console.error('Failed to reroll ritual:', error)
    } finally {
      setIsRerolling(false)
    }
  }

  const formatTimeUntilReset = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      emotional_regulation: 'from-blue-500 to-cyan-500',
      mindfulness: 'from-green-500 to-teal-500',
      physical_wellness: 'from-orange-500 to-red-500',
      social_healing: 'from-purple-500 to-pink-500',
      creative_expression: 'from-yellow-500 to-orange-500',
      boundary_setting: 'from-red-500 to-pink-500'
    }
    return colors[category as keyof typeof colors] || 'from-purple-500 to-pink-500'
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'text-green-400'
    if (intensity <= 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (!ritual) {
    return (
      <Card className={cn(
        "relative overflow-hidden bg-white/10 backdrop-blur-md border border-purple-500/20 p-8",
        "h-64 md:h-80 flex items-center justify-center",
        className
      )}>
        <div className="text-center">
          <Timer className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Generating Today's Ritual...
          </h3>
          <p className="text-purple-200">
            Your personalized healing protocol is being prepared.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "relative overflow-hidden bg-white/10 backdrop-blur-md border border-purple-500/20",
      "h-64 md:h-80 transition-all duration-300",
      ritual.isCompleted ? "border-green-500/40" : "hover:border-purple-400/40",
      className
    )}>
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
                  y: '100%', 
                  x: `${Math.random() * 100}%`,
                  rotate: Math.random() * 360
                }}
                animate={{ 
                  y: '-20%', 
                  rotate: Math.random() * 360 + 360
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background gradient based on category */}
      <div className={cn(
        "absolute inset-0 opacity-20 bg-gradient-to-br",
        getCategoryColor(ritual.category)
      )} />

      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">
                Today's Healing Protocol
              </span>
              {ritual.isCompleted && (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {ritual.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-gray-400">
                {ritual.category.replace('_', ' ').toUpperCase()}
              </span>
              <span className={cn("font-medium", getIntensityColor(ritual.intensity))}>
                Intensity {ritual.intensity}/5
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {ritual.duration}min
              </span>
            </div>
          </div>

          {/* Reroll button */}
          {canReroll && !ritual.isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReroll}
              disabled={isRerolling}
              className="text-purple-300 hover:text-white hover:bg-purple-500/20"
            >
              <RotateCcw className={cn(
                "w-4 h-4",
                isRerolling && "animate-spin"
              )} />
            </Button>
          )}
        </div>

        {/* Description */}
        <p className="text-purple-100 mb-6 flex-1 leading-relaxed">
          {ritual.description}
        </p>

        {/* Progress Ring */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {ritual.isCompleted ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Completed!</span>
                <span className="text-sm text-gray-400">
                  +50 XP, +25 Bytes
                </span>
              </div>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className={cn(
                  "bg-gradient-to-r text-white border-0 transition-all hover:scale-105",
                  getCategoryColor(ritual.category),
                  isCompleting && "animate-pulse"
                )}
              >
                {isCompleting ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Start Ritual
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Timer */}
          {timeUntilReset > 0 && (
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Next ritual in</div>
              <div className="text-sm font-mono text-purple-300">
                {formatTimeUntilReset(timeUntilReset)}
              </div>
            </div>
          )}
        </div>

        {/* Reroll cooldown notice */}
        {!canReroll && (
          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Reroll used today. Try again tomorrow!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
