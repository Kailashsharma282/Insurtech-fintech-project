'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, CheckCircle2, Building, ArrowRight } from 'lucide-react';
import { store } from '@/lib/db/store';

export default function FarmerPaymentsPage() {
  const farmerPayouts = store.getPayouts().filter(p => p.farmerName.includes('Subhash') || p.farmerName.includes('Kalyan') || p.id === 'payout-1');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Direct Benefit Transfers & Settlement Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Electronic parametric disbursements deposited into your registered bank account.
          </p>
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {p.status}
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

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Settled electronically per Parametric Crop Health Trigger condition. Zero deduction or administrative fee.
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
