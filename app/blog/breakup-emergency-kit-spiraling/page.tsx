'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Bookmark, Share2, Calendar, Clock, Eye, User } from 'lucide-react';

export default function BreakupEmergencyKitArticle() {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1288);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Breakup Emergency Kit: What to Do When You\'re Spiraling',
          text: 'Essential tools and strategies to stop an emotional spiral before it swallows you whole.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link href="/" className="text-xl font-bold">
            CTRL+ALT+<span className="text-purple-400">BLOCK</span>
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/blog?category=Tips"
            className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200"
          >
            Tips
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          The Breakup Emergency Kit: What to Do When You're Spiraling
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>CTRL+ALT+BLOCK</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>August 4, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>6 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>4.8k views</span>
          </div>
        </div>

        {/* Engagement Buttons */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-800">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                : 'border-gray-600 hover:border-red-500/50 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>
          
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              isSaved 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                : 'border-gray-600 hover:border-purple-500/50 hover:text-purple-400'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>Save</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img 
            src="/The Breakup Emergency Kit What to Do When You're Spiraling.png"
            alt="The Breakup Emergency Kit What to Do When You're Spiraling"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            One text, one sighting, or one late-night scroll can send you into an emotional freefall. When the spiral starts, you don't have time to think — you need instant, go-to tools. That's where a <strong>breakup emergency kit</strong> comes in.
          </p>

          <p className="mb-8">
            At CTRL+ALT+BLOCK, we've turned this concept into a digital-first survival pack with Daily Check-ins, No-Contact Streaks, Daily Rituals, AI Therapy, and the Wall of Wounds. Here's how to build yours so you can stop a spiral in its tracks.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">1. Grounding Tools</h2>
          
          <p className="mb-4">
            Your first priority is to stop the adrenaline rush.
          </p>

          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <h4 className="font-bold mb-3 text-cyan-400">Physical Grounding</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Ice pack on your neck</li>
              <li>• Barefoot on the floor</li>
              <li>• Holding something textured (stress ball, blanket, pet)</li>
              <li>• Cold water on your wrists</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6 mb-8">
            <h4 className="font-bold mb-3 text-cyan-400">Digital Grounding</h4>
            <p className="text-gray-300">
              Open your Daily Check-in and name your exact mood to anchor yourself in the present.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">2. Impulse Blockers</h2>
          
          <p className="mb-4">
            When you're spiraling, bad decisions are seconds away.
          </p>

          <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-6 mb-6">
            <h4 className="font-bold mb-3 text-red-400">Physical Blockers</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Put your phone in another room for 15 minutes</li>
              <li>• Remove your phone case (adds friction to unlocking)</li>
              <li>• Change your ex's contact to "DO NOT CALL"</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-6 mb-8">
            <h4 className="font-bold mb-3 text-red-400">Digital Blockers</h4>
            <p className="text-gray-300">
              Watch your No-Contact Streak counter instead of your ex's last-seen time. Your progress is more important than their activity.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">3. Mood Shifters</h2>
          
          <p className="mb-4">
            Get your brain off the loop by flooding it with new stimuli.
          </p>

          <div className="bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <h4 className="font-bold mb-3 text-green-400">Physical Shifters</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Change rooms</li>
              <li>• Step outside, even for 30 seconds</li>
              <li>• Blast a different playlist</li>
              <li>• Do 10 jumping jacks or push-ups</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/30 rounded-xl p-6 mb-8">
            <h4 className="font-bold mb-3 text-green-400">Digital Shifters</h4>
            <p className="text-gray-300">
              Pick a Daily Ritual designed for quick mood shifts — like a 3-minute guided breathing or a creativity challenge.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">4. Safe Venting Space</h2>
          
          <p className="mb-4">
            Spiraling often comes from unexpressed emotion.
          </p>

          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
            <h4 className="font-bold mb-3 text-purple-400">Physical Venting</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Write it down on paper and tear it up</li>
              <li>• Scream into a pillow</li>
              <li>• Voice memo to yourself (don't send)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6 mb-8">
            <h4 className="font-bold mb-3 text-purple-400">Digital Venting</h4>
            <p className="text-gray-300">
              Use AI Therapy to say exactly what you want to say — and get a response that keeps you grounded.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">5. Social Anchors</h2>
          
          <p className="mb-4">
            A quick human connection can pull you back to reality.
          </p>

          <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-500/30 rounded-xl p-6 mb-6">
            <h4 className="font-bold mb-3 text-orange-400">Physical Connection</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Call a friend, even if it's just to hear a familiar voice</li>
              <li>• Hug a pet, family member, or even a stuffed animal</li>
              <li>• Go where other people are (coffee shop, store)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-500/30 rounded-xl p-6 mb-8">
            <h4 className="font-bold mb-3 text-orange-400">Digital Connection</h4>
            <p className="text-gray-300">
              Post "spiraling" on the Wall of Wounds — the community will flood your feed with encouragement.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold mb-4 text-white">Emergency Spiral Protocol</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-400 mb-2">FIRST 5 MINUTES (Stop the Fall)</h4>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                  <li>Name it: "I am spiraling"</li>
                  <li>Ground it: Cold water, deep breath, feel your feet</li>
                  <li>Block it: Phone away, exit the trigger app</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">NEXT 10 MINUTES (Shift the Energy)</h4>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                  <li>Move your body or change your environment</li>
                  <li>Vent safely through AI Therapy or journaling</li>
                  <li>Reach out to community or a friend</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">NEXT 15 MINUTES (Rebuild Stability)</h4>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                  <li>Do a Daily Ritual that brings you back to yourself</li>
                  <li>Log your experience in Daily Check-in</li>
                  <li>Remind yourself: "I survived this feeling before"</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold mb-4 text-white">Real User Emergency Story</h3>
            <p className="text-gray-300 italic">
              "Saw them with someone new at a coffee shop. Completely blindsided. Used the 5-minute protocol, posted on Wall of Wounds, and had 12 people talking me through it within minutes. Instead of texting them, I went home and did a workout ritual. Turned my worst day into proof I could handle anything." — Alex, 29
            </p>
          </div>

          <p className="text-xl mb-8 leading-relaxed">
            Your <strong>breakup emergency kit</strong> isn't just a comfort blanket — it's a rescue rope. By combining simple physical tools with the digital safety net inside CTRL+ALT+BLOCK, you can stop the spiral before it swallows you, and step back into your healing process with control intact.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 my-12">
          <h3 className="text-2xl font-bold mb-4 text-center">Ready to Build Your Emergency Support System?</h3>
          <p className="text-gray-300 text-center mb-6">
            Get instant access to AI therapy, community support, and personalized rituals designed to stop spirals before they start.
          </p>
          <div className="text-center">
            <Link 
              href="/quiz"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              Start Your Healing Journey
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-800 pt-8">
          <h3 className="text-xl font-bold mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/blog/breakup-hacks-stop-texting-ex"
              className="block p-6 border border-gray-700 rounded-xl hover:border-cyan-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                10 Quick Breakup Hacks That Stop You from Texting Your Ex
              </h4>
              <p className="text-gray-400 text-sm">
                Proven strategies to resist the urge and protect your healing progress...
              </p>
            </Link>
            
            <Link 
              href="/blog/self-care-rituals-stop-overthinking"
              className="block p-6 border border-gray-700 rounded-xl hover:border-green-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-green-400 transition-colors">
                The Self-Care Rituals That Stop Breakup Overthinking at Night
              </h4>
              <p className="text-gray-400 text-sm">
                Learn proven nighttime self-care rituals that calm your mind...
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
