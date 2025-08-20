/**
 * LUMO Help Knowledge Base
 * Comprehensive support documentation for customer service integration
 */

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  relevanceScore?: number;
}

export const HELP_KNOWLEDGE_BASE: HelpArticle[] = [
  // Getting Started
  {
    id: "account-creation",
    title: "How to create an account",
    category: "Getting Started",
    content: "Take the Healing Archetype Scan on the homepage. It builds your profile and unlocks your dashboard.",
    keywords: ["account", "create", "sign up", "register", "scan", "profile"]
  },
  {
    id: "codenames",
    title: "How codenames work",
    category: "Getting Started", 
    content: "We auto-assign one at sign-up. Don't love it? Tap Generate New until it feels right.",
    keywords: ["codename", "username", "alias", "generate", "change"]
  },
  {
    id: "ghost-mode",
    title: "Ghost Mode (free tier) features",
    category: "Getting Started",
    content: "Ghost Mode includes: No-contact tracker, Daily check-in journaling, 1 daily ritual (not personalized), Read + like on the Wall, Basic badges (limited progress), Progress analytics, Optional Chat AI pack ($3.99 / 300 msgs, 30-day validity)",
    keywords: ["ghost", "free", "features", "tier", "no-contact", "ritual", "wall", "badges"]
  },
  {
    id: "firewall-premium",
    title: "Firewall (premium) features", 
    category: "Getting Started",
    content: "Firewall includes: Everything in Ghost Mode, Unlimited personalized rituals, Full Wall posting access, Priority support, Advanced analytics, Custom streak rewards, Exclusive badge collection, No daily limits",
    keywords: ["firewall", "premium", "unlimited", "personalized", "posting", "priority", "analytics"]
  },

  // Features & Tools
  {
    id: "no-contact-tracker",
    title: "No-Contact Tracker",
    category: "Features",
    content: "Track your no-contact streak and get insights on your healing progress. The tracker helps you stay accountable and celebrates your milestones.",
    keywords: ["no-contact", "tracker", "streak", "healing", "progress", "milestones"]
  },
  {
    id: "daily-rituals",
    title: "Daily Rituals System",
    category: "Features", 
    content: "Complete daily healing rituals tailored to your archetype. Free users get 1 basic ritual per day, premium users get unlimited personalized rituals.",
    keywords: ["rituals", "daily", "healing", "archetype", "personalized", "unlimited"]
  },
  {
    id: "wall-of-wounds",
    title: "Wall of Wounds Community",
    category: "Features",
    content: "Share your healing journey anonymously with the community. Read and like others' posts for support. Premium users can post unlimited content.",
    keywords: ["wall", "wounds", "community", "anonymous", "share", "post", "support"]
  },
  {
    id: "healing-archetypes",
    title: "Healing Archetypes",
    category: "Features",
    content: "Discover your unique healing style through our archetype system. Each archetype gets personalized rituals and guidance tailored to their healing approach.",
    keywords: ["archetype", "healing", "style", "personalized", "guidance", "unique"]
  },
  {
    id: "lumo-ai",
    title: "LUMO AI Assistant",
    category: "Features",
    content: "Your personal AI companion with three personalities: Core (balanced support), Gremlin (savage hype), and Analyst (logical therapy). Available 24/7 for guidance and support.",
    keywords: ["lumo", "ai", "assistant", "core", "gremlin", "analyst", "personalities", "support"]
  },

  // Badges & Gamification
  {
    id: "badge-system",
    title: "Badge & Achievement System",
    category: "Gamification",
    content: "Earn badges for milestones like ritual streaks, no-contact days, and community engagement. Premium users get access to exclusive badge collections.",
    keywords: ["badges", "achievements", "milestones", "streaks", "engagement", "exclusive"]
  },
  {
    id: "xp-system",
    title: "Experience Points (XP)",
    category: "Gamification", 
    content: "Gain XP for completing rituals, maintaining streaks, and engaging with the community. Track your healing progress through your XP level.",
    keywords: ["xp", "experience", "points", "level", "progress", "rituals", "streaks"]
  },

  // Subscription & Billing
  {
    id: "upgrade-premium",
    title: "Upgrading to Premium",
    category: "Billing",
    content: "Upgrade to Firewall (premium) for unlimited features, personalized rituals, and priority support. Billing is handled securely through Stripe.",
    keywords: ["upgrade", "premium", "firewall", "billing", "stripe", "unlimited", "priority"]
  },
  {
    id: "billing-issues",
    title: "Billing & Payment Issues", 
    category: "Billing",
    content: "Having trouble with payments? Check your payment method, ensure sufficient funds, and contact support if issues persist. All transactions are secured by Stripe.",
    keywords: ["billing", "payment", "trouble", "funds", "stripe", "secure", "support"]
  },

  // Privacy & Security
  {
    id: "data-privacy",
    title: "Data Privacy & Security",
    category: "Privacy",
    content: "Your data is encrypted and secure. We never share personal information. All content on the Wall is anonymous and optional.",
    keywords: ["privacy", "security", "encrypted", "anonymous", "personal", "data"]
  },
  {
    id: "account-security",
    title: "Account Security",
    category: "Privacy",
    content: "Keep your account secure with a strong password. Enable two-factor authentication when available. Never share your login credentials.",
    keywords: ["security", "password", "two-factor", "authentication", "credentials", "login"]
  },

  // Troubleshooting
  {
    id: "app-not-loading",
    title: "App Not Loading",
    category: "Troubleshooting",
    content: "Try refreshing the page, clearing your browser cache, or checking your internet connection. Contact support if the issue persists.",
    keywords: ["loading", "refresh", "cache", "internet", "connection", "browser"]
  },
  {
    id: "ritual-not-saving",
    title: "Ritual Progress Not Saving",
    category: "Troubleshooting",
    content: "Ensure you have a stable internet connection and try completing the ritual again. Your progress should sync automatically when connection is restored.",
    keywords: ["ritual", "saving", "progress", "sync", "connection", "internet"]
  },
  {
    id: "notifications-not-working",
    title: "Notifications Not Working",
    category: "Troubleshooting",
    content: "Check your browser notification settings and ensure the app has permission to send notifications. You can also check your notification preferences in settings.",
    keywords: ["notifications", "browser", "permission", "settings", "preferences"]
  },

  // Community Guidelines
  {
    id: "community-guidelines",
    title: "Community Guidelines",
    category: "Community",
    content: "Be supportive, respectful, and anonymous. No identifying information, harassment, or promotional content. Report inappropriate posts to our moderation team.",
    keywords: ["guidelines", "community", "respectful", "anonymous", "harassment", "moderation"]
  },
  {
    id: "reporting-content",
    title: "Reporting Inappropriate Content",
    category: "Community",
    content: "Report any content that violates our guidelines using the report button. Our moderation team reviews all reports within 24 hours.",
    keywords: ["report", "inappropriate", "content", "guidelines", "moderation", "violations"]
  }
];

/**
 * Search the knowledge base for relevant articles
 */
export function searchKnowledgeBase(query: string, maxResults: number = 5): HelpArticle[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  // Score articles based on keyword matches
  const scoredArticles = HELP_KNOWLEDGE_BASE.map(article => {
    let score = 0;
    
    // Check title match (higher weight)
    if (article.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    // Check content match (medium weight)
    if (article.content.toLowerCase().includes(queryLower)) {
      score += 5;
    }
    
    // Check keyword matches (lower weight)
    queryWords.forEach(word => {
      if (article.keywords.some(keyword => keyword.includes(word))) {
        score += 2;
      }
    });
    
    // Check individual word matches in title/content
    queryWords.forEach(word => {
      if (article.title.toLowerCase().includes(word)) score += 3;
      if (article.content.toLowerCase().includes(word)) score += 1;
    });
    
    return { ...article, relevanceScore: score };
  });
  
  // Filter and sort by relevance
  return scoredArticles
    .filter(article => article.relevanceScore! > 0)
    .sort((a, b) => b.relevanceScore! - a.relevanceScore!)
    .slice(0, maxResults);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): HelpArticle[] {
  return HELP_KNOWLEDGE_BASE.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  return [...new Set(HELP_KNOWLEDGE_BASE.map(article => article.category))];
}

/**
 * Format knowledge base content for AI context
 */
export function formatKnowledgeBaseForAI(articles: HelpArticle[]): string {
  if (articles.length === 0) return "";
  
  return `KNOWLEDGE BASE CONTEXT:\n${articles.map(article => 
    `• ${article.title}: ${article.content}`
  ).join('\n')}\n\nUse this information to provide accurate, helpful responses about the platform.`;
}
