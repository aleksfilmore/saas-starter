"use client";
import React from 'react';

export const TileSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-white/20 rounded w-full" />
      ))}
    </div>
  );
};

export const TileError: React.FC<{ message?: string }> = ({ message }) => (
  <div className="text-[11px] text-red-200 bg-red-900/30 border border-red-500/30 rounded p-2">
    {message || 'Failed to load'}
  </div>
);

// Helper wrapper if needed in future
export const WithTileState: React.FC<{ loading?: boolean; error?: string | null; children: React.ReactNode; lines?: number }> = ({ loading, error, children, lines }) => {
  if (loading) return <TileSkeleton lines={lines} />;
  if (error) return <TileError message={error} />;
  return <>{children}</>;
};
