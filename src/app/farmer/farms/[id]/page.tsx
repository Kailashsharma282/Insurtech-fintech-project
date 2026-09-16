'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sprout, 
  MapPin, 
  Satellite, 
  Radio, 
  Droplets, 
  CloudSun, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { store } from '@/lib/db/store';
import { Farm, Alert, Intervention } from '@/lib/types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';

export default function FarmDetailsPage() {
  const params = useParams();
  const farmId = (params?.id as string) || 'farm-plot-204';
  const [farm, setFarm] = useState<Farm | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'satellite' | 'iot' | 'timeline' | 'insurance'>('overview');
  const [activeChart, setActiveChart] = useState<'CHF' | 'NDVI' | 'LSWI' | 'VH' | 'FAPAR' | 'rainfall' | 'GDD'>('CHF');

  useEffect(() => {
    const f = store.getFarmById(farmId) || store.getFarmById('farm-plot-204');
    setFarm(f || null);
  }, [farmId]);

  if (!farm) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 text-center">
        <div className="p-8 max-w-md mx-auto bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-600 font-semibold text-sm">Loading Farm Intelligence...</p>
        </div>
      </div>
    );
  }

  // 7 Charts Data across 8 bi-weekly observation dates
  const metricsData = [
    { date: '15 Jun', CHF: 0.62, NDVI: 0.32, LSWI: 0.18, VH: -22.4, FAPAR: 0.28, rainfall: 42, GDD: 180 },
    { date: '01 Jul', CHF: 0.66, NDVI: 0.44, LSWI: 0.24, VH: -20.1, FAPAR: 0.41, rainfall: 68, GDD: 385 },
    { date: '16 Jul', CHF: 0.70, NDVI: 0.55, LSWI: 0.31, VH: -18.2, FAPAR: 0.52, rainfall: 92, GDD: 590 },
    { date: '02 Aug', CHF: 0.73, NDVI: 0.64, LSWI: 0.35, VH: -16.9, FAPAR: 0.61, rainfall: 84, GDD: 810 },
    { date: '18 Aug', CHF: 0.75, NDVI: 0.71, LSWI: 0.39, VH: -15.8, FAPAR: 0.69, rainfall: 110, GDD: 1040 },
    { date: '02 Sep', CHF: 0.73, NDVI: 0.69, LSWI: 0.38, VH: -16.1, FAPAR: 0.67, rainfall: 45, GDD: 1250 },
    { date: '14 Sep', CHF: farm.currentChf, NDVI: farm.ndvi, LSWI: farm.lswi, VH: farm.vhBackscatterDb, FAPAR: parseFloat((farm.ndvi * 0.92).toFixed(2)), rainfall: 28, GDD: 1390 },
  ];

  // Timeline: Satellite observation -> stress detected -> recommendation -> intervention -> recovery
  const timelineStages = [
    { stage: '1. Satellite Observation', date: '08 Sep 04:46 UTC', desc: 'Sentinel-2A pass captured drop in near-infrared reflectance and LSWI moisture canopy.', status: 'COMPLETED' },
    { stage: '2. Stress Detected', date: '08 Sep 05:12 UTC', desc: 'Canopy water stress flagged. CHF dropped from 0.75 to 0.69. Root moisture probe confirmed 38% VWC.', status: 'COMPLETED' },
    { stage: '3. Recommendation', date: '08 Sep 05:15 UTC', desc: 'GA-PSO engine formulated 45-minute micro-irrigation drip pulse and balanced N-P-K boost.', status: 'COMPLETED' },
    { stage: '4. Intervention Actuation', date: '09 Sep 06:30 IST', desc: 'ESP32 solar pump relay actuated for 45 mins. 24,000 liters dispensed directly to root zone.', status: 'COMPLETED' },
    { stage: '5. Canopy Recovery Verified', date: '14 Sep 04:47 UTC', desc: 'Sentinel-1 SAR and Sentinel-2 pass confirmed recovery. CHF stabilized back to 0.71.', status: 'COMPLETED' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Farm Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
              <Link href="/farmer/farms" className="hover:text-emerald-700">Farms</Link>
              <span>/</span>
              <span>{farm.district} District</span>
              <span>/</span>
              <span className="text-slate-800 font-bold">{farm.plotNumber}</span>
            </div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight flex items-center space-x-3">
              <span>{farm.name}</span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {farm.riskLevel.replace('_', ' ')}
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Farmer: <strong>{farm.farmerName}</strong> &bull; Gram Panchayat: <strong>{farm.gramPanchayat}</strong> &bull; Insurance Unit: <strong>{farm.insuranceUnitCode}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/operations/iot"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#34D399] font-mono text-xs font-semibold flex items-center space-x-2"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>IoT Telemetry</span>
            </Link>
            <Link
              href="/farmer/optimization"
              className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize Nutrients</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-semibold overflow-x-auto pb-px">
          {[
            { id: 'overview', label: 'Farm Overview' },
            { id: 'satellite', label: 'Satellite Multi-Spectral' },
            { id: 'iot', label: 'IoT Probes & Hardware' },
            { id: 'timeline', label: 'Stress & Recovery Timeline' },
            { id: 'insurance', label: 'Parametric Policy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-[#10B981] text-[#059669]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview (Farm Overview, Crop Details, KPI Grid) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Crop Health Factor</span>
                <div className="text-3xl font-black text-emerald-700 mt-1">{farm.currentChf.toFixed(2)}</div>
                <span className="text-[11px] text-slate-500">Baseline: {farm.chfBaseline}</span>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Soil Root Moisture</span>
                <div className="text-3xl font-black text-blue-600 mt-1">{farm.soilMoisturePct}%</div>
                <span className="text-[11px] text-slate-500">Volumetric Water Content</span>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Optical NDVI</span>
                <div className="text-3xl font-black text-slate-900 mt-1">{farm.ndvi}</div>
                <span className="text-[11px] text-slate-500">Sentinel-2A (10m BOA)</span>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Radar VH Backscatter</span>
                <div className="text-3xl font-black text-purple-600 mt-1">{farm.vhBackscatterDb} dB</div>
                <span className="text-[11px] text-slate-500">Sentinel-1 C-SAR Dual-Pol</span>
              </div>
            </div>

            {/* Farm & Crop Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                <h3 className="font-bold text-base text-[#0F172A] border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <Sprout className="w-4 h-4 text-[#059669]" />
                  <span>Crop Phenology & Cultivation Specifications</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Crop Species</span>
                    <strong className="text-slate-900 text-sm">{farm.currentCrop}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Plot Size / Area</span>
                    <strong className="text-slate-900 text-sm">{farm.acreage} Hectares</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sowing Date</span>
                    <strong className="text-slate-900">{farm.sowingDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Expected Harvest</span>
                    <strong className="text-slate-900">{farm.expectedHarvest}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Growth Stage</span>
                    <strong className="text-emerald-700">Tillering / Panicle Initiation</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Irrigation Setup</span>
                    <strong className="text-slate-900">Solar Sub-Surface Drip (ESP32)</strong>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                <h3 className="font-bold text-base text-[#0F172A] border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#059669]" />
                  <span>Cadastral & Spatial Boundary Specs</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">District / Taluk</span>
                    <strong className="text-slate-900 text-sm">{farm.district}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Village / Mouza</span>
                    <strong className="text-slate-900 text-sm">{farm.village}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Centroid GPS Coordinates</span>
                    <strong className="text-slate-900 font-mono">{farm.centroid.lat}, {farm.centroid.lng}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Insurance Unit Code</span>
                    <strong className="text-slate-900 font-mono">{farm.insuranceUnitCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Soil Series Classification</span>
                    <strong className="text-slate-900">Gangetic Alluvial Silt-Clay</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Latest Scene Acquisition</span>
                    <strong className="text-slate-900">{farm.lastSatelliteDate}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Satellite Multi-Spectral (All 7 Charts required by Section 8) */}
        {activeTab === 'satellite' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">
                  Multi-Spectral & Radar Telemetry Curves (7 Charts)
                </h3>
                <p className="text-xs text-slate-500">
                  Select a variable to inspect temporal bi-weekly observation profiles across the crop cycle.
                </p>
              </div>

              {/* 7 Chart Selector Tabs */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {(['CHF', 'NDVI', 'LSWI', 'VH', 'FAPAR', 'rainfall', 'GDD'] as const).map((chartKey) => (
                  <button
                    key={chartKey}
                    onClick={() => setActiveChart(chartKey)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeChart === chartKey 
                        ? 'bg-[#071511] text-[#34D399]' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {chartKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Selected Chart */}
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  
                  {activeChart === 'CHF' && (
                    <Line type="monotone" dataKey="CHF" name="Crop Health Factor (CHF)" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                  )}
                  {activeChart === 'NDVI' && (
                    <Line type="monotone" dataKey="NDVI" name="Normalized Difference Vegetation Index (NDVI)" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} />
                  )}
                  {activeChart === 'LSWI' && (
                    <Line type="monotone" dataKey="LSWI" name="Land Surface Water Index (LSWI)" stroke="#0284C7" strokeWidth={3} dot={{ r: 5 }} />
                  )}
                  {activeChart === 'VH' && (
                    <Line type="monotone" dataKey="VH" name="Sentinel-1 VH Backscatter (dB)" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} />
                  )}
                  {activeChart === 'FAPAR' && (
                    <Line type="monotone" dataKey="FAPAR" name="Fraction of Absorbed PAR (FAPAR)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 5 }} />
                  )}
                  {activeChart === 'rainfall' && (
                    <Line type="monotone" dataKey="rainfall" name="Bi-Weekly Rainfall (mm)" stroke="#38BDF8" strokeWidth={3} dot={{ r: 5 }} />
                  )}
                  {activeChart === 'GDD' && (
                    <Line type="monotone" dataKey="GDD" name="Growing Degree Days (GDD)" stroke="#E11D48" strokeWidth={3} dot={{ r: 5 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-800 mb-0.5">Optical Pass (Sentinel-2A)</strong>
                <span className="text-slate-500">10m Ground Sample Distance. Red (B4) and Near-Infrared (B8) for chlorophyll vigour.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-800 mb-0.5">Radar Pass (Sentinel-1 SAR)</strong>
                <span className="text-slate-500">C-band cross-polarization (VH) volumetric backscatter insensitive to cloud coverage.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-800 mb-0.5">Thermal & Microclimate</strong>
                <span className="text-slate-500">Accumulated thermal units (GDD: 1,390) tracking phenological vegetative transition.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: IoT Probes & Hardware */}
        {activeTab === 'iot' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">Plot #204 Hardware & Telemetry Nodes</h3>
                <p className="text-xs text-slate-500">Real-time ESP32 probes transmitting volumetric soil moisture & weather</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                2 NODES ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Device 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">ESP32 RootZone Probe #1</h4>
                      <span className="text-[10px] font-mono text-slate-500">UID: ESP32-AG-1000</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ACTIVE (3s)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Soil Moisture</span>
                    <strong className="text-base text-blue-600 font-mono">{farm.soilMoisturePct}% VWC</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Soil Resistance</span>
                    <strong className="text-base text-slate-800 font-mono">798 &Omega;</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Battery Status</span>
                    <strong className="text-base text-emerald-600 font-mono">94%</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">GSM Signal</span>
                    <strong className="text-base text-slate-800 font-mono">-68 dBm</strong>
                  </div>
                </div>
              </div>

              {/* Device 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Solar Pump Relay #1</h4>
                      <span className="text-[10px] font-mono text-slate-500">UID: ESP32-RLY-PRO</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                    STANDBY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Relay State</span>
                    <strong className="text-base text-slate-800 font-mono">IDLE</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Daily Flow Target</span>
                    <strong className="text-base text-blue-600 font-mono">28,000 L</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Last Actuation</span>
                    <strong className="text-base text-slate-800 font-mono">14 Sep (45m)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Actuator Mode</span>
                    <strong className="text-base text-emerald-600 font-mono">AUTO-IOT</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Stress & Recovery Timeline (Section 8) */}
        {activeTab === 'timeline' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-lg text-[#0F172A]">
                Closed-Loop Incident Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Satellite observation &rarr; stress detected &rarr; recommendation &rarr; intervention &rarr; recovery
              </p>
            </div>

            <div className="space-y-6">
              {timelineStages.map((stage, idx) => (
                <div key={idx} className="flex items-start space-x-4 relative">
                  {idx < timelineStages.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-emerald-200"></div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-[#10B981] flex items-center justify-center text-emerald-700 shrink-0 z-10">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-sm text-slate-900">{stage.stage}</span>
                      <span className="font-mono text-slate-400">{stage.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Insurance */}
        {activeTab === 'insurance' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">Parametric Insurance Coverage Package</h3>
                <p className="text-xs text-slate-500">Automatic index-based parametric protection for Plot #204</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                ACTIVE & CURRENT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[11px]">Policy Number</span>
                <strong className="text-sm text-slate-900 font-mono">POL-WB-2026-3000</strong>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[11px]">Total Sum Insured</span>
                <strong className="text-sm text-emerald-700 font-mono">₹{farm.sumInsured.toLocaleString()}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[11px]">Parametric Trigger Threshold</span>
                <strong className="text-sm text-slate-900 font-mono">CHF &le; 0.550</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <strong className="block text-sm">How Settlement Works:</strong>
              <p className="leading-relaxed">
                If the Composite Crop Health Factor drops below 0.550 for &ge; 5 consecutive days, 
                an automatic parametric claim is registered and settled directly into Subhash Biswas's bank account 
                via electronic NEFT clearing without requiring paperwork or adjuster visits.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
