'use client';

import { LumoProvider } from '@/components/lumo/LumoProvider';
import Lumo from '@/components/lumo/LumoBubble';

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  return (
    <LumoProvider>
      {children}
      <Lumo />
    </LumoProvider>
  );
}
