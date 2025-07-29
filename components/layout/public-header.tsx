"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Button
                className="text-base font-black bg-glitch-pink hover:bg-glitch-pink/90 text-white rounded-xl px-8 py-3 shadow-[0_0_20px_rgba(255,20,147,0.4)] hover:shadow-[0_0_30px_rgba(255,20,147,0.6)] transition-all duration-300 border-2 border-glitch-pink hover:scale-105"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: '900',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                Sign-up FREE
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
            <div className="bg-card/95 backdrop-blur-xl border-r border-primary/30 w-64 h-full shadow-neon-pink/50 flex flex-col p-6 gap-4 animate-slide-in-left">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  aria-label="CTRL+ALT+BLOCK Home"
                  className="flex items-center gap-1 text-xl font-extrabold tracking-tight select-none hover:no-underline focus:no-underline focus-visible:outline-2 focus-visible:outline-primary outline-none group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-white">CTRL</span>
                  <span className="text-base font-normal text-white/60">+</span>
                  <span className="text-white">ALT</span>
                  <span className="text-base font-normal text-white/60">+</span>
                  <span className="text-glitch-pink drop-shadow-[0_0_8px_rgba(255,20,147,0.8)]">BLOCK</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </Button>
              </div>
              <Link
                href="#how-it-works"
                className="text-base font-medium text-white hover:text-glitch-pink transition-colors py-3 px-4 rounded-lg hover:bg-glitch-pink/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                href="/pricing"
                className="text-base font-medium text-white hover:text-accent transition-colors py-3 px-4 rounded-lg hover:bg-accent/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/sign-in"
                className="text-base font-medium text-white hover:text-secondary transition-colors py-3 px-4 rounded-lg hover:bg-secondary/10 focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  type="button"
                  className="w-full text-base font-semibold bg-gradient-to-r from-glitch-pink to-secondary hover:from-glitch-pink/80 hover:to-secondary/80 text-white rounded-xl px-6 py-3 shadow-neon-pink hover:shadow-neon-pink/80 transition-all duration-300 mt-2 animate-pulse-slow"
                >
                  Sign-up Free
                </Button>
              </Link>
            </div>
            {/* Clickable backdrop */}
            <div
              className="flex-1"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              tabIndex={-1}
            />
          </div>
        )}
      </nav>
      {/* Enhanced slide-in animation for mobile menu */}
      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </header>
  );
}