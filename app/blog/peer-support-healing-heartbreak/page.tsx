'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Bookmark, Share2, Calendar, Clock, Eye, User } from 'lucide-react';

export default function PeerSupportArticle() {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1124);

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
          title: 'The Power of Peer Support in Healing from Heartbreak',
          text: 'Discover how breakup support groups and peer connections accelerate recovery and provide authentic validation.',
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
            href="/blog?category=Community"
            className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/30 hover:from-orange-500/30 hover:to-yellow-500/30 transition-all duration-200"
          >
            Community
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          The Power of Peer Support in Healing from Heartbreak
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>CTRL+ALT+BLOCK</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>August 8, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>6 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>4.1k views</span>
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
            src="/The Power of Peer Support in Healing from Heartbreak.png"
            alt="The Power of Peer Support in Healing from Heartbreak"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            When your world feels smaller after a breakup, the right people can help make it big again. Research shows that <strong>breakup support groups</strong> and peer connections accelerate recovery — not just by offering advice, but by giving you a safe space to be fully seen and understood.
          </p>

          <p className="mb-8">
            At CTRL+ALT+BLOCK, our Wall of Wounds, Daily Check-ins, AI Therapy, No-Contact Streak, and Daily Rituals work together to create that support network without the awkward icebreakers or "so why are you here?" moments of traditional groups.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">1. Validation You Can Trust</h2>
          
          <p className="mb-4">
            Friends and family may be well-meaning, but they often have biases. Peer support gives you validation from people who get it because they've been there.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Share your story on the Wall of Wounds and receive real-time encouragement from others on the same journey.
          </p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold mb-4 text-white">Why Peer Validation Hits Different</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <h4 className="font-semibold mb-2 text-orange-400">Friends & Family</h4>
                <ul className="space-y-1 text-sm">
                  <li>• "You're better off without them"</li>
                  <li>• "Just get back out there"</li>
                  <li>• "It's been 3 months already..."</li>
                  <li>• "I never liked them anyway"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-400">Peers Who've Been There</h4>
                <ul className="space-y-1 text-sm">
                  <li>• "I felt that exact same confusion"</li>
                  <li>• "Month 3 was my hardest too"</li>
                  <li>• "Here's what helped me through that"</li>
                  <li>• "You're not crazy for feeling this way"</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">2. Accountability That Sticks</h2>
          
          <p className="mb-4">
            When you know others are rooting for you, you're more likely to stick to your healing goals.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Keep your No-Contact Streak visible and celebrate milestones publicly in the community feed.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">3. Diverse Coping Strategies</h2>
          
          <p className="mb-4">
            A larger support network means more ideas for navigating triggers and setbacks.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Check the Daily Rituals others are completing — it might inspire you to try something new.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">4. Immediate Emotional Relief</h2>
          
          <p className="mb-4">
            Even a short exchange can lift your mood and stop a spiral.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Use AI Therapy for instant one-on-one emotional support, then follow up with a post in the community for group perspectives.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-white">5. Shared Wins Build Collective Momentum</h2>
          
          <p className="mb-4">
            Seeing others make progress reminds you that healing is possible for you too.
          </p>

          <p className="mb-6">
            <strong>Platform tip:</strong> Log your achievements in your Daily Check-in and share them in the Wall of Wounds.
          </p>

          <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-500/30 rounded-xl p-6 my-8">
            <h3 className="text-xl font-bold mb-4 text-orange-400">The Science of Social Healing</h3>
            <p className="text-gray-300 mb-4">
              Research from UCLA shows that social support literally changes your brain chemistry during stress:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong>Cortisol reduction:</strong> Sharing stress with others lowers stress hormones</li>
              <li>• <strong>Oxytocin boost:</strong> Connection releases "bonding" chemicals</li>
              <li>• <strong>Perspective shift:</strong> Others help you see situations more objectively</li>
              <li>• <strong>Hope activation:</strong> Seeing recovery stories rewires your belief in possibility</li>
            </ul>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold mb-4 text-white">Real Community Stories</h3>
            <div className="space-y-4">
              <p className="text-gray-300 italic">
                "I posted about my 30-day no-contact milestone at 2am, feeling like nobody cared. By morning I had 47 comments celebrating with me. I wasn't alone anymore." — Jessica, 26
              </p>
              <p className="text-gray-300 italic">
                "Someone shared a ritual about writing letters you never send. I tried it and it became my biggest breakthrough tool. I never would have found that on my own." — David, 33
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">Building Your Digital Support Network</h2>
          
          <p className="mb-4">
            Traditional <em>breakup support groups</em> require showing up at specific times and places. Digital peer support works around your schedule and emotional readiness.
          </p>

          <p className="mb-4">
            The key is consistency — even small daily interactions build the connection and trust that makes peer support powerful.
          </p>

          <p className="mb-6">
            CTRL+ALT+BLOCK creates this through integrated features that make community support feel natural, not forced. You're not just joining a group — you're joining a movement of people choosing healing over heartbreak.
          </p>

          <p className="text-xl mb-8 leading-relaxed">
            <strong>Breakup support groups</strong> don't have to be formal to be effective. With CTRL+ALT+BLOCK, your peer network is always a tap away — ready to validate, encourage, and celebrate your progress, one post at a time.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 my-12">
          <h3 className="text-2xl font-bold mb-4 text-center">Ready to Find Your Healing Community?</h3>
          <p className="text-gray-300 text-center mb-6">
            Connect with others who understand your journey and discover the power of peer support in your recovery.
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
              className="block p-6 border border-gray-700 rounded-xl hover:border-green-500/50 transition-all duration-200 group"
            >
              <h4 className="font-semibold mb-2 group-hover:text-green-400 transition-colors">
                How Micro-Healing Changes Can Lead to Massive Emotional Shifts
              </h4>
              <p className="text-gray-400 text-sm">
                Small, consistent actions that rewire your brain for lasting recovery...
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
