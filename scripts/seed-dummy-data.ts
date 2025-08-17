import { SeedService } from '../lib/seed/dummy-users';

async function main() {
  console.log('🌱 Seeding dummy data for community life...');
  
  try {
    await SeedService.seedAll();
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
