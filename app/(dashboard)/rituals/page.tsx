import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import RitualLibrary from '@/components/rituals/RitualLibrary'

export default function RitualLibraryPage() {
  const handleStartRitual = (ritual: any) => {
    console.log('Starting ritual:', ritual)
    // Future: Navigate to ritual execution page or modal
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <RitualLibrary 
            userTier="firewall" 
            onStartRitual={handleStartRitual}
          />
        </div>
      </div>
    </AuthWrapper>
  )
}
