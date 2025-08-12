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
      title: "The Science Behind No-Contact: Why Going Silent Actually Works",
      excerpt: "Research shows that no-contact isn't just about avoiding your ex - it's about rewiring your brain for healing. Learn the neuroscience behind why silence is your superpower.",
      category: "No Contact",
      author: "Dr. Sarah Chen",
      date: "2024-01-15",
      readTime: "8 min read",
      views: "2.1k",
      featured: true,
      image: "/blog/no-contact-science.jpg"
    },
    {
      id: 2,
      title: "Daily Rituals That Actually Heal: Moving Beyond 'Just Get Over It'",
      excerpt: "Discover evidence-based daily practices that help process grief, build resilience, and create new neural pathways for emotional strength.",
      category: "Healing",
      author: "Maya Rodriguez",
      date: "2024-01-12",
      readTime: "6 min read",
      views: "1.8k",
      featured: false,
      image: "/blog/daily-rituals.jpg"
    },
    {
      id: 3,
      title: "When Your Ex Reaches Out: A Strategic Guide to Boundary Setting",
      excerpt: "They texted. Now what? Navigate contact attempts with confidence using our framework for protecting your healing journey.",
      category: "No Contact",
      author: "Alex Morgan",
      date: "2024-01-10",
      readTime: "5 min read",
      views: "3.2k",
      featured: false,
      image: "/blog/boundary-setting.jpg"
    },
    {
      id: 4,
      title: "Building Your Support Network: Why Community Matters in Healing",
      excerpt: "Healing isn't a solo journey. Learn how to build authentic connections and find your tribe during your recovery process.",
      category: "Community",
      author: "Jordan Kim",
      date: "2024-01-08",
      readTime: "7 min read",
      views: "1.5k",
      featured: false,
      image: "/blog/support-network.jpg"
    },
    {
      id: 5,
      title: "The Wall of Wounds: How Shared Stories Create Collective Healing",
      excerpt: "Discover how our community platform transforms individual pain into collective wisdom, and why sharing your story matters.",
      category: "Community",
      author: "Riley Thompson",
      date: "2024-01-05",
      readTime: "4 min read",
      views: "2.7k",
      featured: false,
      image: "/blog/wall-of-wounds.jpg"
    },
    {
      id: 6,
      title: "Micro-Habits for Macro-Healing: Small Changes, Big Impact",
      excerpt: "You don't need to overhaul your entire life to heal. These tiny daily shifts can create profound transformation over time.",
      category: "Self-Care",
      author: "Dr. Marcus Webb",
      date: "2024-01-03",
      readTime: "6 min read",
      views: "1.9k",
      featured: false,
      image: "/blog/micro-habits.jpg"
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
              className={`
                ${selectedCategory === category 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'border-gray-600 text-gray-300 hover:text-white hover:border-purple-400'
                }
              `}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <Card className="bg-gray-800/50 border-gray-600 mb-12 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-8 lg:p-12 flex items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                        Featured
                      </span>
                      <span className="text-purple-400 text-sm ml-3">{featuredPost.category}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-400 mb-6">
                      <User className="h-4 w-4 mr-2" />
                      <span className="mr-4">{featuredPost.author}</span>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="mr-4">{new Date(featuredPost.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="mr-4">{featuredPost.readTime}</span>
                      <Eye className="h-4 w-4 mr-2" />
                      <span>{featuredPost.views}</span>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-8">
                  <div className="text-center">
                    <Brain className="h-24 w-24 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-300">Featured Article Image</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-all duration-300 overflow-hidden group">
              <CardContent className="p-0">
                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-48 flex items-center justify-center">
                  {post.category === 'Healing' && <Heart className="h-12 w-12 text-pink-400" />}
                  {post.category === 'No Contact' && <Shield className="h-12 w-12 text-green-400" />}
                  {post.category === 'Self-Care' && <Zap className="h-12 w-12 text-purple-400" />}
                  {post.category === 'Community' && <User className="h-12 w-12 text-blue-400" />}
                  {post.category === 'Tips' && <Brain className="h-12 w-12 text-yellow-400" />}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-purple-400 text-sm font-medium">{post.category}</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views}
                    </div>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-3 group-hover:text-purple-400 transition-colors leading-tight">
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
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white p-0">
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Never Miss a Healing Insight
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get our latest articles, community highlights, and evidence-based healing tips delivered to your inbox weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                No spam, ever. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Community Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Join the Conversation</h3>
          <p className="text-gray-300 mb-6">
            Connect with our healing community on social media and share your journey
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400">
              <span className="mr-2">📱</span>
              @ctrlaltblock on TikTok
            </Button>
            <Link href="/wall">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-pink-400">
                <Heart className="h-4 w-4 mr-2" />
                Wall of Wounds
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
