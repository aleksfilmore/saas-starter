import { db } from './lib/db'
import { users } from './lib/db/schema'
import { nanoid } from 'nanoid'

async function createPremiumTestUser() {
  try {
    console.log('🚀 Creating premium test user...')
    
    const testUser = {
      id: nanoid(),
      email: 'premium@test.com',
      hashedPassword: '$argon2id$v=19$m=19456,t=2,p=1$placeholder', // Placeholder password hash
      tier: 'firewall',
      archetype: 'warrior',
      xp: 350,
      bytes: 150,
      level: 5,
      ritual_streak: 7,
      no_contact_streak: 14,
      is_verified: true,
      subscription_status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }
    
    // Insert test user
    await db.insert(users).values(testUser)
    
    console.log('✅ Premium test user created successfully!')
    console.log('📧 Email: premium@test.com')
    console.log('🔒 Password: password123')
    console.log('💎 Subscription: Premium (active)')
    console.log('🔥 Streak: 7 days')
    console.log('🎯 Level: 5')
    
  } catch (error) {
    console.error('❌ Error creating test user:', error)
  }
}

createPremiumTestUser().then(() => process.exit(0))
