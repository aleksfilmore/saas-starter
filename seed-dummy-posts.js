const { db } = require('./lib/db/index.ts');
const { anonymousPosts } = require('./lib/db/schema.ts');

const DUMMY_POSTS = [
  // Heartbreak posts
  {
    content: "Some days I wake up and for a split second, I forget we're not together anymore. Then reality hits like a truck.",
    emotion: "heartbreak",
    hearts: 47,
    anonymous_name: "BrokenSoul23"
  },
  {
    content: "I keep checking their social media even though I know it's only making things worse. When will this stop hurting?",
    emotion: "heartbreak",
    hearts: 82,
    anonymous_name: "LostInLove"
  },
  {
    content: "Today marks 3 months since they left. I thought I'd be over it by now, but here I am, crying in my car again.",
    emotion: "heartbreak",
    hearts: 134,
    anonymous_name: "TimeHealer"
  },

  // Sadness posts
  {
    content: "Everything feels grey lately. Even my favorite songs don't bring me joy anymore.",
    emotion: "sadness",
    hearts: 29,
    anonymous_name: "GreySkies"
  },
  {
    content: "I miss having someone to share the little moments with. Like when I see a funny meme or a beautiful sunset.",
    emotion: "sadness",
    hearts: 156,
    anonymous_name: "LonelyHeart"
  },
  {
    content: "The hardest part isn't the big milestones. It's the quiet Tuesday evenings when you realize you're truly alone.",
    emotion: "sadness",
    hearts: 203,
    anonymous_name: "QuietTuesday"
  },

  // Anger posts
  {
    content: "How can someone just walk away from 3 years like it meant nothing? I'm so angry I could scream.",
    emotion: "anger",
    hearts: 67,
    anonymous_name: "RagingStorm"
  },
  {
    content: "I gave them everything and they threw it away for someone else. The betrayal burns more than the loss.",
    emotion: "anger",
    hearts: 91,
    anonymous_name: "BetrayedTrust"
  },
  {
    content: "They said they 'needed space' but apparently space meant being with their ex within a week. I'm furious.",
    emotion: "anger",
    hearts: 178,
    anonymous_name: "FuriouslyHurt"
  },

  // Anxiety posts
  {
    content: "What if I never find love again? What if they were my one chance and I blew it?",
    emotion: "anxiety",
    hearts: 43,
    anonymous_name: "WorryWart"
  },
  {
    content: "Every time my phone buzzes I hope it's them, but I'm also terrified it might actually be them.",
    emotion: "anxiety",
    hearts: 87,
    anonymous_name: "AnxiousHeart"
  },
  {
    content: "I can't stop overthinking every conversation we had. Did I miss the signs? Could I have done something different?",
    emotion: "anxiety",
    hearts: 124,
    anonymous_name: "OverThinker"
  },

  // Hope posts
  {
    content: "Today I laughed at a joke for the first time in weeks. Maybe I'm starting to heal after all.",
    emotion: "hope",
    hearts: 198,
    anonymous_name: "FirstSmile"
  },
  {
    content: "I'm learning that loving myself doesn't require someone else's approval. It's scary but liberating.",
    emotion: "hope",
    hearts: 267,
    anonymous_name: "SelfLove"
  },
  {
    content: "Started going to therapy and wow, I'm discovering so much about myself. The pain has purpose.",
    emotion: "hope",
    hearts: 143,
    anonymous_name: "GrowingStrong"
  },

  // Confusion posts
  {
    content: "I don't even know who I am without them. We were together so long, I forgot what I actually liked.",
    emotion: "confusion",
    hearts: 76,
    anonymous_name: "LostIdentity"
  },
  {
    content: "Some days I want them back desperately. Other days I realize I'm better off alone. So confusing.",
    emotion: "confusion",
    hearts: 112,
    anonymous_name: "MixedSignals"
  },
  {
    content: "Everyone keeps telling me 'you're better without them' but if that's true, why does it hurt so much?",
    emotion: "confusion",
    hearts: 89,
    anonymous_name: "ConfusedSoul"
  },

  // Breakthrough posts
  {
    content: "I finally deleted their number today. It felt terrifying and empowering at the same time.",
    emotion: "breakthrough",
    hearts: 234,
    anonymous_name: "DigitalDetox"
  },
  {
    content: "Realized I was trying to get back someone who never truly appreciated me. I deserve better than that.",
    emotion: "breakthrough",
    hearts: 312,
    anonymous_name: "WorthRealized"
  },
  {
    content: "Went on my first date since the breakup. Didn't go anywhere but it felt good to remember I'm desirable.",
    emotion: "breakthrough",
    hearts: 187,
    anonymous_name: "DateNightWin"
  }
];

async function seedDummyPosts() {
  try {
    console.log('Starting to seed dummy posts...');
    
    for (const post of DUMMY_POSTS) {
      await db.insert(anonymousPosts).values({
        content: post.content,
        emotion: post.emotion,
        hearts: post.hearts,
        anonymous_name: post.anonymous_name,
        created_at: new Date()
      });
      console.log(`Added post: "${post.content.substring(0, 50)}..."`);
    }
    
    console.log(`Successfully seeded ${DUMMY_POSTS.length} dummy posts!`);
  } catch (error) {
    console.error('Error seeding dummy posts:', error);
  }
}

seedDummyPosts();
