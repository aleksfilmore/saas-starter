"use client";

import { Shield, Database, Settings, Bot, Users, Globe, Mail, Sparkles } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border-2 border-glitch-pink rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_40px_rgba(255,20,147,0.3)]">
        <h3 className="text-2xl font-black text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
          Contact Us
        </h3>
        <p className="text-gray-300 mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
          Need help with your emotional reformat? We're here for you.
        </p>
        <div className="space-y-4">
          <a 
            href="mailto:support@ctrlaltblock.com" 
            className="flex items-center text-blue-400 hover:text-glitch-pink transition-colors"
            style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
          >
            <Mail className="w-4 h-4 mr-3" />
            support@ctrlaltblock.com
          </a>
        </div>
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-glitch-pink hover:bg-glitch-pink/90 text-white font-black py-3 rounded-xl transition-colors"
          style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* Footer Section */}
      <footer className="relative bg-gray-950 border-t border-purple-500/30 py-16 mt-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {/* Floating background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-glitch-pink rounded-full animate-float opacity-30"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-purple-400 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Legal Links */}
            <div>
              <h3 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                Legal & Policies
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Privacy Policy", icon: Shield, href: "/privacy" },
                  { name: "Cookies Policy", icon: Database, href: "/cookies" },
                  { name: "Terms of Service", icon: Settings, href: "/terms" },
                  { name: "Fair Usage Policy (AI)", icon: Bot, href: "/ai-usage" },
                  { name: "Community Guidelines", icon: Users, href: "/community" }
                ].map((linkItem, index) => (
                  <a 
                    key={index}
                    href={linkItem.href} 
                    className="flex items-center text-gray-400 hover:text-glitch-pink transition-colors font-medium group"
                    style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                  >
                    <linkItem.icon className="w-4 h-4 mr-3 group-hover:text-glitch-pink transition-colors" />
                    {linkItem.name}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Social & Contact */}
            <div>
              <h3 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                Connect
              </h3>
              <div className="space-y-4">
                <a 
                  href="https://tiktok.com/@ctrlaltblock" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-glitch-pink transition-colors font-medium group"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  <Globe className="w-4 h-4 mr-3 group-hover:text-glitch-pink transition-colors" />
                  TikTok @ctrlaltblock
                </a>
                <a 
                  href="mailto:support@ctrlaltblock.com"
                  className="flex items-center text-gray-400 hover:text-glitch-pink transition-colors font-medium group"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  <Mail className="w-4 h-4 mr-3 group-hover:text-glitch-pink transition-colors" />
                  Contact Us
                </a>
              </div>
            </div>
            
            {/* Brand */}
            <div>
              <h3 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                CTRL+ALT+BLOCK™
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                Your emotional OS upgrade.<br />
                Reclaim your power. Rewrite your code.
              </p>
              <div className="flex items-center text-glitch-pink">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                <span className="font-black text-sm" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  HEALING IN PROGRESS...
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-sm font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                © {currentYear} CTRL+ALT+BLOCK™. All rights reserved. No exes were harmed in the making of this platform.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-green-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>System Status: OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
