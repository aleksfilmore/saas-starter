"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Clock, Eye, 
  Heart, Share2, BookOpen, ArrowRight, Brain
} from 'lucide-react';

export default function RewireBrainArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
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
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text">
            Science-Backed Ways to Rewire Your Brain for Love Again
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6 font-mono gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              CTRL+ALT+BLOCK
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              August 5, 2025
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              7 min read
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              2.8k views
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 relative overflow-hidden rounded-lg">
          <div className="aspect-square relative overflow-hidden">
            <img 
              src="/Science-Backed Ways to Rewire Your Brain for Love Again.png" 
              alt="Science-Backed Ways to Rewire Your Brain for Love Again"
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
              After a breakup, it's not just your heart that aches — your brain goes through withdrawal. The good news? Thanks to <strong className="text-purple-300">neuroplasticity</strong>, you can <strong className="text-purple-300">rewire your brain for love again</strong>. Science shows that with targeted habits, your mind can literally reprogram itself to trust, feel joy, and open up to connection again.
            </div>

            {/* Section 1 */}
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
                  <Brain className="h-8 w-8 mr-3 text-purple-400" />
                  Understand the Science of Heartbreak
                </h2>
                <p className="text-gray-300 mb-4">
                  Breakups activate the same neural pathways as physical pain. That's why you feel it in your chest. By knowing it's a brain response — not proof you're "broken" — you take the first step toward change.
                </p>
                <div className="bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-400">
                  <strong className="text-purple-300">Brain Fact:</strong> The anterior cingulate cortex and right ventral prefrontal cortex light up during emotional pain, just like physical injury.
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="bg-gray-800/50 border-blue-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">
                  Reset Your Reward System
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-red-300 font-semibold">The problem:</p>
                    <p className="text-gray-300">Your brain's dopamine circuits are hooked on your ex.</p>
                  </div>
                  <div>
                    <p className="text-green-300 font-semibold">The fix:</p>
                    <p className="text-gray-300">Engage in activities that trigger healthy dopamine — exercise, learning, social connection.</p>
                  </div>
                  <div className="bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-400">
                    <strong className="text-blue-300">Science says:</strong> A 2017 study in Frontiers in Psychology showed novelty-based activities improve emotional resilience.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="bg-gray-800/50 border-green-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-green-300 mb-4">
                  Use Cognitive Reframing
                </h2>
                <p className="text-gray-300 mb-4">
                  Your brain will cling to the highlight reel of your relationship. Cognitive reframing helps shift perspective.
                </p>
                <div className="bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400">
                  <strong className="text-green-300">How:</strong> When you think "I lost the best thing in my life," reframe it as "I'm making space for something healthier."
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="bg-gray-800/50 border-yellow-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                  Practice Gratitude With Specificity
                </h2>
                <p className="text-gray-300 mb-4">
                  Vague gratitude lists don't cut it — specificity makes it stick.
                </p>
                <div className="bg-yellow-900/30 p-4 rounded-lg border-l-4 border-yellow-400">
                  <strong className="text-yellow-300">Example:</strong> Instead of "I'm grateful for my friends," write "I'm grateful for how Sam texts me funny memes at night."
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="bg-gray-800/50 border-pink-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-pink-300 mb-4">
                  Anchor New Emotional Associations
                </h2>
                <p className="text-gray-300 mb-4">
                  Pair positive emotions with new experiences so your brain stops linking joy only to your ex. This is called "counter-conditioning."
                </p>
                <div className="bg-pink-900/30 p-4 rounded-lg border-l-4 border-pink-400">
                  <strong className="text-pink-300">Example:</strong> Try your favorite café but with a friend instead of your ex.
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="bg-gray-800/50 border-indigo-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-indigo-300 mb-4">
                  Meditate for Neural Flexibility
                </h2>
                <p className="text-gray-300 mb-4">
                  Mindfulness meditation increases grey matter in the prefrontal cortex, which helps regulate emotions and decision-making. Just 10 minutes a day can make you less reactive and more open to new love.
                </p>
                <div className="bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-400">
                  <strong className="text-indigo-300">Research:</strong> UCLA studies show 8 weeks of meditation literally changes brain structure for emotional regulation.
                </div>
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Your Brain is Wired to Adapt</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your brain is wired to adapt. With consistent action, you can <strong className="text-purple-300">rewire your brain for love again</strong> — not to erase the past, but to open the door to a future where love feels safe, exciting, and right. Every small step you take is literally reshaping your neural pathways toward healing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Article Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-gray-600 pt-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400">
              <Heart className="h-4 w-4 mr-2" />
              Helpful
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <Link href="/blog">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              More Articles
            </Button>
          </Link>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-6">Continue Your Healing Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-colors">
              <CardContent className="p-6">
                <div className="text-purple-300 text-sm font-mono mb-2">HEALING.EXE</div>
                <h4 className="text-white font-bold mb-2">The 7 Stages of Breakup Healing</h4>
                <p className="text-gray-400 text-sm mb-4">Learn the psychological stages and how to move through them faster.</p>
                <Link href="/blog/7-stages-breakup-healing">
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white p-0">
                    Read Article <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-colors">
              <CardContent className="p-6">
                <div className="text-purple-300 text-sm font-mono mb-2">HEALING.EXE</div>
                <h4 className="text-white font-bold mb-2">How to Spot Emotional Relapses During Recovery</h4>
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
