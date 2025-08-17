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

export default function ComingSoonPage() {
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

  const steps = [
    {
      number: "1️⃣",
      title: "Run the 2-Minute System Scan",
      description: "Attachment quiz in disguise. No real names. Just archetypes.",
      icon: <Target className="h-10 w-10" />,
      gradient: "from-blue-500 to-purple-500"
    },
    {
      number: "2️⃣",
      title: "Receive Daily Ritual Protocols",
      description: "3–5 micro-quests dropped at optimal times. Multimedia, XP, and mood slider feedback.",
      icon: <Timer className="h-10 w-10" />,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      number: "3️⃣",
      title: "Level Up via AI & Community",
      description: "Chat with the AI goblin for guidance, share anonymous confessions on the Wall of Wounds, react with ❤️🔥😭 to others' posts, and collect Bytes (our in-app currency). Streaks trigger bigger healing rituals.",
      icon: <Users className="h-10 w-10" />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      number: "4️⃣",
      title: "Break Free & Glow-Up",
      description: "30-Day Reformat or 90-Day Deep Reset. Exit with receipts, badges, and a timeline your ex wishes they kept.",
      icon: <Star className="h-10 w-10" />,
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

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
          
          {/* Floating hearts that break and reassemble */}
          <div className="absolute top-1/3 left-1/4 opacity-30">
            <div className="text-6xl animate-pulse text-red-400/20">💔</div>
          </div>
          <div className="absolute top-1/2 right-1/3 opacity-40">
            <div className="text-4xl animate-bounce text-purple-400/30">✨</div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-20">
            <div className="text-5xl animate-pulse text-cyan-400/25">💙</div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-20">
          {/* Floating Confession Card */}
          <div className="absolute top-20 right-10 max-w-xs opacity-80 z-20 hidden lg:block animate-float">
            <Card className={`bg-gray-800/60 border border-purple-500/40 backdrop-blur-md transition-all duration-1000 hover:border-purple-400 hover:bg-gray-800/80 ${confessionVisible ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}`}>
              <CardContent className="p-4">
                <div className={`text-sm text-gray-300 transition-all duration-500 ${confessionVisible ? 'blur-none' : 'blur-sm'}`}>
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs text-green-400 font-mono">exile_ghost</span>
                  </div>
                  {confessionVisible ? (
                    <p className="leading-relaxed">"Day 12: The no-contact tracker actually works. Haven't checked their socials once today. Level up feels real 🔥"</p>
                  ) : (
                    <p className="text-gray-500 font-mono">████████████████████████████████████████</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

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

          {/* Main Content */}
          <div className="max-w-4xl text-center mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
              The World's First Gamified Heartbreak Recovery Platform
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Revolutionary platform combining AI-powered therapy, gamified healing rituals, 
              and anonymous community support. Transform your heartbreak into your comeback with 
              science-backed attachment theory and cutting-edge technology.
            </p>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link href="/features#ai-therapy">
                <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Brain className="h-8 w-8 text-cyan-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-white font-semibold block">AI Therapy</span>
                    <p className="text-xs text-cyan-200 mt-1">Chat 24/7 with your digital recovery coach</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/features#daily-rituals">
                <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-purple-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-white font-semibold block">Daily Rituals</span>
                    <p className="text-xs text-purple-200 mt-1">Science-backed micro-activities for healing</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/features#no-contact">
                <Card className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-red-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-white font-semibold block">No-Contact</span>
                    <p className="text-xs text-red-200 mt-1">Track streaks and build healthy boundaries</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/features#wall-of-wounds">
                <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-green-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-white font-semibold block">Wall of Wounds</span>
                    <p className="text-xs text-green-200 mt-1">Anonymous support community space</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Beta Progress */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-yellow-200 font-semibold">🏆 Exclusive Beta Access</span>
                    <span className="text-yellow-300 font-bold">{betaCount} / 500</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(betaCount / 500) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-yellow-200">
                    First 500 users get an exclusive avatar frame + lifetime discount
                  </p>
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
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/quiz';
                  }
                }}
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-300 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gray-900/50 backdrop-blur-sm"
              >
                🧪 Try Beta Scan Now
              </Button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center max-w-lg px-4">
            <p className="text-gray-400 text-sm mb-4">
              Built on evidence-based psychology, attachment theory, and cutting-edge AI
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-500 flex-wrap">
              <div className="flex items-center mb-2 sm:mb-0">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-xs">Science-Backed</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-0">
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-xs">Privacy-First</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-0">
                <Sparkles className="h-4 w-4 mr-1" />
                <span className="text-xs">Gamified Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Your Healing Journey in 
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Four Glitchy Steps
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From heartbreak to breakthrough—here's how we guide you through the transformation process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer"
                onClick={() => {
                  // Show tooltip or modal with detailed explanation
                  alert(`Step ${step.number}: ${step.title}\n\n${step.description}\n\nClick to learn more about this step in our How It Works guide.`);
                }}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="text-6xl font-black text-purple-400 mb-4 flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${step.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technology Features */}
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-8">
              The Technology Behind the Magic
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Brain className="h-8 w-8" />,
                  title: "AI-Powered",
                  description: "Smart algorithms that learn your healing patterns and adapt therapeutic responses to your specific attachment style and progress."
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "Gamified",
                  description: "XP systems, achievement badges, and Byte currency transform healing milestones into engaging progress markers."
                },
                {
                  icon: <MessageCircle className="h-8 w-8" />,
                  title: "Anonymous",
                  description: "Share your deepest struggles and victories without revealing identity, creating safe spaces for vulnerable healing."
                },
                {
                  icon: <Star className="h-8 w-8" />,
                  title: "Evidence-Based",
                  description: "Every feature is grounded in attachment theory research and cognitive-behavioral therapy best practices."
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



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
                    <div className="mb-6">
                      <Button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.location.href = '/quiz';
                          }
                        }}
                        variant="outline"
                        className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 mb-4"
                      >
                        🧪 Try Beta Scan Now
                      </Button>
                    </div>
                  </div>

                  <form action="https://formspree.io/f/xrblayqb" method="POST" className="space-y-4">
                    <Input
                      type="email" name="email" placeholder="exile_404@protonmail.com"
                      required
                      className="bg-gray-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-cyan-400 text-lg py-3"
                    />
                    <Button
                      type="submit"
                      >Join Waitlist - Free <ArrowRight className="ml-2 h-5 w-5" />
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
                  
                  {/* Referral Section */}
                  {showReferral && (
                    <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-6 mt-6">
                      <h4 className="text-green-400 font-semibold mb-3 text-lg">
                        🚀 Get Early Access + 500 Bytes
                      </h4>
                      <p className="text-gray-300 mb-4">
                        Share your referral link for priority access and exclusive rewards
                      </p>
                      <div className="flex items-center space-x-3 mb-4">
                        <code className="flex-1 bg-gray-700/50 text-cyan-400 px-4 py-3 rounded text-sm">
                          ctrlaltblock.com/r/{referralCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-400 hover:bg-green-500/20"
                          onClick={() => safeClipboardCopy(`https://ctrlaltblock.com/r/${referralCode}`, `Please copy this referral link: https://ctrlaltblock.com/r/${referralCode}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-green-300">
                        Referrals: <span className="font-bold">0</span> 🔥 | Each referral moves you up the queue
                      </p>
                    </div>
                  )}
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
