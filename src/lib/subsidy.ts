/**
 * Official Parametric CHF Crop Subsidy & Indemnity Calculator
 * Based on field calibrated rates per hectare:
 * 0.0 - 0.2 CHF -> ₹15,000 / hectare (Severe Loss)
 * 0.2 - 0.4 CHF -> ₹12,000 / hectare (High Loss)
 * 0.4 - 0.6 CHF -> ₹8,000 / hectare  (Moderate Loss)
 * 0.6 - 0.8 CHF -> No Subsidy (₹0)   (Normal Crop Health)
 * 0.8 - 1.0 CHF -> No Subsidy (₹0)   (Optimal Crop Health)
 */

export interface ChfSubsidyTier {
  range: string;
  minChf: number;
  maxChf: number;
  ratePerHectare: number;
  label: string;
  badgeColor: string;
}

export const CHF_SUBSIDY_TIERS: ChfSubsidyTier[] = [
  {
    range: '0.0 - 0.2',
    minChf: 0.0,
    maxChf: 0.2,
    ratePerHectare: 15000,
    label: 'Critical Stress / Inundation',
    badgeColor: 'bg-red-500 text-white'
  },
  {
    range: '0.2 - 0.4',
    minChf: 0.2,
    maxChf: 0.4,
    ratePerHectare: 12000,
    label: 'High Stress / Deficit',
    badgeColor: 'bg-orange-500 text-white'
  },
  {
    range: '0.4 - 0.6',
    minChf: 0.4,
    maxChf: 0.6,
    ratePerHectare: 8000,
    label: 'Moderate Stress / Watch',
    badgeColor: 'bg-amber-500 text-white'
  },
  {
    range: '0.6 - 0.8',
    minChf: 0.6,
    maxChf: 0.8,
    ratePerHectare: 0,
    label: 'Normal Crop Health (No Subsidy)',
    badgeColor: 'bg-emerald-500 text-white'
  },
  {
    range: '0.8 - 1.0',
    minChf: 0.8,
    maxChf: 1.0,
    ratePerHectare: 0,
    label: 'Optimal Canopy Vigor (No Subsidy)',
    badgeColor: 'bg-emerald-600 text-white'
  }
];

export function getChfSubsidyPerHectare(chf: number): number {
  if (chf < 0.2) return 15000;
  if (chf < 0.4) return 12000;
  if (chf < 0.6) return 8000;
  return 0; // 0.6 - 1.0 -> No Subsidy
}

export function calculatePlotSubsidy(chf: number, areaHectares: number): number {
  const rate = getChfSubsidyPerHectare(chf);
  return Math.round(rate * Math.max(0, areaHectares));
}

/**
 * Premium Breakdown:
 * Total Premium = 5% of Sum Insured
 * Farmer Net Payable = 20% of Premium (1% of Sum Insured)
 * Government Subsidy = 80% of Premium (4% of Sum Insured)
 */
export function calculatePolicyPremium(sumInsured: number) {
  const totalPremium = Math.round(sumInsured * 0.05);
  const farmerShare = Math.round(totalPremium * 0.20); // 20% of premium
  const subsidyAmount = Math.round(totalPremium * 0.80); // 80% of premium
  return { totalPremium, farmerShare, subsidyAmount };
}
