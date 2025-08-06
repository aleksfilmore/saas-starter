'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    if (hasCheckedAuth && user) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user && data.user.email) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username || data.user.email.split('@')[0],
            subscriptionTier: data.user.subscriptionTier || 'free',
            level: data.user.level || 1,
            xp: data.user.xp || 0,
            bytes: data.user.bytes || 0,
            noContactDays: data.user.noContactDays || 0,
            streak: data.user.streak || 0
          }
          
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem('user-email', data.user.email)
          setHasCheckedAuth(true)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const refetchUser = async () => {
    setHasCheckedAuth(false)
    await checkAuth()
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setHasCheckedAuth(false)
    localStorage.removeItem('user-email')
    router.push('/sign-in')
  }

  useEffect(() => {
    checkAuth()
  }, [])

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
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requiredSubscription?: 'premium' }
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/sign-in')
      } else if (!isLoading && isAuthenticated && user) {
        // Check subscription requirements
        if (options?.requiredSubscription === 'premium' && user.subscriptionTier !== 'premium') {
          router.push('/pricing') // Redirect to upgrade page
        }
      }
    }, [isLoading, isAuthenticated, user, router])

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-glitch-pink animate-pulse">
              🚀 Loading System...
            </div>
            <div className="text-gray-400 mt-2">Authenticating user session</div>
          </div>
        </div>
      )
    }

    if (!isAuthenticated || !user) {
      return null // Will redirect to sign-in
    }

    if (options?.requiredSubscription === 'premium' && user.subscriptionTier !== 'premium') {
      return null // Will redirect to pricing
    }

    return <Component {...props} />
  }
}
