'use client'

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/SimpleNotificationContext';
import { HealingHubProvider } from '@/contexts/HealingHubContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return children without providers during SSR to prevent hydration issues
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <HealingHubProvider>
          {children}
        </HealingHubProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
