import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { calculatePolicyPremium } from '@/lib/subsidy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');
    const status = searchParams.get('status');

    let policies = store.getPolicies();

    if (farmerId) {
      policies = policies.filter(p => p.farmerId === farmerId);
    }

    if (status) {
      policies = policies.filter(p => p.status === status);
    }

    return NextResponse.json({
      success: true,
      count: policies.length,
      data: policies
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      farmerId,
      farmerName,
      farmId,
      farmPlot,
      insuranceUnitCode,
      crop,
      sumInsured,
      premiumAmount,
      subsidyAmount,
      farmerShare,
      triggerChf,
      underwriterNotes
    } = body;

    const sInsured = Number(sumInsured) || 50000;
    const calc = calculatePolicyPremium(sInsured);

    const newPolicy = store.createPolicy({
      farmerId: farmerId || 'farmer-1',
      farmerName: farmerName || 'Subhash Biswas',
      farmId: farmId || 'farm-plot-204',
      farmPlot: farmPlot || 'Plot #204',
      insuranceUnitCode: insuranceUnitCode || 'WB-GHT-001',
      crop: crop || 'Aman Paddy',
      sumInsured: sInsured,
      premiumAmount: Number(premiumAmount) || calc.totalPremium,
      subsidyAmount: Number(subsidyAmount) || calc.subsidyAmount,
      farmerShare: Number(farmerShare) || calc.farmerShare,
      triggerChf: Number(triggerChf) || 0.55,
      underwriterNotes: underwriterNotes || 'Direct portal submission by farmer'
    });

    return NextResponse.json({
      success: true,
      message: 'Parametric Insurance application submitted successfully',
      data: newPolicy
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit insurance application' }, { status: 500 });
  }
}
