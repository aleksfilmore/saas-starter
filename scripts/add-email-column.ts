import { db } from '../lib/db';

async function addEmailColumn() {
  try {
    console.log('Adding email_notifications column...');
    await db.execute('ALTER TABLE users ADD COLUMN email_notifications BOOLEAN DEFAULT true');
    console.log('✅ Column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addEmailColumn();
