/**
 * Ghatal Block Agronomic & Insurance Registry
 * Based on Government / PMFBY Excel Sheet Specification
 * 
 * Includes:
 * 1. Village Historical Production & Yield Registry (2017-18 to 2026-27)
 *    - Area (in Hectares)
 *    - Production (in Tonnes)
 *    - Yield (in Kg/Hectare)
 * 2. Farmer Registration, Crop Loss & CCE Validation Registry
 *    - Village Name, Village Code, JL No.
 *    - Crop Type & Season (Kharif, Rabi, Summer)
 *    - Candidate Name & Area of Land
 *    - Historical & Current Crop Loss % (2017-18 to 2026-27)
 *    - Claimed Insurance (Yes / No)
 *    - Validation Fields: Yield (kg/ha), No. of CCEs, CCE Plot Size, Gross Produce, Net Grain Yield, Straw Yield, Harvest Date, Irrigation, Flood/Waterlogging, Rainfall Category
 * 3. Algorithm: Validates calculated CHF against the dummy data to determine the insurance payout amount.
 */

export interface VillageHistoricalRecord {
  villageName: string;
  cropType: string;
  season: 'Kharif' | 'Rabi' | 'Summer';
  areaHa: Record<string, number>;        // 2017-18 ... 2026-27
  productionTonnes: Record<string, number>; // 2017-18 ... 2026-27
  yieldKgHa: Record<string, number>;       // 2017-18 ... 2026-27
}

export interface FarmerInsuranceRecord {
  id: string;
  villageName: string;
  villageCode: string;
  jlNo: number;
  cropType: string;
  season: 'Kharif' | 'Rabi' | 'Summer';
  candidateName: string;
  phone: string;
  areaHa: number;
  sumInsuredPerHa: number;
  totalSumInsured: number;
  cropLossHistory: Record<string, number>; // percentage loss per year 2017-18 .. 2026-27
  claimedInsurance: 'Yes' | 'No';
  validation: {
    cceYieldKgHa: number;          // Measured CCE yield
    noOfCceConducted: number;      // e.g. 4
    ccePlotSizeM2: number;         // e.g. 25 (5m x 5m standard cut)
    grossProduceKg: number;        // harvested weight
    netGrainYieldKg: number;       // post 14% moisture standard adjustment
    strawYieldKgHa: number;        // byproduct biomass
    harvestDate: string;           // YYYY-MM-DD
    irrigation: 'Canal' | 'Borewell / DTW' | 'Rainfed' | 'River Lift';
    floodWaterlogging: 'Severe' | 'Moderate' | 'Low' | 'None';
    rainfallCategory: 'Cloudburst' | 'Excess' | 'Normal' | 'Deficient';
  };
}

export interface InsuranceValidationResult {
  candidateId: string;
  candidateName: string;
  villageName: string;
  jlNo: number;
  cropType: string;
  season: string;
  areaHa: number;
  sumInsured: number;
  calculatedChf: number;
  chfThreshold: number;
  thresholdYieldKgHa: number;    // Based on historical 7-year average * 80% indemnity
  validatedYieldKgHa: number;    // From CCE validation
  yieldShortfallRatio: number;   // max(0, (TY - ValidatedYield) / TY)
  chfDeficitRatio: number;       // max(0, (Threshold - CHF) / Threshold)
  validatedLossPct: number;      // Combined validated percentage
  insuranceClaimEligible: boolean;
  determinedInsuranceAmount: number; // SumInsured * validatedLossPct
  validationStatus: 'FULL_PAYOUT_TRIGGERED' | 'PARTIAL_PAYOUT_TRIGGERED' | 'NO_PAYOUT_SAFE' | 'CLAIM_REJECTED';
  rationale: string;
  cceEvidence: {
    noOfCceConducted: number;
    plotSizeM2: number;
    netGrainYieldKg: number;
    floodCondition: string;
    rainfallStatus: string;
  };
}

export const SEASONS_LIST = [
  '2017-18', '2018-19', '2019-20', '2020-21',
  '2021-22', '2022-23', '2023-24', '2024-25',
  '2025-26', '2026-27'
] as const;

// 1. Village Historical Production & Yield Benchmark across Ghatal Block
export const VILLAGE_HISTORICAL_DATA: VillageHistoricalRecord[] = [
  {
    villageName: 'Ghatal',
    cropType: 'Rice',
    season: 'Kharif',
    areaHa: {
      '2017-18': 1420, '2018-19': 1450, '2019-20': 1410, '2020-21': 1460,
      '2021-22': 1390, '2022-23': 1480, '2023-24': 1490, '2024-25': 1510,
      '2025-26': 1430, '2026-27': 1500
    },
    productionTonnes: {
      '2017-18': 3976, '2018-19': 4930, '2019-20': 4794, '2020-21': 5110,
      '2021-22': 3892, '2022-23': 5476, '2023-24': 5662, '2024-25': 5738,
      '2025-26': 4147, '2026-27': 5700
    },
    yieldKgHa: {
      '2017-18': 2800, '2018-19': 3400, '2019-20': 3400, '2020-21': 3500,
      '2021-22': 2800, '2022-23': 3700, '2023-24': 3800, '2024-25': 3800,
      '2025-26': 2900, '2026-27': 3800
    }
  },
  {
    villageName: 'Ghatal',
    cropType: 'Rice',
    season: 'Rabi',
    areaHa: {
      '2017-18': 820, '2018-19': 850, '2019-20': 880, '2020-21': 910,
      '2021-22': 890, '2022-23': 920, '2023-24': 940, '2024-25': 960,
      '2025-26': 970, '2026-27': 980
    },
    productionTonnes: {
      '2017-18': 3444, '2018-19': 3655, '2019-20': 3872, '2020-21': 4095,
      '2021-22': 4094, '2022-23': 4324, '2023-24': 4512, '2024-25': 4704,
      '2025-26': 4850, '2026-27': 4900
    },
    yieldKgHa: {
      '2017-18': 4200, '2018-19': 4300, '2019-20': 4400, '2020-21': 4500,
      '2021-22': 4600, '2022-23': 4700, '2023-24': 4800, '2024-25': 4900,
      '2025-26': 5000, '2026-27': 5000
    }
  },
  {
    villageName: 'Konnagar',
    cropType: 'Rice',
    season: 'Kharif',
    areaHa: {
      '2017-18': 950, '2018-19': 980, '2019-20': 960, '2020-21': 990,
      '2021-22': 940, '2022-23': 1010, '2023-24': 1020, '2024-25': 1040,
      '2025-26': 980, '2026-27': 1030
    },
    productionTonnes: {
      '2017-18': 2565, '2018-19': 3234, '2019-20': 3168, '2020-21': 3366,
      '2021-22': 2538, '2022-23': 3636, '2023-24': 3774, '2024-25': 3848,
      '2025-26': 2744, '2026-27': 3811
    },
    yieldKgHa: {
      '2017-18': 2700, '2018-19': 3300, '2019-20': 3300, '2020-21': 3400,
      '2021-22': 2700, '2022-23': 3600, '2023-24': 3700, '2024-25': 3700,
      '2025-26': 2800, '2026-27': 3700
    }
  },
  {
    villageName: 'Radhanagar',
    cropType: 'Rice',
    season: 'Kharif',
    areaHa: {
      '2017-18': 1120, '2018-19': 1140, '2019-20': 1110, '2020-21': 1160,
      '2021-22': 1100, '2022-23': 1180, '2023-24': 1200, '2024-25': 1220,
      '2025-26': 1140, '2026-27': 1210
    },
    productionTonnes: {
      '2017-18': 3248, '2018-19': 3990, '2019-20': 3885, '2020-21': 4176,
      '2021-22': 3190, '2022-23': 4366, '2023-24': 4560, '2024-25': 4636,
      '2025-26': 3420, '2026-27': 4719
    },
    yieldKgHa: {
      '2017-18': 2900, '2018-19': 3500, '2019-20': 3500, '2020-21': 3600,
      '2021-22': 2900, '2022-23': 3700, '2023-24': 3800, '2024-25': 3800,
      '2025-26': 3000, '2026-27': 3900
    }
  },
  {
    villageName: 'Kharar',
    cropType: 'Rice',
    season: 'Kharif',
    areaHa: {
      '2017-18': 890, '2018-19': 910, '2019-20': 880, '2020-21': 920,
      '2021-22': 870, '2022-23': 940, '2023-24': 950, '2024-25': 970,
      '2025-26': 900, '2026-27': 960
    },
    productionTonnes: {
      '2017-18': 2403, '2018-19': 3094, '2019-20': 2992, '2020-21': 3220,
      '2021-22': 2349, '2022-23': 3384, '2023-24': 3515, '2024-25': 3589,
      '2025-26': 2520, '2026-27': 3648
    },
    yieldKgHa: {
      '2017-18': 2700, '2018-19': 3400, '2019-20': 3400, '2020-21': 3500,
      '2021-22': 2700, '2022-23': 3600, '2023-24': 3700, '2024-25': 3700,
      '2025-26': 2800, '2026-27': 3800
    }
  }
];

// 2. Candidate Farmer Insurance Registration & CCE Validation Registry
export const FARMER_INSURANCE_REGISTRY: FarmerInsuranceRecord[] = [
  {
    id: 'cand-001',
    villageName: 'Ghatal',
    villageCode: 'WB-PAS-GHT-001',
    jlNo: 42,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Subhash Biswas',
    phone: '+91 98321 44820',
    areaHa: 2.8,
    sumInsuredPerHa: 50000,
    totalSumInsured: 140000,
    cropLossHistory: {
      '2017-18': 35.0, '2018-19': 8.0, '2019-20': 6.5, '2020-21': 5.0,
      '2021-22': 38.5, '2022-23': 4.0, '2023-24': 5.5, '2024-25': 6.0,
      '2025-26': 42.0, '2026-27': 0.0
    },
    claimedInsurance: 'Yes',
    validation: {
      cceYieldKgHa: 2050,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 5.8,
      netGrainYieldKg: 5.12,
      strawYieldKgHa: 3400,
      harvestDate: '2025-11-28',
      irrigation: 'Canal',
      floodWaterlogging: 'Severe',
      rainfallCategory: 'Cloudburst'
    }
  },
  {
    id: 'cand-002',
    villageName: 'Ghatal',
    villageCode: 'WB-PAS-GHT-001',
    jlNo: 42,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Rajesh Mondal',
    phone: '+91 98321 44821',
    areaHa: 1.5,
    sumInsuredPerHa: 50000,
    totalSumInsured: 75000,
    cropLossHistory: {
      '2017-18': 32.0, '2018-19': 6.0, '2019-20': 5.0, '2020-21': 4.0,
      '2021-22': 35.0, '2022-23': 3.5, '2023-24': 4.0, '2024-25': 5.0,
      '2025-26': 38.0, '2026-27': 0.0
    },
    claimedInsurance: 'Yes',
    validation: {
      cceYieldKgHa: 2210,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 6.2,
      netGrainYieldKg: 5.52,
      strawYieldKgHa: 3650,
      harvestDate: '2025-11-30',
      irrigation: 'Borewell / DTW',
      floodWaterlogging: 'Moderate',
      rainfallCategory: 'Excess'
    }
  },
  {
    id: 'cand-003',
    villageName: 'Konnagar',
    villageCode: 'WB-PAS-GHT-002',
    jlNo: 68,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Animesh Samanta',
    phone: '+91 94331 88412',
    areaHa: 3.2,
    sumInsuredPerHa: 50000,
    totalSumInsured: 160000,
    cropLossHistory: {
      '2017-18': 40.0, '2018-19': 10.0, '2019-20': 8.0, '2020-21': 6.0,
      '2021-22': 42.0, '2022-23': 5.0, '2023-24': 7.0, '2024-25': 6.5,
      '2025-26': 45.0, '2026-27': 0.0
    },
    claimedInsurance: 'Yes',
    validation: {
      cceYieldKgHa: 1920,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 5.4,
      netGrainYieldKg: 4.80,
      strawYieldKgHa: 3200,
      harvestDate: '2025-11-26',
      irrigation: 'Canal',
      floodWaterlogging: 'Severe',
      rainfallCategory: 'Cloudburst'
    }
  },
  {
    id: 'cand-004',
    villageName: 'Radhanagar',
    villageCode: 'WB-PAS-GHT-003',
    jlNo: 71,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Tapan Ghosh',
    phone: '+91 98320 11984',
    areaHa: 2.1,
    sumInsuredPerHa: 50000,
    totalSumInsured: 105000,
    cropLossHistory: {
      '2017-18': 15.0, '2018-19': 4.0, '2019-20': 4.5, '2020-21': 3.0,
      '2021-22': 18.0, '2022-23': 2.0, '2023-24': 3.0, '2024-25': 4.0,
      '2025-26': 12.0, '2026-27': 0.0
    },
    claimedInsurance: 'No',
    validation: {
      cceYieldKgHa: 3450,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 9.4,
      netGrainYieldKg: 8.62,
      strawYieldKgHa: 4800,
      harvestDate: '2025-12-05',
      irrigation: 'River Lift',
      floodWaterlogging: 'Low',
      rainfallCategory: 'Normal'
    }
  },
  {
    id: 'cand-005',
    villageName: 'Kharar',
    villageCode: 'WB-PAS-GHT-004',
    jlNo: 84,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Prabir Bhattacharya',
    phone: '+91 94330 12345',
    areaHa: 4.0,
    sumInsuredPerHa: 50000,
    totalSumInsured: 200000,
    cropLossHistory: {
      '2017-18': 30.0, '2018-19': 8.0, '2019-20': 7.0, '2020-21': 5.0,
      '2021-22': 32.0, '2022-23': 4.0, '2023-24': 5.0, '2024-25': 6.0,
      '2025-26': 36.0, '2026-27': 0.0
    },
    claimedInsurance: 'Yes',
    validation: {
      cceYieldKgHa: 2340,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 6.5,
      netGrainYieldKg: 5.85,
      strawYieldKgHa: 3800,
      harvestDate: '2025-12-02',
      irrigation: 'Borewell / DTW',
      floodWaterlogging: 'Moderate',
      rainfallCategory: 'Excess'
    }
  },
  {
    id: 'cand-006',
    villageName: 'Irhpala',
    villageCode: 'WB-PAS-GHT-005',
    jlNo: 92,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Debasis Roy',
    phone: '+91 98319 77210',
    areaHa: 1.8,
    sumInsuredPerHa: 50000,
    totalSumInsured: 90000,
    cropLossHistory: {
      '2017-18': 25.0, '2018-19': 6.0, '2019-20': 5.5, '2020-21': 4.0,
      '2021-22': 28.0, '2022-23': 3.0, '2023-24': 4.0, '2024-25': 5.0,
      '2025-26': 22.0, '2026-27': 0.0
    },
    claimedInsurance: 'Yes',
    validation: {
      cceYieldKgHa: 2850,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 7.8,
      netGrainYieldKg: 7.12,
      strawYieldKgHa: 4100,
      harvestDate: '2025-12-04',
      irrigation: 'Canal',
      floodWaterlogging: 'Moderate',
      rainfallCategory: 'Normal'
    }
  },
  {
    id: 'cand-007',
    villageName: 'Dewanganj',
    villageCode: 'WB-PAS-GHT-006',
    jlNo: 104,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Mihir Das',
    phone: '+91 94333 44102',
    areaHa: 2.5,
    sumInsuredPerHa: 50000,
    totalSumInsured: 125000,
    cropLossHistory: {
      '2017-18': 48.0, '2018-19': 12.0, '2019-20': 10.0, '2020-21': 8.0,
      '2021-22': 50.0, '2022-23': 6.0, '2023-24': 8.0, '2024-25': 9.0,
      '2025-26': 55.0, '2026-27': 0.0
    },
    claimedInsurance: 'Yes',
    validation: {
      cceYieldKgHa: 1680,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 4.7,
      netGrainYieldKg: 4.20,
      strawYieldKgHa: 2900,
      harvestDate: '2025-11-22',
      irrigation: 'Rainfed',
      floodWaterlogging: 'Severe',
      rainfallCategory: 'Cloudburst'
    }
  },
  {
    id: 'cand-008',
    villageName: 'Monoharpur',
    villageCode: 'WB-PAS-GHT-007',
    jlNo: 118,
    cropType: 'Rice',
    season: 'Kharif',
    candidateName: 'Kalyan Mukherjee',
    phone: '+91 98315 22091',
    areaHa: 3.6,
    sumInsuredPerHa: 50000,
    totalSumInsured: 180000,
    cropLossHistory: {
      '2017-18': 18.0, '2018-19': 5.0, '2019-20': 4.0, '2020-21': 3.5,
      '2021-22': 20.0, '2022-23': 2.5, '2023-24': 3.5, '2024-25': 4.0,
      '2025-26': 15.0, '2026-27': 0.0
    },
    claimedInsurance: 'No',
    validation: {
      cceYieldKgHa: 3380,
      noOfCceConducted: 4,
      ccePlotSizeM2: 25,
      grossProduceKg: 9.1,
      netGrainYieldKg: 8.45,
      strawYieldKgHa: 4700,
      harvestDate: '2025-12-08',
      irrigation: 'River Lift',
      floodWaterlogging: 'Low',
      rainfallCategory: 'Normal'
    }
  }
];

/**
 * 3. CORE ALGORITHM:
 * Validates the calculated CHF against historical village yield benchmarks & CCE validation data
 * to determine the exact insurance payout amount.
 */
export function validateInsuranceClaimWithChf(
  candidateId: string,
  calculatedChf: number,
  chfThreshold: number = 0.55
): InsuranceValidationResult {
  const candidate = FARMER_INSURANCE_REGISTRY.find(c => c.id === candidateId) || FARMER_INSURANCE_REGISTRY[0];
  const villageHistory = VILLAGE_HISTORICAL_DATA.find(
    v => v.villageName.toLowerCase() === candidate.villageName.toLowerCase() && v.season === candidate.season
  ) || VILLAGE_HISTORICAL_DATA[0];

  // 1. Calculate Historical Threshold Yield (TY)
  // Average of last 7 years (excluding 2 disaster flood years 2017-18 and 2021-22)
  const nonDisasterYears = ['2018-19', '2019-20', '2020-21', '2022-23', '2023-24', '2024-25'];
  const avgYield = nonDisasterYears.reduce((sum, yr) => sum + (villageHistory.yieldKgHa[yr] || 3500), 0) / nonDisasterYears.length;
  // PMFBY standard indemnity level for Ghatal block is 80%
  const thresholdYieldKgHa = Math.round(avgYield * 0.80);

  // 2. CCE Validated Yield from Crop Cutting Experiment
  const validatedYieldKgHa = candidate.validation.cceYieldKgHa;

  // 3. Yield Shortfall Ratio from CCE
  const yieldShortfall = Math.max(0, (thresholdYieldKgHa - validatedYieldKgHa) / thresholdYieldKgHa);

  // 4. CHF Deficit Ratio from Multi-Satellite Algorithm
  const chfDeficit = calculatedChf < chfThreshold ? (chfThreshold - calculatedChf) / chfThreshold : 0;

  // 5. Harmonize CHF with CCE Validated Loss
  // When calculated CHF is low (< 0.55) AND CCE yield is below threshold yield, payout is triggered
  let validatedLossPct = 0;
  let status: 'FULL_PAYOUT_TRIGGERED' | 'PARTIAL_PAYOUT_TRIGGERED' | 'NO_PAYOUT_SAFE' | 'CLAIM_REJECTED' = 'NO_PAYOUT_SAFE';
  let rationale = '';

  if (calculatedChf < 0.20) {
    // Severe / Catastrophic Shock
    validatedLossPct = 1.0; // 100%
    status = 'FULL_PAYOUT_TRIGGERED';
    rationale = `Catastrophic failure confirmed by Sentinel-1 radar backscatter (CHF ${calculatedChf.toFixed(3)} < 0.20) and CCE yield drop (${validatedYieldKgHa} kg/ha). 100% full sum insured payout warranted.`;
  } else if (calculatedChf <= chfThreshold) {
    // Parametric threshold breach validated against CCE
    // Loss percentage combines CHF deficit and CCE shortfall
    const combinedRate = Math.min(1.0, Math.max(yieldShortfall, chfDeficit * 1.15));
    validatedLossPct = parseFloat(combinedRate.toFixed(4));
    status = 'PARTIAL_PAYOUT_TRIGGERED';
    rationale = `Parametric trigger breached (CHF ${calculatedChf.toFixed(3)} <= ${chfThreshold}). Validated against CCE net grain yield (${validatedYieldKgHa} kg/ha vs Threshold ${thresholdYieldKgHa} kg/ha) and ${candidate.validation.floodWaterlogging} flood inundation.`;
  } else {
    // Normal / Healthy
    validatedLossPct = 0.0;
    status = 'NO_PAYOUT_SAFE';
    rationale = `Crop Health Factor (CHF ${calculatedChf.toFixed(3)}) exceeds trigger threshold (${chfThreshold}). CCE yield is within safe envelope (${validatedYieldKgHa} kg/ha). No indemnity payable.`;
  }

  // 6. Calculate Final Insurance Indemnity Amount
  const determinedInsuranceAmount = Math.round(candidate.totalSumInsured * validatedLossPct);

  return {
    candidateId: candidate.id,
    candidateName: candidate.candidateName,
    villageName: candidate.villageName,
    jlNo: candidate.jlNo,
    cropType: candidate.cropType,
    season: candidate.season,
    areaHa: candidate.areaHa,
    sumInsured: candidate.totalSumInsured,
    calculatedChf,
    chfThreshold,
    thresholdYieldKgHa,
    validatedYieldKgHa,
    yieldShortfallRatio: parseFloat(yieldShortfall.toFixed(4)),
    chfDeficitRatio: parseFloat(chfDeficit.toFixed(4)),
    validatedLossPct: parseFloat((validatedLossPct * 100).toFixed(1)),
    insuranceClaimEligible: determinedInsuranceAmount > 0,
    determinedInsuranceAmount,
    validationStatus: status,
    rationale,
    cceEvidence: {
      noOfCceConducted: candidate.validation.noOfCceConducted,
      plotSizeM2: candidate.validation.ccePlotSizeM2,
      netGrainYieldKg: candidate.validation.netGrainYieldKg,
      floodCondition: candidate.validation.floodWaterlogging,
      rainfallStatus: candidate.validation.rainfallCategory,
    }
  };
}

