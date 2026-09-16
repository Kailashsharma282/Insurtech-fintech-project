'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Satellite, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Activity, 
  Calculator, 
  Calendar 
} from 'lucide-react';

export default function TechnologyOverviewPage() {
  const modules = [
    {
      title: 'Early Stress Detection',
      href: '/technology/stress',
      icon: Activity,
      badge: 'Spectral & Radar Sensitivity',
      desc: 'How UV-NDVI and Sentinel-1 VH cross-polarization radar detect cellular moisture and canopy collapse 4 to 7 days before optical yellowing manifests.'
    },
    {
      title: 'Shannon Entropy CHF Engine',
      href: '/technology/chf',
      icon: Calculator,
      badge: 'Mathematical Pipeline',
      desc: 'Transparent multi-criteria weighting algorithm eliminating black-box bias through objective information dispersion calculations.'
    },
    {
      title: '4-Year Localized Baseline',
      href: '/technology/baseline',
      icon: Calendar,
      badge: 'Stratified Normalization',
      desc: 'Distinguishing normal seasonal phenology from catastrophic regional weather events across Nadia, Burdwan, Hooghly, and Murshidabad.'
    },
    {
      title: 'GA-PSO Hybrid Nutrient Optimizer',
      href: '/farmer/optimization',
      icon: Cpu,
      badge: 'Bio-Inspired Convergence',
      desc: 'Genetic algorithms search broad variable space; particle swarm optimization zeroes in on micro-dosed N-P-K and irrigation prescriptions.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
            <span>Engineering Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Transparent Agronomic & Actuarial Technology
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            No black boxes. Discover the mathematical formulas, radar backscatter mechanics, and telemetry architectures powering AgriSure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-md hover:shadow-xl transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#059669]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">{m.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{m.desc}</p>
                <div className="pt-2">
                  <Link
                    href={m.href}
                    className="inline-flex items-center text-sm font-semibold text-[#059669] hover:text-emerald-700"
                  >
                    <span>Explore module specifications</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* High-Level Tech Stack Banner */}
        <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg text-white mb-2">Satellite Layer</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sentinel-2 Multi-Spectral Instrument (10m BOA reflectance) fused with Sentinel-1 C-SAR Dual-Polarization (VV+VH) for cloud-penetrating moisture tracking.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-white mb-2">Agronomic AI Backbone</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                MobileNetV3 38-class leaf pathology model coupled with bio-inspired GA-PSO optimization for non-linear nutrient interaction curves.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-white mb-2">Parametric Ledger</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated index evaluation with SHA-256 evidence anchoring, PostGIS spatial boundary intersection, and simulated instant bank settlement dispatch.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
