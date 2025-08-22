'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Download, Headphones, Book, Flame, Shield, Shirt, Heart, CheckCircle } from 'lucide-react'

interface UnlockNotificationProps {
  notification: {
    title: string
    message: string
    action: string
    type: string
    productId: string
  }
  onClose: () => void
  onAction: () => void
}

const getProductIcon = (productId: string) => {
  switch (productId) {
    case 'workbook_ctrlaltblock': return Download
    case 'audiobook_worst_boyfriends': return Headphones
    case 'signed_worst_boyfriends': return Book
    case 'candle_closure_ritual': return Flame
    case 'phone_case_ctrlaltblock': return Shield
    case 'hoodie_wear_healing': return Shirt
    case 'blanket_cocoon_closure': return Heart
    default: return CheckCircle
  }
}

export default function UnlockNotification({ notification, onClose, onAction }: UnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = getProductIcon(notification.productId)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for exit animation
  }

  const handleAction = () => {
    setIsVisible(false)
    setTimeout(onAction, 300)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card 
        className={`bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm border-purple-500/30 max-w-md w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <CardHeader className="relative text-center">
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <Badge className="bg-yellow-500 text-black font-bold">
              UNLOCKED!
            </Badge>
            
            <CardTitle className="text-white text-xl">
              {notification.title}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <CardDescription className="text-gray-200 text-lg leading-relaxed">
            {notification.message}
          </CardDescription>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAction}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
            >
              {notification.action}
            </Button>
            
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
