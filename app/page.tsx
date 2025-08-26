'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Calendar, Gamepad2, ArrowRight } from 'lucide-react';
import Head from 'next/head';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Countdown timer effect - counting to September 15th, 2025
  useEffect(() => {
    if (!isMounted) return;
    
    const calculateTimeLeft = () => {
  const launchDate = new Date('2025-09-15T00:00:00Z').getTime();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Track email signup attempt
    trackEvent('email_signup_attempt', 'conversion', 'homepage_signup');
    
    try {
      const response = await fetch('https://formspree.io/f/xrblayqb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          message: 'Early access signup from CTRL+ALT+BLOCK homepage',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        
        // Track successful email signup
        trackEvent('email_signup_success', 'conversion', 'homepage_signup');
      } else {
        // Track failed signup
        trackEvent('email_signup_failed', 'conversion', 'homepage_signup');
      }
    } catch (error) {
      console.error('Submission error:', error);
      // Track error
      trackEvent('email_signup_error', 'conversion', 'homepage_signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CTRL+ALT+BLOCK",
              "alternateName": "CTRL+ALT+BLOCK™",
              "description": "Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy to help you break toxic relationship patterns and build unshakeable self-worth.",
              "url": "https://ctrlaltblock.com",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web, iOS, Android",
              "offers": {
                "@type": "Offer",
                "category": "Mental Health & Wellness"
              },
              "creator": {
                "@type": "Organization",
                "name": "CTRL+ALT+BLOCK Team"
              },
              "keywords": "toxic relationships, no contact, self worth, healing, neuroscience, AI therapy, breakup recovery, emotional healing, relationship trauma, self improvement",
              "audience": {
                "@type": "Audience",
                "audienceType": "People recovering from toxic relationships"
              },
              "featureList": [
                "AI-powered healing archetype assessment",
                "Personalized daily healing rituals", 
                "No-contact streak tracking",
                "Anonymous community support",
                "Gamified progress tracking",
                "24/7 AI therapy chat"
              ]
            })
          }}
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="relative z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-center">
            <div className="text-sm xs:text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight whitespace-nowrap">
              <span>CTRL+ALT+</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">BLOCK</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Stop Obsessing
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Start Healing
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Reformat heartbreak with AI + psychology: scan your attachment style, lock your no-contact streak, 
            run personalized rituals and journal prompts, and vent—anonymously—on the Wall of Wounds. 
            Stop texting your ex; start stacking wins.
          </p>

          {/* Large Countdown Timer */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-4">
                🚀 PLATFORM LAUNCHES IN
              </h2>
            </div>
            <Card className="bg-gray-800/60 border border-purple-500/50 backdrop-blur-sm max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex justify-center space-x-8 text-white font-mono">
                  <div className="text-center">
                    <div className="text-5xl md:text-7xl font-bold text-purple-400 mb-2">{timeLeft.days}</div>
                    <div className="text-sm md:text-base text-gray-400">DAYS</div>
                  </div>
                  <div className="text-5xl md:text-7xl text-purple-400 self-start">:</div>
                  <div className="text-center">
                    <div className="text-5xl md:text-7xl font-bold text-purple-400 mb-2">{timeLeft.hours}</div>
                    <div className="text-sm md:text-base text-gray-400">HOURS</div>
                  </div>
                  <div className="text-5xl md:text-7xl text-purple-400 self-start">:</div>
                  <div className="text-center">
                    <div className="text-5xl md:text-7xl font-bold text-purple-400 mb-2">{timeLeft.minutes}</div>
                    <div className="text-sm md:text-base text-gray-400">MIN</div>
                  </div>
                  <div className="text-5xl md:text-7xl text-purple-400 self-start">:</div>
                  <div className="text-center">
                    <div className="text-5xl md:text-7xl font-bold text-purple-400 mb-2">{timeLeft.seconds}</div>
                    <div className="text-sm md:text-base text-gray-400">SEC</div>
                  </div>
                </div>
                <div className="text-lg text-gray-400 mt-6">September 15th, 2025</div>
              </CardContent>
            </Card>
          </div>

          {/* Email Signup */}
          <div className="max-w-md mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="exile_404@protonmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 text-lg py-3"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Notified'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-green-400 mb-4">✅ You're In!</div>
                <p className="text-gray-300">
                  We'll notify you as soon as CTRL+ALT+BLOCK launches on September 15th.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              How <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">It Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your journey from heartbreak to healing, gamified and guided by AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-6 rounded-xl mb-6 w-fit mx-auto">
                  <Target className="h-12 w-12 text-white" />
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit mx-auto">
                  Step 1
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Healing Archetype Scan</h3>
                <p className="text-gray-300 leading-relaxed">
                  Take our AI-powered quiz to discover your unique healing archetype and get personalized recommendations for your recovery journey.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl mb-6 w-fit mx-auto">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit mx-auto">
                  Step 2
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Daily Healing Rituals</h3>
                <p className="text-gray-300 leading-relaxed">
                  Complete personalized micro-activities designed to rebuild your confidence, establish boundaries, and strengthen emotional resilience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-green-500 to-blue-500 p-6 rounded-xl mb-6 w-fit mx-auto">
                  <Gamepad2 className="h-12 w-12 text-white" />
                </div>
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit mx-auto">
                  Step 3
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Glow Up & Unlock</h3>
                <p className="text-gray-300 leading-relaxed">
                  Track your progress, earn badges, maintain no-contact streaks, and connect with a supportive anonymous community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-sm text-gray-400 space-y-2">
            <div>
              © 2025 CTRL+ALT+BLOCK • Privacy-First • Science-Backed • Anonymous
            </div>
            <div className="text-purple-300">
              Made with healing energy
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
