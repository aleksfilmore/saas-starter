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
          <Link
            href="/"
            aria-label="CTRL+ALT+BLOCK Home"
            className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-foreground select-none hover:no-underline focus:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary outline-none mr-4 group"
          >
            <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">CTRL</span>
            <span className="text-base font-normal text-muted-foreground group-hover:text-primary transition-colors">+</span>
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">ALT</span>
            <span className="text-base font-normal text-muted-foreground group-hover:text-primary transition-colors">+</span>
            <span className="bg-gradient-to-r from-primary to-glitch-pink bg-clip-text text-transparent group-hover:animate-pulse">BLOCK</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-x-6">
            <Link
              href="/pricing"
              className="text-base font-medium text-foreground hover:text-primary transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-base font-medium text-foreground hover:text-accent transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-accent/10"
            >
              Dashboard
            </Link>
            <Link
              href="/sign-in"
              className="text-base font-medium text-foreground hover:text-secondary transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-secondary/10 focus-visible:ring-2 focus-visible:ring-primary"
            >
              Log In
            </Link>
            <Link href="/sign-up">
              <Button
                type="button"
                className="text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white rounded-xl px-6 py-3 shadow-neon-pink hover:shadow-neon-pink/80 transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Sign Up
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
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
                  className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-foreground select-none hover:no-underline focus:no-underline focus-visible:outline-2 focus-visible:outline-primary outline-none group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">CTRL</span>
                  <span className="text-base font-normal text-muted-foreground">+</span>
                  <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">ALT</span>
                  <span className="text-base font-normal text-muted-foreground">+</span>
                  <span className="bg-gradient-to-r from-primary to-glitch-pink bg-clip-text text-transparent">BLOCK</span>
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
                href="/pricing"
                className="text-base font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className="text-base font-medium text-foreground hover:text-accent transition-colors py-3 px-4 rounded-lg hover:bg-accent/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/sign-in"
                className="text-base font-medium text-foreground hover:text-secondary transition-colors py-3 px-4 rounded-lg hover:bg-secondary/10 focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  type="button"
                  className="w-full text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white rounded-xl px-6 py-3 shadow-neon-pink hover:shadow-neon-pink/80 transition-all duration-300 mt-2"
                >
                  Sign Up
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