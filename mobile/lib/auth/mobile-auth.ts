// Shared authentication service for both web and mobile
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  username: string | null;
  tier: string;
  archetype: string | null;
  archetype_details: any;
  xp: number;
  bytes: number;
  level: number;
  ritual_streak: number;
  no_contact_streak: number;
  last_checkin: Date | null;
  last_ritual: Date | null;
  is_verified: boolean;
  subscription_status: string | null;
  subscription_expires: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  fresh: boolean;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-web-platform-url.com';

class MobileAuthService {
  private sessionToken: string | null = null;
  
  constructor() {
    this.initializeSession();
  }

  private async initializeSession() {
    try {
      const token = await SecureStore.getItemAsync('session_token');
      this.sessionToken = token;
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  }

  private async storeSession(token: string) {
    try {
      await SecureStore.setItemAsync('session_token', token);
      this.sessionToken = token;
    } catch (error) {
      console.error('Failed to store session:', error);
      // Fallback to AsyncStorage
      await AsyncStorage.setItem('session_token', token);
      this.sessionToken = token;
    }
  }

  private async clearSession() {
    try {
      await SecureStore.deleteItemAsync('session_token');
      this.sessionToken = null;
    } catch (error) {
      console.error('Failed to clear session:', error);
      // Fallback to AsyncStorage
      await AsyncStorage.removeItem('session_token');
      this.sessionToken = null;
    }
  }

  private getAuthHeaders() {
    return this.sessionToken ? {
      'Authorization': `Bearer ${this.sessionToken}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
  }

  async signIn(email: string, password: string): Promise<{ user: User; session: Session }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/sign-in`, {
        email,
        password,
      });

      const { user, session, sessionToken } = response.data;
      
      if (sessionToken) {
        await this.storeSession(sessionToken);
      }

      return { user, session };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign in failed');
    }
  }

  async signUp(email: string, password: string, username?: string): Promise<{ user: User; session: Session }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/sign-up`, {
        email,
        password,
        username,
      });

      const { user, session, sessionToken } = response.data;
      
      if (sessionToken) {
        await this.storeSession(sessionToken);
      }

      return { user, session };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign up failed');
    }
  }

  async signOut(): Promise<void> {
    try {
      if (this.sessionToken) {
        await axios.post(`${API_BASE_URL}/api/auth/sign-out`, {}, {
          headers: this.getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Sign out API call failed:', error);
    } finally {
      await this.clearSession();
    }
  }

  async validateSession(): Promise<{ user: User; session: Session } | { user: null; session: null }> {
    if (!this.sessionToken) {
      return { user: null, session: null };
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Session validation failed:', error);
      await this.clearSession();
      return { user: null, session: null };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { user } = await this.validateSession();
    return user;
  }

  async refreshSession(): Promise<boolean> {
    if (!this.sessionToken) {
      return false;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
        headers: this.getAuthHeaders(),
      });

      const { sessionToken } = response.data;
      
      if (sessionToken) {
        await this.storeSession(sessionToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      await this.clearSession();
      return false;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
        email,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        token,
        password,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  isAuthenticated(): boolean {
    return !!this.sessionToken;
  }
}

export const mobileAuth = new MobileAuthService();
