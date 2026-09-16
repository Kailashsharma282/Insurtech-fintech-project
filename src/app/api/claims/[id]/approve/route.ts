import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const approved = store.approveClaim(id);

  if (!approved) {
    return NextResponse.json({ success: false, error: 'Claim not found or invalid' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Claim ${approved.claimNumber} approved for payout of INR ${approved.claimAmount.toLocaleString()}`,
    data: approved
  });
}
