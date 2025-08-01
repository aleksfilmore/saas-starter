"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Welcome back! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">SYSTEM ACCESS</h1>
          <p className="text-purple-400">Re-enter the collective</p>
        </div>

        <Card className="bg-gray-900/80 border border-gray-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign In to Your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-500/10">
                <AlertDescription className="text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Accessing System...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Access Granted
                </>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-600">
              <p className="text-gray-400">
                New to the collective?{' '}
                <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium">
                  Join Us
                </Link>
              </p>
            </div>

            {/* Demo Access */}
            <div className="text-center">
              <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
                <p className="text-xs text-gray-400 mb-2">Demo Access Available</p>
                <div className="flex gap-2 text-xs">
                  <button className="text-blue-400 hover:text-blue-300">Ghost Mode</button>
                  <span className="text-gray-500">•</span>
                  <button className="text-orange-400 hover:text-orange-300">Firewall User</button>
                  <span className="text-gray-500">•</span>
                  <button className="text-purple-400 hover:text-purple-300">Cult Leader</button>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
