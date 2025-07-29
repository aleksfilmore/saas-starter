"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="CTRL+ALT+BLOCK Home"
            className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-foreground select-none hover:no-underline focus:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary outline-none mr-4"
          >
            CTRL
            <span className="text-base font-normal text-foreground/60">+</span>
            ALT
            <span className="text-base font-normal text-foreground/60">+</span>
            <span className="text-primary">BLOCK</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-x-6">
            <Link
              href="/pricing"
              className="text-base font-medium text-foreground hover:text-primary transition"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-base font-medium text-foreground hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              href="/sign-in"
              className="text-base font-medium text-foreground hover:text-primary transition px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-primary"
            >
              Log In
            </Link>
            <Link href="/sign-up">
              <Button
                type="button"
                className="text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/80 rounded-full px-5 py-2 shadow"
              >
                Sign Up
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
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex">
            <div className="bg-card w-64 h-full shadow-xl flex flex-col p-6 gap-4 animate-slide-in-left">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  aria-label="CTRL+ALT+BLOCK Home"
                  className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-foreground select-none hover:no-underline focus:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CTRL
                  <span className="text-base font-normal text-foreground/60">+</span>
                  ALT
                  <span className="text-base font-normal text-foreground/60">+</span>
                  <span className="text-primary">BLOCK</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-2xl">&times;</span>
                </Button>
              </div>
              <Link
                href="/pricing"
                className="text-base font-medium text-foreground hover:text-primary transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className="text-base font-medium text-foreground hover:text-primary transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/sign-in"
                className="text-base font-medium text-foreground hover:text-primary transition py-2 rounded focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  type="button"
                  className="w-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/80 rounded-full px-5 py-2 shadow mt-2"
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
      {/* Simple slide-in animation for mobile menu */}
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
          animation: slide-in-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </header>
  );
}