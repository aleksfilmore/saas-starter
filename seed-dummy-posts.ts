import { db } from './lib/db/index';
import { anonymousPosts } from './lib/db/schema';

const DUMMY_POSTS = [
  // System error posts (heartbreak theme)
  {
    content: "Some days I wake up and for a split second, I forget we're not together anymore. Then reality hits like a truck.",
    glitchCategory: "system_error",
    hearts: 47
  },
  {
    content: "I keep checking their social media even though I know it's only making things worse. When will this stop hurting?",
    glitchCategory: "system_error",
    hearts: 82
  },
  {
    content: "Today marks 3 months since they left. I thought I'd be over it by now, but here I am, crying in my car again.",
    glitchCategory: "system_error",
    hearts: 134
  },

  // Memory leak posts (sadness theme)
  {
    content: "Everything feels grey lately. Even my favorite songs don't bring me joy anymore.",
    glitchCategory: "memory_leak",
    hearts: 29
  },
  {
    content: "I miss having someone to share the little moments with. Like when I see a funny meme or a beautiful sunset.",
    glitchCategory: "memory_leak",
    hearts: 156
  },
  {
    content: "The hardest part isn't the big milestones. It's the quiet Tuesday evenings when you realize you're truly alone.",
    glitchCategory: "memory_leak",
    hearts: 203
  },

  // Buffer overflow posts (anger theme)
  {
    content: "How can someone just walk away from 3 years like it meant nothing? I'm so angry I could scream.",
    glitchCategory: "buffer_overflow",
    hearts: 67
  },
  {
    content: "I gave them everything and they threw it away for someone else. The betrayal burns more than the loss.",
    glitchCategory: "buffer_overflow",
    hearts: 91
  },
  {
    content: "They said they 'needed space' but apparently space meant being with their ex within a week. I'm furious.",
    glitchCategory: "buffer_overflow",
    hearts: 178
  },

  // Loop detected posts (anxiety theme)
  {
    content: "What if I never find love again? What if they were my one chance and I blew it?",
    glitchCategory: "loop_detected",
    hearts: 43
  },
  {
    content: "Every time my phone buzzes I hope it's them, but I'm also terrified it might actually be them.",
    glitchCategory: "loop_detected",
    hearts: 87
  },
  {
    content: "I can't stop overthinking every conversation we had. Did I miss the signs? Could I have done something different?",
    glitchCategory: "loop_detected",
    hearts: 124
  },

  // Null pointer posts (hope theme)
  {
    content: "Today I laughed at a joke for the first time in weeks. Maybe I'm starting to heal after all.",
    glitchCategory: "null_pointer",
    hearts: 198
  },
  {
    content: "I'm learning that loving myself doesn't require someone else's approval. It's scary but liberating.",
    glitchCategory: "null_pointer",
    hearts: 267
  },
  {
    content: "Started going to therapy and wow, I'm discovering so much about myself. The pain has purpose.",
    glitchCategory: "null_pointer",
    hearts: 143
  },

  // Syntax error posts (confusion theme)
  {
    content: "I don't even know who I am without them. We were together so long, I forgot what I actually liked.",
    glitchCategory: "syntax_error",
    hearts: 76
  },
  {
    content: "Some days I want them back desperately. Other days I realize I'm better off alone. So confusing.",
    glitchCategory: "syntax_error",
    hearts: 112
  },
  {
    content: "Everyone keeps telling me 'you're better without them' but if that's true, why does it hurt so much?",
    glitchCategory: "syntax_error",
    hearts: 89
  },

  // Stack overflow posts (breakthrough theme)
  {
    content: "I finally deleted their number today. It felt terrifying and empowering at the same time.",
    glitchCategory: "stack_overflow",
    hearts: 234
  },
  {
    content: "Realized I was trying to get back someone who never truly appreciated me. I deserve better than that.",
    glitchCategory: "stack_overflow",
    hearts: 312
  },
  {
    content: "Went on my first date since the breakup. Didn't go anywhere but it felt good to remember I'm desirable.",
    glitchCategory: "stack_overflow",
    hearts: 187
  }
];

function generateGlitchTitle(category: string): string {
  const titles: Record<string,string> = {
    system_error: '5Y5T3M_3RR0R_D3T3CT3D',
    loop_detected: 'L00P_1NF1N1T3_D3T3CT3D', 
    memory_leak: 'M3M0RY_L34K_1D3NT1F13D',
    buffer_overflow: 'BUFF3R_0V3RFL0W_W4RN1NG',
    syntax_error: '5YNT4X_3RR0R_L1N3_0',
    null_pointer: 'NULL_P01NT3R_3XC3PT10N',
    stack_overflow: '5T4CK_0V3RFL0W_3XC3PT10N',
    access_denied: '4CC355_D3N13D_3RR0R_403'
  };
  return titles[category] || 'UNK0WN_3RR0R';
}

async function seedDummyPosts() {
  try {
    console.log('Starting to seed dummy posts...');
    
    for (const post of DUMMY_POSTS) {
      const id = crypto.randomUUID();
      const glitchTitle = generateGlitchTitle(post.glitchCategory);
      
      await db.insert(anonymousPosts).values({
        id,
        userId: null, // Anonymous posts
        content: post.content,
        glitchCategory: post.glitchCategory,
        glitchTitle,
        category: post.glitchCategory,
        hearts: post.hearts,
        isAnonymous: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Added ${post.glitchCategory} post: "${post.content.substring(0, 50)}..."`);
    }
    
    console.log(`Successfully seeded ${DUMMY_POSTS.length} dummy posts!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding dummy posts:', error);
    process.exit(1);
  }
}

seedDummyPosts();
