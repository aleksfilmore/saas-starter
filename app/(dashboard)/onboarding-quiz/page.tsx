import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import EmotionalSystemCheck from '@/components/onboarding/EmotionalSystemCheck'

export default function OnboardingQuizPage() {
  const handleQuizComplete = (archetype: any) => {
    console.log('User archetype determined:', archetype)
    // In real app: save archetype to user profile, redirect to dashboard
    // Could redirect to dashboard with welcome message
    window.location.href = '/dashboard/glow-up-console'
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="py-12">
          <EmotionalSystemCheck onComplete={handleQuizComplete} />
        </div>
      </div>
    </AuthWrapper>
  )
}
