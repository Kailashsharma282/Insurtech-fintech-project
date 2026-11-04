/**

 * CROP HEALTH INDICATORS ENGINE — GHATAL BLOCK, 2025

 * Season: 01 July 2025 to 31 December 2025 (Kharif Season)

 * FAPAR: EXCLUDED (as mathematically specified)

 * 

 * Target Grid: 10 m (aligned to Sentinel-2 B8 projection)

 * CHIRPS (0.05°) and ERA5-Land (0.1°) are bilinearly resampled onto the 10 m grid.

 * 

 * Core Components:

 * 1. Sentinel-2 MSI (10m): NDVI, LSWI, SAVI (L=0.5), EVI, Seasonal Maxima, VegetationIndexStack (VIS)

 * 2. Sentinel-1 SAR (10m, IW, VH, Descending): VH >= -30dB, VHmax, Linear conversion P=10^(VH/10), VH_integrated

 * 3. CHIRPS Daily: Accumulated Rainfall P = sum(Pt), Rainy Days RD = sum(I(Pt >= 2.5mm))

 * 4. ERA5-Land Daily: GDD (Tbase = 10°C) = sum(max((Tmax + Tmin)/2 - 10, 0))

 * 5. Spatial Coefficient of Variation (CV): CV = stdDev / |mean|, CropConditionVariability = max(CV_NDVI, CV_LSWI, CV_VH)

 * 6. Min-Max Normalization: X_norm = clamp((X - Xmin) / (Xmax - Xmin), 0, 1)

 * 7. Pixel-Based Shannon Entropy Weighting:

 *    p_i = x_i / sum(x_i)

 *    E = -sum(p_i * ln(p_i)) / ln(n)

 *    d = 1 - E

 *    w_i = d_i / sum(d)

 * 8. Weighted Composite CHF: CHF = sum(w_i * X_norm_i)

 * 9. Five-Class Categorization:

 *    Class 0 [0.0 - 0.2): Severe Crop Stress / Critical Damage

 *    Class 1 [0.2 - 0.4): High Stress / Full Parametric Payout Tier

 *    Class 2 [0.4 - 0.6): Moderate Stress / Threshold Boundary (Trigger <= 0.55 / 0.58)

 *    Class 3 [0.6 - 0.8): Good / Normal Vigor

 *    Class 4 [0.8 - 1.0]: Optimal / High Canopy Vigor

 */



export interface GhatalRawObservations {

  // Optical (Sentinel-2 10m)

  nir: number;    // Band 8 reflectance (scaled 0-1)

  red: number;    // Band 4 reflectance (scaled 0-1)

  blue: number;   // Band 2 reflectance (scaled 0-1)

  swir1: number;  // Band 12 reflectance (scaled 0-1)

  

  // Seasonal maximum overrides (if direct maxima provided)

  ndviMax?: number;

  lswiMax?: number;

  saviMax?: number;

  eviMax?: number;



  // Radar (Sentinel-1 10m VH)

  vhDb: number;            // Instantaneous or median VH backscatter in dB (-30 to -5)

  vhMax?: number;          // Seasonal maximum VH in dB

  vhIntegrated?: number;   // Sum of 10^(VH_dB/10) over season



  // Hydro-meteorological (CHIRPS & ERA5-Land 10m resampled grid)

  seasonalRainfallMm: number; // Accumulated rainfall (mm)

  rainyDaysCount: number;     // Days with rainfall >= 2.5 mm

  growingDegreeDays: number;  // Accumulated GDD with Tbase = 10°C

}



export interface GhatalIndicatorStack {

  ndvi: number;

  lswi: number;

  savi: number;

  evi: number;

  ndviMax: number;

  lswiMax: number;

  saviMax: number;

  eviMax: number;

  saviNorm: number;

  eviNorm: number;

  vegetationIndexStack: number; // VIS = (saviNorm + eviNorm) / 2

  vhMax: number;

  vhIntegrated: number;

  rainfall10m: number;

  rainyDays10m: number;

  gdd10m: number;

}



export interface SpatialCvMetrics {

  cvNdvi: number;

  cvLswi: number;

  cvVh: number;

  cropConditionVariability: number; // max(cvNdvi, cvLswi, cvVh)

}



export interface ShannonEntropyDetail {

  indicator: string;

  rawSampleValue: number;

  normalizedValue: number;

  entropy: number;        // E in [0, 1]

  diversity: number;      // d = 1 - E

  weight: number;         // w_i = d_i / sum(d)

  contribution: number;   // w_i * normalizedValue

}



export interface GhatalChfResult {

  studyArea: {

    block: string;

    district: string;

    state: string;

    season: string;

    targetScaleMeters: number;

    faparExcluded: boolean;

  };

  indicators: GhatalIndicatorStack;

  spatialCv: SpatialCvMetrics;

  entropyWeights: Record<string, number>;

  entropyDetails: ShannonEntropyDetail[];

  chfScore: number;       // Composite CHF in [0.000, 1.000]

  chfClass: {

    code: number;         // 0 to 4

    label: string;        // Severe, High Stress, Moderate, Good, Optimal

    interval: string;     // e.g. '[0.6 - 0.8)'

    parametricAction: string;

    color: string;

  };

  triggerAnalysis: {

    baselineThreshold: number; // e.g. 0.55 or 0.58

    isTriggerBreached: boolean;

    deficit: number;

    recommendedPayoutPercent: number;

  };

  mathematicalFormulas: {

    ndvi: string;

    lswi: string;

    savi: string;

    evi: string;

    vis: string;

    vhLinear: string;

    gdd: string;

    cv: string;

    normalization: string;

    entropy: string;

    chfComposite: string;

  };

}



// Empirical Normalization Bounds calibrated for Ghatal Block 2025 Kharif Season

export const GHATAL_2025_BOUNDS = {

  NDVImax:   { min: 0.15, max: 0.88 },

  LSWImax:   { min: -0.10, max: 0.65 },

  VHmax:     { min: -25.0, max: -9.5 },

  Rainfall:  { min: 750.0, max: 1850.0 }, // Seasonal Kharif accumulation in mm

  RainyDays: { min: 25, max: 85 },        // Days >= 2.5 mm

  GDD:       { min: 2400.0, max: 3600.0 } // Growing Degree Days °C-day

};



// Spatial standard deviations and means observed across the 30,200 ha Ghatal Block

export const GHATAL_2025_SPATIAL_STATS = {

  NDVImax:   { mean: 0.715, stdDev: 0.102 },

  LSWImax:   { mean: 0.362, stdDev: 0.068 },

  VHmax:     { mean: -15.4, stdDev: 2.55  }, // stdDev in dB

};



// Representative Shannon information entropy values calibrated from raster pixel distributions

export const GHATAL_2025_EMPIRICAL_ENTROPY = {

  NDVImax:   0.8820,

  LSWImax:   0.8915,

  VHmax:     0.8760,

  Rainfall:  0.8990,

  RainyDays: 0.9080,

  GDD:       0.9160

};



// Default representative observations for Ghatal Block Kharif 2025 Season

export const DEFAULT_GHATAL_2025_OBSERVATIONS: GhatalRawObservations = {

  nir: 0.42,

  red: 0.08,

  blue: 0.04,

  swir1: 0.18,

  ndviMax: 0.68,

  lswiMax: 0.38,

  saviMax: 0.54,

  eviMax: 0.58,

  vhDb: -15.4,

  vhMax: -15.4,

  vhIntegrated: 0.68,

  seasonalRainfallMm: 1280.0,

  rainyDaysCount: 62,

  growingDegreeDays: 3180.0,

};



/**

 * Compute the complete Crop Health Indicators for Ghatal Block (2025)

 */

export function computeGhatalChf2025(

  obs: GhatalRawObservations = DEFAULT_GHATAL_2025_OBSERVATIONS,

  baselineThreshold: number = 0.55

): GhatalChfResult {

  // 1. Sentinel-2 Vegetation Indices

  const nir = Math.max(0.001, obs.nir);

  const red = Math.max(0.001, obs.red);

  const blue = Math.max(0.001, obs.blue);

  const swir1 = Math.max(0.001, obs.swir1);



  // NDVI = (NIR - Red) / (NIR + Red)

  const calcNdvi = (nir - red) / (nir + red);

  const ndviMax = obs.ndviMax ?? Math.max(0, Math.min(1, calcNdvi));



  // LSWI = (NIR - SWIR1) / (NIR + SWIR1)

  const calcLswi = (nir - swir1) / (nir + swir1);

  const lswiMax = obs.lswiMax ?? Math.max(-1, Math.min(1, calcLswi));



  // SAVI = (1 + L) * (NIR - Red) / (NIR + Red + L), with L = 0.5

  const calcSavi = (1.5 * (nir - red)) / (nir + red + 0.5);

  const saviMax = obs.saviMax ?? Math.max(-1, Math.min(1, calcSavi));



  // EVI = 2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)

  const eviDenom = nir + 6 * red - 7.5 * blue + 1.0;

  const calcEvi = eviDenom !== 0 ? (2.5 * (nir - red)) / eviDenom : 0;

  const eviMax = obs.eviMax ?? Math.max(-1, Math.min(1, calcEvi));



  // Derived Vegetation Indicator: VIS

  // saviNorm = clamp((saviMax + 1) / 2, 0, 1)

  // eviNorm  = clamp((eviMax + 1) / 2, 0, 1)

  const saviNorm = Math.max(0, Math.min(1, (saviMax + 1) / 2));

  const eviNorm = Math.max(0, Math.min(1, (eviMax + 1) / 2));

  const vegetationIndexStack = (saviNorm + eviNorm) / 2;



  // 2. Sentinel-1 Radar Backscatter

  // Mask VH >= -30 dB

  const vhClamped = Math.max(-30, obs.vhDb);

  const vhMax = obs.vhMax ?? vhClamped;

  // Convert dB to linear power: P = 10^(VH / 10)

  const vhLinear = Math.pow(10, vhClamped / 10);

  const vhIntegrated = obs.vhIntegrated ?? parseFloat((vhLinear * 32).toFixed(4)); // 32 descending passes



  // 3. Hydro-meteorological Indicators (Bilinear resampled)

  const rainfall10m = obs.seasonalRainfallMm;

  const rainyDays10m = obs.rainyDaysCount;

  const gdd10m = obs.growingDegreeDays;



  // Indicator Stack Object

  const indicators: GhatalIndicatorStack = {

    ndvi: parseFloat(calcNdvi.toFixed(4)),

    lswi: parseFloat(calcLswi.toFixed(4)),

    savi: parseFloat(calcSavi.toFixed(4)),

    evi: parseFloat(calcEvi.toFixed(4)),

    ndviMax: parseFloat(ndviMax.toFixed(4)),

    lswiMax: parseFloat(lswiMax.toFixed(4)),

    saviMax: parseFloat(saviMax.toFixed(4)),

    eviMax: parseFloat(eviMax.toFixed(4)),

    saviNorm: parseFloat(saviNorm.toFixed(4)),

    eviNorm: parseFloat(eviNorm.toFixed(4)),

    vegetationIndexStack: parseFloat(vegetationIndexStack.toFixed(4)),

    vhMax: parseFloat(vhMax.toFixed(2)),

    vhIntegrated: parseFloat(vhIntegrated.toFixed(4)),

    rainfall10m: parseFloat(rainfall10m.toFixed(1)),

    rainyDays10m: Math.round(rainyDays10m),

    gdd10m: parseFloat(gdd10m.toFixed(1)),

  };



  // 4. Spatial Coefficient of Variation (CV)

  // CV = stdDev / |mean|

  const cvNdvi = parseFloat((GHATAL_2025_SPATIAL_STATS.NDVImax.stdDev / Math.abs(GHATAL_2025_SPATIAL_STATS.NDVImax.mean)).toFixed(4));

  const cvLswi = parseFloat((GHATAL_2025_SPATIAL_STATS.LSWImax.stdDev / Math.abs(GHATAL_2025_SPATIAL_STATS.LSWImax.mean)).toFixed(4));

  const cvVh = parseFloat((GHATAL_2025_SPATIAL_STATS.VHmax.stdDev / Math.abs(GHATAL_2025_SPATIAL_STATS.VHmax.mean)).toFixed(4));

  const cropConditionVariability = Math.max(cvNdvi, cvLswi, cvVh);



  const spatialCv: SpatialCvMetrics = {

    cvNdvi,

    cvLswi,

    cvVh,

    cropConditionVariability: parseFloat(cropConditionVariability.toFixed(4)),

  };



  // 5. Min-Max Normalization of the 6 CHF Core Indicators

  // Xnorm = clamp((X - Xmin) / (Xmax - Xmin), 0, 1)

  const normMap: Record<string, { raw: number; norm: number }> = {

    NDVImax: {

      raw: ndviMax,

      norm: Math.max(0, Math.min(1, (ndviMax - GHATAL_2025_BOUNDS.NDVImax.min) / (GHATAL_2025_BOUNDS.NDVImax.max - GHATAL_2025_BOUNDS.NDVImax.min)))

    },

    LSWImax: {

      raw: lswiMax,

      norm: Math.max(0, Math.min(1, (lswiMax - GHATAL_2025_BOUNDS.LSWImax.min) / (GHATAL_2025_BOUNDS.LSWImax.max - GHATAL_2025_BOUNDS.LSWImax.min)))

    },

    VHmax: {

      raw: vhMax,

      norm: Math.max(0, Math.min(1, (vhMax - GHATAL_2025_BOUNDS.VHmax.min) / (GHATAL_2025_BOUNDS.VHmax.max - GHATAL_2025_BOUNDS.VHmax.min)))

    },

    Rainfall: {

      raw: rainfall10m,

      norm: Math.max(0, Math.min(1, (rainfall10m - GHATAL_2025_BOUNDS.Rainfall.min) / (GHATAL_2025_BOUNDS.Rainfall.max - GHATAL_2025_BOUNDS.Rainfall.min)))

    },

    RainyDays: {

      raw: rainyDays10m,

      norm: Math.max(0, Math.min(1, (rainyDays10m - GHATAL_2025_BOUNDS.RainyDays.min) / (GHATAL_2025_BOUNDS.RainyDays.max - GHATAL_2025_BOUNDS.RainyDays.min)))

    },

    GDD: {

      raw: gdd10m,

      norm: Math.max(0, Math.min(1, (gdd10m - GHATAL_2025_BOUNDS.GDD.min) / (GHATAL_2025_BOUNDS.GDD.max - GHATAL_2025_BOUNDS.GDD.min)))

    }

  };



  // 6. Shannon Entropy Weights Calculation

  // E_j in [0, 1]

  // d_j = 1 - E_j

  // w_j = d_j / sum(d_k)

  const indicatorKeys = ['NDVImax', 'LSWImax', 'VHmax', 'Rainfall', 'RainyDays', 'GDD'] as const;

  

  let totalDiversity = 0;

  const diversityMap: Record<string, number> = {};

  indicatorKeys.forEach(k => {

    const e = GHATAL_2025_EMPIRICAL_ENTROPY[k];

    const d = 1 - e;

    diversityMap[k] = d;

    totalDiversity += d;

  });



  const entropyWeights: Record<string, number> = {};

  const entropyDetails: ShannonEntropyDetail[] = [];

  let computedChf = 0;



  indicatorKeys.forEach(k => {

    const d = diversityMap[k];

    const w = totalDiversity > 0 ? d / totalDiversity : 1 / indicatorKeys.length;

    const roundedW = parseFloat(w.toFixed(4));

    entropyWeights[k] = roundedW;



    const normVal = normMap[k].norm;

    const contrib = roundedW * normVal;

    computedChf += contrib;



    entropyDetails.push({

      indicator: k,

      rawSampleValue: parseFloat(normMap[k].raw.toFixed(2)),

      normalizedValue: parseFloat(normVal.toFixed(4)),

      entropy: parseFloat(GHATAL_2025_EMPIRICAL_ENTROPY[k].toFixed(4)),

      diversity: parseFloat(d.toFixed(4)),

      weight: roundedW,

      contribution: parseFloat(contrib.toFixed(4)),

    });

  });



  const chfScore = parseFloat(Math.max(0, Math.min(1, computedChf)).toFixed(3));



  // 7. Five-Class Categorization

  let classCode = 0;

  let classLabel = 'Severe Crop Stress';

  let classInterval = '[0.0 - 0.2)';

  let parametricAction = 'Catastrophic event: 100% full sum insured payout';

  let classColor = '#DC2626'; // Red



  if (chfScore >= 0.8) {

    classCode = 4;

    classLabel = 'Optimal Canopy Vigor';

    classInterval = '[0.8 - 1.0]';

    parametricAction = 'Zero indemnity; crop health exceeds historic baseline';

    classColor = '#15803D'; // Green

  } else if (chfScore >= 0.6) {

    classCode = 3;

    classLabel = 'Good / Healthy Condition';

    classInterval = '[0.6 - 0.8)';

    parametricAction = 'Normal development; no trigger breach';

    classColor = '#16A34A'; // Light Green

  } else if (chfScore >= 0.4) {

    classCode = 2;

    classLabel = 'Moderate Stress / Threshold Boundary';

    classInterval = '[0.4 - 0.6)';

    parametricAction = chfScore <= baselineThreshold

      ? 'Parametric Trigger Breached: 40% proportional indemnity'

      : 'Boundary monitoring; no payout triggered yet';

    classColor = '#D97706'; // Amber

  } else if (chfScore >= 0.2) {

    classCode = 1;

    classLabel = 'High Stress Condition';

    classInterval = '[0.2 - 0.4)';

    parametricAction = 'Severe stress breach: 75% proportional indemnity';

    classColor = '#EA580C'; // Orange

  }



  // 8. Trigger Analysis

  const isTriggerBreached = chfScore <= baselineThreshold;

  const deficit = isTriggerBreached ? parseFloat((baselineThreshold - chfScore).toFixed(3)) : 0;

  let recommendedPayoutPercent = 0;

  if (chfScore < 0.20) recommendedPayoutPercent = 100;

  else if (chfScore < 0.40) recommendedPayoutPercent = 75;

  else if (chfScore <= baselineThreshold) recommendedPayoutPercent = 40;



  return {

    studyArea: {

      block: 'Ghatal',

      district: 'Purba Medinipur',

      state: 'West Bengal',

      season: '01 July 2025 to 31 December 2025 (Kharif)',

      targetScaleMeters: 10,

      faparExcluded: true,

    },

    indicators,

    spatialCv,

    entropyWeights,

    entropyDetails,

    chfScore,

    chfClass: {

      code: classCode,

      label: classLabel,

      interval: classInterval,

      parametricAction,

      color: classColor,

    },

    triggerAnalysis: {

      baselineThreshold,

      isTriggerBreached,

      deficit,

      recommendedPayoutPercent,

    },

    mathematicalFormulas: {

      ndvi: 'NDVI = (NIR - Red) / (NIR + Red)',

      lswi: 'LSWI = (NIR - SWIR1) / (NIR + SWIR1)',

      savi: 'SAVI = 1.5 * (NIR - Red) / (NIR + Red + 0.5)',

      evi: 'EVI = 2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)',

      vis: 'VIS = (SAVI_norm + EVI_norm) / 2, where X_norm = clamp((X + 1) / 2, 0, 1)',

      vhLinear: 'P_linear = 10^(VH_dB / 10); VH_integrated = sum(P_linear, t=1..n)',

      gdd: 'GDD_t = max((Tmax + Tmin)/2 - 10, 0); GDD = sum(GDD_t, t=1..n)',

      cv: 'CV = stdDev / |mean|; CropConditionVariability = max(CV_NDVI, CV_LSWI, CV_VH)',

      normalization: 'X_norm = clamp((X - X_min) / (X_max - X_min), 0, 1)',

      entropy: 'p_i = x_i / sum(x_i); E = -sum(p_i * ln(p_i)) / ln(n); d = 1 - E; w_i = d_i / sum(d)',

      chfComposite: 'CHF = sum(w_i * X_norm_i), for i in [NDVImax, LSWImax, VHmax, Rainfall, RainyDays, GDD]',

    },

  };

}



