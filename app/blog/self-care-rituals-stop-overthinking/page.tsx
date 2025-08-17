'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Bookmark, Share2, Calendar, Clock, Eye, User } from 'lucide-react';

export default function SelfCareRitualsArticle() {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(847);

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
          title: 'The Self-Care Rituals That Stop Breakup Overthinking at Night',
          text: 'Learn proven nighttime self-care rituals that calm your mind and help you sleep better after a breakup.',
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
          The Self-Care Rituals That Stop Breakup Overthinking at Night
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>CTRL+ALT+BLOCK</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>August 12, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>8 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>3.2k views</span>
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
            src="/The Self-Care Rituals That Stop Breakup Overthinking at Night.png"
            alt="The Self-Care Rituals That Stop Breakup Overthinking at Night"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            You crawl into bed hoping for rest — but your brain has other plans. Suddenly you're replaying every text, every look, every "what if" of your relationship. If you <strong>can't sleep after breakup</strong>, you're not alone. Nighttime is when your mind has fewer distractions, so unprocessed emotions rush in.
          </p>

          <p className="mb-8">
            At CTRL+ALT+BLOCK, we've seen how our Daily Check-in, Daily Rituals, AI Therapy, Wall of Wounds, and No-Contact Streak can work together to help you calm your mind before sleep. Here's how to build a bedtime self-care routine that shuts down overthinking and lets your body rest.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">1. Close Your Emotional Tabs</h2>
          
          <p className="mb-4">
            Your brain holds onto unresolved thoughts like a browser with 37 tabs open.
          </p>

          <p className="mb-6">
            <strong>Action:</strong> Use AI Therapy before bed to dump every thought, frustration, or question you'd normally spiral on. Getting it "out" tricks your brain into feeling finished.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">2. Ground Your Body Before Bed</h2>
          
          <p className="mb-4">
            Physical relaxation cues your nervous system to slow down.
          </p>

          <p className="mb-4">
            <strong>Action:</strong> Try a slow stretch or gentle yoga flow. Pair it with deep breathing: inhale for 4, hold for 4, exhale for 6.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Log this in your Daily Check-in so you start associating nighttime with intentional winding down.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">3. Swap Doom-Scrolling for Ritual Scrolling</h2>
          
          <p className="mb-4">
            Lying in bed scrolling your ex's socials is a recipe for <em>nighttime overthinking breakup</em> spirals.
          </p>

          <p className="mb-6">
            <strong>Action:</strong> Open your Daily Rituals and pick a "Night Calm" task — like listening to a guided meditation, sketching, or writing down 3 small wins from your day.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">4. Use Community to Quiet the Lonely Hours</h2>
          
          <p className="mb-4">
            Nighttime loneliness can push you toward breaking no contact.
          </p>

          <p className="mb-6">
            <strong>Action:</strong> Post a short "goodnight" reflection on the Wall of Wounds. You'll often wake up to replies that make you feel less alone.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">5. Protect Your Streak While You Sleep</h2>
          
          <p className="mb-4">
            A restless night makes impulsive texting more likely the next day.
          </p>

          <p className="mb-6">
            <strong>Action:</strong> Keep your No-Contact Streak visible on your dashboard — it's your reminder that staying strong is worth more than a midnight message.
          </p>

          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 my-8">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Quick Self-Care for Insomnia After Breakup</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Keep a journal by your bed for brain dumps</li>
              <li>• Use the 4-7-8 breathing technique</li>
              <li>• Create a "worry window" — 10 minutes to process, then stop</li>
              <li>• Listen to rain sounds or sleep stories</li>
              <li>• Practice progressive muscle relaxation</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">The Science Behind Breakup Sleep Tips</h2>
          
          <p className="mb-4">
            When you're dealing with heartbreak, your cortisol levels spike at night — the exact time they should be dropping for sleep. Your body is literally wired for alertness when you need rest most.
          </p>

          <p className="mb-6">
            These <em>self care for insomnia after breakup</em> rituals work because they interrupt the stress response and give your nervous system permission to shift into rest mode. Consistency is key — your brain learns to associate these actions with safety and calm.
          </p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold mb-4 text-white">Real User Story</h3>
            <p className="text-gray-300 italic">
              "I used to lie awake until 3am replaying arguments. Now I use AI Therapy to get it all out, then do my breathing exercises. I'm actually sleeping 6-7 hours again instead of 3-4." — Sarah, 28
            </p>
          </div>

          <p className="text-xl mb-8 leading-relaxed">
            If you <strong>can't sleep after a breakup</strong>, the solution isn't to wait until exhaustion wins — it's to actively guide your mind and body into rest mode. By pairing self-care rituals with the built-in support of CTRL+ALT+BLOCK, you'll give yourself the best shot at waking up rested and ready to keep healing.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 my-12">
          <h3 className="text-2xl font-bold mb-4 text-center">Ready to Sleep Better Tonight?</h3>
          <p className="text-gray-300 text-center mb-6">
            Start your healing journey with personalized daily rituals and AI-powered support designed to calm your mind and restore your peace.
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
              href="/blog/micro-healing-emotional-shifts"
              className="block p-6 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                How Micro-Healing Changes Can Lead to Massive Emotional Shifts
              </h4>
              <p className="text-gray-400 text-sm">
                Small, consistent actions that rewire your brain for lasting recovery...
              </p>
            </Link>
            
            <Link 
              href="/blog/emotional-relapses-recovery"
              className="block p-6 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                How to Spot (and Stop) Emotional Relapses During Breakup Recovery
              </h4>
              <p className="text-gray-400 text-sm">
                Recognize when you're sliding backward and get back on track...
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
