import { NextResponse } from 'next/server';
import { RITUAL_BANK } from '@/lib/rituals/ritual-bank';
import { PAID_RITUALS_DATABASE } from '@/lib/rituals/paid-rituals-database';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Ghost inventory
  const ghost = RITUAL_BANK.filter(r => r.tier === 'ghost');
  const firewallLite = RITUAL_BANK.filter(r => r.tier === 'firewall');

  // Paid full database
  const paidAll = PAID_RITUALS_DATABASE;
  // Heuristic: archetype-guided vs premium (future: explicit field)
  const archetypeKeys = ['grief-cycle','petty-purge','glow-up-forge','reframe-loop','ghost-cleanse','public-face','soft-reset','cult-missions'];
  const archetypeBased = paidAll.filter(r => archetypeKeys.includes(r.category));
  const premium = paidAll.filter(r => !archetypeKeys.includes(r.category));

  return NextResponse.json({
    ghostCount: ghost.length,
    firewallLiteCount: firewallLite.length,
    paidTotal: paidAll.length,
    paidArchetypeCount: archetypeBased.length,
    paidPremiumCount: premium.length,
    ghostNeededToReach90: Math.max(0, 90 - ghost.length),
    sampleGhost: ghost.slice(0,5).map(r=>r.id),
    samplePaid: paidAll.slice(0,5).map(r=>r.id)
  });
}