const fs = require('fs');

// Read the admin homepage
const adminPage = fs.readFileSync('app/admin/page.tsx', 'utf8');

let updated = adminPage;

// Replace "Live from the Wall of Wounds" with quiz-focused content
updated = updated.replace(
  /Live from the Wall of Wounds/g,
  'Discover Your Healing Path'
);

// Replace "Join the Wall →" with quiz CTA
updated = updated.replace(
  /Join the Wall →/g,
  'Take the Quiz →'
);

// Update wall links to quiz links
updated = updated.replace(
  /href="\/wall"/g,
  'href="/quiz"'
);

// Replace wall section title with quiz section
updated = updated.replace(
  /\{\/\* Live Wall of Wounds Preview - Auto-Scroll Carousel \*\/\}/,
  '{/* Healing Path Quiz Preview */}'
);

// Update the mock wall posts to be quiz-focused testimonials/insights
updated = updated.replace(
  /const mockWallPosts = \[[\s\S]*?\];/,
  `const healingInsights = [
    {
      id: '1',
      content: "The 2-minute attachment quiz revealed I'm 'anxious-avoidant' - finally understanding my patterns is helping me heal faster.",
      type: 'insight',
      reactions: 23,
      replies: 8,
      timeAgo: '2h ago',
      archetype: 'seeker'
    },
    {
      id: '2',
      content: "Quiz showed me I'm a 'phantom' type. The personalized healing plan feels like it was written just for me.",
      type: 'breakthrough',
      reactions: 45,
      replies: 12,
      timeAgo: '4h ago',
      archetype: 'phantom'
    },
    {
      id: '3',
      content: "Took the quiz 3 times over 2 months - watching my healing archetype evolve from 'wounded' to 'warrior' is incredible.",
      type: 'victory',
      reactions: 67,
      replies: 15,
      timeAgo: '6h ago',
      archetype: 'warrior'
    }
  ];`
);

// Update references to mockWallPosts to use healingInsights
updated = updated.replace(/mockWallPosts/g, 'healingInsights');

// Add blog article visuals section before the quiz insights
const blogSection = `
      {/* Featured Blog Articles */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-900/20 to-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              <Brain className="h-8 w-8 inline mr-3 text-purple-400" />
              Latest Healing Insights
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Evidence-based articles and real recovery stories to guide your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/blog/7-stages-breakup-healing">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105 group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      The 7 Stages of Breakup Healing
                    </h3>
                    <p className="text-gray-400 text-sm">Science-based guide to recovery</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/neuroplasticity-heartbreak-recovery">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105 group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Neuroplasticity & Recovery
                    </h3>
                    <p className="text-gray-400 text-sm">How your brain heals itself</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/sarah-recovery-story">
              <Card className="bg-gray-800/50 border-gray-600/50 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105 group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      From Devastation to Dream Life
                    </h3>
                    <p className="text-gray-400 text-sm">Sarah's transformation story</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                Read All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
`;

// Insert blog section before the healing insights section
updated = updated.replace(
  /(\s+)(\{\/\* Healing Path Quiz Preview \*\/\})/,
  `$1${blogSection}$1$2`
);

// Write the updated admin page
fs.writeFileSync('app/admin/page.tsx', updated);

console.log('✅ Admin homepage updated successfully!');
console.log('🔧 Updated: Wall references to quiz-focused CTAs');
console.log('📰 Added: Blog article visuals section');
console.log('🧠 Changed: Wall posts to healing insights');
