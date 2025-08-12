import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="py-12 px-4 bg-gray-900 border-t border-gray-700/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 text-2xl font-extrabold tracking-tight text-white mb-4">
            <span>CTRL</span>
            <span className="text-gray-400">+</span>
            <span>ALT</span>
            <span className="text-gray-400">+</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
          </div>
          <p className="text-gray-400 mb-6">
            UNINSTALL YOUR EX. INSTALL YOUR NEW SELF.
          </p>
        </div>
        
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/features" className="hover:text-purple-300 transition-colors">Features</Link></li>
              <li><Link href="/how-it-works" className="hover:text-purple-300 transition-colors">How It Works</Link></li>
              <li><Link href="/quiz" className="hover:text-purple-300 transition-colors">Start Free Quiz</Link></li>
              <li><Link href="/pricing" className="hover:text-purple-300 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/crisis-support" className="hover:text-purple-300 transition-colors">Crisis Support</Link></li>
              <li><Link href="/help" className="hover:text-purple-300 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-purple-300 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/blog" className="hover:text-purple-300 transition-colors">Blog</Link></li>
              <li><a href="https://www.tiktok.com/@ctrlaltblock" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">TikTok @ctrlaltblock</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/privacy" className="hover:text-purple-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-purple-300 transition-colors">Refund Policy</Link></li>
              <li><Link href="/fair-usage" className="hover:text-purple-300 transition-colors">Fair Usage Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
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
              <span className="text-xs">Made with 💜 for healing</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
