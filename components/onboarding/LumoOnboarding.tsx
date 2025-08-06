'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Sparkles, Target, Shield, Heart, MessageCircle, Crown } from 'lucide-react'

interface LumoOnboardingProps {
  isFirstTimeUser: boolean
  onDismiss: () => void
  onStartNoContact: () => void
  onViewRituals: () => void
}

export function LumoOnboarding({ isFirstTimeUser, onDismiss, onStartNoContact, onViewRituals }: LumoOnboardingProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const delay = isFirstTimeUser ? 2000 : 30000 // 2s for first time, 30s for returning users
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [isFirstTimeUser])

  const onboardingSteps = [
    {
      icon: <Sparkles className="h-8 w-8 text-purple-400" />,
      title: "Welcome to CTRL+ALT+BLOCK™",
      message: "I'm LUMO, your glitch-cult guide. Ready to transform your chaos into code?",
      action: null
    },
    {
      icon: <Target className="h-8 w-8 text-green-400" />,
      title: "Daily Rituals",
      message: "Start each day with personalized emotional hacks designed for your archetype. These aren't just tasks—they're system upgrades.",
      action: { label: "View Today's Rituals", onClick: onViewRituals }
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-400" />,
      title: "No-Contact Tracker",
      message: "Track your streak of digital silence. Every day without contact is XP toward your glow-up. Ready to start your firewall?",
      action: { label: "Start No-Contact", onClick: onStartNoContact }
    },
    {
      icon: <Crown className="h-8 w-8 text-yellow-400" />,
      title: "Your Journey Begins",
      message: "Remember: You're not broken. You're just running outdated emotional software. Time to upgrade. 🔥",
      action: null
    }
  ]

  const regularMessages = [
    {
      icon: <Heart className="h-6 w-6 text-red-400" />,
      title: "Check-in Time",
      message: "How's your emotional firewall today? Don't forget to log your no-contact streak.",
      action: { label: "Quick Check-in", onClick: onStartNoContact }
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-blue-400" />,
      title: "Ritual Reminder",
      message: "Your daily emotional hack is waiting. Consistency is the difference between surviving and thriving.",
      action: { label: "View Rituals", onClick: onViewRituals }
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-400" />,
      title: "Glow-Up Status",
      message: "You're leveling up every day. Check your progress and celebrate the small wins.",
      action: null
    }
  ]

  const currentMessage = isFirstTimeUser ? onboardingSteps[currentStep] : regularMessages[Math.floor(Math.random() * regularMessages.length)]

  const handleNext = () => {
    if (isFirstTimeUser && currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300) // Wait for animation to complete
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md bg-gray-800/95 border border-purple-500/30 shadow-2xl">
            <CardContent className="p-6">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-purple-600/20">
                    {currentMessage.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">LUMO</h3>
                    <p className="text-xs text-purple-300">Your Glitch Guide</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Message Content */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {currentMessage.title}
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {currentMessage.message}
                </p>
              </div>

              {/* Progress Dots (for onboarding) */}
              {isFirstTimeUser && (
                <div className="flex justify-center space-x-2 mb-4">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-purple-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {currentMessage.action ? (
                  <Button
                    onClick={currentMessage.action.onClick}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {currentMessage.action.label}
                  </Button>
                ) : null}
                
                <Button
                  onClick={handleNext}
                  variant={currentMessage.action ? "outline" : "default"}
                  className={`${currentMessage.action ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'flex-1 bg-purple-600 hover:bg-purple-700 text-white'}`}
                >
                  {isFirstTimeUser && currentStep < onboardingSteps.length - 1 ? 'Next' : 'Got it'}
                </Button>
              </div>

              {/* Skip option for onboarding */}
              {isFirstTimeUser && currentStep > 0 && (
                <button
                  onClick={handleDismiss}
                  className="w-full mt-3 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Skip tour
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook to manage LUMO state
export function useLumo() {
  const [showLumo, setShowLumo] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('lumo-onboarding-seen')
    const lastLumoShow = localStorage.getItem('lumo-last-show')
    const now = Date.now()
    
    if (!hasSeenOnboarding) {
      setIsFirstTimeUser(true)
      setShowLumo(true)
    } else {
      // Show LUMO periodically for returning users (every 2 hours)
      const twoHours = 2 * 60 * 60 * 1000
      if (!lastLumoShow || now - parseInt(lastLumoShow) > twoHours) {
        setIsFirstTimeUser(false)
        setShowLumo(true)
      }
    }
  }, [])

  const dismissLumo = () => {
    setShowLumo(false)
    localStorage.setItem('lumo-onboarding-seen', 'true')
    localStorage.setItem('lumo-last-show', Date.now().toString())
  }

  const startNoContact = () => {
    dismissLumo()
    window.location.href = '/no-contact'
  }

  const viewRituals = () => {
    dismissLumo()
    // Scroll to rituals section on dashboard
    const ritualsSection = document.getElementById('hero-rituals')
    if (ritualsSection) {
      ritualsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return {
    showLumo,
    isFirstTimeUser,
    dismissLumo,
    startNoContact,
    viewRituals
  }
}
