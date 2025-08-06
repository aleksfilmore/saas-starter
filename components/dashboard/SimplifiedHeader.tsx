'use client'

import React, { useState } from 'react'
import { Flame, Shield, Crown, ChevronDown, User, Settings, CreditCard, Trash2, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface SimplifiedHeaderProps {
  user: {
    username: string
    streak: number
    bytes: number
    level: number
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

          {/* Right Side: Status + User Menu */}
          <div className="flex items-center gap-4">
            
            {/* Consolidated Status Bar */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {/* No-Contact Streak with tooltip */}
              <div className="flex items-center gap-1" title="No-Contact streak days">
                <Flame className="h-4 w-4 text-orange-400" />
                <button 
                  onClick={onCheckin}
                  className="text-white hover:text-orange-300 transition-colors"
                  title="Click to check-in (once per day)"
                >
                  {user.noContactDays}
                </button>
              </div>
              
              <span className="text-gray-400">•</span>
              
              {/* Bytes */}
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">{user.bytes}</span>
                <span className="text-gray-400 text-xs">Bytes</span>
              </div>
              
              <span className="text-gray-400">•</span>
              
              {/* Level */}
              <div className="flex items-center gap-1" title="User level">
                <Crown className="h-4 w-4 text-yellow-400" />
                <span className="text-white">Lvl {user.level}</span>
              </div>
              
              {/* Shield (only if ready) */}
              {hasShield && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-400" />
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300">
                      READY
                    </Badge>
                  </div>
                </>
              )}
            </div>

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
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <Wind className="h-4 w-4" />
                        Breathing Exercise
                      </button>
                      <button
                        onClick={() => {
                          onCrisis()
                          setShowUserDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left text-red-300 hover:bg-gray-700 hover:text-red-200 transition-colors flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Crisis Support
                      </button>
                      
                      <div className="border-t border-gray-600 my-2"></div>
                      
                      <Link
                        href="/settings"
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Link
                        href="/subscription"
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <CreditCard className="h-4 w-4" />
                        Subscription Management
                      </Link>
                      <Link
                        href="/account/delete"
                        className="w-full px-4 py-2 text-left text-red-300 hover:bg-gray-700 hover:text-red-200 transition-colors flex items-center gap-2"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                      </Link>
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
