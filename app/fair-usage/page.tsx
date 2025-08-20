"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertCircle, CheckCircle, Users, Zap } from 'lucide-react';
import { SiteFooter } from '@/components/layout/SiteFooter';

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
    </div>
  )
}

export default function FairUsagePage() {
  return (
    <div className="brand-container">
      <FloatingParticles />
      {/* Header */}
      <header className="relative z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                <span className="hidden sm:inline">CTRL+ALT+</span>
                <span className="sm:hidden">CAB+</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 brand-glitch" data-text="BLOCK">BLOCK</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400 text-xs sm:text-sm px-2 sm:px-3">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fair Usage Policy
          </h1>
          <p className="text-xl text-gray-300">
            Creating a safe, supportive environment for everyone's healing journey.
          </p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <Users className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to Community</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    CTRL+ALT+BLOCK is designed to be a safe space for healing and growth. This Fair Usage Policy ensures that all members can participate in a respectful, supportive environment while protecting the integrity of our platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Acceptable Use Guidelines</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Encouraged Activities
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Sharing your healing journey and progress
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Offering support and encouragement to others
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Using AI therapy tools for personal growth
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Participating constructively in community discussions
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Respecting others' privacy and anonymity
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Prohibited Activities
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      Sharing personal contact information or attempting to identify other users
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      Harassment, bullying, or abusive behavior
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      Spam, promotional content, or commercial solicitation
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      Sharing explicit, violent, or triggering content without warnings
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      Attempting to bypass platform restrictions or security measures
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Limits */}
          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-yellow-400" />
                Usage Limits & Resources
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-3">Ghost Mode (Free)</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Daily rituals: Unlimited</li>
                    <li>• AI therapy sessions: 10 per month</li>
                    <li>• Wall posts: 3 per day</li>
                    <li>• Comments/reactions: Unlimited</li>
                    <li>• Progress tracking: Full access</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-pink-400 mb-3">Firewall Mode ($3.99/month)</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Daily rituals: Unlimited</li>
                    <li>• AI therapy sessions: 300 per month</li>
                    <li>• Wall posts: 10 per day</li>
                    <li>• Comments/reactions: Unlimited</li>
                    <li>• Priority support: Included</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  <strong>Note:</strong> These limits are designed to encourage meaningful engagement while preventing spam. If you have legitimate needs that exceed these limits, please contact support.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Guidelines */}
          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Content & Communication Guidelines</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Trigger Warnings</h3>
                  <p className="text-gray-300 leading-relaxed">
                    When sharing content that might be triggering (mentions of self-harm, abuse, etc.), please use trigger warnings like "TW: [topic]" at the beginning of your post.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Anonymity & Privacy</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your codename protects your identity. Never share real names, locations, social media handles, or other identifying information about yourself or others.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Constructive Communication</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Focus on sharing your own experiences rather than giving direct advice. Use "I" statements and remember that everyone's healing journey is different.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enforcement */}
          <Card className="bg-orange-900/20 border border-orange-500/30">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-8 w-8 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Policy Enforcement</h2>
                  <div className="space-y-3 text-gray-300">
                    <p>
                      <strong>First violation:</strong> Warning message and guidance on policy compliance
                    </p>
                    <p>
                      <strong>Repeated violations:</strong> Temporary account restrictions (24-48 hours)
                    </p>
                    <p>
                      <strong>Serious violations:</strong> Account suspension or permanent ban
                    </p>
                    <p>
                      <strong>Appeals process:</strong> Contact support@ctrlaltblock.com within 14 days to appeal any enforcement action
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="bg-purple-900/20 border border-purple-500/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Questions or Concerns?</h2>
              <p className="text-gray-300 mb-6">
                Our community team is here to help ensure everyone has a positive experience. If you see content that violates these guidelines or have questions about policy, please reach out.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" className="border-gray-500 text-gray-300 hover:text-white">
                    View Terms of Service
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center text-gray-400 text-sm">
            <p>Last updated: January 15, 2025</p>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
