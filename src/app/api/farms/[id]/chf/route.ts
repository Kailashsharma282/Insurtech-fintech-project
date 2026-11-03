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

  // Calculate live CHF using the Ghatal 2025 Shannon entropy pipeline (FAPAR Excluded)
  const chfDetails = computeChf({
    ndvi: farm.ndvi,
    lswi: farm.lswi,
    vhBackscatterDb: farm.vhBackscatterDb,
    integratedVh: 0.74,
    rainfallMm: 1280.0,
    rainyDays: 62,
    gdd: 3180,
    cropVariability: 0.14,
  }, farm.chfBaseline);

  return NextResponse.json({
    success: true,
    studyArea: 'Ghatal Block, Paschim Medinipur (2025 Kharif)',
    farmId: farm.id,
    plotNumber: farm.plotNumber,
    crop: farm.currentCrop,
    baseline: farm.chfBaseline,
    currentChf: farm.currentChf,
    calculation: chfDetails,
  });
}
