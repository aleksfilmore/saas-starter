/**
 * Simulation script: 40-day ritual rotation
 * - Paid path: uses guided selection via dailyRitualService (requires DB + user id)
 * - Ghost path: emulates hub free ritual assignment logic (avoid yesterday repetition)
 * Run with: npx tsx scripts/simulate-ritual-rotation.ts <ghost|firewall> <userId>
 */
import { dailyRitualService } from '@/lib/rituals/daily-ritual-service-drizzle';
import { RITUAL_BANK } from '@/lib/rituals/ritual-bank';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

const mode = process.argv[2] as 'ghost'|'firewall';
const userId = process.argv[3];
if(!mode || !userId){
  console.log('Usage: npx tsx scripts/simulate-ritual-rotation.ts <ghost|firewall> <userId>');
  process.exit(1);
}

async function simulateGhost(){
  const free = RITUAL_BANK.filter(r=> r.tier==='ghost');
  let last: string | null = null; const picks: string[] = [];
  for(let day=0; day<40; day++){
    const pool = free.filter(r=> r.id !== last);
    const chosen = (pool.length? pool: free)[Math.floor(Math.random()* (pool.length? pool.length: free.length))];
    picks.push(chosen.id);
    last = chosen.id;
  }
  const repeats = picks.filter((id,i)=> i>0 && id===picks[i-1]).length;
  console.log('Ghost 40d picks:', picks.join(','));
  console.log('Adjacent repeats:', repeats);
}

async function simulateFirewall(){
  // Fast-forward 40 days: reset assignments & history for user (non-destructive outside test user)
  await db.execute(sql`DELETE FROM daily_ritual_assignments WHERE user_id = ${userId}`);
  await db.execute(sql`DELETE FROM user_ritual_history WHERE user_id = ${userId}`);
  const days: string[] = [];
  const today = new Date(); today.setHours(0,0,0,0);
  for(let i=0;i<40;i++){ const d = new Date(today.getTime() + i*86400000); days.push(d.toISOString().slice(0,10)); }
  const chosenPerDay: string[] = [];
  for(const d of days){
    // Monkey-patch Date.now? Simpler: temporarily call private create method by faking today via process env not implemented; we directly call service + adjust assigned_date after.
    const res = await dailyRitualService.getTodaysRituals(userId);
    chosenPerDay.push(res.rituals.map(r=>r.ritual.id).join('+'));
    // Force advance: update assigned_date to simulate past day to allow new selection next loop
    await db.execute(sql`UPDATE daily_ritual_assignments SET assigned_date = ${d} WHERE user_id = ${userId}`);
  }
  console.log('Firewall 40d pairs:', chosenPerDay.join(' | '));
}

(async ()=>{
  if(mode==='ghost') await simulateGhost(); else await simulateFirewall();
  process.exit(0);
})();