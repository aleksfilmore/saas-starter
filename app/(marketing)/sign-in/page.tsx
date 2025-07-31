"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Zap, Shield, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EnhancedSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        router.push('/dashboard/glow-up-console');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-30"></div>
      </div>

      <Card className="w-full max-w-lg bg-gray-900/60 border-2 border-purple-500/50 backdrop-blur-sm relative z-10">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-3xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ACCESS</span>
            </CardTitle>
            <p className="text-purple-400 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              Re-enter the emotional reformat zone
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-red-900/20 border-red-500/50">
              <AlertDescription className="text-red-400 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/50 transition-all"
                placeholder="your.email@domain.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Password
                </Label>
                <Link 
                  href="/reset-password" 
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/50 pr-10 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <h4 className="text-blue-400 font-medium mb-1">Secure Access</h4>
                  <p className="text-blue-200">
                    Your session is encrypted and your data is protected. All healing progress is securely stored.
                  </p>
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ACCESSING SYSTEM...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  ENTER THE RITUAL
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Features Preview */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-center">🎯 Your Glow-Up Console Awaits</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-purple-400">•</span>
                No Contact Tracker with real-time progress
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-pink-400">•</span>
                AI Therapy Sessions tailored to your emotional tone
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-blue-400">•</span>
                30/90 Day Protocols for systematic healing
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400">
              New to the digital healing revolution?{' '}
              <Link href="/sign-up" className="text-purple-400 hover:underline font-medium">
                Join the ritual FREE
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}