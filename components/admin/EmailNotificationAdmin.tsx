"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Users, Send, BarChart3, RefreshCw } from 'lucide-react';

interface EmailStats {
  totalUsers: number;
  emailEnabledUsers: number;
  emailDisabledUsers: number;
}

export function EmailNotificationAdmin() {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [singleUserId, setSingleUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/email-notifications');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        setLastResult('❌ Failed to fetch stats (check admin permissions)');
      }
    } catch (error) {
      setLastResult('❌ Error fetching stats');
    } finally {
      setIsLoading(false);
    }
  };

  const sendBulkNotifications = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/admin/email-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bulk' })
      });

      if (response.ok) {
        const data = await response.json();
        setLastResult(`✅ Bulk notifications: ${data.sent} sent, ${data.failed} failed`);
        fetchStats(); // Refresh stats
      } else {
        const error = await response.json();
        setLastResult(`❌ ${error.error || 'Failed to send bulk notifications'}`);
      }
    } catch (error) {
      setLastResult('❌ Error sending bulk notifications');
    } finally {
      setIsSending(false);
    }
  };

  const sendSingleNotification = async () => {
    if (!singleUserId.trim()) {
      setLastResult('❌ Please enter a user ID');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/admin/email-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'single', userId: singleUserId.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setLastResult(data.success ? '✅ Single notification sent successfully' : '❌ Failed to send notification');
      } else {
        const error = await response.json();
        setLastResult(`❌ ${error.error || 'Failed to send notification'}`);
      }
    } catch (error) {
      setLastResult('❌ Error sending notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="bg-gray-800/80 border border-gray-600/50">
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-center">
          <Mail className="h-6 w-6 mr-2 text-blue-400" />
          Email Notification Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Stats Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Email Notification Stats
            </h3>
            <Button
              onClick={fetchStats}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {stats ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
              <div className="bg-green-900/30 p-4 rounded-lg text-center border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{stats.emailEnabledUsers}</div>
                <div className="text-sm text-gray-400">Email Enabled</div>
              </div>
              <div className="bg-red-900/30 p-4 rounded-lg text-center border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">{stats.emailDisabledUsers}</div>
                <div className="text-sm text-gray-400">Email Disabled</div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="text-gray-400">Click "Refresh" to load stats</div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-600" />

        {/* Bulk Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bulk Daily Reminders
          </h3>
          <p className="text-sm text-gray-400">
            Send daily reminder emails to all users with email notifications enabled.
          </p>
          <Button
            onClick={sendBulkNotifications}
            disabled={isSending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isSending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending Bulk Notifications...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Bulk Daily Reminders
              </>
            )}
          </Button>
        </div>

        <Separator className="bg-gray-600" />

        {/* Single Notification */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Single User Notification
          </h3>
          <p className="text-sm text-gray-400">
            Send a daily reminder email to a specific user by their user ID.
          </p>
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-white">User ID</Label>
            <Input
              id="userId"
              value={singleUserId}
              onChange={(e) => setSingleUserId(e.target.value)}
              placeholder="Enter user ID..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Button
            onClick={sendSingleNotification}
            disabled={isSending || !singleUserId.trim()}
            variant="outline"
            className="w-full border-gray-600 text-gray-300"
          >
            {isSending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Single Notification
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {lastResult && (
          <>
            <Separator className="bg-gray-600" />
            <div className="space-y-2">
              <h4 className="text-white font-medium">Last Operation Result:</h4>
              <div className={`p-3 rounded-lg text-sm font-mono ${
                lastResult.startsWith('✅') 
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-red-900/30 text-red-400 border border-red-500/30'
              }`}>
                {lastResult}
              </div>
            </div>
          </>
        )}

        {/* Usage Notes */}
        <div className="text-xs text-gray-500 bg-gray-700/30 p-3 rounded-lg">
          <strong>Note:</strong> This admin panel requires admin tier access. 
          Email notifications use the Resend service and require proper environment configuration.
        </div>
      </CardContent>
    </Card>
  );
}
