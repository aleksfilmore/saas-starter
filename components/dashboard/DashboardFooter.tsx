'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function DashboardFooter() {
  return (
    <footer className="mt-16 border-t border-gray-600/30 bg-gray-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">CTRL+ALT+BLOCK</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/crisis-support" className="hover:text-white transition-colors">
                  Crisis Support
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@ctrlaltblock.com" 
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-white transition-colors">
                  Research & Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/fair-usage" className="hover:text-white transition-colors">
                  Fair Usage Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimers & Important Info */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">⚠️ Important Notice</h4>
              <p className="mb-2">
                This platform provides mental wellness tools and is not a substitute for professional medical advice, 
                diagnosis, or treatment. Always seek advice from qualified mental health professionals for any questions 
                about your mental health.
              </p>
              <p>
                <strong className="text-gray-300">Crisis Support:</strong> If you're experiencing thoughts of self-harm, 
                please contact your local emergency services or crisis helpline immediately.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">🔒 Data & Security</h4>
              <p className="mb-2">
                Your privacy is our priority. All data is encrypted in transit and at rest. 
                Anonymous features ensure your identity remains protected in community interactions.
              </p>
              <p>
                <strong className="text-gray-300">GDPR Compliant:</strong> EU users have full data control rights. 
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 ml-1">
                  Learn more
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="mt-6 p-4 bg-red-900/20 border border-red-600/50 rounded-lg">
          <h4 className="font-semibold text-red-300 mb-2 flex items-center">
            🆘 Emergency Resources
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-red-200">
            <div>
              <strong>US:</strong> 988 (Suicide & Crisis Lifeline)
            </div>
            <div>
              <strong>UK:</strong> 116 123 (Samaritans)
            </div>
            <div>
              <strong>EU:</strong> 
              <a 
                href="https://www.befrienders.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-300 hover:text-red-200 ml-1 inline-flex items-center"
              >
                Find Local Support
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600/30 mt-8 pt-6 text-center text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2025 CTRL+ALT+BLOCK. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span> Cancel anytime</span>
              <span>•</span>
              <span>💳 No hidden fees</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
