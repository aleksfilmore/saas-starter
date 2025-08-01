import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import BadgeSystem from '@/components/gamification/BadgeSystem'

export default function BadgeSystemPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Badge Achievement System
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unlock glitch trophies through your healing milestones. Each badge represents 
              a victory in your journey toward emotional independence.
            </p>
          </div>

          {/* Badge System Component */}
          <BadgeSystem />
        </div>
      </div>
    </AuthWrapper>
  )
}
