"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribeSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/90 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Unsubscribed Successfully
            </h1>
            <p className="text-gray-300">
              You won't receive daily email reminders anymore.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              You can always re-enable email notifications in your account settings.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Return to Dashboard
                </Button>
              </Link>
              
              <Link href="/settings">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Preferences
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              We respect your inbox. Your healing journey continues with or without reminders.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
