'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  username: string
  subscriptionTier: 'free' | 'premium'
  level: number
  xp: number
  bytes: number
  noContactDays: number
  streak: number
  isAdmin?: boolean
  emailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  updateUser: (updates: Partial<User>) => void
  logout: () => void
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        const userData = data.user
        // Map the API response to our User interface
        const user: User = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          subscriptionTier: userData.subscriptionTier,
          level: userData.level,
          xp: userData.xp,
          bytes: userData.bytes,
          noContactDays: userData.no_contact_streak || 0,
          streak: userData.ritual_streak || 0,
          isAdmin: userData.isAdmin || false,
          emailVerified: userData.emailVerified || false
        }
        setUser(user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      window.location.href = '/sign-in'
    }
  }

  const refetchUser = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      updateUser,
      logout,
      refetchUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // During SSR or if provider is missing, return safe defaults
    if (typeof window === 'undefined') {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        updateUser: () => {},
        logout: async () => {},
        refetchUser: async () => {}
      }
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
