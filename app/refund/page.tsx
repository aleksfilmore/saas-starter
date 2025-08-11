"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  CreditCard, RefreshCw, Clock, Shield, CheckCircle,
  AlertTriangle, Mail, DollarSign, ArrowLeft, Calendar
} from 'lucide-react';

export default function RefundPage() {
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
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <RefreshCw className="h-8 w-8 mr-3 text-green-400" />
            Refund Policy
          </h1>
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-400">
            <span><strong>Last Updated:</strong> August 8, 2025</span>
            <span><strong>Effective Date:</strong> August 8, 2025</span>
            <span><strong>Version:</strong> 1.0</span>
          </div>
          
          <div className="text-gray-300 space-y-8 leading-relaxed">
            
            {/* Quick Overview */}
            <section>
              <Card className="bg-blue-900/30 border-blue-600">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-blue-200 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    30-Day Money-Back Guarantee
                  </h2>
                  <p className="text-blue-100 mb-4">
                    We stand behind our service. If CTRL+ALT+BLOCK doesn't help you on your healing journey, 
                    we'll refund your money within 30 days of purchase.
                  </p>
                  <div className="flex items-center text-green-300">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">No questions asked, no hassle, no hard feelings.</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* What We Offer */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                      AI Therapy Sessions ($3.99)
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• 300 AI therapy messages</li>
                      <li>• Advanced conversation capabilities</li>
                      <li>• Personalized coping strategies</li>
                      <li>• Progress tracking integration</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-purple-400" />
                      Future Premium Features
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• Monthly/annual subscriptions</li>
                      <li>• Advanced ritual tracking</li>
                      <li>• Priority support</li>
                      <li>• Same refund policy applies</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Refund Eligibility */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Refund Eligibility</h2>
              
              <Card className="bg-green-900/20 border-green-500/30 mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-green-300 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Eligible for Full Refund
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>• Purchase made within last 30 days</li>
                    <li>• Account in good standing (no policy violations)</li>
                    <li>• Request made through proper channels</li>
                    <li>• Service not meeting reasonable expectations</li>
                    <li>• Technical issues preventing usage</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-yellow-900/20 border-yellow-500/30 mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-yellow-300 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Partial Refund Scenarios
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>• AI therapy messages partially used (pro-rated)</li>
                    <li>• Premium subscription cancellation mid-cycle</li>
                    <li>• Service changes affecting purchased features</li>
                    <li>• Calculated based on unused portion</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-4">
                  <h3 className="font-medium text-red-300 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Non-Refundable Situations
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>• Purchase made over 30 days ago</li>
                    <li>• Account terminated for policy violations</li>
                    <li>• Fraudulent or chargeback claims</li>
                    <li>• Third-party payment processor fees</li>
                    <li>• Services fully consumed/utilized</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Refund Process */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. How to Request a Refund</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-900/20 border-blue-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-medium text-blue-300 mb-2">Contact Us</h3>
                    <p className="text-sm text-blue-100">
                      Email refunds@ctrlaltblock.com with your request
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-900/20 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-medium text-purple-300 mb-2">Review</h3>
                    <p className="text-sm text-purple-100">
                      We review your request within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-medium text-green-300 mb-2">Process</h3>
                    <p className="text-sm text-green-100">
                      Refund processed within 5-7 business days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-3">Required Information for Refund Request</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Account email:</strong> The email associated with your account</li>
                    <li>• <strong>Purchase date:</strong> When you made the purchase</li>
                    <li>• <strong>Transaction ID:</strong> From your email receipt or payment method</li>
                    <li>• <strong>Reason:</strong> Brief explanation (optional but helpful)</li>
                    <li>• <strong>Preferred refund method:</strong> Original payment method or alternative</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Processing Timeline */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Refund Processing Timeline</h2>
              
              <div className="space-y-4">
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="font-medium text-white">Processing Times</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Credit/Debit Cards:</strong> 5-7 business days</p>
                        <p><strong>PayPal:</strong> 3-5 business days</p>
                        <p><strong>Bank Transfers:</strong> 7-10 business days</p>
                      </div>
                      <div>
                        <p><strong>Request Response:</strong> Within 24 hours</p>
                        <p><strong>Approval Notification:</strong> Within 48 hours</p>
                        <p><strong>Processing Start:</strong> Within 72 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>Note:</strong> Processing times depend on your payment provider. 
                    Stripe typically processes refunds faster than traditional banking systems.
                  </p>
                </div>
              </div>
            </section>

            {/* Special Circumstances */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Special Circumstances</h2>
              
              <div className="space-y-4">
                <Card className="bg-purple-900/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-purple-300 mb-2">Service Disruptions</h3>
                    <p className="text-sm text-purple-100">
                      If our service experiences significant downtime or technical issues affecting your usage, 
                      we may offer automatic credits or proactive refunds regardless of the 30-day window.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-green-300 mb-2">Premium Feature Changes</h3>
                    <p className="text-sm text-green-100">
                      If we discontinue a premium feature you've paid for, we'll offer a full refund 
                      for the unused portion or equivalent credits for alternative features.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-900/20 border-orange-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-orange-300 mb-2">Account Termination</h3>
                    <p className="text-sm text-orange-100">
                      If we terminate your account for policy violations, paid features may not be refundable. 
                      However, we'll review each case individually and may offer partial refunds for unused services.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Dispute Resolution</h2>
              
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-3">If You Disagree with Our Decision</h3>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li><strong>Appeal Process:</strong> Email appeals@ctrlaltblock.com within 30 days</li>
                    <li><strong>Management Review:</strong> Senior team member will review your case</li>
                    <li><strong>Final Decision:</strong> Written response within 7 business days</li>
                    <li><strong>External Resolution:</strong> Contact your payment provider or local consumer protection agency</li>
                  </ol>
                </CardContent>
              </Card>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-blue-900/30 border-blue-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-blue-300 mb-3 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Refund Requests
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Email:</strong> refunds@ctrlaltblock.com</p>
                      <p><strong>Response Time:</strong> Within 24 hours</p>
                      <p><strong>Business Hours:</strong> Mon-Fri 9-17 CET</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-900/30 border-purple-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-purple-300 mb-3">General Support</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Email:</strong> support@ctrlaltblock.com</p>
                      <p><strong>For:</strong> Technical issues, billing questions</p>
                      <p><strong>Priority:</strong> Account issues resolved first</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Legal Notice */}
            <div className="mt-8 p-6 bg-gray-800/50 border border-gray-600 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Legal Framework</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <strong>Consumer Rights:</strong> This refund policy complements your statutory rights under EU consumer protection law and does not limit them.
                </p>
                <p>
                  <strong>Governing Law:</strong> This policy is governed by the laws of [Jurisdiction to be determined upon incorporation].
                </p>
                <p>
                  <strong>Digital Content Rights:</strong> Under EU law, you have the right to withdraw from digital content purchases within 14 days, extending to our 30-day guarantee.
                </p>
              </div>
            </div>

            {/* Policy Updates */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Policy Updates</h2>
              
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <p className="text-sm mb-3">
                    We may update this refund policy to reflect changes in our services or legal requirements. 
                    Changes will be communicated via:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Email notification to active users</li>
                    <li>• In-app notification</li>
                    <li>• Updated "Last Modified" date</li>
                    <li>• 30-day notice for material changes</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
