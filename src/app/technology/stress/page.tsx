'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Satellite, 
  AlertTriangle, 
  Droplets, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Area, 
  ComposedChart 
} from 'recharts';

export default function EarlyStressDetectionPage() {
  // Timeline comparison data: Early anomaly -> Stress warning -> Visible damage
  const timelineData = [
    { day: 'Day 0', normalBaseline: 0.78, sentinel1VH: -15.8, uvNdvi: 0.76, opticalNdvi: 0.76, stage: 'Healthy Baseline' },
    { day: 'Day 2', normalBaseline: 0.78, sentinel1VH: -17.2, uvNdvi: 0.71, opticalNdvi: 0.75, stage: 'Sub-surface Moisture Drop' },
    { day: 'Day 4', normalBaseline: 0.78, sentinel1VH: -19.4, uvNdvi: 0.64, opticalNdvi: 0.73, stage: 'Early Anomaly (Cellular)' },
    { day: 'Day 6', normalBaseline: 0.78, sentinel1VH: -21.8, uvNdvi: 0.55, opticalNdvi: 0.71, stage: 'Stress Warning (Radar Trigger)' },
    { day: 'Day 8', normalBaseline: 0.78, sentinel1VH: -23.1, uvNdvi: 0.48, opticalNdvi: 0.63, stage: 'Incipient Wilting' },
    { day: 'Day 10', normalBaseline: 0.78, sentinel1VH: -24.2, uvNdvi: 0.42, opticalNdvi: 0.51, stage: 'Visible Damage (Farmer Notice)' },
    { day: 'Day 12', normalBaseline: 0.78, sentinel1VH: -25.0, uvNdvi: 0.38, opticalNdvi: 0.42, stage: 'Irreversible Leaf Scorch' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span>Spectral & Biophysical Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Early Crop Stress Detection Mechanics
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Capturing the temporal window between sub-cellular water depletion and visible leaf damage to actuate micro-irrigation before irreversible yield loss occurs.
          </p>
        </div>

        {/* Highlight Recommendation Card */}
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-3xl bg-[#071511] text-white border border-[#10B981]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono text-amber-300 uppercase tracking-wider">Automated Agronomic Advisory</div>
                  <h3 className="text-xl font-bold text-white">Moisture Stress Detected</h3>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold uppercase tracking-wider">
                  Priority: High
                </span>
                <span className="text-xs font-mono text-emerald-300">Plot #204 Nadia</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#102820] border border-emerald-900/40">
                <div className="text-slate-400">Prescribed Intervention</div>
                <div className="font-bold text-emerald-300 text-sm mt-1">Micro-irrigation Recommended</div>
                <div className="text-slate-400 mt-1">45 min drip pulse target</div>
              </div>
              <div className="p-4 rounded-xl bg-[#102820] border border-emerald-900/40">
                <div className="text-slate-400">Detection Lead Time</div>
                <div className="font-bold text-white text-sm mt-1">4.5 Days Before Wilting</div>
                <div className="text-slate-400 mt-1">Radar VH anomaly: -3.6 dB</div>
              </div>
              <div className="p-4 rounded-xl bg-[#102820] border border-emerald-900/40">
                <div className="text-slate-400">Yield Preservation Potential</div>
                <div className="font-bold text-emerald-400 text-sm mt-1">94.8% Preserved</div>
                <div className="text-slate-400 mt-1">If actuated within 24 hours</div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-emerald-900/50 text-xs">
              <span className="text-slate-400">Actuate directly from Farmer Operations:</span>
              <Link
                href="/operations/iot"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white font-semibold transition-colors"
              >
                <span>Trigger Pump Relay Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stress Timeline Chart: Early Anomaly -> Stress Warning -> Visible Damage */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                The Early Detection Advantage: Early Anomaly &rarr; Stress Warning &rarr; Visible Damage
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Comparing Sentinel-1 VH cross-polarization radar (dB) and UV-NDVI against standard optical NDVI over 12 days of moisture deficit.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Alert Window: Day 3 to 6
              </span>
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timelineData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                <YAxis yAxisId="left" domain={[0.2, 0.9]} stroke="#64748B" fontSize={12} label={{ value: 'Vegetation Index (0-1)', angle: -90, position: 'insideLeft', style: { fill: '#64748B', fontSize: 11 } }} />
                <YAxis yAxisId="right" orientation="right" domain={[-26, -14]} stroke="#8B5CF6" fontSize={12} label={{ value: 'Radar Backscatter VH (dB)', angle: 90, position: 'insideRight', style: { fill: '#8B5CF6', fontSize: 11 } }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                
                {/* Normal Baseline */}
                <Line yAxisId="left" type="monotone" dataKey="normalBaseline" name="Historical Normal CHF" stroke="#10B981" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                {/* Standard Optical NDVI */}
                <Line yAxisId="left" type="monotone" dataKey="opticalNdvi" name="Optical NDVI (Slow Response)" stroke="#F59E0B" strokeWidth={2.5} />
                {/* UV-NDVI */}
                <Line yAxisId="left" type="monotone" dataKey="uvNdvi" name="UV-NDVI (Cellular Sensitivity)" stroke="#0284C7" strokeWidth={2.5} />
                {/* Sentinel-1 Radar VH */}
                <Line yAxisId="right" type="monotone" dataKey="sentinel1VH" name="Sentinel-1 VH Backscatter (dB)" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
              <span className="font-bold block mb-1">1. Early Anomaly (Days 2–4)</span>
              Sentinel-1 VH backscatter drops from -15.8 dB to -19.4 dB due to decreased dielectric permittivity of plant sap before visual leaf yellowing.
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
              <span className="font-bold block mb-1">2. Stress Warning (Days 4–6)</span>
              UV-NDVI collapses by 28% as chloroplast orientation shifts under dehydration stress. Automated irrigation advisory triggered.
            </div>
            <div className="p-3.5 rounded-xl bg-red-50 text-red-900 border border-red-200">
              <span className="font-bold block mb-1">3. Visible Damage (Days 8–10)</span>
              Traditional optical cameras and human scouts only detect wilting after Day 8, at which point yield penalty already reaches 20–35%.
            </div>
          </div>
        </div>

        {/* Technical Biophysics Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] space-y-4">
            <div className="flex items-center space-x-2 text-[#0F172A] font-bold text-base">
              <Satellite className="w-5 h-5 text-[#059669]" />
              <span>Sentinel-1 C-SAR VH Polarimetric Sensitivity</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Synthetic Aperture Radar (SAR) emits microwaves in C-band (5.405 GHz). Vertical-transmit Horizontal-receive (VH) cross-polarization is governed by volume scattering within the vegetative canopy.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
              <div>&sigma;&deg;_VH = f(Canopy Geometry, Biomass, Dielectric Constant &epsilon;)</div>
              <div className="text-slate-500 text-[11px]">&epsilon;_fresh_tissue &asymp; 50 &rarr; &epsilon;_desiccated_tissue &asymp; 15 (Dramatic dB drop)</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] space-y-4">
            <div className="flex items-center space-x-2 text-[#0F172A] font-bold text-base">
              <Activity className="w-5 h-5 text-[#059669]" />
              <span>Physiological Crop Stress vs Visible Wilting</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              When stomata close under vapor pressure deficit (VPD) stress, internal leaf temperature rises rapidly before leaf wilting occurs. Our engine integrates thermal infrared anomalies with soil root moisture to prevent irreversible vascular cavitation.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
              <div>CWSI = ( (Tc - Ta) - (Tc - Ta)_lower ) / ( (Tc - Ta)_upper - (Tc - Ta)_lower )</div>
              <div className="text-slate-500 text-[11px]">Crop Water Stress Index: Alert threshold &gt; 0.42</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
