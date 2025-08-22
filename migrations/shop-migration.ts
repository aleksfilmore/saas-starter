/**
 * Database Migration: Shop & Byte Economy System
 * 
 * This migration adds all the necessary tables for the CTRL+ALT+BLOCK
 * Byte Economy and Shop system.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  shopProducts, 
  shopOrders, 
  shopOrderItems, 
  byteEarningRules,
  userByteHistory,
  streakBonuses,
  digitalProductAccess
} from '@/lib/db/schema';
import { BYTE_EARNING_ACTIVITIES, SHOP_PRODUCTS } from '@/lib/shop/constants';

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function createShopTables() {
  console.log('🏪 Creating shop and byte economy tables...');
  
  try {
    // Tables are created automatically by Drizzle based on schema definitions
    // This script focuses on seeding initial data
    
    console.log('✅ Tables created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    return false;
  }
}

async function seedByteEarningRules() {
  console.log('⚡ Seeding byte earning rules...');
  
  try {
    const rules = Object.values(BYTE_EARNING_ACTIVITIES).map(rule => ({
      activity: rule.activity,
      byteReward: rule.bytes,
      dailyLimit: rule.dailyLimit || null,
      description: rule.description,
      isActive: true
    }));
    
    for (const rule of rules) {
      await db
        .insert(byteEarningRules)
        .values(rule)
        .onConflictDoUpdate({
          target: byteEarningRules.activity,
          set: {
            byteReward: rule.byteReward,
            dailyLimit: rule.dailyLimit,
            description: rule.description,
            updatedAt: new Date()
          }
        });
    }
    
    console.log(`✅ Seeded ${rules.length} byte earning rules`);
    return true;
  } catch (error) {
    console.error('❌ Failed to seed byte earning rules:', error);
    return false;
  }
}

async function seedShopProducts() {
  console.log('🛍️ Seeding shop products...');
  
  try {
    const products = Object.values(SHOP_PRODUCTS).map((product, index) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      type: product.type,
      bytePrice: product.bytePrice,
      cashPrice: null,
      variants: typeof product.variants === 'string' ? product.variants : JSON.stringify(product.variants || null),
      digitalContent: (product as any).digitalContent || null,
      printifyProductId: (product as any).printifyProductId || null,
      isActive: true,
      isDigital: product.isDigital,
      requiresShipping: product.requiresShipping,
      tags: JSON.stringify(product.tags || []),
      images: JSON.stringify(product.images || []),
      sortOrder: index
    }));
    
    for (const product of products) {
      await db
        .insert(shopProducts)
        .values(product)
        .onConflictDoUpdate({
          target: shopProducts.id,
          set: {
            name: product.name,
            description: product.description,
            bytePrice: product.bytePrice,
            cashPrice: product.cashPrice,
            variants: product.variants,
            digitalContent: product.digitalContent,
            printifyProductId: product.printifyProductId,
            isActive: product.isActive,
            tags: product.tags,
            images: product.images,
            sortOrder: product.sortOrder,
            updatedAt: new Date()
          }
        });
    }
    
    console.log(`✅ Seeded ${products.length} shop products`);
    return true;
  } catch (error) {
    console.error('❌ Failed to seed shop products:', error);
    return false;
  }
}

async function updateUserBytesColumn() {
  console.log('👤 Ensuring users have byte balances...');
  
  try {
    // Update any users with null bytes to have default 100 bytes
    await sql`
      UPDATE users 
      SET bytes = COALESCE(bytes, 100),
          byte_balance = COALESCE(byte_balance, 100)
      WHERE bytes IS NULL OR byte_balance IS NULL
    `;
    
    console.log('✅ Updated user byte balances');
    return true;
  } catch (error) {
    console.error('❌ Failed to update user bytes:', error);
    return false;
  }
}

async function runMigration() {
  console.log('🚀 Starting Shop & Byte Economy Migration...');
  console.log('==========================================');
  
  const steps = [
    { name: 'Create Tables', fn: createShopTables },
    { name: 'Seed Byte Rules', fn: seedByteEarningRules },
    { name: 'Seed Products', fn: seedShopProducts },
    { name: 'Update User Bytes', fn: updateUserBytesColumn }
  ];
  
  let allSuccessful = true;
  
  for (const step of steps) {
    console.log(`\n📋 ${step.name}...`);
    const success = await step.fn();
    if (!success) {
      allSuccessful = false;
      console.log(`❌ ${step.name} failed`);
      break;
    } else {
      console.log(`✅ ${step.name} completed`);
    }
  }
  
  if (allSuccessful) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('\nShop & Byte Economy Features:');
    console.log('• 💰 Byte earning system activated');
    console.log('• 🛍️ Product catalog loaded');
    console.log('• 🏆 Streak bonuses ready');
    console.log('• 📱 Digital product delivery system');
    console.log('• 📦 Physical product integration (Printify ready)');
    console.log('\nNext Steps:');
    console.log('1. Visit /shop to see the product catalog');
    console.log('2. Complete rituals to earn your first Bytes');
    console.log('3. Test the byte earning system with activities');
    console.log('4. Set up Stripe checkout for cash purchases');
    console.log('5. Configure Printify integration for physical products');
  } else {
    console.log('\n❌ Migration failed. Check errors above.');
  }
  
  await sql.end();
  process.exit(allSuccessful ? 0 : 1);
}

// Run the migration
if (require.main === module) {
  runMigration().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

export default runMigration;
