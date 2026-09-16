export type Role = 'FARMER' | 'INSURER' | 'ADMIN' | 'FIELD_AGENT';

export type RiskCategory = 'NORMAL' | 'LOW' | 'MODERATE' | 'HIGH' | 'CLAIM_TRIGGERED';

export type ClaimStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'DISBURSED';

export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED';

export type DeviceType = 
  | 'ESP32_MOISTURE_PROBE' 
  | 'DHT22_WEATHER' 
  | 'PUMP_RELAY' 
  | 'GSM_ALERT_GATEWAY';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmerName: string;
  insuranceUnitId: string;
  insuranceUnitCode: string;
  plotNumber: string;
  name: string;
  district: 'Nadia' | 'Burdwan' | 'Hooghly' | 'Murshidabad';
  village: string;
  gramPanchayat: string;
  acreage: number; // in hectares or acres
  currentCrop: 'Aman Paddy' | 'Potato' | 'Jute' | string;
  season: 'Kharif 2026' | 'Rabi 2025-26' | 'Pre-Kharif 2026' | string;
  sowingDate: string;
  expectedHarvest: string;
  currentChf: number; // 0.00 - 1.00 (e.g. 0.71)
  chfBaseline: number; // e.g. 0.76
  soilMoisturePct: number; // e.g. 58%
  riskLevel: RiskCategory;
  centroid: GeoPoint;
  boundaryCoordinates: [number, number][] | number[][];
  activePolicyId: string;
  sumInsured: number;
  lastSatelliteDate: string;
  ndvi: number;
  lswi: number;
  vhBackscatterDb: number;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  gramPanchayat: string;
  bankAccountMask: string;
  ifscCode: string;
  farmsCount: number;
  totalAcreage: number;
}

export interface InsuranceUnit {
  id: string;
  code: string;
  name: string;
  district: string;
  gramPanchayat: string;
  crop: string;
  totalAreaHa: number;
  chfBaseline: number;
  currentChf: number;
  deviation: number;
  affectedAreaHa: number;
  riskState: RiskCategory;
  weatherEventStatus: string;
  claimStatus: string;
  potentialPayoutInr: number;
  boundaryCoordinates: [number, number][] | number[][];
}

export interface Policy {
  id: string;
  policyNumber: string;
  farmerId: string;
  farmerName: string;
  farmId: string;
  farmPlot: string;
  insuranceUnitCode: string;
  crop: string;
  sumInsured: number;
  premiumAmount: number;
  subsidyAmount: number;
  farmerShare: number;
  triggerChf: number; // e.g. 0.55
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CLAIMED';
}

export interface SatelliteMetric {
  id: string;
  farmId: string;
  date: string;
  sceneId: string;
  satellite: 'Sentinel-2A' | 'Sentinel-2B' | 'Sentinel-1B' | 'Landsat-8';
  ndvi: number;
  lswi: number;
  vhBackscatterDb: number;
  integratedVh: number;
  fapar: number;
  gdd: number;
  cropVariability: number;
  rainfallMm: number;
  chf: number;
}

export interface IoTDevice {
  id: string;
  deviceUid: string;
  farmId: string;
  farmPlot: string;
  deviceType: DeviceType;
  name: string;
  hardwareModel: string;
  batteryPct: number;
  signalDbm: number;
  isActive: boolean;
  pumpStatus?: 'ACTIVE' | 'IDLE' | 'FAULT';
  lastHeartbeat: string;
  currentReading: {
    soilMoisturePct: number;
    temperatureC: number;
    humidityPct: number;
    rainfallMm: number;
    soilResistanceOhm: number;
  };
}

export interface SensorReading {
  id: string;
  deviceId: string;
  timestamp: string;
  soilMoisturePct: number;
  temperatureC: number;
  humidityPct: number;
  rainfallMm: number;
  soilResistanceOhm: number;
  pumpActive: boolean;
}

export interface DiseasePrediction {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  affectedAreaPct: number;
  modelVersion: string;
  timestamp: string;
  imageUrl: string;
  recommendedNextAction: string;
  treatmentPlan: {
    chemicalAdvisory: string;
    organicAdvisory: string;
    irrigationSchedule: string;
  };
  disclaimer: string;
}

export interface OptimizationRun {
  id: string;
  crop: string;
  soilNitrogen: number;
  soilPhosphorus: number;
  soilPotassium: number;
  soilPh: number;
  cropAgeDays: number;
  moisturePct: number;
  weatherCondition: string;
  recommendationN: number;
  recommendationP: number;
  recommendationK: number;
  waterRecommendationLiters: number;
  expectedYieldIncreasePct: number;
  estimatedCostInr: number;
  gaConvergence: number[];
  psoConvergence: number[];
  hybridConvergence: number[];
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  farmerId: string;
  farmerName: string;
  farmId: string;
  plotNumber: string;
  insuranceUnitCode: string;
  district: string;
  crop: string;
  triggerType: 'CHF_DROP' | 'EXCESS_RAINFALL' | 'HEAT_DROUGHT_STRESS' | string;
  triggerDate: string;
  chfMeasured: number;
  chfBaseline: number;
  lossFraction: number; // e.g. 0.35
  claimAmount: number; // in INR
  status: ClaimStatus;
  payoutRef?: string;
  createdAt: string;
  updatedAt: string;
  evidence: ClaimEvidence;
}

export interface ClaimEvidence {
  policy: {
    policyNumber: string;
    sumInsured: number;
    coverageWindow: string;
    triggerChf: number;
    verifiedSignature: string;
  };
  satelliteEvidence: {
    sceneId: string;
    satellite: string;
    acquisitionDate: string;
    ndviDropPct: number;
    vhAnomalydB: number;
    cloudFreeScene: boolean;
  };
  weatherEvidence: {
    stationId: string;
    recordedPrecipitationMm: number;
    historicalDeviationPct: number;
    consecutiveDryDays: number;
    heatIndexMaxC: number;
  };
  iotEvidence: {
    deviceUid: string;
    averageRootMoisturePct: number;
    soilResistanceOhm: number;
    pumpUptimeHours: number;
  };
  groundTruth: {
    fieldAgentName: string;
    surveyDate: string;
    observedStuntingPct: number;
    gpsVerified: boolean;
    verificationNotes: string;
  };
  chfCalculation: {
    formula: string;
    shannonWeights: {
      ndvi: number;
      lswi: number;
      vh: number;
      fapar: number;
      precipitation: number;
    };
    rawIndices: {
      ndvi: number;
      lswi: number;
      vh: number;
      fapar: number;
      precipitation: number;
    };
    calculatedChf: number;
  };
  baseline: {
    historicalNormalChf: number;
    fourYearAverage: number[];
    deviationSigma: number;
  };
  correctionFactor: {
    managementBiasAdjustment: number;
    terminalEventAdjustment: number;
    finalLossRatio: number;
  };
  decisionRule: {
    triggerCondition: string;
    evaluationResult: 'TRIGGER_MET' | 'TRIGGER_NOT_MET';
    payoutTierPct: number;
  };
  auditTrail: {
    step: string;
    timestamp: string;
    operatorOrSystem: string;
    hashSha256: string;
  }[];
  payout: {
    amountInr: number;
    beneficiaryAccount: string;
    ifsc: string;
    bankReferenceId: string;
    settlementTimestamp: string;
  };
}

export interface Payout {
  id: string;
  payoutRef: string;
  claimId: string;
  claimNumber: string;
  farmerName: string;
  crop: string;
  district: string;
  amount: number;
  bankRefId: string;
  beneficiaryMask: string;
  ifscCode: string;
  status: PayoutStatus;
  timeline: {
    weatherEvent: string;
    satelliteVerification: string;
    chfCalculation: string;
    thresholdTest: string;
    claimQualification: string;
    payoutInitiation: string;
    bankConfirmation: string;
  };
  createdAt: string;
  settledAt?: string;
}

export interface Alert {
  id: string;
  farmId: string;
  farmPlot: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  source: 'SATELLITE' | 'IOT' | 'WEATHER' | 'DISEASE_AI';
  actionLink: string;
  actionText: string;
  timestamp: string;
  isRead: boolean;
}

export interface Intervention {
  id: string;
  farmId: string;
  plotNumber: string;
  title: string;
  category: 'IRRIGATION' | 'FERTIGATION' | 'SPRAY' | 'HARVEST_PREP';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  actuatedBy: 'AUTOMATED_IOT' | 'FARMER_MANUAL' | 'AGRONOMIC_ADVISORY';
  notes: string;
  date: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  entityType: 'CLAIM' | 'SATELLITE_SCENE' | 'MODEL' | 'PAYOUT' | 'IOT' | 'WEATHER_EVENT' | string;
  entityId: string;
  action: string;
  actor: string;
  metadata?: any;
  sceneId?: string;
  satelliteSource?: string;
  acquisitionTime?: string;
  weatherSource?: string;
  modelVersion?: string;
  chfEngineVersion?: string;
  baselineVersion?: string;
  iotReadings?: string;
  groundEvidence?: string;
  decisionRule?: string;
  bankReference?: string;
  hashSha256: string;
  verificationStatus: 'VALID_CHAIN' | 'TAMPER_DETECTED';
}
