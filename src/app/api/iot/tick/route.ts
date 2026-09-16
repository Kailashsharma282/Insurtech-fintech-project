import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  store.tickTelemetry();
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    devices: store.getDevices()
  });
}
