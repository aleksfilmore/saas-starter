"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle, Heart, Target, Mail, Lock, ArrowRight, UserCircle, Dice6, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface QuizResult {
  attachmentStyle: string;
  traits: string[];
  healingPath: string[];
  completedAt: string;
}

const styleEmojis = {
  anxious: "💥",
  avoidant: "🛡️", 
  secure: "🔒",
  disorganized: "👻"
};

const styleNames = {
  anxious: "Data Flooder",
  avoidant: "Firewall Builder", 
  secure: "Secure Node",
  disorganized: "Ghost in the Shell"
};

const styleColors = {
  anxious: "from-cyan-400 to-blue-500",
  avoidant: "from-red-400 to-pink-500",
  secure: "from-green-400 to-emerald-500", 
  disorganized: "from-purple-400 to-indigo-500"
};

// Username generation data
const adjectives = [
  'anonymous', 'brave', 'calm', 'digital', 'evolved', 'free', 'guarded', 'hidden',
  'improved', 'just', 'kind', 'liberated', 'motivated', 'new', 'optimized', 'protected',
  'quiet', 'renewed', 'strong', 'transformed', 'upgraded', 'valued', 'wise', 'zen',
  'bright', 'clever', 'gentle', 'noble', 'pure', 'swift', 'fierce', 'bold',
  'serene', 'vibrant', 'peaceful', 'radiant', 'mindful', 'steady', 'clear', 'whole',
  'cosmic', 'lunar', 'solar', 'mystic', 'wild', 'epic', 'sage', 'royal',
  'ancient', 'modern', 'future', 'quantum', 'neural', 'cyber', 'neon', 'crystal',
  'steel', 'golden', 'silver', 'diamond', 'emerald', 'ruby', 'sapphire', 'jade',
  'electric', 'magnetic', 'atomic', 'stellar', 'galactic', 'infinite', 'eternal', 'prime',
  'shadow', 'crimson', 'azure', 'violet', 'amber', 'ivory', 'obsidian', 'platinum',
  'titanium', 'carbon', 'phoenix', 'storm', 'frost', 'flame', 'wind', 'earth',
  'water', 'fire', 'void', 'light', 'dark', 'gray', 'silent', 'swift',
  'rapid', 'fluid', 'solid', 'vapor', 'plasma', 'energy', 'matrix', 'vector',
  'binary', 'hex', 'alpha', 'beta', 'gamma', 'delta', 'omega', 'sigma'
];

const nouns = [
  'seeker', 'warrior', 'guardian', 'builder', 'healer', 'survivor', 'dreamer', 'fighter',
  'creator', 'explorer', 'phoenix', 'wanderer', 'architect', 'sage', 'champion', 'voyager',
  'pioneer', 'mystic', 'rebel', 'knight', 'scholar', 'artist', 'runner', 'climber',
  'soul', 'heart', 'mind', 'spirit', 'river', 'mountain', 'star', 'ocean',
  'forest', 'dawn', 'moon', 'sun', 'breeze', 'flame', 'spark', 'path',
  'journey', 'light', 'hope', 'dream', 'vision', 'voice', 'strength', 'dancer',
  'coder', 'hacker', 'ninja', 'wizard', 'mage', 'sorcerer', 'witch', 'shaman',
  'monk', 'priest', 'paladin', 'rogue', 'ranger', 'archer', 'hunter', 'tracker',
  'scout', 'pilot', 'captain', 'admiral', 'general', 'marshal', 'commander', 'leader',
  'chief', 'master', 'guru', 'sensei', 'teacher', 'student', 'learner', 'pupil',
  'ghost', 'phantom', 'specter', 'wraith', 'demon', 'angel', 'deity', 'god',
  'titan', 'giant', 'dwarf', 'elf', 'fairy', 'sprite', 'pixie', 'dragon',
  'tiger', 'lion', 'wolf', 'bear', 'eagle', 'hawk', 'raven', 'dove',
  'snake', 'spider', 'scorpion', 'shark', 'whale', 'dolphin', 'fox', 'rabbit',
  'cipher', 'code', 'algorithm', 'program', 'script', 'function', 'method', 'class',
  'object', 'array', 'string', 'boolean', 'integer', 'float', 'double', 'byte'
];

const numbers = [
  '01', '02', '03', '07', '11', '13', '17', '19', '21', '23', '29', '31', '37', '41', '43', '47',
  '53', '59', '61', '67', '71', '73', '79', '83', '89', '97', '42', '99', '88', '77', '66', '55',
  '44', '33', '22', '00', '10', '20', '30', '40', '50', '60', '70', '80', '90', '12', '34', '56',
  '78', '91', '92', '93', '94', '95', '96', '97', '98', '87', '76', '65', '54', '43', '32', '21'
];

export default function SignUpFromQuizPage() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    termsAccepted: false
  });
  
  const router = useRouter();

  // Generate username function
  const generateUsername = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    
    const newUsername = `${adjective}_${noun}_${number}`;
    handleInputChange('username', newUsername);
  };

  // Check username availability
  const checkUsernameAvailability = async (usernameToCheck: string): Promise<boolean> => {
    try {
      console.log(`Checking availability for: "${usernameToCheck}"`);
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameToCheck }),
      });
      
      console.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return false;
      }
      
      const data = await response.json();
      console.log(`API response data:`, data);
      return data.available === true;
    } catch (error) {
      console.error('Username check failed:', error);
      return false;
    }
  };

  // Generate unique username with availability check
  const generateUniqueUsername = async () => {
    setIsLoading(true);
    let attempts = 0;
    let newUsername = '';
    let isAvailable = false;

    console.log('Starting unique username generation...');

    // Try up to 20 times to generate a unique username
    while (!isAvailable && attempts < 20) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      
      let number;
      if (attempts < 5) {
        // First 5 attempts: use predefined numbers
        number = numbers[Math.floor(Math.random() * numbers.length)];
      } else if (attempts < 10) {
        // Next 5 attempts: random 2-digit numbers
        number = String(Math.floor(Math.random() * 90) + 10);
      } else if (attempts < 15) {
        // Next 5 attempts: random 3-digit numbers
        number = String(Math.floor(Math.random() * 900) + 100);
      } else {
        // Last 5 attempts: timestamp-based for uniqueness
        number = Date.now().toString().slice(-4);
      }
      
      newUsername = `${adjective}_${noun}_${number}`;
      console.log(`Attempt ${attempts + 1}: Trying "${newUsername}"`);
      
      try {
        isAvailable = await checkUsernameAvailability(newUsername);
        console.log(`Username "${newUsername}" available: ${isAvailable}`);
      } catch (error) {
        console.error(`Error checking username "${newUsername}":`, error);
        
        // If API completely fails after 3 attempts, just assume it's available
        if (attempts >= 3) {
          console.log('API failing repeatedly, assuming username is available');
          isAvailable = true;
        } else {
          isAvailable = false;
        }
      }
      
      attempts++;
    }

    if (isAvailable) {
      console.log(`Success! Generated username: "${newUsername}"`);
      handleInputChange('username', newUsername);
      setError('');
    } else {
      console.error(`Failed to generate username after ${attempts} attempts`);
      setError('Having trouble generating a unique username. Please try again.');
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    const stored = localStorage.getItem('quizResult');
    if (stored) {
      setQuizResult(JSON.parse(stored));
      // Generate initial username when component loads
      generateUsername();
    } else {
      // Redirect to quiz if no results found
      router.push('/quiz');
    }
  }, [router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.email) {
        setError('Please enter your email');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.password) {
        setError('Please create a password');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.username) {
        setError('Please generate a username');
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
    setError('');
  };

  const handleSignUp = async () => {
    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (!formData.username) {
      setError('Please generate a username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check username availability one more time
      const isAvailable = await checkUsernameAvailability(formData.username);
      
      if (!isAvailable) {
        setError('This username is no longer available. Please generate a new one.');
        setIsLoading(false);
        return;
      }

      const signupData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        quizResult,
        source: 'quiz-conversion'
      };

      const response = await fetch('/api/signup-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('onboardingCompleted', 'true');
        localStorage.setItem('attachmentStyle', quizResult?.attachmentStyle || '');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your results...</p>
        </div>
      </div>
    );
  }

  const styleColor = styleColors[quizResult.attachmentStyle as keyof typeof styleColors] || "from-purple-500 to-pink-500";
  const styleEmoji = styleEmojis[quizResult.attachmentStyle as keyof typeof styleEmojis] || "🔒";
  const styleName = styleNames[quizResult.attachmentStyle as keyof typeof styleNames] || "Secure Node";

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
              <span className="text-xs sm:text-sm text-gray-400">Step {currentStep} of 4</span>
              <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm">
                <span className="hidden sm:inline">Already have an account?</span>
                <span className="sm:hidden">Sign In</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-2xl">
          
          {/* Quiz Results Summary */}
          <Card className={`bg-gradient-to-r ${styleColor} p-1 mb-8`}>
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-center">
                <div className="text-4xl mb-2">{styleEmoji}</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Archetype: {styleName}
                </h2>
                <p className="text-gray-300">
                  Ready to unlock your personalized healing journey?
                </p>
              </div>
            </div>
          </Card>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Create Your Healing Account
            </h1>
            <p className="text-xl text-gray-300">
              Get instant access to your personalized recovery plan
            </p>
          </div>

          <Card className="bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl">
            <CardContent className="p-8">

              {/* Step 1: Email */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Mail className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">What's your email?</h3>
                    <p className="text-gray-400">We'll use this to save your progress and send you healing updates</p>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-300 text-lg font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@domain.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2 text-lg p-4"
                      disabled={isLoading}
                      required
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      🔒 We'll never spam you or sell your info. Used only for account recovery and healing updates.
                    </p>
                  </div>

                  {error && (
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 text-lg border-0"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Lock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">Secure your account</h3>
                    <p className="text-gray-400">Choose a strong password to protect your healing journey</p>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-300 text-lg font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2 text-lg p-4 pr-12"
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="text-sm text-gray-400 mt-2 space-y-1">
                      <p className="font-medium">Password requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li className={formData.password.length >= 6 ? "text-green-400" : "text-gray-400"}>
                          At least 6 characters
                        </li>
                        <li className={/[A-Za-z]/.test(formData.password) && /[0-9]/.test(formData.password) ? "text-green-400" : "text-gray-400"}>
                          Contains letters and numbers
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300 text-lg font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2 text-lg p-4 pr-12"
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {error && (
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Username Generation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <UserCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">Choose Your Anonymous Alias</h3>
                    <p className="text-gray-400">Your identity in the healing community - no real names needed</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg p-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-mono text-white font-bold tracking-wider mb-2">
                        {formData.username || 'generating...'}
                      </div>
                      <p className="text-gray-400 text-sm">
                        This will be your identity in the community
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={generateUniqueUsername}
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
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                      Privacy-First Platform
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Your alias protects your privacy while connecting you with others on similar healing journeys. Every alias is unique and truly yours.
                    </p>
                  </div>

                  {error && (
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={isLoading || !formData.username}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Final Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <CheckCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">Ready to begin your journey?</h3>
                    <p className="text-gray-400">Your personalized healing plan is waiting for you</p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Privacy-First Platform</h4>
                    <p className="text-gray-300 text-sm">
                      We maintain your anonymity throughout your healing journey. No personal names or identifying information required.
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-gray-400 text-sm">
                      I agree to the{' '}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {error && (
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => setCurrentStep(3)}
                      variant="outline"
                      className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSignUp}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 text-lg border-0"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          CREATE ACCOUNT
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Personalized based on your {styleName} archetype</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">AI therapy tuned to your patterns</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <CheckCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Join 50,000+ people healing</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
