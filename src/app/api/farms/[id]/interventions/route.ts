import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const farm = store.getFarmById(id);

  if (!farm) {
    return NextResponse.json({ success: false, error: 'Farm not found' }, { status: 404 });
  }

  const interventions = store.getInterventions(farm.id);
  return NextResponse.json({
    success: true,
    farmId: farm.id,
    interventions: interventions.length > 0 ? interventions : store.getInterventions()
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const farm = store.getFarmById(id);

  if (!farm) {
    return NextResponse.json({ success: false, error: 'Farm not found' }, { status: 404 });
  }

  const body = await req.json();
  const created = store.addIntervention({
    farmId: farm.id,
    plotNumber: farm.plotNumber,
    title: body.title || 'Micro-irrigation drip cycle',
    category: body.category || 'IRRIGATION',
    status: 'COMPLETED',
    actuatedBy: body.actuatedBy || 'AUTOMATED_IOT',
    notes: body.notes || 'Manually or system actuated precision treatment',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' IST'
  });

  return NextResponse.json({ success: true, data: created });
}
