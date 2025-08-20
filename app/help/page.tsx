"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, 
  ArrowLeft, BookOpen, Video, FileText, MessageCircle,
  Shield, Heart, Zap, Settings, Star, TrendingUp,
  Users, Lock, CreditCard, LifeBuoy, Play
} from 'lucide-react';

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
    </div>
  )
}

export default function HelpCenterPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-400",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Take the Healing Archetype Scan on the homepage. It builds your profile and unlocks your dashboard."
        },
        {
          question: "How do codenames work?",
          answer: "We auto-assign one at sign-up. Don't love it? Tap Generate New until it feels right."
        },
        {
          question: "What does Ghost Mode (free) include?",
          answer: "• No-contact tracker\n• Daily check-in journaling\n• 1 daily ritual (not personalized)\n• Read + like on the Wall\n• Basic badges (limited progress)\n• Progress analytics\n• Optional Chat AI pack ($3.99 / 300 msgs, 30-day validity)"
        },
        {
          question: "What does Firewall include?",
          answer: "Everything in free, plus:\n• 2 daily rituals (personalized)\n• Unlimited Chat AI therapy\n• Voice AI therapy add-on ($9.99 / 15 min, 30-day validity)\n• Post on the Wall\n• Special badges (unlock secret rituals + shop perks)\n• Advanced progress vibes (still private)"
        }
      ]
    },
    {
      title: "Plans & Features",
      icon: <Star className="h-5 w-5" />,
      color: "text-pink-400",
      faqs: [
        {
          question: "Can I switch plans later?",
          answer: "Yes. Upgrade or cancel anytime. Your access follows your billing period."
        },
        {
          question: "Do all users get analytics?",
          answer: "Yes. One progress page for everyone."
        }
      ]
    },
    {
      title: "Daily Rituals",
      icon: <Zap className="h-5 w-5" />,
      color: "text-purple-400",
      faqs: [
        {
          question: "How are rituals assigned?",
          answer: "Ghost: 1/day from the main database (not personalized).\nFirewall: 2/day, personalized to your archetype and recent activity."
        },
        {
          question: "Missed a day?",
          answer: "Keep going. We track patterns, not perfection."
        },
        {
          question: "Can I suggest rituals?",
          answer: "Yes. Send ideas via Contact Support. If it fits the science, we'll consider it."
        }
      ]
    },
    {
      title: "No-Contact Tracker",
      icon: <Shield className="h-5 w-5" />,
      color: "text-green-400",
      faqs: [
        {
          question: "What does it track?",
          answer: "Streaks, slip-ups, milestones. It's feedback, not judgment."
        },
        {
          question: "I broke no-contact. Now what?",
          answer: "The streak resets. Your insights don't. Learn the trigger, restart."
        }
      ]
    },
    {
      title: "AI Therapy: Chat & Voice",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "text-blue-400",
      faqs: [
        {
          question: "How does Chat AI work on free?",
          answer: "Buy a pack: $3.99 / 300 messages, valid 30 days. Use what you need; packs expire after 30 days."
        },
        {
          question: "How does Chat AI work on Firewall?",
          answer: "Unlimited chat is included."
        },
        {
          question: "Is Voice AI therapy available on free?",
          answer: "No. Voice AI is an on-demand add-on for Firewall: $9.99 / 15 minutes, valid 30 days from purchase."
        },
        {
          question: "Is this a replacement for therapy?",
          answer: "No. It's support, not a clinical service. For crisis, use Crisis Support."
        }
      ]
    },
    {
      title: "Wall of Wounds",
      icon: <Users className="h-5 w-5" />,
      color: "text-orange-400",
      faqs: [
        {
          question: "What can free users do?",
          answer: "Read and like posts."
        },
        {
          question: "What can Firewall users do?",
          answer: "Post, read, and like—still anonymous."
        },
        {
          question: "Community rules?",
          answer: "Be kind, be real, no harm. We moderate for safety."
        }
      ]
    },
    {
      title: "Progress & Analytics",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-cyan-400",
      faqs: [
        {
          question: "What's on the analytics page?",
          answer: "Ritual completion, mood check-ins, streaks, trendlines. Private to you."
        },
        {
          question: "Can I export my data?",
          answer: "Ask Support; we'll help where possible."
        }
      ]
    },
    {
      title: "Privacy & Codenames",
      icon: <Lock className="h-5 w-5" />,
      color: "text-indigo-400",
      faqs: [
        {
          question: "How private is this?",
          answer: "Conversations are encrypted. You choose what to share. Stay faceless if you want."
        },
        {
          question: "Can I change my codename later?",
          answer: "You can generate during sign-up; post-sign-up changes are limited—ask Support if needed."
        }
      ]
    },
    {
      title: "Billing & Cancellations",
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-emerald-400",
      faqs: [
        {
          question: "Firewall price?",
          answer: "$3.99/month."
        },
        {
          question: "Chat AI pack price?",
          answer: "$3.99 / 300 messages, valid 30 days."
        },
        {
          question: "Voice AI price (Firewall)?",
          answer: "$9.99 / 15 minutes, valid 30 days."
        },
        {
          question: "Cancel anytime?",
          answer: "Yes. You keep access until the end of the billing period."
        }
      ]
    },
    {
      title: "Crisis Support",
      icon: <LifeBuoy className="h-5 w-5" />,
      color: "text-red-400",
      faqs: [
        {
          question: "When should I use it?",
          answer: "Severe depression, anxiety, suicidal thoughts, abuse, or anything that feels urgent. You deserve real-time help."
        }
      ]
    },
    {
      title: "Contact Support",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "text-purple-400",
      faqs: [
        {
          question: "What can you help with?",
          answer: "Billing, account hiccups, bug reports, feature ideas, ritual feedback, data requests."
        }
      ]
    }
  ];

  const helpTiles = [
    {
      title: "Getting Started",
      description: "Start here: scan, codenames, basics.",
      icon: <Star className="h-6 w-6" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-500/30",
      hoverColor: "hover:border-yellow-400"
    },
    {
      title: "Plans & Features", 
      description: "Ghost vs Firewall, what you get.",
      icon: <Zap className="h-6 w-6" />,
      color: "text-pink-400",
      bgColor: "bg-pink-900/20",
      borderColor: "border-pink-500/30",
      hoverColor: "hover:border-pink-400"
    },
    {
      title: "Daily Rituals",
      description: "How rituals work. Personalized vs. not.",
      icon: <Heart className="h-6 w-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-500/30",
      hoverColor: "hover:border-purple-400"
    },
    {
      title: "No-Contact Tracker",
      description: "Boundaries, streaks, milestones.",
      icon: <Shield className="h-6 w-6" />,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-500/30",
      hoverColor: "hover:border-green-400"
    },
    {
      title: "AI Therapy: Chat & Voice",
      description: "Chat packs, unlimited Firewall, voice add-on.",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-500/30",
      hoverColor: "hover:border-blue-400"
    },
    {
      title: "Wall of Wounds",
      description: "Read/like vs. posting rights.",
      icon: <Users className="h-6 w-6" />,
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-500/30",
      hoverColor: "hover:border-orange-400"
    },
    {
      title: "Progress & Analytics",
      description: "Your data, your trends, your pace.",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-900/20",
      borderColor: "border-cyan-500/30",
      hoverColor: "hover:border-cyan-400"
    },
    {
      title: "Privacy & Codenames",
      description: "Anonymity and encryption, renamed on demand.",
      icon: <Lock className="h-6 w-6" />,
      color: "text-indigo-400",
      bgColor: "bg-indigo-900/20",
      borderColor: "border-indigo-500/30",
      hoverColor: "hover:border-indigo-400"
    },
    {
      title: "Billing & Cancellations",
      description: "Prices, renewals, refunds basics.",
      icon: <CreditCard className="h-6 w-6" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/20",
      borderColor: "border-emerald-500/30",
      hoverColor: "hover:border-emerald-400"
    },
    {
      title: "Crisis Support",
      description: "Serious help, right now.",
      icon: <LifeBuoy className="h-6 w-6" />,
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-500/30",
      hoverColor: "hover:border-red-400"
    },
    {
      title: "Contact Support",
      description: "Can't find it? Ask us.",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-500/30",
      hoverColor: "hover:border-purple-400"
    }
  ];

  const handleTileClick = (tileTitle: string) => {
    setSelectedCategory(tileTitle);
    setSearchQuery(''); // Clear search when clicking a tile
    
    // Scroll to the FAQ section for this category
    setTimeout(() => {
      const element = document.getElementById(`faq-${tileTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="brand-container">
      <FloatingParticles />
      
      {/* Header */}
      <header className="relative z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                <span className="hidden sm:inline">CTRL+ALT+</span>
                <span className="sm:hidden">CAB+</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 brand-glitch" data-text="BLOCK">BLOCK</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-purple-400 text-xs sm:text-sm px-2 sm:px-3">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <HelpCircle className="h-10 w-10 mr-3 text-purple-400" />
            Help Center
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Find answers, tutorials, and support for your healing journey
          </p>
          
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/crisis-support">
              <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                <LifeBuoy className="h-4 w-4 mr-2" />
                Crisis Support
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search help articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Help Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {helpTiles.map((tile, index) => (
            <Card 
              key={index} 
              className={`${tile.bgColor} ${tile.borderColor} ${tile.hoverColor} transition-all duration-300 cursor-pointer hover:scale-105 ${selectedCategory === tile.title ? 'ring-2 ring-purple-400' : ''}`}
              onClick={() => handleTileClick(tile.title)}
            >
              <CardContent className="p-6 text-center">
                <div className={`${tile.color} mx-auto mb-3`}>
                  {tile.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{tile.title}</h3>
                <p className="text-gray-400 text-sm">{tile.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <HelpCircle className="h-6 w-6 mr-3 text-purple-400" />
            Frequently Asked Questions
          </h2>
          
          {filteredFaqs.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className="mb-8"
              id={`faq-${category.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className={category.color}>{category.icon}</span>
                <span className="ml-2">{category.title}</span>
              </h3>
              
              <div className="space-y-3">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  return (
                    <Card key={faqIndex} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-0">
                        <button
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                          onClick={() => setExpandedFaq(expandedFaq === globalIndex ? null : globalIndex)}
                        >
                          <span className="text-white font-medium">{faq.question}</span>
                          {expandedFaq === globalIndex ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        {expandedFaq === globalIndex && (
                          <div className="px-6 pb-6">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-line">{faq.answer}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
              <p className="text-gray-300 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/crisis-support">
                  <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                    <LifeBuoy className="h-4 w-4 mr-2" />
                    Crisis Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
