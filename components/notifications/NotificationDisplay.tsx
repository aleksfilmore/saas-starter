"use client"

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Heart, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Notification {
  id: string;
  type: 'streak_reminder' | 'daily_checkin' | 'lumo_nudge' | 'milestone' | 'emergency_support' | 'ritual_suggestion';
  title: string;
  message: string;
  timestamp: string | Date; // API returns string (created_at)
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationDisplayProps {
  className?: string;
}

export function NotificationDisplay({ className = "" }: NotificationDisplayProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchNotifications();
    // Set up real-time notification listener
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const response = await fetch('/api/notifications/recent', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setNotifications((data.notifications || []).map((n: any) => ({ ...n }))); // keep raw
      } else if (response.status === 401) {
        // Not authenticated silently
        setNotifications([]);
      } else {
        setLoadError('Server error');
      }
    } catch (error: any) {
      setLoadError('Network error');
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'streak_reminder':
        return <Shield className="w-5 h-5 text-orange-400" />;
      case 'daily_checkin':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'lumo_nudge':
        return <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />;
      case 'milestone':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'emergency_support':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'ritual_suggestion':
        return <Heart className="w-5 h-5 text-pink-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const ts = new Date(timestamp);
    if (isNaN(ts.getTime())) return '';
    const now = new Date();
    const diff = now.getTime() - ts.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-gray-400">Loading notifications...</p>
                </div>
              )}
              {!loading && loadError && (
                <div className="text-center py-6">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-xs text-red-300 mb-2">{loadError}</p>
                  <Button size="sm" variant="outline" className="text-xs" onClick={fetchNotifications}>Retry</Button>
                </div>
              )}
              {!loading && !loadError && notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No notifications yet</p>
                </div>
              ) : null}
              {!loading && !loadError && notifications.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        notification.read 
                          ? 'bg-gray-700/50 border-gray-600' 
                          : 'bg-gray-700 border-gray-600 ring-1 ring-purple-500/20'
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${
                              notification.read ? 'text-gray-300' : 'text-white'
                            }`}>
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-white p-1 ml-2"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <p className={`text-xs mt-1 ${
                            notification.read ? 'text-gray-400' : 'text-gray-300'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            
                            {notification.actionUrl && notification.actionText && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = notification.actionUrl!;
                                }}
                                className="text-xs py-1 px-2 h-auto"
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {notifications.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Mark all as read
                      notifications.forEach(n => {
                        if (!n.read) markAsRead(n.id);
                      });
                    }}
                    className="w-full text-xs text-gray-400 hover:text-white"
                  >
                    Mark all as read
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
