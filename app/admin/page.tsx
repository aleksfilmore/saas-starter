"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import { 
  Brain, Zap, Users, ArrowRight, 
  Sparkles, ChevronDown, 
  ChevronUp, Quote, Gamepad2, CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [postReactions, setPostReactions] = useState<Record<string, number>>({});
  const [isPaused, setIsPaused] = useState(false);

  const healingInsights = [
    {
      id: '1',
      content: "The 2-minute attachment quiz revealed I'm 'anxious-avoidant' - finally understanding my patterns is helping me heal faster.",
      type: 'insight',
      reactions: 23,
      replies: 8,
      timeAgo: '2h ago',
      archetype: 'seeker'
    },
    {
      id: '2',
      content: "Quiz showed me I'm a 'phantom' type. The personalized healing plan feels like it was written just for me.",
      type: 'breakthrough',
      reactions: 45,
      replies: 12,
      timeAgo: '4h ago',
      archetype: 'phantom'
    },
    {
      id: '3',
      content: "Took the quiz 3 times over 2 months - watching my healing archetype evolve from 'wounded' to 'warrior' is incredible.",
      type: 'victory',
      reactions: 67,
      replies: 15,
      timeAgo: '6h ago',
      archetype: 'warrior'
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentPostIndex((prev) => (prev + 1) % healingInsights.length);
    }, 5000); // Change post every 5 seconds

    return () => clearInterval(interval);
  }, [healingInsights.length, isPaused]);

  // Animated reactions
  useEffect(() => {
    const reactionInterval = setInterval(() => {
      const currentPost = healingInsights[currentPostIndex];
      if (currentPost) {
        setPostReactions(prev => ({
          ...prev,
          [currentPost.id]: (prev[currentPost.id] || currentPost.reactions) + 1
        }));
      }
    }, 5000); // Add reaction every 5 seconds

    return () => clearInterval(reactionInterval);
  }, [currentPostIndex, healingInsights]);

  const faqs = [
    {
      question: "What is CTRL+ALT+BLOCK?",
      answer: "CTRL+ALT+BLOCK is a digital healing platform designed specifically for people recovering from toxic relationships and heartbreak. We combine evidence-based psychology with gamification to make the healing process engaging and effective."
    },
    {
      question: "How does the REFORMAT PROTOCOL work?",
      answer: "The REFORMAT PROTOCOL is our systematic approach to heartbreak recovery. It includes personalized daily rituals, AI-powered therapy tools, anonymous community support, and gamified progress tracking with XP, levels, and achievements."
    },
    {
      question: "Is my identity really anonymous?",
      answer: "Yes. You create a digital alias (codename) that protects your real identity. All community interactions use only your chosen codename. Your personal healing data is encrypted and never shared with other users."
    },
    {
      question: "What happens in an emergency or crisis?",
      answer: "We have built-in emergency protocols including crisis hotline access, guided breathing exercises, and emergency affirmations. Our platform also connects you to professional mental health resources when needed."
    },
    {
      question: "How secure is my payment information?",
      answer: "We use industry-standard encryption and work with trusted payment processors. Your financial data is never stored on our servers and all transactions are processed securely through verified third-party payment gateways."
    },
    {
      question: "What happens after I complete the 30-day program?",
      answer: "After completing the core program, you can continue with our advanced modules, become a community mentor, or access our maintenance mode with weekly check-ins. Many users choose to stay connected to support others in their healing journey."
    }
  ];

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Track Your Progress Like an RPG",
      description: "Stay motivated with milestones, streaks, and rewards as you level up your healing journey.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="h-8 w-8" />, 
      title: "24/7 AI Therapy Tools", 
      description: "Get instant emotional support with closure simulators, reframing tools, and personalized therapy sessions.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Anonymous Community",
      description: "Share your story and connect with others who understand, all while protecting your privacy completely.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Crisis Support",
      description: "Access emergency protocols and professional mental health resources whenever you need them most.",
      gradient: "from-red-500 to-orange-500"
    }
  ];  const handlePostClick = (postId: string) => {
    // For now, redirect to sign-in. In production, this could open a modal
    window.location.href = '/quiz';
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'victory': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'confession': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getArchetypeEmoji = (archetype?: string) => {
    switch (archetype) {
      case 'firewall': return '🛡️';
      case 'ghost': return '👻';
      case 'secure': return '🔒';
      default: return '💭';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.png)',
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-purple-900/75 to-blue-900/85" />
      
      {/* Content */}
      <div className="relative z-10">{/* Simple Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 hover:bg-gray-800/90">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-3 sm:py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-white hover:text-purple-400 text-sm md:text-base px-3 sm:px-4 py-2 transition-colors">
                  Sign In
                </Button>
              </Link>
              <Link href="/quiz">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm md:text-base px-4 sm:px-6 py-2 transition-all hover:scale-105 font-semibold">
                  Start Healing
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="space-y-8">
            {/* Main Motto */}
            <div className="text-center mb-8">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text mb-4 tracking-wide">
                UNINSTALL YOUR EX.
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                INSTALL YOUR NEW SELF.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Your daily AI-powered recovery program starts here.
            </p>

            {/* Quiz CTA - Primary */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-2xl p-8 max-w-2xl mx-auto mb-8">
              <div className="text-center space-y-4">
                <div className="text-4xl mb-2">🧠</div>
                <h3 className="text-2xl font-bold text-white">Start Your System Scan</h3>
                <p className="text-gray-300 text-lg">
                  Discover your attachment style and get your personalized healing protocol
                </p>
                
                {/* Visual Flow: Scan → Rituals → Progress */}
                <div className="flex items-center justify-center space-x-4 my-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                      🔍
                    </div>
                    <span className="text-xs text-gray-400">SCAN</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-400" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                      🎯
                    </div>
                    <span className="text-xs text-gray-400">RITUALS</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-400" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                      📈
                    </div>
                    <span className="text-xs text-gray-400">PROGRESS</span>
                  </div>
                </div>
                
                {/* Animated Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" 
                       style={{
                         width: '100%',
                         animation: 'progress 3s ease-in-out infinite'
                       }}>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-6">Progress: 0% → 100% in just 60 seconds</p>

                <Link href="/quiz">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xl px-12 py-6 text-white border-0 shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-110 transition-all duration-300 font-bold"
                  >
                    <Brain className="h-7 w-7 mr-3" />
                    Start Free Scan →
                  </Button>
                </Link>

                {/* Badge Bar */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mt-6">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">FREE</Badge>
                  <span>•</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">ANONYMOUS</Badge>
                  <span>•</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">60-SEC RESULTS</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-in" className="text-gray-400 hover:text-white transition-colors text-lg">
                Already a member? Sign in →
              </Link>
            </div>
          </div>
        </div>
      </div>

      
      {/* Featured Blog Articles */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-900/20 to-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              <Brain className="h-8 w-8 inline mr-3 text-purple-400" />
              Latest Healing Insights
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Evidence-based articles and real recovery stories to guide your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/blog/7-stages-breakup-healing">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105 group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      The 7 Stages of Breakup Healing
                    </h3>
                    <p className="text-gray-400 text-sm">Science-based guide to recovery</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/neuroplasticity-heartbreak-recovery">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105 group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Neuroplasticity & Recovery
                    </h3>
                    <p className="text-gray-400 text-sm">How your brain heals itself</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/sarah-recovery-story">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105 group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      From Devastation to Dream Life
                    </h3>
                    <p className="text-gray-400 text-sm">Sarah's transformation story</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                Read All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Healing Path Quiz Preview */}
      <div className="bg-gradient-to-b from-gray-900 to-purple-900/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <Sparkles className="h-8 w-8 inline mr-3 text-pink-400" />
            Discover Your Healing Path
          </h2>
          <p className="text-gray-400 text-lg">
            Real healing moments from our anonymous community
          </p>
          
          {/* Pause/Play Control */}
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="text-gray-400 hover:text-white border border-gray-600 hover:border-purple-400"
            >
              {isPaused ? '▶️ Play' : '⏸️ Pause'} Auto-scroll
            </Button>
          </div>
        </div>

        {/* Auto-scroll carousel container */}
        <div className="relative overflow-hidden mb-8">
          <div className="flex transition-transform duration-1000 ease-in-out"
               style={{ transform: `translateX(-${currentPostIndex * 100}%)` }}>
            {healingInsights.map((post, index) => (
              <div key={post.id} className="w-full flex-shrink-0 px-4">
                <Card 
                  className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 max-w-2xl mx-auto cursor-pointer hover:scale-105"
                  onClick={() => handlePostClick(post.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="text-2xl">
                        {getArchetypeEmoji(post.archetype)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`text-xs ${getTypeColor(post.type)} border`}>
                            {post.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-400">{post.timeAgo}</span>
                        </div>
                        <Quote className="h-4 w-4 text-gray-400 mb-2" />
                        <p className="text-gray-300 leading-relaxed mb-4">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center text-red-400 transition-all duration-300">
                            🔥 {postReactions[post.id] || post.reactions}
                            {postReactions[post.id] > post.reactions && (
                              <span className="ml-1 text-green-400 animate-pulse">+1</span>
                            )}
                          </span>
                          <span className="flex items-center text-blue-400">
                            💬 {post.replies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Carousel indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {healingInsights.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPostIndex ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/quiz">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Take the Quiz →
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gradient-to-b from-purple-900/30 to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why CTRL+ALT+BLOCK Works
          </h2>
          <p className="text-gray-400 text-lg">
            Revolutionary healing through the psychology of gaming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105 cursor-pointer">
              <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Powered by CBT, attachment theory & gamification
          </p>
        </div>
        </div>
      </div>

      {/* Blog Section - Featured Articles */}
      <div className="bg-gradient-to-b from-purple-900/30 to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <Brain className="h-8 w-8 inline mr-3 text-purple-400" />
              The Healing Blog
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Evidence-based insights and real recovery stories to guide your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* The 7 Stages of Breakup Healing */}
            <Link href="/blog/7-stages-breakup-healing">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-cover bg-center relative overflow-hidden" style={{backgroundImage: 'url(/The 7 Stages of Breakup Healing.png)'}}>
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-purple-600/80 text-white text-xs">HEALING.EXE</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-purple-300 border-purple-400/50 bg-purple-900/30 mb-3 text-xs">
                      HEALING
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                      The 7 Stages of Breakup Healing
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Breaking up isn't just losing a person — it's losing a whole rhythm of your life. Learn the psychological stages.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>8 min read</span>
                      <span>3.4k views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 30 Days No Contact Survival */}
            <Link href="/blog/30-days-no-contact-survival">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-cover bg-center relative overflow-hidden" style={{backgroundImage: 'url(/Day-by-Day Survival Guide for Your First 30 Days of No Contact.png)'}}>
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-blue-600/80 text-white text-xs">NO-CONTACT.EXE</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-blue-300 border-blue-400/50 bg-blue-900/30 mb-3 text-xs">
                      NO CONTACT
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                      30 Days No Contact Survival Guide
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      The first 30 days can feel like a marathon you didn't train for. Get a complete day-by-day breakdown.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>8 min read</span>
                      <span>4.7k views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Rewire Brain for Love */}
            <Link href="/blog/rewire-brain-for-love">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-cover bg-center relative overflow-hidden" style={{backgroundImage: 'url(/Science-Backed Ways to Rewire Your Brain for Love Again.png)'}}>
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-green-600/80 text-white text-xs">NEURO.EXE</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-green-300 border-green-400/50 bg-green-900/30 mb-3 text-xs">
                      HEALING
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all">
                      Rewire Your Brain for Love Again
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Thanks to neuroplasticity, you can literally reprogram your mind to trust, feel joy, and open up again.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>7 min read</span>
                      <span>2.8k views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-purple-600/80 text-white text-xs">HEALING.EXE</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-purple-300 border-purple-400/50 bg-purple-900/30 mb-3 text-xs">
                      HEALING
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                      The 7 Stages of Breakup Healing
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Breaking up isn't just losing a person — it's losing a whole rhythm of your life. Learn the psychological stages.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>8 min read</span>
                      <span>3.4k views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 30 Days No Contact Survival */}
            <Link href="/blog/30-days-no-contact-survival">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-cover bg-center relative overflow-hidden" style={{backgroundImage: 'url(/Day-by-Day Survival Guide for Your First 30 Days of No Contact.png)'}}>
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-blue-600/80 text-white text-xs">NO-CONTACT.EXE</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-blue-300 border-blue-400/50 bg-blue-900/30 mb-3 text-xs">
                      NO CONTACT
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                      30 Days No Contact Survival Guide
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      The first 30 days can feel like a marathon you didn't train for. Get a complete day-by-day breakdown.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>8 min read</span>
                      <span>4.7k views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Rewire Brain for Love */}
            <Link href="/blog/rewire-brain-for-love">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-cover bg-center relative overflow-hidden" style={{backgroundImage: 'url(/Science-Backed Ways to Rewire Your Brain for Love Again.png)'}}>
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-green-600/80 text-white text-xs">NEURO.EXE</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-green-300 border-green-400/50 bg-green-900/30 mb-3 text-xs">
                      HEALING
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all">
                      Rewire Your Brain for Love Again
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Thanks to neuroplasticity, you can literally reprogram your mind to trust, feel joy, and open up again.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>7 min read</span>
                      <span>2.8k views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-purple-600/80 text-white text-xs">HEALING.EXE</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-purple-300 border-purple-400/50 bg-purple-900/30 mb-3 text-xs">
                      HEALING
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                      The 7 Stages of Breakup Healing
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Learn the psychological stages of healing and proven ways to navigate them without getting stuck.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>8 min read</span>
                      <div className="flex items-center text-purple-400">
                        Read More <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Featured Self-Care Article */}
            <Link href="/blog/self-care-rituals-stop-overthinking">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-green-600/80 text-white text-xs">SELFCARE.APP</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-green-300 border-green-400/50 bg-green-900/30 mb-3 text-xs">
                      SELF-CARE
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all">
                      Stop Breakup Overthinking at Night
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Learn proven nighttime self-care rituals that calm your mind and help you sleep better after a breakup.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>8 min read</span>
                      <div className="flex items-center text-green-400">
                        Read More <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Featured Community Article */}
            <Link href="/blog/peer-support-healing-heartbreak">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-orange-500 via-yellow-600 to-orange-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-orange-600/80 text-white text-xs">CONNECT.NET</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge className="text-orange-300 border-orange-400/50 bg-orange-900/30 mb-3 text-xs">
                      COMMUNITY
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-yellow-400 group-hover:bg-clip-text transition-all">
                      The Power of Peer Support in Healing
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Research shows that community support accelerates recovery. Discover how connection transforms healing.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>6 min read</span>
                      <div className="flex items-center text-orange-400">
                        Read More <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/blog">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold">
                <Brain className="h-5 w-5 mr-2" />
                Read More Articles →
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              Evidence-based recovery insights • Updated weekly
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-b from-gray-900 to-purple-900/20 py-20">
        <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about healing with CTRL+ALT+BLOCK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden h-fit">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-all duration-300 group"
                >
                  <h3 className="text-lg font-semibold text-white pr-4 group-hover:text-purple-300 transition-colors">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-6 w-6 text-purple-400 flex-shrink-0 transform transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-purple-400 flex-shrink-0 transform transition-transform duration-300 group-hover:scale-110" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 border-t border-gray-600/30 bg-gray-900/20">
                    <div className="pt-4">
                      <p className="text-gray-300 leading-relaxed text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Help CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-300 mb-6">
                Join our community or contact our support team for personalized help
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/20">
                    Join Community
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-b from-purple-900/20 to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Healing Journey in 4 Steps
          </h2>
          <p className="text-gray-400 text-lg">
            From heartbreak to breakthrough - here's how we guide you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "SCAN",
              description: "Map attachment pattern",
              time: "(60s)",
              link: "/quiz"
            },
            {
              step: "02", 
              title: "RITUALS",
              description: "Complete daily healing tasks",
              time: "(5 min/day)",
              link: "/features"
            },
            {
              step: "03",
              title: "LEVEL UP",
              description: "Earn XP and achievements",
              time: "(XP Milestones)",
              link: "/features"
            },
            {
              step: "04",
              title: "BREAK FREE",
              description: "Graduate healed and stronger",
              time: "(30 days)",
              link: "/features"
            }
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <Card className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 h-full">
                <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl font-black text-purple-400 mb-6">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-purple-400 font-semibold mb-3">
                      {item.time}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-b from-gray-900 to-purple-900/20 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Healing Mode
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Two powerful approaches to recovery. Both include our full healing protocol—choose the level of support that fits your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ghost Mode */}
            <Card className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 relative">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">👻</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ghost Mode</h3>
                  <p className="text-gray-400 text-sm mb-6">Silent healing with essential tools</p>
                  
                  <div className="text-4xl font-bold text-gray-300 mb-6">
                    Free<span className="text-lg text-gray-400 font-normal"> forever</span>
                  </div>

                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Daily personalized rituals
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      10 AI therapy sessions/month
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Anonymous community access
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Progress tracking & XP
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Crisis support tools
                    </li>
                  </ul>

                  <Link href="/quiz">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      Start Ghost Mode
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Firewall Mode */}
            <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/50 hover:border-pink-400 transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Firewall Mode</h3>
                  <p className="text-gray-400 text-sm mb-6">Maximum protection & unlimited support</p>
                  
                  <div className="text-4xl font-bold text-white mb-6">
                    $9.99<span className="text-lg text-gray-400 font-normal">/month</span>
                  </div>

                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Everything in Ghost Mode
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <strong>Unlimited</strong> AI therapy sessions
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Priority crisis support
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Advanced progress analytics
                    </li>
                    <li className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      Early access to new features
                    </li>
                  </ul>

                  <Link href="/quiz">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                      Start Firewall Mode
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              🔒 30-day money-back guarantee • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-b from-gray-900 to-purple-900/30 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Start your healing journey today — free to join, cancel anytime.
          </p>
          
          {/* Primary and Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Link href="/quiz">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12 py-4 text-lg text-white border-0 hover:scale-105 transition-all font-bold"
              >
                Start Free Scan
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button 
                variant="outline"
                size="lg"
                className="border-gray-500 text-gray-300 hover:text-white hover:border-purple-400 px-8 py-4 text-lg transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400">Start free. Upgrade anytime.</p>
        </div>
        </div>
      </div>

    </div>

      <SiteFooter />
      </div>

    </div>
  );
}