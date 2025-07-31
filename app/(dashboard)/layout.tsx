'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Zap, 
  ShieldQuestion, 
  Settings, 
  Menu, 
  Shield,
  MessageSquare,
  Activity,
  Crown,
  User,
  Lock,
  LogOut,
  Home,
  Sparkles,
  Target,
  Trophy,
  Users
} from 'lucide-react';
import Footer from '@/components/layout/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mainNavItems = [
    { href: '/dashboard/glow-up-console', icon: Crown, label: 'Glow-Up Console', description: 'Your focused command center' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Full Dashboard', description: 'Complete overview' },
    { href: '/dashboard/tracker', icon: Shield, label: 'No Contact Tracker', description: 'Track your progress' },
    { href: '/dashboard/rituals', icon: Zap, label: 'Daily Protocols', description: 'Your healing practices' },
    { href: '/wall', icon: MessageSquare, label: 'Wall of Wounds™', description: 'Anonymous confessions' }
  ];

  const settingsNavItems = [
    { href: '/dashboard/security', icon: Lock, label: 'Security', description: 'Password & privacy' }
  ];

  const enhancedNavItems = [];

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to home, regardless of API call success
      window.location.href = '/';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-950 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:block shadow-xl`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-center border-b border-gray-700/50 px-6 bg-gradient-to-r from-gray-900 to-gray-800">
          <Link href="/dashboard" className="font-black text-xl text-white tracking-tight hover:text-glitch-pink transition-colors duration-300">
            <span className="bg-gradient-to-r from-glitch-pink via-blue-400 to-purple-400 bg-clip-text text-transparent">
              CTRL+ALT+BLOCK
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-1 h-full overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-3">
              Main Menu
            </h3>
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left p-3 h-auto flex-col items-start gap-1 mb-1 rounded-xl transition-all duration-300 ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-glitch-pink/20 to-purple-500/20 border border-glitch-pink/30 text-white shadow-lg shadow-glitch-pink/20' 
                      : 'hover:bg-gray-800/60 hover:border-gray-600/50 border border-transparent text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center w-full">
                    <item.icon className={`h-5 w-5 mr-3 ${pathname === item.href ? 'text-glitch-pink' : ''}`} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 ml-8 font-normal">{item.description}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Settings Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-3">
              Settings
            </h3>
            {settingsNavItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left p-3 h-auto flex-col items-start gap-1 mb-1 rounded-xl transition-all duration-300 ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-white shadow-lg shadow-blue-400/20' 
                      : 'hover:bg-gray-800/60 hover:border-gray-600/50 border border-transparent text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center w-full">
                    <item.icon className={`h-4 w-4 mr-3 ${pathname === item.href ? 'text-blue-400' : ''}`} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 ml-7 font-normal">{item.description}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-3">
              Quick Actions
            </h3>
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto rounded-xl transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600/50 border border-transparent text-gray-300 hover:text-white mb-1"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home className="h-4 w-4 mr-3" />
                <span className="font-semibold text-sm">Back to Home</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto rounded-xl transition-all duration-300 hover:bg-red-500/20 hover:border-red-400/30 border border-transparent text-gray-300 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="font-semibold text-sm">Sign Out</span>
            </Button>
          </div>

          {/* User Info */}
          <div className="mt-auto border-t border-gray-700/50 pt-4">
            <div className="flex items-center p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-glitch-pink to-purple-500 mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">Warrior</p>
                <p className="text-xs text-gray-400">test@example.com</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-gray-900/95 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 border-gray-700/50">
          <div className="lg:hidden flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-gray-800/60 transition-colors duration-300"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            {/* Mobile logo */}
            <Link href="/dashboard" className="font-black text-lg text-white">
              <span className="bg-gradient-to-r from-glitch-pink via-blue-400 to-purple-400 bg-clip-text text-transparent">
                CTRL+ALT+BLOCK
              </span>
            </Link>
          </div>
          
          {/* Desktop header content */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">Welcome back, Warrior</p>
              <p className="text-xs text-gray-400">Ready to continue your journey?</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-950">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}