'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, CheckCircle2, Building, ArrowRight, Lock, Clock, Info } from 'lucide-react';
import { store } from '@/lib/db/store';

export default function FarmerPaymentsPage() {
  const farmerPayouts = store.getPayouts().filter(p => p.farmerName.includes('Subhash') || p.farmerName.includes('Rajesh') || p.farmerName.includes('Kalyan') || p.id === 'payout-1');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
              Direct Benefit Transfer Registry
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              Ghatal Pilot
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Direct Benefit Transfers & Settlement Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Electronic parametric disbursements for Plot #204, Ghatal, West Bengal.
          </p>
        </div>

        {/* Informational Pilot Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3 shadow-sm">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-slate-900">Pilot Mode Notice: Direct Banking Settlements Held</span>
            <span className="text-slate-600">
              For this phase of the Ghatal pilot, parametric claim qualifications and damage verifications are active, while electronic bank fund transfers are temporarily held pending final banking mandate release.
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {farmerPayouts.map(p => (
            <div key={p.id} className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#059669] font-bold">Disbursement Voucher</span>
                  <h3 className="font-bold text-lg text-slate-900">{p.payoutRef}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 font-mono">₹{p.amount.toLocaleString()}</div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-end gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>HELD (PILOT MANDATE)</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Claim Reference</span>
                  <strong className="text-slate-800">{p.claimNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Beneficiary Account</span>
                  <strong className="text-slate-800">{p.beneficiaryMask}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bank IFSC</span>
                  <strong className="text-slate-800">{p.ifscCode}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">RBI NEFT UTR</span>
                  <strong className="text-amber-600">{p.bankRefId}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Parametric Crop Health Trigger validated. Electronic disbursement queued for banking mandate activation.</span>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Zero Administrative Fee</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
