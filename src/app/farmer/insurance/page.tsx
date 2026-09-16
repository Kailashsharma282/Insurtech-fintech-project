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
import { SEED_POLICIES } from '@/lib/db/seed-data';

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
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 pb-28 md:pb-16 text-[#0F172A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Parametric Crop Insurance Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              {t('ins.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">{isSpeaking ? 'Playing...' : 'Voice Advice'}</span>
            </button>

            {/* Apply New Policy CTA */}
            <Link
              href="/farmer/insurance/apply"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('ins.apply_title')}</span>
              <span>➡️</span>
            </Link>
          </div>
        </div>

        {/* Directional Banner if regional language active */}
        {language !== 'en' && (
          <div className="p-4 rounded-3xl bg-amber-500/15 border-2 border-amber-500/50 text-amber-950 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧭</span>
              <span>{t('guide.step4')} - নতুন ফসল বীমা আবেদনের জন্য সবুজ বোতামটি চাপুন ➡️</span>
            </div>
            <Link
              href="/farmer/insurance/apply"
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-black hover:bg-amber-700 transition-colors shrink-0"
            >
              👉 {t('ins.apply_new')}
            </Link>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'ALL' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Policies ({policies.length})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🟢 Active ({policies.filter(p => p.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setFilter('PENDING_APPROVAL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'PENDING_APPROVAL' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🟡 Pending Review ({policies.filter(p => p.status === 'PENDING_APPROVAL').length})
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              filter === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🔴 Rejected ({policies.filter(p => p.status === 'REJECTED').length})
          </button>
        </div>

        {/* Policies List */}
        <div className="space-y-6">
          {filteredPolicies.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">No policies found for this status</h3>
              <p className="text-xs text-slate-500">Apply for a new policy or change your filter selection.</p>
              <Link
                href="/farmer/insurance/apply"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-bold"
              >
                Apply Now ➡️
              </Link>
            </div>
          ) : (
            filteredPolicies.map((policy) => {
              const isActive = policy.status === 'ACTIVE';
              const isPending = policy.status === 'PENDING_APPROVAL';
              const isRejected = policy.status === 'REJECTED';

              return (
                <Card3D
                  key={policy.id}
                  depth={6}
                  glowColor={isActive ? 'rgba(16, 185, 129, 0.3)' : (isPending ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.2)')}
                  className={`p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 ${
                    isActive 
                      ? 'bg-[#071511] text-white border border-[#10B981]/40' 
                      : (isPending 
                          ? 'bg-[#15130A] text-white border border-amber-500/40' 
                          : 'bg-[#180A0A] text-white border border-red-500/40')
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-[#34D399] uppercase tracking-wider font-bold">
                          {policy.crop} &bull; {policy.farmPlot}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">IU: {policy.insuranceUnitCode}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                        {policy.policyNumber}
                      </h2>
                      <div className="text-xs text-slate-400 mt-1">
                        Applicant: <strong className="text-white">{policy.farmerName}</strong> &bull; Period: <span className="font-mono">{policy.startDate} &rarr; {policy.endDate}</span>
                      </div>
                    </div>

                    <div>
                      {isActive && (
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-[#34D399] border border-emerald-500/40 text-xs font-black font-mono inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('ins.status_approved')}</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black font-mono inline-flex items-center gap-1.5 animate-pulse">
                          <Clock className="w-4 h-4" />
                          <span>{t('ins.status_pending')}</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black font-mono inline-flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          <span>{t('ins.status_rejected')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t('ins.sum_insured')}</span>
                      <strong className="text-lg sm:text-xl text-emerald-400 font-black mt-1 block">
                        ₹{policy.sumInsured.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t('ins.farmer_pays')}</span>
                      <strong className="text-lg sm:text-xl text-white font-black mt-1 block">
                        ₹{policy.farmerShare.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">PMFBY Subsidy (80%)</span>
                      <strong className="text-lg sm:text-xl text-emerald-300 font-black mt-1 block">
                        ₹{policy.subsidyAmount.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t('ins.trigger_condition')}</span>
                      <strong className="text-lg sm:text-xl text-amber-400 font-black mt-1 block">
                        CHF &le; {policy.triggerChf}
                      </strong>
                    </div>
                  </div>

                  {/* Rejection Details & Underwriter Notes */}
                  {isRejected && (
                    <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-red-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Rejection Reason: {policy.rejectionReason || 'EXCEEDS_SPATIAL_IU_RISK_CAP'}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Underwriter Note: {policy.underwriterNotes || 'Spatial risk concentration in the designated cluster exceeds underwriting risk cap. Review other eligible plots.'}
                      </p>
                    </div>
                  )}

                  {/* Pending Review Details */}
                  {isPending && (
                    <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-300">
                        <Clock className="w-4 h-4" />
                        <span>Awaiting Underwriter Satellite Cross-Check</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {policy.underwriterNotes || 'Submitted online. Remote sensing historical baseline index is being computed. The insurer desk can accept or reject this application.'}
                      </p>
                    </div>
                  )}

                  {/* Active Policy Status & Payout Trigger */}
                  {isActive && (
                    <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <strong>Autonomous Parametric Index Protection Active:</strong> Monitored via Sentinel-2 & AWS weather telemetry. Direct RBI NEFT payout to linked PNB account upon CHF drop.
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-[#34D399] font-bold shrink-0 font-mono text-[11px]">
                        🟢 {t('ins.zero_breaches')}
                      </span>
                    </div>
                  )}
                </Card3D>
              );
            })
          )}
        </div>

        {/* Floating Apply CTA for easy access on mobile */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Need coverage for another field plot?</h3>
            <p className="text-xs text-slate-500">Apply for seasonal Kharif/Rabi index protection with 80% Central & State PMFBY subsidy.</p>
          </div>
          <Link
            href="/farmer/insurance/apply"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white font-black text-xs shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <span>👉 {t('ins.apply_new')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
