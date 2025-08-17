'use client';

// Force dynamic rendering for auth-dependent pages
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Settings, User, Bell, Shield, Palette, Database, Download, Trash2, LogOut } from 'lucide-react';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only try to use auth after component is mounted
  const auth = mounted ? useAuth() : null;
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout } = auth || {};

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const response = await fetch('/api/user/export', {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Create and download the file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ctrl-alt-block-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('Your data has been exported successfully!');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Your account has been permanently deleted.');
        if (logout) logout();
        window.location.href = '/';
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleSignOut = () => {
    if (logout) logout();
    window.location.href = '/';
  };

  // Show loading during SSR/hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Please sign in to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              ⚙️ Settings
            </h1>
            <p className="text-xl text-blue-400">
              Customize your healing experience
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Account Settings (restricted – removed profile/customization per cleanup) */}
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-400" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300 text-sm">
              <p>Profile editing & theme customization have been temporarily removed to streamline the settings experience.</p>
              <p>Need changes? Contact support.</p>
            </CardContent>
          </Card>

          {/* Notifications */}
          <NotificationSettings />

          {/* Privacy */}
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Shield className="h-6 w-6 mr-2 text-green-400" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-bold text-white">Anonymous Mode</h3>
                  <p className="text-sm text-gray-400">All your Wall posts are completely anonymous</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Active
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-bold text-white">Data Export</h3>
                  <p className="text-sm text-gray-400">Download your healing progress data (GDPR compliant)</p>
                </div>
                <Button 
                  onClick={handleExportData}
                  disabled={exportLoading}
                  variant="outline" 
                  className="border-green-500 text-green-400 hover:bg-green-500/10"
                >
                  {exportLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Exporting...
                    </div>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                <div>
                  <h3 className="font-bold text-white">Delete Account</h3>
                  <p className="text-sm text-gray-400">Permanently delete your account and all data (GDPR compliant)</p>
                </div>
                <Button 
                  onClick={handleDeleteAccount}
                  variant="outline" 
                  className={`border-red-500 text-red-400 hover:bg-red-500/10 ${deleteConfirm ? 'bg-red-500/20' : ''}`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteConfirm ? 'Confirm Delete' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customization removed */}

          {/* Account Actions */}
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Settings className="h-6 w-6 mr-2 text-gray-400" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-bold text-white">Sign Out</h3>
                  <p className="text-sm text-gray-400">Sign out of your account on this device</p>
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  className="border-gray-500 text-gray-400 hover:bg-gray-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
  );
}
