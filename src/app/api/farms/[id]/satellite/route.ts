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

  // Generate 8 bi-weekly historical satellite acquisition passes (Sentinel-2A/B and Sentinel-1 SAR)
  const history = [
    { date: '2026-06-15', ndvi: 0.32, lswi: 0.18, vh: -22.4, fapar: 0.28, rainfall: 42, gdd: 180, chf: 0.62 },
    { date: '2026-07-01', ndvi: 0.44, lswi: 0.24, vh: -20.1, fapar: 0.41, rainfall: 68, gdd: 385, chf: 0.66 },
    { date: '2026-07-16', ndvi: 0.55, lswi: 0.31, vh: -18.2, fapar: 0.52, rainfall: 92, gdd: 590, chf: 0.70 },
    { date: '2026-08-02', ndvi: 0.64, lswi: 0.35, vh: -16.9, fapar: 0.61, rainfall: 84, gdd: 810, chf: 0.73 },
    { date: '2026-08-18', ndvi: 0.71, lswi: 0.39, vh: -15.8, fapar: 0.69, rainfall: 110, gdd: 1040, chf: 0.75 },
    { date: '2026-09-02', ndvi: 0.69, lswi: 0.38, vh: -16.1, fapar: 0.67, rainfall: 45, gdd: 1250, chf: 0.73 },
    { date: '2026-09-14', ndvi: farm.ndvi, lswi: farm.lswi, vh: farm.vhBackscatterDb, fapar: parseFloat((farm.ndvi * 0.92).toFixed(2)), rainfall: 28, gdd: 1390, chf: farm.currentChf }
  ];

  return NextResponse.json({
    success: true,
    farmId: farm.id,
    latestScene: {
      sceneId: 'S2A_MSIL2A_20260914T044701_N0500_R119_T45QXF',
      satellite: 'Sentinel-2A MSI (10m Resolution)',
      acquisitionDate: '2026-09-14 04:47 UTC',
      cloudCoverPct: 2.1,
      sensorMode: 'Bottom-of-Atmosphere (BOA) Reflectance'
    },
    metrics: history
  });
}
