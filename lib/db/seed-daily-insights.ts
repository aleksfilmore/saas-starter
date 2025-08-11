import { db } from './drizzle';
import { sql } from 'drizzle-orm';

// 60+ Daily Insights for the dashboard
const DAILY_INSIGHTS = [
  {
    id: 1,
    text: "The fact that you're here shows incredible courage and self-awareness.",
    category: "motivation"
  },
  {
    id: 2,
    text: "Every day of healing is a day closer to the person you're becoming.",
    category: "growth"
  },
  {
    id: 3,
    text: "Your past pain is becoming your present strength.",
    category: "transformation"
  },
  {
    id: 4,
    text: "You're not broken—you're breaking through.",
    category: "resilience"
  },
  {
    id: 5,
    text: "Progress isn't always visible, but it's always happening.",
    category: "patience"
  },
  {
    id: 6,
    text: "You survived 100% of your worst days. That's not luck—that's strength.",
    category: "resilience"
  },
  {
    id: 7,
    text: "The goal isn't to forget the past, but to remember your power.",
    category: "empowerment"
  },
  {
    id: 8,
    text: "Self-awareness is the first step toward self-mastery.",
    category: "awareness"
  },
  {
    id: 9,
    text: "Your healing journey is unique—don't compare chapters.",
    category: "acceptance"
  },
  {
    id: 10,
    text: "Every ritual completed is a promise kept to yourself.",
    category: "commitment"
  },
  {
    id: 11,
    text: "You're not healing from weakness; you're healing toward wholeness.",
    category: "growth"
  },
  {
    id: 12,
    text: "The patterns you're breaking won't break overnight—be patient.",
    category: "patience"
  },
  {
    id: 13,
    text: "Your boundaries are love letters to your future self.",
    category: "boundaries"
  },
  {
    id: 14,
    text: "Sometimes the bravest thing is showing up consistently.",
    category: "consistency"
  },
  {
    id: 15,
    text: "You're rewriting your story one conscious choice at a time.",
    category: "choice"
  },
  {
    id: 16,
    text: "Healing isn't linear—it's layered, like building strength.",
    category: "process"
  },
  {
    id: 17,
    text: "The discomfort you feel is growth happening in real-time.",
    category: "growth"
  },
  {
    id: 18,
    text: "You're not running from your past—you're walking toward your future.",
    category: "direction"
  },
  {
    id: 19,
    text: "Every day you choose healing, you choose yourself.",
    category: "self-love"
  },
  {
    id: 20,
    text: "Your triggers are showing you where you still need support.",
    category: "awareness"
  },
  {
    id: 21,
    text: "The work you're doing today will thank you tomorrow.",
    category: "investment"
  },
  {
    id: 22,
    text: "You're not broken to be fixed—you're growing to be free.",
    category: "freedom"
  },
  {
    id: 23,
    text: "Your nervous system is learning safety one breath at a time.",
    category: "safety"
  },
  {
    id: 24,
    text: "The chaos you came from doesn't define the peace you're creating.",
    category: "transformation"
  },
  {
    id: 25,
    text: "You're building emotional muscle memory for better days.",
    category: "building"
  },
  {
    id: 26,
    text: "Every moment of self-awareness is a victory.",
    category: "victory"
  },
  {
    id: 27,
    text: "You're not starting over—you're starting wiser.",
    category: "wisdom"
  },
  {
    id: 28,
    text: "The person you're becoming would be proud of who you are today.",
    category: "pride"
  },
  {
    id: 29,
    text: "Your healing isn't selfish—it's necessary.",
    category: "necessity"
  },
  {
    id: 30,
    text: "You're not just surviving—you're designing a new way to live.",
    category: "design"
  },
  {
    id: 31,
    text: "The patterns that served you once can be released with gratitude.",
    category: "release"
  },
  {
    id: 32,
    text: "Your emotional intelligence is your superpower in development.",
    category: "intelligence"
  },
  {
    id: 33,
    text: "You're creating space for the person you're meant to be.",
    category: "space"
  },
  {
    id: 34,
    text: "The work you're avoiding is often the work that will free you.",
    category: "freedom"
  },
  {
    id: 35,
    text: "Your sensitivity isn't a flaw—it's a feature to be honored.",
    category: "sensitivity"
  },
  {
    id: 36,
    text: "You're not responsible for their healing, only your own.",
    category: "boundaries"
  },
  {
    id: 37,
    text: "The story you tell yourself shapes the reality you create.",
    category: "narrative"
  },
  {
    id: 38,
    text: "Your worthiness isn't conditional on your productivity.",
    category: "worth"
  },
  {
    id: 39,
    text: "Every day you don't betray yourself is a day of self-respect.",
    category: "respect"
  },
  {
    id: 40,
    text: "You're learning to love yourself in languages you never knew existed.",
    category: "love"
  },
  {
    id: 41,
    text: "The relationship with yourself sets the template for all others.",
    category: "relationships"
  },
  {
    id: 42,
    text: "Your trauma response protected you then; your healing response protects you now.",
    category: "protection"
  },
  {
    id: 43,
    text: "You're not too much—you're just learning to be enough for yourself.",
    category: "enough"
  },
  {
    id: 44,
    text: "The peace you're creating is medicine for your lineage.",
    category: "legacy"
  },
  {
    id: 45,
    text: "You're not running out of time—you're making time work for you.",
    category: "time"
  },
  {
    id: 46,
    text: "Your intuition is getting stronger because you're finally listening.",
    category: "intuition"
  },
  {
    id: 47,
    text: "You're not responsible for how others receive your growth.",
    category: "growth"
  },
  {
    id: 48,
    text: "The energy you're saving by not people-pleasing is yours to invest.",
    category: "energy"
  },
  {
    id: 49,
    text: "You're building trust with yourself one kept promise at a time.",
    category: "trust"
  },
  {
    id: 50,
    text: "Your healing is disrupting generational patterns—that's profound work.",
    category: "generational"
  },
  {
    id: 51,
    text: "You're allowed to outgrow people, places, and versions of yourself.",
    category: "growth"
  },
  {
    id: 52,
    text: "The love you're learning to give yourself will overflow naturally.",
    category: "overflow"
  },
  {
    id: 53,
    text: "Your nervous system is remembering what safety feels like.",
    category: "safety"
  },
  {
    id: 54,
    text: "You're not healing to become perfect—you're healing to become free.",
    category: "freedom"
  },
  {
    id: 55,
    text: "The child in you is learning they're finally safe to be themselves.",
    category: "inner-child"
  },
  {
    id: 56,
    text: "Your boundaries are teaching others how to love you correctly.",
    category: "boundaries"
  },
  {
    id: 57,
    text: "You're creating emotional safety nets instead of emotional dependency.",
    category: "independence"
  },
  {
    id: 58,
    text: "The version of you that needed to survive is proud of who you're becoming.",
    category: "survival"
  },
  {
    id: 59,
    text: "You're not just changing your life—you're changing your destiny.",
    category: "destiny"
  },
  {
    id: 60,
    text: "Your presence here is proof that healing is possible.",
    category: "proof"
  },
  {
    id: 61,
    text: "You're writing new neural pathways with every conscious choice.",
    category: "neuroscience"
  },
  {
    id: 62,
    text: "The courage to look inward is the courage that changes everything.",
    category: "courage"
  },
  {
    id: 63,
    text: "You're not just surviving your story—you're authoring a new chapter.",
    category: "authorship"
  },
  {
    id: 64,
    text: "Your healing ripples out in ways you may never fully see.",
    category: "ripple"
  },
  {
    id: 65,
    text: "The work you're doing matters more than you know.",
    category: "impact"
  }
];

export async function seedDailyInsights() {
  try {
    console.log('🌱 Seeding daily insights...');
    
    // Create table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS daily_insights (
        id INTEGER PRIMARY KEY,
        text TEXT NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    
    let seededCount = 0;
    
    for (const insight of DAILY_INSIGHTS) {
      try {
        await db.execute(sql`
          INSERT INTO daily_insights (id, text, category)
          VALUES (${insight.id}, ${insight.text}, ${insight.category})
          ON CONFLICT (id) DO UPDATE SET
            text = EXCLUDED.text,
            category = EXCLUDED.category
        `);
        
        seededCount++;
        
      } catch (error) {
        console.error(`❌ Failed to seed insight ${insight.id}:`, error);
      }
    }
    
    console.log(`🎉 Successfully seeded ${seededCount}/${DAILY_INSIGHTS.length} daily insights!`);
    
    // Show category breakdown
    const categories = await db.execute(sql`
      SELECT category, COUNT(*) as count
      FROM daily_insights 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    console.log('\n📊 Insights by category:');
    for (const cat of categories) {
      console.log(`  ${cat.category}: ${cat.count} insights`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to seed daily insights:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  seedDailyInsights()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
