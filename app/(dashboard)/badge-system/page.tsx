import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import BadgeSystem from '@/components/gamification/BadgeSystem'

export default function BadgeSystemPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Badge Achievement System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
