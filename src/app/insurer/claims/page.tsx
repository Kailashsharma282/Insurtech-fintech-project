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
              <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
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
            <Filter className="w-4 h-4 text-[#059669]" />
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
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white"
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
              className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white"
            >
              <option value="ALL">All Crops</option>
              <option value="Aman Paddy">Aman Paddy</option>
              <option value="Potato">Potato</option>
              <option value="Jute">Jute</option>
            </select>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white"
            >
              <option value="ALL">All Districts</option>
              <option value="Nadia">Nadia District</option>
              <option value="Burdwan">Burdwan District</option>
              <option value="Hooghly">Hooghly District</option>
              <option value="Murshidabad">Murshidabad District</option>
            </select>

          </div>
        </div>

        {/* Claims Table with all 11 required columns (Section 19) */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Claim #</th>
                  <th className="px-6 py-4">Policy #</th>
                  <th className="px-6 py-4">Farmer</th>
                  <th className="px-6 py-4">Insurance Unit</th>
                  <th className="px-6 py-4">Crop</th>
                  <th className="px-6 py-4">Trigger Type</th>
                  <th className="px-6 py-4">CHF Measured</th>
                  <th className="px-6 py-4">Baseline</th>
                  <th className="px-6 py-4">Loss Fraction</th>
                  <th className="px-6 py-4">Claim Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors font-sans">
                    <td className="px-6 py-4 font-bold text-slate-900 font-mono">
                      {claim.claimNumber}
                      {claim.claimNumber === 'CLM-2026-084' && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{claim.policyNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{claim.farmerName}</td>
                    <td className="px-6 py-4 font-mono text-[11px]">{claim.insuranceUnitCode}</td>
                    <td className="px-6 py-4">{claim.crop}</td>
                    <td className="px-6 py-4 text-[11px]">{claim.triggerType.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4 font-mono font-bold text-red-600">
                      {claim.chfMeasured.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{claim.chfBaseline.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      {(claim.lossFraction * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-slate-900">
                      ₹{claim.claimAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        claim.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800' :
                        claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        claim.status === 'VERIFIED' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/insurer/claims/${claim.id}`}
                        className="inline-flex items-center text-[#059669] font-bold hover:underline"
                      >
                        <span>Package</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
