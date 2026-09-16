import { 
  SEED_FARMS, 
  SEED_FARMERS, 
  SEED_INSURANCE_UNITS, 
  SEED_POLICIES, 
  SEED_CLAIMS, 
  SEED_PAYOUTS, 
  SEED_IOT_DEVICES, 
  SEED_ALERTS, 
  SEED_INTERVENTIONS, 
  SEED_AUDIT_LOGS 
} from './seed-data';
import { Farm, Claim, Payout, IoTDevice, Alert, Intervention, AuditLogItem, InsuranceUnit, Policy } from '../types';

// In-Memory Global State for seamless local execution
class AgriSureStore {
  private farms: Farm[] = [...SEED_FARMS];
  private policies: Policy[] = [...SEED_POLICIES];
  private claims: Claim[] = [...SEED_CLAIMS];
  private payouts: Payout[] = [...SEED_PAYOUTS];
  private devices: IoTDevice[] = [...SEED_IOT_DEVICES];
  private alerts: Alert[] = [...SEED_ALERTS];
  private interventions: Intervention[] = [...SEED_INTERVENTIONS];
  private insuranceUnits: InsuranceUnit[] = [...SEED_INSURANCE_UNITS];
  private auditLogs: AuditLogItem[] = [...SEED_AUDIT_LOGS];

  // Farms
  getFarms(filter?: { district?: string; crop?: string; risk?: string }): Farm[] {
    let list = [...this.farms];
    if (filter?.district && filter.district !== 'ALL') {
      list = list.filter(f => f.district.toLowerCase() === filter.district?.toLowerCase());
    }
    if (filter?.crop && filter.crop !== 'ALL') {
      list = list.filter(f => f.currentCrop.toLowerCase() === filter.crop?.toLowerCase());
    }
    if (filter?.risk && filter.risk !== 'ALL') {
      list = list.filter(f => f.riskLevel === filter.risk);
    }
    return list;
  }

  getFarmById(id: string): Farm | undefined {
    return this.farms.find(f => f.id === id || f.plotNumber.replace(/[^0-9]/g, '') === id.replace(/[^0-9]/g, ''));
  }

  // Insurance Units
  getInsuranceUnits(): InsuranceUnit[] {
    return this.insuranceUnits;
  }

  getInsuranceUnitById(id: string): InsuranceUnit | undefined {
    return this.insuranceUnits.find(u => u.id === id || u.code === id);
  }

  // Claims
  getClaims(filter?: { status?: string; crop?: string; district?: string }): Claim[] {
    let list = [...this.claims];
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter(c => c.status === filter.status);
    }
    if (filter?.crop && filter.crop !== 'ALL') {
      list = list.filter(c => c.crop.toLowerCase() === filter.crop?.toLowerCase());
    }
    if (filter?.district && filter.district !== 'ALL') {
      list = list.filter(c => c.district.toLowerCase() === filter.district?.toLowerCase());
    }
    return list;
  }

  getClaimById(id: string): Claim | undefined {
    return this.claims.find(c => c.id === id || c.claimNumber === id);
  }

  verifyClaim(id: string): Claim | undefined {
    const claim = this.getClaimById(id);
    if (!claim) return undefined;
    claim.status = 'VERIFIED';
    claim.updatedAt = new Date().toISOString();
    
    // Add audit log
    this.addAuditLog({
      entityType: 'CLAIM',
      entityId: claim.claimNumber,
      action: 'CLAIM_VERIFIED_BY_OFFICER',
      actor: 'Officer:Parametric-Review-Team',
      decisionRule: 'Cross-validated Satellite + IoT root moisture index',
      hashSha256: `sha256:${Math.random().toString(36).substring(2, 15)}e49b7`,
      verificationStatus: 'VALID_CHAIN'
    });

    return claim;
  }

  approveClaim(id: string): Claim | undefined {
    const claim = this.getClaimById(id);
    if (!claim) return undefined;
    claim.status = 'APPROVED';
    claim.updatedAt = new Date().toISOString();

    // Create a pending payout if none exists
    const existingPayout = this.payouts.find(p => p.claimId === claim.id);
    if (!existingPayout) {
      const newPayout: Payout = {
        id: `payout-${this.payouts.length + 1}`,
        payoutRef: `PAY-WB-2026-${9100 + this.payouts.length}`,
        claimId: claim.id,
        claimNumber: claim.claimNumber,
        farmerName: claim.farmerName,
        crop: claim.crop,
        district: claim.district,
        amount: claim.claimAmount,
        bankRefId: `NEFT-WB-202609-${990000 + this.payouts.length}`,
        beneficiaryMask: '•••• •••• 8420',
        ifscCode: 'PUNB0120111',
        status: 'PENDING',
        timeline: {
          weatherEvent: '2026-09-12 (Logged)',
          satelliteVerification: '2026-09-13 (Passed)',
          chfCalculation: '2026-09-14 (0.49)',
          thresholdTest: '2026-09-14 (Trigger Confirmed)',
          claimQualification: '2026-09-15 (Qualified)',
          payoutInitiation: 'Just Now',
          bankConfirmation: 'Awaiting Gateway Batch'
        },
        createdAt: new Date().toISOString()
      };
      this.payouts.unshift(newPayout);
      claim.payoutRef = newPayout.payoutRef;
    }

    this.addAuditLog({
      entityType: 'CLAIM',
      entityId: claim.claimNumber,
      action: 'CLAIM_APPROVED_FOR_DISBURSEMENT',
      actor: 'Underwriter:Chief-Actuary',
      decisionRule: 'Approved for electronic direct benefit transfer',
      hashSha256: `sha256:${Math.random().toString(36).substring(2, 15)}99ff1`,
      verificationStatus: 'VALID_CHAIN'
    });

    return claim;
  }

  // Payouts
  getPayouts(filter?: { status?: string }): Payout[] {
    let list = [...this.payouts];
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter(p => p.status === filter.status);
    }
    return list;
  }

  getPayoutById(id: string): Payout | undefined {
    return this.payouts.find(p => p.id === id || p.payoutRef === id);
  }

  executePayout(id: string): Payout | undefined {
    const payout = this.getPayoutById(id);
    if (!payout) return undefined;
    payout.status = 'SUCCESSFUL';
    payout.settledAt = new Date().toISOString();
    payout.timeline.bankConfirmation = 'Confirmed (RBI NEFT Ack #98124)';

    // Update claim status if linked
    const claim = this.claims.find(c => c.id === payout.claimId);
    if (claim) {
      claim.status = 'DISBURSED';
    }

    this.addAuditLog({
      entityType: 'PAYOUT',
      entityId: payout.payoutRef,
      action: 'ELECTRONIC_FUNDS_DISBURSED',
      actor: 'Banking-Gateway:RBI-NEFT-Switch',
      bankReference: payout.bankRefId,
      hashSha256: `sha256:${Math.random().toString(36).substring(2, 15)}cc219`,
      verificationStatus: 'VALID_CHAIN'
    });

    return payout;
  }

  // IoT Devices
  getDevices(): IoTDevice[] {
    return this.devices;
  }

  getDeviceById(id: string): IoTDevice | undefined {
    return this.devices.find(d => d.id === id || d.deviceUid === id);
  }

  togglePump(deviceId: string): IoTDevice | undefined {
    const dev = this.getDeviceById(deviceId);
    if (!dev) return undefined;
    dev.pumpStatus = dev.pumpStatus === 'ACTIVE' ? 'IDLE' : 'ACTIVE';
    dev.currentReading.soilMoisturePct = dev.pumpStatus === 'ACTIVE' ? Math.min(85, dev.currentReading.soilMoisturePct + 4) : dev.currentReading.soilMoisturePct;
    return dev;
  }

  simulateDeviceFault(deviceId: string): IoTDevice | undefined {
    const dev = this.getDeviceById(deviceId);
    if (!dev) return undefined;
    dev.isActive = !dev.isActive;
    return dev;
  }

  // Live Telemetry Simulation Tick (called every 3s)
  tickTelemetry(): void {
    this.devices.forEach(dev => {
      if (!dev.isActive) return;
      // Subtle natural fluctuations
      const deltaMoist = (Math.random() - 0.5) * 0.4;
      const deltaTemp = (Math.random() - 0.5) * 0.2;
      const deltaHum = (Math.random() - 0.5) * 0.5;

      dev.currentReading.soilMoisturePct = parseFloat(Math.max(20, Math.min(95, dev.currentReading.soilMoisturePct + deltaMoist)).toFixed(1));
      dev.currentReading.temperatureC = parseFloat(Math.max(18, Math.min(42, dev.currentReading.temperatureC + deltaTemp)).toFixed(1));
      dev.currentReading.humidityPct = Math.round(Math.max(40, Math.min(99, dev.currentReading.humidityPct + deltaHum)));
      dev.currentReading.soilResistanceOhm = Math.round(1350 - dev.currentReading.soilMoisturePct * 9.5);
      dev.lastHeartbeat = 'Just now (live)';
    });
  }

  // Alerts
  getAlerts(): Alert[] {
    return this.alerts;
  }

  markAlertRead(id: string): void {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) alert.isRead = true;
  }

  // Interventions
  getInterventions(farmId?: string): Intervention[] {
    if (farmId) {
      return this.interventions.filter(i => i.farmId === farmId);
    }
    return this.interventions;
  }

  addIntervention(intervention: Omit<Intervention, 'id'>): Intervention {
    const newInt: Intervention = {
      ...intervention,
      id: `int-${Date.now()}`
    };
    this.interventions.unshift(newInt);
    return newInt;
  }

  // Audit Logs
  getAuditLogs(entityType?: string, entityId?: string): AuditLogItem[] {
    let list = [...this.auditLogs];
    if (entityType) {
      list = list.filter(l => l.entityType.toLowerCase() === entityType.toLowerCase());
    }
    if (entityId) {
      list = list.filter(l => l.entityId.toLowerCase() === entityId.toLowerCase());
    }
    return list;
  }

  addAuditLog(item: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
    const log: AuditLogItem = {
      ...item,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // Policies Management (Farmer Applications & Insurer Underwriting)
  getPolicies(filter?: { status?: string; farmerId?: string; crop?: string }): Policy[] {
    let list = [...this.policies];
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter(p => p.status === filter.status);
    }
    if (filter?.farmerId) {
      list = list.filter(p => p.farmerId === filter.farmerId);
    }
    if (filter?.crop && filter.crop !== 'ALL') {
      list = list.filter(p => p.crop.toLowerCase().includes(filter.crop!.toLowerCase()));
    }
    return list;
  }

  getPolicyById(id: string): Policy | undefined {
    return this.policies.find(p => p.id === id || p.policyNumber === id);
  }

  createPolicy(policyData: Partial<Policy>): Policy {
    const newId = `pol-gen-${Date.now()}`;
    const policyNum = policyData.policyNumber || `POL-WB-2026-${3500 + this.policies.length}`;
    const newPolicy: Policy = {
      id: newId,
      policyNumber: policyNum,
      farmerId: policyData.farmerId || 'farmer-1',
      farmerName: policyData.farmerName || 'Subhash Biswas',
      farmId: policyData.farmId || 'farm-plot-204',
      farmPlot: policyData.farmPlot || 'Plot #204',
      insuranceUnitCode: policyData.insuranceUnitCode || 'WB-NAD-001',
      crop: policyData.crop || 'Aman Paddy',
      sumInsured: policyData.sumInsured || 50000,
      premiumAmount: policyData.premiumAmount || 2500,
      subsidyAmount: policyData.subsidyAmount || 2000,
      farmerShare: policyData.farmerShare || 500,
      triggerChf: policyData.triggerChf || 0.55,
      startDate: policyData.startDate || new Date().toISOString().split('T')[0],
      endDate: policyData.endDate || '2026-11-30',
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString(),
      underwriterNotes: policyData.underwriterNotes || 'Direct digital submission from Farmer Web Portal'
    };
    this.policies.unshift(newPolicy);

    this.addAuditLog({
      entityType: 'POLICY',
      entityId: newPolicy.policyNumber,
      action: 'POLICY_APPLICATION_SUBMITTED',
      actor: `Farmer:${newPolicy.farmerName}`,
      decisionRule: 'Awaiting primary spatial satellite risk assessment',
      hashSha256: `sha256:${Math.random().toString(36).substring(2, 15)}a93e`,
      verificationStatus: 'VALID_CHAIN'
    });

    return newPolicy;
  }

  approvePolicy(id: string, underwriterNotes?: string): Policy | undefined {
    const policy = this.getPolicyById(id);
    if (!policy) return undefined;
    policy.status = 'ACTIVE';
    policy.reviewedAt = new Date().toISOString();
    if (underwriterNotes) {
      policy.underwriterNotes = underwriterNotes;
    }

    this.addAuditLog({
      entityType: 'POLICY',
      entityId: policy.policyNumber,
      action: 'POLICY_APPROVED_AND_ISSUED',
      actor: 'Underwriter:ParametricDesk',
      decisionRule: 'Baseline NDVI ≥ 0.65, Spatial IU concentration within capacity limits',
      hashSha256: `sha256:${Math.random().toString(36).substring(2, 15)}e28c`,
      verificationStatus: 'VALID_CHAIN'
    });

    return policy;
  }

  rejectPolicy(id: string, rejectionReason: string, underwriterNotes?: string): Policy | undefined {
    const policy = this.getPolicyById(id);
    if (!policy) return undefined;
    policy.status = 'REJECTED';
    policy.rejectionReason = rejectionReason;
    policy.reviewedAt = new Date().toISOString();
    if (underwriterNotes) {
      policy.underwriterNotes = underwriterNotes;
    }

    this.addAuditLog({
      entityType: 'POLICY',
      entityId: policy.policyNumber,
      action: 'POLICY_APPLICATION_REJECTED',
      actor: 'Underwriter:ParametricDesk',
      decisionRule: `Rejection rule: ${rejectionReason}`,
      hashSha256: `sha256:${Math.random().toString(36).substring(2, 15)}d77a`,
      verificationStatus: 'VALID_CHAIN'
    });

    return policy;
  }
}

// Global Singleton for the Next.js process
const globalStore = (global as unknown as { __AGRISURE_STORE__?: AgriSureStore });
if (!globalStore.__AGRISURE_STORE__) {
  globalStore.__AGRISURE_STORE__ = new AgriSureStore();
}

export const store = globalStore.__AGRISURE_STORE__;
export const SEED_DATA = {
  farms: SEED_FARMS,
  farmers: SEED_FARMERS,
  insuranceUnits: SEED_INSURANCE_UNITS,
  policies: SEED_POLICIES,
  claims: SEED_CLAIMS,
  payouts: SEED_PAYOUTS,
  iotDevices: SEED_IOT_DEVICES,
  alerts: SEED_ALERTS,
  interventions: SEED_INTERVENTIONS,
  auditLogs: SEED_AUDIT_LOGS
};
