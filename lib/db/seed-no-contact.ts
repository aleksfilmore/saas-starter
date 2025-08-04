import { db } from './drizzle';
import { sql } from 'drizzle-orm';

// Your exact 90-day message calendar
const NO_CONTACT_MESSAGES = [
  {
    day: 1,
    body: "System booted. You've survived 24 hrs without doom-scrolling their IG stories. Celebrate with water—and absolutely no \"just checking in\" texts.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 2,
    body: "Two days clean. Your phone battery lasts longer when you're not stalking. Funny how that works.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 3,
    body: "That itch to \"see what they're up to\"? Scrub it with memes and move on.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 4,
    body: "Day 4 and the world hasn't ended. Spoiler: they're still mediocre.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 5,
    body: "Delete one blurry picture of them today. Pixel purge.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 6,
    body: "If they cared, they'd be here. You are—keep going.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 7,
    body: "🛡️ 7-DAY STREAK UNLOCKED! One whole week of radio silence. Your ex just lost premium access to your chaos.",
    is_milestone: true,
    bytes_reward: 50
  },
  {
    day: 8,
    body: "Seven days tasted good; eight tastes like victory leftovers.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 9,
    body: "Your contact list looks lighter. That's called emotional bandwidth.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 10,
    body: "Double-digits, baby. Their name gets fuzzier every hour.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 11,
    body: "Reminder: you're not a library; they don't get to check you out again.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 12,
    body: "Craving a relapse text? Write it, screenshot it, delete it. XP +10.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 13,
    body: "Day 13: Unlucky for superstitions, lucky for glow-ups.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 14,
    body: "⚡ TWO WEEKS CLEAN. Your streak is now taller than their emotional maturity.",
    is_milestone: true,
    bytes_reward: 75
  },
  {
    day: 15,
    body: "Half-month complete. Treat yourself to anything but spying.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 16,
    body: "Silence is your new skincare routine—look at that glow.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 17,
    body: "If closure was coming, Amazon would've delivered it by now. Keep blocking.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 18,
    body: "Imagine explaining to aliens why you ever dated them. Cringe fuel = forward motion.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 19,
    body: "Day 19: still alive, still unbothered, still hotter.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 20,
    body: "Twenty days = 480 hours of detox. Siri can't even find them anymore.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 21,
    body: "Three weeks in. Your streak can legally drink in some countries.",
    is_milestone: false,
    bytes_reward: 20
  },
  {
    day: 22,
    body: "You dodged a bullet; stop begging the gunman for direction.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 23,
    body: "Scroll past their zodiac meme—astral garbage is still garbage.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 24,
    body: "Add a new song to your revenge playlist. Louder, pettier.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 25,
    body: "Quarter-hundred. Ex who? Exactly.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 26,
    body: "Craving chaos? Rearrange furniture, not boundaries.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 27,
    body: "Today's vibe: unfriend, unblock, laugh—then reblock (just because).",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 28,
    body: "Four weeks. Delete the last \"maybe we can talk\" draft from Notes.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 29,
    body: "Reminder: You are not Google; they can find their own answers.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 30,
    body: "🔥 30 DAYS — ONE FULL SYSTEM CYCLE. You've ghosted the ghost. Enjoy a Byte bonus and do a petty dance.",
    is_milestone: true,
    bytes_reward: 100
  },
  {
    day: 31,
    body: "You've reset the algorithm; their content is dust. Keep scrolling forward.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 32,
    body: "Day 32: If they pop up in dreams, charge them rent.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 33,
    body: "Mood check: Still untouched, still undefeated.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 34,
    body: "Replace a trigger song with a hype anthem. Audio exorcism.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 35,
    body: "Five weeks. Screenshot your streak—flex on the Wall.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 36,
    body: "Their pet misses you? Not your circus, not your emotional support animal.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 37,
    body: "Block memory lane; detour to self-upgrade boulevard.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 38,
    body: "Day 38: They're yesterday's Wi-Fi—stop searching for the connection.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 39,
    body: "You've saved approx. 2,812 heartbeats by not rereading texts. Science-ish.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 40,
    body: "Forty is flirty when you're not texting the past at 2 a.m.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 41,
    body: "New ritual: speak your own name louder than theirs.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 42,
    body: "Hitchhiker's guide to breakups says: Don't Panic. You're at 42.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 43,
    body: "Day 43: Their silence is still free. Collect it.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 44,
    body: "Halfway to 90. Celebrate with carbs, not calls.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 45,
    body: "🛡️ 45-DAY CHECKPOINT. That's six weeks + 3 days of unbothered excellence. Badge unlocked: \"Firewall Ignition.\"",
    is_milestone: true,
    bytes_reward: 125
  },
  {
    day: 46,
    body: "If nostalgia taps—hit decline. You're busy thriving.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 47,
    body: "Replace one ex-thought with a flex-thought. Repeat as needed.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 48,
    body: "Day 48: Phone still works, you just choose peace. Wild.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 49,
    body: "Streak freeze token stocked—use only for cataclysm, not curiosity.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 50,
    body: "Half-century of silence. Gold medal in self-respect.",
    is_milestone: false,
    bytes_reward: 20
  },
  {
    day: 51,
    body: "Your name is not \"maybe later.\" Keep it that way.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 52,
    body: "Day 52: Their birthday reminder? Delete. Freedom.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 53,
    body: "Write a breakup haiku. Burn it. XP +15.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 54,
    body: "If they liked it, they should've put emotional effort on it.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 55,
    body: "Seven weeks and six days—perfection loading…",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 56,
    body: "Day 56: Two months minus four. Math flex.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 57,
    body: "Your glow scares them. That's not your problem.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 58,
    body: "Treat relapse thoughts like spam email—report & block.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 59,
    body: "Day 59: Almost 60. Their memory = DLC you didn't buy.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 60,
    body: "⚡ 60 DAYS — TWO MONTHS CLEAN. You could binge an entire Netflix series or just keep ghosting. Choose ghosting.",
    is_milestone: true,
    bytes_reward: 150
  },
  {
    day: 61,
    body: "You're 60+ days wiser. That's practically a PhD in Not Texting.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 62,
    body: "Day 62: If they DM \"u up?\", reply with silence. Works every time.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 63,
    body: "Three-quarter distance to 90. Marathon, not drunk dial.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 64,
    body: "Delete old voice notes. Dead bytes, dead weight.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 65,
    body: "Day 65: Replace \"What are they doing?\" with \"What am I building?\"",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 66,
    body: "Devilish day 66: Exorcise ex-thoughts with cardio.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 67,
    body: "Log your energy: up, down, or Beyoncé? Adjust playlist accordingly.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 68,
    body: "Your screen-time on their profile = 0 m. Chef's kiss.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 69,
    body: "Nice. Keep it celibate from their chaos.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 70,
    body: "70 days: You've lived 1,680 hours without begging for closure.",
    is_milestone: false,
    bytes_reward: 20
  },
  {
    day: 71,
    body: "Post a Wall confession titled \"Still Unbothered.\" Earn clout.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 72,
    body: "Day 72: Unfollow their cousin's cat. Stray crumbs matter.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 73,
    body: "Screenshot bank balance. Notice ex-drama fees = zero.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 74,
    body: "Four-day countdown to 11-week streak. Prep confetti.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 75,
    body: "🛡️ 75-DAY BADGE! That's ¾ to 100—though we stop at 90 because you'll be legendary by then.",
    is_milestone: true,
    bytes_reward: 175
  },
  {
    day: 76,
    body: "Day 76: You're Sonic. They're dial-up. Different speeds.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 77,
    body: "Lucky 77. Manifest better red flags—at least new ones.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 78,
    body: "Delete last romantic playlist. Replace with villain anthems.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 79,
    body: "One day 'til 80. Smile like you mean it, ghost like you invented it.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 80,
    body: "Eighty. Your silence could start a religion.",
    is_milestone: false,
    bytes_reward: 20
  },
  {
    day: 81,
    body: "Mood low? Watch breakup TikTok—laugh, don't DM.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 82,
    body: "Day 82: You've leveled up. They're still side-quest NPC.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 83,
    body: "Write a letter to Future You. Seal it. Spoiler: you're thriving.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 84,
    body: "Six weeks? Try 12. You're double the distance.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 85,
    body: "Five-day finish line sprint. Hydrate with karma.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 86,
    body: "Day 86: Replace \"Why me?\" with \"Watch me.\"",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 87,
    body: "If boredom whispers, block boredom too.",
    is_milestone: false,
    bytes_reward: 10
  },
  {
    day: 88,
    body: "88 = infinite loops—except you broke the toxic loop already.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 89,
    body: "Penultimate day. Screenshot streak; you'll want the receipt.",
    is_milestone: false,
    bytes_reward: 15
  },
  {
    day: 90,
    body: "🚀 90 DAYS — LEGEND STATUS. You're officially glitch-free and ex-proof. New protocol unlocked: Glow-Up 2.0. Go run it.",
    is_milestone: true,
    bytes_reward: 500
  }
];

export async function seedNoContactMessages() {
  try {
    console.log('🌱 Seeding no-contact messages...');
    
    let seededCount = 0;
    
    for (const message of NO_CONTACT_MESSAGES) {
      try {
        await db.execute(sql`
          INSERT INTO no_contact_messages (day, body, is_milestone, bytes_reward)
          VALUES (${message.day}, ${message.body}, ${message.is_milestone}, ${message.bytes_reward})
          ON CONFLICT (day) DO UPDATE SET
            body = EXCLUDED.body,
            is_milestone = EXCLUDED.is_milestone,
            bytes_reward = EXCLUDED.bytes_reward
        `);
        
        seededCount++;
        
        if (message.is_milestone) {
          console.log(`✨ Milestone Day ${message.day}: ${message.bytes_reward} bytes`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to seed day ${message.day}:`, error);
      }
    }
    
    console.log(`🎉 Successfully seeded ${seededCount}/90 no-contact messages!`);
    
    // Show milestone summary
    const milestones = await db.execute(sql`
      SELECT day, bytes_reward 
      FROM no_contact_messages 
      WHERE is_milestone = true 
      ORDER BY day
    `);
    
    console.log('\n🏆 Milestone Days:');
    for (const milestone of milestones) {
      console.log(`  Day ${milestone.day}: ${milestone.bytes_reward} bytes`);
    }
    
    const totalBytes = milestones.reduce((sum, m) => sum + (m.bytes_reward as number), 0);
    console.log(`\n💎 Total milestone bytes available: ${totalBytes}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to seed no-contact messages:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  seedNoContactMessages()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
