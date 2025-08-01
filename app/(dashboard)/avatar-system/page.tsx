import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import AvatarSystem from '@/components/gamification/AvatarSystem'

export default function AvatarSystemPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Avatar Identity System
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Express your emotional archetype through glitch-coded avatars and cosmetic frames. 
              Each avatar tells a story of your healing journey.
            </p>
          </div>

          {/* Avatar System Component */}
          <AvatarSystem />
        </div>
      </div>
    </AuthWrapper>
  )
}
