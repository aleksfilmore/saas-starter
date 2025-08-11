// Quick test to verify our ritual bank is working
const { RITUAL_BANK } = require('./lib/rituals/ritual-bank.ts');

console.log('🔮 Testing Ritual Bank...');
console.log(`📊 Total rituals: ${RITUAL_BANK.length}`);

// Test categories
const categories = [...new Set(RITUAL_BANK.map(r => r.category))];
console.log(`📂 Categories: ${categories.length}`);
categories.forEach(cat => {
  const count = RITUAL_BANK.filter(r => r.category === cat).length;
  console.log(`  - ${cat}: ${count} rituals`);
});

// Test first few rituals
console.log('\n🎯 Sample rituals:');
RITUAL_BANK.slice(0, 3).forEach(ritual => {
  console.log(`  ${ritual.id}: "${ritual.title}" (${ritual.category}, ${ritual.estimatedTime})`);
});

console.log('\n✅ Ritual bank test complete!');
