import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district') || undefined;
  const crop = searchParams.get('crop') || undefined;
  const risk = searchParams.get('risk') || undefined;

  const farms = store.getFarms({ district, crop, risk });
  return NextResponse.json({
    success: true,
    count: farms.length,
    data: farms
  });
}
