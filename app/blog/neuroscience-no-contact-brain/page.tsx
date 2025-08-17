"use client";

import Link from 'next/link'
import { Share2, Bookmark, ThumbsUp } from 'lucide-react'

export default function NeuroscienceNoContactPage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Neuroscience of Silence: What Happens in Their Brain When You Go No Contact',
          text: 'The psychology of no contact isn\'t about playing games — it\'s about letting both nervous systems detach from emotional dependency.',
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
              The Neuroscience of Silence: What Happens in Their Brain When You Go No Contact
            </h1>
            
            <div className="flex items-center gap-6 text-gray-400 mb-8">
              <span>January 22, 2025</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>Brain Science</span>
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
              src="/What Happens in Their Brain When You Go No Contact.png" 
              alt="What Happens in Their Brain When You Go No Contact"
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
              58
            </button>
          </div>

          {/* Article Text */}
          <div className="prose prose-invert prose-lg max-w-none">
            
            <p className="text-xl leading-relaxed text-gray-300 mb-8">
              You've probably heard that no contact is for you — and that's true. But here's the twist: it also changes their brain. The <strong>psychology of no contact</strong> isn't about playing games; it's about letting both nervous systems detach from a cycle of reward, withdrawal, and emotional dependency.
            </p>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              At CTRL+ALT+BLOCK, we use Daily Check-ins, No-Contact Streaks, Daily Rituals, AI Therapy, and the Wall of Wounds to help you stay consistent long enough for these neurological shifts to actually happen.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-red-400">How Brain Science No Contact Really Works</h2>

            <div className="space-y-8">
              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">1. You Interrupt Their Dopamine Loop</h3>
                <p className="text-gray-300 mb-4">
                  When someone's used to instant access to you, your replies trigger their dopamine release — the brain's "feel good" chemical. No contact stops feeding that loop, which forces their brain to adapt. This is core to understanding <strong>what happens in their brain no contact</strong>.
                </p>
                <div className="bg-red-800/20 p-4 rounded border-l-4 border-red-400">
                  <p><strong className="text-red-400">Platform tip:</strong> Your No-Contact Streak keeps you focused on your own loop — self-respect instead of instant response.</p>
                </div>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">2. You Trigger Uncertainty and Reassessment</h3>
                <p className="text-gray-300 mb-4">
                  Inconsistent access makes the brain work harder to predict outcomes, often leading to increased attention toward the missing stimulus — you. This <strong>neuroscience breakup</strong> principle explains why silence can be more powerful than words.
                </p>
                <div className="bg-pink-800/20 p-4 rounded border-l-4 border-pink-400">
                  <p><strong className="text-pink-400">Platform tip:</strong> Use Daily Check-ins to track your own emotions when curiosity about their thoughts creeps in.</p>
                </div>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">3. You Give Space for Memory Reconsolidation</h3>
                <p className="text-gray-300 mb-4">
                  Over time, their brain reprocesses relationship memories without the reinforcement of your presence. This can shift how they perceive the breakup and their role in it. The <strong>psychology of no contact</strong> leverages this natural neural process.
                </p>
                <div className="bg-red-800/20 p-4 rounded border-l-4 border-red-400">
                  <p><strong className="text-red-400">Platform tip:</strong> Post your milestones or reflections on the Wall of Wounds to see how others have experienced similar shifts.</p>
                </div>
              </div>

              <div className="p-6 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-pink-300">4. You Shift the Power of Attention</h3>
                <p className="text-gray-300 mb-4">
                  Humans are wired to focus on what they can't easily have. Silence can flip the mental script, placing you in the position of scarcity. This aspect of <strong>how no contact affects them</strong> taps into basic human psychology.
                </p>
                <div className="bg-pink-800/20 p-4 rounded border-l-4 border-pink-400">
                  <p><strong className="text-pink-400">Platform tip:</strong> When tempted to "break silence," open AI Therapy and talk through what you hope their reaction would be — you may realize it's not worth the risk.</p>
                </div>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-300">5. You Protect Your Own Neurology</h3>
                <p className="text-gray-300 mb-4">
                  While their brain adapts, so does yours — neural pathways tied to them weaken, making it easier to think clearly. This dual <strong>brain science no contact</strong> effect benefits both parties in the long run.
                </p>
                <div className="bg-red-800/20 p-4 rounded border-l-4 border-red-400">
                  <p><strong className="text-red-400">Platform tip:</strong> Fill those rewired circuits with Daily Rituals — new hobbies, self-care tasks, and micro-wins that make your brain crave your own growth.</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-red-400">The Neuroscience Timeline: What to Expect</h2>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-bold text-red-300 mb-4">Week 1-2: Initial Withdrawal</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span>Their brain craves the dopamine hit from your responses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span>Increased checking behaviors (social media, mutual friends)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span>Anxiety response from uncertainty</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-bold text-pink-300 mb-4">Week 3-6: Adaptation Phase</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-pink-400 mr-3">•</span>
                  <span>Brain begins adapting to absence of reward</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-3">•</span>
                  <span>Memory reconsolidation starts affecting perception</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-3">•</span>
                  <span>Possible increase in valuation due to scarcity principle</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-bold text-red-300 mb-4">2+ Months: Neural Reorganization</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span>New neural pathways form around your absence</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span>Their emotional dependency begins to weaken</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span>Clearer perspective on relationship dynamics emerges</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-red-400">Real Science, Real Results</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 italic mb-4">
                  "I didn't believe in the neuroscience stuff until I saw it happen. After 8 weeks of no contact, he reached out with a completely different energy — reflective, accountable, actually wanting to understand what went wrong." 
                </p>
                <p className="text-sm text-gray-500">— Rachel, 67-day streak completed</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 italic mb-4">
                  "The Daily Check-ins helped me track my own brain changes too. Around week 5, I stopped wondering what she was thinking and started focusing on what I was building. That's when I knew the rewiring was working for both of us."
                </p>
                <p className="text-sm text-gray-500">— James, 3-month no contact journey</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 italic mb-4">
                  "The Wall of Wounds showed me I wasn't alone in seeing these patterns. Other people's timelines helped me understand that their brain was going through predictable changes, not just random emotions."
                </p>
                <p className="text-sm text-gray-500">— Maria, neuroscience student and user</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12 text-red-400">The Bottom Line: Psychology of No Contact</h2>
            
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              The <strong>psychology of no contact</strong> works because it's not just emotional — it's neurological. Their brain adapts. Your brain heals. And the beautiful part? You don't need to monitor their process. You just need to trust the science and protect your own neural rewiring.
            </p>

            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              And with CTRL+ALT+BLOCK guiding your streaks, tracking your progress, and giving you safe emotional outlets, you're more likely to hold the line long enough for the science to work in your favor. The <strong>brain science no contact</strong> principles become your allies, not your enemies.
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
              <Link href="/blog/urge-to-text-ex-how-to-stop" className="group">
                <div className="bg-gradient-to-b from-red-900/20 to-black border border-red-500/30 rounded-lg p-6 h-full hover:border-red-400/50 transition-colors">
                  <span className="text-sm text-red-400 font-medium">NO CONTACT</span>
                  <h4 className="text-xl font-bold mt-2 mb-3 group-hover:text-red-400 transition-colors">
                    How to Beat the Urge to Reach Out
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Step-by-step strategies to outsmart texting temptations.
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
