import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const crop = searchParams.get('crop') || undefined;
  const district = searchParams.get('district') || undefined;

  const claims = store.getClaims({ status, crop, district });
  return NextResponse.json({
    success: true,
    count: claims.length,
    data: claims
  });
}
