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
    title: 'Vengeance Mode',
    description: 'Channel that anger into growth and success',
    color: 'bg-red-500/20 border-red-500/50 text-red-400'
  },
  {
    id: 'logic' as const,
    emoji: '🤖',
    title: 'Pure Logic',
    description: 'Analytical approach to healing and growth',
    color: 'bg-blue-500/20 border-blue-500/50 text-blue-400'
  },
  {
    id: 'helpOthers' as const,
    emoji: '🤝',
    title: 'Help Others',
    description: 'Find healing through supporting the community',
    color: 'bg-green-500/20 border-green-500/50 text-green-400'
  }
];

const pricingTiers = {
  free: [
    'Essential therapy tools',
    'Basic progress tracking',
    'Community support'
  ],
  firewall: [
    'Unlimited therapy sessions',
    'Advanced progress analytics',
    'Priority community features',
    'Custom emotional tracking',
    'Weekly streak bonuses'
  ],
  'cult-leader': [
    'Everything in Firewall',
    'Exclusive glitch effects',
    'Community moderation tools',
    'Custom AI personality',
    'Early feature access',
    'Direct developer feedback'
  ]
};

export default function SignUpPage() {
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
          setError('Password must be at least 8 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      case 2:
        if (!formData.alias || formData.alias.length < 3) {
          setError('Alias must be at least 3 characters');
          return false;
        }
        return true;
      case 3:
        return true; // Emotional tone has default
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
      const response = await fetch('/api/auth/signup/enhanced', {
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
        router.push('/dashboard/glow-up-console');
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
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔐</div>
              <h3 className="text-xl font-bold text-white">Create Your Account</h3>
              <p className="text-gray-400">Your journey to digital healing starts here</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Choose a strong password"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">👤</div>
              <h3 className="text-xl font-bold text-white">Choose Your Identity</h3>
              <p className="text-gray-400">Pick an alias for your healing journey</p>
            </div>
            
            <div>
              <Label htmlFor="alias" className="text-gray-300">Alias</Label>
              <Input
                id="alias"
                type="text"
                value={formData.alias}
                onChange={(e) => handleInputChange('alias', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="DigitalPhoenix, VoidWalker, etc."
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                3-20 characters. This will be your identity on the Wall of Wounds.
              </p>
            </div>
            
            <Alert className="bg-blue-900/20 border-blue-500/50">
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
              <div className="text-4xl mb-2">🎛️</div>
              <h3 className="text-xl font-bold text-white">Your Emotional Tone</h3>
              <p className="text-gray-400">This helps our AI adapt to your communication style</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emotionalTones.map((tone) => (
                <Button
                  key={tone.id}
                  onClick={() => handleInputChange('emotionalTone', tone.id)}
                  variant={formData.emotionalTone === tone.id ? 'default' : 'outline'}
                  className={`p-6 h-auto flex-col space-y-3 transition-all ${
                    formData.emotionalTone === tone.id 
                      ? 'bg-purple-600 border-purple-400' 
                      : 'bg-gray-800 border-gray-600 hover:border-purple-500'
                  }`}
                >
                  <div className="text-2xl">{tone.emoji}</div>
                  <div className="text-center">
                    <div className="font-bold text-white">{tone.title}</div>
                    <div className="text-sm text-gray-400 mt-1">{tone.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="text-xl font-bold text-white">Ready to Begin!</h3>
              <p className="text-gray-400">Review your information and start your healing journey</p>
            </div>
            
            {/* Summary */}
            <Card className="bg-gray-800/50 border border-gray-600">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alias:</span>
                  <span className="text-white">{formData.alias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Emotional Tone:</span>
                  <span className="text-white">
                    {emotionalTones.find(t => t.id === formData.emotionalTone)?.title}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Free Tier Benefits */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">🎁 FREE Starter Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pricingTiers.free.map((benefit, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-400 mt-4">
                  You can upgrade to Firewall or Cult Leader tiers anytime from your dashboard.
                </p>
              </CardContent>
            </Card>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptedTerms}
                onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I accept the{' '}
                <Link href="/terms" className="text-purple-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-400 hover:underline">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900/60 border-2 border-purple-500/50 backdrop-blur-sm">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-3xl font-black text-white mb-2" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              CTRL+ALT+BLOCK™
            </CardTitle>
            <p className="text-purple-400">Join the digital healing revolution</p>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-red-900/20 border-red-500/50">
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {getStepContent()}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={step === 1}
              className="border-gray-600 text-gray-400 hover:bg-gray-700"
            >
              ← Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isLoading ? 'Creating Account...' : 'Start Healing Journey 🚀'}
              </Button>
            )}
          </div>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-purple-400 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
