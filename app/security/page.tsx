"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Shield, Lock, Database, Server, Bug, Award,
  ArrowRight, Sparkles, ExternalLink, CheckCircle,
  AlertTriangle, Eye, Globe
} from 'lucide-react';

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: "AES-256 Encryption",
      description: "Military-grade encryption protects your data at rest",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "TLS 1.3 Everywhere",
      description: "Latest encryption protocols for all data in transit",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "EU Infrastructure", 
      description: "Vercel + Supabase hosting in European data centers",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Nightly Backups",
      description: "Automated off-site backups ensure data recovery",
      color: "from-orange-500 to-red-500"
    }
  ];

  const authFeatures = [
    "📧 Email + password authentication",
    "🔐 bcrypt hashing (12 rounds)",
    "🚫 No social logins required",
    "📱 No phone numbers collected"
  ];

  const aiSecurity = [
    "🧠 Prompt + response storage",
    "🔗 Salted user ID association", 
    "⏰ 30-day automatic purge",
    "🔒 Zero persistent AI memory"
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
          Security & Data Protection
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          Your heartbreak is messy—your data security shouldn't be.
        </p>
        <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-6">
          <p className="text-green-200 font-semibold">
            🛡️ Bank-level security protecting your most vulnerable moments
          </p>
        </div>
      </div>

      {/* Security Features */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🔒 Core Security Features
          </h2>
          <p className="text-gray-400 text-lg">
            Multiple layers of protection for your data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Authentication Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-blue-900/20 border border-blue-500/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Lock className="h-8 w-8 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  🔐 Authentication Security
                </h2>
              </div>
              <ul className="space-y-3">
                {authFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-800/20 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <strong>Why no social logins?</strong> We prioritize your privacy over convenience. 
                  No third-party tracking or data sharing.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/20 border border-purple-500/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  🧠 AI Query Security
                </h2>
              </div>
              <ul className="space-y-3">
                {aiSecurity.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-purple-800/20 rounded-lg">
                <p className="text-purple-200 text-sm">
                  <strong>Privacy-first AI:</strong> Your conversations are automatically 
                  deleted after 30 days. No long-term AI memory of your personal details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vulnerability Disclosure */}
        <Card className="bg-red-900/20 border border-red-500/30 mb-12">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Bug className="h-8 w-8 text-red-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                🐛 Vulnerability Disclosure
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Report Security Issues</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Email: security@ctrlaltblock.com</li>
                  <li>• We acknowledge within 24 hours</li>
                  <li>• Fix critical issues within 5 days</li>
                  <li>• Responsible disclosure appreciated</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Bug Bounty Rewards</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Hall-of-Fame recognition</li>
                  <li>• 5,000 Bytes for critical CVEs</li>
                  <li>• Public acknowledgment (optional)</li>
                  <li>• Direct communication with security team</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="border-red-500 text-red-400 hover:bg-red-500/20"
                onClick={() => window.open('mailto:security@ctrlaltblock.com')}
              >
                <Bug className="h-4 w-4 mr-2" />
                Report Security Issue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audits & Compliance */}
        <Card className="bg-green-900/20 border border-green-500/30 mb-12">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                🏆 Security Audits & Compliance
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-white mb-2">External Audits</h3>
                <p className="text-gray-300 text-sm">
                  Independent security assessments twice yearly
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-white mb-2">Public Reports</h3>
                <p className="text-gray-300 text-sm">
                  Summary reports published for transparency
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🇪🇺</div>
                <h3 className="text-lg font-bold text-white mb-2">GDPR Compliant</h3>
                <p className="text-gray-300 text-sm">
                  Full compliance with EU data protection laws
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Details */}
        <Card className="bg-gray-800/50 border border-gray-600/50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              🏗️ Infrastructure & Hosting
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Hosting Partners</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Vercel:</strong> Edge computing and CDN</li>
                  <li>• <strong>Supabase:</strong> Database and authentication</li>
                  <li>• <strong>EU Region:</strong> GDPR-compliant hosting</li>
                  <li>• <strong>SOC 2:</strong> Certified service providers</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Operational Security</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Zero-downtime deployments</li>
                  <li>• Automated security patches</li>
                  <li>• 24/7 infrastructure monitoring</li>
                  <li>• DDoS protection and rate limiting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Security Team */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="bg-gray-800/50 border border-gray-600/50">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Security Questions?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our security team is available to answer questions about our practices, 
              discuss vulnerability reports, or provide additional technical details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-green-500 text-green-400 hover:bg-green-500/20"
                onClick={() => window.open('mailto:security@ctrlaltblock.com')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Security Team
              </Button>
              <Button 
                variant="outline" 
                className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                onClick={() => window.open('https://docs.ctrlaltblock.com/security', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Technical Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Heal with Confidence
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Your security is our foundation. Start your healing journey knowing your data is protected.
          </p>
          <Link href="/quiz">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-12 py-4 text-white border-0 hover:scale-105 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Begin Secure Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
