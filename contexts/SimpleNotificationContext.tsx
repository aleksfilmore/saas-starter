'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface NotificationContextType {
  isSupported: boolean
  permission: NotificationPermission
  isSubscribed: boolean
  requestPermission: () => Promise<boolean>
  subscribeToPush: () => Promise<boolean>
  unsubscribeFromPush: () => Promise<boolean>
  sendTestNotification: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('Notification' in window && 'serviceWorker' in navigator)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false
    
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  const subscribeToPush = async (): Promise<boolean> => {
    return false // Simplified for build safety
  }

  const unsubscribeFromPush = async (): Promise<boolean> => {
    return false // Simplified for build safety
  }

  const sendTestNotification = async (): Promise<void> => {
    // Simplified for build safety
  }

  return (
    <NotificationContext.Provider value={{
      isSupported,
      permission,
      isSubscribed,
      requestPermission,
      subscribeToPush,
      unsubscribeFromPush,
      sendTestNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
