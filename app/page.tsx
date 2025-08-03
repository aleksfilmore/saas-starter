'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Zap, Users, Star, Brain, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          message: 'Early access signup from CTRL+ALT+BLOCK homepage'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              CTRL+ALT+BLOCK
            </span>
          </h1>
          <div className="text-xl md:text-2xl font-mono text-gray-300 mb-6">
            REFORMAT PROTOCOL™
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            The Future of Heartbreak Recovery
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            A revolutionary platform combining AI-powered therapy, gamified healing rituals, 
            and anonymous community support. Transform your heartbreak into your comeback.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Brain className="h-8 w-8 text-cyan-400 mb-2" />
              <span className="text-sm text-gray-300">AI Therapy</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Zap className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-sm text-gray-300">Gamified</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Users className="h-8 w-8 text-pink-400 mb-2" />
              <span className="text-sm text-gray-300">Community</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Shield className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-sm text-gray-300">Anonymous</span>
            </div>
          </div>
        </div>

        {/* Email Signup */}
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white mb-3">
                    COMING SOON
                  </Badge>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Be the First to Know
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Join the waitlist for early access to the most advanced heartbreak recovery platform
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-cyan-400"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  You're In!
                </h3>
                <p className="text-gray-300">
                  We'll notify you as soon as CTRL+ALT+BLOCK launches. 
                  Get ready to transform your heartbreak into your comeback.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Proof Teaser */}
        <div className="text-center mt-8 max-w-lg">
          <p className="text-gray-400 text-sm mb-4">
            Built on evidence-based psychology, attachment theory, and cutting-edge AI
          </p>
          <div className="flex items-center justify-center space-x-6 text-gray-500">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              <span className="text-xs">Science-Backed</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">Privacy-First</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              <span className="text-xs">Gamified Experience</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-xs pb-6">
          © 2025 CTRL+ALT+BLOCK. All rights reserved.
        </div>
      </div>
    </div>
  );
}
