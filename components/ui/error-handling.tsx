"use client";

import { useState, useEffect } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export function useErrorHandling() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncOperation = async <T,>(
    operation: () => Promise<T>,
    errorMessage = "Something went wrong. Please try again."
  ): Promise<T | null> => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await operation();
      return result;
    } catch (err) {
      console.error('Operation failed:', err);
      setError(err instanceof Error ? err.message : errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    error,
    isLoading,
    handleAsyncOperation,
    clearError
  };
}

export function LoadingSpinner({ 
  size = 'default', 
  message = 'Loading...' 
}: { 
  size?: 'small' | 'default' | 'large';
  message?: string;
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div 
        className={`${sizeClasses[size]} border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin`}
      />
      <span className="text-gray-400 font-medium">{message}</span>
    </div>
  );
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss 
}: { 
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 space-y-3">
      <div className="flex items-start space-x-3">
        <div className="text-red-400 text-xl">⚠️</div>
        <div className="flex-1">
          <h4 className="text-red-400 font-bold mb-1">Something went wrong</h4>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            Try Again
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white text-center py-2 z-50">
      <span className="text-sm font-medium">
        🔌 You're offline. Some features may not work until reconnected.
      </span>
    </div>
  );
}
