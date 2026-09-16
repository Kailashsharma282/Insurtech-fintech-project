import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { computeChf } from '@/lib/algorithms/chf';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const farm = store.getFarmById(id);

  if (!farm) {
    return NextResponse.json({ success: false, error: 'Farm not found' }, { status: 404 });
  }

  // Calculate live CHF using the Shannon entropy pipeline
  const chfDetails = computeChf({
    ndvi: farm.ndvi,
    lswi: farm.lswi,
    vhBackscatterDb: farm.vhBackscatterDb,
    integratedVh: 0.74,
    fapar: parseFloat((farm.ndvi * 0.92).toFixed(2)),
    rainfallMm: 95.0,
    rainyDays: 6,
    cropVariability: 0.12,
  }, farm.chfBaseline);

  return NextResponse.json({
    success: true,
    farmId: farm.id,
    plotNumber: farm.plotNumber,
    crop: farm.currentCrop,
    baseline: farm.chfBaseline,
    currentChf: farm.currentChf,
    calculation: chfDetails,
  });
}
