'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Package, Download, Headphones, Book, Flame, Shield, Shirt, Heart } from 'lucide-react'
import { formatBytes, formatPrice } from '@/lib/shop/constants'

interface ProductModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
  onPurchase: (product: any, paymentMethod: 'bytes' | 'cash') => void
  userBytes: number
  canAfford: boolean
  canUnlock: boolean
  isLoading: boolean
}

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

export default function ProductModal({ 
  product, 
  isOpen, 
  onClose, 
  onPurchase, 
  userBytes, 
  canAfford, 
  canUnlock, 
  isLoading 
}: ProductModalProps) {
  if (!isOpen || !product) return null

  const Icon = getProductIcon(product.type)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-900 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 text-white hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-8 h-8 text-purple-400" />
            <CardTitle className="text-white text-2xl pr-8">
              {product.name}
            </CardTitle>
          </div>
          
          <CardDescription className="text-gray-300 text-lg">
            {product.timeToEarn} • {product.userPerception}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Hero Image */}
          <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center">
            <Icon className="w-24 h-24 text-white/30" />
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">About This Reward</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>
          
          {/* Features */}
          {product.features && (
            <div>
              <h3 className="text-xl font-bold text-white mb-3">What You Get</h3>
              <div className="grid gap-3">
                {product.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Pricing & Purchase */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white">
                  {product.bytePrice === 0 ? 'FREE' : formatBytes(product.bytePrice)}
                </span>
                {product.cashPrice > 0 && (
                  <span className="text-lg text-gray-400 ml-3">
                    or {formatPrice(product.cashPrice)}
                  </span>
                )}
              </div>
              
              {product.requiresShipping && (
                <Badge variant="outline" className="text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  Shipping Required
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {product.bytePrice === 0 ? (
                <Button
                  onClick={() => onPurchase(product, 'bytes')}
                  disabled={!canUnlock || isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {canUnlock ? 'Unlock Now' : 'Complete 7-Day Streak'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => onPurchase(product, 'bytes')}
                    disabled={!canAfford || isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    {canAfford ? 'Unlock with Bytes' : `Need ${formatBytes(product.bytePrice - userBytes)} More`}
                  </Button>
                  
                  {product.cashPrice > 0 && (
                    <Button
                      onClick={() => onPurchase(product, 'cash')}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                    >
                      Buy for {formatPrice(product.cashPrice)}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
