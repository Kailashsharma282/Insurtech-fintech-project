import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const eventType = body.eventType || 'heavy_rain';

  if (eventType === 'heavy_rain') {
    // Heavy rainfall shock on Nadia / Ranaghat
    const primary = store.getFarmById('farm-plot-204');
    if (primary) {
      primary.soilMoisturePct = 84.0;
      primary.currentChf = 0.61;
      primary.riskLevel = 'MODERATE';
    }

    const alert = store.getAlerts()[0];
    alert.title = 'Flash Precipitation Shock: 142mm Recorded';
    alert.description = 'Severe localized cloudburst over Nadia basin. Volumetric root moisture spiked to 84%. Drainage advisory issued.';
    alert.severity = 'CRITICAL';
    alert.isRead = false;

    store.addAuditLog({
      entityType: 'WEATHER_EVENT',
      entityId: 'EVT-HEAVY-RAIN-2026',
      action: 'PRECIPITATION_THRESHOLD_EXCEEDED',
      actor: 'System:Meteorological-Event-Engine',
      metadata: { affectedAreaHa: 1240, precipitationMm: 142.8, insuranceRelevance: 'POTENTIAL_CLAIM_TRIGGER' },
      hashSha256: `sha256:${Math.random().toString(36).substring(2, 15)}ee08`,
      verificationStatus: 'VALID_CHAIN'
    });

    return NextResponse.json({
      success: true,
      event: 'Heavy Rainfall',
      affectedAreaHa: 1240,
      satelliteVerification: 'PENDING_PASS_IN_6H',
      insuranceRelevance: 'HIGH (Parametric waterlogging tier triggered)',
      details: 'Plot #204 soil moisture raised to 84%. Downpour threshold exceeded.'
    });
  }

  if (eventType === 'claim_qualification') {
    const claim = store.getClaims()[0];
    claim.status = 'APPROVED';
    return NextResponse.json({
      success: true,
      event: 'Claim Qualification',
      claimNumber: claim.claimNumber,
      status: 'APPROVED',
      details: 'Parametric loss verified. Ready for electronic settlement.'
    });
  }

  return NextResponse.json({
    success: true,
    event: eventType,
    message: 'Simulation event dispatched to agronomic state pipeline'
  });
}
