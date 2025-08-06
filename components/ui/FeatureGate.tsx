'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';

interface FeatureGateProps {
  stage: 'starter' | 'core' | 'power';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export default function FeatureGate({ 
  stage, 
  children, 
  fallback = null,
  showUpgrade = false 
}: FeatureGateProps) {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return fallback;
  }

  if (!data) {
    return fallback;
  }

  // Define stage hierarchy
  const stageHierarchy = {
    starter: 0,
    core: 1,
    power: 2
  };

  const userStageLevel = stageHierarchy[data.ux_stage];
  const requiredStageLevel = stageHierarchy[stage];

  // User has access if their stage level is >= required stage level
  const hasAccess = userStageLevel >= requiredStageLevel;

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show upgrade prompt if requested
  if (showUpgrade) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="bg-gray-900/90 border border-purple-500/50 rounded-lg p-4 text-center max-w-xs">
            <div className="text-yellow-400 text-2xl mb-2">🔒</div>
            <h3 className="text-white font-semibold mb-1">
              {stage === 'core' ? 'Core Feature' : 'Power Feature'}
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {stage === 'core' 
                ? 'Unlock at Day 5 or 50 XP'
                : 'Unlock at Day 14 or with subscription'
              }
            </p>
            <div className="text-xs text-purple-400">
              Keep healing to unlock!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return fallback;
}
