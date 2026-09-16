import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  
  if (body.action === 'fault') {
    const dev = store.simulateDeviceFault(id);
    return NextResponse.json({ success: true, data: dev });
  }

  const dev = store.togglePump(id);
  if (!dev) {
    return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Pump relay ${dev.deviceUid} is now ${dev.pumpStatus || 'TOGGLED'}`,
    data: dev
  });
}
