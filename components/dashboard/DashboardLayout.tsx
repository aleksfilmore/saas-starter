'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

interface DashboardSlotProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}

export function WelcomeSection({ children, className }: DashboardSlotProps) {
  return (
    <section className={cn("mb-8", className)}>
      {children}
    </section>
  )
}

export function HeroSection({ children, className }: DashboardSlotProps) {
  return (
    <section className={cn("mb-8", className)}>
      {children}
    </section>
  )
}

export function StatsStrip({ children, className }: DashboardSlotProps) {
  return (
    <section className={cn("mb-8", className)}>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {children}
      </div>
    </section>
  )
}

export function SecondaryTiles({ children, className }: DashboardSlotProps) {
  return (
    <section className={cn("mb-8", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </section>
  )
}

export function QuickActionRow({ children, className }: DashboardSlotProps) {
  return (
    <section className={cn("mb-8", className)}>
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {children}
      </div>
    </section>
  )
}

export function CommunityFeed({ children, className }: DashboardSlotProps) {
  return (
    <section className={cn("", className)}>
      {children}
    </section>
  )
}
