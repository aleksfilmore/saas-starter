'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated at all, redirect to sign-in
      if (!isAuthenticated || !user) {
        router.push('/sign-in');
        return;
      }

      // Check both email and isAdmin flag for admin access
      const isAdminUser = user.email === ADMIN_EMAIL || user.isAdmin;
      
      // If authenticated but not the admin, redirect to dashboard
      if (!isAdminUser) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">
            You must be signed in to access the admin panel.
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Wrong user (not admin)
  const isAdminUser = user.email === ADMIN_EMAIL || user.isAdmin;
  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin panel. Only the system administrator can view this page.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Signed in as: <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Required: <span className="font-medium">{ADMIN_EMAIL}</span>
            </p>
          </div>
          <div className="mt-6 space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized admin user
  return <>{children}</>;
}
