'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Zap, ShieldQuestion, Settings, Menu } from 'lucide-react';
import Footer from '@/components/layout/footer';

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
    <div className="flex min-h-screen w-full bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-950 border-r border-gray-800 z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:block`}
      >
        <div className="flex h-14 items-center border-b border-gray-800 px-6 lg:justify-start justify-center">
          {/* Hide logo on mobile, show on desktop */}
          <Link href="/dashboard" className="font-bold text-lg hidden lg:block">
            CTRL+ALT+BLOCK
          </Link>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={`shadow-none w-full justify-start text-base font-medium gap-3 ${
                  pathname === item.href ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/50'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-gray-950/95 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            {/* Show logo on mobile in header */}
            <Link href="/dashboard" className="font-bold text-lg">
              CTRL+ALT+BLOCK
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}