const { RITUAL_BANK } = require('./lib/rituals/ritual-bank.ts');

console.log('🔍 Checking ritual distribution by tier...');

const ghostRituals = RITUAL_BANK.filter(r => r.tier === 'ghost');
const firewallRituals = RITUAL_BANK.filter(r => r.tier === 'firewall');
const allRituals = RITUAL_BANK;

console.log(`\n📊 Ritual Counts:
- Ghost tier: ${ghostRituals.length} rituals
- Firewall tier: ${firewallRituals.length} rituals
- Total: ${allRituals.length} rituals`);

console.log('\n👻 Ghost tier rituals:');
ghostRituals.forEach(r => console.log(`- ${r.id}: ${r.title} (${r.category})`));

console.log('\n🔥 Firewall tier rituals:');
firewallRituals.forEach(r => console.log(`- ${r.id}: ${r.title} (${r.category})`));

console.log('\n✅ Firewall users have access to:', ghostRituals.length + firewallRituals.length, 'total rituals');

process.exit(0);
