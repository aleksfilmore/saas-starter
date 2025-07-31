export function SimpleFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <footer className="relative bg-gray-950 border-t border-purple-500/30 py-16 mt-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {/* Floating background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-glitch-pink rounded-full opacity-30" style={{animation: 'float 3s ease-in-out infinite'}}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-40" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-purple-400 rounded-full opacity-50" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-black text-white mb-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                CTRL+ALT+<span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>BLOCK</span>™
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                Next-generation digital healing platform with AI therapy, 
                gamified progress tracking, and community-driven recovery.
              </p>
              <div className="flex items-center text-glitch-pink">
                <span className="w-5 h-5 mr-2">✨</span>
                <span className="font-black text-sm" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  HEALING IN PROGRESS...
                </span>
              </div>
            </div>
            
            {/* Platform Features */}
            <div>
              <h4 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                Platform Features
              </h4>
              <div className="space-y-3">
                <a 
                  href="/ai-therapy-demo" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  🧠 AI Therapy Sessions
                </a>
                <a 
                  href="/wall" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  💬 Wall of Wounds
                </a>
                <a 
                  href="/dashboard" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  📊 Progress Dashboard
                </a>
                <a 
                  href="/achievements" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  🏆 Gamification System
                </a>
              </div>
            </div>
            
            {/* Resources & Support */}
            <div>
              <h4 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                Resources
              </h4>
              <div className="space-y-3">
                <a 
                  href="/pricing" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  💳 Pricing Tiers
                </a>
                <a 
                  href="mailto:support@ctrlaltblock.com"
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  💬 Contact Support
                </a>
                <a 
                  href="/privacy" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  🔒 Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  📋 Terms of Service
                </a>
              </div>
            </div>
            
            {/* Community & Status */}
            <div>
              <h4 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                Community
              </h4>
              <div className="space-y-3 mb-6">
                <a 
                  href="/sign-up" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  🚀 Join Warriors
                </a>
                <a 
                  href="/wall" 
                  className="block text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  💫 Anonymous Support
                </a>
                <div className="block text-gray-400 font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  📈 Daily Active Healers
                </div>
              </div>
              
              {/* System Status */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center text-green-400 text-sm font-medium mb-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>System Status: OPERATIONAL</span>
                </div>
                <div className="text-xs text-gray-500" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  AI Therapy: Online • Protocol Ghost: Active
                </div>
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
                <span className="text-gray-500 text-xs font-medium" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Emotional OS v2.0 • Build {currentYear}.07.31
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* CSS for animations defined in global CSS instead of jsx */}
    </>
  );
}
