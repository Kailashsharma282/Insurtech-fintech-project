import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const unit = store.getInsuranceUnitById(id);

  if (!unit) {
    return NextResponse.json({ success: false, error: 'Insurance Unit not found' }, { status: 404 });
  }

  // Find all farms within this unit
  const farms = store.getFarms().filter(f => f.insuranceUnitId === unit.id || f.insuranceUnitCode === unit.code);

  return NextResponse.json({
    success: true,
    data: {
      unit,
      farmsCount: farms.length,
      averageChf: farms.length ? (farms.reduce((acc, f) => acc + f.currentChf, 0) / farms.length).toFixed(2) : unit.currentChf,
      riskDistribution: {
        normal: farms.filter(f => f.riskLevel === 'NORMAL').length,
        low: farms.filter(f => f.riskLevel === 'LOW').length,
        moderate: farms.filter(f => f.riskLevel === 'MODERATE').length,
        high: farms.filter(f => f.riskLevel === 'HIGH').length,
        claimTriggered: farms.filter(f => f.riskLevel === 'CLAIM_TRIGGERED').length,
      }
    }
  });
}
