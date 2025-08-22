import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Ritual {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  duration: number;
  completed: boolean;
  bytesReward: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  isPurchased: boolean;
}

interface DataContextType {
  rituals: Ritual[];
  achievements: Achievement[];
  shopItems: ShopItem[];
  todayActions: any[];
  recentActions: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
  completeRitual: (ritualId: string) => Promise<boolean>;
  purchaseItem: (itemId: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Configure API base URL - update this to match your backend
const API_BASE = __DEV__ 
  ? 'http://localhost:3001'  // Local development server
  : 'https://your-netlify-site.netlify.app'; // Production deployment

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [todayActions, setTodayActions] = useState<any[]>([]);
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [dashboardRes, ritualsRes, todayRes, recentRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard`),
        fetch(`${API_BASE}/api/rituals/today`),
        fetch(`${API_BASE}/api/actions/today`),
        fetch(`${API_BASE}/api/actions/recent`),
      ]);

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        // Extract rituals from dashboard response
        setRituals(dashboardData.ritual ? [dashboardData.ritual] : []);
      }

      if (ritualsRes.ok) {
        const ritualsData = await ritualsRes.json();
        setRituals(ritualsData.rituals || []);
      }

      // For now, use mock data for achievements and shop
      setAchievements([
        {
          id: 'first_ritual',
          title: 'First Steps',
          description: 'Complete your first ritual',
          icon: '🌱',
          unlockedAt: new Date().toISOString(),
        },
      ]);

      setShopItems([
        {
          id: 'theme_dark',
          title: 'Dark Theme',
          description: 'Unlock dark mode',
          price: 100,
          category: 'themes',
          icon: '🌙',
          isPurchased: false,
        },
      ]);

      if (todayRes.ok) {
        const todayData = await todayRes.json();
        setTodayActions(todayData.actions || []);
      }

      if (recentRes.ok) {
        const recentData = await recentRes.json();
        setRecentActions(recentData.actions || []);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeRitual = async (ritualId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/rituals/${ritualId}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setRituals(prev => prev.map(ritual => 
          ritual.id === ritualId ? { ...ritual, completed: true } : ritual
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to complete ritual:', error);
      return false;
    }
  };

  const purchaseItem = async (itemId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/shop/${itemId}/purchase`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setShopItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, isPurchased: true } : item
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to purchase item:', error);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        rituals,
        achievements,
        shopItems,
        todayActions,
        recentActions,
        loading,
        refreshData,
        completeRitual,
        purchaseItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
