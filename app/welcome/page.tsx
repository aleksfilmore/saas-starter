'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, ArrowRight, Info } from 'lucide-react';

interface ArchetypeDetails {
  type: string;
  subtitle: string;
  description: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
}

interface User {
  id: string;
  email: string;
  archetype: string;
  archetype_details: ArchetypeDetails;
  ux_stage: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        router.push('/sign-in');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        
        // If user doesn't have archetype data, redirect to scan
        if (!userData.user.archetype) {
          router.push('/scan');
          return;
        }
      } else {
        router.push('/sign-in');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      router.push('/sign-in');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchFirstRitual = async () => {
    setIsLaunching(true);
    
    try {
      // Update user's UX stage to 'starter'
      const token = localStorage.getItem('auth-token');
      await fetch('/api/auth/update-stage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ux_stage: 'starter' })
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update user stage:', error);
      // Continue anyway
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.archetype_details) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No scan results found.</p>
          <Button onClick={() => router.push('/scan')}>
            Take the Scan
          </Button>
        </div>
      </div>
    );
  }

  const archetype = user.archetype_details;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              System Scan Complete
            </h1>
          </div>
          <p className="text-gray-600">
            Your personalized healing journey starts now
          </p>
        </div>

        {/* Archetype Card */}
        <Card className="mb-8 border-2 border-purple-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-4xl font-bold mb-2">
              {archetype.type}
            </CardTitle>
            <p className="text-purple-100 text-lg">
              {archetype.subtitle}
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {archetype.description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Core Traits */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Core Traits
                </h3>
                <ul className="space-y-2">
                  {archetype.traits.map((trait, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Strengths
                </h3>
                <div className="space-y-2">
                  {archetype.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="block text-sm py-2 px-3 bg-green-100 text-green-800">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  Growth Areas
                </h3>
                <div className="space-y-2">
                  {archetype.challenges.map((challenge, index) => (
                    <Badge key={index} variant="outline" className="block text-sm py-2 px-3 border-blue-200 text-blue-700">
                      {challenge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Ready to begin your transformation?
                </h3>
                <p className="text-gray-600 mb-4">
                  We've prepared personalized daily rituals based on your {archetype.type} archetype.
                </p>
                <Button 
                  onClick={handleLaunchFirstRitual}
                  disabled={isLaunching}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                >
                  {isLaunching ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Launching...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Launch First Ritual
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </Button>
              </div>
              
              <button 
                onClick={() => window.open('https://example.com/archetype-guide', '_blank')}
                className="text-purple-600 hover:text-purple-700 text-sm underline"
              >
                What does this mean? Learn more about attachment styles →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
