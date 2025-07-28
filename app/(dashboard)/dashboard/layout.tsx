// File: app/(dashboard)/layout.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Zap, ShieldQuestion, Settings, Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/rituals', icon: Zap, label: 'Rituals' },
    { href: '/dashboard/confessional', icon: ShieldQuestion, label: 'Confessional' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`w-64 flex-shrink-0 bg-card border-r border-border lg:block ${
          isSidebarOpen ? 'block' : 'hidden'
        } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center border-b border-border px-6">
           <Link href="/dashboard" className="font-bold text-lg">
            CTRL+ALT+<span className="text-primary">BLOCK</span>
          </Link>
        </div>
        <nav className="flex flex-col p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="shadow-none my-1 w-full justify-start"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
