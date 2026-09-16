'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building, 
  Layers, 
  Sprout, 
  Zap, 
  AlertCircle, 
  Volume2, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';
import { useLanguage } from '@/context/LanguageContext';
import { useRole } from '@/context/RoleContext';

interface PlotOption {
  id: string;
  plotNumber: string;
  crop: string;
  areaHa: number;
  district: string;
  insuranceUnitCode: string;
  defaultSumInsured: number;
}

const AVAILABLE_PLOTS: PlotOption[] = [
  {
    id: 'farm-plot-204',
    plotNumber: 'Plot #204',
    crop: 'Aman Paddy',
    areaHa: 2.8,
    district: 'Nadia (Baganchra)',
    insuranceUnitCode: 'WB-NAD-001',
    defaultSumInsured: 140000,
  },
  {
    id: 'farm-plot-205',
    plotNumber: 'Plot #205',
    crop: 'Jute',
    areaHa: 1.5,
    district: 'Nadia (Santipur)',
    insuranceUnitCode: 'WB-NAD-001',
    defaultSumInsured: 75000,
  },
  {
    id: 'farm-plot-212',
    plotNumber: 'Plot #212',
    crop: 'Potato',
    areaHa: 3.2,
    district: 'Nadia (Ranaghat)',
    insuranceUnitCode: 'WB-NAD-002',
    defaultSumInsured: 192000,
  },
];

export default function FarmerInsuranceApplyPage() {
  const router = useRouter();
  const { language, t, isSpeaking, playVoiceAdvisory } = useLanguage();
  const { user } = useRole();

  const [selectedPlotId, setSelectedPlotId] = useState<string>('farm-plot-204');
  const [coverageTier, setCoverageTier] = useState<'BASELINE' | 'COMPREHENSIVE'>('COMPREHENSIVE');
  const [bankAccountVerified, setBankAccountVerified] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedPolicy, setSubmittedPolicy] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPlot = AVAILABLE_PLOTS.find(p => p.id === selectedPlotId) || AVAILABLE_PLOTS[0];

  // Financial calculations with 80% PMFBY subsidy
  const sumInsured = coverageTier === 'COMPREHENSIVE' ? selectedPlot.defaultSumInsured : Math.round(selectedPlot.defaultSumInsured * 0.85);
  const grossPremium = Math.round(sumInsured * (coverageTier === 'COMPREHENSIVE' ? 0.05 : 0.04));
  const govtSubsidy = Math.round(grossPremium * 0.80);
  const farmerPayable = grossPremium - govtSubsidy; // 20% farmer share (~2% of sum insured)
  const triggerChf = coverageTier === 'COMPREHENSIVE' ? 0.58 : 0.55;

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        farmerId: user?.id || 'farmer-1',
        farmerName: user?.name || 'Subhash Biswas',
        farmId: selectedPlot.id,
        farmPlot: selectedPlot.plotNumber,
        insuranceUnitCode: selectedPlot.insuranceUnitCode,
        crop: selectedPlot.crop,
        sumInsured,
        premiumAmount: grossPremium,
        subsidyAmount: govtSubsidy,
        farmerShare: farmerPayable,
        triggerChf,
        underwriterNotes: `Applied online via Farmer Web Portal (${coverageTier} Tier)`
      };

      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmittedPolicy(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 pb-28 md:pb-16 text-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <Link
              href="/farmer/insurance"
              className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>{t('ins.view_policies')}</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <span>{t('ins.apply_title')}</span>
              <span className="text-xl">🛡️</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('ins.apply_subtitle')}
            </p>
          </div>

          {/* Regional Speech Button (Audio Assistance for Low-Literacy Farmers) */}
          <button
            type="button"
            onClick={playVoiceAdvisory}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shadow-md shrink-0 ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 animate-pulse shadow-amber-500/50'
                : 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-emerald-950/20'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? t('guide.audio_speaking') : t('guide.audio_prompt')}</span>
          </button>
        </div>

        {/* Success Screen if already submitted */}
        {submittedPolicy ? (
          <Card3D depth={8} glowColor="rgba(16, 185, 129, 0.3)" className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-300 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold font-mono">
                🟡 {t('ins.status_pending')}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Application Successfully Lodged!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your application for <strong>{submittedPolicy.crop} ({submittedPolicy.farmPlot})</strong> has been logged into the underwriting registry with policy ref:
              </p>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-700 bg-emerald-50 py-2 px-4 rounded-xl inline-block border border-emerald-200">
                {submittedPolicy.policyNumber}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-xl mx-auto text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Sum Insured</span>
                <strong className="text-sm text-slate-900 block mt-0.5">₹{submittedPolicy.sumInsured.toLocaleString()}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Govt Subsidy</span>
                <strong className="text-sm text-emerald-700 block mt-0.5">₹{submittedPolicy.subsidyAmount.toLocaleString()}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Farmer Share</span>
                <strong className="text-sm text-slate-900 block mt-0.5">₹{submittedPolicy.farmerShare.toLocaleString()}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Trigger (CHF)</span>
                <strong className="text-sm text-amber-700 block mt-0.5">&le; {submittedPolicy.triggerChf}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-lg mx-auto text-left leading-relaxed">
              <strong>Next Step for Underwriter:</strong> An underwriter from the insurance company will review your historical satellite baseline. Once verified, the status will turn to <strong>🟢 ACTIVE</strong> and automatic index protection will commence.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/farmer/insurance"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                {t('ins.view_policies')}
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedPolicy(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 transition-colors"
              >
                Submit Another Plot Application
              </button>
            </div>
          </Card3D>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-6 sm:space-y-8">
            
            {/* Step 1: Select Plot */}
            <Card3D depth={4} glowOnHover={false} className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-[#0F172A]">
                    {t('ins.select_plot')}
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold">➡️ {t('guide.arrow_next')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {AVAILABLE_PLOTS.map((plot) => {
                  const isSelected = selectedPlotId === plot.id;
                  return (
                    <div
                      key={plot.id}
                      onClick={() => setSelectedPlotId(plot.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-emerald-50/80 border-[#10B981] shadow-md shadow-emerald-950/10'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-[#0F172A]">{plot.plotNumber}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                      </div>
                      <div className="font-black text-sm text-slate-900">{plot.crop}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{plot.areaHa} ha &bull; {plot.district}</div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex justify-between text-xs">
                        <span className="text-slate-500">Coverage:</span>
                        <strong className="text-emerald-700 font-mono">₹{plot.defaultSumInsured.toLocaleString()}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card3D>

            {/* Step 2: Choose Coverage Shield Tier */}
            <Card3D depth={4} glowOnHover={false} className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-[#0F172A]">
                    {t('ins.select_plan')}
                  </h3>
                </div>
                <span className="text-xs text-blue-700 font-bold">➡️ {t('guide.arrow_next')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Baseline Shield */}
                <div
                  onClick={() => setCoverageTier('BASELINE')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    coverageTier === 'BASELINE'
                      ? 'bg-blue-50/80 border-blue-600 shadow-md shadow-blue-950/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase font-mono">PMFBY Standard</span>
                    {coverageTier === 'BASELINE' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Weather Shock Baseline Shield</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Triggered if satellite Crop Health Factor drops below <strong>0.550</strong> due to extreme rain deficit or sudden unseasonal inundation.
                  </p>
                  <div className="text-xs text-slate-500 pt-1 font-mono">
                    Statutory Kharif Rate: <strong>2.0% Farmer Premium</strong>
                  </div>
                </div>

                {/* Comprehensive Shield */}
                <div
                  onClick={() => setCoverageTier('COMPREHENSIVE')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    coverageTier === 'COMPREHENSIVE'
                      ? 'bg-emerald-50/80 border-[#10B981] shadow-md shadow-emerald-950/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 uppercase font-mono">Recommended ★</span>
                    {coverageTier === 'COMPREHENSIVE' && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Comprehensive Parametric Shield</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    High sensitivity trigger at <strong>CHF &le; 0.580</strong>. Covers heatwaves, localized pest outbreak vectors, and persistent moisture stress.
                  </p>
                  <div className="text-xs text-emerald-800 pt-1 font-mono font-bold">
                    80% Central & State Subsidy Applied
                  </div>
                </div>
              </div>
            </Card3D>

            {/* Step 3: Subsidy & Premium Breakdown */}
            <Card3D depth={4} glowOnHover={false} className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-[#0F172A]">
                    {t('ins.premium_calc')}
                  </h3>
                </div>
                <span className="text-xs text-amber-700 font-bold">➡️ {t('guide.arrow_next')}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-600">{t('ins.sum_insured')}:</span>
                  <strong className="text-base text-slate-900">₹{sumInsured.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-600">{t('ins.gross_premium')}:</span>
                  <span className="text-slate-800">₹{grossPremium.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-emerald-700">
                  <span className="font-bold">{t('ins.govt_subsidy')}:</span>
                  <span className="font-bold">- ₹{govtSubsidy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                  <strong className="text-slate-900 font-black">{t('ins.farmer_pays')}:</strong>
                  <strong className="text-emerald-700 font-black text-lg">₹{farmerPayable.toLocaleString()}</strong>
                </div>
              </div>
            </Card3D>

            {/* Step 4: Bank Account Direct Benefit Transfer (DBT) Verification */}
            <Card3D depth={4} glowOnHover={false} className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-[#0F172A]">
                    {t('ins.bank_verify')}
                  </h3>
                </div>
                <span className="text-xs text-teal-700 font-bold">🟢 Verified</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Punjab National Bank (Santipur Branch)</div>
                    <div className="text-slate-500 font-mono">A/c: •••• •••• 8420 &bull; IFSC: PUNB0120111</div>
                  </div>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aadhaar DBT Linked</span>
                </div>
              </div>
            </Card3D>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 5: Large Accessible Submit Button with Arrows */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 px-6 rounded-3xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:from-[#34D399] hover:to-[#10B981] text-white font-black text-base sm:text-lg shadow-xl shadow-emerald-950/30 transition-all transform active:scale-95 flex items-center justify-center space-x-3"
              >
                <span>{submitting ? t('ins.submitting') : t('ins.submit_app')}</span>
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
