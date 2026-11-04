import { NextRequest, NextResponse } from 'next/server';
import {
  VILLAGE_HISTORICAL_DATA,
  FARMER_INSURANCE_REGISTRY,
  SEASONS_LIST,
  validateInsuranceClaimWithChf
} from '@/lib/db/ghatal-excel-store';
import { computeGhatalChf2025 } from '@/lib/algorithms/ghatal-chf';

/**
 * GET /api/insurance/validate-chf
 * Returns:
 * 1. Village historical area, production, yield data (2017-18 to 2026-27)
 * 2. Farmer insurance registry & CCE validation records
 * 3. Pre-calculated default Ghatal 2025 CHF baseline
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const candidateId = url.searchParams.get('candidateId');
    const chfParam = url.searchParams.get('chf');

    // Live Ghatal Block 2025 multi-satellite CHF
    const liveChfResult = computeGhatalChf2025();
    const calculatedChf = chfParam ? parseFloat(chfParam) : liveChfResult.chfScore;

    let singleValidation = null;
    if (candidateId) {
      singleValidation = validateInsuranceClaimWithChf(candidateId, calculatedChf);
    }

    return NextResponse.json({
      success: true,
      block: 'Ghatal',
      district: 'Paschim Medinipur',
      state: 'West Bengal',
      season: 'Kharif 2025',
      satelliteChfBaseline: {
        chf: liveChfResult.chfScore,
        entropyWeights: liveChfResult.entropyWeights,
        classLabel: liveChfResult.chfClass.label,
        parametricAction: liveChfResult.chfClass.parametricAction
      },
      seasons: SEASONS_LIST,
      villageCount: VILLAGE_HISTORICAL_DATA.length,
      villages: VILLAGE_HISTORICAL_DATA,
      candidatesCount: FARMER_INSURANCE_REGISTRY.length,
      candidates: FARMER_INSURANCE_REGISTRY,
      singleValidation
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/insurance/validate-chf
 * Validates a candidate farmer claim against calculated CHF, historical yield, and CCE data.
 * Request Body:
 * {
 *   candidateId: string,
 *   calculatedChf?: number, // Defaults to Ghatal 2025 algorithm CHF (0.421)
 *   chfThreshold?: number   // Defaults to 0.55
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const candidateId = body.candidateId || 'cand-001';
    
    // Default to the validated multi-satellite Ghatal 2025 CHF if not provided
    let calculatedChf = body.calculatedChf;
    if (typeof calculatedChf !== 'number' || isNaN(calculatedChf)) {
      const liveChf = computeGhatalChf2025();
      calculatedChf = liveChf.chfScore;
    }

    const chfThreshold = typeof body.chfThreshold === 'number' ? body.chfThreshold : 0.55;

    const validationResult = validateInsuranceClaimWithChf(candidateId, calculatedChf, chfThreshold);

    return NextResponse.json({
      success: true,
      data: validationResult
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Validation failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
