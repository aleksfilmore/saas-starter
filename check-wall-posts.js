// Check what wall posts were seeded
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.POSTGRES_URL);

async function checkWallPosts() {
  try {
    const posts = await sql`
      SELECT glitch_category, COUNT(*) as count 
      FROM anonymous_posts 
      GROUP BY glitch_category 
      ORDER BY glitch_category
    `;
    
    console.log('Wall posts by emotion category:');
    console.table(posts);
    
    const total = await sql`SELECT COUNT(*) as total FROM anonymous_posts`;
    console.log(`\nTotal posts: ${total[0].total}`);
    
  } catch (error) {
    console.error('Error checking posts:', error);
  }
}

checkWallPosts();
