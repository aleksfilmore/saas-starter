"use client";

import Link from 'next/link'
import { Share2, Bookmark, ThumbsUp, MessageCircle } from 'lucide-react'
import { safeClipboardCopy } from '@/lib/utils'

export default function BreakingNoContactPage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Why Breaking No Contact Always Hurts More Than Staying Strong',
          text: 'Breaking no contact isn\'t just a setback - it can reset your emotional progress to day one. Here\'s why staying strong matters.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await safeClipboardCopy(window.location.href);
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
              Why Breaking No Contact Always Hurts More Than Staying Strong
            </h1>
            
            <div className="flex items-center gap-6 text-gray-400 mb-8">
              <span>January 18, 2025</span>
              <span>•</span>
              <span>7 min read</span>
              <span>•</span>
              <span>No Contact Psychology</span>
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
              src="/Why Breaking No Contact Always Hurts More Than Staying Strong.png" 
              alt="Why Breaking No Contact Always Hurts More Than Staying Strong"
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
              63
            </button>
          </div>

          {/* Article Text */}
          <div className="prose prose-invert prose-lg max-w-none">
            
            <p className="text-xl leading-relaxed text-gray-300 mb-8">
              If you've ever wondered whether sending that "just checking in" text could really do any harm, here's the short answer: yes — and it's more damage than you think. <strong>Breaking no contact</strong> isn't just a setback in your breakup recovery; it can reset your emotional progress to day one.
            </p>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              At CTRL+ALT+BLOCK, our No Contact Tracker was designed to stop you from falling into this trap. With streak shields, emergency rituals, and even an AI Confession Box to vent your urge without sending it, we've seen thousands of users stay strong when the temptation hits hardest.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-red-400">The Hidden Damage of Breaking No Contact</h2>

            <div className="space-y-8">
              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">1. Breaking No Contact Reopens the Wound</h3>
                <p className="text-gray-300 mb-4">
                  Your brain starts to heal through "extinction learning" — the process of breaking the association between your ex and emotional reward. <strong>Breaking no contact</strong> reactivates that association, undoing weeks of progress.
                </p>
                <p><strong className="text-red-400">Platform tip:</strong> Our Shield Window feature locks out contact for 24–48 hours after triggers, so you have a cool-off period.</p>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">2. The Dopamine Crash Is Brutal</h3>
                <p className="text-gray-300 mb-4">
                  After the momentary high of contact, your dopamine levels plummet, often leaving you feeling worse than before. This crash can trigger <strong>breaking no contact regret</strong> that lasts for days.
                </p>
                <p><strong className="text-pink-400">Platform tip:</strong> Instead of texting, trigger your dopamine with a Glow-Up Forge ritual — workout, creative task, or new playlist challenge.</p>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">3. It Reinforces Old Patterns</h3>
                <p className="text-gray-300 mb-4">
                  Contact tells your brain: "This behavior is still on the table." That's how cycles of on-again, off-again relationships survive. Understanding <strong>why no contact works</strong> means recognizing this pattern disruption.
                </p>
                <p><strong className="text-red-400">Platform tip:</strong> Use the AI Therapy personas to rehearse and release the conversation you wish you could have — without risking a real relapse.</p>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">4. It Can Invite More Hurt</h3>
                <p className="text-gray-300 mb-4">
                  Maybe they reply coldly. Maybe they breadcrumb you. Either way, it reopens uncertainty, which slows emotional closure. The <strong>breaking no contact consequences</strong> compound when you realize you've given them power over your mood again.
                </p>
                <p><strong className="text-pink-400">Platform tip:</strong> The Wall of Wounds community feed shows stories from others who broke contact — and how they recovered — to remind you you're not alone.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-red-400">The Psychology Behind No Contact Benefits</h2>
            
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              Understanding <strong>no contact psychology</strong> helps you see why staying strong isn't about punishment — it's about rewiring your brain for healthier relationship patterns. Every day you maintain no contact:
            </p>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-start">
                <span className="text-red-400 mr-3">•</span>
                <span>Your brain builds new neural pathways that don't depend on their validation</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">•</span>
                <span>You prove to yourself that you can handle difficult emotions independently</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">•</span>
                <span>Your self-respect compounds, making you less likely to accept poor treatment</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">•</span>
                <span>You create space for genuine healing instead of emotional yo-yoing</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold mb-6 text-red-400">Real Stories: Breaking No Contact Consequences</h2>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8">
              <p className="text-gray-300 italic mb-4">
                "I broke my 21-day streak to wish him happy birthday. He replied with just 'thanks' and I spent the next week analyzing those 6 letters. I felt like I was back at day zero emotionally." 
              </p>
              <p className="text-sm text-gray-500">— Sarah, CTRL+ALT+BLOCK user</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8">
              <p className="text-gray-300 italic mb-4">
                "The moment I sent that text, I knew I'd made a mistake. The anxiety of waiting for a reply was worse than missing them. Now I use the AI Therapy feature instead — I get to 'say' what I need without the aftermath."
              </p>
              <p className="text-sm text-gray-500">— Marcus, 47-day streak holder</p>
            </div>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              Every time you resist <strong>breaking no contact</strong>, you prove to yourself that you can survive without their validation. Stay strong, protect your progress, and remember: each day you hold the line, your self-respect compounds. And with CTRL+ALT+BLOCK in your corner, you never have to fight the urge alone.
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
              <Link href="/blog/30-days-no-contact-survival" className="group">
                <div className="bg-gradient-to-b from-red-900/20 to-black border border-red-500/30 rounded-lg p-6 h-full hover:border-red-400/50 transition-colors">
                  <span className="text-sm text-red-400 font-medium">NO CONTACT</span>
                  <h4 className="text-xl font-bold mt-2 mb-3 group-hover:text-red-400 transition-colors">
                    Day-by-Day Survival Guide for Your First 30 Days
                  </h4>
                  <p className="text-gray-400 text-sm">
                    The complete roadmap for getting through your first month without breaking.
                  </p>
                </div>
              </Link>
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
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
