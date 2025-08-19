import React from 'react';
import Link from 'next/link';
import { Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-brand-primary/20 bg-brand-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white brand-glitch mb-4">
              <span>CTRL</span>
              <span className="text-brand-light">+</span>
              <span>ALT</span>
              <span className="text-brand-light">+</span>
              <span className="brand-text-gradient">BLOCK</span>
            </Link>
            <p className="text-brand-light text-sm leading-relaxed">
              Digital healing technology that transforms heartbreak into an engaging journey of self-discovery.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4 brand-glow">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Healing Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 brand-glow">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/crisis-support" className="text-brand-light hover:text-red-400 brand-glow transition-colors">
                  <Shield className="inline h-3 w-3 mr-1" />
                  Crisis Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/fair-usage" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Fair Usage
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 brand-glow">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/subprocessors" className="text-brand-light hover:text-brand-primary brand-glow transition-colors">
                  Subprocessors
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-brand-primary/20 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-brand-light text-sm">
            <Heart className="h-4 w-4 mr-2 text-brand-secondary" />
            <span>Made with healing energy</span>
          </div>
          <div className="mt-4 md:mt-0 text-brand-light text-sm">
            © 2025 CTRL+ALT+BLOCK. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
