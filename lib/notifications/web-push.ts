// Web Push Notification Registration and Management

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class WebPushManager {
  private vapidPublicKey: string;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor(vapidPublicKey: string) {
    this.vapidPublicKey = vapidPublicKey;
  }

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Web Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully');

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage);

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  private handleServiceWorkerMessage = (event: MessageEvent) => {
    if (event.data.type === 'NOTIFICATION_CLICKED') {
      console.log('Notification clicked:', event.data.data);
      // Handle notification click in the app
      this.handleNotificationClick(event.data.data);
    }
  };

  private handleNotificationClick(data: any) {
    // Update UI state, mark notification as read, etc.
    const event = new CustomEvent('notificationClicked', { detail: data });
    window.dispatchEvent(event);
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    try {
      if (Notification.permission === 'granted') {
        return 'granted';
      }

      if (Notification.permission === 'denied') {
        return 'denied';
      }

      // Request permission
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.warn('Notification permission request failed:', (error as Error)?.message || 'Unknown error');
      return 'denied';
    }
  }

  async subscribeToPush(): Promise<PushSubscriptionData | null> {
    if (!this.serviceWorkerRegistration) {
      console.error('Service Worker not registered');
      return null;
    }

    try {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.log('Push notification permission denied');
        return null;
      }

      // Check if already subscribed
      let subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();

      if (!subscription) {
        // Create new subscription
        const convertedVapidKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
        subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey as BufferSource
        });
      }

      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };

      // Send subscription to server
      await this.sendSubscriptionToServer(subscriptionData);

      console.log('Push subscription successful');
      return subscriptionData;

    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.serviceWorkerRegistration) {
      return false;
    }

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server of unsubscription
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });

        console.log('Push unsubscription successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscriptionData): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription on server');
      }
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Test notification
  async sendTestNotification(): Promise<void> {
    try {
      await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Test notification sent');
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  }

  // Schedule background sync for offline functionality
  async scheduleBackgroundSync(): Promise<void> {
    if (!this.serviceWorkerRegistration) {
      return;
    }

    try {
      // Check if background sync is supported
      if ('sync' in this.serviceWorkerRegistration) {
        await (this.serviceWorkerRegistration as any).sync.register('schedule-notifications');
        console.log('Background sync registered');
      } else {
        console.log('Background sync not supported');
      }
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  // Check if push notifications are supported and enabled
  isSupported(): boolean {
    return typeof window !== 'undefined' &&
           'serviceWorker' in navigator && 
           'PushManager' in window && 
           'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      return Notification.permission;
    } catch (error) {
      console.warn('Failed to access Notification.permission:', (error as Error)?.message || 'Unknown error');
      return 'denied';
    }
  }
}

// Default VAPID public key (in production, this should be loaded from environment)
const DEFAULT_VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLdgC4v8-a-fhBEvTJbwgDrqNcKN0JM-Xx0YVG5UD5PbtCbVDgZfMKI';

export const webPushManager = new WebPushManager(DEFAULT_VAPID_PUBLIC_KEY);

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  webPushManager.initialize().catch(console.error);
}

export default WebPushManager;
