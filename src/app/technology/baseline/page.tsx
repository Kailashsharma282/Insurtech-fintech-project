'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Layers, 
  Sliders, 
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { SEED_INSURANCE_UNITS } from '@/lib/db/seed-data';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function BaselineEnginePage() {
  const [selectedCrop, setSelectedCrop] = useState<string>('Aman Paddy');
  const [selectedSeason, setSelectedSeason] = useState<string>('Kharif 2026');
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>('WB-NAD-001');

  const insuranceUnit = SEED_INSURANCE_UNITS.find(u => u.code === selectedUnitCode) || SEED_INSURANCE_UNITS[0];

  // 4-year historical demo baseline comparison
  const baselineComparisonData = [
    { year: '2023', historicalChf: 0.77, rainfallMm: 1180, yieldTonHa: 4.8 },
    { year: '2024', historicalChf: 0.74, rainfallMm: 1040, yieldTonHa: 4.5 },
    { year: '2025', historicalChf: 0.78, rainfallMm: 1220, yieldTonHa: 4.9 },
    { year: '2026 (Current)', historicalChf: insuranceUnit.chfBaseline, currentChf: insuranceUnit.currentChf, rainfallMm: 980, yieldTonHa: 4.2 },
  ];

  const deviation = parseFloat((insuranceUnit.currentChf - insuranceUnit.chfBaseline).toFixed(3));
  const deviationPct = parseFloat(((deviation / insuranceUnit.chfBaseline) * 100).toFixed(1));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>4-Year Localized Agronomic Normals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Localized Baseline Normalization Engine
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Eliminating geographic basis risk by establishing empirical 4-year localized normal distributions for each Gram Panchayat Insurance Unit.
          </p>
        </div>

        {/* Selection Controls */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Crop Classification</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-[#10B981]"
              >
                <option value="Aman Paddy">Aman Paddy (Rice)</option>
                <option value="Potato">Potato (Tuber)</option>
                <option value="Jute">Jute (Fiber)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Phenological Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-[#10B981]"
              >
                <option value="Kharif 2026">Kharif 2026 (Monsoon)</option>
                <option value="Rabi 2025-26">Rabi 2025-26 (Winter)</option>
                <option value="Pre-Kharif 2026">Pre-Kharif 2026 (Summer)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Insurance Unit (IU / Gram Panchayat)</label>
              <select
                value={selectedUnitCode}
                onChange={(e) => setSelectedUnitCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-[#10B981]"
              >
                {SEED_INSURANCE_UNITS.map(u => (
                  <option key={u.code} value={u.code}>
                    {u.code}: {u.name} ({u.district})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Selected IU Baseline Stat Card */}
        <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/40 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div>
              <div className="text-xs font-mono text-[#34D399] uppercase">Insurance Unit</div>
              <div className="text-xl font-bold text-white mt-1">{insuranceUnit.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{insuranceUnit.district} &bull; {insuranceUnit.crop}</div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-emerald-900/60 pt-4 md:pt-0 md:pl-6">
              <div className="text-xs font-mono text-slate-400 uppercase">4-Yr Baseline CHF</div>
              <div className="text-3xl font-black text-white mt-1">{insuranceUnit.chfBaseline.toFixed(3)}</div>
              <div className="text-xs text-slate-400 mt-0.5">Empirical normal (2023–2025)</div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-emerald-900/60 pt-4 md:pt-0 md:pl-6">
              <div className="text-xs font-mono text-[#34D399] uppercase">Current Season CHF</div>
              <div className="text-3xl font-black text-white mt-1">{insuranceUnit.currentChf.toFixed(3)}</div>
              <div className={`text-xs mt-0.5 font-bold ${insuranceUnit.currentChf < 0.55 ? 'text-red-400' : 'text-emerald-400'}`}>
                Risk: {insuranceUnit.riskState.replace('_', ' ')}
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-emerald-900/60 pt-4 md:pt-0 md:pl-6">
              <div className="text-xs font-mono text-slate-400 uppercase">Baseline Deviation &Delta;</div>
              <div className={`text-3xl font-black mt-1 ${deviation < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {deviation > 0 ? `+${deviation}` : deviation}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{deviationPct}% from 4-yr normal</div>
            </div>

          </div>
        </div>

        {/* 4-Year Historical Trend Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                4-Year Localized Normal Progression (2023–2026)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Comparing historical crop normals and current season performance for {insuranceUnit.name}.
              </p>
            </div>
            <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
              Gram Panchayat Code: {insuranceUnit.code}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={baselineComparisonData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                <YAxis domain={[0.4, 0.9]} stroke="#64748B" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="historicalChf" name="Baseline Normal CHF" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="currentChf" name="2026 Observed CHF" fill="#0284C7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Architectural Explanations Required by Section 16 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] space-y-3">
            <div className="flex items-center space-x-2 text-[#0F172A] font-bold text-base">
              <Layers className="w-5 h-5 text-[#059669]" />
              <span>Stratified Clustering & Insurance Unit Definition</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Insurance Units (IUs) are demarcated at the Gram Panchayat boundary level (~1,000–2,500 hectares) rather than district aggregates. Stratified clustering groups contiguous plots with homogeneous soil series, drainage topologies, and historical yield distributions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] space-y-3">
            <div className="flex items-center space-x-2 text-[#0F172A] font-bold text-base">
              <Sliders className="w-5 h-5 text-[#059669]" />
              <span>Management Bias vs Weather Separation</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              To prevent moral hazard (e.g., deliberate neglect of a plot), the baseline engine cross-references individual plot anomalies with the surrounding cluster median. Catastrophic weather shocks depress the entire IU cluster simultaneously, while idiosyncratic management neglect is isolated and adjusted by the correction factor matrix.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
