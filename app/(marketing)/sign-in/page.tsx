"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, RefreshCw, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <div className="w-full max-w-md">
          
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-300">
              Access your healing console
            </p>
          </div>

          <Card className="bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl font-bold flex items-center justify-center">
                <Shield className="h-6 w-6 mr-2 text-purple-400" />
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@domain.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot your password?
                  </Link>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <AlertDescription className="text-green-400">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg border-0"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Access Console
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center pt-6 border-t border-gray-600/50">
                <p className="text-gray-400">
                  New to CTRL+ALT+BLOCK?{' '}
                  <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Start Your Healing Journey
                  </Link>
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Test Credentials Info */}
          <div className="text-center mt-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
              <p className="text-xs text-gray-400 mb-2">For testing purposes:</p>
              <p className="text-sm text-gray-300">
                <span className="font-mono">test@example.com</span> / <span className="font-mono">password123</span>
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
