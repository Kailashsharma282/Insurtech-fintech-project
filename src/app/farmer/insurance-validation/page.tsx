'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Search,
  Filter
} from 'lucide-react';
import { 
  VILLAGE_HISTORICAL_DATA, 
  FARMER_INSURANCE_REGISTRY, 
  SEASONS_LIST,
  validateInsuranceClaimWithChf,
  InsuranceValidationResult
} from '@/lib/db/ghatal-excel-store';
import { CropPhotoAnalyzer } from '@/components/ui/CropPhotoAnalyzer';

export default function InsuranceValidationPage() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-001');
  const [chfValue, setChfValue] = useState<number>(0.421); // Ghatal Block 2025 CHF baseline
  const [threshold, setThreshold] = useState<number>(0.55);
  const [validationResult, setValidationResult] = useState<InsuranceValidationResult | null>(null);
  
  // Table 1 filters
  const [activeVillageTab, setActiveVillageTab] = useState<string>('All');
  const [activeMetricTab, setActiveMetricTab] = useState<'yield' | 'production' | 'area'>('yield');
  
  // Table 2 search
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const res = validateInsuranceClaimWithChf(selectedCandidateId, chfValue, threshold);
    setValidationResult(res);
  }, [selectedCandidateId, chfValue, threshold]);

  const selectedCandidate = FARMER_INSURANCE_REGISTRY.find(c => c.id === selectedCandidateId) || FARMER_INSURANCE_REGISTRY[0];

  const filteredVillages = activeVillageTab === 'All' 
    ? VILLAGE_HISTORICAL_DATA 
    : VILLAGE_HISTORICAL_DATA.filter(v => v.villageName === activeVillageTab);

  const filteredCandidates = FARMER_INSURANCE_REGISTRY.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.candidateName.toLowerCase().includes(q) ||
           c.villageName.toLowerCase().includes(q) ||
           c.jlNo.toString().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full">

        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/farmer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Farmer Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="/reports/Ghatal_Block_Crop_Health_Indicators_2025_Report.pdf"
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Technical PDF Report</span>
            </a>
          </div>
        </div>

        {/* Page Banner */}
        <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
              Government PMFBY Insurance Validation Hub
            </span>
            <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
              Ghatal Block &bull; Paschim Medinipur &bull; Kharif 2025
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Satellite CHF to Insurance Indemnity Calculator & Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
            Integrates the <strong>Ghatal Block 2025 Multi-Satellite CHF Algorithm</strong> with the official <strong>Crop-wise Area, Production & Yield Registry (2017-18 to 2026-27)</strong>. The calculated CHF validates crop loss against ground CCE measurements to determine the exact insurance indemnity payout.
          </p>
        </div>

        {/* SECTION 1: INTERACTIVE CHF INSURANCE VALIDATION ENGINE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
          
          <div className="bg-[#0F172A] text-white p-4 sm:p-6 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
                  Parametric Determination Engine
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">
                  Validate Insurance Amount via Calculated CHF
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-800 text-blue-300 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
                  Live Satellite CHF: <strong>0.421</strong> (Triggered)
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6 w-full">
            
            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 w-full">
              
              {/* Candidate Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Candidate Farmer
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {FARMER_INSURANCE_REGISTRY.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.candidateName} — {c.villageName} (JL {c.jlNo}, {c.areaHa} Ha)
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Sum Insured: ₹{selectedCandidate.totalSumInsured.toLocaleString('en-IN')} (₹{selectedCandidate.sumInsuredPerHa}/Ha)
                </span>
              </div>

              {/* Calculated CHF Value */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Calculated CHF Value
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {chfValue.toFixed(3)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.95"
                  step="0.01"
                  value={chfValue}
                  onChange={(e) => setChfValue(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.10 (Severe Flood)</span>
                  <span>0.55 (Trigger)</span>
                  <span>0.95 (Optimal)</span>
                </div>
              </div>

              {/* Quick Simulation Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Test Simulation Scenarios
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setChfValue(0.15)}
                    className="p-1.5 text-[11px] rounded bg-red-100 hover:bg-red-200 text-red-900 font-semibold border border-red-300 transition-colors"
                  >
                    Flood Shock (0.15)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChfValue(0.421)}
                    className="p-1.5 text-[11px] rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold border border-amber-300 transition-colors"
                  >
                    Baseline (0.421)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChfValue(0.75)}
                    className="p-1.5 text-[11px] rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold border border-blue-300 transition-colors"
                  >
                    Healthy (0.75)
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Click to simulate different satellite conditions instantly.
                </span>
              </div>

            </div>

            {/* Validation Determination Results */}
            {validationResult && (
              <div className="border-2 rounded-xl p-4 sm:p-6 space-y-4 bg-white border-slate-200 w-full">
                
                {/* Status & Payout Amount Callout */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        validationResult.validationStatus === 'FULL_PAYOUT_TRIGGERED' 
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : validationResult.validationStatus === 'PARTIAL_PAYOUT_TRIGGERED'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {validationResult.validationStatus === 'FULL_PAYOUT_TRIGGERED' ? '100% Full Sum Insured Payout' :
                         validationResult.validationStatus === 'PARTIAL_PAYOUT_TRIGGERED' ? 'Partial Parametric Payout Approved' :
                         'No Indemnity Payable (Safe Yield)'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Farmer: {validationResult.candidateName} (JL {validationResult.jlNo})
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Determined Insurance Payout Amount
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Calculated from Sum Insured (₹{validationResult.sumInsured.toLocaleString('en-IN')}) &times; Validated Loss ({validationResult.validatedLossPct}%)
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-600 text-left md:text-right shrink-0">
                    <div className="text-3xl sm:text-4xl font-black text-blue-950 font-mono">
                      ₹{validationResult.determinedInsuranceAmount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs font-bold text-blue-800">
                      Direct DBT Bank Credit to Farmer
                    </span>
                  </div>
                </div>

                {/* Metric Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Calculated Satellite CHF
                    </span>
                    <strong className="text-base text-slate-900 font-mono">
                      {validationResult.calculatedChf.toFixed(3)}
                    </strong>
                    <span className="text-[11px] text-slate-500 block">
                      Threshold: {validationResult.chfThreshold}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Threshold Yield (TY)
                    </span>
                    <strong className="text-base text-slate-900 font-mono">
                      {validationResult.thresholdYieldKgHa.toLocaleString()} kg/ha
                    </strong>
                    <span className="text-[11px] text-slate-500 block">
                      80% Indemnity Level
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      CCE Validated Yield
                    </span>
                    <strong className="text-base text-slate-900 font-mono">
                      {validationResult.validatedYieldKgHa.toLocaleString()} kg/ha
                    </strong>
                    <span className="text-[11px] text-slate-500 block">
                      Shortfall: {(validationResult.yieldShortfallRatio * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Validated Loss Rate
                    </span>
                    <strong className="text-base text-blue-900 font-mono">
                      {validationResult.validatedLossPct}%
                    </strong>
                    <span className="text-[11px] text-slate-500 block">
                      Harmonized CHF & CCE
                    </span>
                  </div>
                </div>

                {/* Ground CCE Audit Evidence */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>Crop Cutting Experiment (CCE) Ground Truth Evidence</span>
                    </strong>
                    <span className="text-[11px] font-mono text-slate-500">
                      Standard Plot Size: {validationResult.cceEvidence.plotSizeM2} m² (5m &times; 5m cut)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-700 w-full">
                    <div>
                      <span className="text-[10px] text-slate-500 block">CCEs Conducted:</span>
                      <strong>{validationResult.cceEvidence.noOfCceConducted} cuts</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Net Grain Yield (CCE):</span>
                      <strong>{validationResult.cceEvidence.netGrainYieldKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Flood / Inundation:</span>
                      <strong className={validationResult.cceEvidence.floodCondition === 'Severe' ? 'text-red-700' : 'text-slate-800'}>
                        {validationResult.cceEvidence.floodCondition}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rainfall Status:</span>
                      <strong>{validationResult.cceEvidence.rainfallStatus}</strong>
                    </div>
                  </div>

                  <p className="text-slate-600 text-[11px] pt-1 leading-relaxed border-t border-slate-200 mt-2">
                    <strong>Underwriting Rationale: </strong>{validationResult.rationale}
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* SECTION 2: PHOTO UPLOAD FOR NPK & WATER REQUIREMENT */}
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Field Photo Diagnostic Analyzer
            </h2>
            <Link 
              href="/farmer/disease"
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Full Scanner &rarr;
            </Link>
          </div>
          <CropPhotoAnalyzer />
        </div>

        {/* SECTION 3: TABLE 1 — VILLAGE HISTORICAL PRODUCTION & YIELD (2017-18 to 2026-27) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6 w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-bold">
                Benchmark Registry (10 Seasons)
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Table 1: Village Historical Area, Production & Yield (Ghatal Block)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Government Record &bull; 2017-18 through 2026-27 &bull; Rice (Kharif)
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setActiveMetricTab('yield')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeMetricTab === 'yield' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yield (kg/ha)
              </button>
              <button
                type="button"
                onClick={() => setActiveMetricTab('production')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeMetricTab === 'production' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Production (Tonnes)
              </button>
              <button
                type="button"
                onClick={() => setActiveMetricTab('area')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeMetricTab === 'area' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Area (Hectares)
              </button>
            </div>
          </div>

          {/* Village Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs w-full max-w-full">
            {['All', 'Ghatal', 'Konnagar', 'Radhanagar', 'Kharar', 'Irhpala'].map((vName) => (
              <button
                key={vName}
                onClick={() => setActiveVillageTab(vName)}
                className={`px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition-colors ${
                  activeVillageTab === vName
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {vName}
              </button>
            ))}
          </div>

          {/* Responsive Scrollable Table (Strictly contained to prevent document overflow) */}
          <div className="w-full max-w-full overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left text-slate-700 min-w-[850px]">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 min-w-[120px] sticky left-0 bg-slate-100 z-10">Village Name</th>
                  <th className="py-3 px-2 min-w-[65px]">Crop</th>
                  <th className="py-3 px-2 min-w-[65px]">Season</th>
                  {SEASONS_LIST.map((season) => (
                    <th 
                      key={season} 
                      className={`py-3 px-2 min-w-[75px] text-right ${
                        season === '2017-18' || season === '2021-22' ? 'bg-red-50 text-red-900 font-black' : ''
                      }`}
                    >
                      {season}
                      {(season === '2017-18' || season === '2021-22') && (
                        <span className="block text-[8px] text-red-600 font-normal">Flood Shock</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredVillages.map((row, idx) => {
                  const dataMap = activeMetricTab === 'yield' 
                    ? row.yieldKgHa 
                    : activeMetricTab === 'production' 
                    ? row.productionTonnes 
                    : row.areaHa;

                  return (
                    <tr key={`${row.villageName}-${idx}`} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200">
                        {row.villageName}
                      </td>
                      <td className="py-2.5 px-2">{row.cropType}</td>
                      <td className="py-2.5 px-2 font-mono text-[11px]">{row.season}</td>
                      {SEASONS_LIST.map((season) => (
                        <td 
                          key={season} 
                          className={`py-2.5 px-2 text-right font-mono ${
                            season === '2017-18' || season === '2021-22' ? 'bg-red-50/50 text-red-950 font-bold' : ''
                          }`}
                        >
                          {(dataMap[season] || 0).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
            <span>Red highlighted columns indicate verified historical flood disaster seasons in Ghatal Block.</span>
            <span>Threshold Yield excludes disaster years per PMFBY Section 11.2 Guidelines.</span>
          </div>

        </div>

        {/* SECTION 4: TABLE 2 — CANDIDATE FARMER REGISTRY & CCE VALIDATION DATA */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6 w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-bold">
                Underwriting & Ground Truth Registry
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Table 2: Candidate Farmer Insurance Registry & CCE Validation Data
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full schema matching the Excel specification including 10-year crop loss history & CCE validation fields.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate, village, JL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Candidate Table (Strictly contained to prevent document overflow) */}
          <div className="w-full max-w-full overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left text-slate-700 min-w-[950px]">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 min-w-[140px] sticky left-0 bg-slate-100 z-10">Candidate Name</th>
                  <th className="py-3 px-2 min-w-[90px]">Village</th>
                  <th className="py-3 px-2 min-w-[55px]">JL No.</th>
                  <th className="py-3 px-2 min-w-[70px]">Area (Ha)</th>
                  <th className="py-3 px-2 min-w-[100px]">Sum Insured</th>
                  <th className="py-3 px-2 min-w-[75px]">Claimed</th>
                  <th className="py-3 px-2 min-w-[95px] bg-blue-50 text-blue-950">CCE Yield (kg/ha)</th>
                  <th className="py-3 px-2 min-w-[85px]">Net Produce</th>
                  <th className="py-3 px-2 min-w-[85px]">Flood Status</th>
                  <th className="py-3 px-2 min-w-[85px]">Irrigation</th>
                  <th className="py-3 px-3 min-w-[100px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredCandidates.map((c) => (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-slate-50 transition-colors ${
                      selectedCandidateId === c.id ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200">
                      <div>{c.candidateName}</div>
                      <span className="text-[10px] font-mono text-slate-500">{c.phone}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-slate-900">{c.villageName}</div>
                      <span className="text-[10px] text-slate-500 font-mono">Code: {c.villageCode}</span>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-slate-800">{c.jlNo}</td>
                    <td className="py-3 px-2 font-mono">{c.areaHa} Ha</td>
                    <td className="py-3 px-2 font-mono font-bold text-slate-900">
                      ₹{c.totalSumInsured.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.claimedInsurance === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.claimedInsurance}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono font-black text-blue-950 bg-blue-50/50">
                      {c.validation.cceYieldKgHa} kg/ha
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px]">
                      {c.validation.netGrainYieldKg} kg
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        c.validation.floodWaterlogging === 'Severe' ? 'bg-red-100 text-red-800 font-bold' :
                        c.validation.floodWaterlogging === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.validation.floodWaterlogging}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[11px] text-slate-600">
                      {c.validation.irrigation}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCandidateId(c.id);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors shadow-xs"
                      >
                        Validate CHF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
