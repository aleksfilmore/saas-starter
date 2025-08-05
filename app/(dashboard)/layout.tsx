import { ReactNode } from 'react'
import { AuthWrapper } from '@/lib/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </AuthWrapper>
  )
}