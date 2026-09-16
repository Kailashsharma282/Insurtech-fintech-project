import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const claim = store.getClaimById(id);

  if (!claim) {
    return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: claim });
}
