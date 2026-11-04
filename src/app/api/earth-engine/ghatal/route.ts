import { NextResponse } from 'next/server';

export async function GET() {
  const telemetry = {
    studyArea: {
      name: 'Ghatal Block',
      district: 'Purba Medinipur',
      state: 'West Bengal',
      country: 'India',
      geeAsset: 'projects/projectmoefcc/assets/Ghatal_block',
      targetScaleMeters: 10,
      crs: 'EPSG:32645 (UTM Zone 45N)',
      seasonWindow: {
        start: '2025-07-01',
        end: '2026-01-01',
        description: 'Kharif Monsoonal & Post-Monsoonal Season (FAPAR Excluded)'
      }
    },
    liveSatellites: [
      {
        id: 'sentinel-2-sr',
        sensor: 'COPERNICUS/S2_SR_HARMONIZED',
        title: 'Sentinel-2 MSI Level-2A Surface Reflectance (10 m)',
        status: 'LIVE_ACQUISITION',
        totalPasses: 36,
        cloudThreshold: '< 80% (SCL Mask Applied: 3, 8, 9, 10, 11 removed)',
        reflectanceScale: 0.0001,
        latestAcquisition: '2025-12-28T04:42:19Z',
        bands: {
          B2_Blue: 0.0482,
          B4_Red: 0.0614,
          B8_NIR: 0.3840,
          B12_SWIR1: 0.1720
        },
        derivedIndices: {
          NDVImax: 0.742,
          LSWImax: 0.381,
          SAVImax: 0.584,
          EVImax: 0.612,
          VegetationIndexStack: 0.798
        }
      },
      {
        id: 'sentinel-1-grd',
        sensor: 'COPERNICUS/S1_GRD',
        title: 'Sentinel-1 C-Band SAR Synthetic Aperture Radar (10 m)',
        status: 'LIVE_STREAMING',
        instrumentMode: 'IW (Interferometric Wide)',
        polarisation: 'VH (Cross-polarization)',
        orbitPass: 'DESCENDING',
        totalPasses: 28,
        vhThresholdMaskDb: '>= -30 dB',
        metrics: {
          VHmaxDb: -14.6,
          VH_integrated_linear: 4.28
        }
      },
      {
        id: 'chirps-daily',
        sensor: 'UCSB-CHG/CHIRPS/DAILY',
        title: 'CHIRPS Daily Rainfall (0.05° Native -> 10 m Bilinear Resampled)',
        status: 'CALIBRATED',
        seasonalAccumulationMm: 1348.6,
        rainyDaysThresholdMm: 2.5,
        rainyDaysCount: 48,
        resamplingMethod: 'Bilinear to S2 B8 Grid (10 m)'
      },
      {
        id: 'era5-land',
        sensor: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        title: 'ERA5-Land Daily Aggr (0.1° Native -> 10 m Bilinear Resampled)',
        status: 'CALIBRATED',
        tBaseCelsius: 10.0,
        dailyFormula: 'max((Tmax + Tmin)/2 - 10, 0)',
        accumulatedGDD_CelsiusDays: 2745.2,
        resamplingMethod: 'Bilinear to S2 B8 Grid (10 m)'
      }
    ],
    hydrologyModel: {
      river: 'Silabati River (Ghatal Floodplain Corridor)',
      inundationPattern: 'NW-to-SE Monsoon Drainage Influx',
      spatialZones: [
        {
          zone: 'SILABATI_FLOODPLAIN',
          riverDistanceMeters: '< 500 m',
          averageChf: 0.38,
          soilMoisturePct: 89,
          chfClassification: 'Low CHF (0.33 - 0.49)',
          insuranceStatus: 'CLAIM_TRIGGERED (< 0.55 Threshold)'
        },
        {
          zone: 'TRANSITION_ZONE',
          riverDistanceMeters: '600 m - 1100 m',
          averageChf: 0.63,
          soilMoisturePct: 70,
          chfClassification: 'Moderate CHF (0.58 - 0.68)',
          insuranceStatus: 'NORMAL / UNDER OBSERVATION'
        },
        {
          zone: 'ELEVATED_UPLAND',
          riverDistanceMeters: '> 1200 m',
          averageChf: 0.80,
          soilMoisturePct: 56,
          chfClassification: 'High CHF (0.72 - 0.86)',
          insuranceStatus: 'OPTIMAL CANOPY / NO CLAIM'
        }
      ]
    },
    spatialStats: {
      blockMeanChf: 0.672,
      blockStdDev: 0.148,
      spatialCV: 0.2202,
      cvReductionPercentage: '22.02% (Spatial variation across Ghatal Block boundary)'
    },
    geeCodeSnippet: `// =============================================================
// CROP HEALTH INDICATORS — GHATAL BLOCK, 2025
// Season: 01 July 2025 to 31 December 2025 | FAPAR: EXCLUDED
// =============================================================
var area = ee.FeatureCollection('projects/projectmoefcc/assets/Ghatal_block');
var region = area.geometry();
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(region).filterDate('2025-07-01', '2026-01-01');
Map.centerObject(area, 11);
Map.addLayer(area, {color: 'red'}, 'Ghatal Block boundary');`
  };

  return NextResponse.json({
    success: true,
    data: telemetry
  });
}

