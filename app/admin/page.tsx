'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { safeClipboardCopy } from '@/lib/utils';
import { Heart, Shield, Zap, Users, Star, Brain, CheckCircle, ArrowRight, Sparkles, Target, Calendar, Copy, Timer, MessageCircle, Menu, X, HelpCircle } from 'lucide-react';

export default function AdminHomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(10274);
  const [betaCount, setBetaCount] = useState(142);
  const [referralCode, setReferralCode] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [confessionVisible, setConfessionVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Track if component is mounted to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animated confession card effect
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      setConfessionVisible(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMounted]);

  // Countdown timer effect - counting to September 5th, 2025
  useEffect(() => {
    if (!isMounted) return;
    
    const calculateTimeLeft = () => {
      const launchDate = new Date('2025-09-05T00:00:00Z').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate initial time
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [isMounted]);

  const generateReferralCode = () => {
    if (!isMounted) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(code);
    setShowReferral(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/xrblayqb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          message: 'Early access signup from CTRL+ALT+BLOCK homepage',
          referralCode: referralCode || 'direct'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        setWaitlistCount(prev => prev + 1);
        setBetaCount(prev => prev + 1);
        generateReferralCode();
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      {/* Navigation */}
      <nav className="relative z-50 w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </button>
              <Button
                onClick={() => scrollToSection('waitlist')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Join Waitlist
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-600/30">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Pricing
                </button>
                <Button
                  onClick={() => scrollToSection('waitlist')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with bg.png */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg.png)',
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-purple-900/75 to-blue-900/85" />
        
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="noise">
                <feTurbulence baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#noise)" opacity="0.1"/>
          </svg>
        </div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-20">
          {/* Main Motto */}
          <div className="text-center mb-8">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text mb-4 tracking-wide">
              UNINSTALL YOUR EX.
            </div>
          </div>
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-mono">
                 INSTALL YOUR NEW SELF.
              </span>
            </h1>
            <div className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-4 font-medium">
              Your interactive breakup recovery program
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-mono text-gray-300 mb-6">
              Revolutionary healing through the psychology of gaming — with AI therapy, daily healing rituals, and a gamified progress tracker
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            <Card className="bg-red-900/20 border border-red-500/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-red-300 mb-4">🚀 PLATFORM LAUNCHES IN</div>
                  <div className="flex justify-center space-x-4 text-white font-mono">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">{timeLeft.days}</div>
                      <div className="text-xs text-gray-400">DAYS</div>
                    </div>
                    <div className="text-3xl text-red-400">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">{timeLeft.hours}</div>
                      <div className="text-xs text-gray-400">HOURS</div>
                    </div>
                    <div className="text-3xl text-red-400">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">{timeLeft.minutes}</div>
                      <div className="text-xs text-gray-400">MIN</div>
                    </div>
                    <div className="text-3xl text-red-400">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">{timeLeft.seconds}</div>
                      <div className="text-xs text-gray-400">SEC</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-4">September 5th, 2025</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('waitlist')}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Join Waitlist - Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-300 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-900/50 backdrop-blur-sm"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-24 px-4 bg-gradient-to-br from-purple-900 via-pink-900/50 to-purple-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Join the Revolution
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Be among the first to experience the future of heartbreak recovery
          </p>

          <Card className="bg-gray-800/60 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-8">
              {!isSubmitted ? (
                <>
                  <div className="mb-6">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white mb-4">
                      BETA ACCESS
                    </Badge>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Reserve Your Spot Today
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Join {isMounted ? waitlistCount.toLocaleString() : '10,274'}+ people waiting for early access to the most advanced heartbreak recovery platform ever built.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exile_404@protonmail.com"
                      required
                      className="bg-gray-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-cyan-400 text-lg py-3"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg"
                    >
                      {isSubmitting ? 'Joining...' : 'Join Waitlist - Free'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-sm text-gray-400">
                      🔒 We store only your email. No names, no spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              ) : (
                <div className="py-8">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Welcome to the Revolution! 🎉
                  </h3>
                  <p className="text-gray-300 mb-6">
                    You're now part of an exclusive group of {isMounted ? waitlistCount.toLocaleString() : '10,274'} healers waiting for CTRL+ALT+BLOCK. 
                    We'll notify you as soon as the platform launches on September 5th.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
