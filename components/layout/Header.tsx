import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  showAuthButtons?: boolean;
  backLink?: string;
  backText?: string;
}

export default function Header({ 
  showBackButton = false, 
  showAuthButtons = true, 
  backLink = "/", 
  backText = "Back to Home" 
}: HeaderProps) {
  return (
    <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white">
            <span>CTRL</span>
            <span className="text-gray-400">+</span>
            <span>ALT</span>
            <span className="text-gray-400">+</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {showBackButton && (
              <Link href={backLink}>
                <Button variant="ghost" className="text-white hover:text-purple-400 text-sm sm:text-base p-2 sm:p-3">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{backText}</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            )}
            
            {showAuthButtons && (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-white hover:text-purple-400 text-sm sm:text-base p-2 sm:p-3">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm sm:text-base p-2 sm:p-3">
                    <span className="hidden sm:inline">Start Healing</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
