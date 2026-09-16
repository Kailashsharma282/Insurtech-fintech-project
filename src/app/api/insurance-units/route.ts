import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  const units = store.getInsuranceUnits();
  return NextResponse.json({
    success: true,
    count: units.length,
    data: units
  });
}
