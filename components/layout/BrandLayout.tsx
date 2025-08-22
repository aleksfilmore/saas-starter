import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface BrandLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showParticles?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  className?: string;
}

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{left: string, animationDelay: string, animationDuration: string, className: string}>>([]);
  
  // Initialize particles on client side only to avoid hydration mismatch
  useEffect(() => {
    const particleTypes = ['particle-purple', 'particle-pink', 'particle-blue', 'particle-green'];
    const newParticles = [...Array(15)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
      className: particleTypes[i % 4]
    }));
    setParticles(newParticles);
  }, []);
  
  return (
    <div className="particle-system">
      {particles.map((particle, i) => (
        <div
          key={i}
          className={`particle ${particle.className}`}
          style={{
            left: particle.left,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration
          }}
        />
      ))}
    </div>
  );
};

export function BrandLayout({ 
  children, 
  showHeader = true, 
  showParticles = true,
  headerTitle,
  headerSubtitle,
  className = ""
}: BrandLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 ${className}`}>
      {showParticles && <FloatingParticles />}
      
      <div className="relative z-10">
        {showHeader && (
          <header className="w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
              <div className="flex items-center justify-between">
                <Link href="/admin" className="flex items-center space-x-4">
                  <div className="text-sm xs:text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight whitespace-nowrap">
                    <span>CTRL+ALT+</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 brand-glitch" data-text="BLOCK">BLOCK</span>
                  </div>
                </Link>
                
                {(headerTitle || headerSubtitle) && (
                  <div className="text-right">
                    {headerTitle && (
                      <h1 className="text-lg font-semibold text-brand-glow">{headerTitle}</h1>
                    )}
                    {headerSubtitle && (
                      <p className="text-sm text-gray-300">{headerSubtitle}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
        
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
