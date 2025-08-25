'use client';
import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import useSWR from 'swr';

const fetcher = (u:string)=> fetch(u).then(r=> r.json());

interface DashboardLayoutClientProps { children: React.ReactNode }

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const { data } = useSWR('/api/dashboard/hub', fetcher, { refreshInterval: 60000 });
  const user = data?.user || {};
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader userEmail={user.email || ''} username={user.username} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6">
        {children}
      </main>
    </div>
  );
}
