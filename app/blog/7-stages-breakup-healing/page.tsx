"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { safeClipboardCopy } from '@/lib/utils';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Clock, Eye, 
  Heart, Share2, BookOpen, ArrowRight, Bookmark
} from 'lucide-react';

export default function SevenStagesArticlePage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(47);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The 7 Stages of Breakup Healing',
          text: 'Breaking up isn\'t just losing a person — it\'s losing a whole rhythm of your life. Learn the psychological stages of healing.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await safeClipboardCopy(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="brand-container">
      {/* Floating particles for consistency */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/blog">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/blog" className="text-purple-300 border-purple-400/50 bg-purple-900/30 text-sm font-mono font-bold px-3 py-1 rounded-full border hover:border-purple-400 hover:bg-purple-900/50 transition-all">
              HEALING.EXE
            </Link>
            <span className="text-gray-400 text-sm ml-4">Featured Article</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text">
            The 7 Stages of Breakup Healing (And How to Move Through Them Faster)
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6 font-mono gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              CTRL+ALT+BLOCK
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              August 10, 2025
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              8 min read
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              3.4k views
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 relative overflow-hidden rounded-lg">
          <div className="aspect-square relative overflow-hidden">
            <img 
              src="/The 7 Stages of Breakup Healing.png" 
              alt="The 7 Stages of Breakup Healing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-blue-400"></div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed space-y-8">
            
            {/* Introduction */}
            <div className="text-xl leading-relaxed text-gray-200 border-l-4 border-purple-400 pl-6 bg-purple-900/20 rounded-r-lg py-4">
              Breaking up isn't just losing a person — it's losing a whole rhythm of your life. The pain can feel endless, but psychologists have mapped out the <strong className="text-purple-300">stages of healing after a breakup</strong>. And while every heart heals at its own pace, there are ways to move through these stages without getting stuck in emotional quicksand.
            </div>

            {/* Stage 1 */}
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Shock and Denial
                </h2>
                <p className="text-gray-300 mb-4">
                  That surreal, "is this really happening?" phase. Your brain struggles to process the loss, and part of you expects them to text back.
                </p>
                <div className="bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-400">
                  <strong className="text-purple-300">Quick tip to move faster:</strong> Reduce reminders — mute them on social media, hide photos, and remove triggers from daily view.
                </div>
              </CardContent>
            </Card>

            {/* Stage 2 */}
            <Card className="bg-gray-800/50 border-blue-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Pain and Yearning
                </h2>
                <p className="text-gray-300 mb-4">
                  The full weight of the loss hits. You might miss not just the person but the future you imagined with them.
                </p>
                <div className="bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-400">
                  <strong className="text-blue-300">Quick tip:</strong> Journal daily. Writing interrupts rumination loops and gives your emotions a safe outlet.
                </div>
              </CardContent>
            </Card>

            {/* Stage 3 */}
            <Card className="bg-gray-800/50 border-red-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-red-300 mb-4 flex items-center">
                  <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Anger and Resentment
                </h2>
                <p className="text-gray-300 mb-4">
                  Frustration replaces sadness. You replay the wrongs, real or imagined.
                </p>
                <div className="bg-red-900/30 p-4 rounded-lg border-l-4 border-red-400">
                  <strong className="text-red-300">Quick tip:</strong> Channel anger into physical activity — workouts, boxing, running. Burn it, don't bottle it.
                </div>
              </CardContent>
            </Card>

            {/* Stage 4 */}
            <Card className="bg-gray-800/50 border-yellow-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center">
                  <span className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Bargaining
                </h2>
                <p className="text-gray-300 mb-4">
                  You imagine "what if" scenarios or think of ways to fix things.
                </p>
                <div className="bg-yellow-900/30 p-4 rounded-lg border-l-4 border-yellow-400">
                  <strong className="text-yellow-300">Quick tip:</strong> Write a "Why We Broke Up" list to keep reality in view.
                </div>
              </CardContent>
            </Card>

            {/* Stage 5 */}
            <Card className="bg-gray-800/50 border-indigo-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-indigo-300 mb-4 flex items-center">
                  <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  Depression and Withdrawal
                </h2>
                <p className="text-gray-300 mb-4">
                  Low motivation, low energy, and an ache in your chest.
                </p>
                <div className="bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-400">
                  <strong className="text-indigo-300">Quick tip:</strong> Commit to micro-rituals — showering, short walks, eating nourishing food. These are the scaffolds of recovery.
                </div>
              </CardContent>
            </Card>

            {/* Stage 6 */}
            <Card className="bg-gray-800/50 border-green-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-green-300 mb-4 flex items-center">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                  Acceptance
                </h2>
                <p className="text-gray-300 mb-4">
                  The truth lands: it's over. You stop fighting reality and start making peace.
                </p>
                <div className="bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400">
                  <strong className="text-green-300">Quick tip:</strong> Create a "next chapter" vision board with places you want to go and goals unrelated to love.
                </div>
              </CardContent>
            </Card>

            {/* Stage 7 */}
            <Card className="bg-gray-800/50 border-pink-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-pink-300 mb-4 flex items-center">
                  <span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                  Growth and Reconnection
                </h2>
                <p className="text-gray-300 mb-4">
                  Life starts feeling full again. You realize you've built strength, self-respect, and clarity you didn't have before.
                </p>
                <div className="bg-pink-900/30 p-4 rounded-lg border-l-4 border-pink-400">
                  <strong className="text-pink-300">Quick tip:</strong> Lean into new connections and hobbies that support the version of you that's emerging.
                </div>
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">The Path Forward</h2>
                <p className="text-gray-300 leading-relaxed">
                  The <strong className="text-purple-300">breakup healing process</strong> isn't linear. You'll have days when you slide back a stage — that's normal. The goal isn't to erase the pain, but to navigate it with self-awareness and momentum. Every step forward, no matter how small, is proof you're moving toward the life that's waiting for you beyond this heartbreak.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Article Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-gray-600 pt-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {likeCount}
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-600"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
          <Link href="/blog">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              More Articles
            </Button>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Healing Journey?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Take our personalized breakup recovery quiz and get matched with the perfect healing tools for your situation.
          </p>
          <Link href="/quiz">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4">
              Start Your Healing Journey →
            </Button>
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            Personalized recommendations • Science-backed approach • Free to start
          </p>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-6">Continue Your Healing Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-colors">
              <CardContent className="p-6">
                <div className="text-purple-300 text-sm font-mono mb-2">HEALING.EXE</div>
                <h4 className="text-white font-bold mb-2">Science-Backed Ways to Rewire Your Brain for Love Again</h4>
                <p className="text-gray-400 text-sm mb-4">Learn how neuroplasticity can help you heal and open up to connection again.</p>
                <Link href="/blog/rewire-brain-for-love">
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white p-0">
                    Read Article <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-colors">
              <CardContent className="p-6">
                <div className="text-purple-300 text-sm font-mono mb-2">HEALING.EXE</div>
                <h4 className="text-white font-bold mb-2">How to Spot (and Stop) Emotional Relapses During Recovery</h4>
                <p className="text-gray-400 text-sm mb-4">Recognize when you're sliding backward and get back on track quickly.</p>
                <Link href="/blog/emotional-relapses-recovery">
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white p-0">
                    Read Article <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
