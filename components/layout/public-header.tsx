"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  return (
    <header className="absolute top-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between">
          <div className="flex items-center">
            {/* Use custom palette for "BLOCK" */}
            <Link href="/" className="text-2xl font-bold text-foreground">
              CTRL+ALT+<span className="text-primary">BLOCK</span>
            </Link>
          </div>
          <div className="ml-10 space-x-4 flex items-center">
            <Link href="/sign-in" passHref>
              <Button variant="ghost" className="text-base font-medium text-foreground hover:text-muted-foreground">
                Log In
              </Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button className="text-base font-medium bg-primary text-primary-foreground hover:bg-primary/80">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}