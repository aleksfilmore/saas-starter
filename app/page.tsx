'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Zap, Users, Star, Brain, CheckCircle, ArrowRight, Sparkles, Target, Calendar, Copy, Share2, Timer, MessageCircle, Mic, Crown, Bot, ChevronDown, Menu, X, Check, Plus, HelpCircle } from 'lucide-react';

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
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Animated confession card effect
  useEffect(() => {
    const interval = setInterval(() => {
      setConfessionVisible(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer effect - counting to September 5th, 2025
  useEffect(() => {
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
  }, []);

  const generateReferralCode = () => {
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

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  // Sample Wall of Wounds data
  const wallPosts = [
    {
      id: 1,
      category: "system_error",
      title: "Failed to Connect",
      content: "Day 23: I keep checking if they've watched my stories. The no-contact tracker is my only lifeline right now.",
      reactions: 127,
      timeAgo: "2h"
    },
    {
      id: 2,
      category: "memory_leak",
      title: "Data Corruption",
      content: "3 weeks clean. Started journaling again. The AI therapy actually helps when I can't sleep at 3am thinking about them.",
      reactions: 89,
      timeAgo: "5h"
    },
    {
      id: 3,
      category: "buffer_overflow",
      title: "Emotional Overflow",
      content: "Saw them at the coffee shop. Heart rate spiked to 140bpm. Used the breathing ritual from the app. Actually worked.",
      reactions: 203,
      timeAgo: "1d"
    },
    {
      id: 4,
      category: "access_denied",
      title: "Permission Error",
      content: "Blocked them everywhere. Changed my whole routine. The gamification makes it feel like I'm winning something back.",
      reactions: 156,
      timeAgo: "2d"
    }
  ];

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
      description: "Chat with the AI goblin, dump secrets on the Wall, collect Byte loot. Streaks trigger bigger rituals.",
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

  const faqData = [
    {
      id: "what-is",
      question: "What exactly is CTRL+ALT+BLOCK?",
      answer: "A revolutionary platform that gamifies heartbreak recovery using AI-powered therapy, daily healing rituals, and anonymous community support. Think of it as a combination of therapy, gaming, and social support designed specifically for attachment healing."
    },
    {
      id: "how-anonymous",
      question: "How anonymous is it really?",
      answer: "Completely anonymous. We use archetypes instead of real names, encrypt all data, and never store personally identifiable information. You can share your deepest healing journey without any privacy concerns."
    },
    {
      id: "pricing",
      question: "How much does it cost?",
      answer: "We offer a free tier with basic features, Pro at $19/month with unlimited AI therapy, and Elite at $49/month with 1-on-1 coaching. All plans include anonymous community access and core healing tools."
    },
    {
      id: "ai-safe",
      question: "Is AI therapy actually safe and effective?",
      answer: "Our AI is trained specifically for attachment healing and heartbreak recovery, based on evidence-based psychology. While not a replacement for licensed therapy, it provides 24/7 support and has crisis detection built-in."
    },
    {
      id: "launch-date",
      question: "When does the platform officially launch?",
      answer: "September 5th, 2025! We're currently in beta with limited access. Join the waitlist to get early access and exclusive benefits."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-x-hidden relative">
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

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-20">
        {/* Floating Confession Card */}
        <div className="absolute top-20 right-10 max-w-xs opacity-80 z-20 hidden lg:block">
          <Card className={`bg-gray-800/40 border border-purple-500/30 backdrop-blur-sm transition-all duration-1000 ${confessionVisible ? 'opacity-100' : 'opacity-30'}`}>
            <CardContent className="p-4">
              <div className={`text-sm text-gray-300 transition-all duration-500 ${confessionVisible ? 'blur-none' : 'blur-sm'}`}>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs text-green-400">exile_ghost</span>
                </div>
                {confessionVisible ? (
                  <p>"Day 12: The no-contact tracker actually works. Haven't checked their socials once today. Level up feels real 🔥"</p>
                ) : (
                  <p className="text-gray-500">████████████████████████████████████████</p>
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
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
            INSTALL YOUR NEW SELF.
          </div>
        </div>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-mono glitch-text">
              CTRL+ALT+BLOCK
            </span>
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl font-mono text-gray-300 mb-6">
            REFORMAT PROTOCOL™
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
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group">
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 text-cyan-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-sm text-white font-semibold block">AI Therapy</span>
                <p className="text-xs text-cyan-200 mt-1">24/7 Smart Support</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 group">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-purple-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-sm text-white font-semibold block">Daily Rituals</span>
                <p className="text-xs text-purple-200 mt-1">Healing Habits</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 group">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-red-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-sm text-white font-semibold block">No-Contact</span>
                <p className="text-xs text-red-200 mt-1">Digital Boundaries</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 group">
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-green-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-sm text-white font-semibold block">Wall of Wounds</span>
                <p className="text-xs text-green-200 mt-1">Anonymous Support</p>
              </CardContent>
            </Card>
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
                  First 500 get exclusive avatar frame + lifetime discount
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('waitlist')}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg"
            >
              Join Waitlist - Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => window.location.href = '/scan'}
              size="lg"
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 px-8 py-4 text-lg"
            >
              🧪 Try Beta Scan
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-900/50">
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
              <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group">
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
                      <h3 className="text-2xl font-bold text-white mb-4">
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
                  description: "Smart algorithms adapt to your healing style"
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "Gamified",
                  description: "XP, levels, and achievements make progress fun"
                },
                {
                  icon: <MessageCircle className="h-8 w-8" />,
                  title: "Anonymous",
                  description: "Share and heal without compromising privacy"
                },
                {
                  icon: <Star className="h-8 w-8" />,
                  title: "Evidence-Based",
                  description: "Backed by attachment theory and psychology"
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
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wall of Wounds Section */}
      <section className="py-24 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              ✨ Wall of Wounds™
            </h2>
            <p className="text-xl text-red-400 mb-4">
              Anonymous healing confessions from our community
            </p>
            <p className="text-gray-300">
              Real stories from real people. Share your journey, find your tribe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {wallPosts.map((post) => (
              <Card key={post.id} className="bg-gray-800/80 border border-red-500/30 hover:border-red-400/60 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 font-mono text-xs">
                      {post.title}
                    </Badge>
                    <span className="text-sm text-gray-400">{post.timeAgo}</span>
                  </div>
                  <p className="text-white text-lg leading-relaxed mb-4">"{post.content}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-gray-400">{post.reactions} reactions</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs text-gray-500">🔄 Same Loop</span>
                      <span className="text-xs text-gray-500">✨ Cleansed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => scrollToSection('waitlist')}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3"
            >
              Join the Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Choose Your Healing Protocol
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start your recovery journey with our research-backed attachment therapy platform. 
              All plans include anonymous support and personalized healing paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free Plan */}
            <Card className="bg-gray-800/50 border border-gray-600/50 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Free Protocol</CardTitle>
                <div className="text-4xl font-black text-white mb-2">$0</div>
                <p className="text-gray-400">Perfect to start your journey</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic daily rituals
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    No-contact tracker
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Anonymous community
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic progress tracking
                  </li>
                </ul>
                <Button 
                  onClick={() => scrollToSection('waitlist')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 backdrop-blur-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  MOST POPULAR
                </div>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-bold text-white">Pro Protocol</CardTitle>
                <div className="text-4xl font-black text-white mb-2">$19</div>
                <p className="text-gray-400">Per month • Advanced healing tools</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Free
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    AI therapy sessions (unlimited)
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Personalized ritual plans
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
                <Button 
                  onClick={() => scrollToSection('waitlist')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Elite Plan */}
            <Card className="bg-gray-800/50 border border-gray-600/50 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  Elite Protocol
                  <Shield className="h-6 w-6 text-yellow-400 ml-2" />
                </CardTitle>
                <div className="text-4xl font-black text-white mb-2">$49</div>
                <p className="text-gray-400">Per month • Maximum support</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    1-on-1 coaching sessions
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Custom healing protocols
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Crisis intervention access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Direct therapist chat
                  </li>
                </ul>
                <Button 
                  onClick={() => scrollToSection('waitlist')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  Start Elite Trial
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Core Features */}
          <div className="mt-24 text-center">
            <h3 className="text-3xl font-bold text-white mb-8">
              All Plans Include Core Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">100% Anonymous</h4>
                <p className="text-gray-400">No real names, complete privacy protection</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Science-Backed</h4>
                <p className="text-gray-400">Research-based attachment therapy methods</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">24/7 Support</h4>
                <p className="text-gray-400">Always-available community and resources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about CTRL+ALT+BLOCK
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq) => (
              <Card key={faq.id} className="bg-gray-800/60 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-purple-400 transition-transform ${
                        openFAQ === faq.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <Button
              onClick={() => scrollToSection('waitlist')}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-24 px-4 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
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
                      Join {waitlistCount.toLocaleString()}+ people waiting for early access to the most advanced heartbreak recovery platform ever built.
                    </p>
                    <div className="mb-6">
                      <Button
                        onClick={() => window.location.href = '/scan'}
                        variant="outline"
                        className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 mb-4"
                      >
                        🧪 Try Beta Scan Now
                      </Button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="exile_404@protonmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-cyan-400 text-lg py-3"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                          Joining the Revolution...
                        </>
                      ) : (
                        <>
                          Join Waitlist - Free
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
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
                    You're now part of an exclusive group of {waitlistCount.toLocaleString()} healers waiting for CTRL+ALT+BLOCK. 
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
                          onClick={() => navigator.clipboard.writeText(`https://ctrlaltblock.com/r/${referralCode}`)}
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

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 border-t border-gray-700/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-extrabold tracking-tight text-white mb-4">
            <span>CTRL</span>
            <span className="text-gray-400">+</span>
            <span>ALT</span>
            <span className="text-gray-400">+</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
          </div>
          <p className="text-gray-400 mb-6">
            "UNINSTALL YOUR EX. INSTALL YOUR NEW SELF."
          </p>
          <div className="flex items-center justify-center space-x-6 text-gray-500 flex-wrap text-sm">
            <span>© 2025 CTRL+ALT+BLOCK</span>
            <span>•</span>
            <span>Privacy-First</span>
            <span>•</span>
            <span>Science-Backed</span>
            <span>•</span>
            <span>Anonymous</span>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        .glitch-text {
          position: relative;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: 'CTRL+ALT+BLOCK';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .glitch-text::before {
          animation: glitch-1 0.5s infinite;
          color: #ff00ff;
          z-index: -1;
        }
        
        .glitch-text::after {
          animation: glitch-2 0.5s infinite;
          color: #00ffff;
          z-index: -2;
        }
        
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-2px, 2px); }
          80% { transform: translate(-2px, -2px); }
        }
      `}</style>
    </div>
  );
}
