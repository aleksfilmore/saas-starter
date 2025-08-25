'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, X, AlertTriangle, Clock, CheckCircle, Users, Zap, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Notification {
  id: string;
  type: string;
  title?: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationDisplayProps {
  className?: string;
}

export function NotificationDisplay({ className = "" }: NotificationDisplayProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if(notifications.length===0) fetchNotifications();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Initial prefetch (silent) once
  useEffect(() => { fetchNotifications(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    if(loading) return;
    try {
      setLoading(true);
      setLoadError(null);
      const response = await fetch('/api/notifications/list?limit=20', { credentials: 'include' });
      if(response.ok){
        const data = await response.json();
        setNotifications(data.items || []);
        setNextCursor(data.nextCursor || null);
      } else if(response.status === 401){
        setNotifications([]);
      } else {
        setLoadError('Server error');
      }
    } catch(e){
      setLoadError('Network error');
      console.error(e);
    } finally { setLoading(false); }
  };

  const loadMore = async () => {
    if(!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const r = await fetch(`/api/notifications/list?limit=20&cursor=${encodeURIComponent(nextCursor)}`);
      if(r.ok){
        const data = await r.json();
        setNotifications(prev => [...prev, ...(data.items||[])]);
        setNextCursor(data.nextCursor || null);
      }
    } finally { setLoadingMore(false); }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: [] }) });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch(e){ console.error('Failed to mark all', e); }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'social':
        return <Users className="w-4 h-4 text-green-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diff = now.getTime() - notificationTime.getTime();
    
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
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Icon/Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative text-gray-300 hover:text-white hover:bg-gray-700/50 p-2 ${
          unreadCount > 0 ? 'text-blue-400' : ''
        }`}
        title={`${unreadCount} unread notifications`}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] lg:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown - positioned to avoid container constraints */}
          <div className="absolute right-0 top-full mt-2 w-96 z-[9999] min-w-[384px] max-w-[90vw]">
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
                        onClick={fetchNotifications}
                        className="text-white border-gray-600 hover:bg-gray-700"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  )}

                  {!loading && !loadError && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <Bell className="w-12 h-12 text-gray-500 mb-3" />
                      <p className="text-sm text-gray-400 text-center">No notifications yet</p>
                      <p className="text-xs text-gray-500 text-center mt-1">You're all caught up!</p>
                    </div>
                  )}

                  {!loading && !loadError && notifications.length > 0 && (
                    <div className="divide-y divide-gray-700/50">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-purple-500/5 border-l-2 border-l-purple-400' : ''
                          }`}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                                {notification.title || notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(notification.createdAt)}
                                </span>
                                {!notification.read && (
                                  <CheckCircle className="w-4 h-4 text-purple-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {nextCursor && (
                        <button onClick={loadMore} disabled={loadingMore} className="w-full text-xs py-3 text-purple-300 hover:text-purple-200 disabled:opacity-50 bg-gray-900/40">
                          {loadingMore ? 'Loading…' : 'Load more'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && unreadCount > 0 && (
                  <div className="p-3 border-t border-gray-600/50 bg-gray-800/30 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark all as read
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
