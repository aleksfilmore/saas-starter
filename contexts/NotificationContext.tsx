"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { webPushManager } from '@/lib/notifications/web-push';

interface NotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  requestPermission: () => Promise<boolean>;
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<boolean>;
  sendTestNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Initialize notification system only on client side
    if (typeof window === 'undefined') return;
    
    const initialize = async () => {
      const supported = webPushManager.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        setPermission(webPushManager.getPermissionStatus());
        
        // Initialize web push manager
        await webPushManager.initialize();
        
        // Check if already subscribed
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
          }
        }
      }
    };

    initialize();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await webPushManager.requestPermission();
    setPermission(granted);
    return granted === 'granted';
  };

  const subscribeToPush = async (): Promise<boolean> => {
    const subscription = await webPushManager.subscribeToPush();
    const success = !!subscription;
    setIsSubscribed(success);
    if (success) {
      setPermission('granted');
    }
    return success;
  };

  const unsubscribeFromPush = async (): Promise<boolean> => {
    const success = await webPushManager.unsubscribeFromPush();
    if (success) {
      setIsSubscribed(false);
    }
    return success;
  };

  const sendTestNotification = async (): Promise<void> => {
    await webPushManager.sendTestNotification();
  };

  const value: NotificationContextType = {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
