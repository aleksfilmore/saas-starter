"use client";

import Link from 'next/link'
import { Share2, Bookmark, ThumbsUp, MessageCircle } from 'lucide-react'

export default function NoContactSurvivalGuidePage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Day-by-Day Survival Guide for Your First 30 Days of No Contact',
          text: 'The first 30 days of no contact can feel like a marathon you didn\'t train for. This guide helped me get through it!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-900/20 to-black pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-red-400 hover:text-red-300 mb-6 transition-colors"
            >
              ← Back to Blog
            </Link>
            
            <div className="mb-6">
              <Link href="/blog" className="px-3 py-1 bg-gradient-to-r from-red-400 to-pink-400 text-black text-sm font-bold rounded-full hover:from-red-500 hover:to-pink-500 transition-all">
                NO CONTACT
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Day-by-Day Survival Guide for Your First 30 Days of No Contact
            </h1>
            
            <div className="flex items-center gap-6 text-gray-400 mb-8">
              <span>January 15, 2025</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>No Contact Recovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
        {/* Featured Image */}
        <div className="mb-12 relative overflow-hidden rounded-lg">
          <div className="aspect-square relative overflow-hidden">
            <img 
              src="/Day-by-Day Survival Guide for Your First 30 Days of No Contact.png" 
              alt="Day-by-Day Survival Guide for Your First 30 Days of No Contact"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-pink-400"></div>
        </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-12 pb-6 border-b border-gray-800">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <Share2 size={16} />
              Share Helpful
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
              <Bookmark size={16} />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
              <ThumbsUp size={16} />
              47
            </button>
          </div>

          {/* Article Text */}
          <div className="prose prose-invert prose-lg max-w-none">
            
            <p className="text-xl leading-relaxed text-gray-300 mb-8">
              The first 30 days of no contact can feel like a marathon you didn't train for. The urge to reach out is strongest now, and your brain's reward system is still wired to seek them out. But this first month is also where the magic happens — boundaries solidify, emotions stabilize, and you reclaim mental clarity.
            </p>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              At CTRL+ALT+BLOCK, our No Contact Tracker is designed to guide you through this exact phase, with daily check-ins, shield streaks, and AI-powered prompts that help you ride out the hardest moments without caving.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-red-400">Day-by-Day Breakdown</h2>

            <div className="space-y-8">
              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">Days 1–3: Shock & Withdrawal</h3>
                <p className="text-gray-300 mb-4">You might feel restless, panicky, or impulsive.</p>
                <div className="space-y-2">
                  <p><strong className="text-red-400">Action:</strong> Set up your digital shield — block or mute their number and socials.</p>
                  <p><strong className="text-red-400">Platform tip:</strong> Use the No Contact Tracker's Shield Window to lock in your first streak.</p>
                </div>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">Days 4–7: Emotional Flood</h3>
                <p className="text-gray-300 mb-4">Tears, anger, or obsessive thinking are common.</p>
                <div className="space-y-2">
                  <p><strong className="text-pink-400">Action:</strong> Channel energy into physical tasks — clean, reorganize, walk daily.</p>
                  <p><strong className="text-pink-400">Platform tip:</strong> Log your moods in the Tracker to spot patterns.</p>
                </div>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">Days 8–14: Craving Contact</h3>
                <p className="text-gray-300 mb-4">You'll romanticize the good times and minimize the bad.</p>
                <div className="space-y-2">
                  <p><strong className="text-red-400">Action:</strong> Write your "Why We Broke Up" list and keep it handy.</p>
                  <p><strong className="text-red-400">Platform tip:</strong> Check your AI Closure Simulator to process "what if" thoughts safely.</p>
                </div>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">Days 15–21: Energy Return</h3>
                <p className="text-gray-300 mb-4">You'll have bursts of motivation. Use them to start new habits.</p>
                <div className="space-y-2">
                  <p><strong className="text-pink-400">Action:</strong> Commit to one positive daily ritual (exercise, journaling, learning).</p>
                  <p><strong className="text-pink-400">Platform tip:</strong> Earn Bytes by completing Glow-Up Forge rituals.</p>
                </div>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">Days 22–30: Mental Clarity</h3>
                <p className="text-gray-300 mb-4">You can see the relationship more objectively.</p>
                <div className="space-y-2">
                  <p><strong className="text-red-400">Action:</strong> Reflect on lessons learned and write down your boundaries for future relationships.</p>
                  <p><strong className="text-red-400">Platform tip:</strong> Share your journey on the Wall of Wounds and get support from others on the same path.</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-red-400">Your 30 Day No Contact Rule Success</h2>
            
            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              The <strong>30 day no contact rule</strong> isn't a punishment — it's an emotional reset. If you can get through this first month, you'll find that the cravings lose their grip, your self-respect grows, and you start to see a future without them as not just possible, but exciting.
            </p>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              And with CTRL+ALT+BLOCK as your companion, you'll have a safety net that keeps you strong every day of the journey. The <strong>30 day no contact rule</strong> becomes not just achievable, but transformative.
            </p>

            <div className="p-6 bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-lg mt-12">
              <h3 className="text-xl font-bold mb-4 text-red-300">Ready to Start Your Healing Journey?</h3>
              <p className="text-gray-300 mb-4">
                Take our personalized breakup recovery quiz and get matched with the perfect healing tools for your situation.
              </p>
              <Link 
                href="/quiz" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
              >
                Start Your Healing Journey →
              </Link>
            </div>

          </div>

          {/* Related Articles */}
          <div className="mt-16 pt-12 border-t border-gray-800">
            <h3 className="text-2xl font-bold mb-8 text-red-400">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/7-stages-breakup-healing" className="group">
                <div className="bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/30 rounded-lg p-6 h-full hover:border-purple-400/50 transition-colors">
                  <span className="text-sm text-purple-400 font-medium">HEALING</span>
                  <h4 className="text-xl font-bold mt-2 mb-3 group-hover:text-purple-400 transition-colors">
                    The 7 Stages of Breakup Healing
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Understanding the emotional journey from devastation to renewal.
                  </p>
                </div>
              </Link>
              <Link href="/blog/rewire-brain-for-love" className="group">
                <div className="bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/30 rounded-lg p-6 h-full hover:border-purple-400/50 transition-colors">
                  <span className="text-sm text-purple-400 font-medium">HEALING</span>
                  <h4 className="text-xl font-bold mt-2 mb-3 group-hover:text-purple-400 transition-colors">
                    How to Rewire Your Brain for Healthy Love
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Breaking free from toxic relationship patterns and attachment styles.
                  </p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
