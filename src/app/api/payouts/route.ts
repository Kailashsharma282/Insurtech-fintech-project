import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;

  const payouts = store.getPayouts({ status });
  return NextResponse.json({
    success: true,
    count: payouts.length,
    data: payouts
  });
}
