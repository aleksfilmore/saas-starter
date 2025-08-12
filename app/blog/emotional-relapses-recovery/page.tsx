"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Clock, Eye, 
  Heart, Share2, BookOpen, ArrowRight, AlertTriangle, Shield
} from 'lucide-react';

export default function EmotionalRelapsesArticlePage() {
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
            How to Spot (and Stop) Emotional Relapses During Breakup Recovery
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6 font-mono gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              CTRL+ALT+BLOCK
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              July 28, 2025
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              6 min read
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              2.1k views
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 relative overflow-hidden rounded-lg">
          <div className="aspect-square relative overflow-hidden">
            <img 
              src="/How to Spot (and Stop) Emotional Relapses During Breakup Recovery.png" 
              alt="How to Spot (and Stop) Emotional Relapses During Breakup Recovery"
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
              <strong className="text-purple-300">Breakup recovery</strong> isn't a straight climb — it's more like hiking a steep trail with surprise dips. Even after weeks of progress, you might find yourself crying over old texts, stalking their Instagram, or fantasizing about "accidental" run-ins. This is an <strong className="text-purple-300">emotional relapse during breakup recovery</strong> — and it's common. The trick isn't avoiding them completely (you can't), but spotting them early and stopping the spiral before it derails your healing.
            </div>

            {/* Section 1 */}
            <Card className="bg-gray-800/50 border-red-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-red-300 mb-4 flex items-center">
                  <AlertTriangle className="h-8 w-8 mr-3 text-red-400" />
                  Know the Signs You're Slipping Back
                </h2>
                <p className="text-gray-300 mb-4">Common red flags:</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Re-reading old messages or looking through photos.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Suddenly idealizing your ex and forgetting their flaws.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Losing interest in routines or habits that were helping you heal.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Obsessively checking their online activity.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="bg-gray-800/50 border-blue-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">
                  Understand Why Relapses Happen
                </h2>
                <p className="text-gray-300 mb-4">
                  Your brain's reward system still links them to comfort, validation, or excitement. Stress, loneliness, or big life changes can trigger that wiring again.
                </p>
                <div className="bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-400">
                  <strong className="text-blue-300">Key insight:</strong> Recognizing this as a neurological echo — not proof you still belong together — is key.
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="bg-gray-800/50 border-green-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-green-300 mb-4 flex items-center">
                  <Shield className="h-8 w-8 mr-3 text-green-400" />
                  Create a Rapid-Response Plan
                </h2>
                <p className="text-gray-300 mb-4">When you feel the pull:</p>
                <div className="space-y-4">
                  <div className="bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400">
                    <strong className="text-green-300">Pause & Name It:</strong> Say to yourself, "This is a relapse trigger."
                  </div>
                  <div className="bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400">
                    <strong className="text-green-300">Replace the Action:</strong> If you want to check their social media, open a friend's profile instead.
                  </div>
                  <div className="bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400">
                    <strong className="text-green-300">Physical Shift:</strong> Move rooms, stand up, or get outside.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="bg-gray-800/50 border-yellow-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                  Use Accountability
                </h2>
                <p className="text-gray-300 mb-4">
                  Tell a trusted friend when you're in a vulnerable spot. Having someone check in can keep you from slipping deeper into old habits.
                </p>
                <div className="bg-yellow-900/30 p-4 rounded-lg border-l-4 border-yellow-400">
                  <strong className="text-yellow-300">Pro tip:</strong> Set up a "rescue text" with a friend — a simple code word that means "I need a distraction right now."
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-purple-300 mb-4">
                  Reflect Without Ruminating
                </h2>
                <p className="text-gray-300 mb-4">
                  If a relapse happens, don't beat yourself up. Ask:
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">?</span>
                    <span>What triggered this?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">?</span>
                    <span>What can I do differently next time?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">?</span>
                    <span>Which coping tool worked best?</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Relapses Are Opportunities</h2>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-purple-300">Emotional relapses during breakup recovery</strong> aren't proof you're failing — they're opportunities to reinforce your boundaries and coping skills. The more you practice spotting them, the quicker you'll bounce back, until they're just tiny bumps on the road to your healed self.
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
                <h4 className="text-white font-bold mb-2">Science-Backed Ways to Rewire Your Brain for Love Again</h4>
                <p className="text-gray-400 text-sm mb-4">Learn how neuroplasticity can help you heal and open up to connection again.</p>
                <Link href="/blog/rewire-brain-for-love">
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
