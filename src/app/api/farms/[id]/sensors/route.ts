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

  // Find IoT devices bound to this farm
  const allDevices = store.getDevices();
  const devices = allDevices.filter(d => d.farmId === farm.id || d.farmPlot === farm.plotNumber);

  return NextResponse.json({
    success: true,
    farmId: farm.id,
    plotNumber: farm.plotNumber,
    devices: devices.length > 0 ? devices : [allDevices[0]] // Fallback to primary probe
  });
}
