"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  AlertTriangle, Phone, Globe, Heart, 
  ArrowRight, Shield, Sparkles
} from 'lucide-react';

export default function CrisisSupportPage() {
  const emergencyNumbers = [
    {
      region: "EU",
      number: "112",
      description: "Emergency services",
      flag: "🇪🇺"
    },
    {
      region: "US",
      number: "988",
      description: "Suicide & Crisis Lifeline",
      flag: "🇺🇸"
    },
    {
      region: "UK & ROI",
      number: "116 123",
      description: "Samaritans",
      flag: "🇬🇧"
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
          <div className="p-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <AlertTriangle className="h-16 w-16" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
          Crisis Support
        </h1>
        <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-8 mb-8">
          <p className="text-xl text-red-200 leading-relaxed">
            CTRL+ALT+BLOCK is a digital tool, <strong>not</strong> a licensed therapy provider.
          </p>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gray-800/50 border border-red-500/50 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 mr-3 text-red-400" />
              If you feel unsafe with yourself or others:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {emergencyNumbers.map((contact, index) => (
              <Card key={index} className="bg-red-900/20 border border-red-500/30 hover:border-red-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{contact.flag}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {contact.region}
                  </h3>
                  <div className="text-3xl font-black text-red-400 mb-2">
                    {contact.number}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {contact.description}
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500/20"
                      onClick={() => window.open(`tel:${contact.number.replace(/\s/g, '')}`)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="bg-blue-900/20 border border-blue-500/30 inline-block">
              <CardContent className="p-6">
                <Globe className="h-8 w-8 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-bold text-white mb-2">
                  Global Crisis Lines
                </h3>
                <p className="text-gray-300 mb-4">
                  Find local support worldwide
                </p>
                <Button 
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  onClick={() => window.open('https://findahelpline.com', '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Find Help Lines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* App Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white mr-4">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  In-App Panic Mode
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you're in crisis, click the Panic Mode button in the app. It links you here instantly and provides immediate access to crisis resources.
              </p>
              <p className="text-red-300 font-semibold">
                Rituals can wait—your safety can't.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mr-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Safety First
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                CTRL+ALT+BLOCK is designed to support your healing journey, but it's not a replacement for professional mental health care or emergency services.
              </p>
              <p className="text-purple-300 font-semibold">
                Your wellbeing is our top priority.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Resources */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Additional Support Resources
          </h2>
          <p className="text-gray-400 text-lg">
            Remember: You're not alone in this journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                🧠 Mental Health Resources
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• National Alliance on Mental Illness (NAMI)</li>
                <li>• Mental Health America</li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
                <li>• SAMHSA National Helpline: 1-800-662-4357</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                💔 Relationship Support
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• National Domestic Violence Hotline: 1-800-799-7233</li>
                <li>• Love Is Respect: 1-866-331-9474</li>
                <li>• RAINN National Sexual Assault Hotline: 1-800-656-4673</li>
                <li>• The Trevor Project (LGBTQ+): 1-866-488-7386</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Supportive Healing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            When you're ready, we're here to support your journey with tools designed for your safety and growth.
          </p>
          <Link href="/quiz">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-12 py-4 text-white border-0 hover:scale-105 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Begin Safe Healing
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
