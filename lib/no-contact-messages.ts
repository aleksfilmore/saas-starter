// 90-Day No-Contact Trash-Talk Calendar
export const NO_CONTACT_MESSAGES = [
  // Days 1-30
  "System booted. You've survived 24 hrs without doom-scrolling their IG stories. Celebrate with water—and absolutely no \"just checking in\" texts.",
  "Two days clean. Your phone battery lasts longer when you're not stalking. Funny how that works.",
  "That itch to \"see what they're up to\"? Scrub it with memes and move on.",
  "Day 4 and the world hasn't ended. Spoiler: they're still mediocre.",
  "Delete one blurry picture of them today. Pixel purge.",
  "If they cared, they'd be here. You are—keep going.",
  "🛡️ 7-DAY STREAK UNLOCKED! One whole week of radio silence. Your ex just lost premium access to your chaos.",
  "Seven days tasted good; eight tastes like victory leftovers.",
  "Your contact list looks lighter. That's called emotional bandwidth.",
  "Double-digits, baby. Their name gets fuzzier every hour.",
  "Reminder: you're not a library; they don't get to check you out again.",
  "Craving a relapse text? Write it, screenshot it, delete it. XP +10.",
  "Day 13: Unlucky for superstitions, lucky for glow-ups.",
  "⚡ TWO WEEKS CLEAN. Your streak is now taller than their emotional maturity.",
  "Half-month complete. Treat yourself to anything but spying.",
  "Silence is your new skincare routine—look at that glow.",
  "If closure was coming, Amazon would've delivered it by now. Keep blocking.",
  "Imagine explaining to aliens why you ever dated them. Cringe fuel = forward motion.",
  "Day 19: still alive, still unbothered, still hotter.",
  "Twenty days = 480 hours of detox. Siri can't even find them anymore.",
  "Three weeks in. Your streak can legally drink in some countries.",
  "You dodged a bullet; stop begging the gunman for direction.",
  "Scroll past their zodiac meme—astral garbage is still garbage.",
  "Add a new song to your revenge playlist. Louder, pettier.",
  "Quarter-hundred. Ex who? Exactly.",
  "Craving chaos? Rearrange furniture, not boundaries.",
  "Today's vibe: unfriend, unblock, laugh—then reblock (just because).",
  "Four weeks. Delete the last \"maybe we can talk\" draft from Notes.",
  "Reminder: You are not Google; they can find their own answers.",
  "🔥 30 DAYS — ONE FULL SYSTEM CYCLE. You've ghosted the ghost. Enjoy a Byte bonus and do a petty dance.",
  
  // Days 31-60
  "You've reset the algorithm; their content is dust. Keep scrolling forward.",
  "Day 32: If they pop up in dreams, charge them rent.",
  "Mood check: Still untouched, still undefeated.",
  "Replace a trigger song with a hype anthem. Audio exorcism.",
  "Five weeks. Screenshot your streak—flex on the Wall.",
  "Their pet misses you? Not your circus, not your emotional support animal.",
  "Block memory lane; detour to self-upgrade boulevard.",
  "Day 38: They're yesterday's Wi-Fi—stop searching for the connection.",
  "You've saved approx. 2,812 heartbeats by not rereading texts. Science-ish.",
  "Forty is flirty when you're not texting the past at 2 a.m.",
  "New ritual: speak your own name louder than theirs.",
  "Hitchhiker's guide to breakups says: Don't Panic. You're at 42.",
  "Day 43: Their silence is still free. Collect it.",
  "Halfway to 90. Celebrate with carbs, not calls.",
  "🛡️ 45-DAY CHECKPOINT. That's six weeks + 3 days of unbothered excellence. Badge unlocked: \"Firewall Ignition.\"",
  "If nostalgia taps—hit decline. You're busy thriving.",
  "Replace one ex-thought with a flex-thought. Repeat as needed.",
  "Day 48: Phone still works, you just choose peace. Wild.",
  "Streak freeze token stocked—use only for cataclysm, not curiosity.",
  "Half-century of silence. Gold medal in self-respect.",
  "Your name is not \"maybe later.\" Keep it that way.",
  "Day 52: Their birthday reminder? Delete. Freedom.",
  "Write a breakup haiku. Burn it. XP +15.",
  "If they liked it, they should've put emotional effort on it.",
  "Seven weeks and six days—perfection loading…",
  "Day 56: Two months minus four. Math flex.",
  "Your glow scares them. That's not your problem.",
  "Treat relapse thoughts like spam email—report & block.",
  "Day 59: Almost 60. Their memory = DLC you didn't buy.",
  "⚡ 60 DAYS — TWO MONTHS CLEAN. You could binge an entire Netflix series or just keep ghosting. Choose ghosting.",
  
  // Days 61-90
  "You're 60+ days wiser. That's practically a PhD in Not Texting.",
  "Day 62: If they DM \"u up?\", reply with silence. Works every time.",
  "Three-quarter distance to 90. Marathon, not drunk dial.",
  "Delete old voice notes. Dead bytes, dead weight.",
  "Day 65: Replace \"What are they doing?\" with \"What am I building?\"",
  "Devilish day 66: Exorcise ex-thoughts with cardio.",
  "Log your energy: up, down, or Beyoncé? Adjust playlist accordingly.",
  "Your screen-time on their profile = 0 m. Chef's kiss.",
  "Nice. Keep it celibate from their chaos.",
  "70 days: You've lived 1,680 hours without begging for closure.",
  "Post a Wall confession titled \"Still Unbothered.\" Earn clout.",
  "Day 72: Unfollow their cousin's cat. Stray crumbs matter.",
  "Screenshot bank balance. Notice ex-drama fees = zero.",
  "Four-day countdown to 11-week streak. Prep confetti.",
  "🛡️ 75-DAY BADGE! That's ¾ to 100—though we stop at 90 because you'll be legendary by then.",
  "Day 76: You're Sonic. They're dial-up. Different speeds.",
  "Lucky 77. Manifest better red flags—at least new ones.",
  "Delete last romantic playlist. Replace with villain anthems.",
  "One day 'til 80. Smile like you mean it, ghost like you invented it.",
  "Eighty. Your silence could start a religion.",
  "Mood low? Watch breakup TikTok—laugh, don't DM.",
  "Day 82: You've leveled up. They're still side-quest NPC.",
  "Write a letter to Future You. Seal it. Spoiler: you're thriving.",
  "Six weeks? Try 12. You're double the distance.",
  "Five-day finish line sprint. Hydrate with karma.",
  "Day 86: Replace \"Why me?\" with \"Watch me.\"",
  "If boredom whispers, block boredom too.",
  "88 = infinite loops—except you broke the toxic loop already.",
  "Penultimate day. Screenshot streak; you'll want the receipt.",
  "🚀 90 DAYS — LEGEND STATUS. You're officially glitch-free and ex-proof. New protocol unlocked: Glow-Up 2.0. Go run it."
]

export function getNoContactMessage(day: number): string {
  if (day < 1 || day > 90) {
    return "Keep going, legend. Your streak speaks louder than words."
  }
  
  return NO_CONTACT_MESSAGES[day - 1]
}

export function getNoContactBadges(day: number): string[] {
  const badges = []
  
  if (day >= 7) badges.push("🛡️ Firewall Active")
  if (day >= 14) badges.push("⚡ Two Week Warrior") 
  if (day >= 30) badges.push("🔥 Monthly Master")
  if (day >= 45) badges.push("🛡️ Firewall Ignition")
  if (day >= 60) badges.push("⚡ Two Month Legend")
  if (day >= 75) badges.push("🛡️ 75-Day Badge")
  if (day >= 90) badges.push("🚀 Legend Status")
  
  return badges
}
