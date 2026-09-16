'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Satellite, 
  CloudRain, 
  Radio, 
  UserCheck, 
  Calculator, 
  Calendar, 
  Sliders, 
  CheckCircle2, 
  History, 
  DollarSign, 
  ArrowRight, 
  AlertTriangle,
  Zap,
  Lock,
  FileText
} from 'lucide-react';
import { store } from '@/lib/db/store';
import { Claim } from '@/lib/types';

export default function ClaimDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = (params?.id as string) || 'claim-clm-084';
  
  const [claim, setClaim] = useState<Claim | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const c = store.getClaimById(claimId) || store.getClaimById('claim-clm-084');
    setClaim(c || null);
  }, [claimId]);

  if (!claim) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 text-center">
        <div className="p-8 max-w-md mx-auto bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-600 font-semibold text-sm">Loading Claim Evidence Package...</p>
        </div>
      </div>
    );
  }

  const handleVerify = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/claims/${claim.id}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setClaim({ ...data.data });
        setNotification('Claim verified against satellite & IoT thresholds.');
      }
    } catch {
      const updated = store.verifyClaim(claim.id);
      if (updated) setClaim({ ...updated });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/claims/${claim.id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setClaim({ ...data.data });
        setNotification(`Claim approved for ₹${claim.claimAmount.toLocaleString()}. Payout initiated.`);
      }
    } catch {
      const updated = store.approveClaim(claim.id);
      if (updated) setClaim({ ...updated });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayout = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/payouts/${claim.payoutRef || 'PAY-WB-2026-9084'}/execute`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        claim.status = 'DISBURSED';
        setClaim({ ...claim });
        setNotification(`Payout executed via RBI NEFT gateway to ${claim.farmerName}.`);
      }
    } catch {
      store.executePayout(claim.payoutRef || 'PAY-WB-2026-9084');
      claim.status = 'DISBURSED';
      setClaim({ ...claim });
    } finally {
      setActionLoading(false);
    }
  };

  const ev = claim.evidence;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Top Actions Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
              <Link href="/insurer/claims" className="hover:text-emerald-700">Claims Queue</Link>
              <span>/</span>
              <span>{claim.district} District</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{claim.claimNumber}</span>
            </div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight flex items-center space-x-3">
              <span>Claim Evidence Package: {claim.claimNumber}</span>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                claim.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800' :
                claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                claim.status === 'VERIFIED' ? 'bg-purple-100 text-purple-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                STATUS: {claim.status}
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Farmer: <strong>{claim.farmerName}</strong> &bull; Plot: <strong>{claim.plotNumber} ({claim.district})</strong> &bull; Policy: <strong>{claim.policyNumber}</strong>
            </p>
          </div>

          {/* Workflow Action Buttons (Verify, Approve, Payout) */}
          <div className="flex flex-wrap items-center gap-2">
            {claim.status === 'PENDING' && (
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Satellite & IoT Evidence</span>
              </button>
            )}

            {(claim.status === 'PENDING' || claim.status === 'VERIFIED') && (
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-emerald-950/10"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve Claim for ₹{claim.claimAmount.toLocaleString()}</span>
              </button>
            )}

            {claim.status === 'APPROVED' && (
              <button
                onClick={handlePayout}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#34D399] font-mono font-bold text-xs transition-colors flex items-center space-x-2 shadow-lg shadow-slate-950/20"
              >
                <DollarSign className="w-4 h-4" />
                <span>Execute Electronic Bank Settlement (NEFT)</span>
              </button>
            )}

            {claim.status === 'DISBURSED' && (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Disbursed to Bank Account &bull; Ref: {claim.payoutRef}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-950">Dismiss</button>
          </div>
        )}

        {/* Visual Timeline Required by Section 20: event -> detection -> verification -> calculation -> approval -> payout */}
        <div className="bg-[#071511] p-6 rounded-3xl text-white border border-[#10B981]/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#34D399]">
              Visual Parametric Lifecycle Timeline
            </span>
            <span className="text-xs font-mono text-slate-400">Total Turnaround: 4 Days</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40 space-y-1">
              <span className="text-[#34D399] block font-bold text-[11px]">1. Weather Event</span>
              <div className="text-white font-semibold text-xs">142mm Cloudburst</div>
              <span className="text-[9px] text-slate-400">08 Sep 14:00 IST</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40 space-y-1">
              <span className="text-[#34D399] block font-bold text-[11px]">2. Detection</span>
              <div className="text-white font-semibold text-xs">IoT 88.5% VWC</div>
              <span className="text-[9px] text-slate-400">08 Sep 14:32 UTC</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40 space-y-1">
              <span className="text-[#34D399] block font-bold text-[11px]">3. Verification</span>
              <div className="text-white font-semibold text-xs">Sentinel-2 Pass</div>
              <span className="text-[9px] text-slate-400">09 Sep 04:46 UTC</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40 space-y-1">
              <span className="text-[#34D399] block font-bold text-[11px]">4. Calculation</span>
              <div className="text-white font-semibold text-xs">CHF 0.49 &le; 0.55</div>
              <span className="text-[9px] text-slate-400">10 Sep 11:20 UTC</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40 space-y-1">
              <span className={`${claim.status === 'APPROVED' || claim.status === 'DISBURSED' ? 'text-[#34D399]' : 'text-slate-500'} block font-bold text-[11px]`}>
                5. Approval
              </span>
              <div className="text-white font-semibold text-xs">Chief Actuary Sign</div>
              <span className="text-[9px] text-slate-400">11 Sep 16:45 UTC</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40 space-y-1">
              <span className={`${claim.status === 'DISBURSED' ? 'text-[#34D399]' : 'text-slate-500'} block font-bold text-[11px]`}>
                6. Payout
              </span>
              <div className="text-white font-semibold text-xs">NEFT Cleared</div>
              <span className="text-[9px] text-slate-400">₹{claim.claimAmount.toLocaleString()}</span>
            </div>

          </div>
        </div>

        {/* 11 Complete Evidence Package Sections (Section 20) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Policy */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-[#059669]" />
              <span>Section 1: Policy Agreement & Coverage Scope</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Policy Number:</span><strong className="font-mono text-slate-900">{ev.policy.policyNumber}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Sum Insured:</span><strong className="text-slate-900 font-mono">₹{ev.policy.sumInsured.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Coverage Window:</span><span className="text-slate-800">{ev.policy.coverageWindow}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Parametric Trigger:</span><strong className="text-red-600 font-mono">CHF &le; {ev.policy.triggerChf}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Cryptographic Signature:</span><span className="font-mono text-[10px] text-slate-400">{ev.policy.verifiedSignature}</span></div>
            </div>
          </div>

          {/* Section 2: Satellite Evidence */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Satellite className="w-4 h-4 text-blue-600" />
              <span>Section 2: Satellite Earth Observation Evidence</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Sentinel Scene ID:</span><span className="font-mono text-[10px] text-slate-700">{ev.satelliteEvidence.sceneId}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Constellation:</span><strong className="text-slate-900">{ev.satelliteEvidence.satellite}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Acquisition Timestamp:</span><span className="font-mono text-slate-800">{ev.satelliteEvidence.acquisitionDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">NDVI Canopy Deficit:</span><strong className="text-red-600 font-mono">{ev.satelliteEvidence.ndviDropPct}%</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Sentinel-1 VH Radar Anomaly:</span><strong className="text-purple-600 font-mono">{ev.satelliteEvidence.vhAnomalydB} dB</strong></div>
            </div>
          </div>

          {/* Section 3: Weather Evidence */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <CloudRain className="w-4 h-4 text-cyan-600" />
              <span>Section 3: Weather Station Telemetry Evidence</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">IMD Weather Station:</span><span className="font-mono text-slate-900">{ev.weatherEvidence.stationId}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Recorded Precipitation:</span><strong className="text-blue-600 font-mono text-sm">{ev.weatherEvidence.recordedPrecipitationMm} mm (Past 48h)</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Historical Deviation:</span><strong className="text-red-600 font-mono">{ev.weatherEvidence.historicalDeviationPct}% Anomaly</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Consecutive Dry / Inflow Days:</span><span className="text-slate-800">{ev.weatherEvidence.consecutiveDryDays} days</span></div>
            </div>
          </div>

          {/* Section 4: IoT Evidence */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Radio className="w-4 h-4 text-[#059669]" />
              <span>Section 4: Field IoT Hardware Log Evidence</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Hardware Probe UID:</span><span className="font-mono text-slate-900">{ev.iotEvidence.deviceUid}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Average Root Moisture:</span><strong className="text-blue-600 font-mono">{ev.iotEvidence.averageRootMoisturePct}% VWC (Saturated)</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Soil Resistance:</span><span className="font-mono text-slate-800">{ev.iotEvidence.soilResistanceOhm} &Omega;</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Pump Uptime Log:</span><span className="text-slate-800">{ev.iotEvidence.pumpUptimeHours} hours</span></div>
            </div>
          </div>

          {/* Section 5: Ground Truth */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Section 5: Geotagged Ground Truth Field Appraisal</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Accredited Field Agent:</span><strong className="text-slate-900">{ev.groundTruth.fieldAgentName}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Survey Timestamp:</span><span className="font-mono text-slate-800">{ev.groundTruth.surveyDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Observed Canopy Stunting:</span><strong className="text-red-600 font-mono">{ev.groundTruth.observedStuntingPct}%</strong></div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 italic">
                "{ev.groundTruth.verificationNotes}"
              </div>
            </div>
          </div>

          {/* Section 6: CHF Calculation */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calculator className="w-4 h-4 text-[#059669]" />
              <span>Section 6: Shannon Entropy Weighted CHF Output</span>
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-900 text-emerald-400 p-2 rounded-lg text-[11px]">{ev.chfCalculation.formula}</div>
              <div className="flex justify-between"><span className="text-slate-500">Calculated Composite CHF:</span><strong className="text-red-600 text-sm font-black">{ev.chfCalculation.calculatedChf}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Entropy Weights:</span><span className="text-slate-700 text-[11px]">NDVI: 22%, LSWI: 18%, VH: 24%, Rain: 20%</span></div>
            </div>
          </div>

          {/* Section 7: Baseline Comparison */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-[#059669]" />
              <span>Section 7: 4-Year Localized Baseline Comparison</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Historical Crop Normal:</span><strong className="font-mono text-slate-900">{ev.baseline.historicalNormalChf}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">4-Year Track (2022–2025):</span><span className="font-mono text-slate-700">[{ev.baseline.fourYearAverage.join(', ')}]</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Standard Deviation (&sigma;):</span><strong className="text-red-600 font-mono">{ev.baseline.deviationSigma} &sigma; (Severe Outlier)</strong></div>
            </div>
          </div>

          {/* Section 8: Correction Factor */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>Section 8: Management & Terminal-Event Correction</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Management Bias Adjustment:</span><span className="font-mono text-slate-900">+{ev.correctionFactor.managementBiasAdjustment}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Terminal Event Factor:</span><span className="font-mono text-slate-900">0.00</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Final Evaluated Loss Ratio:</span><strong className="text-slate-900 font-mono text-sm">{(ev.correctionFactor.finalLossRatio * 100).toFixed(1)}%</strong></div>
            </div>
          </div>

          {/* Section 9: Decision Rule */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Section 9: Actuarial Parametric Decision Rule</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px]">
                {ev.decisionRule.triggerCondition} &rarr; <strong className="text-emerald-700">{ev.decisionRule.evaluationResult}</strong>
              </div>
              <div className="flex justify-between"><span className="text-slate-500">Payout Tier Indemnity:</span><strong className="text-slate-900 font-mono">{ev.decisionRule.payoutTierPct}% of Sum Insured</strong></div>
            </div>
          </div>

          {/* Section 10: Audit Trail */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
              <History className="w-4 h-4 text-slate-600" />
              <span>Section 10: Immutable SHA-256 Event Chain</span>
            </h3>
            <div className="space-y-2 text-[11px] font-mono">
              {ev.auditTrail.map((step, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="text-slate-800">{step.step}</span>
                  <span className="text-slate-400 text-[10px]">{step.hashSha256}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 11: Payout Instruction */}
          <div className="md:col-span-2 bg-[#071511] p-6 sm:p-7 rounded-3xl text-white border border-[#10B981]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div className="flex items-center space-x-2 text-[#34D399] font-bold text-base">
                <DollarSign className="w-5 h-5" />
                <span>Section 11: Electronic Direct Benefit Payout Order</span>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded bg-emerald-500/20 text-[#34D399]">
                RBI NEFT GATEWAY READY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-slate-400 block text-[10px]">Net Payout Amount</span>
                <strong className="text-2xl text-[#34D399] font-black mt-0.5 block">₹{ev.payout.amountInr.toLocaleString()}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-slate-400 block text-[10px]">Beneficiary Account</span>
                <strong className="text-sm text-white font-bold mt-1 block">{ev.payout.beneficiaryAccount}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-slate-400 block text-[10px]">IFSC Code</span>
                <strong className="text-sm text-white font-bold mt-1 block">{ev.payout.ifsc}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-slate-400 block text-[10px]">Bank UTR Reference</span>
                <strong className="text-xs text-amber-300 font-bold mt-1 block">{ev.payout.bankReferenceId}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
