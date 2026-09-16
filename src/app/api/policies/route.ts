import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const farmerId = searchParams.get('farmerId') || undefined;
    const crop = searchParams.get('crop') || undefined;

    const policies = store.getPolicies({ status, farmerId, crop });

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

    const newPolicy = store.createPolicy({
      farmerId: farmerId || 'farmer-1',
      farmerName: farmerName || 'Subhash Biswas',
      farmId: farmId || 'farm-plot-204',
      farmPlot: farmPlot || 'Plot #204',
      insuranceUnitCode: insuranceUnitCode || 'WB-NAD-001',
      crop: crop || 'Aman Paddy',
      sumInsured: Number(sumInsured) || 50000,
      premiumAmount: Number(premiumAmount) || 2500,
      subsidyAmount: Number(subsidyAmount) || 2000,
      farmerShare: Number(farmerShare) || 500,
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
