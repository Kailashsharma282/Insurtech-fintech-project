'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, CheckCircle2, Award, Clock, ArrowRight } from 'lucide-react';

export default function AiModelsAdminPage() {
  const models = [
    {
      name: 'MobileNetV3-PlantVillage-38',
      task: 'Foliar Crop Disease Classification',
      framework: 'PyTorch 2.4 / ONNX Runtime',
      accuracy: '92.9% Top-1 Precision',
      classes: '38 Diagnostic Classes',
      latency: '24ms (CPU Edge)',
      status: 'PRODUCTION DEPLOYED'
    },
    {
      name: 'GA-PSO Hybrid Nutrient Optimizer',
      task: 'Non-linear N-P-K & Water Recommendation',
      framework: 'Custom Bio-Inspired Heuristics',
      accuracy: '0.972 Fitness Peak',
      classes: '3 Major Crop Phenologies',
      latency: '142ms (Convergence)',
      status: 'PRODUCTION DEPLOYED'
    },
    {
      name: 'Shannon Entropy CHF Weighting Engine',
      task: 'Multi-Spectral & Radar Composite Index',
      framework: 'Information Entropy Dispersion Calculus',
      accuracy: 'r = 0.85 Yield Correlation',
      classes: '8 Continuous Spectral Inputs',
      latency: '8ms',
      status: 'PRODUCTION DEPLOYED'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            AI Models & Algorithm Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered neural architectures, objective weighting matrices, and heuristic optimizers.
          </p>
        </div>

        <div className="space-y-4">
          {models.map((m, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#059669] font-bold uppercase">{m.task}</span>
                  <h3 className="font-bold text-lg text-slate-900">{m.name}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                  {m.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Framework</span>
                  <strong className="text-slate-800">{m.framework}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Accuracy Benchmark</span>
                  <strong className="text-emerald-700">{m.accuracy}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Classes / Inputs</span>
                  <strong className="text-slate-800">{m.classes}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Inference Latency</span>
                  <strong className="text-blue-600">{m.latency}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
