import React from 'react';
import Link from 'next/link';
import { Heart, Shield } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-16 border-t border-brand-primary/20 bg-brand-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 text-2xl font-extrabold tracking-tight text-white mb-4 brand-glitch">
            <span>CTRL</span>
            <span className="text-brand-light">+</span>
            <span>ALT</span>
            <span className="text-brand-light">+</span>
            <span className="brand-text-gradient">BLOCK</span>
          </div>
          <p className="text-brand-light mb-6 brand-glow">
            UNINSTALL YOUR EX. INSTALL YOUR NEW SELF.
          </p>
        </div>
        
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4 brand-glow">Product</h3>
            <ul className="space-y-2 text-brand-light text-sm">
              <li><Link href="/features" className="hover:text-brand-primary brand-glow transition-colors">Features</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brand-primary brand-glow transition-colors">How It Works</Link></li>
              <li><Link href="/quiz" className="hover:text-brand-primary brand-glow transition-colors">Start Free Quiz</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-primary brand-glow transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 brand-glow">Support</h3>
            <ul className="space-y-2 text-brand-light text-sm">
              <li>
                <Link href="/crisis-support" className="hover:text-red-400 brand-glow transition-colors flex items-center">
                  <Shield className="inline h-3 w-3 mr-1" />
                  Crisis Support
                </Link>
              </li>
              <li><Link href="/help" className="hover:text-brand-primary brand-glow transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-brand-primary brand-glow transition-colors">Contact Support</Link></li>
              <li><Link href="/fair-usage" className="hover:text-brand-primary brand-glow transition-colors">Fair Usage</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 brand-glow">Community</h3>
            <ul className="space-y-2 text-brand-light text-sm">
              <li><Link href="/blog" className="hover:text-brand-primary brand-glow transition-colors">Blog</Link></li>
              <li><a href="https://www.tiktok.com/@ctrlaltblock" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary brand-glow transition-colors">TikTok @ctrlaltblock</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 brand-glow">Legal</h3>
            <ul className="space-y-2 text-brand-light text-sm">
              <li><Link href="/privacy" className="hover:text-brand-primary brand-glow transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-primary brand-glow transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-brand-primary brand-glow transition-colors">Refund Policy</Link></li>
              <li><Link href="/subprocessors" className="hover:text-brand-primary brand-glow transition-colors">Subprocessors</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-brand-primary/20 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-brand-light text-sm">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span>© 2025 CTRL+ALT+BLOCK</span>
              <span>•</span>
              <span>Privacy-First</span>
              <span>•</span>
              <span>Science-Backed</span>
              <span>•</span>
              <span>Anonymous</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-brand-secondary" />
                <span className="text-xs">Made with healing energy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
