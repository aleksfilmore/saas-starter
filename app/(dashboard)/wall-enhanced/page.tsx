import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import ConfessionCards from '@/components/wall/ConfessionCards'

export default function EnhancedWallPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-purple-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <ConfessionCards />
        </div>
      </div>
    </AuthWrapper>
  )
}
