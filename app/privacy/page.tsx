"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Shield, Lock, Database, Eye, AlertTriangle,
  CheckCircle, Mail, Building, ArrowLeft
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

export default function PrivacyPage() {
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-green-400" />
            Privacy Policy
          </h1>
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-400">
            <span><strong>Last Updated:</strong> August 8, 2025</span>
            <span><strong>Effective Date:</strong> August 8, 2025</span>
            <span><strong>Version:</strong> 1.0</span>
          </div>
          
          <div className="text-gray-300 space-y-8 leading-relaxed">
            
            {/* Data Controller */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                1. Data Controller Information
              </h2>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Company:</strong> CTRL+ALT+BLOCK</p>
                      <p><strong>Registration:</strong> [Pending incorporation]</p>
                      <p><strong>Legal Address:</strong> [To be updated upon incorporation]</p>
                    </div>
                    <div>
                      <p><strong>Data Protection Officer:</strong> [To be appointed]</p>
                      <p><strong>Privacy Contact:</strong> privacy@ctrlaltblock.com</p>
                      <p><strong>EU Representative:</strong> [If required - TBD]</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Legal Basis */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Legal Basis for Processing (GDPR Art. 6)</h2>
              <div className="space-y-4">
                <Card className="bg-blue-900/20 border-blue-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-blue-300 mb-2">Contract Performance (Art. 6(1)(b))</h3>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>User registration and authentication</li>
                      <li>Ritual tracking and progress data</li>
                      <li>AI therapy session delivery</li>
                      <li>Subscription management and billing</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-900/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-purple-300 mb-2">Legitimate Interests (Art. 6(1)(f))</h3>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Service improvement and analytics</li>
                      <li>Security monitoring and fraud prevention</li>
                      <li>Customer support and troubleshooting</li>
                      <li>Business operations and performance monitoring</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-green-300 mb-2">Consent (Art. 6(1)(a))</h3>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      <li>Marketing communications (opt-in only)</li>
                      <li>Anonymous community posts (Wall of Wounds)</li>
                      <li>Advanced analytics and personalization</li>
                      <li>Non-essential cookies</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Data We Collect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      Account Data
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• Email address (login identifier)</li>
                      <li>• Username (public display name)</li>
                      <li>• Password hash (bcrypt + salt)</li>
                      <li>• Subscription tier and billing history</li>
                      <li>• Account preferences and settings</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center">
                      <Database className="h-4 w-4 mr-2 text-blue-400" />
                      Usage Data
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• Ritual completion records</li>
                      <li>• Journal entries (encrypted at rest)</li>
                      <li>• AI therapy conversations</li>
                      <li>• Progress metrics (XP, streaks)</li>
                      <li>• Login times and session data</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-purple-400" />
                      Technical Data
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• IP address (security purposes)</li>
                      <li>• Browser type and version</li>
                      <li>• Device information</li>
                      <li>• Session cookies (essential only)</li>
                      <li>• Error logs (anonymized)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-yellow-400" />
                      Community Data (Optional)
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• Anonymous Wall posts (no identifiers)</li>
                      <li>• Post reactions and interactions</li>
                      <li>• Community engagement metrics</li>
                      <li>• Tags and categories (self-selected)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Retention</h2>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-white mb-2">Retention Periods</h4>
                      <ul className="space-y-1">
                        <li><strong>Account Data:</strong> Until deletion + 30 days</li>
                        <li><strong>Journal Entries:</strong> Until deletion or 7 years max</li>
                        <li><strong>AI Conversations:</strong> Auto-deleted after 90 days</li>
                        <li><strong>Usage Analytics:</strong> Anonymized after 12 months</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Legal Requirements</h4>
                      <ul className="space-y-1">
                        <li><strong>Payment Records:</strong> 7 years (tax law)</li>
                        <li><strong>Security Logs:</strong> 12 months maximum</li>
                        <li><strong>Backups:</strong> 30 days (disaster recovery)</li>
                        <li><strong>Audit Logs:</strong> 3 years (compliance)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Subprocessors */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Subprocessors & Data Sharing</h2>
              <div className="space-y-4">
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3">Essential Service Providers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Database:</strong> Neon Database (EU/US)</p>
                        <p className="text-gray-400">• SOC2 certified • DPA in place</p>
                        
                        <p className="mt-2"><strong>Payments:</strong> Stripe (Global)</p>
                        <p className="text-gray-400">• PCI DSS Level 1 • GDPR compliant</p>
                      </div>
                      <div>
                        <p><strong>AI Services:</strong> OpenAI (US)</p>
                        <p className="text-gray-400">• DPA signed • Data retention controls</p>
                        
                        <p className="mt-2"><strong>Hosting:</strong> [Provider TBD]</p>
                        <p className="text-gray-400">• EU-based preferred • SOC2 required</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    📋 <strong>Subprocessor List:</strong> Complete and current list available at 
                    <Link href="/subprocessors" className="text-blue-400 hover:text-blue-300 ml-1">
                      ctrlaltblock.com/subprocessors
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            {/* GDPR Rights */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights Under GDPR</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-green-300 mb-2">Self-Service Rights</h3>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Access:</strong> Download all data (Settings → Export)</li>
                      <li>• <strong>Rectification:</strong> Update info in account settings</li>
                      <li>• <strong>Erasure:</strong> Delete account (Settings → Delete)</li>
                      <li>• <strong>Portability:</strong> JSON export format</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-purple-900/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-purple-300 mb-2">Contact Required</h3>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Restrict Processing:</strong> Temporary pause</li>
                      <li>• <strong>Object:</strong> Legitimate interest processing</li>
                      <li>• <strong>Withdraw Consent:</strong> Marketing/optional features</li>
                      <li>• <strong>Complain:</strong> Local data protection authority</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-blue-900/30 border-blue-600 mt-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-blue-300 mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Exercise Your Rights
                  </h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Email:</strong> privacy@ctrlaltblock.com</p>
                    <p><strong>Response Time:</strong> Within 30 days (GDPR requirement)</p>
                    <p><strong>ID Verification:</strong> May be required for sensitive requests</p>
                    <p><strong>Appeal Process:</strong> Contact your local supervisory authority</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Security Measures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3">Data Protection</h3>
                    <ul className="text-sm space-y-1">
                      <li>• AES-256 encryption at rest</li>
                      <li>• TLS 1.3 for data in transit</li>
                      <li>• bcrypt password hashing with salt</li>
                      <li>• Journal entries encrypted separately</li>
                      <li>• Regular penetration testing</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-3">Infrastructure</h3>
                    <ul className="text-sm space-y-1">
                      <li>• EU-based hosting infrastructure</li>
                      <li>• Automated backups (30-day retention)</li>
                      <li>• Access controls and audit logging</li>
                      <li>• Incident response plan in place</li>
                      <li>• SOC2 compliant vendors only</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg mt-4">
                <p className="text-yellow-200 text-sm">
                  ⚠️ <strong>Security Claims Verification:</strong> We are implementing formal security audits and will publish 
                  audit results and certifications as they become available. Current claims reflect our design intentions 
                  and vendor certifications.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. International Transfers</h2>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <p className="mb-3">We primarily process data within the EU. When transfers outside the EEA are necessary:</p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Standard Contractual Clauses (SCCs):</strong> EU Commission approved</li>
                    <li>• <strong>Transfer Impact Assessments:</strong> Conducted where required</li>
                    <li>• <strong>OpenAI (US):</strong> DPA with supplementary measures</li>
                    <li>• <strong>Stripe (US):</strong> Adequacy decision and additional safeguards</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Age Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Age Requirements</h2>
              <Card className="bg-red-900/30 border-red-600">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-300 mb-2">Minimum Age: 16 Years</h3>
                      <p className="text-sm">
                        Our service is not intended for children under 16. We do not knowingly collect personal data 
                        from children under 16. If you become aware that a child has provided us with personal data, 
                        please contact us immediately at privacy@ctrlaltblock.com.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Cookies & Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-green-300 mb-2">Essential Cookies</h3>
                    <ul className="text-sm space-y-1">
                      <li>• lucia_session (authentication)</li>
                      <li>• CSRF tokens (security)</li>
                      <li>• User preferences (theme, language)</li>
                      <li>• Shopping cart (if applicable)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-orange-900/20 border-orange-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-orange-300 mb-2">Optional Cookies (Consent Required)</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Analytics (anonymized usage)</li>
                      <li>• Performance monitoring</li>
                      <li>• A/B testing (if implemented)</li>
                      <li>• Marketing attribution</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Breach Notification */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Data Breach Notification</h2>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-medium text-white mb-2">Our Commitment</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Supervisory Authority:</strong> Notification within 72 hours</li>
                    <li>• <strong>Affected Users:</strong> Notification within 72 hours if high risk</li>
                    <li>• <strong>Information Provided:</strong> Nature of breach, consequences, measures taken</li>
                    <li>• <strong>Incident Response:</strong> Immediate containment and investigation</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Policy Updates</h2>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <p className="mb-2">We will notify you of material changes via:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Email notification to registered users</li>
                    <li>• Prominent notice in the application</li>
                    <li>• Updated "Last Modified" date</li>
                    <li>• 30-day notice period for significant changes</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. Contact Information</h2>
              <Card className="bg-blue-900/30 border-blue-600">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="font-medium text-blue-300 mb-2">Privacy Matters</h3>
                      <p><strong>Email:</strong> privacy@ctrlaltblock.com</p>
                      <p><strong>Response Time:</strong> 48 hours acknowledgment</p>
                      <p><strong>DPO:</strong> [To be appointed]</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-300 mb-2">General Support</h3>
                      <p><strong>Email:</strong> support@ctrlaltblock.com</p>
                      <p><strong>Legal Address:</strong> [Upon incorporation]</p>
                      <p><strong>Business Hours:</strong> Mon-Fri 9-17 CET</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Legal Notice */}
            <div className="mt-8 p-6 bg-purple-900/30 border border-purple-600 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-200 mb-3">Legal Binding Effect</h3>
              <p className="text-purple-100 text-sm leading-relaxed">
                This privacy policy constitutes a legally binding agreement between you and CTRL+ALT+BLOCK. 
                By using our service, you acknowledge that you have read, understood, and agree to be bound by this policy. 
                If you do not agree with any part of this policy, you must not use our service.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
