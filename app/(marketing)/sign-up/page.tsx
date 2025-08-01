"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw, Shield, Check } from 'lucide-react';

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  alias: string;
  acceptedTerms: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    confirmPassword: '',
    alias: '',
    acceptedTerms: false
  });
  
  const [generatedAliases, setGeneratedAliases] = useState<string[]>([]);
  const [selectedAlias, setSelectedAlias] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateAliases = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/onboarding/generate-codenames');
      const data = await response.json();
      
      if (data.success) {
        setGeneratedAliases(data.codenames);
        setSelectedAlias(''); // Reset selection
      } else {
        setError('Failed to generate aliases. Please try again.');
      }
    } catch (error) {
      setError('Failed to generate aliases. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateAliases(); // Generate initial aliases on component mount
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password || !selectedAlias) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    try {
      const signupData = {
        ...formData,
        alias: selectedAlias
      };

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully! Redirecting to onboarding...');
        setTimeout(() => {
          router.push('/onboarding');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">JOIN THE COLLECTIVE</h1>
          <p className="text-purple-400">Begin your healing protocol</p>
        </div>

        <Card className="bg-gray-900/80 border border-gray-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Create Your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Step 1: Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Must be 6-50 characters long with at least one letter and one number
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            {/* Alias Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Choose Your Digital Alias</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAliases}
                  disabled={isGenerating}
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  Generate New
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {generatedAliases.map((alias) => (
                  <button
                    key={alias}
                    type="button"
                    onClick={() => setSelectedAlias(alias)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedAlias === alias
                        ? 'bg-purple-600 border-2 border-purple-400 text-white'
                        : 'bg-gray-800 border border-gray-600 text-gray-300 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold">{alias}</span>
                      {selectedAlias === alias && <Check className="h-4 w-4" />}
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-gray-400">
                🛡️ Aliases are auto-generated to protect your identity and maintain anonymity
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptedTerms}
                onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I accept the{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </Link>
              </label>
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
              disabled={isLoading || !selectedAlias}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Begin Your Journey
                </>
              )}
            </Button>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-600">
              <p className="text-gray-400">
                Already part of the collective?{' '}
                <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
