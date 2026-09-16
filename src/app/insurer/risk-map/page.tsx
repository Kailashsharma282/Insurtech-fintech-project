'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  Activity, 
  ArrowRight, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { SEED_INSURANCE_UNITS, SEED_FARMS } from '@/lib/db/seed-data';
import { InsuranceUnit } from '@/lib/types';
import dynamic from 'next/dynamic';

const AgriMap = dynamic(() => import('@/components/maps/AgriMap').then(m => m.AgriMap), {
  ssr: false,
  loading: () => <div className="h-[550px] bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 font-mono text-xs">Loading Underwriting Risk Boundaries...</div>
});

export default function InsurerRiskMapPage() {
  const [selectedUnit, setSelectedUnit] = useState<InsuranceUnit>(SEED_INSURANCE_UNITS[0]);

  // Find farms belonging to this Insurance Unit
  const unitFarms = SEED_FARMS.filter(f => f.insuranceUnitCode === selectedUnit.code || f.insuranceUnitId === selectedUnit.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
                Gram Panchayat Level Underwriting
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Insurance Unit Risk & Trigger Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select an Insurance Unit to review composite CHF deviation, affected area, and potential claim payouts.
            </p>
          </div>

          {/* Color States Legend Required by Section 18 */}
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3 text-xs">
            <span className="font-semibold text-slate-700 text-[11px]">States:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 text-[10px]">NORMAL</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span className="text-slate-600 text-[10px]">LOW</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600 text-[10px]">MODERATE</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-600 text-[10px]">HIGH</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-600 text-[10px]">CLAIM TRIGGERED</span>
            </span>
          </div>
        </div>

        {/* Map & Insurance Unit Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Map */}
          <div className="lg:col-span-7">
            <AgriMap
              farms={SEED_FARMS}
              activeLayer="risk"
              height="580px"
              center={[selectedUnit.boundaryCoordinates[0][1], selectedUnit.boundaryCoordinates[0][0]]}
              zoom={12}
            />
          </div>

          {/* Unit Selector & Full Specs Required by Section 18 */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Unit Buttons */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
              {SEED_INSURANCE_UNITS.map(u => (
                <button
                  key={u.code}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap ${
                    selectedUnit.code === u.code 
                      ? 'bg-[#071511] text-[#34D399] shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {u.code}
                </button>
              ))}
            </div>

            {/* Selected Insurance Unit Details Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedUnit.code}
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    selectedUnit.riskState === 'CLAIM_TRIGGERED' ? 'bg-red-100 text-red-700 border border-red-200' :
                    selectedUnit.riskState === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    selectedUnit.riskState === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedUnit.riskState.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#0F172A] mt-2">
                  {selectedUnit.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Gram Panchayat: <strong>{selectedUnit.gramPanchayat}</strong> &bull; District: <strong>{selectedUnit.district}</strong>
                </p>
              </div>

              {/* 11 Specific Fields Required by Section 18 */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Underwritten Crop:</span>
                  <strong className="text-slate-900">{selectedUnit.crop}</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Cultivated Area:</span>
                  <strong className="text-slate-900">{selectedUnit.totalAreaHa.toLocaleString()} Hectares</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Observed Unit CHF:</span>
                  <strong className={`font-mono text-sm ${selectedUnit.currentChf < 0.55 ? 'text-red-600 font-bold' : 'text-emerald-700'}`}>
                    {selectedUnit.currentChf.toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">4-Year Baseline Normal:</span>
                  <strong className="font-mono text-slate-800">{selectedUnit.chfBaseline.toFixed(2)}</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Baseline Deviation &Delta;:</span>
                  <strong className={`font-mono ${selectedUnit.deviation < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedUnit.deviation > 0 ? `+${selectedUnit.deviation}` : selectedUnit.deviation}
                  </strong>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Affected Crop Area:</span>
                  <strong className="text-slate-900 text-amber-700 font-bold">{selectedUnit.affectedAreaHa} Hectares</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Weather Event Status:</span>
                  <span className="font-semibold text-slate-800">{selectedUnit.weatherEventStatus}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Claim Settlement Status:</span>
                  <span className={`font-bold ${selectedUnit.currentChf < 0.55 ? 'text-red-600' : 'text-[#059669]'}`}>
                    {selectedUnit.claimStatus}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Potential Parametric Payout:</span>
                  <strong className="text-base font-black text-slate-900 font-mono">
                    ₹{selectedUnit.potentialPayoutInr.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/insurer/claims?district=${selectedUnit.district}`}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  <span>Filter Claims in {selectedUnit.district} &rarr;</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
