'use client'

import { useState, useEffect } from 'react'

interface UnlockNotification {
  id: string
  title: string
  message: string
  action: string
  type: string
  productId: string
  timestamp: number
}

export function useUnlockNotifications() {
  const [notifications, setNotifications] = useState<UnlockNotification[]>([])
  const [currentNotification, setCurrentNotification] = useState<UnlockNotification | null>(null)

  // Listen for new unlock notifications
  useEffect(() => {
    const handleUnlockNotification = (event: CustomEvent) => {
      const notification = {
        id: Date.now().toString(),
        ...event.detail,
        timestamp: Date.now()
      }
      
      setNotifications(prev => [...prev, notification])
      
      // Show the notification if none is currently displayed
      if (!currentNotification) {
        setCurrentNotification(notification)
      }
    }

    window.addEventListener('unlock-notification' as any, handleUnlockNotification)
    
    return () => {
      window.removeEventListener('unlock-notification' as any, handleUnlockNotification)
    }
  }, [currentNotification])

  const showNextNotification = () => {
    const remaining = notifications.filter(n => n.id !== currentNotification?.id)
    setNotifications(remaining)
    setCurrentNotification(remaining[0] || null)
  }

  const dismissCurrentNotification = () => {
    showNextNotification()
  }

  const triggerUnlockNotification = async (data: { productId: string; userId?: string }) => {
    try {
      // Call the API
      const response = await fetch('/api/shop/unlock-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: data.productId,
          userId: data.userId
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Create and dispatch the notification event
        const event = new CustomEvent('unlock-notification', {
          detail: {
            title: result.notification.title,
            message: result.notification.message,
            action: result.notification.action,
            type: result.notification.type || 'achievement',
            productId: data.productId
          }
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('Failed to trigger unlock notification:', error)
    }
  }

  return {
    currentNotification,
    dismissCurrentNotification,
    showNextNotification,
    triggerUnlockNotification,
    hasNotifications: notifications.length > 0
  }
}
