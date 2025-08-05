// Client-side authentication hook
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we have a stored auth token
      const token = localStorage.getItem('auth-token');
      const userEmail = localStorage.getItem('user-email');
      const userId = localStorage.getItem('user-id');
      const userRole = localStorage.getItem('user-role');

      if (!token || !userEmail || !userId) {
        setAuth({ user: null, loading: false, error: null });
        return;
      }

      // Validate the token with the server
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setAuth({
          user: {
            id: userId,
            email: userEmail,
            role: userRole || 'user',
          },
          loading: false,
          error: null,
        });
      } else {
        // Token is invalid, clear local storage
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-id');
        localStorage.removeItem('user-role');
        setAuth({ user: null, loading: false, error: null });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuth({ user: null, loading: false, error: 'Authentication check failed' });
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate server session
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Include cookies for Lucia session
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side cleanup even if API fails
    }

    // Clear localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-role');
    localStorage.removeItem('quizResult');
    localStorage.removeItem('attachmentStyle');
    setAuth({ user: null, loading: false, error: null });
    router.push('/sign-in');
  };

  return {
    ...auth,
    logout,
    checkAuth,
    isAuthenticated: !!auth.user,
    isAdmin: auth.user?.role === 'admin',
  };
}

// Authentication wrapper component
interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AuthWrapper({ children, requireAuth = true, requireAdmin = false }: AuthWrapperProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push('/sign-in');
        return;
      }
      
      if (requireAdmin && !isAdmin) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, isAdmin, requireAuth, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect
  }

  if (requireAdmin && !isAdmin) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
