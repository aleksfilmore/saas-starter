// File: app/(dashboard)/security/page.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, Loader2, Shield, AlertTriangle, Key } from 'lucide-react';

interface ActionResult {
  error: string | null;
  success: string | null;
}

export default function SecurityPage() {
  const [passwordState, setPasswordState] = useState<ActionResult>({ error: null, success: null });
  const [deleteState, setDeleteState] = useState<ActionResult>({ error: null, success: null });
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);

  const handlePasswordUpdate = async (formData: FormData) => {
    setIsPasswordPending(true);
    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.get('currentPassword'),
          newPassword: formData.get('newPassword'),
          confirmPassword: formData.get('confirmPassword'),
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        setPasswordState({ error: null, success: 'Password updated successfully!' });
      } else {
        setPasswordState({ error: result.error || 'Failed to update password', success: null });
      }
    } catch (error) {
      setPasswordState({ error: 'Network error', success: null });
    } finally {
      setIsPasswordPending(false);
    }
  };

  const handleAccountDelete = async (formData: FormData) => {
    setIsDeletePending(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: formData.get('password'),
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        // Redirect to home page after successful deletion
        window.location.href = '/';
      } else {
        setDeleteState({ error: result.error || 'Failed to delete account', success: null });
      }
    } catch (error) {
      setDeleteState({ error: 'Network error', success: null });
    } finally {
      setIsDeletePending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 py-8 px-6">
        <h1 className="text-3xl font-black text-white mb-8" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', WebkitTextStroke: '1px #ec4899'}}>
          Security <span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>Settings</span>
        </h1>
        
        <div className="space-y-8 max-w-4xl">
          {/* Update Password Card */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black text-white mb-6 flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                <Key className="w-6 h-6 mr-3 text-blue-400" />
                Update Password
              </h2>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePasswordUpdate(new FormData(e.target as HTMLFormElement)); }}>
                <div className="grid gap-3">
                  <Label htmlFor="current-password" className="text-white font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    required
                    className="bg-gray-800/80 border-2 border-blue-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-blue-400"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="new-password" className="text-white font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="bg-gray-800/80 border-2 border-blue-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-blue-400"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password" className="text-white font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="bg-gray-800/80 border-2 border-blue-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-glitch-pink focus-visible:border-glitch-pink rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-blue-400"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  />
                </div>

                {passwordState?.error && (
                  <div className="bg-red-900/20 border border-red-400/50 rounded-xl p-4">
                    <p className="text-red-400 font-bold" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      {passwordState.error}
                    </p>
                  </div>
                )}
                
                {passwordState?.success && (
                  <div className="bg-green-900/20 border border-green-400/50 rounded-xl p-4">
                    <p className="text-green-400 font-bold" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      {passwordState.success}
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isPasswordPending}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 rounded-xl px-8 py-3 text-lg font-black disabled:opacity-50"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
                >
                  {isPasswordPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                      UPDATING...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" /> 
                      UPDATE PASSWORD
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Delete Account Card */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black text-red-400 mb-6 flex items-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                Delete Account
              </h2>
              
              <div className="bg-red-900/20 border border-red-400/50 rounded-xl p-6 mb-6">
                <p className="text-white font-medium mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <p className="text-red-400 text-sm font-bold flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  This includes your streaks, rituals, badges, and all progress data.
                </p>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAccountDelete(new FormData(e.target as HTMLFormElement)); }} className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="delete-password" className="text-white font-black text-lg" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    Confirm Password
                  </Label>
                  <Input
                    id="delete-password"
                    name="password"
                    type="password"
                    required
                    className="bg-gray-800/80 border-2 border-red-400/50 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-500 rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 hover:border-red-400"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  />
                </div>
                
                {deleteState?.error && (
                  <div className="bg-red-900/20 border border-red-400/50 rounded-xl p-4">
                    <p className="text-red-400 font-bold" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      {deleteState.error}
                    </p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isDeletePending}
                  className="bg-red-500 hover:bg-red-600 text-white font-black rounded-xl px-6 py-3 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
                >
                  {isDeletePending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                      DELETING...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-5 w-5" /> 
                      DELETE ACCOUNT
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
