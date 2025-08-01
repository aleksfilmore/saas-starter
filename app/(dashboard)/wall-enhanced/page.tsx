import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import ConfessionCards from '@/components/wall/ConfessionCards'

export default function EnhancedWallPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-red-900 p-4">
        <div className="max-w-6xl mx-auto">
          <ConfessionCards />
        </div>
      </div>
    </AuthWrapper>
  )
}
