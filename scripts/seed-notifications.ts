import { db } from '@/lib/db';
import { users, notifications } from '@/lib/db/actual-schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

async function main(){
  console.log('Seeding notifications...');
  const userRows = await db.select({ id: users.id }).from(users).limit(50);
  const now = Date.now();
  for(const u of userRows){
    // Skip if already has notifications
    const existing = await db.select({ id: notifications.id }).from(notifications).where(eq(notifications.user_id, u.id)).limit(1).catch(()=>[]);
    if(existing.length>0) continue;
    const sample = [
      { type:'daily_checkin', title:'Daily Check-In Reminder', message:'Log how you feel today.', offset: 2*60*60*1000 },
      { type:'streak', title:'Streak Rising', message:'Your ritual streak is growing. Keep the firewall strong.', offset: 8*60*60*1000 },
      { type:'milestone', title:'Milestone Achieved', message:'7 rituals completed. Momentum secured.', offset: 26*60*60*1000 },
    ];
    for(const s of sample){
      await db.insert(notifications).values({
        id: randomUUID(),
        user_id: u.id,
        type: s.type,
        title: s.title,
        message: s.message,
        read: s.type==='milestone',
        created_at: new Date(now - s.offset)
      }).catch(()=>{});
    }
  }
  console.log('Notification seed complete');
}

main().catch(e=>{ console.error(e); process.exit(1); });