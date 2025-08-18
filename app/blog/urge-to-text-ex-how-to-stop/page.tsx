"use client";

import Link from 'next/link'
import { Share2, Bookmark, ThumbsUp, MessageCircle } from 'lucide-react'
import { safeClipboardCopy } from '@/lib/utils'

export default function TextingTemptationsPage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Texting Temptations: How to Beat the Urge to Reach Out to Your Ex',
          text: 'The urge to text your ex can hit like lightning. Here\'s how to outsmart the temptation before your thumbs betray you.',
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
              Texting Temptations: How to Beat the Urge to Reach Out to Your Ex
            </h1>
            
            <div className="flex items-center gap-6 text-gray-400 mb-8">
              <span>January 20, 2025</span>
              <span>•</span>
              <span>7 min read</span>
              <span>•</span>
              <span>Breakup Impulse Control</span>
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
              src="/How to Beat the Urge to Reach Out to Your Ex.png" 
              alt="How to Beat the Urge to Reach Out to Your Ex"
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
              71
            </button>
          </div>

          {/* Article Text */}
          <div className="prose prose-invert prose-lg max-w-none">
            
            <p className="text-xl leading-relaxed text-gray-300 mb-8">
              The <strong>urge to text your ex</strong> can hit like a lightning bolt — one minute you're fine, the next you're drafting "just one quick message." But even a single text can reignite emotional chaos and undo weeks of healing.
            </p>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              At CTRL+ALT+BLOCK, we built our Daily Check-in, No-Contact Streak, Daily Rituals, AI Therapy, and Wall of Wounds to help you ride out these cravings without caving. Here's how to outsmart the temptation before your thumbs betray you.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-red-400">5 Ways to Stop Texting Your Ex</h2>

            <div className="space-y-8">
              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">1. Recognize the Trigger in Real Time</h3>
                <p className="text-gray-300 mb-4">
                  Most urges follow a trigger: loneliness, boredom, seeing something that reminds you of them. Learning <strong>how to resist contacting ex</strong> starts with identifying these patterns before they escalate.
                </p>
                <p><strong className="text-red-400">Platform tip:</strong> Use your Daily Check-in to log your mood the moment a trigger hits. Awareness is the first line of defense.</p>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">2. Protect Your Streak Like It's Gold</h3>
                <p className="text-gray-300 mb-4">
                  Once you've built a few days (or weeks) of no contact, that streak is your badge of self-respect. Breaking it for one text means starting over. This is a core principle of <strong>breakup impulse control</strong>.
                </p>
                <p><strong className="text-pink-400">Platform tip:</strong> The No-Contact Streak counter shows your progress — and losing it hurts more than resisting the text.</p>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">3. Replace the Action With a Ritual</h3>
                <p className="text-gray-300 mb-4">
                  Your brain craves the dopamine rush that contact gives. Instead, redirect that craving into an uplifting task. This redirection is essential when learning <strong>how to stop texting ex</strong> partners.
                </p>
                <p><strong className="text-red-400">Platform tip:</strong> Open Daily Rituals and pick one that shifts your focus — from quick workouts to micro-journaling prompts that burn through the urge.</p>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">4. Talk It Out Without Reaching Out</h3>
                <p className="text-gray-300 mb-4">
                  Sometimes you need to vent the exact message you want to send — without actually sending it. This helps satisfy the <strong>urge to text ex</strong> without the consequences.
                </p>
                <p><strong className="text-pink-400">Platform tip:</strong> Use AI Therapy to "say" what's on your mind and get an instant, compassionate response that won't sabotage your healing.</p>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">5. Lean on the Crowd That Gets It</h3>
                <p className="text-gray-300 mb-4">
                  No one understands the pull to text your ex like someone else who's been there. Community support is a powerful tool for <strong>no contact breakup tips</strong>.
                </p>
                <p><strong className="text-red-400">Platform tip:</strong> Post about your urge on the Wall of Wounds. You'll get real-time support and encouragement to hold the line.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-red-400">The Emergency Protocol: When the Urge Hits Hard</h2>
            
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              Sometimes the urge feels overwhelming. Here's your step-by-step emergency protocol:
            </p>

            <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-bold text-red-300 mb-4">The 10-Minute Rule</h4>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 font-bold">1.</span>
                  <span>Put your phone in another room or give it to someone else</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 font-bold">2.</span>
                  <span>Set a timer for 10 minutes and do something physical (pushups, walk, dance)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 font-bold">3.</span>
                  <span>Open CTRL+ALT+BLOCK and log your trigger in Daily Check-in</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 font-bold">4.</span>
                  <span>Type your message in AI Therapy instead of your messaging app</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 font-bold">5.</span>
                  <span>When the timer goes off, reassess: Do you still want to text?</span>
                </li>
              </ol>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-red-400">Success Stories: Beating the Urge</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 italic mb-4">
                  "I was literally typing 'I miss you' when I remembered my 14-day streak. I deleted the message, did 20 jumping jacks, and posted on the Wall instead. The community response was better than any text he could have sent back." 
                </p>
                <p className="text-sm text-gray-500">— Jessica, 42-day streak and counting</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 italic mb-4">
                  "The AI Therapy feature saved me from so many drunk texts. I could pour out all my feelings and get responses that actually helped me process instead of just reacting."
                </p>
                <p className="text-sm text-gray-500">— David, 6 months no contact</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 italic mb-4">
                  "Every time I wanted to text him, I'd open my streak counter instead. Watching those numbers grow became more addictive than the urge to reach out."
                </p>
                <p className="text-sm text-gray-500">— Maria, 89-day record holder</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-red-400">Remember: The Urge Always Passes</h2>
            
            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              The <strong>urge to text your ex</strong> isn't proof you should — it's proof you're still healing. These feelings are temporary, but the self-respect you build by resisting them is permanent. With the right tools, you can let the wave pass without losing your progress.
            </p>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              And with CTRL+ALT+BLOCK in your pocket, you're never facing that moment alone — you've got a system and a community built to keep you strong when willpower alone isn't enough.
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
              <Link href="/blog/breaking-no-contact-consequences" className="group">
                <div className="bg-gradient-to-b from-red-900/20 to-black border border-red-500/30 rounded-lg p-6 h-full hover:border-red-400/50 transition-colors">
                  <span className="text-sm text-red-400 font-medium">NO CONTACT</span>
                  <h4 className="text-xl font-bold mt-2 mb-3 group-hover:text-red-400 transition-colors">
                    Why Breaking No Contact Always Hurts More
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Understanding the hidden damage of reaching out and why staying strong matters.
                  </p>
                </div>
              </Link>
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
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
