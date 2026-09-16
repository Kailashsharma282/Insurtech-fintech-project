import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const executed = store.executePayout(id);

  if (!executed) {
    return NextResponse.json({ success: false, error: 'Payout record not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Payment reference ${executed.payoutRef} successfully settled via simulated RBI NEFT Gateway to ${executed.farmerName}`,
    data: executed
  });
}
