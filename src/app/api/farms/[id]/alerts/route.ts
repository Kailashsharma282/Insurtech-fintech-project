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

  const allAlerts = store.getAlerts();
  const alerts = allAlerts.filter(a => a.farmId === farm.id || a.farmPlot === farm.plotNumber);

  return NextResponse.json({
    success: true,
    farmId: farm.id,
    alerts: alerts.length > 0 ? alerts : allAlerts.slice(0, 3)
  });
}
