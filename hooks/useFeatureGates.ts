'use client'

import { useEffect, useState } from 'react'

interface FeatureGates {
  noContactTracker: boolean
  dailyLogs: boolean
  aiTherapy: boolean
  wallRead: boolean
  wallPost: boolean
  progressAnalytics: boolean
}

interface UseFeatureGateReturn {
  isGated: boolean
  reason?: string
  requiredLevel?: number
  requiredDays?: number
}

export function useFeatureGates() {
  const [gates, setGates] = useState<FeatureGates | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatureGates()
  }, [])

  const fetchFeatureGates = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setGates(data.featureGates)
      }
    } catch (error) {
      console.error('Failed to fetch feature gates:', error)
      // Default to all open if error
      setGates({
        noContactTracker: true,
        dailyLogs: true,
        aiTherapy: true,
        wallRead: true,
        wallPost: true,
        progressAnalytics: true
      })
    } finally {
      setLoading(false)
    }
  }

  const useFeatureGate = (feature: keyof FeatureGates): UseFeatureGateReturn => {
    if (loading || !gates) {
      return { isGated: true, reason: 'Loading...' }
    }

    const isUnlocked = gates[feature]
    
    if (isUnlocked) {
      return { isGated: false }
    }

    // Return specific gating reasons
    const gatingReasons: Record<keyof FeatureGates, UseFeatureGateReturn> = {
      noContactTracker: { isGated: false }, // Always unlocked
      dailyLogs: { 
        isGated: true, 
        reason: 'Complete your first ritual to unlock', 
        requiredLevel: 1 
      },
      aiTherapy: { 
        isGated: true, 
        reason: 'Reach level 3 or day 3 to unlock AI Therapy', 
        requiredLevel: 3,
        requiredDays: 3
      },
      wallRead: { 
        isGated: true, 
        reason: 'Reach level 5 or day 5 to read the Wall', 
        requiredLevel: 5,
        requiredDays: 5
      },
      wallPost: { 
        isGated: true, 
        reason: 'Reach level 7 or day 7 to share on the Wall', 
        requiredLevel: 7,
        requiredDays: 7
      },
      progressAnalytics: { 
        isGated: true, 
        reason: 'Reach level 14 or day 14 to unlock Progress Analytics', 
        requiredLevel: 14,
        requiredDays: 14
      }
    }

    return gatingReasons[feature]
  }

  return {
    gates,
    loading,
    useFeatureGate,
    refetch: fetchFeatureGates
  }
}
