'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Clock, 
  Building, 
  XCircle, 
  Sparkles, 
  Volume2, 
  RefreshCw, 
  Plus 
} from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';
import { useLanguage } from '@/context/LanguageContext';
import { useRole } from '@/context/RoleContext';
import { Policy } from '@/lib/types';
import { SEED_POLICIES, SEED_FARMS } from '@/lib/db/seed-data';

export default function FarmerInsurancePage() {
  const { language, t, isSpeaking, playVoiceAdvisory } = useLanguage();
  const { user } = useRole();
  const [policies, setPolicies] = useState<Policy[]>(SEED_POLICIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED'>('ALL');

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/policies');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPolicies(data.data);
      }
    } catch {
      // Fallback to seed data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 sm:py-12 pb-28 md:pb-16 text-[#0F172A] dark:text-slate-100 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Parametric Crop Insurance Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('ins.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Real-time index protection, automated claim qualification, and direct DBT bank settlement.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Audio Advisory Button */}
            <button
              type="button"
              onClick={playVoiceAdvisory}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">{isSpeaking ? 'Playing...' : 'Voice Advice'}</span>
            </button>

            {/* Apply New Policy CTA */}
            <Link
              href="/farmer/insurance/apply"
              className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-900/20 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('ins.apply_title')}</span>
              <span>➡️</span>
            </Link>
          </div>
        </div>

        {/* Directional Banner if regional language active */}
        {language !== 'en' && (
          <div className="p-4 rounded-3xl bg-amber-500/15 border-2 border-amber-500/50 text-amber-950 dark:text-amber-200 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧭</span>
              <span>{t('guide.step4')} - নতুন ফসল বীমা আবেদনের জন্য বোতামটি চাপুন ➡️</span>
            </div>
            <Link
              href="/farmer/insurance/apply"
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-black hover:bg-amber-700 transition-colors shrink-0"
            >
              👉 {t('ins.apply_new')}
            </Link>
          </div>
        )}

        {/* Ghatal CHF Insurance Validation Callout */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                Ghatal Block PMFBY Registry
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">10-Season Benchmark</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white break-words">
              Validate Insurance Claims with Multi-Satellite CHF
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Inspect official village yield benchmarks (2017-18 to 2026-27), candidate farmer registry, and test live indemnity determination with calculated CHF.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Link
              href="/farmer/insurance-validation"
              className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Open Validation Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

                {/* Official Parametric CHF Subsidy Matrix (Direct from Field Rate Sheet) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  Calibrated Rate Sheet
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Per Hectare Scale</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                Official Parametric CHF Subsidy & Indemnity Matrix
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Direct statutory bank transfer (DBT) indemnity determined by measured Crop Health Factor (CHF) from Sentinel-2 & SAR imagery.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-mono text-[11px] font-bold self-start sm:self-center shrink-0">
              100% Guaranteed Payout
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-red-900 dark:text-red-200">0.0 – 0.2 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white">Severe</span>
                </div>
                <div className="text-xl font-black text-red-700 dark:text-red-400 mt-2">
                  ₹15,000 <span className="text-xs font-semibold">/ ha</span>
                </div>
              </div>
              <p className="text-[11px] text-red-800 dark:text-red-300 mt-2 font-sans font-medium">Severe inundation / loss</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-orange-900 dark:text-orange-200">0.2 – 0.4 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-600 text-white">High</span>
                </div>
                <div className="text-xl font-black text-orange-700 dark:text-orange-400 mt-2">
                  ₹12,000 <span className="text-xs font-semibold">/ ha</span>
                </div>
              </div>
              <p className="text-[11px] text-orange-800 dark:text-orange-300 mt-2 font-sans font-medium">High crop stress / deficit</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-900 dark:text-amber-200">0.4 – 0.6 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-600 text-white">Moderate</span>
                </div>
                <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-2">
                  ₹8,000 <span className="text-xs font-semibold">/ ha</span>
                </div>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-2 font-sans font-medium">Moderate deficit / watch</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">0.6 – 0.8 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white">Normal</span>
                </div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                  No Subsidy
                </div>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">Normal crop health</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">0.8 – 1.0 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-700 text-white">Optimal</span>
                </div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                  No Subsidy
                </div>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">Optimal canopy vigor</p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'ALL' 
                ? 'bg-slate-900 text-white dark:bg-blue-600' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            All Policies ({policies.length})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'ACTIVE' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            🟢 Active ({policies.filter(p => p.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setFilter('PENDING_APPROVAL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'PENDING_APPROVAL' 
                ? 'bg-amber-500 text-slate-950 font-black' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            🟡 Pending Review ({policies.filter(p => p.status === 'PENDING_APPROVAL').length})
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'REJECTED' 
                ? 'bg-red-600 text-white font-bold' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            🔴 Rejected ({policies.filter(p => p.status === 'REJECTED').length})
          </button>
        </div>

        {/* Policies List */}
        <div className="space-y-6">
          {filteredPolicies.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300">No policies found for this status</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Apply for a new policy or change your filter selection.</p>
              <Link
                href="/farmer/insurance/apply"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Apply Now ➡️
              </Link>
            </div>
          ) : (
            filteredPolicies.map((policy) => {
              const isActive = policy.status === 'ACTIVE';
              const isPending = policy.status === 'PENDING_APPROVAL';
              const isRejected = policy.status === 'REJECTED';
              const farmMatch = SEED_FARMS.find(f => f.id === policy.farmId || f.plotNumber === policy.farmPlot);
              const farmAcreage = farmMatch?.acreage || 2.8;

              return (
                <div
                  key={policy.id}
                  className={`p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-6 bg-white dark:bg-slate-900 border ${
                    isActive 
                      ? 'border-slate-200 dark:border-slate-800' 
                      : (isPending 
                          ? 'border-amber-300 dark:border-amber-700/60' 
                          : 'border-red-300 dark:border-red-700/60')
                  }`}
                >
                  {/* Policy Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">
                          {policy.crop} &bull; {policy.farmPlot}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                          IU: {policy.insuranceUnitCode}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {policy.policyNumber}
                      </h2>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2">
                        <span>Applicant: <strong className="text-slate-900 dark:text-slate-100 font-bold">{policy.farmerName || 'Subhash Mondal'}</strong></span>
                        <span>&bull;</span>
                        <span>Period: <strong className="font-mono text-slate-800 dark:text-slate-200">{policy.startDate} &rarr; {policy.endDate}</strong></span>
                      </div>
                    </div>

                    <div>
                      {isActive && (
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-black font-mono inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{t('ins.status_approved')}</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold font-mono inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>{t('ins.status_pending')}</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-300 border border-red-300 dark:border-red-700 text-xs font-black font-mono inline-flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span>{t('ins.status_rejected')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial & Statutory CHF Subsidy Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          SUBSIDY RATE
                        </span>
                        <span className="text-[9px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/70 px-1.5 py-0.5 rounded">Max ₹15k/ha</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-red-700 dark:text-red-400 font-black mt-1.5 block">
                        ₹15,000 <span className="text-xs font-bold">/ ha</span>
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Statutory CHF subsidy scale
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          MAX PLOT SUBSIDY
                        </span>
                        <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-1.5 py-0.5 rounded">{farmAcreage} ha Plot</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-blue-700 dark:text-blue-400 font-black mt-1.5 block">
                        ₹{(farmAcreage * 15000).toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        ₹15,000/ha × {farmAcreage} ha Direct DBT
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          FARMER SHARE
                        </span>
                        <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded">20% Share</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-slate-900 dark:text-white font-black mt-1.5 block">
                        ₹{policy.farmerShare.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Govt Subsidy: ₹{policy.subsidyAmount.toLocaleString()} (80%)
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          TRIGGER CONDITION
                        </span>
                        <span className="text-[9px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.5 rounded">CHF Trigger</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-amber-700 dark:text-amber-400 font-black mt-1.5 block">
                        CHF ≤ 0.60
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Direct bank credit upon drop
                      </span>
                    </div>
                  </div>

                  {/* Statutory CHF Subsidy & Plot Payout Breakdown Table */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                          Statutory CHF Subsidy Matrix — {policy.farmPlot} ({farmAcreage} ha)
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">
                        Direct RBI NEFT DBT Credit to Farmer Bank Account
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-red-900 dark:text-red-200">0.0 – 0.2 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white">Severe</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-red-700 dark:text-red-400 mt-1">
                            ₹15,000 <span className="text-[10px] font-normal text-slate-500">/ ha</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-red-200/60 dark:border-red-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-red-900 dark:text-red-200 font-black">₹{(farmAcreage * 15000).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-orange-900 dark:text-orange-200">0.2 – 0.4 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-orange-600 text-white">High</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-orange-700 dark:text-orange-400 mt-1">
                            ₹12,000 <span className="text-[10px] font-normal text-slate-500">/ ha</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-orange-200/60 dark:border-orange-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-orange-900 dark:text-orange-200 font-black">₹{(farmAcreage * 12000).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-amber-900 dark:text-amber-200">0.4 – 0.6 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-600 text-white">Moderate</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-400 mt-1">
                            ₹8,000 <span className="text-[10px] font-normal text-slate-500">/ ha</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-amber-200/60 dark:border-amber-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-amber-900 dark:text-amber-200 font-black">₹{(farmAcreage * 8000).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-emerald-900 dark:text-emerald-200">&gt; 0.6 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white">Normal</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 mt-1">
                            No Subsidy
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-emerald-200/60 dark:border-emerald-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-emerald-900 dark:text-emerald-200 font-black">₹0 (Healthy)</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Details & Underwriter Notes */}
                  {isRejected && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-700/60 text-xs text-red-900 dark:text-red-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-red-800 dark:text-red-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Rejection Reason: {policy.rejectionReason || 'EXCEEDS_SPATIAL_IU_RISK_CAP'}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        Underwriter Note: {policy.underwriterNotes || 'Spatial risk concentration in the designated cluster exceeds underwriting risk cap. Review other eligible plots.'}
                      </p>
                    </div>
                  )}

                  {/* Pending Review Details */}
                  {isPending && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/60 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                        <Clock className="w-4 h-4" />
                        <span>Awaiting Underwriter Satellite Cross-Check</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {policy.underwriterNotes || 'Submitted online. Remote sensing historical baseline index is being computed. The insurer desk can accept or reject this application.'}
                      </p>
                    </div>
                  )}

                  {/* Active Policy Status & Payout Trigger */}
                  {isActive && (
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-800/90 border border-blue-200 dark:border-blue-700/60 text-xs text-slate-800 dark:text-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="leading-relaxed">
                        <strong className="text-slate-900 dark:text-white">Autonomous Parametric Index Protection Active:</strong> Monitored via Sentinel-2 & AWS weather telemetry. Direct RBI NEFT payout to linked PNB account upon CHF drop.
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold shrink-0 font-mono text-[11px] inline-flex items-center gap-1.5 shadow-xs">
                        <span>🟢</span>
                        <span>{t('ins.zero_breaches')}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Floating Apply CTA for easy access on mobile */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Need coverage for another field plot?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Apply for seasonal Kharif/Rabi index protection with 80% Central & State PMFBY subsidy.</p>
          </div>
          <Link
            href="/farmer/insurance/apply"
            className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <span>👉 {t('ins.apply_new')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
