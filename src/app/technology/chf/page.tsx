'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { computeChf, ChfRawInputs } from '@/lib/algorithms/chf';

export default function ChfEnginePage() {
  // Interactive inputs with realistic default baseline values for Plot #204 Nadia
  const [inputs, setInputs] = useState<ChfRawInputs>({
    ndvi: 0.68,
    lswi: 0.38,
    vhBackscatterDb: -16.4,
    integratedVh: 0.74,
    fapar: 0.63,
    rainfallMm: 95.0,
    rainyDays: 6,
    cropVariability: 0.12,
  });

  const [baselineScore, setBaselineScore] = useState<number>(0.76);
  const [expandedFormula, setExpandedFormula] = useState<string | null>('entropy');

  // Compute live transparent results
  const result = useMemo(() => {
    return computeChf(inputs, baselineScore);
  }, [inputs, baselineScore]);

  const updateInput = (key: keyof ChfRawInputs, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const resetToDemo = () => {
    setInputs({
      ndvi: 0.68,
      lswi: 0.38,
      vhBackscatterDb: -16.4,
      integratedVh: 0.74,
      fapar: 0.63,
      rainfallMm: 95.0,
      rainyDays: 6,
      cropVariability: 0.12,
    });
    setBaselineScore(0.76);
  };

  const setToShock = () => {
    setInputs({
      ndvi: 0.44,
      lswi: 0.16,
      vhBackscatterDb: -22.8,
      integratedVh: 0.42,
      fapar: 0.35,
      rainfallMm: 18.0,
      rainyDays: 1,
      cropVariability: 0.28,
    });
    setBaselineScore(0.76);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Mathematical Auditability</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Transparent Crop Health Factor (CHF) Engine
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Zero black boxes. The Crop Health Factor is an objective, entropy-weighted multi-spectral composite index that underwrites parametric risk with complete mathematical transparency.
          </p>
        </div>

        {/* Top Result Banner */}
        <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/40 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-emerald-900/60 pb-6">
            <div>
              <div className="text-xs font-mono text-[#34D399] uppercase tracking-widest">
                Computed Composite Score
              </div>
              <div className="flex items-baseline space-x-3 mt-1">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  {result.chfScore.toFixed(3)}
                </span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                  result.chfScore >= 0.70 
                    ? 'bg-emerald-500/20 text-[#34D399] border-emerald-500/30' 
                    : result.chfScore >= 0.55 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {result.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Underwriting Trigger Threshold: <strong className="text-amber-400">CHF &le; 0.550</strong>. 
                {result.chfScore < 0.55 ? ' ⚠️ Breached: Parametric Claim Qualified.' : ' Safe: Above parametric trigger line.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#102820] border border-emerald-800/40">
                <div className="text-slate-400 text-[11px]">4-Yr Baseline</div>
                <div className="font-bold text-white text-base mt-0.5">{result.baselineScore.toFixed(3)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#102820] border border-emerald-800/40">
                <div className="text-slate-400 text-[11px]">Deviation &Delta;</div>
                <div className={`font-bold text-base mt-0.5 ${result.deviation < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.deviation > 0 ? `+${result.deviation.toFixed(3)}` : result.deviation.toFixed(3)} ({result.deviationPercentage}%)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#102820] border border-emerald-800/40">
                <div className="text-slate-400 text-[11px]">Statistical Confidence</div>
                <div className="font-bold text-[#34D399] text-base mt-0.5">{(result.confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Pipeline: <strong className="text-white">MIN-MAX NORMALIZATION &rarr; SHANNON ENTROPY WEIGHTS &rarr; WEIGHTED COMPOSITE &rarr; CHF</strong>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetToDemo}
                className="px-3 py-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700/40 text-emerald-200 text-xs transition-colors"
              >
                Reset Demo (Plot #204)
              </button>
              <button
                onClick={setToShock}
                className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-700/40 text-red-200 text-xs transition-colors"
              >
                Simulate Drought Shock (&lt;0.55)
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Sliders Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sliders Column */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-lg text-[#0F172A]">Input Indices (Multi-Spectral & Weather)</h3>
              <span className="text-xs text-slate-500">Live Interactive Sliders</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* NDVI */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">NDVI (Vegetation Vigour)</span>
                  <span className="font-mono text-emerald-600">{inputs.ndvi.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.85"
                  step="0.01"
                  value={inputs.ndvi}
                  onChange={(e) => updateInput('ndvi', parseFloat(e.target.value))}
                  className="w-full accent-[#10B981]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.15 (Barren)</span>
                  <span>0.85 (Lush Dense)</span>
                </div>
              </div>

              {/* LSWI */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">LSWI (Canopy Water Index)</span>
                  <span className="font-mono text-blue-600">{inputs.lswi.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.10"
                  max="0.55"
                  step="0.01"
                  value={inputs.lswi}
                  onChange={(e) => updateInput('lswi', parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-0.10 (Severe Desiccation)</span>
                  <span>0.55 (Hydrated)</span>
                </div>
              </div>

              {/* Sentinel-1 VH Backscatter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Sentinel-1 VH Backscatter</span>
                  <span className="font-mono text-purple-600">{inputs.vhBackscatterDb.toFixed(1)} dB</span>
                </div>
                <input
                  type="range"
                  min="-24.0"
                  max="-11.0"
                  step="0.1"
                  value={inputs.vhBackscatterDb}
                  onChange={(e) => updateInput('vhBackscatterDb', parseFloat(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-24.0 dB (Collapsed)</span>
                  <span>-11.0 dB (Full Canopy)</span>
                </div>
              </div>

              {/* Integrated VH */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Integrated VH Multi-temporal</span>
                  <span className="font-mono text-purple-600">{inputs.integratedVh.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.95"
                  step="0.01"
                  value={inputs.integratedVh}
                  onChange={(e) => updateInput('integratedVh', parseFloat(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.20 (Low Stability)</span>
                  <span>0.95 (Consistent)</span>
                </div>
              </div>

              {/* FAPAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">FAPAR (Photosynthetic Absorption)</span>
                  <span className="font-mono text-emerald-600">{inputs.fapar.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.90"
                  step="0.01"
                  value={inputs.fapar}
                  onChange={(e) => updateInput('fapar', parseFloat(e.target.value))}
                  className="w-full accent-[#10B981]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.15</span>
                  <span>0.90</span>
                </div>
              </div>

              {/* Rainfall */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">14-Day Rainfall</span>
                  <span className="font-mono text-cyan-600">{inputs.rainfallMm.toFixed(0)} mm</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="220"
                  step="1"
                  value={inputs.rainfallMm}
                  onChange={(e) => updateInput('rainfallMm', parseFloat(e.target.value))}
                  className="w-full accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>20 mm (Deficit)</span>
                  <span>220 mm (Abundant)</span>
                </div>
              </div>

              {/* Rainy Days */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Rainy Days in Window</span>
                  <span className="font-mono text-cyan-600">{inputs.rainyDays} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={inputs.rainyDays}
                  onChange={(e) => updateInput('rainyDays', parseInt(e.target.value))}
                  className="w-full accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 day</span>
                  <span>10 days</span>
                </div>
              </div>

              {/* Crop Variability (lower is better) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Intra-Plot Crop Variability (CV)</span>
                  <span className="font-mono text-slate-700">{inputs.cropVariability.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.01"
                  value={inputs.cropVariability}
                  onChange={(e) => updateInput('cropVariability', parseFloat(e.target.value))}
                  className="w-full accent-slate-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.05 (Uniform / Healthy)</span>
                  <span>0.30 (Patchy / Stunted)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Shannon Entropy Weight Matrix */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-[#0F172A]">Shannon Entropy Weights (w_j)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Objective information dispersion</p>
            </div>

            <div className="space-y-3">
              {Object.entries(result.shannonWeights).map(([key, weight]) => {
                const normVal = result.normalizedInputs[key] || 0;
                return (
                  <div key={key} className="text-xs space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="uppercase text-slate-600 font-semibold">{key}</span>
                      <span className="text-[#059669] font-bold">{(weight * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-[#10B981] h-full" 
                        style={{ width: `${weight * 100 * 4}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>r_ij = {normVal.toFixed(3)}</span>
                      <span>Dispersion d_j = {result.dispersionFactors[key] || 0.12}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Weights sum to exactly <strong>1.000 (100%)</strong>. Features exhibiting higher variance/dispersion across historical baselines carry proportionally greater information entropy weight.
            </div>
          </div>

        </div>

        {/* Expandable Mathematical Formulas Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-lg text-[#0F172A]">Expandable Mathematical Formulation</h3>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Shannon Entropy Pipeline
            </span>
          </div>

          <div className="space-y-3">
            
            {/* Step 1: Normalization */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedFormula(expandedFormula === 'norm' ? null : 'norm')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left font-semibold text-sm text-slate-800"
              >
                <span>1. Dimensionless Min-Max Normalization (r_ij)</span>
                {expandedFormula === 'norm' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedFormula === 'norm' && (
                <div className="p-5 font-mono text-xs text-slate-700 bg-white border-t border-slate-200 space-y-2">
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm">
                    {result.formulas.normalization}
                  </div>
                  <p className="text-slate-600 text-xs font-sans">
                    Where x_ij represents the observed raw value for feature j in plot i, and [min_j, max_j] are the biological tolerance bounds calibrated for West Bengal agro-ecological zones.
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Information Entropy */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedFormula(expandedFormula === 'entropy' ? null : 'entropy')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left font-semibold text-sm text-slate-800"
              >
                <span>2. Information Entropy (e_j) & Information Utility Degree (d_j)</span>
                {expandedFormula === 'entropy' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedFormula === 'entropy' && (
                <div className="p-5 font-mono text-xs text-slate-700 bg-white border-t border-slate-200 space-y-2">
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm">
                    {result.formulas.entropy}
                  </div>
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm">
                    {result.formulas.dispersion}
                  </div>
                  <p className="text-slate-600 text-xs font-sans">
                    k = 1 / ln(m). If the value of feature j exhibits high dispersion, its entropy e_j decreases and degree of divergence d_j increases, signifying a feature that carries richer discriminatory underwriting information.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Weighted Composite Score */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedFormula(expandedFormula === 'composite' ? null : 'composite')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left font-semibold text-sm text-slate-800"
              >
                <span>3. Objective Shannon Weights (w_j) & Composite CHF</span>
                {expandedFormula === 'composite' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedFormula === 'composite' && (
                <div className="p-5 font-mono text-xs text-slate-700 bg-white border-t border-slate-200 space-y-2">
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm">
                    {result.formulas.weights}
                  </div>
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm">
                    {result.formulas.chfComposite}
                  </div>
                  <p className="text-slate-600 text-xs font-sans">
                    The resulting CHF score strictly resides within [0.00, 1.00]. When CHF falls below 0.550 for the seasonal trigger duration, a claim is automatically registered.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
