'use client'

import React, { useState, useEffect } from 'react'
import { Flame, Shield, Crown, ChevronDown, User, Wind, Settings, CreditCard, Trash2, Loader2, Bell, Key, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { NotificationDisplay } from '@/components/notifications/NotificationDisplay'

interface SimplifiedHeaderProps {
  user: {
    username: string
    streak: number
    bytes: number
    badges: number
    noContactDays: number
    subscriptionTier: 'free' | 'premium'
  }
  hasShield: boolean
  onCheckin: () => void
  onBreathing: () => void
  onCrisis: () => void
}

export function SimplifiedHeader({ user, hasShield, onCheckin, onBreathing, onCrisis }: SimplifiedHeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [badgeUpdating, setBadgeUpdating] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState<boolean | null>(null)
  const [togglingEmail, setTogglingEmail] = useState(false)

  // Preload email notification preference once on mount
  useEffect(() => {
    let active = true
    if (emailEnabled !== null) return
    ;(async () => {
      try {
        const prefRes = await fetch('/api/notifications', { cache: 'no-store' })
        if (!prefRes.ok) return
        const data = await prefRes.json()
        if (active) setEmailEnabled(!!data?.preferences?.enableEmail)
      } catch (e) {
        console.warn('Pref load failed', e)
      }
    })()
    return () => { active = false }
  }, [emailEnabled])

  async function openStripePortal() {
    try {
      setPortalLoading(true)
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!res.ok) throw new Error('Portal error')
      const data = await res.json()
      const url = data?.url
      if (url) {
        window.location.href = url
      }
    } catch (e) {
      console.error('Open portal failed', e)
      alert('Could not open subscription portal.')
    } finally {
      setPortalLoading(false)
      setShowUserDropdown(false)
    }
  }

  async function setFirewallBadge() {
    try {
      setBadgeUpdating(true)
      // Fetch locker to discover firewall badge dynamically (name contains 'firewall')
      const locker = await fetch('/api/badges/locker').then(r => r.ok ? r.json() : null)
      const list = locker?.badges || locker?.data?.badges || []
      const firewall = list.find((b: any) => /fire ?wall/i.test(b.name || ''))
      if (!firewall) {
        alert('Firewall badge not found yet. Earn it first!')
        return
      }
      const resp = await fetch('/api/badges/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ badgeId: firewall.id }) })
      if (resp.ok) {
        alert('Profile badge set to Firewall')
      } else {
        alert('Failed to set badge')
      }
    } catch (e) {
      console.error('Set firewall badge error', e)
      alert('Error setting badge')
    } finally {
      setBadgeUpdating(false)
      setShowUserDropdown(false)
    }
  }

  async function toggleEmailNotifications() {
    if (togglingEmail) return
    try {
      setTogglingEmail(true)
      // lazy fetch initial state if unknown
      let current = emailEnabled
      if (current === null) {
        try {
          const prefRes = await fetch('/api/notifications', { cache: 'no-store' })
          if (prefRes.ok) {
            const data = await prefRes.json()
            current = !!data?.preferences?.enableEmail
            setEmailEnabled(current)
          }
        } catch {}
      }
      const next = !(current ?? true)
      // optimistic
      setEmailEnabled(next)
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: { enableEmail: next } })
      })
      if (!res.ok) {
        // revert on failure
        setEmailEnabled(current ?? true)
        alert('Failed to update email preference')
      }
    } finally {
      setTogglingEmail(false)
    }
  }

  return (
    <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50 mb-8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-3 sm:py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white">
            <span>CTRL</span>
            <span className="text-gray-400">+</span>
            <span>ALT</span>
            <span className="text-gray-400">+</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
          </Link>

          {/* Right Side: Compact Stats Pill + User Menu */}
          <div className="flex items-center gap-4">
            
            {/* Consolidated Status Pill - Compact */}
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-full border border-gray-600/50 text-sm">
              <div className="flex items-center gap-1" title="No-Contact streak & Badges">
                <Flame className="h-4 w-4 text-orange-400" />
                <button 
                  onClick={onCheckin}
                  className="text-white hover:text-orange-300 transition-colors"
                  title="Click to check-in (once per day)"
                >
      {user.streak ?? user.noContactDays}
                </button>
              </div>
              
              {/* Shield (only if ready) */}
              {hasShield && (
                <>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Ready</span>
                  </div>
                </>
              )}
              
              <div className="flex items-center gap-1" title="Bytes earned">
                <span className="text-white">{user.bytes}</span>
                <span className="text-gray-500 text-[10px]">B</span>
              </div>
              
              <div className="flex items-center gap-1" title="Badges earned">
                <span className="text-white">🏆{user.badges}</span>
              </div>
            </div>

            {/* Crisis Support */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCrisis}
              className="hidden md:inline-flex text-red-300 hover:text-red-200 hover:bg-red-500/10"
              title="Crisis Support"
            >
              <Shield className="h-4 w-4" />
            </Button>

            {/* Notification Display */}
            <NotificationDisplay />

            {/* User Dropdown Menu */}
            <div className="relative">
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-gray-300 hover:text-white p-2 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-sm">{user.username}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50"
                  >
                    <div className="p-3 border-b border-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-xs text-gray-400">
                            {user.subscriptionTier === 'premium' ? '👑 Premium' : '🔓 Free User'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          onBreathing()
                          setShowUserDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left text-teal-300 hover:bg-gray-700 hover:text-teal-200 transition-colors flex items-center gap-2"
                      >
                        <Wind className="h-4 w-4" />
                        Breathing
                      </button>
                      <button
                        onClick={() => {
                          onCrisis()
                          setShowUserDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left text-red-300 hover:bg-gray-700 hover:text-red-200 transition-colors flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Crisis
                      </button>
                      
                      <div className="border-t border-gray-600 my-2"></div>
                      
                      <Link
                        href="/dashboard/progress"
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Settings className="h-4 w-4" />
                        📊 Progress & Stats
                      </Link>
                      
                      <button
                        onClick={openStripePortal}
                        disabled={portalLoading}
                        className="w-full px-4 py-2 text-left disabled:opacity-50 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                      >
                        {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                        Manage Subscription
                      </button>

                      <button
                        onClick={toggleEmailNotifications}
                        disabled={togglingEmail}
                        className="w-full px-4 py-2 text-left disabled:opacity-50 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                      >
                        {togglingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                        {emailEnabled === false ? 'Enable Daily Email' : 'Disable Daily Email'}
                      </button>

                      <Link
                        href="/change-password"
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Key className="h-4 w-4" />
                        Change Password
                      </Link>

                      <button
                        onClick={setFirewallBadge}
                        disabled={badgeUpdating}
                        className="w-full px-4 py-2 text-left disabled:opacity-50 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                      >
                        {badgeUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                        Firewall Badge
                      </button>
                      
                      <Link
                        href="/settings"
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Settings className="h-4 w-4" />
                        ⚙️ Settings
                      </Link>
                      
                      <div className="border-t border-gray-600 my-2"></div>
                      
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/auth/logout', {
                              method: 'POST',
                              credentials: 'include'
                            })
                            
                            if (response.ok) {
                              // Clear any local storage
                              localStorage.removeItem('user-email')
                              // Redirect to home page
                              window.location.href = '/'
                            } else {
                              console.error('Logout failed')
                            }
                          } catch (error) {
                            console.error('Logout error:', error)
                          }
                          setShowUserDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left text-red-300 hover:bg-gray-700 hover:text-red-200 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        🚪 Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
