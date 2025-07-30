import Link from "next/link";

export function SimpleHeader() {
  return (
    <header className="w-full border-b border-border/30 bg-card/60 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-col">
            <Link
              href="/"
              aria-label="CTRL+ALT+BLOCK Home"
              className="flex items-center gap-1 text-2xl font-extrabold tracking-tight select-none hover:no-underline focus:no-underline focus-visible:outline-2 focus-visible:outline-primary outline-none group"
            >
              <span className="text-white">CTRL</span>
              <span className="text-base font-normal text-white/60 group-hover:text-white transition-colors">+</span>
              <span className="text-white">ALT</span>
              <span className="text-base font-normal text-white/60 group-hover:text-white transition-colors">+</span>
              <span 
                className="font-black text-glitch-pink group-hover:animate-pulse"
                style={{
                  textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.6)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: '900'
                }}
              >
                BLOCK
              </span>
            </Link>
            <p className="text-xs text-fuchsia-400/80 font-medium ml-1 tracking-wide" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Emotional reformat protocol
            </p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-x-8">
            <Link
              href="#how-it-works"
              className="text-base font-semibold text-white hover:text-glitch-pink transition-all duration-300 px-4 py-2 rounded-xl hover:bg-glitch-pink/10 hover:shadow-[0_0_10px_rgba(255,20,147,0.3)]"
              style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="text-base font-semibold text-white hover:text-blue-400 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-blue-400/10 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-base font-semibold text-white hover:text-purple-400 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-purple-400/10 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
            >
              Login
            </Link>
            <Link href="/sign-up">
              <button
                className="text-base font-black bg-glitch-pink hover:bg-glitch-pink/90 text-white rounded-xl px-8 py-3 shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] transition-all duration-300 border-2 border-glitch-pink hover:scale-105"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: '900',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                Sign-up FREE
              </button>
            </Link>
          </div>

          {/* Mobile Menu - Simplified */}
          <div className="md:hidden flex items-center">
            <div className="flex flex-col space-y-2">
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-white hover:text-purple-400 transition-colors"
                style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
              >
                Login
              </Link>
              <Link href="/sign-up">
                <button
                  className="text-sm font-black bg-glitch-pink hover:bg-glitch-pink/90 text-white rounded-lg px-4 py-2 transition-colors"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '900'
                  }}
                >
                  Sign-up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
