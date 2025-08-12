"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, ArrowRight, 
  Heart, Brain, Shield, Zap, Clock, Eye
} from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Healing', 'No Contact', 'Self-Care', 'Community', 'Tips'];

  const blogPosts = [
    {
      id: 1,
      title: "The 7 Stages of Breakup Healing (And How to Move Through Them Faster)",
      excerpt: "Breaking up isn't just losing a person — it's losing a whole rhythm of your life. Learn the psychological stages of healing and proven ways to navigate them without getting stuck.",
      category: "Healing",
      author: "CTRL+ALT+BLOCK",
      date: "2025-08-10",
      readTime: "8 min read",
      views: "3.4k",
      featured: true,
      image: "/The 7 Stages of Breakup Healing.png",
      slug: "7-stages-breakup-healing"
    },
    {
      id: 2,
      title: "Day-by-Day Survival Guide for Your First 30 Days of No Contact",
      excerpt: "The first 30 days of no contact can feel like a marathon you didn't train for. Get a complete day-by-day breakdown with actionable strategies for each phase of your journey.",
      category: "No Contact",
      author: "CTRL+ALT+BLOCK",
      date: "2025-01-15",
      readTime: "8 min read",
      views: "4.7k",
      featured: false,
      image: "/Day-by-Day Survival Guide for Your First 30 Days of No Contact.png",
      slug: "30-days-no-contact-survival"
    },
    {
      id: 3,
      title: "Why Breaking No Contact Always Hurts More Than Staying Strong",
      excerpt: "Breaking no contact isn't just a setback in your recovery; it can reset your emotional progress to day one. Learn why staying strong protects your healing journey.",
      category: "No Contact",
      author: "CTRL+ALT+BLOCK",
      date: "2025-01-18",
      readTime: "7 min read",
      views: "3.9k",
      featured: false,
      image: "/Why Breaking No Contact Always Hurts More Than Staying Strong.png",
      slug: "breaking-no-contact-consequences"
    },
    {
      id: 4,
      title: "Texting Temptations: How to Beat the Urge to Reach Out to Your Ex",
      excerpt: "The urge to text your ex can hit like lightning. Here's your step-by-step guide to outsmarting the temptation before your thumbs betray you.",
      category: "No Contact",
      author: "CTRL+ALT+BLOCK",
      date: "2025-01-20",
      readTime: "7 min read",
      views: "3.2k",
      featured: false,
      image: "/How to Beat the Urge to Reach Out to Your Ex.png",
      slug: "urge-to-text-ex-how-to-stop"
    },
    {
      id: 5,
      title: "The Neuroscience of Silence: What Happens in Their Brain When You Go No Contact",
      excerpt: "The psychology of no contact isn't about playing games — it's about letting both nervous systems detach from emotional dependency. Here's the science.",
      category: "No Contact",
      author: "CTRL+ALT+BLOCK",
      date: "2025-01-22",
      readTime: "8 min read",
      views: "2.9k",
      featured: false,
      image: "/What Happens in Their Brain When You Go No Contact.png",
      slug: "neuroscience-no-contact-brain"
    },
    {
      id: 6,
      title: "Science-Backed Ways to Rewire Your Brain for Love Again",
      excerpt: "After a breakup, your brain goes through withdrawal. Thanks to neuroplasticity, you can literally reprogram your mind to trust, feel joy, and open up to connection again.",
      category: "Healing",
      author: "CTRL+ALT+BLOCK",
      date: "2025-08-05",
      readTime: "7 min read",
      views: "2.8k",
      featured: false,
      image: "/Science-Backed Ways to Rewire Your Brain for Love Again.png",
      slug: "rewire-brain-for-love"
    },
    {
      id: 7,
      title: "How to Spot (and Stop) Emotional Relapses During Breakup Recovery",
      excerpt: "Recovery isn't a straight line. Learn to recognize when you're sliding backward and develop rapid-response strategies to get back on track before the spiral deepens.",
      category: "Healing",
      author: "CTRL+ALT+BLOCK",
      date: "2025-07-28",
      readTime: "6 min read",
      views: "2.1k",
      featured: false,
      image: "/How to Spot (and Stop) Emotional Relapses During Breakup Recovery.png",
      slug: "emotional-relapses-recovery"
    },
    {
      id: 8,
      title: "The Self-Care Rituals That Stop Breakup Overthinking at Night",
      excerpt: "You crawl into bed hoping for rest — but your brain has other plans. Learn proven nighttime self-care rituals that calm your mind and help you sleep better after a breakup.",
      category: "Self-Care",
      author: "CTRL+ALT+BLOCK",
      date: "2025-08-12",
      readTime: "8 min read",
      views: "3.2k",
      featured: true,
      image: "/The Self-Care Rituals That Stop Breakup Overthinking at Night.png",
      slug: "self-care-rituals-stop-overthinking"
    },
    {
      id: 9,
      title: "How Micro-Healing Changes Can Lead to Massive Emotional Shifts",
      excerpt: "Small, consistent actions that rewire your brain for lasting recovery. Discover how micro-healing creates compound emotional growth and transforms your healing journey.",
      category: "Self-Care",
      author: "CTRL+ALT+BLOCK",
      date: "2025-08-10",
      readTime: "7 min read",
      views: "2.9k",
      featured: false,
      image: "/How Micro-Healing Changes Can Lead to Massive Emotional Shifts.png",
      slug: "micro-healing-emotional-shifts"
    },
    {
      id: 10,
      title: "The Power of Peer Support in Healing from Heartbreak",
      excerpt: "Research shows that breakup support groups and peer connections accelerate recovery. Discover how community support can transform your healing journey.",
      category: "Community",
      author: "CTRL+ALT+BLOCK",
      date: "2025-08-08",
      readTime: "6 min read",
      views: "4.1k",
      featured: false,
      image: "/The Power of Peer Support in Healing from Heartbreak.png",
      slug: "peer-support-healing-heartbreak"
    },
    {
      id: 11,
      title: "10 Quick Breakup Hacks That Stop You from Texting Your Ex",
      excerpt: "When the urge to reach out hits, logic often loses to muscle memory. Learn proven strategies to resist the urge and protect your healing progress.",
      category: "Tips",
      author: "CTRL+ALT+BLOCK",
      date: "2025-08-06",
      readTime: "5 min read",
      views: "5.7k",
      featured: false,
      image: "/10 Quick Breakup Hacks That Stop You from Texting Your Ex.png",
      slug: "breakup-hacks-stop-texting-ex"
    },
    {
      id: 12,
      title: "The Breakup Emergency Kit: What to Do When You're Spiraling",
      excerpt: "One text, one sighting, or one late-night scroll can send you into an emotional freefall. Build your emergency toolkit to stop spirals before they start.",
      category: "Tips",
      author: "CTRL+ALT+BLOCK",
      date: "2025-08-04",
      readTime: "6 min read",
      views: "4.8k",
      featured: false,
      image: "/The Breakup Emergency Kit What to Do When You're Spiraling.png",
      slug: "breakup-emergency-kit-spiraling"
    }
  ];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Brain className="h-10 w-10 mr-3 text-purple-400" />
            The Healing Blog
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Evidence-based insights, community stories, and practical wisdom for your breakup recovery journey
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`font-mono font-bold tracking-wider transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category 
                  ? category === 'Healing' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-purple-400' :
                    category === 'No Contact' ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-red-400' :
                    category === 'Self-Care' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-green-400' :
                    category === 'Community' ? 'bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white border-orange-400' :
                    category === 'Tips' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-cyan-400' :
                    'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-purple-400'
                  : `border-gray-600 text-gray-300 hover:text-white hover:border-${
                      category === 'Healing' ? 'purple' :
                      category === 'No Contact' ? 'red' :
                      category === 'Self-Care' ? 'green' :
                      category === 'Community' ? 'pink' :
                      category === 'Tips' ? 'yellow' : 'purple'
                    }-400 hover:bg-${
                      category === 'Healing' ? 'purple' :
                      category === 'No Contact' ? 'red' :
                      category === 'Self-Care' ? 'green' :
                      category === 'Community' ? 'pink' :
                      category === 'Tips' ? 'yellow' : 'purple'
                    }-900/30`
              }`}
            >
              {category.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <Card className="bg-gray-800/50 border-gray-600 mb-12 overflow-hidden hover:border-purple-400 transition-all duration-300">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-purple-800/30 p-8 lg:p-12 flex items-center relative">
                  {/* Glitch effect overlay */}
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-4 py-2 rounded-full font-mono font-bold tracking-wider">
                        ★ FEATURED
                      </span>
                      <span className="text-purple-300 text-sm ml-3 font-mono">{featuredPost.category.toUpperCase()}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-400 mb-6 font-mono">
                      <User className="h-4 w-4 mr-2" />
                      <span className="mr-4">{featuredPost.author}</span>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="mr-4">{featuredPost.date}</span>
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="mr-4">{featuredPost.readTime}</span>
                      <Eye className="h-4 w-4 mr-2" />
                      <span>{featuredPost.views}</span>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                      <Link href={`/blog/${featuredPost.slug}`} className="flex items-center">
                        Read Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center relative overflow-hidden aspect-square">
                  {/* Featured article image */}
                  {featuredPost.image && (
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  )}
                  
                  {/* Glitch effect */}
                  <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
                  
                  {/* Neon accent border */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-blue-400 shadow-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block">
              <Card className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-[1.02]">
                <CardContent className="p-0">
                  {/* Image with overlay effects */}
                  <div className={`aspect-square flex items-center justify-center relative overflow-hidden ${
                    post.category === 'Healing' ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800' :
                    post.category === 'No Contact' ? 'bg-gradient-to-br from-red-600 via-pink-600 to-purple-700' :
                    post.category === 'Self-Care' ? 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700' :
                    post.category === 'Community' ? 'bg-gradient-to-br from-orange-500 via-yellow-600 to-orange-700' :
                    post.category === 'Tips' ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-700' :
                    'bg-gradient-to-br from-gray-700 to-gray-800'
                  }`}>
                    {/* Article image */}
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    )}
                    
                    {/* Glitch effect overlay */}
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    
                    {/* Category tech label overlay */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <div className={`text-white/90 text-xs font-mono tracking-wider px-2 py-1 rounded ${
                        post.category === 'Healing' ? 'bg-purple-600/80' :
                        post.category === 'No Contact' ? 'bg-red-600/80' :
                        post.category === 'Self-Care' ? 'bg-green-600/80' :
                        post.category === 'Community' ? 'bg-pink-600/80' :
                        post.category === 'Tips' ? 'bg-yellow-600/80' :
                        'bg-gray-600/80'
                      }`}>
                        {post.category === 'Healing' && 'HEALING.EXE'}
                        {post.category === 'No Contact' && 'BLOCK.SYS'}
                        {post.category === 'Self-Care' && 'SELFCARE.APP'}
                        {post.category === 'Community' && 'CONNECT.NET'}
                        {post.category === 'Tips' && 'TIPS.BAT'}
                      </div>
                    </div>
                    
                    {/* Neon accent border */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                      post.category === 'Healing' ? 'bg-gradient-to-r from-purple-400 to-blue-400' :
                      post.category === 'No Contact' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                      post.category === 'Self-Care' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                      post.category === 'Community' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
                      post.category === 'Tips' ? 'bg-gradient-to-r from-cyan-400 to-blue-400' :
                      'bg-gradient-to-r from-gray-400 to-gray-500'
                    } shadow-lg`}></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCategory(post.category);
                        }}
                        className={`text-sm font-mono font-bold px-3 py-1 rounded-full border cursor-pointer hover:scale-105 transition-all z-10 relative ${
                          post.category === 'Healing' ? 'text-purple-300 border-purple-400/50 bg-purple-900/30 hover:border-purple-400 hover:bg-purple-900/50' :
                          post.category === 'No Contact' ? 'text-red-300 border-red-400/50 bg-red-900/30 hover:border-red-400 hover:bg-red-900/50' :
                          post.category === 'Self-Care' ? 'text-green-300 border-green-400/50 bg-green-900/30 hover:border-green-400 hover:bg-green-900/50' :
                          post.category === 'Community' ? 'text-pink-300 border-pink-400/50 bg-pink-900/30 hover:border-pink-400 hover:bg-pink-900/50' :
                          post.category === 'Tips' ? 'text-yellow-300 border-yellow-400/50 bg-yellow-900/30 hover:border-yellow-400 hover:bg-yellow-900/50' :
                          'text-gray-300 border-gray-400/50 bg-gray-900/30 hover:border-gray-400 hover:bg-gray-900/50'
                        }`}
                      >
                        {post.category.toUpperCase()}
                      </button>
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views}
                      </div>
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {post.date}
                      </span>
                      <div className="flex items-center text-purple-400 group-hover:text-white transition-colors text-sm font-medium">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Your Healing Journey?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Take our personalized breakup recovery quiz and get matched with the perfect healing tools for your situation.
              </p>
              <Link href="/quiz">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4">
                  Start Your Healing Journey →
                </Button>
              </Link>
              <p className="text-xs text-gray-400 mt-3">
                Personalized recommendations • Science-backed approach • Free to start
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Community Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Follow Our Journey</h3>
          <p className="text-gray-300 mb-6">
            Get daily healing tips, real stories, and behind-the-scenes content on TikTok
          </p>
          <div className="flex justify-center">
            <a 
              href="https://tiktok.com/@ctrlaltblock" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold rounded-lg transition-all transform hover:scale-105"
            >
              <span className="mr-2">📱</span>
              @ctrlaltblock on TikTok
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
