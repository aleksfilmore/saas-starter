// Add more posts with varied like counts for each emotion category
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');

const sql = neon(process.env.POSTGRES_URL);

// Generate random like count (weighted toward lower numbers to be realistic)
function getRandomLikes() {
  const rand = Math.random();
  if (rand < 0.3) return Math.floor(Math.random() * 3); // 0-2 likes (30%)
  if (rand < 0.6) return Math.floor(Math.random() * 8) + 3; // 3-10 likes (30%)
  if (rand < 0.85) return Math.floor(Math.random() * 15) + 11; // 11-25 likes (25%)
  return Math.floor(Math.random() * 25) + 26; // 26-50 likes (15%)
}

const ADDITIONAL_POSTS = [
  // Heartbreak (adding 5 more posts)
  {
    content: "Six months later and I still reach for my phone to text them good morning. Muscle memory is cruel.",
    glitchCategory: 'heartbreak',
    glitchTitle: 'M3M0RY_L34K_D3T3CT3D',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },
  {
    content: "They said they needed space. I gave them the entire universe. Still wasn't enough.",
    glitchCategory: 'heartbreak',
    glitchTitle: 'C0NN3CT10N_T1M30UT',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },
  {
    content: "Blocked them on everything but somehow they still live rent-free in my head. How do I evict them?",
    glitchCategory: 'heartbreak',
    glitchTitle: 'ACC355_D3N13D_F41L3D',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "Found their playlist on my Spotify. Every song is a knife. Why did I think listening was a good idea?",
    glitchCategory: 'heartbreak',
    glitchTitle: '4UD10_BUFF3R_0V3RFL0W',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },
  {
    content: "Day 127 no contact. Sometimes I forget what their voice sounds like. Is that healing or just forgetting?",
    glitchCategory: 'heartbreak',
    glitchTitle: 'D4T4_C0RRUPT10N_W4RN1NG',
    archetype: 'Secure Node',
    likes: getRandomLikes()
  },

  // Sadness (adding 4 more posts)
  {
    content: "Rainy days used to be cozy. Now they just match my mood perfectly. When did weather become my therapist?",
    glitchCategory: 'sadness',
    glitchTitle: 'W34TH3R_5YNC_3RR0R',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },
  {
    content: "My mom asked if I'm okay. I said yes but we both know I'm lying. Some sadness is too heavy for words.",
    glitchCategory: 'sadness',
    glitchTitle: 'C0MMUN1C4T10N_F41LURE',
    archetype: 'Secure Node',
    likes: getRandomLikes()
  },
  {
    content: "Watched everyone's highlight reels on social media today. Reminder: comparison is the thief of joy.",
    glitchCategory: 'sadness',
    glitchTitle: '50C14L_M3D14_0V3RL04D',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },
  {
    content: "Used to think sadness was weakness. Now I realize it's just love with nowhere to go. Learning to sit with it.",
    glitchCategory: 'sadness',
    glitchTitle: '3M0T10N4L_R3D1R3CT_3RR0R',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },

  // Anger (adding 5 more posts)
  {
    content: "They moved on in two weeks. TWO WEEKS. I'm still here debugging our relationship. The audacity.",
    glitchCategory: 'anger',
    glitchTitle: 'T1M1NG_4TT4CK_D3T3CT3D',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },
  {
    content: "Saw them with someone new today. My anger could power a small city. Converting rage into gym membership.",
    glitchCategory: 'anger',
    glitchTitle: 'P0W3R_5URG3_W4RN1NG',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "They gaslit me for months and now they're playing victim on social media. The manipulation is real.",
    glitchCategory: 'anger',
    glitchTitle: 'M4N1PUL4T10N_V1RU5_D3T3CT3D',
    archetype: 'Secure Node',
    likes: getRandomLikes()
  },
  {
    content: "Anger phase activated. Better than the crying phase but my jaw hurts from clenching. Need to find an outlet.",
    glitchCategory: 'anger',
    glitchTitle: 'T3N510N_0V3RL04D_4L3RT',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },
  {
    content: "They said I was 'too much' but collected every piece of energy I gave them. I wasn't too much, I was too good.",
    glitchCategory: 'anger',
    glitchTitle: '3N3RGY_3XTR4CT10N_3RR0R',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },

  // Anxiety (adding 4 more posts)
  {
    content: "What if I never find someone who gets me? What if I'm broken? What if, what if, what if... My brain needs a mute button.",
    glitchCategory: 'anxiety',
    glitchTitle: 'L00P_1NF1N1T3_D3T3CT3D',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },
  {
    content: "Heart racing over a text that says 'we need to talk'. Why do four words have the power to destroy my entire day?",
    glitchCategory: 'anxiety',
    glitchTitle: 'H34RT_R4T3_5P1K3_3RR0R',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },
  {
    content: "Anxiety brain: What if they hate me? Rational brain: They bought you coffee yesterday. Anxiety brain: WHAT IF THEY HATE ME?",
    glitchCategory: 'anxiety',
    glitchTitle: 'R4T10N4L_PR0C355_F41L3D',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "3 AM and I'm overthinking every conversation from 2019. Why is my anxiety so committed to its job?",
    glitchCategory: 'anxiety',
    glitchTitle: '5L33P_M0D3_D154BL3D',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },

  // Rage (adding 4 more posts)
  {
    content: "They cheated and somehow I'm the bad guy for being upset. The gaslighting Olympics gold medal goes to...",
    glitchCategory: 'rage',
    glitchTitle: 'G45L1GHT_V1RU5_D3T3CT3D',
    archetype: 'Secure Node',
    likes: getRandomLikes()
  },
  {
    content: "Rage is just grief wearing a Halloween costume. Under all this anger is just a broken heart that trusted wrong.",
    glitchCategory: 'rage',
    glitchTitle: 'GR13F_M45K_R3M0V3D',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "They wasted 3 years of my life and I'm the one dealing with the cleanup. The audacity is astronomical.",
    glitchCategory: 'rage',
    glitchTitle: 'T1M3_W45T3_3XC3PT10N',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },
  {
    content: "Punching bag is my new best friend. Better than punching walls. Learning healthy rage expression one jab at a time.",
    glitchCategory: 'rage',
    glitchTitle: 'H34LTHY_0UTPUT_F0UND',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },

  // Confusion (adding 5 more posts)
  {
    content: "They said they loved me on Monday and left on Wednesday. I need a manual for human behavior because I'm lost.",
    glitchCategory: 'confusion',
    glitchTitle: 'HUMAN_M4NU4L_N0T_F0UND',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },
  {
    content: "Mixed signals were their specialty. Green light, red light, yellow light - I felt like I was in emotional traffic.",
    glitchCategory: 'confusion',
    glitchTitle: '51GN4L_C0NFUS10N_3RR0R',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "How do you go from 'you're my everything' to 'we're better as friends' in 24 hours? The math doesn't add up.",
    glitchCategory: 'confusion',
    glitchTitle: 'L0G1C_C4LCUL4T10N_F41L3D',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },
  {
    content: "Everyone says I deserved better but if that's true, why do I miss the worse? Confused about my own feelings.",
    glitchCategory: 'confusion',
    glitchTitle: '53LF_4W4R3N355_3RR0R',
    archetype: 'Secure Node',
    likes: getRandomLikes()
  },
  {
    content: "They came back asking for friendship after destroying my trust. Is this normal? Am I crazy? Need a reality check.",
    glitchCategory: 'confusion',
    glitchTitle: 'R34L1TY_CH3CK_R3QU1R3D',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },

  // Hope (adding 4 more posts)
  {
    content: "First day I didn't think about them until 3 PM. Small victories count as major breakthroughs in my book.",
    glitchCategory: 'hope',
    glitchTitle: 'BR34KTHROUGH_4CH13V3D',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "Downloaded a dating app today. Not ready to use it yet, but having it feels like hope in my pocket.",
    glitchCategory: 'hope',
    glitchTitle: 'FUTUR3_0PT10N5_1N5T4LL3D',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },
  {
    content: "My therapist says healing isn't linear. Some days I believe her. Today is one of those days. Progress is progress.",
    glitchCategory: 'hope',
    glitchTitle: 'H34L1NG_PR0GR355_D3T3CT3D',
    archetype: 'Secure Node',
    likes: getRandomLikes()
  },
  {
    content: "Saw a couple fighting today and didn't feel jealous. Instead I felt grateful for my peace. Growth is real.",
    glitchCategory: 'hope',
    glitchTitle: 'P34C3_M0D3_4CT1V4T3D',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },

  // Breakthrough (adding 4 more posts)
  {
    content: "Realized I was trying to fix them instead of healing myself. The moment I switched focus, everything changed.",
    glitchCategory: 'breakthrough',
    glitchTitle: 'F0CU5_R3D1R3CT_5UCC355',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "They didn't break me. They revealed the cracks that were already there. Now I can fix them properly.",
    glitchCategory: 'breakthrough',
    glitchTitle: 'CR4CK_4N4LY515_C0MPL3T3',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },
  {
    content: "Stopped checking their social media 30 days ago. Today I realized I forgot to miss checking. Freedom feels good.",
    glitchCategory: 'breakthrough',
    glitchTitle: '4DD1CT10N_0V3RC0M3',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },
  {
    content: "Had coffee alone and actually enjoyed it. When did I become such good company for myself? Self-love is real.",
    glitchCategory: 'breakthrough',
    glitchTitle: '53LF_L0V3_UN10CK3D',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },

  // Identity (adding 4 more posts)  
  {
    content: "Spent so long being 'we' that I forgot how to be 'me'. Rediscovering myself one solo activity at a time.",
    glitchCategory: 'identity',
    glitchTitle: '1D3NT1TY_R3C0V3RY_M0D3',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },
  {
    content: "They loved the version of me that didn't exist. I became their fantasy and lost myself. Never again.",
    glitchCategory: 'identity',
    glitchTitle: 'F4K3_V3R510N_D3L3T3D',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "Looking at old photos and I don't recognize that person. Was I really that small? Time to reclaim my space.",
    glitchCategory: 'identity',
    glitchTitle: '53LF_1M4G3_C0RRUPT3D',
    archetype: 'Secure Node',
    likes: getRandomLikes()
  },
  {
    content: "Friends say I'm 'back to myself' but this version feels new. Maybe heartbreak was just an identity upgrade.",
    glitchCategory: 'identity',
    glitchTitle: '1D3NT1TY_UPGR4D3_C0MPL3T3',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  },

  // Future (adding 4 more posts)
  {
    content: "Used to plan our future in 5-year increments. Now I'm planning my lunch. Baby steps toward tomorrow.",
    glitchCategory: 'future',
    glitchTitle: 'PL4NN1NG_5Y5T3M_R3B00T',
    archetype: 'System Optimizer',
    likes: getRandomLikes()
  },
  {
    content: "My vision board had us in it. Time to make a new one with just me. The future is mine to design.",
    glitchCategory: 'future',
    glitchTitle: 'V1510N_B04RD_UPGR4D3D',
    archetype: 'Explorer',
    likes: getRandomLikes()
  },
  {
    content: "They took the future we planned but they can't take the future I'm building. Better things are coming.",
    glitchCategory: 'future',
    glitchTitle: 'FUTUR3_R3CL41M3D',
    archetype: 'Firewall Builder',
    likes: getRandomLikes()
  },
  {
    content: "Scared and excited about what's next. The unknown used to terrify me, now it feels like possibility.",
    glitchCategory: 'future',
    glitchTitle: 'UNKN0WN_V4R14BL3_4CC3PT3D',
    archetype: 'Data Flooder',
    likes: getRandomLikes()
  }
];

async function addMorePosts() {
  try {
    console.log('Adding more posts with varied like counts...');
    
    for (const post of ADDITIONAL_POSTS) {
      const postId = randomUUID();
      const userId = randomUUID(); // Generate dummy user ID
      
      await sql`
        INSERT INTO anonymous_posts (
          id, user_id, content, glitch_category, glitch_title, 
          hearts, created_at
        ) VALUES (
          ${postId}, ${userId}, ${post.content}, ${post.glitchCategory}, 
          ${post.glitchTitle}, ${post.likes}, 
          ${new Date()}
        )
      `;
    }
    
    console.log(`Added ${ADDITIONAL_POSTS.length} new posts!`);
    
    // Show final counts
    console.log('\nFinal post counts by category:');
    const counts = await sql`
      SELECT glitch_category, COUNT(*) as count, 
             MIN(hearts) as min_hearts, MAX(hearts) as max_hearts,
             ROUND(AVG(hearts)) as avg_hearts
      FROM anonymous_posts 
      GROUP BY glitch_category 
      ORDER BY glitch_category
    `;
    console.table(counts);
    
    const total = await sql`SELECT COUNT(*) as total FROM anonymous_posts`;
    console.log(`\nTotal posts: ${total[0].total}`);
    
  } catch (error) {
    console.error('Error adding posts:', error);
  }
}

addMorePosts();
