import { db } from './drizzle';
import { sql } from 'drizzle-orm';
import { RITUAL_BANK } from '../rituals/ritual-bank';

// Archetype mapping from categories to your spec archetypes
const ARCHETYPE_MAPPING = {
  'grief-cycle': ['GHOST_IN_SHELL', 'UNIVERSAL'],
  'petty-purge': ['FIREWALL_BUILDER', 'UNIVERSAL'],
  'glow-up-forge': ['FIREWALL_BUILDER', 'SECURE_NODE'],
  'reframe-loop': ['FIREWALL_BUILDER', 'SECURE_NODE'],
  'ghost-cleanse': ['GHOST_IN_SHELL', 'UNIVERSAL'],
  'public-face': ['SECURE_NODE', 'UNIVERSAL'],
  'soft-reset': ['UNIVERSAL', 'GHOST_IN_SHELL'],
  'cult-missions': ['UNIVERSAL']
};

export async function seedRituals() {
  try {
    console.log('🌱 Seeding ritual database...');
    
    // Clear existing rituals (optional)
    const clearExisting = process.env.CLEAR_RITUALS === 'true';
    if (clearExisting) {
      console.log('🗑️ Clearing existing rituals...');
      await db.execute(sql`DELETE FROM user_rituals`);
      await db.execute(sql`DELETE FROM rituals`);
    }

    let seededCount = 0;
    
    for (const ritual of RITUAL_BANK) {
      try {
        // Convert your ritual format to database format
        const steps = ritual.instructions.map((instruction, index) => ({
          type: 'text',
          order: index + 1,
          content: instruction,
          estimated_seconds: 60 // Default 1 minute per step
        }));

        const archetypes = ARCHETYPE_MAPPING[ritual.category] || ['UNIVERSAL'];

        // Insert ritual
        await db.execute(sql`
          INSERT INTO rituals (
            id,
            title,
            description,
            steps,
            archetype,
            difficulty,
            media_refs,
            tags,
            category,
            emotional_tone,
            action_type,
            tier,
            estimated_time,
            xp_reward,
            byte_reward
          ) VALUES (
            ${ritual.id},
            ${ritual.title},
            ${ritual.description},
            ${JSON.stringify(steps)},
            ${archetypes},
            ${ritual.difficultyLevel},
            ${'{}'},
            ${ritual.tags},
            ${ritual.category},
            ${ritual.emotionalTone},
            ${ritual.actionType},
            ${ritual.tier},
            ${ritual.estimatedTime},
            ${ritual.xpReward},
            ${ritual.byteReward}
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            steps = EXCLUDED.steps,
            archetype = EXCLUDED.archetype,
            difficulty = EXCLUDED.difficulty,
            tags = EXCLUDED.tags,
            category = EXCLUDED.category,
            emotional_tone = EXCLUDED.emotional_tone,
            action_type = EXCLUDED.action_type,
            tier = EXCLUDED.tier,
            estimated_time = EXCLUDED.estimated_time,
            xp_reward = EXCLUDED.xp_reward,
            byte_reward = EXCLUDED.byte_reward,
            updated_at = now()
        `);
        
        seededCount++;
        console.log(`✅ Seeded: ${ritual.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to seed ritual ${ritual.id}:`, error);
      }
    }
    
    console.log(`🎉 Successfully seeded ${seededCount} rituals!`);
    
    // Show summary
    const summary = await db.execute(sql`
      SELECT 
        category,
        COUNT(*) as count,
        array_agg(DISTINCT tier) as tiers,
        array_agg(DISTINCT unnest(archetype)) as archetypes
      FROM rituals 
      GROUP BY category
      ORDER BY category
    `);
    
    console.log('\n📊 Ritual Library Summary:');
    for (const row of summary) {
      console.log(`  ${row.category}: ${row.count} rituals (${row.tiers.join(', ')}) - ${row.archetypes.join(', ')}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to seed rituals:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  seedRituals()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
