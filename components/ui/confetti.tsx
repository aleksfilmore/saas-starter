"use client";

import { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiBurstProps {
  trigger: boolean;
  origin?: { x: number; y: number };
  colors?: string[];
  particleCount?: number;
  duration?: number;
}

export function ConfettiBurst({ 
  trigger, 
  origin = { x: 50, y: 50 }, 
  colors = ['#F59E0B', '#14B8A6', '#8B5CF6', '#22C55E'],
  particleCount = 20,
  duration = 2000
}: ConfettiBurstProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      createConfettiBurst();
    }
  }, [trigger, isActive]);

  const createConfettiBurst = () => {
    setIsActive(true);
    const newParticles: ConfettiParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;
      
      newParticles.push({
        id: i,
        x: origin.x,
        y: origin.y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 4,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity - 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    setParticles(newParticles);

    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
      setIsActive(false);
    }, duration);
  };

  if (particles.length === 0) return null;

  return (
    <div className="confetti-burst" style={{ 
      left: 0, 
      top: 0, 
      width: '100vw', 
      height: '100vh' 
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            '--velocity-x': `${particle.velocityX * 20}px`,
            '--velocity-y': `${particle.velocityY * 20}px`,
            '--rotation': `${particle.rotation}deg`,
            '--rotation-speed': `${particle.rotationSpeed}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Achievement celebration component
export function AchievementCelebration({ 
  show, 
  title, 
  description, 
  onComplete 
}: {
  show: boolean;
  title: string;
  description: string;
  onComplete: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 3000);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <ConfettiBurst trigger={show} origin={{ x: 50, y: 30 }} />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-amber-200 max-w-md mx-4 text-center transform animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
          <p className="text-stone-600">{description}</p>
        </div>
      </div>
    </>
  );
}
