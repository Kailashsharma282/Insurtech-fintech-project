import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const farm = store.getFarmById(id);

  if (!farm) {
    return NextResponse.json({ success: false, error: 'Farm not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: farm });
}
