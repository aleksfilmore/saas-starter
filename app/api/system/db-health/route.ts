import { NextResponse } from 'next/server';
import { getMissingCoreTables, restoreMissingTables, CORE_TABLES } from '@/lib/db/health';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const missingBefore = await getMissingCoreTables();
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
