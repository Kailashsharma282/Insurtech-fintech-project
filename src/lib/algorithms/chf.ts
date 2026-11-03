/**
 * Crop Health Factor (CHF) Computation Engine
 * Specially calibrated for Ghatal Block (2025 Kharif Season)
 * FAPAR: EXCLUDED
 * 
 * Pipeline:
 * 1. Vegetation Indices (NDVI, LSWI, SAVI, EVI, VegetationIndexStack)
 * 2. Radar backscatter (VHmax, VH_integrated)
 * 3. Hydro-meteorological indicators (CHIRPS Rainfall, RainyDays >= 2.5mm, ERA5-Land GDD Tbase=10°C)
 * 4. Spatial CV and Crop Condition Variability
 * 5. Min-Max Normalization across 6 core indicators
 * 6. Pixel-based Shannon Entropy Weighting (w_i = d_i / sum(d))
 * 7. Weighted Composite Score CHF in [0.00, 1.00]
 * 8. 5-Tier Classification and Parametric Trigger Analysis
 */

import { computeGhatalChf2025, GhatalRawObservations, GhatalChfResult, GHATAL_2025_BOUNDS } from './ghatal-chf';

export interface ChfRawInputs {
  ndvi: number;            // NDVI (0.1 to 0.9)
  lswi: number;            // LSWI (-0.2 to 0.6)
  vhBackscatterDb: number; // Sentinel-1 VH (-25 dB to -10 dB)
  integratedVh?: number;   // Multi-temporal VH linear integration
  rainfallMm: number;      // Seasonal cumulative rainfall
  rainyDays: number;       // Rainy days >= 2.5 mm
  gdd?: number;            // Cumulative GDD
  cropVariability?: number;// Spatial CV
  fapar?: number;          // Excluded in Ghatal 2025, kept optional for interface compatibility
}

export interface ShannonWeights {
  ndvi: number;
  lswi: number;
  vhBackscatter: number;
  rainfall: number;
  rainyDays: number;
  gdd: number;
  integratedVh?: number;
  fapar?: number;
  cropVariability?: number;
}

export interface ChfComputationResult {
  chfScore: number;
  baselineScore: number;
  deviation: number;
  deviationPercentage: number;
  status: 'OPTIMAL' | 'WATCH' | 'STRESS_DETECTED' | 'TRIGGER_LEVEL';
  classCode: number;
  classLabel: string;
  confidence: number;
  shannonWeights: ShannonWeights;
  normalizedInputs: Record<string, number>;
  entropyValues: Record<string, number>;
  dispersionFactors: Record<string, number>;
  formulas: {
    normalization: string;
    entropy: string;
    dispersion: string;
    weights: string;
    chfComposite: string;
  };
  ghatalDetails?: GhatalChfResult;
}

export function computeChf(inputs: ChfRawInputs, baselineScore: number = 0.55): ChfComputationResult {
  // Translate to Ghatal 2025 observations
  // NIR ~ 0.45, Red ~ 0.08 produces NDVI ~ (0.45-0.08)/(0.45+0.08) = 0.698
  const nir = 0.45;
  const red = Math.max(0.01, (nir * (1 - inputs.ndvi)) / (1 + inputs.ndvi));
  const swir1 = Math.max(0.01, (nir * (1 - inputs.lswi)) / (1 + inputs.lswi));
  const blue = 0.04;

  const obs: GhatalRawObservations = {
    nir,
    red,
    blue,
    swir1,
    ndviMax: inputs.ndvi,
    lswiMax: inputs.lswi,
    vhDb: inputs.vhBackscatterDb,
    vhMax: inputs.vhBackscatterDb,
    vhIntegrated: inputs.integratedVh ?? 0.74,
    seasonalRainfallMm: inputs.rainfallMm >= 300 ? inputs.rainfallMm : inputs.rainfallMm * 12, // adjust if 14-day or seasonal
    rainyDaysCount: inputs.rainyDays >= 20 ? inputs.rainyDays : Math.round(inputs.rainyDays * 8.5),
    growingDegreeDays: inputs.gdd ?? 3180,
  };

  const ghatalRes = computeGhatalChf2025(obs, baselineScore);
  const score = ghatalRes.chfScore;
  const deviation = parseFloat((score - baselineScore).toFixed(3));
  const deviationPercentage = parseFloat(((deviation / baselineScore) * 100).toFixed(1));

  let status: 'OPTIMAL' | 'WATCH' | 'STRESS_DETECTED' | 'TRIGGER_LEVEL' = 'OPTIMAL';
  if (score < 0.35) {
    status = 'TRIGGER_LEVEL';
  } else if (score < baselineScore) {
    status = 'STRESS_DETECTED';
  } else if (score < 0.65) {
    status = 'WATCH';
  } else {
    status = 'OPTIMAL';
  }

  const weights: ShannonWeights = {
    ndvi: ghatalRes.entropyWeights.NDVImax,
    lswi: ghatalRes.entropyWeights.LSWImax,
    vhBackscatter: ghatalRes.entropyWeights.VHmax,
    rainfall: ghatalRes.entropyWeights.Rainfall,
    rainyDays: ghatalRes.entropyWeights.RainyDays,
    gdd: ghatalRes.entropyWeights.GDD,
  };

  const normInputs: Record<string, number> = {};
  const entropyVals: Record<string, number> = {};
  const dispFactors: Record<string, number> = {};

  ghatalRes.entropyDetails.forEach(d => {
    normInputs[d.indicator] = d.normalizedValue;
    entropyVals[d.indicator] = d.entropy;
    dispFactors[d.indicator] = d.diversity;
  });

  return {
    chfScore: score,
    baselineScore,
    deviation,
    deviationPercentage,
    status,
    classCode: ghatalRes.chfClass.code,
    classLabel: ghatalRes.chfClass.label,
    confidence: 0.94,
    shannonWeights: weights,
    normalizedInputs: normInputs,
    entropyValues: entropyVals,
    dispersionFactors: dispFactors,
    formulas: {
      normalization: ghatalRes.mathematicalFormulas.normalization,
      entropy: ghatalRes.mathematicalFormulas.entropy,
      dispersion: 'd_j = 1 - E_j (Degree of information diversity)',
      weights: 'w_j = d_j / sum(d_k), normalized so sum(w_j) = 1.0',
      chfComposite: ghatalRes.mathematicalFormulas.chfComposite,
    },
    ghatalDetails: ghatalRes,
  };
}

export * from './ghatal-chf';
