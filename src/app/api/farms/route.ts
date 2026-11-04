import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { Farm, RiskCategory } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district') || undefined;
  const crop = searchParams.get('crop') || undefined;
  const risk = searchParams.get('risk') || undefined;

  const farms = store.getFarms({ district, crop, risk });
  return NextResponse.json(farms);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const id = body.id || `farm-${Date.now()}`;
    const lat = parseFloat(body.latitude || body.lat) || 22.665;
    const lng = parseFloat(body.longitude || body.lng) || 87.675;
    const acreage = parseFloat(body.area || body.acreage) || 1.5;

    // Generate small bounding polygon around centroid if none supplied
    const delta = 0.0018 * Math.sqrt(Math.max(0.2, acreage));
    const boundaryCoordinates: [number, number][] = body.boundaryCoordinates || [
      [lat - delta, lng - delta],
      [lat + delta, lng - delta],
      [lat + delta, lng + delta],
      [lat - delta, lng + delta],
      [lat - delta, lng - delta]
    ];

    const plotNum = body.plotNumber || (body.surveyNo ? `Plot #${body.surveyNo}` : `Plot #${Math.floor(220 + Math.random() * 700)}`);
    const chf = parseFloat(body.chf) || 0.76;
    const riskLevel: RiskCategory = chf < 0.55 ? 'HIGH' : (chf < 0.70 ? 'MODERATE' : 'LOW');

    const newFarm: Farm = {
      id,
      farmerId: body.farmerId || `FMR-${Date.now().toString().slice(-6)}`,
      farmerName: body.name || body.farmerName || 'Registered Farmer',
      insuranceUnitId: body.insuranceUnitId || 'iu-ghatal-001',
      insuranceUnitCode: body.insuranceUnitCode || 'WB-GHT-001',
      plotNumber: plotNum,
      name: body.areaName || `${plotNum} - ${body.village || 'Ghatal'} Registered Plot`,
      district: body.district || 'Paschim Medinipur',
      village: body.village || 'Ghatal',
      gramPanchayat: body.subdistrict || 'Ghatal GP',
      acreage,
      currentCrop: body.crop || 'Aman Paddy',
      season: body.season || 'Kharif 2026',
      sowingDate: body.sowingDate || '2026-06-15',
      expectedHarvest: body.expectedHarvest || '2026-11-20',
      currentChf: chf,
      chfBaseline: 0.76,
      soilMoisturePct: parseFloat(body.moisture) || 62,
      riskLevel,
      centroid: { lat, lng },
      boundaryCoordinates,
      activePolicyId: body.policyRef || `POL-WB-2026-${Math.floor(3000 + Math.random() * 9000)}`,
      sumInsured: parseFloat(body.sum) || Math.round(acreage * 55000),
      lastSatelliteDate: new Date().toISOString().split('T')[0],
      ndvi: 0.74,
      lswi: 0.48,
      vhBackscatterDb: -14.2,
      distanceToRiverMeters: 1420,
      hydrologicalZone: 'ELEVATED_UPLAND'
    };

    const saved = store.addFarm(newFarm);
    return NextResponse.json({
      success: true,
      message: 'Farmer and farm holding registered successfully in database',
      data: saved
    });
  } catch (err: any) {
    console.error('Failed to register farm:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
