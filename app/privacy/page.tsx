"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Shield, Lock, Database, Eye, Download,
  ArrowRight, Sparkles, CheckCircle, ExternalLink
} from 'lucide-react';

export default function PrivacyPage() {
  const dataCollected = [
    "📧 Email address",
    "🔐 Encrypted password hash", 
    "🎭 Codename alias",
    "📊 Ritual stats",
    "😊 Mood logs",
    "💬 Wall posts (anonymised)"
  ];

  const dataNotCollected = [
    "❌ Real name",
    "❌ Phone number", 
    "❌ Social-login tokens",
    "❌ Exact GPS location"
  ];

  const thirdPartyProcessors = [
    {
      name: "OpenAI",
      purpose: "AI chat functionality",
      icon: "🤖"
    },
    {
      name: "PostHog", 
      purpose: "Privacy-focused analytics",
      icon: "📈"
    },
    {
      name: "Stripe",
      purpose: "Secure payment processing",
      icon: "💳"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
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
          <div className="p-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Shield className="h-16 w-16" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          Your heartbreak isn't for rent. Here's exactly how we protect your data and privacy.
        </p>
        <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-6">
          <p className="text-green-200 font-semibold">
            🛡️ No ads, no selling data. Your privacy is non-negotiable.
          </p>
        </div>
      </div>

      {/* Data Collection Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* What We Collect */}
          <Card className="bg-blue-900/20 border border-blue-500/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Database className="h-8 w-8 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  What We Collect
                </h2>
              </div>
              <ul className="space-y-3">
                {dataCollected.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* What We Don't Collect */}
          <Card className="bg-red-900/20 border border-red-500/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-red-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  What We DON'T Collect
                </h2>
              </div>
              <ul className="space-y-3">
                {dataNotCollected.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="text-2xl mr-3">{item.split(' ')[0]}</span>
                    <span>{item.substring(2)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <Card className="bg-gray-800/50 border border-gray-600/50 mb-12">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Lock className="h-8 w-8 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Security & Encryption
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🔐 Data Protection</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• AES-256 encryption at rest</li>
                  <li>• TLS 1.3 in transit</li>
                  <li>• Bcrypt password hashing</li>
                  <li>• Regular security audits</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🏗️ Infrastructure</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• EU-based hosting</li>
                  <li>• Nightly backups</li>
                  <li>• SOC 2 compliant providers</li>
                  <li>• Zero-downtime deployments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third Party Section */}
        <Card className="bg-gray-800/50 border border-gray-600/50 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              🤝 Third-Party Processors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {thirdPartyProcessors.map((processor, index) => (
                <div key={index} className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-3xl mb-2">{processor.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {processor.name}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {processor.purpose}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GDPR Rights */}
        <Card className="bg-purple-900/20 border border-purple-500/30 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              🇪🇺 Your GDPR Rights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Data Portability
                </h3>
                <p className="text-gray-300">
                  Download all your data anytime from Settings → Privacy. 
                  Get everything in a human-readable format.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Right to Deletion
                </h3>
                <p className="text-gray-300">
                  Delete your account and all associated data permanently. 
                  No hidden copies, no "deactivation"—complete removal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gray-800/50 border border-gray-600/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-gray-300 mb-6">
              We believe in transparency. If you have any questions about how we handle your data, 
              we're here to help.
            </p>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
              onClick={() => window.open('mailto:privacy@ctrlaltblock.com')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Privacy Team
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notice */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
          <p className="text-yellow-200 text-sm">
            📋 <strong>Note:</strong> This is a summary of our privacy practices. 
            The full privacy policy with legal details is being finalized and will be linked here soon.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Heal Safely?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Start your journey knowing your privacy is protected every step of the way.
          </p>
          <Link href="/quiz">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-12 py-4 text-white border-0 hover:scale-105 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Begin Private Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
