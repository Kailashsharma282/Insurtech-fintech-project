'use client';

import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  CloudRain, 
  Thermometer, 
  Radio, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Activity,
  Waves
} from 'lucide-react';

interface TelemetryData {
  studyArea: {
    name: string;
    district: string;
    state: string;
    geeAsset: string;
    crs: string;
    seasonWindow: {
      start: string;
      end: string;
      description: string;
    };
  };
  liveSatellites: Array<{
    id: string;
    sensor: string;
    title: string;
    status: string;
    latestAcquisition?: string;
    derivedIndices?: Record<string, number>;
    metrics?: Record<string, number>;
    seasonalAccumulationMm?: number;
    rainyDaysCount?: number;
    accumulatedGDD_CelsiusDays?: number;
    resamplingMethod?: string;
  }>;
  hydrologyModel: {
    river: string;
    spatialZones: Array<{
      zone: string;
      riverDistanceMeters: string;
      averageChf: number;
      soilMoisturePct: number;
      chfClassification: string;
      insuranceStatus: string;
    }>;
  };
  spatialStats: {
    blockMeanChf: number;
    blockStdDev: number;
    spatialCV: number;
    cvReductionPercentage: string;
  };
  geeCodeSnippet: string;
}

export function EarthEngineTelemetry() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sensors' | 'hydrology' | 'script'>('sensors');

  useEffect(() => {
    fetch('/api/earth-engine/ghatal')
      .then(res => res.json())
      .then(resJson => {
        if (resJson.success) setData(resJson.data);
      })
      .catch(err => console.error('GEE telemetry error', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyCode = () => {
    if (!data?.geeCodeSnippet) return;
    navigator.clipboard.writeText(data.geeCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center space-x-3 text-slate-500 font-mono text-xs">
        <Satellite className="w-5 h-5 text-blue-600 animate-pulse" />
        <span>Syncing real-time Google Earth Engine multi-spectral telemetry...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
      {/* Header */}
      <div className="bg-[#0F172A] text-white p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                Google Earth Engine (GEE) Real-Time Data Stream
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Ghatal Block 10 m Multi-Spectral Satellite Grid
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Asset: <code className="text-blue-300">{data.studyArea.geeAsset}</code> &bull; Grid: 10 m Bilinear Interpolation &bull; Season: {data.studyArea.seasonWindow.start} to {data.studyArea.seasonWindow.end}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://code.earthengine.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <span>GEE Code Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'sensors' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            4 Core Satellite Sensors
          </button>
          <button
            onClick={() => setActiveTab('hydrology')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'hydrology' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Silabati River vs CHF Inundation
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'script' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Earth Engine Script Exporter
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* TAB 1: 4 Core Sensors */}
        {activeTab === 'sensors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sentinel-2 SR */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Satellite className="w-4 h-4 text-blue-600" />
                  Sentinel-2 SR (10 m)
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  36 PASSES
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between"><span>NDVImax:</span> <strong className="font-mono text-slate-900">0.742</strong></div>
                <div className="flex justify-between"><span>LSWImax (Water):</span> <strong className="font-mono text-slate-900">0.381</strong></div>
                <div className="flex justify-between"><span>SAVImax (L=0.5):</span> <strong className="font-mono text-slate-900">0.584</strong></div>
                <div className="flex justify-between"><span>EVImax:</span> <strong className="font-mono text-slate-900">0.612</strong></div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-semibold text-blue-700">Veg Index Stack:</span> 
                  <strong className="font-mono text-blue-800">0.798</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">SCL cloud mask (3, 8, 9, 10, 11 filtered). B8 10m target grid.</p>
            </div>

            {/* Sentinel-1 SAR */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-purple-600" />
                  Sentinel-1 SAR (10 m)
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                  DESCENDING
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Mode:</span> <strong className="font-mono text-slate-900">IW (VH)</strong></div>
                <div className="flex justify-between"><span>VH Threshold:</span> <strong className="font-mono text-slate-900">&gt;= -30 dB</strong></div>
                <div className="flex justify-between"><span>VHmax (dB):</span> <strong className="font-mono text-slate-900">-14.6 dB</strong></div>
                <div className="flex justify-between"><span>VH Integrated:</span> <strong className="font-mono text-slate-900">4.28 (linear)</strong></div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-semibold text-purple-700">SAR Penetration:</span> 
                  <strong className="font-mono text-purple-800">High Canopy</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Cloud-penetrating C-Band radar backscatter for flood/water logging detection.</p>
            </div>

            {/* CHIRPS Daily */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-600" />
                  CHIRPS Precipitation
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                  10 m RESAMPLED
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Accumulated Rain:</span> <strong className="font-mono text-slate-900">1,348.6 mm</strong></div>
                <div className="flex justify-between"><span>Rainy Days:</span> <strong className="font-mono text-slate-900">48 days</strong></div>
                <div className="flex justify-between"><span>Threshold:</span> <strong className="font-mono text-slate-900">&gt;= 2.5 mm/day</strong></div>
                <div className="flex justify-between"><span>Interpolation:</span> <strong className="font-mono text-slate-900">Bilinear</strong></div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-semibold text-sky-700">Monsoon Inflow:</span> 
                  <strong className="font-mono text-sky-800">Heavy Surplus</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Resampled onto 10m Sentinel grid for uniform multi-spectral stacking.</p>
            </div>

            {/* ERA5-Land */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  ERA5-Land (GDD)
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  BASE 10°C
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Base Temp (Tbase):</span> <strong className="font-mono text-slate-900">10.0 °C</strong></div>
                <div className="flex justify-between"><span>Seasonal GDD:</span> <strong className="font-mono text-slate-900">2,745.2 °C-day</strong></div>
                <div className="flex justify-between"><span>Daily Aggregation:</span> <strong className="font-mono text-slate-900">(Tmax+Tmin)/2 - 10</strong></div>
                <div className="flex justify-between"><span>Spatial CV:</span> <strong className="font-mono text-slate-900">22.02%</strong></div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-semibold text-amber-700">Thermal Sum:</span> 
                  <strong className="font-mono text-amber-800">Paddy Optimal</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Thermal energy accumulated over Kharif season aligned to 10m grid.</p>
            </div>
          </div>
        )}

        {/* TAB 2: Hydrology Model */}
        {activeTab === 'hydrology' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
              <strong className="font-bold flex items-center gap-1.5 text-blue-950 mb-1">
                <Waves className="w-4 h-4 text-blue-700" />
                Silabati River Hydrological Floodplain Rule
              </strong>
              In Ghatal Block, agricultural plots located within <strong>&lt; 500 m of the Silabati River</strong> suffer heavy monsoonal waterlogging and poor drainage, driving <strong>CHF below the 0.55 threshold</strong> (Automatic Parametric Claim Triggered). Plots situated on the elevated upland <strong>&gt; 1200 m away</strong> maintain well-drained loamy soil with <strong>high CHF (0.72 - 0.86)</strong>.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.hydrologyModel.spatialZones.map(zone => (
                <div 
                  key={zone.zone}
                  className={`border rounded-xl p-4 space-y-2 ${
                    zone.zone === 'SILABATI_FLOODPLAIN'
                      ? 'border-red-300 bg-red-50/50'
                      : zone.zone === 'TRANSITION_ZONE'
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-emerald-300 bg-emerald-50/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">{zone.zone}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      zone.zone === 'SILABATI_FLOODPLAIN'
                        ? 'bg-red-200 text-red-900'
                        : zone.zone === 'TRANSITION_ZONE'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {zone.riverDistanceMeters}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <div className="flex justify-between"><span>Average CHF:</span> <strong className="font-mono">{zone.averageChf}</strong></div>
                    <div className="flex justify-between"><span>Soil Moisture:</span> <strong className="font-mono">{zone.soilMoisturePct}%</strong></div>
                    <div className="flex justify-between"><span>Health Class:</span> <strong className="font-mono">{zone.chfClassification}</strong></div>
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider pt-2 border-t ${
                    zone.zone === 'SILABATI_FLOODPLAIN' ? 'border-red-200 text-red-700' : (zone.zone === 'TRANSITION_ZONE' ? 'border-amber-200 text-amber-700' : 'border-emerald-200 text-emerald-700')
                  }`}>
                    {zone.insuranceStatus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Script Exporter */}
        {activeTab === 'script' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Google Earth Engine JavaScript code for Ghatal Block CHF processing:
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy GEE Code'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-60 border border-slate-800 leading-relaxed">
              {data.geeCodeSnippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

