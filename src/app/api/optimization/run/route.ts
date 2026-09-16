import { NextRequest, NextResponse } from 'next/server';
import { runGaPsoOptimization, OptimizationInputs } from '@/lib/algorithms/ga-pso';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const inputs: OptimizationInputs = {
      crop: body.crop || 'Aman Paddy',
      cropAgeDays: Number(body.cropAgeDays) || 42,
      soilNitrogen: Number(body.soilNitrogen) || 210,
      soilPhosphorus: Number(body.soilPhosphorus) || 24,
      soilPotassium: Number(body.soilPotassium) || 165,
      soilPh: Number(body.soilPh) || 6.4,
      soilMoisturePct: Number(body.soilMoisturePct) || 58,
      weatherCondition: body.weatherCondition || 'Moderate / Humid',
      previousFertilizerAppliedDaysAgo: Number(body.previousFertilizerAppliedDaysAgo) || 18,
    };

    const result = runGaPsoOptimization(inputs);

    return NextResponse.json({
      success: true,
      inputs,
      result
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Optimization engine error' }, { status: 500 });
  }
}
