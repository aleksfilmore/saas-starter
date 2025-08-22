'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Package, Download, Headphones, Book, Flame, Shield, Shirt, Heart } from 'lucide-react'
import { SHOP_PRODUCTS, formatBytes } from '@/lib/shop/constants'
import ShippingForm from '@/components/shop/ShippingForm'
import UnlockNotification from '@/components/shop/UnlockNotification'
import { useAuth } from '@/hooks/useAuth'
import { useUnlockNotifications } from '@/hooks/useUnlockNotifications'

// Product icons mapping
const getProductIcon = (type: string) => {
  switch (type) {
    case 'workbook': return Download
    case 'audiobook': return Headphones
    case 'signed_book': return Book
    case 'candle': return Flame
    case 'phone_case': return Shield
    case 'hoodie': return Shirt
    case 'blanket': return Heart
    default: return Package
  }
}

export default function ShopPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentNotification, dismissCurrentNotification, triggerUnlockNotification } = useUnlockNotifications()
  const [userBytes, setUserBytes] = useState<number>(0)
  const [userPlan, setUserPlan] = useState<string>('ghost')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showShipping, setShowShipping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Get hero product (Blanket) and grid products (other 6)
  const heroProduct = SHOP_PRODUCTS.BLANKET
  const gridProducts = [
    SHOP_PRODUCTS.WORKBOOK,
    SHOP_PRODUCTS.AUDIOBOOK, 
    SHOP_PRODUCTS.SIGNED_PAPERBACK,
    SHOP_PRODUCTS.CANDLE,
    SHOP_PRODUCTS.PHONE_CASE,
    SHOP_PRODUCTS.HOODIE
  ]

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          // Load user bytes from API
          const response = await fetch('/api/bytes/balance')
          const data = await response.json()
          setUserBytes(data.balance || 0)
          setUserPlan('ghost') // Default plan
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
      }
    }
    loadUserData()
  }, [user])

  const canAfford = (product: any) => {
    return userBytes >= product.bytePrice
  }

  const canUnlock = (product: any) => {
    if (product.id === 'workbook_ctrlaltblock') {
      if (userPlan === 'firewall') return true
      // TODO: Check if ghost user has 7-day streak
      return false
    }
    return canAfford(product)
  }

  const handlePurchase = async (product: any) => {
    // For physical products, show shipping form first
    if (product.requiresShipping) {
      setSelectedProduct(product)
      setShowShipping(true)
      return
    }

    setIsLoading(true)
    try {
      // Handle bytes-only purchase
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          paymentMethod: 'bytes'
        })
      })
      
      if (response.ok) {
        setUserBytes(prev => prev - product.bytePrice)
        
        // Trigger unlock notification
        triggerUnlockNotification({
          productId: product.id,
          userId: user?.id
        })
        
        // For audiobook, redirect to audiobook page
        if (product.id === 'audiobook_worst_boyfriends') {
          router.push('/audiobook')
        } else {
          router.push(`/shop/success?product=${product.id}`)
        }
      }
    } catch (error) {
      console.error('Purchase failed:', error)
    } finally {
      setIsLoading(false)
    }
  }



  const handleShippingSubmit = async (shippingData: any) => {
    setIsLoading(true)
    try {
      // Process bytes purchase with shipping
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          paymentMethod: 'bytes',
          shippingAddress: shippingData
        })
      })
      
      if (response.ok) {
        setUserBytes(prev => prev - selectedProduct.bytePrice)
        
        // Trigger unlock notification
        triggerUnlockNotification({
          productId: selectedProduct.id,
          userId: user?.id
        })
        
        router.push(`/shop/success?product=${selectedProduct.id}`)
        setShowShipping(false)
        setSelectedProduct(null)
      }
    } catch (error) {
      console.error('Purchase with shipping failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShippingCancel = () => {
    setShowShipping(false)
    setSelectedProduct(null)
  }

  const handleNotificationAction = () => {
    if (currentNotification) {
      // Handle the action based on product type
      if (currentNotification.type === 'digital_instant') {
        // For digital products, redirect to the product
        if (currentNotification.productId === 'audiobook_worst_boyfriends') {
          router.push('/audiobook')
        } else if (currentNotification.productId === 'workbook_ctrlaltblock') {
          router.push('/workbook')
        }
      } else {
        // For physical products, go to order confirmation
        router.push(`/shop/success?product=${currentNotification.productId}`)
      }
    }
    dismissCurrentNotification()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            CTRL+ALT+BLOCK™
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Earned Rewards
          </p>
          <p className="text-sm text-gray-400 mb-6">
            No purchases. No payments. Only earned through healing.
          </p>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-2xl font-bold text-green-400">
              {formatBytes(userBytes)} Available
            </p>
          </div>
        </div>

        {/* Hero Product - Blanket */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm border-purple-500/30 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-yellow-500 text-black font-bold mb-4">
                    LEGENDARY REWARD
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {heroProduct.name}
                  </h2>
                  <p className="text-xl text-gray-200 mb-6">
                    {heroProduct.heroTagline}
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {heroProduct.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-white">
                      {formatBytes(heroProduct.bytePrice)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {heroProduct.features?.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-white border-white/30">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => handlePurchase(heroProduct)}
                      disabled={!canAfford(heroProduct) || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3"
                    >
                      {canAfford(heroProduct) ? 'Claim Reward' : `Need ${formatBytes(heroProduct.bytePrice - userBytes)} More`}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-32 h-32 text-white/50" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Grid Products - Other 6 */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Your Healing Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridProducts.map((product) => {
              const Icon = getProductIcon(product.type)
              const affordable = canAfford(product)
              const unlockable = canUnlock(product)
              
              return (
                <Card key={product.id} className="bg-black/40 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-purple-400" />
                      <CardTitle className="text-white text-lg">
                        {product.shortName}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-300 text-sm">
                      {product.timeToEarn} • {product.userPerception}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white/30" />
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          {product.bytePrice === 0 ? 'FREE' : formatBytes(product.bytePrice)}
                        </span>
                      </div>
                      
                      {product.requiresShipping && (
                        <Badge variant="outline" className="text-xs">
                          <Package className="w-3 h-3 mr-1" />
                          Shipping Required
                        </Badge>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        {product.bytePrice === 0 ? (
                          <Button
                            onClick={() => handlePurchase(product)}
                            disabled={!unlockable || isLoading}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          >
                            {unlockable ? 'Claim Now' : 'Complete 7-Day Streak'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handlePurchase(product)}
                            disabled={!affordable || isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                            size="sm"
                          >
                            {affordable ? 'Claim Reward' : `Need ${formatBytes(product.bytePrice - userBytes)} More`}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Shipping Form Modal */}
        {showShipping && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">
                Shipping Information
              </h3>
              <p className="text-gray-300 mb-6">
                {selectedProduct.name} will be shipped to:
              </p>
              <ShippingForm
                onSubmit={handleShippingSubmit}
                onCancel={handleShippingCancel}
                loading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Unlock Notification */}
      {currentNotification && (
        <UnlockNotification
          notification={currentNotification}
          onClose={dismissCurrentNotification}
          onAction={handleNotificationAction}
        />
      )}
    </div>
  )
}
