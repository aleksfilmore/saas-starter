import { NextResponse } from 'next/server';
import { getMissingCoreTables, restoreMissingTables, CORE_TABLES } from '@/lib/db/health';
export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const buildGuard = process.env.NEXT_PHASE === 'phase-production-build' || process.env.VERCEL === '1';
    const missingBefore = await getMissingCoreTables();
    if (buildGuard) {
      return NextResponse.json({ ok: true, buildPhase: true, expected: CORE_TABLES, missingBefore, restored: [], stillMissing: missingBefore, timestamp: new Date().toISOString() });
    }
    let restored: string[] = [];
    if (missingBefore.length) {
      const result = await restoreMissingTables(missingBefore);
      restored = result.restored;
      const stillMissing = await getMissingCoreTables();
      return NextResponse.json({
        ok: stillMissing.length === 0,
        expected: CORE_TABLES,
        missingBefore,
        restored,
        stillMissing,
        timestamp: new Date().toISOString()
      });
    }
    return NextResponse.json({ ok: true, expected: CORE_TABLES, missingBefore, restored: [], stillMissing: [], timestamp: new Date().toISOString() });
  } catch (e) {
    console.error('[DB-HEALTH] endpoint failure', e);
    return NextResponse.json({ ok: false, error: 'health check failed' }, { status: 500 });
  }
}
