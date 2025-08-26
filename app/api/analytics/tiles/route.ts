import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { analyticsEvents } from '@/lib/db/unified-schema';
import { and, gte } from 'drizzle-orm';

// GET /api/analytics/tiles?days=7
export async function GET(request: NextRequest){
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days')||'7',10);
    const start = new Date();
    start.setDate(start.getDate()-days);

    const raw = await db.select().from(analyticsEvents).where(
      and(
        gte(analyticsEvents.timestamp, start)
      )
    );

    const impressions: Record<string, number> = {};
    const clicks: Record<string, number> = {};
    raw.forEach(r=>{
      if(r.event==='dashboard_tile_impression'){
        const props: any = r.properties || {};
        const id = props.id; if(id) impressions[id] = (impressions[id]||0)+1;
      } else if(r.event==='dashboard_tile_click'){
        const props: any = r.properties || {};
        const id = props.id; if(id) clicks[id] = (clicks[id]||0)+1;
      }
    });

    const tiles = Array.from(new Set([...Object.keys(impressions), ...Object.keys(clicks)])).map(id=>{
      const imp = impressions[id]||0;
      const clk = clicks[id]||0;
      return { id, impressions: imp, clicks: clk, ctr: imp>0 ? +( (clk/imp)*100 ).toFixed(2) : 0 };
    }).sort((a,b)=> b.impressions - a.impressions);

    return NextResponse.json({ rangeDays: days, tiles });
  } catch(e){
    console.error('Tile analytics error', e);
    return NextResponse.json({ error:'failed' }, { status:500 });
  }
}
