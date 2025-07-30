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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Legal Links */}
            <div>
              <h3 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                Legal & Policies
              </h3>
              <div className="space-y-4">
                <a 
                  href="/privacy" 
                  className="flex items-center text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="flex items-center text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
                  Terms of Service
                </a>
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-xl font-black text-white mb-6" style={{fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900'}}>
                Connect
              </h3>
              <div className="space-y-4">
                <a 
                  href="mailto:support@ctrlaltblock.com"
                  className="flex items-center text-gray-400 hover:text-glitch-pink transition-colors font-medium"
                  style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
                >
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
                <span className="w-5 h-5 mr-2">✨</span>
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
      
      {/* CSS for animations defined in global CSS instead of jsx */}
    </>
  );
}
