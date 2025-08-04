"use client";

import React, { useState } from 'react';
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
    }
  ];

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
      title: "AI-Powered Therapy Tools", 
      description: "24/7 access to closure simulators, letter generators, reframing tools, and voice therapy sessions.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Anonymous Community",
      description: "Share struggles and victories on the Wall of Wounds. Connect with others without compromising privacy.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Anonymous & Secure",
      description: "Digital aliases protect your identity while you heal. Share without fear, connect without exposure.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Crisis Support",
      description: "Emergency protocols, breathing exercises, and crisis hotlines available 24/7 when you need them most.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Proven Results",
      description: "Evidence-based psychology meets modern technology. 94% of users report significant improvement in 30 days.",
      gradient: "from-yellow-500 to-orange-500"
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
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                UNINSTALL YOUR EX.
              </span><br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                INSTALL YOUR NEW CODE.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              60-second system scan → maps your attachment style,<br />
              loads daily no-contact rituals, and unlocks AI therapy on demand.
            </p>

            {/* Quiz CTA - Primary */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-2xl p-8 max-w-2xl mx-auto mb-8">
              <div className="text-center space-y-4">
                <div className="text-4xl mb-2">🧠</div>
                <h3 className="text-2xl font-bold text-white">Start Your System Scan</h3>
                <p className="text-gray-300 text-lg">
                  Discover your attachment style and get your personalized healing protocol
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mb-6">
                  <span>✓ Free</span>
                  <span>✓ Anonymous</span>
                  <span>✓ Instant Results</span>
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xl px-10 py-4 text-white border-0 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 transition-all"
                  >
                    <Brain className="h-6 w-6 mr-3" />
                    Start Free Scan →
                  </Button>
                </Link>
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

      {/* Live Wall of Wounds Preview */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockWallPosts.map((post) => (
            <Card key={post.id} className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300">
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
                      <span className="flex items-center text-red-400">
                        🔥 {post.reactions}
                      </span>
                      <span className="flex items-center text-blue-400">
                        💬 {post.replies}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/wall">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Join the Wall of Wounds
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              title: "Choose Your Path",
              description: "Select your healing archetype and create your anonymous digital identity",
              time: "(60s)",
              icon: <Target className="h-8 w-8" />
            },
            {
              step: "02", 
              title: "Daily Rituals",
              description: "Complete personalized daily tasks designed by our psychology experts",
              time: "(5 min/day)",
              icon: <Timer className="h-8 w-8" />
            },
            {
              step: "03",
              title: "Level Up",
              description: "Earn XP, unlock achievements, and track your healing progress",
              time: "(XP Milestones)",
              icon: <Zap className="h-8 w-8" />
            },
            {
              step: "04",
              title: "Break Free",
              description: "Graduate to a healthier, stronger version of yourself",
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
          
          {/* Email + CTA Combo */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
            <input 
              type="email" 
              placeholder="Enter your email..." 
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 text-white border-0 hover:scale-105 transition-all whitespace-nowrap"
            >
              Start Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-400">No spam. Unsubscribe anytime.</p>
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