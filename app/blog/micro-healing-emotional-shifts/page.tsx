'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Bookmark, Share2, Calendar, Clock, Eye, User } from 'lucide-react';

export default function MicroHealingArticle() {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(923);

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
          title: 'How Micro-Healing Changes Can Lead to Massive Emotional Shifts',
          text: 'Discover how small, consistent healing actions create compound emotional growth and lasting recovery.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      safeClipboardCopy(window.location.href);
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
            href="/blog?category=Self-Care"
            className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border border-green-500/30 hover:from-green-500/30 hover:to-blue-500/30 transition-all duration-200"
          >
            Self-Care
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          How Micro-Healing Changes Can Lead to Massive Emotional Shifts
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>CTRL+ALT+BLOCK</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>August 10, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>7 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>2.9k views</span>
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
            src="/How Micro-Healing Changes Can Lead to Massive Emotional Shifts.png"
            alt="How Micro-Healing Changes Can Lead to Massive Emotional Shifts"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            When you're in the middle of breakup recovery, it's tempting to search for one big thing that will make the pain vanish. But science — and real-world experience — say it's the small changes that create the biggest impact on your emotional health.
          </p>

          <p className="mb-8">
            At CTRL+ALT+BLOCK, our Daily Check-in, Daily Rituals, No-Contact Streak, AI Therapy, and Wall of Wounds are all built around this principle: consistent micro-healing moments add up to massive emotional shifts over time.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">1. The Science of Micro-Healing</h2>
          
          <p className="mb-4">
            Small, repeatable actions rewire your brain faster than rare, dramatic gestures. They create habit loops that make recovery automatic instead of willpower-based.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Use the Daily Check-in to track even the tiniest wins — like "I made my bed" or "I went for a 5-minute walk."
          </p>

          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6 my-8">
            <h3 className="text-xl font-bold mb-4 text-green-400">The Compound Effect in Action</h3>
            <p className="text-gray-300 mb-4">
              Just like compound interest, small emotional investments build on each other:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Day 1: Made my bed → felt accomplished</li>
              <li>• Day 3: Made bed + 5-min walk → felt energized</li>
              <li>• Day 7: Previous habits + journaling → felt clear-headed</li>
              <li>• Day 14: Full routine → felt like myself again</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">2. Build Emotional Momentum</h2>
          
          <p className="mb-4">
            One small action makes the next one easier. This compounding effect is what shifts your emotional baseline from drained to hopeful.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> The Daily Rituals library offers quick options — from journaling prompts to 2-minute meditations — that fit into even the busiest days.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">3. Protect Your Gains</h2>
          
          <p className="mb-4">
            The real magic is in not losing the progress you've made. Breaking healthy streaks or skipping rituals too often can set you back.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> The No-Contact Streak visual progress bar is a constant reminder to protect your emotional momentum.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">4. Micro-Connections for Macro-Relief</h2>
          
          <p className="mb-4">
            Even small social interactions can reduce stress hormones and boost mood.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Post something short and simple on the Wall of Wounds — a thought, a meme, or just "made it through today" — and watch how quickly support comes in.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">5. Redirect the Spiral in Seconds</h2>
          
          <p className="mb-4">
            When you feel yourself slipping into overthinking or sadness, a quick pattern interrupt can shift your state.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Use AI Therapy for a 2-minute reframing conversation when you need a mental reset.
          </p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold mb-4 text-white">Real User Story</h3>
            <p className="text-gray-300 italic mb-4">
              "I thought I needed a complete life overhaul to feel better. Instead, I started with just logging my mood daily and doing one small ritual. Three weeks later, I realized I wasn't crying every day anymore. The small stuff really does add up." — Marcus, 31
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">The Neuroscience Behind Micro-Habits</h2>
          
          <p className="mb-4">
            Your brain forms new neural pathways through repetition, not intensity. A 2-minute daily meditation creates stronger neural changes than a 2-hour session once a week.
          </p>

          <p className="mb-4">
            When you're healing from heartbreak, your brain is already overwhelmed. Micro-healing works because it doesn't trigger your stress response — instead, it quietly builds new emotional patterns in the background.
          </p>

          <p className="mb-6">
            This is why CTRL+ALT+BLOCK focuses on small, achievable daily actions rather than overwhelming life overhauls. Your brain doesn't resist micro-changes, making them stick permanently.
          </p>

          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 my-8">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Micro-Healing Examples</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">Physical</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 10 deep breaths</li>
                  <li>• Drink a glass of water</li>
                  <li>• 2-minute stretch</li>
                  <li>• Make your bed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Emotional</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Write 3 things you're grateful for</li>
                  <li>• Send one supportive message</li>
                  <li>• Listen to one song that makes you smile</li>
                  <li>• Take a photo of something beautiful</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-xl mb-8 leading-relaxed">
            The truth is, you don't need a grand transformation to heal. You need micro-healing — small, consistent steps that quietly rewire your brain and restore your sense of control. Stack those steps with CTRL+ALT+BLOCK, and you'll wake up one day realizing the massive shift already happened.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 my-12">
          <h3 className="text-2xl font-bold mb-4 text-center">Ready to Start Your Micro-Healing Journey?</h3>
          <p className="text-gray-300 text-center mb-6">
            Discover your personalized daily rituals and start building the small habits that create massive emotional shifts.
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
            
            <Link 
              href="/blog/7-stages-breakup-healing"
              className="block p-6 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                The 7 Stages of Breakup Healing (And What Actually Helps at Each One)
              </h4>
              <p className="text-gray-400 text-sm">
                A science-backed roadmap through the emotional stages of recovery...
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
