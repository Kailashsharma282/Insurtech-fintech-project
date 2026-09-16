import { Farm, Farmer, InsuranceUnit, Policy, Claim, Payout, IoTDevice, Alert, Intervention, SatelliteMetric, AuditLogItem } from '../types';

// Districts in West Bengal
export const DISTRICTS = ['Nadia', 'Burdwan', 'Hooghly', 'Murshidabad'] as const;
export const CROPS = ['Aman Paddy', 'Potato', 'Jute'] as const;

// 1. Insurance Units across the 4 districts
export const SEED_INSURANCE_UNITS: InsuranceUnit[] = [
  {
    id: 'iu-nadia-01',
    code: 'WB-NAD-001',
    name: 'Santipur Central Gram Panchayat',
    district: 'Nadia',
    gramPanchayat: 'Santipur Central',
    crop: 'Aman Paddy',
    totalAreaHa: 1450,
    chfBaseline: 0.76,
    currentChf: 0.71,
    deviation: -0.05,
    affectedAreaHa: 120,
    riskState: 'LOW',
    weatherEventStatus: 'Optimal Monsoon Inflow',
    claimStatus: 'Active Monitoring',
    potentialPayoutInr: 1840000,
    boundaryCoordinates: [
      [88.420, 23.245], [88.455, 23.248], [88.460, 23.210], [88.415, 23.212], [88.420, 23.245]
    ]
  },
  {
    id: 'iu-nadia-02',
    code: 'WB-NAD-002',
    name: 'Ranaghat East Unit',
    district: 'Nadia',
    crop: 'Potato',
    gramPanchayat: 'Ranaghat East',
    totalAreaHa: 980,
    chfBaseline: 0.74,
    currentChf: 0.52, // Below trigger 0.55!
    deviation: -0.22,
    affectedAreaHa: 410,
    riskState: 'CLAIM_TRIGGERED',
    weatherEventStatus: 'Flash Waterlogging Alert',
    claimStatus: 'Automatic Claim Filing Triggered',
    potentialPayoutInr: 6420000,
    boundaryCoordinates: [
      [88.540, 23.160], [88.590, 23.165], [88.595, 23.120], [88.535, 23.125], [88.540, 23.160]
    ]
  },
  {
    id: 'iu-burdwan-01',
    code: 'WB-BUR-001',
    name: 'Kalna North Ag-Belt',
    district: 'Burdwan',
    crop: 'Aman Paddy',
    gramPanchayat: 'Kalna North',
    totalAreaHa: 2100,
    chfBaseline: 0.78,
    currentChf: 0.68,
    deviation: -0.10,
    affectedAreaHa: 340,
    riskState: 'MODERATE',
    weatherEventStatus: 'Intermittent Dry Spell',
    claimStatus: 'Under Observation',
    potentialPayoutInr: 3200000,
    boundaryCoordinates: [
      [88.350, 23.210], [88.390, 23.220], [88.400, 23.170], [88.340, 23.180], [88.350, 23.210]
    ]
  },
  {
    id: 'iu-hooghly-01',
    code: 'WB-HGY-001',
    name: 'Tarakeswar Tuber Basin',
    district: 'Hooghly',
    crop: 'Potato',
    gramPanchayat: 'Tarakeswar South',
    totalAreaHa: 1320,
    chfBaseline: 0.75,
    currentChf: 0.77,
    deviation: 0.02,
    affectedAreaHa: 45,
    riskState: 'NORMAL',
    weatherEventStatus: 'Stable Microclimate',
    claimStatus: 'No Claims',
    potentialPayoutInr: 0,
    boundaryCoordinates: [
      [88.010, 22.870], [88.050, 22.880], [88.060, 22.830], [88.005, 22.840], [88.010, 22.870]
    ]
  },
  {
    id: 'iu-murshid-01',
    code: 'WB-MUR-001',
    name: 'Berhampore Jute Corridor',
    district: 'Murshidabad',
    crop: 'Jute',
    gramPanchayat: 'Berhampore Rural',
    totalAreaHa: 1850,
    chfBaseline: 0.72,
    currentChf: 0.58,
    deviation: -0.14,
    affectedAreaHa: 520,
    riskState: 'HIGH',
    weatherEventStatus: 'Precipitation Deficit 38%',
    claimStatus: 'Loss Appraisal Initiated',
    potentialPayoutInr: 4890000,
    boundaryCoordinates: [
      [88.240, 24.080], [88.290, 24.090], [88.300, 24.040], [88.230, 24.050], [88.240, 24.080]
    ]
  }
];

// 2. Generate 25 Farmers
const BENGAL_FIRST_NAMES = ['Subhash', 'Animesh', 'Debabrata', 'Partha', 'Tanmoy', 'Bikash', 'Somen', 'Kalyan', 'Tapas', 'Manas', 'Arup', 'Pradip', 'Shyamal', 'Sanjoy', 'Rathindra', 'Nirmal', 'Aloke', 'Chandan', 'Deepak', 'Tarun', 'Sourav', 'Balaram', 'Goutam', 'Samir', 'Haradhan'];
const BENGAL_LAST_NAMES = ['Biswas', 'Mondal', 'Ghosh', 'Chatterjee', 'Mukherjee', 'Sarkar', 'Bhattacharya', 'Roy', 'Dey', 'Pal', 'Kundu', 'Haldar', 'Bhowmick', 'Samanta', 'Das'];

export const SEED_FARMERS: Farmer[] = Array.from({ length: 25 }).map((_, idx) => {
  const firstName = BENGAL_FIRST_NAMES[idx % BENGAL_FIRST_NAMES.length];
  const lastName = BENGAL_LAST_NAMES[idx % BENGAL_LAST_NAMES.length];
  const district = DISTRICTS[idx % DISTRICTS.length];
  return {
    id: `farmer-${idx + 1}`,
    name: `${firstName} ${lastName}`,
    phone: `+91 9831${(100000 + idx * 3719).toString().slice(0, 6)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@agrisure-wb.in`,
    district,
    gramPanchayat: district === 'Nadia' ? 'Santipur Central' : `${district} Sadar GP`,
    bankAccountMask: `•••• •••• ${8420 + idx}`,
    ifscCode: `PUNB0${(120000 + idx * 111).toString().slice(0, 6)}`,
    farmsCount: (idx % 2) + 1,
    totalAcreage: parseFloat((1.2 + (idx * 0.4) % 3.5).toFixed(1)),
  };
});

// Primary Demo Farm: Plot #204 Nadia District Aman Paddy
export const PRIMARY_DEMO_FARM: Farm = {
  id: 'farm-plot-204',
  farmerId: 'farmer-1',
  farmerName: 'Subhash Biswas',
  insuranceUnitId: 'iu-nadia-01',
  insuranceUnitCode: 'WB-NAD-001',
  plotNumber: 'Plot #204',
  name: 'Plot #204 - Nadia Greenfield',
  district: 'Nadia',
  village: 'Baganchra',
  gramPanchayat: 'Santipur Central',
  acreage: 2.8,
  currentCrop: 'Aman Paddy',
  season: 'Kharif 2026',
  sowingDate: '2026-06-12',
  expectedHarvest: '2026-11-20',
  currentChf: 0.71,
  chfBaseline: 0.76,
  soilMoisturePct: 58.0,
  riskLevel: 'LOW',
  centroid: { lat: 23.2384, lng: 88.4312 },
  boundaryCoordinates: [
    [88.4300, 23.2370], [88.4335, 23.2372], [88.4330, 23.2405], [88.4295, 23.2400], [88.4300, 23.2370]
  ],
  activePolicyId: 'pol-nadia-204',
  sumInsured: 145000,
  lastSatelliteDate: '2026-09-14',
  ndvi: 0.68,
  lswi: 0.38,
  vhBackscatterDb: -16.4
};

// 3. Generate 40 Farms across the 4 districts
export const SEED_FARMS: Farm[] = [
  PRIMARY_DEMO_FARM,
  ...Array.from({ length: 39 }).map((_, idx) => {
    const plotNum = 205 + idx;
    const district = DISTRICTS[(idx + 1) % DISTRICTS.length];
    const crop = CROPS[idx % CROPS.length];
    const farmer = SEED_FARMERS[(idx + 1) % SEED_FARMERS.length];
    
    // Lat / Lng centers for districts
    const centers: Record<string, { lat: number; lng: number }> = {
      Nadia: { lat: 23.23, lng: 88.43 },
      Burdwan: { lat: 23.25, lng: 88.37 },
      Hooghly: { lat: 22.86, lng: 88.03 },
      Murshidabad: { lat: 24.07, lng: 88.26 }
    };
    const c = centers[district];
    const offsetLat = ((idx * 17) % 50 - 25) * 0.003;
    const offsetLng = ((idx * 23) % 50 - 25) * 0.003;
    const lat = parseFloat((c.lat + offsetLat).toFixed(4));
    const lng = parseFloat((c.lng + offsetLng).toFixed(4));

    const chf = parseFloat((0.48 + ((idx * 7) % 36) * 0.01).toFixed(2));
    const baseline = 0.74;
    let risk: Farm['riskLevel'] = 'NORMAL';
    if (chf < 0.55) risk = 'CLAIM_TRIGGERED';
    else if (chf < 0.62) risk = 'HIGH';
    else if (chf < 0.70) risk = 'MODERATE';
    else risk = 'LOW';

    return {
      id: `farm-plot-${plotNum}`,
      farmerId: farmer.id,
      farmerName: farmer.name,
      insuranceUnitId: district === 'Nadia' ? 'iu-nadia-01' : (district === 'Burdwan' ? 'iu-burdwan-01' : 'iu-hooghly-01'),
      insuranceUnitCode: district === 'Nadia' ? 'WB-NAD-001' : (district === 'Burdwan' ? 'WB-BUR-001' : 'WB-HGY-001'),
      plotNumber: `Plot #${plotNum}`,
      name: `Plot #${plotNum} - ${district} Agrisector`,
      district,
      village: `${district} Agrisite-${(idx % 6) + 1}`,
      gramPanchayat: farmer.gramPanchayat,
      acreage: parseFloat((1.1 + (idx * 0.35) % 4.2).toFixed(1)),
      currentCrop: crop,
      season: 'Kharif 2026',
      sowingDate: '2026-06-18',
      expectedHarvest: '2026-11-25',
      currentChf: chf,
      chfBaseline: baseline,
      soilMoisturePct: Math.round(42 + ((idx * 11) % 36)),
      riskLevel: risk,
      centroid: { lat, lng },
      boundaryCoordinates: [
        [lng - 0.0015, lat - 0.0015],
        [lng + 0.0015, lat - 0.0015],
        [lng + 0.0015, lat + 0.0015],
        [lng - 0.0015, lat + 0.0015],
        [lng - 0.0015, lat - 0.0015],
      ],
      activePolicyId: `pol-${plotNum}`,
      sumInsured: Math.round(90000 + (idx * 4500)),
      lastSatelliteDate: '2026-09-14',
      ndvi: parseFloat((chf * 0.94).toFixed(2)),
      lswi: parseFloat((chf * 0.52).toFixed(2)),
      vhBackscatterDb: parseFloat((-21 + chf * 7).toFixed(1))
    };
  })
];

// 4. IoT Devices (20 devices)
export const SEED_IOT_DEVICES: IoTDevice[] = Array.from({ length: 20 }).map((_, idx) => {
  const farm = SEED_FARMS[idx % SEED_FARMS.length];
  const isProbe = idx % 2 === 0;
  return {
    id: `iot-dev-${idx + 1}`,
    deviceUid: `ESP32-AG-${1000 + idx}`,
    farmId: farm.id,
    farmPlot: farm.plotNumber,
    deviceType: isProbe ? 'ESP32_MOISTURE_PROBE' : (idx % 4 === 1 ? 'DHT22_WEATHER' : 'PUMP_RELAY'),
    name: `${isProbe ? 'RootZone Moisture Probe' : (idx % 4 === 1 ? 'Microclimate DHT22 Unit' : 'Solar Pump Relay Controller')} #${idx + 1}`,
    hardwareModel: isProbe ? 'ESP32-SOIL-RS485' : 'ESP32-RLY-PRO',
    batteryPct: Math.round(82 + (idx * 3) % 18),
    signalDbm: -60 - ((idx * 4) % 25),
    isActive: true,
    pumpStatus: idx % 4 === 3 ? (idx % 2 === 0 ? 'ACTIVE' : 'IDLE') : undefined,
    lastHeartbeat: 'Just now (3s)',
    currentReading: {
      soilMoisturePct: farm.soilMoisturePct,
      temperatureC: parseFloat((28.5 + (idx % 5) * 0.8).toFixed(1)),
      humidityPct: Math.round(68 + (idx % 6) * 3),
      rainfallMm: idx === 3 ? 14.5 : 0.0,
      soilResistanceOhm: 1250 - farm.soilMoisturePct * 10
    }
  };
});

// 5. Policies
export const SEED_POLICIES: Policy[] = [
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
  })),
  {
    id: 'pol-app-subhash-2026',
    policyNumber: 'POL-WB-2026-APP-4012',
    farmerId: 'farmer-1',
    farmerName: 'Subhash Biswas',
    farmId: 'farm-plot-204',
    farmPlot: 'Plot #204',
    insuranceUnitCode: 'WB-NAD-001',
    crop: 'Boro Winter Paddy 2026-27',
    sumInsured: 55000,
    premiumAmount: 2750,
    subsidyAmount: 2200,
    farmerShare: 550,
    triggerChf: 0.55,
    startDate: '2026-11-01',
    endDate: '2027-04-30',
    status: 'PENDING_APPROVAL',
    submittedAt: '2026-09-16T11:20:00Z',
    underwriterNotes: 'Awaiting spatial NDVI baseline verification for upcoming Boro season cycle'
  },
  {
    id: 'pol-app-ananya-2026',
    policyNumber: 'POL-WB-2026-APP-4019',
    farmerId: 'farmer-4',
    farmerName: 'Ananya Mukherjee',
    farmId: 'farm-plot-208',
    farmPlot: 'Plot #208',
    insuranceUnitCode: 'WB-HOO-001',
    crop: 'Early Mustard Seed',
    sumInsured: 42000,
    premiumAmount: 2100,
    subsidyAmount: 1680,
    farmerShare: 420,
    triggerChf: 0.58,
    startDate: '2026-10-15',
    endDate: '2027-02-28',
    status: 'PENDING_APPROVAL',
    submittedAt: '2026-09-16T14:45:00Z',
    underwriterNotes: 'New cover application. Sensor telemetry calibrated.'
  }
];

// Primary Demo Claim: CLM-2026-084 (Plot #212 Ranaghat / Nadia - CHF drop to 0.49 triggered automatically)
export const PRIMARY_DEMO_CLAIM: Claim = {
  id: 'claim-clm-084',
  claimNumber: 'CLM-2026-084',
  policyNumber: 'POL-WB-2026-3008',
  farmerId: 'farmer-8',
  farmerName: 'Kalyan Dey',
  farmId: 'farm-plot-212',
  plotNumber: 'Plot #212',
  insuranceUnitCode: 'WB-NAD-002',
  district: 'Nadia',
  crop: 'Potato',
  triggerType: 'CHF_DROP',
  triggerDate: '2026-09-12',
  chfMeasured: 0.49,
  chfBaseline: 0.74,
  lossFraction: 0.338,
  claimAmount: 42800,
  status: 'VERIFIED',
  payoutRef: 'PAY-WB-2026-9084',
  createdAt: '2026-09-12T14:30:00Z',
  updatedAt: '2026-09-15T09:15:00Z',
  evidence: {
    policy: {
      policyNumber: 'POL-WB-2026-3008',
      sumInsured: 126000,
      coverageWindow: '2026-06-01 to 2026-11-30',
      triggerChf: 0.55,
      verifiedSignature: 'SHA256:8b0f491c2847a98ec512df8872f9'
    },
    satelliteEvidence: {
      sceneId: 'S2A_MSIL2A_20260912T044651_N0500_R119_T45QXF',
      satellite: 'Sentinel-2A & Sentinel-1B Synergy',
      acquisitionDate: '2026-09-12 04:46 UTC',
      ndviDropPct: -31.4,
      vhAnomalydB: -4.8,
      cloudFreeScene: true
    },
    weatherEvidence: {
      stationId: 'WB-AWS-NAD-04',
      recordedPrecipitationMm: 142.8,
      historicalDeviationPct: +88.4,
      consecutiveDryDays: 0,
      heatIndexMaxC: 34.2
    },
    iotEvidence: {
      deviceUid: 'ESP32-AG-1008',
      averageRootMoisturePct: 88.5, // Waterlogging
      soilResistanceOhm: 420,
      pumpUptimeHours: 0.0
    },
    groundTruth: {
      fieldAgentName: 'Prabir Bhattacharya (ID: FA-WB-441)',
      surveyDate: '2026-09-13',
      observedStuntingPct: 35.0,
      gpsVerified: true,
      verificationNotes: 'Severe waterlogging with collar rot symptoms observed following unseasonal depression downpour.'
    },
    chfCalculation: {
      formula: 'CHF = sum(w_j * r_ij) with Shannon Entropy Weights',
      shannonWeights: {
        ndvi: 0.22,
        lswi: 0.18,
        vh: 0.24,
        fapar: 0.16,
        precipitation: 0.20
      },
      rawIndices: {
        ndvi: 0.44,
        lswi: 0.56,
        vh: -21.4,
        fapar: 0.39,
        precipitation: 142.8
      },
      calculatedChf: 0.49
    },
    baseline: {
      historicalNormalChf: 0.74,
      fourYearAverage: [0.73, 0.75, 0.76, 0.72],
      deviationSigma: -2.34
    },
    correctionFactor: {
      managementBiasAdjustment: 0.02,
      terminalEventAdjustment: 0.00,
      finalLossRatio: 0.338
    },
    decisionRule: {
      triggerCondition: 'CHF <= 0.55 FOR >= 5 CONSECUTIVE DAYS',
      evaluationResult: 'TRIGGER_MET',
      payoutTierPct: 34.0
    },
    auditTrail: [
      { step: 'Parametric Threshold Breached', timestamp: '2026-09-12 14:30 UTC', operatorOrSystem: 'Engine:CHF-Sentinel-Processor', hashSha256: '9f83...bc41' },
      { step: 'IoT Telemetry Cross-Verification', timestamp: '2026-09-12 14:32 UTC', operatorOrSystem: 'System:IoT-CrossValidator', hashSha256: '3e12...99a0' },
      { step: 'Field Agent Geotagged Ground Truth Attached', timestamp: '2026-09-13 11:20 UTC', operatorOrSystem: 'Agent:Prabir Bhattacharya', hashSha256: 'a784...ee22' },
      { step: 'Underwriting Verification Signoff', timestamp: '2026-09-14 16:45 UTC', operatorOrSystem: 'Underwriter:Dr. S. Sen (Chief Actuary)', hashSha256: 'f211...77d3' }
    ],
    payout: {
      amountInr: 42800,
      beneficiaryAccount: '•••• •••• 8428',
      ifsc: 'PUNB0120888',
      bankReferenceId: 'NEFT-WB-202609-883492',
      settlementTimestamp: 'Scheduled Batch 18:00 IST'
    }
  }
};

// 6. 30 Claims across the system
export const SEED_CLAIMS: Claim[] = [
  PRIMARY_DEMO_CLAIM,
  ...Array.from({ length: 29 }).map((_, idx) => {
    const claimNum = 85 + idx;
    const farm = SEED_FARMS[(idx + 2) % SEED_FARMS.length];
    const farmer = SEED_FARMERS[(idx + 2) % SEED_FARMERS.length];
    const chf = parseFloat((0.44 + (idx % 12) * 0.01).toFixed(2));
    const isApproved = idx % 3 === 0;
    const isDisbursed = idx % 4 === 0;
    const status: Claim['status'] = isDisbursed ? 'DISBURSED' : (isApproved ? 'APPROVED' : (idx % 2 === 0 ? 'VERIFIED' : 'PENDING'));
    const lossFraction = parseFloat((0.25 + (idx % 5) * 0.05).toFixed(3));
    const claimAmount = Math.round(farm.sumInsured * lossFraction);

    return {
      id: `claim-clm-${claimNum}`,
      claimNumber: `CLM-2026-0${claimNum}`,
      policyNumber: farm.activePolicyId,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmId: farm.id,
      plotNumber: farm.plotNumber,
      insuranceUnitCode: farm.insuranceUnitCode,
      district: farm.district,
      crop: farm.currentCrop,
      triggerType: idx % 2 === 0 ? 'CHF_DROP' : 'EXCESS_RAINFALL',
      triggerDate: `2026-09-${(idx % 12) + 1}`,
      chfMeasured: chf,
      chfBaseline: farm.chfBaseline,
      lossFraction,
      claimAmount,
      status,
      payoutRef: isDisbursed ? `PAY-WB-2026-90${claimNum}` : undefined,
      createdAt: `2026-09-${(idx % 12) + 1}T10:00:00Z`,
      updatedAt: `2026-09-${(idx % 12) + 3}T15:00:00Z`,
      evidence: {
        ...PRIMARY_DEMO_CLAIM.evidence,
        policy: {
          ...PRIMARY_DEMO_CLAIM.evidence.policy,
          sumInsured: farm.sumInsured,
        },
        payout: {
          ...PRIMARY_DEMO_CLAIM.evidence.payout,
          amountInr: claimAmount,
          bankReferenceId: `NEFT-WB-202609-${880000 + claimNum}`
        }
      }
    };
  })
];

// 7. 15 Payouts
export const SEED_PAYOUTS: Payout[] = Array.from({ length: 15 }).map((_, idx) => {
  const claim = SEED_CLAIMS[idx];
  const statuses: Payout['status'][] = ['SUCCESSFUL', 'PROCESSING', 'PENDING', 'SUCCESSFUL', 'FAILED'];
  const status = statuses[idx % statuses.length];
  return {
    id: `payout-${idx + 1}`,
    payoutRef: `PAY-WB-2026-${9080 + idx}`,
    claimId: claim.id,
    claimNumber: claim.claimNumber,
    farmerName: claim.farmerName,
    crop: claim.crop,
    district: claim.district,
    amount: claim.claimAmount,
    bankRefId: `NEFT-WB-202609-${883490 + idx}`,
    beneficiaryMask: `•••• •••• ${8420 + idx}`,
    ifscCode: `PUNB0${(120000 + idx * 111).toString().slice(0, 6)}`,
    status,
    timeline: {
      weatherEvent: '2026-09-08 (Verified)',
      satelliteVerification: '2026-09-09 (Sentinel-2A Passed)',
      chfCalculation: '2026-09-10 (Entropy score: 0.49)',
      thresholdTest: '2026-09-10 (Breach confirmed < 0.55)',
      claimQualification: '2026-09-11 (Loss evaluated)',
      payoutInitiation: '2026-09-12 (Automated clearing dispatch)',
      bankConfirmation: status === 'SUCCESSFUL' ? '2026-09-13 (RBI NEFT Settlement ack)' : (status === 'FAILED' ? '2026-09-13 (IFSC Mismatch Reject)' : 'Pending Bank Gateway')
    },
    createdAt: '2026-09-12T10:00:00Z',
    settledAt: status === 'SUCCESSFUL' ? '2026-09-13T16:22:00Z' : undefined
  };
});

// 8. 50 Alerts
export const SEED_ALERTS: Alert[] = Array.from({ length: 50 }).map((_, idx) => {
  const farm = SEED_FARMS[idx % SEED_FARMS.length];
  const types = [
    { title: 'Root Moisture Deficit Detected', desc: 'Moisture probe measured 36% volumetric water content. Recommended micro-irrigation pulse.', sev: 'WARNING', src: 'IOT' },
    { title: 'Radar Scatter Depolarization Anomaly', desc: 'Sentinel-1 VH backscatter drop of -3.2 dB over 6 days indicates canopy density reduction.', sev: 'CRITICAL', src: 'SATELLITE' },
    { title: 'Heavy Rainfall Depression Advisory', desc: 'Regional AWS forecasts > 85mm precipitation over the next 48 hours. Secure drainage canals.', sev: 'WARNING', src: 'WEATHER' },
    { title: 'Foliar Blight Signature Spotted', desc: 'Computer vision analysis flagged 88% confidence Early Blight pattern on field camera #2.', sev: 'CRITICAL', src: 'DISEASE_AI' },
    { title: 'Parametric Policy Qualification Notice', desc: 'Composite CHF Index dropped below seasonal tier threshold. Auto-claim registered.', sev: 'CRITICAL', src: 'SATELLITE' }
  ];
  const item = types[idx % types.length];
  return {
    id: `alert-${idx + 1}`,
    farmId: farm.id,
    farmPlot: farm.plotNumber,
    severity: item.sev as Alert['severity'],
    title: item.title,
    description: item.desc,
    source: item.src as Alert['source'],
    actionLink: `/farmer/farms/${farm.id}`,
    actionText: 'Review Evidence',
    timestamp: `${(idx % 14) + 1}h ago`,
    isRead: idx > 15
  };
});

// 9. Interventions
export const SEED_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-1',
    farmId: 'farm-plot-204',
    plotNumber: 'Plot #204',
    title: 'Micro-irrigation cycle: 45 min drip pulse',
    category: 'IRRIGATION',
    status: 'COMPLETED',
    actuatedBy: 'AUTOMATED_IOT',
    notes: 'Triggered automatically via ESP32 soil moisture threshold < 45%. Pump Relay active for 45 min.',
    date: '2026-09-14 06:30 IST'
  },
  {
    id: 'int-2',
    farmId: 'farm-plot-204',
    plotNumber: 'Plot #204',
    title: 'Precision Fertigation: N-P-K (18-4-12) variable dose',
    category: 'FERTIGATION',
    status: 'COMPLETED',
    actuatedBy: 'AGRONOMIC_ADVISORY',
    notes: 'Prescribed by GA-PSO algorithm targeting tillering vegetative surge.',
    date: '2026-09-10 09:15 IST'
  },
  {
    id: 'int-3',
    farmId: 'farm-plot-204',
    plotNumber: 'Plot #204',
    title: 'Prophylactic Trichoderma foliar spray',
    category: 'SPRAY',
    status: 'SCHEDULED',
    actuatedBy: 'FARMER_MANUAL',
    notes: 'Preventive measure against brown spot during high humidity window.',
    date: '2026-09-18 07:00 IST'
  }
];

// 10. Audit Logs
export const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-101',
    timestamp: '2026-09-15 10:14:22 UTC',
    entityType: 'CLAIM',
    entityId: 'CLM-2026-084',
    action: 'PARAMETRIC_EVALUATION_PASSED',
    actor: 'CHF-Automated-Engine-v2.4',
    sceneId: 'S2A_MSIL2A_20260912',
    satelliteSource: 'Sentinel-2A MSI / Sentinel-1B SAR',
    acquisitionTime: '2026-09-12 04:46 UTC',
    weatherSource: 'IMD AWS Station 4208 (v2.1)',
    modelVersion: 'CropYield-CHF-v2.4',
    chfEngineVersion: 'Entropy-Norm-v2.4',
    baselineVersion: 'Nadia-Aman-4Yr-Norm-2026',
    iotReadings: 'SoilMoisture=88.5%, R=420ohm',
    groundEvidence: 'FA-WB-441 GPS (23.161, 88.542)',
    decisionRule: 'CHF <= 0.55 THRESHOLD TRIGGER',
    bankReference: 'NEFT-WB-202609-883492',
    hashSha256: '9f83a42cbe8192a7493d8fb654128f1190bc1294817a02c8942b012354f9bc41',
    verificationStatus: 'VALID_CHAIN'
  },
  {
    id: 'aud-102',
    timestamp: '2026-09-14 16:45:10 UTC',
    entityType: 'PAYOUT',
    entityId: 'PAY-WB-2026-9084',
    action: 'PAYOUT_DISPATCH_AUTHORIZED',
    actor: 'Underwriter:Dr. S. Sen (Chief Actuary)',
    sceneId: 'S2A_MSIL2A_20260912',
    satelliteSource: 'Sentinel-2A',
    acquisitionTime: '2026-09-12 04:46 UTC',
    decisionRule: 'Approved per Loss Ratio 0.338',
    bankReference: 'NEFT-WB-202609-883492',
    hashSha256: 'a127f884210ecba1950482da8b7468194481028751992043681423859102431f',
    verificationStatus: 'VALID_CHAIN'
  },
  {
    id: 'aud-103',
    timestamp: '2026-09-13 08:30:00 UTC',
    entityType: 'IOT',
    entityId: 'ESP32-AG-1008',
    action: 'WATERLOGGING_ANOMALY_LOGGED',
    actor: 'IoT-Telemetry-Stream-Daemon',
    iotReadings: 'VWC=88.5%, Temp=29.2C, Rain=142.8mm',
    hashSha256: '3e129aa719b02448375621804291845182947192048571930491823940192847',
    verificationStatus: 'VALID_CHAIN'
  }
];
