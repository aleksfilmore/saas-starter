'use client';

import React, { useState } from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import EmotionalSystemCheck from '@/components/onboarding/EmotionalSystemCheck'
import NoContactSetup from '@/components/onboarding/NoContactSetup'

export default function OnboardingQuizPage() {
  const [currentStep, setCurrentStep] = useState<'quiz' | 'nocontact' | 'complete'>('quiz');
  const [archetypeResult, setArchetypeResult] = useState<any>(null);

  const handleQuizComplete = (archetype: any) => {
    console.log('User archetype determined:', archetype)
    setArchetypeResult(archetype);
    setCurrentStep('nocontact');
  }

  const handleNoContactComplete = (noContactData: any) => {
    console.log('No-contact setup completed:', noContactData);
    
    // Save all onboarding data
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userArchetype', JSON.stringify(archetypeResult));
    localStorage.setItem('noContactData', JSON.stringify(noContactData));
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
        <div className="py-12">
          {currentStep === 'quiz' && (
            <EmotionalSystemCheck onComplete={handleQuizComplete} />
          )}
          {currentStep === 'nocontact' && (
            <NoContactSetup onComplete={handleNoContactComplete} />
          )}
        </div>
      </div>
    </AuthWrapper>
  )
}
