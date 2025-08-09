"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Clock, Shield, Zap, Heart, AlertTriangle, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationPreferences {
  enablePush: boolean;
  enableEmail: boolean;
  enableInApp: boolean;
  streakReminders: boolean;
  dailyCheckins: boolean;
  ritualSuggestions: boolean;
  milestones: boolean;
  emergencySupport: boolean;
  lumoNudges: boolean;
  streakReminderTime: string;
  dailyCheckinTime: string;
  quietHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

export function NotificationSettings() {
  const { user } = useAuth();
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    subscribeToPush, 
    unsubscribeFromPush,
    sendTestNotification 
  } = useNotifications();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enablePush: true,
    enableEmail: true,
    enableInApp: true,
    streakReminders: true,
    dailyCheckins: true,
    ritualSuggestions: true,
    milestones: true,
    emergencySupport: true,
    lumoNudges: true,
    streakReminderTime: "20:00",
    dailyCheckinTime: "09:00",
    quietHours: {
      start: "22:00",
      end: "08:00",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences })
      });

      if (response.ok) {
        setHasChanges(false);
        // Show success message
        console.log('Notification preferences saved successfully');
      }
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const updateQuietHours = (key: 'start' | 'end', value: string) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const requestNotificationPermission = async () => {
    if (permission === 'granted') {
      await subscribeToPush();
    } else {
      const success = await subscribeToPush();
      if (success) {
        updatePreference('enablePush', true);
        console.log('Push notifications enabled');
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-600 rounded w-2/3"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
        <p className="text-sm text-gray-400">
          Control how and when you receive notifications
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Notification Channels */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Notification Channels</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-sm font-medium text-white">Push Notifications</div>
                  <div className="text-xs text-gray-400">Browser notifications</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isSubscribed && isSupported && permission !== 'denied' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={requestNotificationPermission}
                    className="text-xs"
                  >
                    Enable
                  </Button>
                )}
                {isSubscribed && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={sendTestNotification}
                    className="text-xs"
                  >
                    Test
                  </Button>
                )}
                <Switch
                  checked={preferences.enablePush && isSubscribed}
                  onCheckedChange={async (checked: boolean) => {
                    if (checked && !isSubscribed) {
                      await requestNotificationPermission();
                    } else if (!checked && isSubscribed) {
                      await unsubscribeFromPush();
                      updatePreference('enablePush', false);
                    } else {
                      updatePreference('enablePush', checked);
                    }
                  }}
                  disabled={!isSupported || permission === 'denied'}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Email Notifications</div>
                  <div className="text-xs text-gray-400">Important updates via email</div>
                </div>
              </div>
              <Switch
                checked={preferences.enableEmail}
                onCheckedChange={(checked: boolean) => updatePreference('enableEmail', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">In-App Notifications</div>
                  <div className="text-xs text-gray-400">Notifications within the app</div>
                </div>
              </div>
              <Switch
                checked={preferences.enableInApp}
                onCheckedChange={(checked: boolean) => updatePreference('enableInApp', checked)}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Notification Types</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-sm font-medium text-white">Streak Reminders</div>
                  <div className="text-xs text-gray-400">Daily reminders to maintain your streak</div>
                </div>
              </div>
              <Switch
                checked={preferences.streakReminders}
                onCheckedChange={(checked: boolean) => updatePreference('streakReminders', checked)}
              />
            </div>

            {preferences.streakReminders && (
              <div className="ml-7 flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">Remind me at:</span>
                <input
                  type="time"
                  value={preferences.streakReminderTime}
                  onChange={(e) => updatePreference('streakReminderTime', e.target.value)}
                  className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-sm font-medium text-white">Daily Check-ins</div>
                  <div className="text-xs text-gray-400">Reminders for daily progress check-ins</div>
                </div>
              </div>
              <Switch
                checked={preferences.dailyCheckins}
                onCheckedChange={(checked: boolean) => updatePreference('dailyCheckins', checked)}
              />
            </div>

            {preferences.dailyCheckins && (
              <div className="ml-7 flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">Remind me at:</span>
                <input
                  type="time"
                  value={preferences.dailyCheckinTime}
                  onChange={(e) => updatePreference('dailyCheckinTime', e.target.value)}
                  className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-pink-400" />
                <div>
                  <div className="text-sm font-medium text-white">Ritual Suggestions</div>
                  <div className="text-xs text-gray-400">Personalized ritual recommendations</div>
                </div>
              </div>
              <Switch
                checked={preferences.ritualSuggestions}
                onCheckedChange={(checked: boolean) => updatePreference('ritualSuggestions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="text-sm font-medium text-white">Milestones</div>
                  <div className="text-xs text-gray-400">Celebrations for achievements</div>
                </div>
              </div>
              <Switch
                checked={preferences.milestones}
                onCheckedChange={(checked: boolean) => updatePreference('milestones', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <div>
                  <div className="text-sm font-medium text-white">Emergency Support</div>
                  <div className="text-xs text-gray-400">Crisis support notifications</div>
                </div>
              </div>
              <Switch
                checked={preferences.emergencySupport}
                onCheckedChange={(checked: boolean) => updatePreference('emergencySupport', checked)}
                disabled={true} // Always enabled for safety
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                <div>
                  <div className="text-sm font-medium text-white">LUMO Nudges</div>
                  <div className="text-xs text-gray-400">AI companion contextual suggestions</div>
                </div>
              </div>
              <Switch
                checked={preferences.lumoNudges}
                onCheckedChange={(checked: boolean) => updatePreference('lumoNudges', checked)}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Quiet Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Quiet Hours
          </h3>
          <p className="text-xs text-gray-400">
            Notifications will be delayed during these hours
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">From:</span>
              <input
                type="time"
                value={preferences.quietHours.start}
                onChange={(e) => updateQuietHours('start', e.target.value)}
                className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">To:</span>
              <input
                type="time"
                value={preferences.quietHours.end}
                onChange={(e) => updateQuietHours('end', e.target.value)}
                className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Timezone: {preferences.quietHours.timezone}
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="pt-4">
            <Button
              onClick={savePreferences}
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? 'Saving...' : 'Save Notification Settings'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
