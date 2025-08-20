require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function checkWallPosts() {
  const client = new Client(process.env.POSTGRES_URL);
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check wall posts count
    const result = await client.query('SELECT COUNT(*) as count FROM anonymous_posts');
    const count = parseInt(result.rows[0]?.count || 0);
    console.log('📊 Current wall posts:', count);
    
    // If we have fewer than 10 posts, let's add some
    if (count < 10) {
      console.log('🌱 Adding sample wall posts...');
      
      const samplePosts = [
        // Heartbreak category
        { content: "Day 15 of no contact and I actually smiled at a stranger today. Small wins matter! 💪", category: "heartbreak", user_id: "sample1" },
        { content: "Heartbreak is teaching me who I really am. Silver lining in the darkness 💔", category: "heartbreak", user_id: "sample8" },
        { content: "Some days I feel like I'm drowning in memories. But I'm still here, still fighting", category: "heartbreak", user_id: "sample13" },
        { content: "One year later and I can finally say: thank you for leaving. I found myself in the pieces.", category: "heartbreak", user_id: "sample14" },
        
        // Sadness category
        { content: "Why do I keep checking their social media? I know it hurts but I can't stop myself 😢", category: "sadness", user_id: "sample2" },
        { content: "Cried in the grocery store because they loved this cereal. Healing isn't pretty 😢", category: "sadness", user_id: "sample12" },
        { content: "Rainy days hit different when you're healing. Everything feels heavier", category: "sadness", user_id: "sample15" },
        { content: "Missing the person I thought they were, not who they actually turned out to be", category: "sadness", user_id: "sample16" },
        
        // Anger category
        { content: "Rage workout session complete. Sometimes you have to punch the pain out 😤", category: "anger", user_id: "sample6" },
        { content: "How DARE they make me question my worth! That's on them, not me. Done with that energy", category: "anger", user_id: "sample17" },
        { content: "Angry at myself for ignoring all those red flags. But lesson learned - NEVER again", category: "anger", user_id: "sample18" },
        { content: "The audacity of them to text me 'happy birthday' after everything. DELETE.", category: "anger", user_id: "sample19" },
        
        // Anxiety category  
        { content: "Had a panic attack thinking about running into them. This healing journey is not linear 😰", category: "anxiety", user_id: "sample4" },
        { content: "Anxiety is lying to me again. They're not thinking about me as much as my brain thinks they are", category: "anxiety", user_id: "sample20" },
        { content: "Heart racing every time I see a notification. Still training my nervous system that I'm safe now", category: "anxiety", user_id: "sample21" },
        { content: "What if I never find love again? Anxiety brain needs to chill. I'm worthy of love RIGHT NOW", category: "anxiety", user_id: "sample22" },
        
        // Rage category
        { content: "FURIOUS that I wasted 3 years on someone who couldn't even respect me enough to be honest 🔥", category: "rage", user_id: "sample23" },
        { content: "Rage cleaning my apartment. Getting rid of every trace of their existence. THERAPEUTIC", category: "rage", user_id: "sample24" },
        { content: "The NERVE of them to ask to 'be friends' after cheating. Sir, we are NOT friends. We are NOTHING.", category: "rage", user_id: "sample25" },
        
        // Confusion category
        { content: "Wrote them a letter I'll never send. Getting it out helped more than I expected 💭", category: "confusion", user_id: "sample7" },
        { content: "How did I go from 'forever' to 'stranger' so fast? None of this makes sense anymore", category: "confusion", user_id: "sample26" },
        { content: "Mixed signals for months. Now I'm questioning every conversation we ever had", category: "confusion", user_id: "sample27" },
        
        // Hope category
        { content: "Started therapy today. First time admitting I need help. Proud of myself for taking this step 🌟", category: "hope", user_id: "sample5" },
        { content: "For the first time in months, I'm excited about my future. Plot twist: it doesn't include them", category: "hope", user_id: "sample28" },
        { content: "Bad days don't last. Bad people don't deserve good people. Better days are coming", category: "hope", user_id: "sample29" },
        
        // Breakthrough category
        { content: "Deleted all our photos today. It was painful but necessary. Freedom feels scary and exciting 🔥", category: "breakthrough", user_id: "sample3" },
        { content: "Three months free and I can finally see a future without them. The fog is lifting! ⚡", category: "breakthrough", user_id: "sample9" },
        { content: "BREAKTHROUGH: I realize I was in love with potential, not reality. I'm free now", category: "breakthrough", user_id: "sample30" },
        
        // Identity category
        { content: "Some days I don't know who I am without them. Identity crisis is real 🎭", category: "identity", user_id: "sample10" },
        { content: "Rediscovering who I was before I became 'we'. She's pretty amazing actually", category: "identity", user_id: "sample31" },
        { content: "I lost myself trying to be what they wanted. Never again. I like who I'm becoming", category: "identity", user_id: "sample32" },
        
        // Future category
        { content: "Future me is going to thank current me for not texting them tonight 🔮", category: "future", user_id: "sample11" },
        { content: "Planning a solo trip for the first time in years. Future self deserves adventures", category: "future", user_id: "sample33" },
        { content: "The life I'm building without them is going to be INCREDIBLE. I can feel it", category: "future", user_id: "sample34" }
      ];
      
      for (const post of samplePosts) {
        await client.query(`
          INSERT INTO anonymous_posts (id, content, "userId", "glitchCategory", "resonateCount", created_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          `sample_${Math.random().toString(36).substr(2, 9)}`,
          post.content,
          post.user_id,
          post.category,
          Math.floor(Math.random() * 25) + 1 // Random reactions 1-25
        ]);
      }
      
      console.log(`✅ Added ${samplePosts.length} sample posts`);
    }
    
    // Final count
    const finalResult = await client.query('SELECT COUNT(*) as count FROM anonymous_posts');
    const finalCount = parseInt(finalResult.rows[0]?.count || 0);
    console.log('📊 Final wall posts count:', finalCount);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from database');
  }
}

checkWallPosts().then(() => {
  console.log('✅ Wall posts check complete');
  process.exit(0);
}).catch(err => {
  console.error('💥 Script failed:', err);
  process.exit(1);
});
