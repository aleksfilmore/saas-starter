import { sql } from './lib/db/db';

async function checkBadgeSchema() {
    try {
        console.log('🔍 Checking badge table schema...');
        
        const schema = await sql`
            SELECT column_name, is_nullable, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'badges' 
            ORDER BY ordinal_position
        `;
        
        console.log('\n📋 Badge table schema:');
        schema.forEach(col => {
            console.log(`${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(nullable)'} ${col.column_default ? `default: ${col.column_default}` : ''}`);
        });
        
        // Also check existing badges for icon_url patterns
        console.log('\n🎯 Existing badges with icon_url:');
        const existingBadges = await sql`
            SELECT id, name, icon_url 
            FROM badges 
            ORDER BY created_at 
            LIMIT 10
        `;
        
        existingBadges.forEach(badge => {
            console.log(`${badge.id}: ${badge.name} -> ${badge.icon_url}`);
        });
        
    } catch (error) {
        console.error('❌ Error checking schema:', error);
    } finally {
        process.exit(0);
    }
}

checkBadgeSchema();
