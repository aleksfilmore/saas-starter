'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Bookmark, Share2, Calendar, Clock, Eye, User } from 'lucide-react';

export default function BreakupHacksArticle() {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1456);

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
          title: '10 Quick Breakup Hacks That Stop You from Texting Your Ex',
          text: 'Proven strategies to resist the urge and protect your healing progress when you want to reach out.',
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
          10 Quick Breakup Hacks That Stop You from Texting Your Ex
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>CTRL+ALT+BLOCK</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>August 6, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>5 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>5.7k views</span>
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
            src="/10 Quick Breakup Hacks That Stop You from Texting Your Ex.png"
            alt="10 Quick Breakup Hacks That Stop You from Texting Your Ex"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            When the urge to reach out hits, logic often loses to muscle memory — your fingers type faster than your brain can stop them. But with the right hacks, you can stop texting your ex before the damage is done.
          </p>

          <p className="mb-8">
            At CTRL+ALT+BLOCK, our Daily Check-in, No-Contact Streak, Daily Rituals, AI Therapy, and Wall of Wounds were designed to make resisting the urge automatic. Here are 10 quick hacks you can use today.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">The Hacks</h2>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">1. Change Their Name in Your Phone</h3>
              <p className="text-gray-300">
                Rename them to "Do Not Text" or something ridiculous that breaks the mood. When you see "🛑 NOPE" instead of their name, the spell is broken.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">2. Use Airplane Mode When Urges Hit</h3>
              <p className="text-gray-300">
                Instant disconnection buys you cooling-off time. The urge usually passes within 10-15 minutes if you can't act on it.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">3. Move Messaging Apps Off Your Home Screen</h3>
              <p className="text-gray-300">
                Add friction to stop impulsive opens. Those extra taps and swipes give your rational brain time to catch up.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">4. Start Your Day with a Daily Check-in</h3>
              <p className="text-gray-300">
                Log your mood before the urge builds. <strong>(Platform: Daily Check-in)</strong> Self-awareness is your first line of defense.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">5. Track Your No-Contact Streak</h3>
              <p className="text-gray-300">
                Nothing kills an impulse faster than not wanting to lose a 15-day streak. <strong>(Platform: No-Contact Streak)</strong> Your progress becomes your motivation.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">6. Replace the Action with a Ritual</h3>
              <p className="text-gray-300">
                Do a micro-task — make tea, journal, walk. <strong>(Platform: Daily Rituals)</strong> Redirect the energy instead of suppressing it.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">7. Use AI Therapy Instead</h3>
              <p className="text-gray-300">
                Vent exactly what you'd text to them — AI listens, no harm done. Get the emotional release without the regret.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">8. Post on the Wall of Wounds</h3>
              <p className="text-gray-300">
                Get live support from others before you break silence. The community can talk you down in real-time.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">9. Block Their Number Temporarily</h3>
              <p className="text-gray-300">
                If you can't trust yourself, make it impossible. You can always unblock later when you're thinking clearly.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">10. Keep a Screenshot of Why You Broke Up</h3>
              <p className="text-gray-300">
                Instant reality check when nostalgia hits. Remember the pain, not just the highlights reel.
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold mb-4 text-white">Emergency Protocol: When the Urge Is Overwhelming</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Put your phone in another room for 20 minutes</li>
              <li>Do 10 jumping jacks or push-ups to shift your energy</li>
              <li>Call someone else — anyone else — for 5 minutes</li>
              <li>Write the message in your notes app, don't send it</li>
              <li>Remind yourself: "I can always text tomorrow if I still want to"</li>
            </ol>
            <p className="text-gray-400 text-sm mt-4 italic">
              Tomorrow you never will.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">Why These Hacks Work</h2>
          
          <p className="mb-4">
            The urge to text your ex operates on emotion and habit, not logic. These hacks work because they:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300">
            <li><strong>Add friction</strong> to automatic behaviors</li>
            <li><strong>Redirect energy</strong> instead of suppressing it</li>
            <li><strong>Provide alternatives</strong> that meet the same emotional need</li>
            <li><strong>Use social support</strong> when willpower isn't enough</li>
            <li><strong>Make consequences visible</strong> through streak tracking</li>
          </ul>

          <p className="text-xl mb-8 leading-relaxed">
            Every time you stop texting your ex, you strengthen your ability to move on. The more tools you have, the easier it gets — and with CTRL+ALT+BLOCK built into your daily routine, you'll have a hack ready whenever the urge strikes.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 my-12">
          <h3 className="text-2xl font-bold mb-4 text-center">Ready to Build Your No-Contact Strength?</h3>
          <p className="text-gray-300 text-center mb-6">
            Get personalized daily support and track your progress with tools designed to keep you strong when temptation hits.
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
              href="/blog/breakup-emergency-kit-spiraling"
              className="block p-6 border border-gray-700 rounded-xl hover:border-cyan-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                The Breakup Emergency Kit: What to Do When You're Spiraling
              </h4>
              <p className="text-gray-400 text-sm">
                Instant tools to stop an emotional freefall in its tracks...
              </p>
            </Link>
            
            <Link 
              href="/blog/no-contact-what-they-feel"
              className="block p-6 border border-gray-700 rounded-xl hover:border-red-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-red-400 transition-colors">
                What Your Ex Actually Feels During No Contact (The Real Timeline)
              </h4>
              <p className="text-gray-400 text-sm">
                Week-by-week breakdown of what they experience when you go silent...
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
