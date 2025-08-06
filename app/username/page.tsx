"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dice6, RefreshCw, CheckCircle, UserCircle, Sparkles } from 'lucide-react';

// Username generation data
const adjectives = [
  'anonymous', 'brave', 'calm', 'digital', 'evolved', 'free', 'guarded', 'hidden',
  'improved', 'just', 'kind', 'liberated', 'motivated', 'new', 'optimized', 'protected',
  'quiet', 'renewed', 'strong', 'transformed', 'upgraded', 'valued', 'wise', 'zen'
];

const nouns = [
  'seeker', 'warrior', 'guardian', 'builder', 'healer', 'survivor', 'dreamer', 'fighter',
  'creator', 'explorer', 'phoenix', 'wanderer', 'architect', 'sage', 'champion', 'voyager',
  'pioneer', 'mystic', 'rebel', 'knight', 'scholar', 'artist', 'runner', 'climber'
];

const numbers = ['01', '02', '03', '07', '11', '13', '21', '42', '99'];

export default function UsernamePage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  
  const router = useRouter();

  // Check if user is authenticated and get their info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (!data.user) {
          // Redirect to sign-up if not authenticated
          router.push('/quiz');
          return;
        }
        
        setUserEmail(data.user.email);
        generateUsername(); // Generate initial username
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/quiz');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const generateUsername = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    
    const newUsername = `${adjective}_${noun}_${number}`;
    setUsername(newUsername);
    setError('');
  };

  const checkUsernameAvailability = async (usernameToCheck: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameToCheck }),
      });
      
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Username check failed:', error);
      return false;
    }
  };

  const handleGenerateNew = async () => {
    setIsLoading(true);
    let attempts = 0;
    let newUsername = '';
    let isAvailable = false;

    // Try up to 10 times to generate a unique username
    while (!isAvailable && attempts < 10) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const number = numbers[Math.floor(Math.random() * numbers.length)];
      
      newUsername = `${adjective}_${noun}_${number}`;
      isAvailable = await checkUsernameAvailability(newUsername);
      attempts++;
    }

    if (isAvailable) {
      setUsername(newUsername);
      setError('');
    } else {
      setError('Having trouble generating a unique username. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleConfirmUsername = async () => {
    if (!username) {
      setError('Please generate a username first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check availability one more time
      const isAvailable = await checkUsernameAvailability(username);
      
      if (!isAvailable) {
        setError('This username is no longer available. Please generate a new one.');
        setIsLoading(false);
        return;
      }

      // Update user with the selected username
      const response = await fetch('/api/auth/set-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success) {
        // Store completion flag and redirect to dashboard
        localStorage.setItem('usernameSelected', 'true');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to set username. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Verifying your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-3 sm:py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-400">Final Step</span>
              <span className="text-xs sm:text-sm text-purple-400">
                Welcome, {userEmail}
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-2xl">
          
          {/* Page Title */}
          <div className="text-center mb-8">
            <UserCircle className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Choose Your Alias
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Your anonymous identity for the healing community
            </p>
            <p className="text-lg text-purple-400">
              No real names. No judgment. Just support.
            </p>
          </div>

          <Card className="bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">
                Generated Alias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Username Display */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg p-8 mb-6">
                  <div className="text-4xl font-mono text-white font-bold tracking-wider">
                    {username || 'generating...'}
                  </div>
                  <p className="text-gray-400 mt-2">
                    This will be your identity in the community
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleGenerateNew}
                    disabled={isLoading}
                    variant="outline"
                    className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-200 backdrop-blur-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Dice6 className="h-5 w-5 mr-2" />
                        Roll Again
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleConfirmUsername}
                    disabled={isLoading || !username}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold border-0"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Setting Alias...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Confirm & Enter Dashboard
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Sparkles className="h-6 w-6 text-purple-400 mr-2" />
                  <h3 className="text-white font-semibold">Anonymous by Design</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Your alias protects your privacy while connecting you with others on similar healing journeys.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <UserCircle className="h-6 w-6 text-green-400 mr-2" />
                  <h3 className="text-white font-semibold">Unique Identity</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Every alias is unique. Once taken, it can't be generated again, making your identity truly yours.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              🔒 Your real identity stays private • Anonymous community support • Change anytime in settings
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
