import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payout = store.getPayoutById(id);

  if (!payout) {
    return NextResponse.json({ success: false, error: 'Payout record not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: payout });
}
