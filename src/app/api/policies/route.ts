import { NextResponse } from 'next/server';
import { SEED_POLICIES } from '@/lib/db/seed-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: SEED_POLICIES.length,
    data: SEED_POLICIES
  });
}
