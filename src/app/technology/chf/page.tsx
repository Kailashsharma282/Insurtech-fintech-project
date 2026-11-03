'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  RefreshCw,
  FileText,
  Download,
  ArrowRight
} from 'lucide-react';
import { computeGhatalChf2025, GhatalRawObservations, GHATAL_2025_BOUNDS } from '@/lib/algorithms/ghatal-chf';

export default function ChfEnginePage() {
  // Interactive observations calibrated for Ghatal Block, West Bengal (2025 Kharif season)
  const [obs, setObs] = useState<GhatalRawObservations>({
    nir: 0.44,
    red: 0.08,
    blue: 0.04,
    swir1: 0.18,
    ndviMax: 0.72,
    lswiMax: 0.38,
    saviMax: 0.54,
    eviMax: 0.58,
    vhDb: -15.4,
    vhMax: -15.4,
    vhIntegrated: 0.68,
    seasonalRainfallMm: 1280.0,
    rainyDaysCount: 62,
    growingDegreeDays: 3180.0,
  });

  const [baselineThreshold, setBaselineThreshold] = useState<number>(0.55);
  const [activeTab, setActiveTab] = useState<'overview' | 'formulas' | 'weights' | 'gee'>('overview');

  // Compute live transparent results using exact Ghatal 2025 engine
  const result = useMemo(() => {
    return computeGhatalChf2025(obs, baselineThreshold);
  }, [obs, baselineThreshold]);

  const setScenarioOptimal = () => {
    setObs({
      nir: 0.48,
      red: 0.06,
      blue: 0.03,
      swir1: 0.14,
      ndviMax: 0.78,
      lswiMax: 0.44,
      saviMax: 0.62,
      eviMax: 0.65,
      vhDb: -13.2,
      vhMax: -13.2,
      vhIntegrated: 0.82,
      seasonalRainfallMm: 1420.0,
      rainyDaysCount: 68,
      growingDegreeDays: 3250.0,
    });
  };

  const setScenarioNormal = () => {
    setObs({
      nir: 0.44,
      red: 0.08,
      blue: 0.04,
      swir1: 0.18,
      ndviMax: 0.72,
      lswiMax: 0.38,
      saviMax: 0.54,
      eviMax: 0.58,
      vhDb: -15.4,
      vhMax: -15.4,
      vhIntegrated: 0.68,
      seasonalRainfallMm: 1280.0,
      rainyDaysCount: 62,
      growingDegreeDays: 3180.0,
    });
  };

  const setScenarioFloodShock = () => {
    // Shilabati basin flood shock in Ghatal Block
    setObs({
      nir: 0.22,
      red: 0.14,
      blue: 0.06,
      swir1: 0.28,
      ndviMax: 0.42,
      lswiMax: 0.12,
      saviMax: 0.28,
      eviMax: 0.31,
      vhDb: -23.5,
      vhMax: -23.5,
      vhIntegrated: 0.34,
      seasonalRainfallMm: 1780.0, // Waterlogging shock
      rainyDaysCount: 76,
      growingDegreeDays: 2890.0,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 text-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Simple, Clean Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold mb-2">
              <span>Ghatal Block (2025 Kharif) Algorithm</span>
              <span className="font-mono">&bull; FAPAR Excluded</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Crop Health Indicators & Parametric Engine
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              10 m resolution multi-satellite pipeline combining Sentinel-2 MSI, Sentinel-1 SAR, CHIRPS rainfall, and ERA5-Land thermal dynamics with pixel-based Shannon entropy weighting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/reports/Ghatal_Block_Crop_Health_Indicators_2025_Report.pdf"
              download
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Report PDF</span>
            </a>
            <Link
              href="/farmer/insurance-validation"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors space-x-1.5"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Validation Registry</span>
            </Link>
          </div>
        </div>

        {/* Live Calculation Banner - Simple Solid Design */}
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-300 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 font-bold block">
                Composite Crop Health Factor (CHF)
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-5xl font-black text-slate-900 font-mono">
                  {result.chfScore.toFixed(3)}
                </span>
                <span 
                  className="px-2.5 py-1 rounded-md text-xs font-bold text-white uppercase"
                  style={{ backgroundColor: result.chfClass.color }}
                >
                  Class {result.chfClass.code}: {result.chfClass.label}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-mono text-slate-500 font-bold block">Parametric Trigger Threshold</span>
              <div className="text-sm font-bold text-slate-800 mt-1">
                Trigger at CHF &le; {baselineThreshold} ({result.triggerAnalysis.isTriggerBreached ? 'BREACHED' : 'SAFE'})
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {result.chfClass.parametricAction}
              </div>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-600 mr-2 w-full sm:w-auto">Preset Field Conditions:</span>
            <button
              onClick={setScenarioNormal}
              className="w-full sm:w-auto px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
            >
              🌱 Normal Baseline (CHF ~ 0.71)
            </button>
            <button
              onClick={setScenarioFloodShock}
              className="w-full sm:w-auto px-3 py-1.5 rounded-md text-xs font-bold bg-red-50 hover:bg-red-100 text-red-800 border border-red-300"
            >
              🌊 Flood / Waterlogging Shock (CHF &lt; 0.40)
            </button>
            <button
              onClick={setScenarioOptimal}
              className="w-full sm:w-auto px-3 py-1.5 rounded-md text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300"
            >
              ⭐ Optimal Peak Canopy (CHF ~ 0.83)
            </button>
          </div>
        </div>

        {/* 6 Core Input Indicators - Clean Simple Cards */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              The 6 Core Input Indicators (Shannon Entropy Weighted)
            </h2>
            <span className="text-xs text-slate-500 font-mono">Target Grid: 10 m Resolution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.entropyDetails.map((item) => (
              <div key={item.indicator} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 font-mono">{item.indicator}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    Weight: {(item.weight * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block text-[10px]">Sample Observation</span>
                    <strong className="text-sm text-slate-900">{item.rawSampleValue}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block text-[10px]">Min-Max Normalized</span>
                    <strong className="text-sm text-emerald-800">{item.normalizedValue.toFixed(3)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                  <span>Entropy E: {item.entropy.toFixed(3)}</span>
                  <span>Diversity d: {item.diversity.toFixed(3)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Sentinel & Radar Indices Breakdown */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            Complete Derived Spectral & Radar Metrics (Ghatal 2025)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">NDVI (B8, B4)</span>
              <strong className="text-sm text-slate-900">{result.indicators.ndvi}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">LSWI (B8, B12)</span>
              <strong className="text-sm text-slate-900">{result.indicators.lswi}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">SAVI (L=0.5)</span>
              <strong className="text-sm text-slate-900">{result.indicators.savi}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">EVI (B8, B4, B2)</span>
              <strong className="text-sm text-slate-900">{result.indicators.evi}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Vegetation Stack (VIS)</span>
              <strong className="text-sm text-emerald-800">{result.indicators.vegetationIndexStack}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Sentinel-1 VH Max</span>
              <strong className="text-sm text-slate-900">{result.indicators.vhMax} dB</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">VH Integrated (Linear)</span>
              <strong className="text-sm text-slate-900">{result.indicators.vhIntegrated}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Spatial CV (Max)</span>
              <strong className="text-sm text-amber-800">{result.spatialCv.cropConditionVariability}</strong>
            </div>
          </div>
        </div>

        {/* 5-Class Categorization Table */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            Provisional 5-Class Crop Health Intervals & Parametric Payout Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-3 font-bold text-slate-700">Class</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">CHF Interval</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Canopy Health State</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Parametric Insurance Action</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Indemnity Disbursed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className={result.chfClass.code === 0 ? 'bg-red-50 font-bold' : ''}>
                  <td className="py-2.5 px-3 font-mono">Class 0</td>
                  <td className="py-2.5 px-3 font-mono">[0.0 &ndash; 0.2)</td>
                  <td className="py-2.5 px-3 text-red-700">Severe Crop Stress / Total Loss</td>
                  <td className="py-2.5 px-3">Catastrophic flood or crop failure confirmed</td>
                  <td className="py-2.5 px-3 font-mono text-red-700">100% of Sum Insured</td>
                </tr>
                <tr className={result.chfClass.code === 1 ? 'bg-orange-50 font-bold' : ''}>
                  <td className="py-2.5 px-3 font-mono">Class 1</td>
                  <td className="py-2.5 px-3 font-mono">[0.2 &ndash; 0.4)</td>
                  <td className="py-2.5 px-3 text-orange-700">High Stress / Severe Damage</td>
                  <td className="py-2.5 px-3">Substantial canopy loss or prolonged inundation</td>
                  <td className="py-2.5 px-3 font-mono text-orange-700">75% of Sum Insured</td>
                </tr>
                <tr className={result.chfClass.code === 2 ? 'bg-amber-50 font-bold' : ''}>
                  <td className="py-2.5 px-3 font-mono">Class 2</td>
                  <td className="py-2.5 px-3 font-mono">[0.4 &ndash; 0.6)</td>
                  <td className="py-2.5 px-3 text-amber-700">Moderate Stress / Trigger Boundary</td>
                  <td className="py-2.5 px-3">Parametric threshold boundary (Trigger &le; 0.55)</td>
                  <td className="py-2.5 px-3 font-mono text-amber-700">40% of Sum Insured</td>
                </tr>
                <tr className={result.chfClass.code === 3 ? 'bg-emerald-50 font-bold' : ''}>
                  <td className="py-2.5 px-3 font-mono">Class 3</td>
                  <td className="py-2.5 px-3 font-mono">[0.6 &ndash; 0.8)</td>
                  <td className="py-2.5 px-3 text-emerald-800">Good / Normal Vigor</td>
                  <td className="py-2.5 px-3">Normal Aman Paddy development</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-800">0% (Safe)</td>
                </tr>
                <tr className={result.chfClass.code === 4 ? 'bg-green-50 font-bold' : ''}>
                  <td className="py-2.5 px-3 font-mono">Class 4</td>
                  <td className="py-2.5 px-3 font-mono">[0.8 &ndash; 1.0]</td>
                  <td className="py-2.5 px-3 text-emerald-900">Optimal Canopy Vigor</td>
                  <td className="py-2.5 px-3">High biomass and full grain development</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-900">0% (Safe)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Exact Mathematical Formulas Reference */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            Mathematical Equations (As Specified for Ghatal Block 2025)
          </h3>

          <div className="space-y-3 text-xs font-mono bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 font-bold">1. Sentinel-2 Normalized Indices:</span>
              <div className="text-slate-900 pl-4 mt-0.5">&bull; NDVI = (NIR - Red) / (NIR + Red)</div>
              <div className="text-slate-900 pl-4">&bull; LSWI = (NIR - SWIR1) / (NIR + SWIR1)</div>
              <div className="text-slate-900 pl-4">&bull; SAVI = 1.5 * (NIR - Red) / (NIR + Red + 0.5)  [L = 0.5]</div>
              <div className="text-slate-900 pl-4">&bull; EVI = 2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)</div>
              <div className="text-slate-900 pl-4">&bull; VIS = (SAVI_norm + EVI_norm) / 2, where X_norm = clamp((X + 1)/2, 0, 1)</div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-bold">2. Sentinel-1 Radar Backscatter:</span>
              <div className="text-slate-900 pl-4 mt-0.5">&bull; VHmax = max(VH_dB), where VH &ge; -30 dB</div>
              <div className="text-slate-900 pl-4">&bull; VH_integrated = sum(10^(VH_dB,t / 10), t=1..n)</div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-bold">3. Hydro-meteorological Aggregations:</span>
              <div className="text-slate-900 pl-4 mt-0.5">&bull; Rainfall = sum(P_t, t=1..n) [CHIRPS 0.05&deg; resampled to 10m]</div>
              <div className="text-slate-900 pl-4">&bull; RainyDays = sum(I(P_t &ge; 2.5 mm), t=1..n)</div>
              <div className="text-slate-900 pl-4">&bull; GDD = sum(max((Tmax_t + Tmin_t)/2 - 10, 0)) [ERA5-Land Tbase=10&deg;C]</div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-bold">4. Spatial Variation & Shannon Entropy Weighting:</span>
              <div className="text-slate-900 pl-4 mt-0.5">&bull; CV = stdDev / |mean|; CropConditionVariability = max(CV_NDVI, CV_LSWI, CV_VH)</div>
              <div className="text-slate-900 pl-4">&bull; X_norm = clamp((X - X_min) / (X_max - X_min), 0, 1)</div>
              <div className="text-slate-900 pl-4">&bull; p_i = x_i / sum(x_i); E_j = -sum(p_i * ln(p_i)) / ln(n)</div>
              <div className="text-slate-900 pl-4">&bull; d_j = 1 - E_j; w_j = d_j / sum(d_k)</div>
              <div className="text-slate-900 pl-4 font-bold text-emerald-800">&bull; Composite CHF = sum(w_j * X_norm_j)</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
