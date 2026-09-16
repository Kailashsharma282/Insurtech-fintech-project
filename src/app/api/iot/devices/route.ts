import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  const devices = store.getDevices();
  return NextResponse.json({
    success: true,
    count: devices.length,
    data: devices
  });
}
