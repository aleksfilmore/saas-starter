'use client'

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const AuthProvider = dynamic(
  () => import('@/contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })),
  { ssr: false }
);

const NotificationProvider = dynamic(
  () => import('@/contexts/NotificationContext').then(mod => ({ default: mod.NotificationProvider })),
  { ssr: false }
);

interface ClientOnlyProvidersProps {
  children: ReactNode;
}

export function ClientOnlyProviders({ children }: ClientOnlyProvidersProps) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}
