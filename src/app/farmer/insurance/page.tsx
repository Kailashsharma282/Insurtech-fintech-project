'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, ArrowRight, Clock, Building } from 'lucide-react';
import { SEED_POLICIES } from '@/lib/db/seed-data';

export default function FarmerInsurancePage() {
  const policy = SEED_POLICIES[0]; // Plot #204 policy

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Parametric Insurance Coverage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated index-based protection backing up Plot #204 Aman Paddy against extreme climatic shocks.
          </p>
        </div>

        {/* Policy Details Card */}
        <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5">
            <div>
              <span className="text-[10px] font-mono text-[#34D399] uppercase tracking-wider">
                Active Parametric Policy
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {policy.policyNumber}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                Insured Plot: <strong className="text-white">{policy.farmPlot} (2.8 ha)</strong> &bull; Crop: <strong className="text-white">{policy.crop}</strong>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-[#34D399] border border-emerald-500/30 text-xs font-bold font-mono">
              ACTIVE & SECURED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#102820] border border-emerald-900/40">
              <span className="text-slate-400 block text-[10px]">Total Sum Insured</span>
              <strong className="text-xl text-emerald-400 font-bold mt-1 block">₹{policy.sumInsured.toLocaleString()}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-[#102820] border border-emerald-900/40">
              <span className="text-slate-400 block text-[10px]">Farmer Premium Share</span>
              <strong className="text-xl text-white font-bold mt-1 block">₹{policy.farmerShare.toLocaleString()}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-[#102820] border border-emerald-900/40">
              <span className="text-slate-400 block text-[10px]">Govt Subsidy Share</span>
              <strong className="text-xl text-white font-bold mt-1 block">₹{policy.subsidyAmount.toLocaleString()}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-[#102820] border border-emerald-900/40">
              <span className="text-slate-400 block text-[10px]">Trigger Threshold</span>
              <strong className="text-xl text-amber-400 font-bold mt-1 block">&le; {policy.triggerChf}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#102820] border border-emerald-900/40 text-xs text-slate-300 leading-relaxed">
            <strong>Index Trigger Definition:</strong> When the 14-day rolling Crop Health Factor (CHF) drops below 0.550 due to verifiable weather shocks (e.g. unseasonal flooding or prolonged drought), an automated direct payout is dispatched directly to the linked Punjab National Bank account (•••• 8420) without paper claim forms.
          </div>
        </div>

        {/* Claim Status for Farmer */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">Claims & Settlement Status</h3>
              <p className="text-xs text-slate-500">Autonomous parametric tracking for the 2026 Kharif season</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              No Active Loss Breaches
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
            <h4 className="font-bold text-sm text-slate-900">Your Crop Is Flourishing Within Safe Bounds</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Current Crop Health Factor is <strong>0.71</strong>, safely above the <strong>0.550</strong> claim threshold. 
              The yield-preservation system has successfully avoided crop failure.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
