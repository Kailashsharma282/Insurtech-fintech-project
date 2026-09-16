'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Building, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { store } from '@/lib/db/store';
import { Payout } from '@/lib/types';

export default function PayoutsEnginePage() {
  const [payouts, setPayouts] = useState<Payout[]>(store.getPayouts());
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED'>('ALL');
  const [selectedPayout, setSelectedPayout] = useState<Payout>(payouts[0]);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = payouts.filter(p => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  const handleExecute = async (payoutId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/payouts/${payoutId}/execute`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPayouts([...store.getPayouts()]);
        setSelectedPayout(store.getPayoutById(payoutId) || payouts[0]);
      }
    } catch {
      store.executePayout(payoutId);
      setPayouts([...store.getPayouts()]);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
                Direct Benefit Transfer Gateway
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Parametric Payout & Disbursement Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated clearing with simulated RBI NEFT reference IDs. Zero claims paperwork.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-[#34D399] font-mono text-xs font-bold">
              Total Settled: ₹{payouts.filter(p => p.status === 'SUCCESSFUL').reduce((a, b) => a + b.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Filter Tabs (Section 21: pending, processing, successful, failed) */}
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold overflow-x-auto">
          {(['ALL', 'PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                statusFilter === st 
                  ? 'bg-[#071511] text-[#34D399]' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st} ({st === 'ALL' ? payouts.length : payouts.filter(p => p.status === st).length})
            </button>
          ))}
        </div>

        {/* Selected Settlement Timeline Box (Section 21) */}
        {selectedPayout && (
          <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#34D399] uppercase font-bold">
                    Order Ref: {selectedPayout.payoutRef}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    selectedPayout.status === 'SUCCESSFUL' ? 'bg-emerald-500/20 text-[#34D399]' :
                    selectedPayout.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-300' :
                    selectedPayout.status === 'FAILED' ? 'bg-red-500/20 text-red-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {selectedPayout.status}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">
                  Beneficiary: {selectedPayout.farmerName}
                </h2>
                <div className="text-xs text-slate-400 font-mono">
                  Claim: <strong className="text-white">{selectedPayout.claimNumber}</strong> &bull; Bank Ref: <strong className="text-amber-300">{selectedPayout.bankRefId}</strong> &bull; Account: {selectedPayout.beneficiaryMask} ({selectedPayout.ifscCode})
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-[#34D399] font-mono">
                  ₹{selectedPayout.amount.toLocaleString()}
                </div>
                {selectedPayout.status !== 'SUCCESSFUL' && (
                  <button
                    onClick={() => handleExecute(selectedPayout.id)}
                    disabled={actionLoading}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-950/20 flex items-center space-x-1.5"
                  >
                    <span>Execute NEFT Settlement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 7-Step Claim Settlement Timeline Required by Section 21 */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Claim Settlement Timeline
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 text-xs font-mono">
                
                <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">1. Weather Event</span>
                  <strong className="text-slate-200 text-xs mt-1 block">{selectedPayout.timeline.weatherEvent}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">2. Sat Verification</span>
                  <strong className="text-slate-200 text-xs mt-1 block">{selectedPayout.timeline.satelliteVerification}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">3. CHF Calculation</span>
                  <strong className="text-slate-200 text-xs mt-1 block">{selectedPayout.timeline.chfCalculation}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">4. Threshold Test</span>
                  <strong className="text-slate-200 text-xs mt-1 block">{selectedPayout.timeline.thresholdTest}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">5. Qualification</span>
                  <strong className="text-slate-200 text-xs mt-1 block">{selectedPayout.timeline.claimQualification}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">6. Payout Initiation</span>
                  <strong className="text-slate-200 text-xs mt-1 block">{selectedPayout.timeline.payoutInitiation}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">7. Bank Confirmation</span>
                  <strong className="text-emerald-400 text-xs mt-1 block">{selectedPayout.timeline.bankConfirmation}</strong>
                </div>

              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 italic">
              * Note: Simulated banking references are generated for sandbox demonstration. Never implies live commercial bank access.
            </div>
          </div>
        )}

        {/* Payouts Register Table */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 font-mono">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] font-sans">
                <tr>
                  <th className="px-6 py-4">Payout Ref #</th>
                  <th className="px-6 py-4">Claim #</th>
                  <th className="px-6 py-4 font-sans">Beneficiary</th>
                  <th className="px-6 py-4 font-sans">Crop</th>
                  <th className="px-6 py-4 font-sans">District</th>
                  <th className="px-6 py-4">Bank UTR Ref</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 font-sans">Status</th>
                  <th className="px-6 py-4 font-sans text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => setSelectedPayout(p)}
                    className={`cursor-pointer transition-colors ${
                      selectedPayout.id === p.id ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">{p.payoutRef}</td>
                    <td className="px-6 py-4 text-slate-500">{p.claimNumber}</td>
                    <td className="px-6 py-4 font-sans font-bold text-slate-800">{p.farmerName}</td>
                    <td className="px-6 py-4 font-sans">{p.crop}</td>
                    <td className="px-6 py-4 font-sans">{p.district}</td>
                    <td className="px-6 py-4 text-slate-600">{p.bankRefId}</td>
                    <td className="px-6 py-4 font-black text-slate-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 font-sans">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.status === 'SUCCESSFUL' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        p.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayout(p);
                        }}
                        className="text-[#059669] font-bold hover:underline"
                      >
                        Inspect &rarr;
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
