'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Satellite, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  Layers,
  ChevronRight,
  Droplets,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function HomePage() {
  const kpiCards = [
    { value: '38', unit: 'classes', label: 'Disease Taxonomy', desc: 'PlantVillage calibrated computer vision backbone' },
    { value: '92.9%', unit: 'accuracy', label: 'Model Precision', desc: 'Benchmarked across foliar blight, brown spot & wilts' },
    { value: '0.85', unit: 'r-score', label: 'CHF / Yield Correlation', desc: 'Entropy-weighted radar & optical vegetation correlation' },
    { value: '30–45', unit: 'days target', label: 'Claim Resolution Benchmark', desc: 'Target turnaround vs 6-9 months traditional loss survey' },
    { value: '3s', unit: 'interval', label: 'IoT Telemetry Stream', desc: 'Real-time ESP32 soil probe & weather station polling' },
  ];

  const workflowSteps = [
    { step: '01', title: 'OBSERVE', desc: 'Sentinel-2 MSI (10m) + Sentinel-1 SAR radar cross-polarization + field IoT probes', icon: Satellite, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
    { step: '02', title: 'DIAGNOSE', desc: 'Early physiological crop stress, root moisture deficit & 38-class leaf disease detection', icon: Activity, color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30' },
    { step: '03', title: 'PRESCRIBE', desc: 'GA-PSO bio-inspired algorithm generates calibrated N-P-K & irrigation requirements', icon: Cpu, color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
    { step: '04', title: 'ACTUATE', desc: 'Automated solar pump relays, micro-irrigation pulses, and localized SMS/app advisories', icon: Droplets, color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30' },
    { step: '05', title: 'VERIFY', desc: 'Post-intervention bi-weekly satellite passes monitor vegetation recovery curve', icon: CheckCircle2, color: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-500/30' },
    { step: '06', title: 'INSURE', desc: 'Parametric CHF threshold breach trigger settles payouts without paperwork friction', icon: ShieldCheck, color: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/30' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#071511] text-white pt-20 pb-28 tech-grid-dark border-b border-[#10B981]/20">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#10B981]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#10B981] pulse-indicator"></span>
              <span>Next-Generation Geospatial Agritech + Underwriting Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Turn Crop Risk Into Action <br />
              <span className="bg-gradient-to-r from-[#34D399] via-[#10B981] to-emerald-400 bg-clip-text text-transparent">
                Before It Becomes Crop Loss.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Satellite intelligence + agronomic AI + IoT telemetry + parametric insurance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/farmer/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white font-semibold text-sm shadow-lg shadow-[#10B981]/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Farm Intelligence</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                <span>See How It Works</span>
                <Play className="w-3.5 h-3.5 ml-2 fill-white text-white" />
              </Link>
            </div>

            {/* Narrative Flag */}
            <div className="pt-6">
              <p className="text-xs text-slate-400 italic max-w-xl mx-auto border-t border-emerald-900/60 pt-4">
                "Insurance backs up the yield-preservation system when unavoidable natural shocks exceed mitigation capability. It is the safety net, not the first line of defense."
              </p>
            </div>
          </div>

          {/* Hero Visual: Interactive Pipeline (satellite -> field -> AI -> intervention -> insurance) */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#0B2119]/90 border border-[#10B981]/30 shadow-2xl backdrop-blur-xl">
              <div className="text-center mb-6">
                <span className="text-xs font-mono text-[#34D399] uppercase tracking-widest">
                  Closed-Loop Autonomous Resilience Pipeline
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                
                <div className="p-4 rounded-xl bg-[#102820] border border-emerald-500/20 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Satellite className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-sm text-white">1. Satellite</div>
                  <p className="text-[11px] text-slate-300">Sentinel-2 MSI & Sentinel-1 SAR radar multi-spectral passes</p>
                </div>

                <div className="p-4 rounded-xl bg-[#102820] border border-emerald-500/20 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#34D399]">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-sm text-white">2. Field IoT</div>
                  <p className="text-[11px] text-slate-300">ESP32 3s root moisture, DHT22 microclimate & soil sensors</p>
                </div>

                <div className="p-4 rounded-xl bg-[#102820] border border-emerald-500/20 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-sm text-white">3. Agronomic AI</div>
                  <p className="text-[11px] text-slate-300">GA-PSO nutrient balance & 38-class computer vision diagnosis</p>
                </div>

                <div className="p-4 rounded-xl bg-[#102820] border border-emerald-500/20 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-sm text-white">4. Intervention</div>
                  <p className="text-[11px] text-slate-300">Automated micro-drip pump pulse & precision foliar remedy</p>
                </div>

                <div className="p-4 rounded-xl bg-[#102820] border border-emerald-500/20 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-sm text-white">5. Insurance</div>
                  <p className="text-[11px] text-slate-300">Parametric CHF trigger & automated NEFT digital indemnity</p>
                </div>

              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-400 border-t border-emerald-900/50 pt-4">
                <span className="font-mono text-[11px] text-emerald-400">
                  DETECT EARLY ↓ INTERVENE PRECISELY ↓ PRESERVE YIELD ↓ VERIFY OBJECTIVELY ↓ SETTLE AUTOMATICALLY
                </span>
                <span className="text-[11px]">Primary Pilot: Plot #204 Nadia District</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* KPI Benchmark Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((kpi, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl shadow-slate-900/5 hover:border-[#10B981] transition-all">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{kpi.value}</span>
                <span className="text-xs font-semibold text-[#059669]">{kpi.unit}</span>
              </div>
              <div className="font-bold text-sm text-slate-800 mt-1">{kpi.label}</div>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{kpi.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <span className="text-[11px] text-slate-500 italic">
            * Benchmark metrics represent university validation research models and simulation targets rather than commercial guarantees.
          </span>
        </div>
      </section>

      {/* The 6-Stage Process Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-[#059669] mb-2">
            Systematic Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            The 6-Stage Resilience Cycle
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            An end-to-end operational protocol that identifies anomalies days before optical leaf wilting occurs, preserving farmer yields first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-lg transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-[#059669] px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                    STAGE {s.step}
                  </span>
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                <div className="pt-2">
                  <Link href="/how-it-works" className="inline-flex items-center text-xs font-semibold text-[#059669] hover:text-emerald-700">
                    <span>Inspect details</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Portal Switcher Banner */}
      <section className="bg-slate-900 text-white py-16 tech-grid-pattern border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#34D399]">
                Role-Aware Operational Portals
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Built for Both the Field & the Underwriting Desk
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Farmers see plain-language advisories ("Crop Health: 71%", "Moisture: Normal", "Start Pump") 
                while Actuaries & Insurers examine full multi-spectral radar curves, Shannon entropy weight matrices, 
                and immutable cryptographic audit evidence packages.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/farmer/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold"
                >
                  Farmer Portal (Plot #204)
                </Link>
                <Link
                  href="/insurer/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold"
                >
                  Insurer Desk & Claims
                </Link>
                <Link
                  href="/intelligence/map"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold"
                >
                  Satellite GIS Map
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#071511] border border-[#10B981]/30 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#34D399]" />
                  <span className="font-semibold text-sm">Primary Live Demo Unit</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-[#34D399]">
                  Nadia / Aman Paddy
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Plot Identifier</div>
                  <div className="font-bold text-white text-sm">Plot #204 (Baganchra)</div>
                </div>
                <div>
                  <div className="text-slate-400">Crop Health Factor</div>
                  <div className="font-bold text-emerald-400 text-sm">0.71 (Optimal)</div>
                </div>
                <div>
                  <div className="text-slate-400">Soil Moisture (ESP32)</div>
                  <div className="font-bold text-white text-sm">58.0% VWC</div>
                </div>
                <div>
                  <div className="text-slate-400">Weather Risk</div>
                  <div className="font-bold text-emerald-400 text-sm">Low (Monsoon Inflow)</div>
                </div>
              </div>
              <Link
                href="/farmer/farms/farm-plot-204"
                className="w-full flex items-center justify-center py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition-colors"
              >
                Inspect Complete Plot #204 Telemetry &rarr;
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
