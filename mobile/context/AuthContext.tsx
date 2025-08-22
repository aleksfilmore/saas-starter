import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  bytes: number;
  streak: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure API base URL - update this to match your backend
const API_BASE = __DEV__ 
  ? 'http://localhost:3001'  // Local development server
  : 'https://your-netlify-site.netlify.app'; // Production deployment

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        // Verify token with your API
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          await SecureStore.deleteItemAsync('auth_token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await SecureStore.setItemAsync('auth_token', data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in failed:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (response.ok) {
        const data = await response.json();
        await SecureStore.setItemAsync('auth_token', data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up failed:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
