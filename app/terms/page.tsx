"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Scale, AlertTriangle, Users, CreditCard, Shield, 
  FileText, ArrowRight, Sparkles, ExternalLink,
  CheckCircle, XCircle
} from 'lucide-react';
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

export default function TermsPage() {
  const keyPoints = [
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Not a Medical Service",
      description: "Content = educational + entertainment. We're not licensed therapists.",
      color: "text-red-400"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Age 16+",
      description: "Under 18 needs guardian consent (EU rules apply).",
      color: "text-blue-400"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "User Content",
      description: "You own your text; we can display it anonymously in-app.",
      color: "text-green-400"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Byte Currency",
      description: "Has no real-world value; non-transferable virtual currency.",
      color: "text-purple-400"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Community Rules",
      description: "No hate speech, doxxing, or illegal content. Violations = ban + data purge.",
      color: "text-orange-400"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Billing",
      description: "Subscriptions renew automatically; cancel anytime to avoid next cycle.",
      color: "text-cyan-400"
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Liability",
      description: "Platform is \"as-is\"; max liability limited to amount paid in last 12 months.",
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="brand-container">
      <FloatingParticles />
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  Back to Home
                </Button>
              </Link>
              <Link href="/quiz">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Start Healing
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Scale className="h-16 w-16" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          The essential rules for using CTRL+ALT+BLOCK. Clear, honest, and human-readable.
        </p>
      </div>

      {/* Key Points Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            📋 Key Points
          </h2>
          <p className="text-gray-400 text-lg">
            The essential stuff you need to know
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {keyPoints.map((point, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className={`flex items-center mb-4 ${point.color}`}>
                  {point.icon}
                  <h3 className="text-lg font-bold text-white ml-3">
                    {point.title}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {point.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* Medical Disclaimer */}
          <Card className="bg-red-900/20 border border-red-500/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  Important Medical Disclaimer
                </h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  CTRL+ALT+BLOCK is <strong>not a licensed therapy provider</strong> and does not provide medical advice, 
                  diagnosis, or treatment. Our platform offers educational content and tools for self-reflection.
                </p>
                <p>
                  If you're experiencing a mental health crisis, please contact emergency services or a licensed 
                  mental health professional immediately.
                </p>
                <div className="flex items-center space-x-2 text-red-300">
                  <XCircle className="h-5 w-5" />
                  <span className="font-semibold">This platform cannot replace professional therapy</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Rights & Responsibilities */}
          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                👥 User Rights & Responsibilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Your Rights
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Access to all paid features per your subscription</li>
                    <li>• Download your data anytime</li>
                    <li>• Delete your account and data</li>
                    <li>• Cancel subscriptions without penalty</li>
                    <li>• Privacy protection per our Privacy Policy</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    Your Responsibilities
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Provide accurate information</li>
                    <li>• Use the platform respectfully</li>
                    <li>• Follow community guidelines</li>
                    <li>• Keep your account secure</li>
                    <li>• Respect other users' privacy</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Currency */}
          <Card className="bg-purple-900/20 border border-purple-500/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                🪙 Bytes & Virtual Currency
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>Bytes</strong> are our virtual currency used for in-app purchases and unlocking features. 
                  Important facts about Bytes:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• <strong>No real-world value:</strong> Bytes cannot be exchanged for money</li>
                  <li>• <strong>Non-transferable:</strong> Cannot be given to other users</li>
                  <li>• <strong>Platform-specific:</strong> Only usable within CTRL+ALT+BLOCK</li>
                  <li>• <strong>No refunds:</strong> Earned or purchased Bytes are final</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Billing & Subscriptions */}
          <Card className="bg-blue-900/20 border border-blue-500/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                💳 Billing & Subscriptions
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Automatic Renewal</h3>
                  <p>Subscriptions automatically renew at the end of each billing period unless cancelled.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cancellation</h3>
                  <p>Cancel anytime from your account settings. Cancellation takes effect at the end of your current billing period.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Refund Policy</h3>
                  <p>Refunds are considered on a case-by-case basis for technical issues or billing errors within 7 days of payment.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notice */}
        <div className="mt-12">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
            <p className="text-yellow-200">
              📋 <strong>Note:</strong> This summary covers the key points of our Terms of Service. 
              The complete legal document is being finalized and will be available here soon.
            </p>
          </div>
        </div>

        {/* Contact */}
        <Card className="bg-gray-800/50 border border-gray-600/50 mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Terms?
            </h2>
            <p className="text-gray-300 mb-6">
              If you have questions about these terms or need clarification on any point, 
              we're here to help explain things clearly.
            </p>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
              onClick={() => window.open('mailto:legal@ctrlaltblock.com')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Legal Team
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            By using CTRL+ALT+BLOCK, you agree to these terms. Let's begin your healing journey.
          </p>
          <Link href="/quiz">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-12 py-4 text-white border-0 hover:scale-105 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Begin Healing Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
