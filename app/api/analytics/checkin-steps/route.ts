export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

// Returns aggregated check-in step funnel metrics for last N days (default 14)
// Metrics: step views, step completions, drop-off between steps, overall completion rate.
export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '14', 10)));
    const start = sql`NOW() - INTERVAL '${days} days'`;

    // Fetch events relevant to check-in flow
    // We expect events: checkin_started, checkin_step_viewed, checkin_step_completed, checkin_completed
    const rows: any[] = await db.execute(sql`
      SELECT event, properties, timestamp
      FROM analytics_events
      WHERE timestamp >= ${start}
        AND event IN ('checkin_started','checkin_step_viewed','checkin_step_completed','checkin_completed')
    `);

    interface StepAgg { step: number; views: number; completes: number; titleSamples: Set<string>; }
    const steps: Record<number, StepAgg> = {};
    let started = 0; let completed = 0;
    for (const r of rows) {
      const evt = r.event as string;
      let props: any = {}; try { props = JSON.parse(r.properties || '{}'); } catch {}
      if (evt === 'checkin_started') started++;
      if (evt === 'checkin_completed') completed++;
      if (evt === 'checkin_step_viewed' || evt === 'checkin_step_completed') {
        const stepNum = typeof props.step === 'number' ? props.step : NaN;
        if (!Number.isNaN(stepNum)) {
          if (!steps[stepNum]) steps[stepNum] = { step: stepNum, views: 0, completes: 0, titleSamples: new Set() };
          if (evt === 'checkin_step_viewed') steps[stepNum].views++;
          else steps[stepNum].completes++;
          if (props.name && steps[stepNum].titleSamples.size < 3) steps[stepNum].titleSamples.add(props.name);
        }
      }
    }
    const ordered = Object.values(steps).sort((a,b)=> a.step - b.step);
    // Compute drop-offs
    let prevViews: number | null = null;
    const funnel = ordered.map(s => {
      const dropFromPrev = prevViews && prevViews>0 ? (1 - (s.views/prevViews)) : 0;
      prevViews = s.views;
      return {
        step: s.step,
        titles: Array.from(s.titleSamples),
        views: s.views,
        completes: s.completes,
        completionRate: s.views ? +(s.completes / s.views * 100).toFixed(2) : 0,
        dropFromPrev: +(dropFromPrev * 100).toFixed(2)
      };
    });

    return NextResponse.json({
      days,
      started,
      completed,
      overallCompletionRate: started ? +(completed/started*100).toFixed(2) : 0,
      funnel
    });
  } catch (e) {
    console.error('checkin steps analytics error', e);
    return NextResponse.json({ error: 'Failed to compute check-in analytics' }, { status: 500 });
  }
}
