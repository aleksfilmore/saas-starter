'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if component is mounted (client-side)
 * Prevents hydration mismatches for client-only operations
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook to safely access browser APIs that aren't available during SSR
 */
export function useSafeWindow() {
  const isClient = useIsClient()
  
  return {
    isClient,
    window: isClient ? window : undefined,
    localStorage: isClient ? localStorage : undefined,
    sessionStorage: isClient ? sessionStorage : undefined,
    navigator: isClient ? navigator : undefined
  }
}

/**
 * Hook for time-based operations that need to be consistent
 */
export function useTimeSync() {
  const [now, setNow] = useState(() => new Date())
  const isClient = useIsClient()

  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [isClient])

  return now
}
