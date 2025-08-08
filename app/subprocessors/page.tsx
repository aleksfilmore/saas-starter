"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Building, Shield, Globe, Database, CreditCard, 
  ArrowLeft, CheckCircle, ExternalLink, Calendar
} from 'lucide-react';

export default function SubprocessorsPage() {
  const subprocessors = [
    {
      name: "Neon Database",
      category: "Database Hosting",
      purpose: "PostgreSQL database hosting and management",
      location: "EU (Germany), US (Virginia)",
      dataTypes: ["User accounts", "Ritual progress", "Journal entries", "Authentication sessions"],
      certifications: ["SOC 2 Type II", "ISO 27001"],
      dpaStatus: "DPA in place",
      website: "https://neon.tech",
      addedDate: "2025-01-01",
      icon: "🗄️"
    },
    {
      name: "Stripe",
      category: "Payment Processing",
      purpose: "Secure payment processing and billing management",
      location: "Global (Primary: US, EU operations)",
      dataTypes: ["Payment information", "Billing history", "Customer payment methods"],
      certifications: ["PCI DSS Level 1", "SOC 2 Type II", "ISO 27001"],
      dpaStatus: "DPA signed",
      website: "https://stripe.com",
      addedDate: "2025-01-01",
      icon: "💳"
    },
    {
      name: "OpenAI",
      category: "AI Services",
      purpose: "AI therapy conversations and natural language processing",
      location: "US (Primary), Global CDN",
      dataTypes: ["AI conversation logs", "Therapy session data (anonymized)"],
      certifications: ["SOC 2 Type II"],
      dpaStatus: "DPA signed with data retention controls",
      website: "https://openai.com",
      addedDate: "2025-01-01",
      icon: "🤖"
    },
    {
      name: "Netlify",
      category: "Hosting & CDN",
      purpose: "Web application hosting and content delivery",
      location: "Global CDN (Primary: US, EU nodes)",
      dataTypes: ["Static assets", "Application code", "CDN logs"],
      certifications: ["SOC 2 Type II", "ISO 27001"],
      dpaStatus: "DPA available on request",
      website: "https://netlify.com",
      addedDate: "2025-01-01",
      icon: "🌐"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Database Hosting": return "bg-blue-900/20 border-blue-500/30 text-blue-300";
      case "Payment Processing": return "bg-green-900/20 border-green-500/30 text-green-300";
      case "AI Services": return "bg-purple-900/20 border-purple-500/30 text-purple-300";
      case "Hosting & CDN": return "bg-orange-900/20 border-orange-500/30 text-orange-300";
      default: return "bg-gray-900/20 border-gray-500/30 text-gray-300";
    }
  };

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
              <Link href="/privacy">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Privacy
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Building className="h-8 w-8 mr-3 text-blue-400" />
            Subprocessors List
          </h1>
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-400">
            <span><strong>Last Updated:</strong> August 8, 2025</span>
            <span><strong>Next Review:</strong> September 8, 2025</span>
            <span><strong>Total Subprocessors:</strong> {subprocessors.length}</span>
          </div>
          
          {/* Overview */}
          <Card className="bg-blue-900/30 border-blue-600 mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-blue-200 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                GDPR Compliance Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">{subprocessors.length}</div>
                  <div className="text-blue-100">Active Subprocessors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{subprocessors.filter(s => s.dpaStatus.includes('DPA')).length}</div>
                  <div className="text-blue-100">DPAs in Place</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">30</div>
                  <div className="text-blue-100">Days Notice Period</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subprocessors Grid */}
          <div className="space-y-6">
            {subprocessors.map((processor, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Header */}
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">{processor.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center">
                            {processor.name}
                            <a 
                              href={processor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-gray-400 hover:text-blue-400"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </h3>
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(processor.category)}`}>
                            {processor.category}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{processor.purpose}</p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                            <Globe className="h-4 w-4 mr-1" />
                            Data Locations
                          </h4>
                          <p className="text-sm text-gray-300">{processor.location}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Added Date
                          </h4>
                          <p className="text-sm text-gray-300">{processor.addedDate}</p>
                        </div>

                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                            <Database className="h-4 w-4 mr-1" />
                            Data Types Processed
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {processor.dataTypes.map((type, typeIndex) => (
                              <span 
                                key={typeIndex} 
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compliance Info */}
                    <div className="lg:w-80">
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <Shield className="h-4 w-4 mr-1" />
                          Compliance Status
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                              <span className="text-gray-300">DPA Status</span>
                            </div>
                            <p className="text-xs text-gray-400 ml-6">{processor.dpaStatus}</p>
                          </div>

                          <div>
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                              <span className="text-gray-300">Certifications</span>
                            </div>
                            <div className="ml-6 space-y-1">
                              {processor.certifications.map((cert, certIndex) => (
                                <span 
                                  key={certIndex} 
                                  className="inline-block px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs mr-1 mb-1"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Change Notification */}
          <Card className="bg-purple-900/30 border-purple-600 mt-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-purple-200 mb-4">Change Notification Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">30</span>
                  </div>
                  <h3 className="font-medium text-purple-300 mb-2">Days Notice</h3>
                  <p className="text-purple-100">
                    We provide 30 days advance notice before adding new subprocessors
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">📧</span>
                  </div>
                  <h3 className="font-medium text-purple-300 mb-2">Email Alerts</h3>
                  <p className="text-purple-100">
                    Automatic notifications sent to all registered users
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">⚠️</span>
                  </div>
                  <h3 className="font-medium text-purple-300 mb-2">Objection Rights</h3>
                  <p className="text-purple-100">
                    Right to object and terminate service if needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gray-800/50 border-gray-600 mt-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Questions About Our Subprocessors?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-300 mb-2">Privacy Inquiries</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    For questions about data processing or DPA requests
                  </p>
                  <a href="mailto:privacy@ctrlaltblock.com" className="text-blue-400 hover:text-blue-300">
                    privacy@ctrlaltblock.com
                  </a>
                </div>

                <div>
                  <h3 className="font-medium text-gray-300 mb-2">DPA Requests</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    For enterprise customers requiring custom DPAs
                  </p>
                  <a href="mailto:legal@ctrlaltblock.com" className="text-blue-400 hover:text-blue-300">
                    legal@ctrlaltblock.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update History */}
          <Card className="bg-gray-800/50 border-gray-600 mt-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Update History</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                  <div>
                    <span className="text-white font-medium">Initial subprocessors list published</span>
                    <div className="text-gray-400">Added: Neon Database, Stripe, OpenAI, Netlify</div>
                  </div>
                  <span className="text-gray-400">2025-08-08</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
