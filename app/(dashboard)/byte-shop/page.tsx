import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import ByteShop from '@/components/gamification/ByteShop'

export default function ByteShopPage() {
  // Mock user data - in real app this would come from API/database
  const mockUserProgress = {
    bytes: 1250,
    xp: 3400,
    tier: 'firewall' as const,
    unlockedItems: ['soft-mode-tts', 'no-text-back', 'daily-spin'],
    equippedBadge: 'no-text-back'
  }

  const handlePurchase = (itemId: string, cost: number) => {
    console.log(`Purchasing ${itemId} for ${cost} bytes`)
    // In real app: update user balance, add item to inventory
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <ByteShop 
          userProgress={mockUserProgress}
          onPurchase={handlePurchase}
        />
      </div>
    </AuthWrapper>
  )
}
