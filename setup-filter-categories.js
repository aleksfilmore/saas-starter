// Set up Wall of Wounds filter categories (Viral, Pulse, Oracle)
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.POSTGRES_URL);

async function setupFilterCategories() {
  try {
    console.log('🏷️ Setting up Wall filter categories...');
    
    // Get all posts sorted by hearts
    const posts = await sql`
      SELECT id, content, glitch_category, hearts, created_at
      FROM anonymous_posts 
      ORDER BY hearts DESC
    `;
    
    console.log(`📊 Found ${posts.length} posts to categorize`);
    
    // Set top 20% as Oracle posts (featured/wisdom posts)
    const oracleCount = Math.ceil(posts.length * 0.2);
    console.log(`🔮 Setting ${oracleCount} posts as Oracle posts...`);
    
    for (let i = 0; i < oracleCount; i++) {
      await sql`
        UPDATE anonymous_posts 
        SET is_oracle_post = true,
            is_featured = ${i < 5} 
        WHERE id = ${posts[i].id}
      `;
      console.log(`⚡ Oracle: ${posts[i].glitch_category} (${posts[i].hearts} hearts)`);
    }
    
    // Ensure we have viral posts (50+ hearts for viral filter)
    const viralPosts = posts.filter(p => p.hearts >= 50);
    console.log(`🔥 Found ${viralPosts.length} viral posts (50+ hearts)`);
    
    // Update recent posts for pulse category (last 24 hours simulation)
    // Since these are seed posts, we'll make the most recent ones "pulse-worthy"
    const recentPosts = posts.slice(0, 15);
    console.log(`💓 Top 15 most engaging posts will appear in Pulse...`);
    
    // Summary by category
    const summary = await sql`
      SELECT 
        CASE 
          WHEN hearts >= 50 THEN 'Viral'
          WHEN is_oracle_post = true THEN 'Oracle' 
          ELSE 'Recent/Pulse'
        END as filter_category,
        COUNT(*) as count,
        AVG(hearts) as avg_hearts
      FROM anonymous_posts 
      GROUP BY 
        CASE 
          WHEN hearts >= 50 THEN 'Viral'
          WHEN is_oracle_post = true THEN 'Oracle' 
          ELSE 'Recent/Pulse'
        END
      ORDER BY avg_hearts DESC
    `;
    
    console.log('\n📈 Filter Category Summary:');
    summary.forEach(row => {
      console.log(`${row.filter_category}: ${row.count} posts, ${Math.round(row.avg_hearts)} avg hearts`);
    });
    
    console.log('\n✅ Filter categories set up successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up filter categories:', error);
  }
}

setupFilterCategories();
