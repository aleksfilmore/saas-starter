"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { ArrowLeft, Brain, MessageCircle, Mic, Settings } from 'lucide-react';

export default function AITherapyPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              🧠 AI Therapy
            </h1>
            <p className="text-xl text-purple-400">
              Advanced emotional AI companion
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/80 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Brain className="h-6 w-6 mr-2 text-green-400" />
                AI Therapy Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Chat Interface */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-700/50 border border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Text Chat</h3>
                    <p className="text-gray-300 mb-4">Start a conversation with your AI therapist</p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Start Chat Session
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700/50 border border-blue-500/30">
                  <CardContent className="p-6 text-center">
                    <Mic className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Voice Session</h3>
                    <p className="text-gray-300 mb-4">Talk directly with voice AI therapy</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Start Voice Call
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Settings */}
              <Card className="bg-gray-700/50 border border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-6 w-6 text-purple-400" />
                      <div>
                        <h3 className="font-bold text-white">Therapy Settings</h3>
                        <p className="text-sm text-gray-400">Customize your AI therapy experience</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-purple-500 text-purple-400">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </CardContent>
          </Card>
        </div>

      </div>
    </AuthWrapper>
  );
}
