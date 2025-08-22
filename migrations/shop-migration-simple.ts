/**
 * Simple Migration: Shop & Byte Economy System
 * 
 * This migration adds the necessary tables for the shop system
 * and seeds the data without using complex indexes.
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { BYTE_EARNING_ACTIVITIES, SHOP_PRODUCTS } from '@/lib/shop/constants';

// Database connection
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable is not set');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function createTables() {
  console.log('🏪 Creating shop and byte economy tables...');
  
  try {
    // Create shop_products table
    await sql`
      CREATE TABLE IF NOT EXISTS shop_products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        byte_price INTEGER,
        cash_price INTEGER,
        variants TEXT,
        digital_content TEXT,
        printify_product_id TEXT,
        is_active BOOLEAN DEFAULT true,
        is_digital BOOLEAN DEFAULT false,
        requires_shipping BOOLEAN DEFAULT false,
        tags TEXT,
        images TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create shop_orders table
    await sql`
      CREATE TABLE IF NOT EXISTS shop_orders (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id),
        order_number TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_method TEXT NOT NULL,
        total_bytes INTEGER DEFAULT 0,
        total_cash INTEGER DEFAULT 0,
        shipping_name TEXT,
        shipping_email TEXT,
        shipping_address_1 TEXT,
        shipping_address_2 TEXT,
        shipping_city TEXT,
        shipping_state TEXT,
        shipping_zip TEXT,
        shipping_country TEXT,
        stripe_session_id TEXT,
        stripe_payment_intent_id TEXT,
        tracking_number TEXT,
        shipped_at TIMESTAMP WITH TIME ZONE,
        delivered_at TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        metadata TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create shop_order_items table
    await sql`
      CREATE TABLE IF NOT EXISTS shop_order_items (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id TEXT NOT NULL REFERENCES shop_orders(id),
        product_id TEXT NOT NULL REFERENCES shop_products(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        variant TEXT,
        byte_price_per_item INTEGER,
        cash_price_per_item INTEGER,
        status TEXT NOT NULL DEFAULT 'pending',
        printify_order_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create byte_earning_rules table
    await sql`
      CREATE TABLE IF NOT EXISTS byte_earning_rules (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        activity TEXT NOT NULL UNIQUE,
        byte_reward INTEGER NOT NULL,
        daily_limit INTEGER,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create user_byte_history table
    await sql`
      CREATE TABLE IF NOT EXISTS user_byte_history (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id),
        activity_type TEXT NOT NULL,
        byte_change INTEGER NOT NULL,
        balance_after INTEGER NOT NULL,
        description TEXT,
        metadata TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create streak_bonuses table
    await sql`
      CREATE TABLE IF NOT EXISTS streak_bonuses (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id),
        streak_days INTEGER NOT NULL,
        bonus_bytes INTEGER NOT NULL,
        activity_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create digital_product_access table
    await sql`
      CREATE TABLE IF NOT EXISTS digital_product_access (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id),
        product_id TEXT NOT NULL REFERENCES shop_products(id),
        access_type TEXT NOT NULL,
        order_id TEXT REFERENCES shop_orders(id),
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP WITH TIME ZONE,
        first_accessed_at TIMESTAMP WITH TIME ZONE,
        last_accessed_at TIMESTAMP WITH TIME ZONE,
        access_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Add byte balance columns to users table if they don't exist
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bytes INTEGER DEFAULT 100,
      ADD COLUMN IF NOT EXISTS byte_balance INTEGER DEFAULT 100;
    `;

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
    const rules = Object.values(BYTE_EARNING_ACTIVITIES);
    
    for (const rule of rules) {
      await sql`
        INSERT INTO byte_earning_rules (activity, byte_reward, daily_limit, description, is_active)
        VALUES (${rule.activity}, ${rule.bytes}, ${rule.dailyLimit || null}, ${rule.description}, true)
        ON CONFLICT (activity) DO UPDATE SET
          byte_reward = EXCLUDED.byte_reward,
          daily_limit = EXCLUDED.daily_limit,
          description = EXCLUDED.description,
          updated_at = NOW()
      `;
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
    const products = Object.values(SHOP_PRODUCTS);
    
    for (const [index, product] of products.entries()) {
      await sql`
        INSERT INTO shop_products (
          id, name, description, category, type, byte_price, cash_price,
          variants, digital_content, printify_product_id, is_active,
          is_digital, requires_shipping, tags, images, sort_order
        )
        VALUES (
          ${product.id},
          ${product.name},
          ${product.description},
          ${product.category},
          ${product.type},
          ${product.bytePrice || null},
          null,
          ${typeof product.variants === 'string' ? product.variants : JSON.stringify(product.variants || null)},
          ${(product as any).digitalContent || null},
          ${(product as any).printifyProductId || null},
          true,
          ${product.isDigital},
          ${product.requiresShipping},
          ${JSON.stringify(product.tags || [])},
          ${JSON.stringify(product.images || [])},
          ${index}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          byte_price = EXCLUDED.byte_price,
          cash_price = EXCLUDED.cash_price,
          variants = EXCLUDED.variants,
          digital_content = EXCLUDED.digital_content,
          printify_product_id = EXCLUDED.printify_product_id,
          is_active = EXCLUDED.is_active,
          tags = EXCLUDED.tags,
          images = EXCLUDED.images,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW()
      `;
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
    { name: 'Create Tables', fn: createTables },
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
