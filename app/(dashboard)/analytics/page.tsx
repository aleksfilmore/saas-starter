import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import RitualProgressDashboard from '@/components/dashboard/RitualProgressDashboard'

export default function RitualAnalyticsPage() {
  // Mock user data - in real app this would come from API/database
  const mockUserData = {
    userTier: 'firewall' as const,
    currentStreak: 12,
    totalXP: 2450,
    totalBytes: 1875,
    completedRituals: [
      'grief-01', 'grief-02', 'petty-01', 'glow-01', 'glow-02', 
      'reframe-01', 'ghost-01', 'public-01', 'soft-01', 'cult-01'
    ],
    weeklyProgress: [
      { day: 'Mon', completed: true, ritualId: 'grief-01' },
      { day: 'Tue', completed: true, ritualId: 'petty-01' },
      { day: 'Wed', completed: true, ritualId: 'glow-01' },
      { day: 'Thu', completed: false },
      { day: 'Fri', completed: true, ritualId: 'reframe-01' },
      { day: 'Sat', completed: true, ritualId: 'ghost-01' },
      { day: 'Sun', completed: false }
    ]
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Ritual Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Deep insights into your emotional healing journey. Track your progress across 
              sacred ritual categories, monitor streaks, and celebrate transformation milestones.
            </p>
          </div>

          {/* Main Dashboard */}
          <RitualProgressDashboard {...mockUserData} />
          
          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Begin Your Next Ritual?</h2>
              <p className="text-gray-600 mb-6">
                Continue your healing journey with today's personalized ritual recommendation
              </p>
              <div className="space-x-4">
                <a 
                  href="/dashboard/glow-up-console" 
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Start Daily Ritual
                </a>
                <a 
                  href="/rituals" 
                  className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Browse Ritual Library
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
