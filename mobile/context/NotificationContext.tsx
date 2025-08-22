import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationContextType {
  expoPushToken: string | null;
  scheduleRitualReminder: (ritualTitle: string, time: Date) => Promise<string | null>;
  cancelNotification: (notificationId: string) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  const scheduleRitualReminder = async (ritualTitle: string, time: Date): Promise<string | null> => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for your ritual! 🌟',
          body: `Don't forget to complete: ${ritualTitle}`,
          data: { ritualTitle },
        },
        trigger: {
          date: time,
        },
      });
      
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  };

  const cancelNotification = async (notificationId: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        scheduleRitualReminder,
        cancelNotification,
        requestPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
