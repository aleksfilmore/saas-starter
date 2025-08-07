'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AITherapyCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="bg-zinc-900/90 border-red-500/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center"
            >
              <XCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Cancelled
            </h1>
            
            <p className="text-gray-300 mb-6">
              No worries! Your payment was cancelled and you haven't been charged.
            </p>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 mb-6 border border-blue-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-semibold">AI Therapy Messages</span>
              </div>
              <p className="text-sm text-gray-400">
                Get 300 messages for just $3.99 - start your healing journey anytime
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Try Payment Again
                <CreditCard className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Need help? Contact our support team anytime
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
