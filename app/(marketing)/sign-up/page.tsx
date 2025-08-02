"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Shield } from 'lucide-react';

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  alias: string;
  emotionalTone: 'numb' | 'vengeance' | 'logic' | 'helpOthers';
  acceptedTerms: boolean;
}

const emotionalTones = [
  {
    id: 'numb' as const,
    emoji: '😶',
    title: 'Numb',
    description: 'Feeling disconnected, going through the motions',
    color: 'bg-gray-500/20 border-gray-500/50 text-gray-400'
  },
  {
    id: 'vengeance' as const,
    emoji: '😤',
    title: 'Vengeance',
    description: 'Anger, frustration, need for justice',
    color: 'bg-red-500/20 border-red-500/50 text-red-400'
  },
  {
    id: 'logic' as const,
    emoji: '🤖',
    title: 'Logic',
    description: 'Analytical, rational, solution-focused',
    color: 'bg-blue-500/20 border-blue-500/50 text-blue-400'
  },
  {
    id: 'helpOthers' as const,
    emoji: '🤝',
    title: 'Help Others',
    description: 'Empathetic, community-focused, supportive',
    color: 'bg-green-500/20 border-green-500/50 text-green-400'
  }
];

export default function EnhancedSignUp() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    confirmPassword: '',
    alias: '',
    emotionalTone: 'logic',
    acceptedTerms: false
  });
  
  const router = useRouter();
  const totalSteps = 4;
  const progressPercentage = (step / totalSteps) * 100;

  const handleInputChange = (field: keyof SignUpData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!formData.email || !formData.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.password || formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.alias || formData.alias.length < 3) {
          setError('Alias must be at least 3 characters long');
          return false;
        }
        return true;
      
      case 3:
        return true; // Emotional tone selection
      
      case 4:
        if (!formData.acceptedTerms) {
          setError('Please accept the terms and conditions');
          return false;
        }
        return true;
      
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          alias: formData.alias,
          emotionalTone: formData.emotionalTone
        })
      });

      if (response.ok) {
        // Redirect to onboarding or dashboard
        router.push('/onboarding');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-white">Create Your Account</h3>
              <p className="text-gray-300">Your journey to digital healing starts here</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2"
                  placeholder="Choose a strong password (8+ characters)"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-white">Choose Your Alias</h3>
              <p className="text-gray-300">How others will see you in the community</p>
            </div>
            
            <div>
              <Label htmlFor="alias" className="text-gray-300 text-sm font-medium">Community Alias</Label>
              <Input
                id="alias"
                type="text"
                value={formData.alias}
                onChange={(e) => handleInputChange('alias', e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2"
                placeholder="DigitalPhoenix, VoidWalker, etc."
                maxLength={20}
              />
              <p className="text-xs text-gray-400 mt-2">
                3-20 characters. This will be your identity on the Wall of Wounds.
              </p>
            </div>
            
            <Alert className="bg-blue-500/10 border-blue-500/50">
              <AlertDescription className="text-blue-400">
                💡 <strong>Tip:</strong> Choose something that represents your healing journey. 
                You can change this later in your profile settings.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🎛️</div>
              <h3 className="text-2xl font-bold text-white">Your Emotional Tone</h3>
              <p className="text-gray-300">This helps our AI adapt to your communication style</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emotionalTones.map((tone) => (
                <Button
                  key={tone.id}
                  onClick={() => handleInputChange('emotionalTone', tone.id)}
                  variant={formData.emotionalTone === tone.id ? 'default' : 'outline'}
                  className={`p-6 h-auto flex-col space-y-3 transition-all ${
                    formData.emotionalTone === tone.id 
                      ? 'bg-purple-500 text-white border-purple-400' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-3xl">{tone.emoji}</div>
                  <div className="text-center">
                    <div className="font-bold">{tone.title}</div>
                    <div className="text-sm opacity-80">{tone.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <Alert className="bg-purple-500/10 border-purple-500/50">
              <AlertDescription className="text-purple-400">
                🔄 <strong>Adaptive AI:</strong> Your selected tone influences how our AI therapist 
                communicates with you. You can adjust this anytime in your settings.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white">Ready to Begin!</h3>
              <p className="text-gray-300">Review your information and start your healing journey</p>
            </div>
            
            {/* Summary */}
            <Card className="bg-gray-700/50 border border-gray-600/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alias:</span>
                  <span className="text-white">{formData.alias}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Emotional Tone:</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/50">
                    {emotionalTones.find(t => t.id === formData.emotionalTone)?.emoji} {' '}
                    {emotionalTones.find(t => t.id === formData.emotionalTone)?.title}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="bg-green-500/10 border border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Free Tier Includes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Weekly AI therapy sessions
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Basic progress tracking
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Wall of Wounds access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Community support
                  </li>
                </ul>
                <p className="text-sm text-gray-400 mt-4">
                  You can upgrade to Firewall or Cult Leader tiers anytime from your dashboard.
                </p>
              </CardContent>
            </Card>

            {/* Terms */}
            <div className="flex items-start space-x-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptedTerms}
                onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
                className="mt-1 text-purple-500 focus:ring-purple-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I accept the{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      
      {/* Header matching homepage */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-2xl bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl">
          <CardHeader>
            <div className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-black text-white mb-4">
                Join CTRL+ALT+BLOCK
              </CardTitle>
              <p className="text-xl text-gray-300">Start your healing journey today</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-700" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/50">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {getStepContent()}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={step === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
                >
                  {isLoading ? 'Creating Account...' : 'Start Healing Journey'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-6 border-t border-gray-600/50">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer matching homepage */}
      <footer className="bg-gray-900/50 border-t border-gray-600/30 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-white mb-2">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </div>
            <p className="text-gray-400 text-sm">
              Transform your heartbreak into strength
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
