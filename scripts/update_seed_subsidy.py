import re

seed_path = 'src/lib/db/seed-data.ts'

with open(seed_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'calculatePolicyPremium' not in content:
    content = content.replace(
        "import { Farm, Farmer, InsuranceUnit, Policy, Claim, Payout, IoTDevice, Alert, Intervention, SatelliteMetric, AuditLogItem } from '../types';",
        "import { Farm, Farmer, InsuranceUnit, Policy, Claim, Payout, IoTDevice, Alert, Intervention, SatelliteMetric, AuditLogItem } from '../types';\nimport { calculatePolicyPremium, calculatePlotSubsidy } from '../subsidy';"
    )

# 2. Update SEED_POLICIES mapping
old_block = """export const SEED_POLICIES: Policy[] = [
  ...SEED_FARMS.map((farm, idx) => ({
    id: farm.activePolicyId,
    policyNumber: `POL-WB-2026-${3000 + idx}`,
    farmerId: farm.farmerId,
    farmerName: farm.farmerName,
    farmId: farm.id,
    farmPlot: farm.plotNumber,
    insuranceUnitCode: farm.insuranceUnitCode,
    crop: farm.currentCrop,
    sumInsured: farm.sumInsured,
    premiumAmount: Math.round(farm.sumInsured * 0.05),
    subsidyAmount: Math.round(farm.sumInsured * 0.035),
    farmerShare: Math.round(farm.sumInsured * 0.015),
    triggerChf: 0.55,
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    status: (idx === 3 ? 'PENDING_APPROVAL' : (idx === 7 ? 'REJECTED' : 'ACTIVE')) as Policy['status'],
    submittedAt: '2026-09-14T09:00:00Z',
    reviewedAt: idx === 7 ? '2026-09-15T14:30:00Z' : undefined,
    rejectionReason: idx === 7 ? 'EXCEEDS_SPATIAL_IU_RISK_CAP' : undefined,
    underwriterNotes: idx === 7 ? 'Insurance Unit portfolio risk exceeds maximum 85% exposure threshold' : undefined
  })),"""

new_block = """export const SEED_POLICIES: Policy[] = [
  ...SEED_FARMS.map((farm, idx) => {
    const { totalPremium, farmerShare, subsidyAmount } = calculatePolicyPremium(farm.sumInsured);
    return {
      id: farm.activePolicyId,
      policyNumber: `POL-WB-2026-${3000 + idx}`,
      farmerId: farm.farmerId,
      farmerName: farm.farmerName,
      farmId: farm.id,
      farmPlot: farm.plotNumber,
      insuranceUnitCode: farm.insuranceUnitCode,
      crop: farm.currentCrop,
      sumInsured: farm.sumInsured,
      premiumAmount: totalPremium,
      subsidyAmount: subsidyAmount,
      farmerShare: farmerShare,
      triggerChf: 0.55,
      startDate: '2026-06-01',
      endDate: '2026-11-30',
      status: (idx === 3 ? 'PENDING_APPROVAL' : (idx === 7 ? 'REJECTED' : 'ACTIVE')) as Policy['status'],
      submittedAt: '2026-09-14T09:00:00Z',
      reviewedAt: idx === 7 ? '2026-09-15T14:30:00Z' : undefined,
      rejectionReason: idx === 7 ? 'EXCEEDS_SPATIAL_IU_RISK_CAP' : undefined,
      underwriterNotes: idx === 7 ? 'Insurance Unit portfolio risk exceeds maximum 85% exposure threshold' : undefined
    };
  }),"""

content = content.replace(old_block, new_block)

# 3. Update PRIMARY_DEMO_CLAIM
content = content.replace("claimAmount: 42800,", "claimAmount: 22400,")
content = content.replace("amountInr: 42800,", "amountInr: 22400,")

# 4. Update SEED_CLAIMS calculation
old_claims = """    const lossFraction = parseFloat((0.25 + (idx % 5) * 0.05).toFixed(3));
    const claimAmount = Math.round(farm.sumInsured * lossFraction);"""

new_claims = """    const claimAmount = calculatePlotSubsidy(chf, farm.acreage);
    const lossFraction = farm.sumInsured > 0 ? parseFloat((claimAmount / farm.sumInsured).toFixed(3)) : 0.25;"""

content = content.replace(old_claims, new_claims)

with open(seed_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated seed-data.ts with simplified CHF rates and 20% farmer share!")

