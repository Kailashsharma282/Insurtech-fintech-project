'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Satellite, 
  Layers, 
  Filter, 
  MapPin, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  CloudSun, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { SEED_FARMS, SEED_INSURANCE_UNITS } from '@/lib/db/seed-data';
import { Farm } from '@/lib/types';
import dynamic from 'next/dynamic';

const AgriMap = dynamic(() => import('@/components/maps/AgriMap').then(m => m.AgriMap), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 font-mono text-xs">Loading Satellite GIS Engine...</div>
});

export default function SatelliteMapPage() {
  const [selectedLayer, setSelectedLayer] = useState<'chf' | 'ndvi' | 'lswi' | 'vh' | 'risk'>('chf');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [cropFilter, setCropFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedFarm, setSelectedFarm] = useState<Farm>(SEED_FARMS[0]);

  const filteredFarms = useMemo(() => {
    return SEED_FARMS.filter(f => {
      const matchDist = districtFilter === 'ALL' || f.district.toLowerCase() === districtFilter.toLowerCase();
      const matchCrop = cropFilter === 'ALL' || f.currentCrop.toLowerCase() === cropFilter.toLowerCase();
      const matchRisk = riskFilter === 'ALL' || f.riskLevel === riskFilter;
      return matchDist && matchCrop && matchRisk;
    });
  }, [districtFilter, cropFilter, riskFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Layer Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
                Sentinel-2 & Sentinel-1 GIS Viewer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Satellite Intelligence & Cadastral Map
            </h1>
          </div>

          {/* Layer Selector Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1 text-xs font-semibold">
            {[
              { id: 'chf', label: 'Composite CHF' },
              { id: 'ndvi', label: 'NDVI (Optical)' },
              { id: 'lswi', label: 'LSWI (Moisture)' },
              { id: 'vh', label: 'Radar VH (dB)' },
              { id: 'risk', label: 'Parametric Risk' },
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  selectedLayer === layer.id 
                    ? 'bg-[#071511] text-[#34D399]' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-[#059669]" />
            <span>Map Filters:</span>
          </span>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All Districts</option>
            <option value="Nadia">Nadia</option>
            <option value="Burdwan">Burdwan</option>
            <option value="Hooghly">Hooghly</option>
            <option value="Murshidabad">Murshidabad</option>
          </select>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All Crops</option>
            <option value="Aman Paddy">Aman Paddy</option>
            <option value="Potato">Potato</option>
            <option value="Jute">Jute</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All Risk States</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
            <option value="MODERATE">Moderate</option>
            <option value="HIGH">High</option>
            <option value="CLAIM_TRIGGERED">Claim Triggered</option>
          </select>

          <span className="ml-auto font-mono text-[11px] text-slate-500">
            Showing <strong>{filteredFarms.length}</strong> farm polygons
          </span>
        </div>

        {/* Interactive Map & Selected Farm Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Map Component */}
          <div className="lg:col-span-8">
            <AgriMap
              farms={filteredFarms}
              selectedFarmId={selectedFarm.id}
              onSelectFarm={(f) => setSelectedFarm(f)}
              activeLayer={selectedLayer}
              height="600px"
              center={[selectedFarm.centroid.lat, selectedFarm.centroid.lng]}
              zoom={13}
            />
          </div>

          {/* Selected Farm Information Drawer (Section 9) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedFarm.plotNumber}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedFarm.riskLevel === 'CLAIM_TRIGGERED' ? 'bg-red-100 text-red-700' :
                  selectedFarm.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  selectedFarm.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedFarm.riskLevel.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-extrabold text-xl text-[#0F172A] mt-2">
                {selectedFarm.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedFarm.farmerName} &bull; {selectedFarm.village}, {selectedFarm.district}
              </p>
            </div>

            {/* Farm Summary Details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Crop & Acreage:</span>
                <strong className="text-slate-900">{selectedFarm.currentCrop} ({selectedFarm.acreage} ha)</strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Current CHF Index:</span>
                <strong className="text-emerald-700 font-mono text-sm">{selectedFarm.currentChf.toFixed(2)}</strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">4-Yr Baseline CHF:</span>
                <strong className="text-slate-800 font-mono">{selectedFarm.chfBaseline.toFixed(2)}</strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Baseline Deviation &Delta;:</span>
                <strong className={`font-mono ${selectedFarm.currentChf < selectedFarm.chfBaseline ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {(selectedFarm.currentChf - selectedFarm.chfBaseline).toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Soil Moisture:</span>
                <strong className="text-blue-600 font-mono">{selectedFarm.soilMoisturePct}% VWC</strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Latest Sentinel Scene:</span>
                <span className="font-mono text-[11px] text-slate-700">{selectedFarm.lastSatelliteDate}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Weather Status:</span>
                <span className="text-emerald-700 font-semibold">Optimal Inflow (31.4&deg;C)</span>
              </div>
            </div>

            <Link
              href={`/farmer/farms/${selectedFarm.id}`}
              className="w-full flex items-center justify-center py-3 rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <span>Open Complete Farm Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
