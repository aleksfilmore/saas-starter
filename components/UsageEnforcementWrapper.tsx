/**
 * Usage Enforcement Wrapper Component
 * Provides FUP enforcement and anti-gaming protection for actions
 */

import React, { useState, useCallback } from 'react';
import { AlertTriangle, Shield, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UsageEnforcementWrapperProps {
  action: string;
  children: React.ReactNode;
  onAction?: () => void | Promise<void>;
  context?: any;
  fallbackContent?: React.ReactNode;
  showUsageInfo?: boolean;
}

interface PermissionResult {
  allowed: boolean;
  reason?: string;
  enforcement_action?: string;
  current_usage?: Record<string, number>;
  limits?: Record<string, number>;
}

export default function UsageEnforcementWrapper({
  action,
  children,
  onAction,
  context,
  fallbackContent,
  showUsageInfo = false
}: UsageEnforcementWrapperProps) {
  const [permission, setPermission] = useState<PermissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkPermission = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/enforcement/fup-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'user@example.com' // Replace with actual user email
        },
        body: JSON.stringify({ action, context })
      });

      if (!response.ok) {
        throw new Error('Permission check failed');
      }

      const result = await response.json();
      setPermission(result);
      setChecked(true);
    } catch (error) {
      console.error('Error checking permission:', error);
      setPermission({
        allowed: false,
        reason: 'Unable to verify permissions. Please try again.',
        enforcement_action: 'block'
      });
      setChecked(true);
    } finally {
      setLoading(false);
    }
  }, [action, context]);

  const handleAction = useCallback(async () => {
    if (!checked) {
      await checkPermission();
      return;
    }

    if (permission?.allowed && onAction) {
      await onAction();
    }
  }, [checked, permission, onAction, checkPermission]);

  // Auto-check permission on mount if onAction is provided
  React.useEffect(() => {
    if (onAction && !checked) {
      checkPermission();
    }
  }, [onAction, checked, checkPermission]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Checking permissions...</span>
      </div>
    );
  }

  // Permission denied state
  if (checked && !permission?.allowed) {
    const isBlockedByLimit = permission?.enforcement_action === 'block';
    
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-red-700">
            {isBlockedByLimit ? (
              <Clock className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {isBlockedByLimit ? 'Usage Limit Reached' : 'Action Blocked'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{permission?.reason}</p>
          
          {showUsageInfo && permission?.current_usage && permission?.limits && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Current Usage:</h4>
              {Object.entries(permission.current_usage).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-gray-900">
                      {value} / {permission.limits?.[key]}
                    </span>
                  </div>
                  <Progress 
                    value={(value / (permission.limits?.[key] || 1)) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          )}
          
          {fallbackContent && (
            <div className="mt-4 pt-4 border-t border-red-200">
              {fallbackContent}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Permission granted - show original content
  if (checked && permission?.allowed) {
    return (
      <div>
        {children}
        {showUsageInfo && permission?.current_usage && permission?.limits && (
          <Card className="mt-4 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Shield className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">
                  Fair Usage Status
                </span>
                <Badge className="ml-auto bg-green-100 text-green-700">
                  Within Limits
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(permission.current_usage).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-gray-900">
                      {value}/{permission.limits?.[key]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Not checked yet and no auto-check - show trigger button
  return (
    <div className="space-y-4">
      <Button 
        onClick={handleAction} 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Checking...' : 'Check Permissions & Proceed'}
      </Button>
      
      {showUsageInfo && (
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Shield className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">
                Fair usage policies apply to this action
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Your usage will be checked before proceeding to ensure compliance with platform limits.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper component for displaying usage warnings
export function UsageWarning({ 
  warnings 
}: { 
  warnings: Array<{ type: string; feature: string; percentage: number; message: string }> 
}) {
  if (warnings.length === 0) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-2">Usage Warnings</h4>
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <div key={index} className="text-sm text-yellow-700">
                  <div className="flex justify-between items-center mb-1">
                    <span>{warning.message}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(warning.percentage)}%
                    </Badge>
                  </div>
                  <Progress value={warning.percentage} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Example usage patterns for different actions
export const ENFORCEMENT_ACTIONS = {
  COMPLETE_RITUAL: 'complete_ritual',
  START_AI_THERAPY: 'start_ai_therapy',
  CREATE_JOURNAL: 'create_journal',
  VOICE_MESSAGE: 'voice_message',
  WALL_POST: 'wall_post'
} as const;
