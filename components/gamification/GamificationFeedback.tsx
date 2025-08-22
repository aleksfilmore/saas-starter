'use client';

// Enhanced Gamification Visual Feedback
// Animated bytes rewards, badge unlock modals

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Trophy, 
  Star, 
  Zap, 
  Crown,
  X,
  Share2,
  Download
} from 'lucide-react';

interface BadgeUnlockProps {
  show: boolean;
  badge: {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onClose: () => void;
  onShare?: () => void;
}

interface BytesConfettiProps {
  show: boolean;
  amount: number;
  onComplete: () => void;
}

interface AchievementCelebrationProps {
  show: boolean;
  achievement: {
    id: string;
    title: string;
    description: string;
    bytesValue: number;
    rarity: string;
  };
  onClose: () => void;
}

// Bytes Confetti Animation Component
export function BytesConfetti({ show, amount, onComplete }: BytesConfettiProps) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: Math.min(amount / 10, 20) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, amount, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0.5],
              y: [-20, -60, -100],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Bytes Text Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0, y: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.8], y: [0, -50, -100] }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="text-4xl font-bold text-blue-400 drop-shadow-lg">
          +{amount} Bytes
        </div>
      </motion.div>
    </div>
  );
}


// Badge Unlock Modal
export function BadgeUnlockModal({ show, badge, onClose, onShare }: BadgeUnlockProps) {
  if (!show) return null;

  const rarityColors = {
    common: 'from-gray-600 to-gray-800 border-gray-500',
    rare: 'from-blue-600 to-blue-800 border-blue-500',
    epic: 'from-purple-600 to-purple-800 border-purple-500',
    legendary: 'from-yellow-600 to-orange-800 border-yellow-500'
  };

  const rarityGlow = {
    common: 'shadow-gray-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-yellow-500/50'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 50 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <Card className={`w-96 bg-gradient-to-br ${rarityColors[badge.rarity]} border-2 relative overflow-hidden shadow-2xl ${rarityGlow[badge.rarity]}`}>
            {/* Badge Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse`} />
            
            <CardContent className="p-8 text-center relative z-10">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <motion.div
                className="mb-6"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotateY: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <div className="text-6xl mb-4">{badge.icon}</div>
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Badge Unlocked!
              </h2>
              
              <h3 className="text-xl text-yellow-400 font-semibold mb-2">
                {badge.title}
              </h3>
              
              <p className="text-gray-300 mb-4">
                {badge.description}
              </p>

              <Badge className={`bg-${badge.rarity === 'legendary' ? 'yellow' : badge.rarity === 'epic' ? 'purple' : badge.rarity === 'rare' ? 'blue' : 'gray'}-500/20 text-${badge.rarity === 'legendary' ? 'yellow' : badge.rarity === 'epic' ? 'purple' : badge.rarity === 'rare' ? 'blue' : 'gray'}-400 border-${badge.rarity === 'legendary' ? 'yellow' : badge.rarity === 'epic' ? 'purple' : badge.rarity === 'rare' ? 'blue' : 'gray'}-500/50 text-lg px-4 py-2 mb-6`}>
                <Star className="h-4 w-4 mr-2" />
                {badge.rarity.toUpperCase()}
              </Badge>
              
              <div className="flex gap-2 justify-center">
                {onShare && (
                  <Button variant="outline" onClick={onShare} className="border-gray-600 hover:bg-gray-800">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Achievement
                  </Button>
                )}
                <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Achievement Celebration Component
export function AchievementCelebration({ show, achievement, onClose }: AchievementCelebrationProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 45 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
        >
          <Card className="w-96 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 border-2 border-green-500/50 relative overflow-hidden">
            {/* Celebration Particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -50, -100]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              ))}
            </div>

            <CardContent className="p-8 text-center relative z-10">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <motion.div
                className="mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotateZ: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <Trophy className="h-16 w-16 text-green-400 mx-auto mb-4" />
              </motion.div>

              <h2 className="text-3xl font-bold text-green-400 mb-2">
                Achievement Unlocked!
              </h2>
              
              <h3 className="text-xl text-white font-semibold mb-2">
                {achievement.title}
              </h3>
              
              <p className="text-gray-300 mb-4">
                {achievement.description}
              </p>

              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-lg px-4 py-2 mb-6">
                <Zap className="h-4 w-4 mr-2" />
                +{achievement.bytesValue} Bytes
              </Badge>
              
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 w-full">
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Progress Ring with Animation
interface AnimatedProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function AnimatedProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = "#10b981", 
  backgroundColor = "#374151",
  children 
}: AnimatedProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
