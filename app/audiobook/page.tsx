'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AudiobookPlayer from '@/components/shop/AudiobookPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Lock, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface AudioTrack {
  id: string;
  title: string;
  file: string;
  duration?: string;
  type: 'chapter' | 'bonus' | 'extra';
  chapterNumber?: number;
}

const AUDIOBOOK_TRACKS: AudioTrack[] = [
  { id: 'opening', title: 'Opening Credits', file: '01_Opening+Credits.mp3', type: 'extra' },
  { id: 'dedication', title: 'Dedication & Disclaimer', file: '02_DEDICATION+&+DISCLAIMER.mp3', type: 'extra' },
  { id: 'ch1', title: 'The Red Flag Parade', file: '03_CHAPTER+1+-+THE+RED+FLAG+PARADE.mp3', type: 'chapter', chapterNumber: 1 },
  { id: 'ch2', title: 'The Gambler', file: '04_CHAPTER+2+-+THE+GAMBLER.mp3', type: 'chapter', chapterNumber: 2 },
  { id: 'ch3', title: 'The Ghoster', file: '05_CHAPTER+3+-+THE+GHOSTER.mp3', type: 'chapter', chapterNumber: 3 },
  { id: 'ch4', title: 'The Party Animal', file: '06_CHAPTER+4-+THE+PARTY+ANIMAL.mp3', type: 'chapter', chapterNumber: 4 },
  { id: 'ch5', title: 'The Pet Obsessed', file: '07_CHAPTER+5+-+THE+PET+OBSSESED.mp3', type: 'chapter', chapterNumber: 5 },
  { id: 'ch6', title: 'The Crier', file: '08_CHAPTER+6+-++THE+CRIER.mp3', type: 'chapter', chapterNumber: 6 },
  { id: 'ch7', title: 'The Liar', file: '09_CHAPTER+7+-+THE+LIAR.mp3', type: 'chapter', chapterNumber: 7 },
  { id: 'ch8', title: 'The Kinkster', file: '10_CHAPTER+8+-+THE+KINKSTER.mp3', type: 'chapter', chapterNumber: 8 },
  { id: 'ch9', title: 'The Human Sloth', file: '11_CHAPTER+9+-+THE+HUMAN+SLOTH.mp3', type: 'chapter', chapterNumber: 9 },
  { id: 'ch10', title: 'The Competitive', file: '12_CHAPTER+10+-+THE+COMPETITIVE.mp3', type: 'chapter', chapterNumber: 10 },
  { id: 'ch11', title: 'The Planner', file: '13_CHAPTER+11+-+THE+PLANNER.mp3', type: 'chapter', chapterNumber: 11 },
  { id: 'ch12', title: 'The Hoarder', file: '14_CHAPTER+12+-+THE+HOARDER.mp3', type: 'chapter', chapterNumber: 12 },
  { id: 'ch13', title: 'The Narcissist', file: '15_CHAPTER+13+-+THE+NARCISSIST.mp3', type: 'chapter', chapterNumber: 13 },
  { id: 'ch14', title: 'The Late One', file: '16_CHAPTER+14+-+THE+LATE+ONE.mp3', type: 'chapter', chapterNumber: 14 },
  { id: 'ch15', title: "The Mother's Boy", file: '17_CHAPTER+15+-+THE+MOTHER\'S+BOY.mp3', type: 'chapter', chapterNumber: 15 },
  { id: 'ch16', title: 'The Conspiracist', file: '18_CHAPTER+16+-+THE+CONSPIRACIST.mp3', type: 'chapter', chapterNumber: 16 },
  { id: 'ch17', title: 'The Wizard', file: '19_CHAPTER+17+-+THE+WIZARD.mp3', type: 'chapter', chapterNumber: 17 },
  { id: 'ch18', title: 'The Woman', file: '20_CHAPTER+18+-+THE+WOMAN.mp3', type: 'chapter', chapterNumber: 18 },
  { id: 'ch19', title: 'The Complainer', file: '21_CHAPTER+19+-+THE+COMPLAINER.mp3', type: 'chapter', chapterNumber: 19 },
  { id: 'ch20', title: 'The Fitness Fanatic', file: '22_CHAPTER+20+-+THE+FITNESS+FANATIC.mp3', type: 'chapter', chapterNumber: 20 },
  { id: 'ch21', title: 'The Apologizer', file: '23_CHAPTER+21+-+THE+APOLOGIZER.mp3', type: 'chapter', chapterNumber: 21 },
  { id: 'ch22', title: 'The Revenge-Seeker', file: '24_CHAPTER+22+-+THE+REVENGE-SEEKER.mp3', type: 'chapter', chapterNumber: 22 },
  { id: 'ch23', title: 'The Polyamorist', file: '25_CHAPTER+23+-+THE+POLYAMORIST.mp3', type: 'chapter', chapterNumber: 23 },
  { id: 'ch24', title: 'The Astrologist', file: '26_CHAPTER+24+-+THE+ASTROLOGIST.mp3', type: 'chapter', chapterNumber: 24 },
  { id: 'ch25', title: 'The Perfectionist', file: '27_CHAPTER+25++-+THE+PERFECTIONIST.mp3', type: 'chapter', chapterNumber: 25 },
  { id: 'ch26', title: 'The One Who Got Away', file: '28_CHAPTER+26+-+THE+ONE+WHO+GOT+AWAY.mp3', type: 'chapter', chapterNumber: 26 },
  { id: 'ch27', title: 'Epilogue', file: '29_CHAPTER+27+-+EPILOGUE.mp3', type: 'chapter', chapterNumber: 27 },
  { id: 'reviews', title: 'Reviews', file: '30_Reviews.mp3', type: 'extra' },
  { id: 'cta', title: 'Call to Action', file: '31_CTA.mp3', type: 'extra' },
  { id: 'credits', title: 'Ending Credits', file: '32_Ending+Credits.mp3', type: 'extra' },
  { id: 'bonus', title: 'The Straight (Bonus Chapter)', file: '33_BONUS+CHAPTER+-+THE+STRAIGHT.mp3', type: 'bonus' }
];

export default function AudiobookPage() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listeningProgress, setListeningProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    checkAccess();
    loadProgress();
  }, [user]);

  const checkAccess = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/shop/products');
      const data = await response.json();
      
      const audiobook = data.products?.find((p: any) => p.id === 'audiobook_worst_boyfriends');
      setHasAccess(audiobook?.userOwns || false);
    } catch (error) {
      console.error('Error checking access:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/audiobook/progress');
      if (response.ok) {
        const data = await response.json();
        setListeningProgress(data.progress || {});
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleTrackComplete = async (trackId: string) => {
    if (!user) return;

    try {
      await fetch('/api/audiobook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, completed: true })
      });

      setListeningProgress(prev => ({
        ...prev,
        [trackId]: true
      }));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading audiobook...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your audiobook library.
            </p>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Preview/Purchase Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src="/TWBE/THE WORST BOYFRIENDS EVER AUDIOBOOK.png" 
                  alt="The Worst Boyfriends Ever Audiobook"
                  className="w-48 h-48 rounded-lg shadow-lg mx-auto md:mx-0"
                />
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-4">The Worst Boyfriends Ever</CardTitle>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        6+ Hours
                      </Badge>
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        27 Chapters + Bonus
                      </Badge>
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Narrated by Author
                      </Badge>
                    </div>
                    
                    <p className="text-lg text-muted-foreground">
                      A hilarious and insightful journey through the dating disasters we've all survived. 
                      Narrated by the author, this audiobook will have you laughing, crying, and most importantly, healing.
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-semibold">What you'll get:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✅ 27 full chapters of dating disasters</li>
                        <li>✅ Exclusive bonus chapter "The Straight"</li>
                        <li>✅ Author narration with personal insights</li>
                        <li>✅ Stream on any device, anytime</li>
                        <li>✅ Lifetime access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold">$8.99</div>
                  <div className="text-sm text-muted-foreground">or 899 Bytes</div>
                </div>
                <Button asChild className="flex-1 sm:flex-none">
                  <Link href="/shop" className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase Audiobook
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample Tracks */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AUDIOBOOK_TRACKS.slice(0, 3).map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{track.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {track.type === 'chapter' ? `Chapter ${track.chapterNumber}` : 'Preview'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Audiobook Library</h1>
        <p className="text-muted-foreground">
          Welcome back! Resume where you left off or start a new chapter.
        </p>
      </div>

      <AudiobookPlayer
        bookTitle="The Worst Boyfriends Ever"
        coverImage="/TWBE/THE WORST BOYFRIENDS EVER AUDIOBOOK.png"
        tracks={AUDIOBOOK_TRACKS}
        onTrackComplete={handleTrackComplete}
      />

      {/* Progress Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Object.keys(listeningProgress).length}
              </div>
              <div className="text-sm text-muted-foreground">Tracks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round((Object.keys(listeningProgress).length / AUDIOBOOK_TRACKS.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {AUDIOBOOK_TRACKS.filter(t => t.type === 'chapter').filter(t => listeningProgress[t.id]).length}
              </div>
              <div className="text-sm text-muted-foreground">Chapters Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
