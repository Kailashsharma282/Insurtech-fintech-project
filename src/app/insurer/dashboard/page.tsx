'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  ArrowRight,
  Layers,
  Activity,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { SEED_CLAIMS, SEED_INSURANCE_UNITS, SEED_PAYOUTS } from '@/lib/db/seed-data';

export default function InsurerDashboardPage() {
  // KPIs Required by Section 17
  const kpis = {
    activePolicies: 40,
    insuranceUnits: SEED_INSURANCE_UNITS.length,
    highRiskUnits: SEED_INSURANCE_UNITS.filter(u => u.riskState === 'HIGH' || u.riskState === 'CLAIM_TRIGGERED').length,
    pendingClaims: SEED_CLAIMS.filter(c => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').length,
    qualifiedClaims: SEED_CLAIMS.filter(c => c.status === 'VERIFIED' || c.status === 'APPROVED' || c.status === 'DISBURSED').length,
    totalDisbursement: SEED_PAYOUTS.reduce((acc, p) => p.status === 'SUCCESSFUL' ? acc + p.amount : acc, 0)
  };

  // Charts data Required by Section 17
  // 1. CHF distribution
  const chfDistribution = [
    { range: '< 0.50 (Triggered)', count: 4, fill: '#EF4444' },
    { range: '0.50 - 0.55 (Critical)', count: 6, fill: '#F97316' },
    { range: '0.55 - 0.65 (Watch)', count: 12, fill: '#F59E0B' },
    { range: '0.65 - 0.75 (Optimal)', count: 14, fill: '#10B981' },
    { range: '> 0.75 (Superior)', count: 4, fill: '#059669' },
  ];

  // 2. Claims by crop
  const claimsByCrop = [
    { crop: 'Aman Paddy', count: 14, amount: 624000 },
    { crop: 'Potato', count: 11, amount: 512000 },
    { crop: 'Jute', count: 5, amount: 204000 },
  ];

  // 3. Risk by district
  const riskByDistrict = [
    { district: 'Nadia', low: 7, moderate: 2, high: 1, triggered: 1 },
    { district: 'Burdwan', low: 8, moderate: 2, high: 0, triggered: 0 },
    { district: 'Hooghly', low: 8, moderate: 1, high: 0, triggered: 0 },
    { district: 'Murshidabad', low: 6, moderate: 2, high: 1, triggered: 1 },
  ];

  // 4. Monthly payouts (in thousands INR)
  const monthlyPayouts = [
    { month: 'Jun', amountK: 0 },
    { month: 'Jul', amountK: 45 },
    { month: 'Aug', amountK: 120 },
    { month: 'Sep (Current)', amountK: 342 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
                Parametric Underwriting Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Underwriting Portfolio & Exposure
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active monitoring across West Bengal pilot clusters with automated CHF loss appraisal.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/insurer/claims"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors shadow-sm"
            >
              Claims Queue ({SEED_CLAIMS.length})
            </Link>
            <Link
              href="/insurer/risk-map"
              className="px-4 py-2.5 rounded-xl bg-[#071511] hover:bg-slate-800 text-[#34D399] font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Risk Map</span>
            </Link>
          </div>
        </div>

        {/* 6 Core Underwriting KPIs (Section 17) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Policies</span>
            <div className="text-2xl font-black text-slate-900">{kpis.activePolicies}</div>
            <span className="text-[10px] text-emerald-600 font-medium">100% Monitored</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Insurance Units</span>
            <div className="text-2xl font-black text-slate-900">{kpis.insuranceUnits}</div>
            <span className="text-[10px] text-slate-500">Gram Panchayats</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">High-Risk Units</span>
            <div className="text-2xl font-black text-orange-600">{kpis.highRiskUnits}</div>
            <span className="text-[10px] text-orange-600 font-medium">Under Observation</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending Claims</span>
            <div className="text-2xl font-black text-amber-600">{kpis.pendingClaims}</div>
            <span className="text-[10px] text-slate-500">Evidence Ingestion</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Qualified Claims</span>
            <div className="text-2xl font-black text-emerald-700">{kpis.qualifiedClaims}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Parametric Met</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Disbursed</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹{(kpis.totalDisbursement / 1000).toFixed(0)}k</div>
            <span className="text-[10px] text-emerald-600 font-medium">Electronic NEFT</span>
          </div>

        </div>

        {/* Charts Grid (Section 17: CHF Distribution, Claims by Crop, Risk by District, Monthly Payouts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: CHF Distribution across Monitored Plots */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">Portfolio Crop Health Factor (CHF) Distribution</h3>
              <p className="text-xs text-slate-500">Plot density categorized by current vegetation vigour index</p>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chfDistribution} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="range" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="count" name="Farms Count" radius={[6, 6, 0, 0]}>
                    {chfDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Risk by District */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">Regional Risk Breakdown by District</h3>
              <p className="text-xs text-slate-500">Normal vs Low vs Moderate vs Triggered plots</p>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskByDistrict} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="district" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="low" name="Low / Normal" stackId="a" fill="#10B981" />
                  <Bar dataKey="moderate" name="Moderate Watch" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="triggered" name="Claim Triggered" stackId="a" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Claims by Crop */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">Claims Volume & Exposure by Crop</h3>
              <p className="text-xs text-slate-500">Distribution across Aman Paddy, Potato, and Jute</p>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={claimsByCrop} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis dataKey="crop" type="category" stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="amount" name="Claimed Amount (INR)" fill="#0284C7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Monthly Payouts Progression */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">Monthly Parametric Disbursements (k INR)</h3>
              <p className="text-xs text-slate-500">Settled disbursements tracking Kharif monsoon progress</p>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPayouts} margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="amountK" name="Disbursements (k INR)" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
