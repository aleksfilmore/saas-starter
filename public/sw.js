// Service Worker for Web Push Notifications
self.addEventListener('install', (event) => {
  console.log('CTRL+ALT+BLOCK™ notification service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('CTRL+ALT+BLOCK™ notification service worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Push event without data');
    return;
  }

  try {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: data.type || 'general',
      requireInteraction: data.type === 'emergency_support',
      actions: data.actions || [],
      data: {
        url: data.actionUrl || '/dashboard',
        type: data.type,
        timestamp: Date.now()
      },
      vibrate: data.type === 'emergency_support' ? [200, 100, 200] : [100]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error showing push notification:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  let urlToOpen = notificationData.url || '/dashboard';

  // Handle action button clicks
  if (event.action) {
    switch (event.action) {
      case 'start_ritual':
        urlToOpen = '/dashboard';
        break;
      case 'talk_to_lumo':
        urlToOpen = '/ai-therapy';
        break;
      case 'view_achievements':
        urlToOpen = '/achievements';
        break;
      case 'emergency_support':
        urlToOpen = '/crisis-support';
        break;
      default:
        urlToOpen = notificationData.url || '/dashboard';
    }
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              data: notificationData
            });
            return client.focus().then(() => {
              client.navigate(urlToOpen);
            });
          }
        }
        
        // Open new window if app is not open
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
  
  // Track notification dismissal for analytics
  event.waitUntil(
    fetch('/api/analytics/notification-dismissed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: event.notification.data.type,
        timestamp: event.notification.data.timestamp,
        dismissedAt: Date.now()
      })
    }).catch(error => {
      console.error('Failed to track notification dismissal:', error);
    })
  );
});

// Background sync for offline notification scheduling
self.addEventListener('sync', (event) => {
  if (event.tag === 'schedule-notifications') {
    event.waitUntil(
      fetch('/api/notifications/sync', {
        method: 'POST'
      }).then(response => {
        console.log('Notification sync completed');
      }).catch(error => {
        console.error('Notification sync failed:', error);
      })
    );
  }
});

// Periodic background sync for streak reminders
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'streak-reminder') {
    event.waitUntil(
      fetch('/api/notifications/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'streak_reminder',
          context: { source: 'background_sync' }
        })
      }).catch(error => {
        console.error('Background streak reminder failed:', error);
      })
    );
  }
});
