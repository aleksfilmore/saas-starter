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
        className={`relative p-2.5 rounded-xl transition-all duration-200 ${
          unreadCount > 0 
            ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 ring-1 ring-purple-500/30' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        }`}
      >
        <Bell className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'scale-110' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 z-[9999]">
          <Card className="bg-gray-900/95 backdrop-blur-xl border border-gray-600/50 shadow-2xl max-h-[70vh] flex flex-col overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-600/50 bg-gray-800/50 shrink-0">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm text-gray-400">Loading notifications...</p>
                  </div>
                )}
                
                {!loading && loadError && (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
                    <p className="text-sm text-red-300 mb-3 text-center">{loadError}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700/50" 
                      onClick={fetchNotifications}
                    >
                      Retry
                    </Button>
                  </div>
                )}
                
                {!loading && !loadError && notifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-3">
                      <Bell className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-400 text-center">No notifications yet</p>
                    <p className="text-xs text-gray-500 text-center mt-1">We'll notify you about important updates</p>
                  </div>
                )}
                
                {!loading && !loadError && notifications.length > 0 && (
                  <div className="space-y-2 p-3">
                    {notifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          notification.read 
                            ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/40' 
                            : 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 border-purple-500/40 hover:border-purple-400/60 shadow-lg shadow-purple-500/10'
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0 pr-8">
                            <h4 className={`text-sm font-medium leading-snug ${
                              notification.read ? 'text-gray-300' : 'text-white'
                            }`}>
                              {notification.title}
                            </h4>
                            
                            <p className={`text-sm mt-1 leading-relaxed ${
                              notification.read ? 'text-gray-400' : 'text-gray-300'
                            }`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500 font-medium">
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
                                  className="text-xs py-1.5 px-3 h-auto border-purple-500/30 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50"
                                >
                                  {notification.actionText}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 p-1.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-600/50 bg-gray-800/30 p-3 shrink-0">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        notifications.forEach(n => {
                          if (!n.read) markAsRead(n.id);
                        });
                      }}
                      className="flex-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700/50 py-2"
                      disabled={unreadCount === 0}
                    >
                      Mark all read
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = '/settings';
                      }}
                      className="flex-1 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 py-2"
                    >
                      Settings
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
