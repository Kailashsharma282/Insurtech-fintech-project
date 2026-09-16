import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const verified = store.verifyClaim(id);

  if (!verified) {
    return NextResponse.json({ success: false, error: 'Claim not found or invalid' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Claim ${verified.claimNumber} verified against satellite & IoT thresholds`,
    data: verified
  });
}
