'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Zap, Users, Star, Brain, CheckCircle, ArrowRight, Sparkles, Target, Calendar, Copy, Share2 } from 'lucide-react';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(10274);
  const [betaCount, setBetaCount] = useState(142);
  const [referralCode, setReferralCode] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [confessionVisible, setConfessionVisible] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-x-hidden relative">
      {/* Glitch SVG Overlay */}
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

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Rally Cry */}
          <div className="text-lg sm:text-xl md:text-2xl font-mono text-cyan-400 mb-4 tracking-wider">
            <span className="animate-pulse">TERMINATE.</span>
            <span className="animate-pulse delay-300"> FORMAT.</span>
            <span className="animate-pulse delay-600"> GLOW-UP.</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-mono glitch-text">
              CTRL+ALT+BLOCK
            </span>
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl font-mono text-gray-300 mb-4 sm:mb-6">
            REFORMAT PROTOCOL™
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-6">
          <Card className="bg-red-900/20 border border-red-500/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-red-300 mb-2">🚨 BETA DOORS OPEN IN</div>
                <div className="flex justify-center space-x-4 text-white font-mono">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400">DAYS</div>
                  </div>
                  <div className="text-2xl text-red-400">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400">HRS</div>
                  </div>
                  <div className="text-2xl text-red-400">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400">MIN</div>
                  </div>
                  <div className="text-2xl text-red-400">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400">SEC</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white leading-tight">
            The Future of Heartbreak Recovery
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            A revolutionary platform combining AI-powered therapy, gamified healing rituals, 
            and anonymous community support. Transform your heartbreak into your comeback.
          </p>

          {/* Enhanced Feature Tease Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group">
              <CardContent className="p-3 sm:p-4 text-center">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm text-white font-semibold">AI Therapy</span>
                <p className="text-xs text-cyan-200 mt-1">Smart conversations</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 group">
              <CardContent className="p-3 sm:p-4 text-center">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm text-white font-semibold">Daily Rituals</span>
                <p className="text-xs text-purple-200 mt-1">Healing habits</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 group">
              <CardContent className="p-3 sm:p-4 text-center">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm text-white font-semibold">No-Contact Tracker</span>
                <p className="text-xs text-red-200 mt-1">Digital boundaries</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 group">
              <CardContent className="p-3 sm:p-4 text-center">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm text-white font-semibold">Wall of Wounds</span>
                <p className="text-xs text-green-200 mt-1">Anonymous support</p>
              </CardContent>
            </Card>
          </div>

          {/* Beta Badge Progress */}
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-yellow-200">🏆 Exclusive Beta Access</span>
                  <span className="text-sm text-yellow-300 font-bold">{betaCount} / 500</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(betaCount / 500) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-yellow-200">
                  First 500 get exclusive avatar frame + early access
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Email Signup */}
        <Card className="w-full max-w-md mx-4 bg-gray-800/60 backdrop-blur-md border-purple-500/30">
          <CardContent className="p-4 sm:p-6">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-4 sm:mb-6">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white mb-3">
                    BETA ACCESS
                  </Badge>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    Run the 60-Second Scan → Reserve Spot
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Join the waitlist for early access to the most advanced heartbreak recovery platform
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="exile_404@protonmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-cyan-400"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist - Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    🔒 We store only your email. No names, no spam.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  You're In! 🎉
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  We'll notify you as soon as CTRL+ALT+BLOCK launches. 
                  Get ready to transform your heartbreak into your comeback.
                </p>
                
                {/* Referral Section */}
                {showReferral && (
                  <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-4 mt-4">
                    <h4 className="text-green-400 font-semibold mb-2">
                      🚀 Get Early Access + 500 Bytes
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Share your referral link for priority access
                    </p>
                    <div className="flex items-center space-x-2 mb-3">
                      <code className="flex-1 bg-gray-700/50 text-cyan-400 px-3 py-2 rounded text-sm">
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
                    <p className="text-xs text-green-300">
                      Referrals: <span className="font-bold">0</span> 🔥
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Proof Teaser */}
        <div className="text-center mt-6 sm:mt-8 max-w-lg px-4">
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Built on evidence-based psychology, attachment theory, and cutting-edge AI
          </p>
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-gray-500 flex-wrap">
            <div className="flex items-center mb-2 sm:mb-0">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs">Science-Backed</span>
            </div>
            <div className="flex items-center mb-2 sm:mb-0">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs">Privacy-First</span>
            </div>
            <div className="flex items-center mb-2 sm:mb-0">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs">Gamified Experience</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 text-gray-500 text-xs pb-6 px-4">
          © 2025 CTRL+ALT+BLOCK. All rights reserved.
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {!isSubmitted && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-sm border-t border-purple-500/30 z-50 md:hidden">
          <Button
            onClick={() => {
              const emailInput = document.querySelector('input[type="email"]');
              if (emailInput && 'focus' in emailInput) {
                (emailInput as HTMLInputElement).focus();
              }
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
          >
            Join Waitlist - Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* SEO Meta Tags */}
      <head>
        <title>CTRL+ALT+BLOCK – Gamified Break-Up Recovery</title>
        <meta name="description" content="Revolutionary heartbreak recovery platform combining AI therapy, gamified healing rituals, and anonymous community support." />
        <meta property="og:title" content="CTRL+ALT+BLOCK – Gamified Break-Up Recovery" />
        <meta property="og:description" content="Transform your heartbreak into your comeback with AI-powered therapy and gamified healing." />
        <meta property="og:image" content="/og-confession-card.jpg" />
        <meta property="og:url" content="https://ctrlaltblock.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CTRL+ALT+BLOCK – Gamified Break-Up Recovery" />
        <meta name="twitter:description" content="Revolutionary heartbreak recovery platform with AI therapy and community support." />
        <meta name="twitter:image" content="/og-confession-card.jpg" />
      </head>

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
