'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Satellite, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Layers,
  ChevronRight,
  Droplets,
  AlertTriangle,
  Play,
  Download,
  FileText
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  const kpiCards = [
    { value: '10 m', unit: 'grid', label: 'Spatial Resolution', desc: 'Sentinel-2 B8 target grid projection across Ghatal' },
    { value: '38', unit: 'classes', label: 'Disease Taxonomy', desc: 'Calibrated crop pathology vision model' },
    { value: '0.85', unit: 'r-score', label: 'CHF / Yield Correlation', desc: 'Entropy-weighted radar & optical vegetation correlation' },
    { value: '30–45', unit: 'days', label: 'Claim Resolution Benchmark', desc: 'Turnaround vs 6–9 months traditional PMFBY survey' },
    { value: '3s', unit: 'stream', label: 'IoT Telemetry Stream', desc: 'Real-time soil probe & weather station updates' },
  ];

  const workflowSteps = [
    { step: '01', title: 'OBSERVE', desc: 'Sentinel-2 MSI (10m) + Sentinel-1 SAR (VH backscatter) + field IoT moisture sensors', icon: Satellite },
    { step: '02', title: 'DIAGNOSE', desc: 'Early crop stress, soil water deficit, and 38-class leaf pathology identification', icon: Activity },
    { step: '03', title: 'PRESCRIBE', desc: 'GA-PSO algorithm calculates targeted N-P-K fertilizer and irrigation schedule', icon: Cpu },
    { step: '04', title: 'ACTUATE', desc: 'Automated solar pump relays, micro-irrigation pulses, and regional Bengali/Hindi advisories', icon: Droplets },
    { step: '05', title: 'VERIFY', desc: 'Bi-weekly satellite passes monitor post-intervention crop recovery curves', icon: CheckCircle2 },
    { step: '06', title: 'INSURE', desc: 'Parametric CHF threshold breach trigger issues automated payouts directly to farmer accounts', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      
      {/* Clean Hero Header - Simple Solid Styling (No Gradients, No Animations) */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              <span>Ghatal Pilot Hub</span>
              <span>&bull;</span>
              <span>Kharif 2025 Closed-Loop System</span>
            </div>

            <h1 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Simple, Automated Crop Health & Parametric Insurance for Farmers
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
              AgriSure monitors your field using European Space Agency satellites (Sentinel-2 optical & Sentinel-1 radar) and local ground sensors. When flood, drought, or disease strikes, your insurance payout is triggered automatically—zero paperwork needed.
            </p>

            {/* Clear, High-Contrast Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-3">
              <Link
                href="/farmer/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>Enter Farmer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/farmer/insurance-validation"
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Insurance Validation (CHF)</span>
              </Link>

              <Link
                href="/technology/chf"
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm border border-slate-300 transition-colors flex items-center justify-center space-x-2"
              >
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>CHF Algorithm (Ghatal 2025)</span>
              </Link>

              <a
                href="/reports/Ghatal_Block_Crop_Health_Indicators_2025_Report.pdf"
                download
                className="w-full sm:w-auto px-4 py-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm border border-amber-300 transition-colors flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4 text-amber-800" />
                <span>Download Report PDF</span>
              </a>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              * Active Pilot: Plot #204 Ghatal Block, Paschim Medinipur, West Bengal (Aman Paddy 2.8 ha)
            </div>

          </div>
        </div>
      </section>

      {/* KPI Benchmark Cards - Clean & Solid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {kpiCards.map((kpi, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1"
            >
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{kpi.value}</span>
                <span className="text-xs font-bold text-blue-600 uppercase">{kpi.unit}</span>
              </div>
              <div className="font-bold text-xs text-slate-800">{kpi.label}</div>
              <p className="text-[11px] text-slate-500 leading-snug">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6-Stage Workflow Framework - Clear & Plain */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200">
        <div className="mb-6 space-y-1">
          <span className="text-xs font-bold uppercase text-blue-700 font-mono tracking-wider">
            Operational Protocol
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            The 6-Stage Closed-Loop Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Designed to save the farmer&apos;s crop before damage occurs, and trigger automatic financial relief if weather exceeds safe limits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                    STAGE {s.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Demonstration Unit Info */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200">
        <div className="p-6 rounded-xl bg-white border border-slate-300 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">Live Pilot Unit</span>
              <h3 className="text-lg font-bold text-slate-900">Plot #204 &bull; Ghatal Block, Paschim Medinipur</h3>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 self-start sm:self-auto">
              Aman Paddy (2.8 Hectares)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Crop Health (CHF)</span>
              <strong className="text-sm text-blue-700">0.712 (Good)</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Soil Moisture (Probe)</span>
              <strong className="text-sm text-slate-900">58.0% VWC</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Accumulated Rain</span>
              <strong className="text-sm text-slate-900">1280 mm</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Parametric Trigger</span>
              <strong className="text-sm text-slate-900">&le; 0.55 (Active)</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 gap-3 text-xs">
            <span className="text-slate-500">
              Demo Pilot Profile: Subhash Biswas (Plot #204)
            </span>
            <Link
              href="/farmer/dashboard"
              className="font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Open Plot #204 Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
