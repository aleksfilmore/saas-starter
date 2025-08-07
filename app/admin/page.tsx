"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Shield, Brain, Zap, Users, ArrowRight, Timer, 
  Star, Sparkles, MessageCircle, Heart, ChevronDown, 
  ChevronUp, Quote, Gamepad2, Target
} from 'lucide-react';

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [postReactions, setPostReactions] = useState<Record<string, number>>({});

  const mockWallPosts = [
    {
      id: '1',
      content: "Day 47 no contact. Had a panic attack today but didn't text him. Using the breathing protocol right now and it's actually working.",
      type: 'victory',
      reactions: 23,
      replies: 8,
      timeAgo: '2h ago',
      archetype: 'firewall'
    },
    {
      id: '2', 
      content: "I keep checking his Instagram stories. I know I shouldn't but I can't stop. How do you all resist the urge?",
      type: 'confession',
      reactions: 41,
      replies: 15,
      timeAgo: '4h ago',
      archetype: 'ghost'
    },
    {
      id: '3',
      content: "3 months free and I finally feel like myself again. To anyone reading this in the early days - it DOES get easier. Promise.",
      type: 'victory', 
      reactions: 127,
      replies: 34,
      timeAgo: '6h ago',
      archetype: 'secure'
    },
    {
      id: '4',
      content: "Trigger warning: saw my ex at the coffee shop today. My heart raced but I didn't approach. Used the breathing technique from the app and sat with the feeling. Small wins count.",
      type: 'victory',
      reactions: 34,
      replies: 9,
      timeAgo: '8h ago',
      archetype: 'firewall'
    },
    {
      id: '5',
      content: "Month 3 update: I can finally listen to 'our song' without crying. The AI therapy sessions helped me reframe so many negative thought patterns. Healing isn't linear but it's happening.",
      type: 'victory',
      reactions: 73,
      replies: 15,
      timeAgo: '12h ago',
      archetype: 'secure'
    },
    {
      id: '6',
      content: "PSA: Your ex texting you at 2am drunk is not a sign to get back together. It's a sign that they're still the same person who couldn't prioritize you when it mattered. Stay strong.",
      type: 'confession',
      reactions: 156,
      replies: 31,
      timeAgo: '1d ago',
      archetype: 'firewall'
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPostIndex((prev) => (prev + 1) % mockWallPosts.length);
    }, 5000); // Change post every 5 seconds

    return () => clearInterval(interval);
  }, [mockWallPosts.length]);

  // Animated reactions
  useEffect(() => {
    const reactionInterval = setInterval(() => {
      const currentPost = mockWallPosts[currentPostIndex];
      if (currentPost) {
        setPostReactions(prev => ({
          ...prev,
          [currentPost.id]: (prev[currentPost.id] || currentPost.reactions) + 1
        }));
      }
    }, 5000); // Add reaction every 5 seconds

    return () => clearInterval(reactionInterval);
  }, [currentPostIndex, mockWallPosts]);

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
    }
  ];

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Track Your Progress Like an RPG",
      description: "Level up with XP points, unlock achievements, maintain streaks, and watch your healing stats grow in real-time.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "24/7 AI Therapy Tools", 
      description: "Always-available closure simulators, letter generators, reframing tools, and voice therapy sessions.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Anonymous Community",
      description: "Share struggles and victories on the Wall of Wounds. Connect with others without compromising privacy.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Crisis Support",
      description: "Emergency protocols, breathing exercises, and crisis hotlines available 24/7 when you need them most.",
      gradient: "from-red-500 to-orange-500"
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Simple Header */}
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
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-mono">
                INSTALL YOUR NEW SELF.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              One scan → daily rituals, no-contact tracker, AI therapy.
            </p>

            {/* Quiz CTA - Primary */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-2xl p-8 max-w-2xl mx-auto mb-8">
              <div className="text-center space-y-4">
                <div className="text-4xl mb-2">🧠</div>
                <h3 className="text-2xl font-bold text-white">Start Your System Scan</h3>
                <p className="text-gray-300 text-lg">
                  Discover your attachment style and get your personalized healing protocol
                </p>
                
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xl px-10 py-4 text-white border-0 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 transition-all"
                  >
                    <Brain className="h-6 w-6 mr-3" />
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

      {/* Live Wall of Wounds Preview - Auto-Scroll Carousel */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <Sparkles className="h-8 w-8 inline mr-3 text-pink-400" />
            Live from the Wall of Wounds
          </h2>
          <p className="text-gray-400 text-lg">
            Real healing moments from our anonymous community
          </p>
        </div>

        {/* Auto-scroll carousel container */}
        <div className="relative overflow-hidden mb-8">
          <div className="flex transition-transform duration-1000 ease-in-out"
               style={{ transform: `translateX(-${currentPostIndex * 100}%)` }}>
            {mockWallPosts.map((post, index) => (
              <div key={post.id} className="w-full flex-shrink-0 px-4">
                <Card className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 max-w-2xl mx-auto">
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
            {mockWallPosts.map((_, index) => (
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
          <Link href="/wall">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Read more confessions
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
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
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
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

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about healing with CTRL+ALT+BLOCK
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
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
              icon: <Target className="h-8 w-8" />
            },
            {
              step: "02", 
              title: "RITUALS",
              description: "Complete daily healing tasks",
              time: "(5 min/day)",
              icon: <Timer className="h-8 w-8" />
            },
            {
              step: "03",
              title: "LEVEL UP",
              description: "Earn XP and achievements",
              time: "(XP Milestones)",
              icon: <Zap className="h-8 w-8" />
            },
            {
              step: "04",
              title: "BREAK FREE",
              description: "Graduate healed and stronger",
              time: "(30 days)",
              icon: <Star className="h-8 w-8" />
            }
          ].map((item, index) => (
            <Card key={index} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-black text-purple-400 mb-4">
                  {item.step}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {item.icon}
                  </div>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Healers
          </h2>
          <p className="text-gray-400 text-lg">
            Real results from our community of survivors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              number: "10,000+",
              label: "Active Users",
              description: "People actively healing"
            },
            {
              number: "50,000+", 
              label: "Confessions Shared",
              description: "Anonymous healing moments"
            },
            {
              number: "94%",
              label: "Success Rate*", 
              description: "Users who complete 30 days",
              visual: true
            }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-bold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-gray-400 mb-2">
                {stat.description}
              </div>
              {stat.visual && (
                <div className="w-full bg-gray-700 rounded-full h-3 mx-auto max-w-48">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{width: '94%'}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center text-xs text-gray-500">
          <p>*Self-reported via in-app survey, n = 812. <a href="/methodology" className="underline hover:text-gray-400">View methodology</a></p>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands who've transformed their heartbreak into strength. Your new chapter starts now.
          </p>
          
          {/* Single Button CTA */}
          <div className="mb-4">
            <Link href="/quiz">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12 py-4 text-lg text-white border-0 hover:scale-105 transition-all"
              >
                Start Healing
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400">Start free. Upgrade anytime.</p>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-600/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-xl font-bold text-white">
                <span>CTRL</span>
                <span className="text-gray-400">+</span>
                <span>ALT</span>
                <span className="text-gray-400">+</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform your heartbreak into strength with the world's first gamified recovery platform.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/crisis" className="hover:text-white transition-colors">Crisis Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600/30 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 CTRL+ALT+BLOCK. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}