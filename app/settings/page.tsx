'use client';

// Force dynamic rendering for auth-dependent pages
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Settings, User, Bell, Shield, Palette, Database, Download, Trash2, LogOut, Mail, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

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

  const handleSendVerification = async () => {
    if (!authUser?.email) return;
    
    setVerificationLoading(true);
    setVerificationMessage('');
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: authUser.email }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationMessage('📧 Verification email sent! Check your inbox.');
      } else {
        setVerificationMessage(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      setVerificationMessage('Network error. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
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
            <CardContent className="space-y-4">
              
              {/* Email Verification Status */}
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="font-bold text-white flex items-center">
                      Email Verification
                      {authUser?.emailVerified ? (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 ml-2 text-yellow-400" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {authUser?.email} - {authUser?.emailVerified ? 'Verified' : 'Not verified'}
                    </p>
                    {!authUser?.emailVerified && (
                      <p className="text-xs text-purple-300 mt-1">
                        Verify to unlock +50 XP and exclusive rewards
                      </p>
                    )}
                  </div>
                </div>
                
                {authUser?.emailVerified ? (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    <span className="text-green-400 font-medium text-sm">Verified</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end space-y-2">
                    <Button 
                      onClick={handleSendVerification}
                      disabled={verificationLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                    >
                      {verificationLoading ? (
                        <div className="flex items-center">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Get Rewards
                        </>
                      )}
                    </Button>
                    <Link href="/verify-email">
                      <Button variant="outline" className="bg-transparent border-purple-400/50 text-purple-300 hover:bg-purple-500/10 text-xs">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              
              {verificationMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  verificationMessage.includes('sent') 
                    ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}>
                  {verificationMessage}
                </div>
              )}

              <div className="text-gray-300 text-sm">
                <p>Profile editing & theme customization have been temporarily removed to streamline the settings experience.</p>
                <p>Need changes? Contact support.</p>
              </div>
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
