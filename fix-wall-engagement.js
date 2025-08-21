// Fix Wall of Wounds engagement - ensure minimum 30 likes per post
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.POSTGRES_URL);

// Generate random heart count with minimum 30
function getRandomHearts() {
  const base = 30; // Minimum 30 hearts
  const bonus = Math.floor(Math.random() * 50); // 0-49 additional hearts
  return base + bonus; // 30-79 hearts total
}

async function fixWallEngagement() {
  try {
    console.log('🔧 Fixing Wall of Wounds engagement...');
    
    // Get all posts
    const posts = await sql`
      SELECT id, content, glitch_category, hearts 
      FROM anonymous_posts 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Found ${posts.length} posts to update`);
    
    // Update each post with proper heart counts
    for (const post of posts) {
      const newHearts = getRandomHearts();
      
      await sql`
        UPDATE anonymous_posts 
        SET hearts = ${newHearts},
            resonate_count = ${Math.floor(newHearts * 0.7)},
            same_loop_count = ${Math.floor(newHearts * 0.2)},
            cleansed_count = ${Math.floor(newHearts * 0.1)}
        WHERE id = ${post.id}
      `;
      
      console.log(`💖 ${post.glitch_category}: ${post.hearts || 0} → ${newHearts} hearts`);
    }
    
    console.log('✅ Wall engagement fixed successfully!');
    
    // Show summary by category
    const summary = await sql`
      SELECT 
        glitch_category,
        COUNT(*) as post_count,
        AVG(hearts) as avg_hearts,
        MIN(hearts) as min_hearts,
        MAX(hearts) as max_hearts
      FROM anonymous_posts 
      GROUP BY glitch_category
      ORDER BY glitch_category
    `;
    
    console.log('\n📈 Engagement Summary by Category:');
    summary.forEach(row => {
      console.log(`${row.glitch_category}: ${row.post_count} posts, ${Math.round(row.avg_hearts)} avg hearts (${row.min_hearts}-${row.max_hearts})`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing wall engagement:', error);
  }
}

fixWallEngagement();
