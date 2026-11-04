'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText,
  Building
} from 'lucide-react';
import { store } from '@/lib/db/store';
import { Claim } from '@/lib/types';

export default function ClaimsDeskPage() {
  const [claims, setClaims] = useState<Claim[]>(store.getClaims());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cropFilter, setCropFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      const matchSearch = c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.plotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.insuranceUnitCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchCrop = cropFilter === 'ALL' || c.crop.toLowerCase() === cropFilter.toLowerCase();
      const matchDistrict = districtFilter === 'ALL' || c.district.toLowerCase() === districtFilter.toLowerCase();

      return matchSearch && matchStatus && matchCrop && matchDistrict;
    });
  }, [claims, searchQuery, statusFilter, cropFilter, districtFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">
                Automated Claims Adjudication Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Parametric Claims Register
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Objective claims initiated via satellite remote sensing and localized CHF breach detection.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
              Total Claims: {claims.length}
            </span>
          </div>
        </div>

        {/* Filter Controls (Section 19: status, crop, district, date, risk) */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Search & Underwriting Filter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search claim #, farmer, IU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Ingestion</option>
              <option value="VERIFIED">Verified (Satellite Checked)</option>
              <option value="APPROVED">Approved for Payout</option>
              <option value="DISBURSED">Disbursed (Settled)</option>
            </select>

            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Crops</option>
              <option value="Aman Paddy">Aman Paddy</option>
              <option value="Potato">Potato</option>
              <option value="Jute">Jute</option>
            </select>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Districts</option>
              <option value="Paschim Medinipur">Paschim Medinipur (Ghatal)</option>
              <option value="Nadia">Nadia District</option>
              <option value="Burdwan">Burdwan District</option>
              <option value="Hooghly">Hooghly District</option>
              <option value="Murshidabad">Murshidabad District</option>
            </select>

          </div>
        </div>

        {/* Claims Table with all 11 required columns (Section 19) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="sm:hidden px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>&larr; Swipe to view all 11 columns &rarr;</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">11 Evidence Columns</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1280px] text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                <tr className="whitespace-nowrap">
                  <th className="px-5 py-4 whitespace-nowrap">Claim #</th>
                  <th className="px-5 py-4 whitespace-nowrap">Policy #</th>
                  <th className="px-5 py-4 whitespace-nowrap">Farmer</th>
                  <th className="px-5 py-4 whitespace-nowrap">Insurance Unit</th>
                  <th className="px-5 py-4 whitespace-nowrap">Crop</th>
                  <th className="px-5 py-4 whitespace-nowrap">Trigger Type</th>
                  <th className="px-5 py-4 whitespace-nowrap">CHF Measured</th>
                  <th className="px-5 py-4 whitespace-nowrap">Baseline</th>
                  <th className="px-5 py-4 whitespace-nowrap">Loss Fraction</th>
                  <th className="px-5 py-4 whitespace-nowrap">Claim Amount</th>
                  <th className="px-5 py-4 whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 text-right whitespace-nowrap">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100 font-mono whitespace-nowrap">
                      {claim.claimNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {claim.policyNumber}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {claim.farmerName}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {claim.insuranceUnitCode}
                    </td>
                    <td className="px-5 py-4 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {claim.crop}
                    </td>
                    <td className="px-5 py-4 text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {claim.triggerType.replace(/_/g, ' ')}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                      {claim.chfMeasured.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {claim.chfBaseline.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {(claim.lossFraction * 100).toFixed(1)}%
                    </td>
                    <td className="px-5 py-4 font-mono font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      ₹{claim.claimAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        claim.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300' :
                        claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300' :
                        claim.status === 'VERIFIED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/insurer/claims/${claim.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline whitespace-nowrap"
                      >
                        <span>Package</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 inline-block shrink-0" />
                      </Link>
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
