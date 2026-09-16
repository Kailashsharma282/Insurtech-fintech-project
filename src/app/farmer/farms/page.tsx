'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  Table as TableIcon, 
  ArrowRight,
  ShieldCheck,
  Droplets,
  Activity,
  Layers
} from 'lucide-react';
import { SEED_FARMS } from '@/lib/db/seed-data';
import { Farm } from '@/lib/types';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet map component
const AgriMap = dynamic(() => import('@/components/maps/AgriMap').then(m => m.AgriMap), {
  ssr: false,
  loading: () => <div className="h-[320px] bg-slate-900 rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading Geospatial Boundaries...</div>
});

export default function FarmsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [cropFilter, setCropFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedFarm, setSelectedFarm] = useState<Farm>(SEED_FARMS[0]);

  const filteredFarms = useMemo(() => {
    return SEED_FARMS.filter(farm => {
      const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            farm.plotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            farm.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            farm.village.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = districtFilter === 'ALL' || farm.district.toLowerCase() === districtFilter.toLowerCase();
      const matchesCrop = cropFilter === 'ALL' || farm.currentCrop.toLowerCase() === cropFilter.toLowerCase();
      const matchesRisk = riskFilter === 'ALL' || farm.riskLevel === riskFilter;

      return matchesSearch && matchesDistrict && matchesCrop && matchesRisk;
    });
  }, [searchQuery, districtFilter, cropFilter, riskFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Registered Farm Holdings
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Monitored plots across West Bengal (Nadia, Burdwan, Hooghly, Murshidabad). Total: <strong>{filteredFarms.length} of {SEED_FARMS.length} plots</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center space-x-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#071511] text-[#34D399]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                  viewMode === 'table' ? 'bg-[#071511] text-[#34D399]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Table View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Preview of Filtered Farms */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-[#059669]" />
              <span>Interactive Geographic Preview</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Click any plot polygon to inspect live telemetry
            </span>
          </div>

          <AgriMap
            farms={filteredFarms.slice(0, 25)}
            selectedFarmId={selectedFarm.id}
            onSelectFarm={(f) => setSelectedFarm(f)}
            height="320px"
            center={[selectedFarm.centroid.lat, selectedFarm.centroid.lng]}
            zoom={13}
            activeLayer="chf"
          />
        </div>

        {/* Filters Row */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
            <span>Search & Multi-Criteria Filtering</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search plot #, farmer, village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
            </div>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
            >
              <option value="ALL">All Districts (West Bengal)</option>
              <option value="Nadia">Nadia District</option>
              <option value="Burdwan">Burdwan District</option>
              <option value="Hooghly">Hooghly District</option>
              <option value="Murshidabad">Murshidabad District</option>
            </select>

            {/* Crop Filter */}
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
            >
              <option value="ALL">All Crops</option>
              <option value="Aman Paddy">Aman Paddy</option>
              <option value="Potato">Potato</option>
              <option value="Jute">Jute</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
            >
              <option value="ALL">All Risk Categories</option>
              <option value="NORMAL">Normal / Optimal</option>
              <option value="LOW">Low Stress</option>
              <option value="MODERATE">Moderate Watch</option>
              <option value="HIGH">High Deficit</option>
              <option value="CLAIM_TRIGGERED">Claim Triggered</option>
            </select>

          </div>
        </div>

        {/* View Mode 1: Grid Cards */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarms.map((farm) => {
              const isPrimary = farm.id === 'farm-plot-204';
              return (
                <div 
                  key={farm.id}
                  className={`p-6 rounded-3xl bg-white border transition-all space-y-4 ${
                    isPrimary 
                      ? 'border-[#10B981] shadow-lg shadow-emerald-950/5 ring-1 ring-[#10B981]/30' 
                      : 'border-[#E2E8F0] shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-base text-[#0F172A]">{farm.plotNumber}</span>
                        {isPrimary && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            PRIMARY DEMO
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{farm.farmerName} &bull; {farm.village}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      farm.riskLevel === 'CLAIM_TRIGGERED' ? 'bg-red-100 text-red-700' :
                      farm.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      farm.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {farm.riskLevel.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Crop & Area</span>
                      <strong className="text-slate-800">{farm.currentCrop} ({farm.acreage} ha)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Crop Health (CHF)</span>
                      <strong className={`font-mono text-sm ${farm.currentChf < 0.55 ? 'text-red-600 font-bold' : 'text-emerald-700'}`}>
                        {farm.currentChf.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ {farm.chfBaseline}</span>
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Soil Moisture</span>
                      <strong className="text-blue-600 font-mono">{farm.soilMoisturePct}% VWC</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Insurance Policy</span>
                      <strong className="text-emerald-700">Active (₹{farm.sumInsured.toLocaleString()})</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{farm.district} District</span>
                    <Link
                      href={`/farmer/farms/${farm.id}`}
                      className="inline-flex items-center font-semibold text-[#059669] hover:text-emerald-800 transition-colors"
                    >
                      <span>Farm Details</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode 2: Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Plot Number</th>
                    <th className="px-6 py-4">Farmer</th>
                    <th className="px-6 py-4">District</th>
                    <th className="px-6 py-4">Crop</th>
                    <th className="px-6 py-4">Acreage</th>
                    <th className="px-6 py-4">CHF Index</th>
                    <th className="px-6 py-4">Soil Moisture</th>
                    <th className="px-6 py-4">Risk State</th>
                    <th className="px-6 py-4">Insurance Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFarms.map((farm) => (
                    <tr key={farm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {farm.plotNumber}
                        {farm.id === 'farm-plot-204' && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                            PRIMARY
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{farm.farmerName}</td>
                      <td className="px-6 py-4">{farm.district}</td>
                      <td className="px-6 py-4 font-semibold">{farm.currentCrop}</td>
                      <td className="px-6 py-4">{farm.acreage} ha</td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                        {farm.currentChf.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono text-blue-600">{farm.soilMoisturePct}%</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          farm.riskLevel === 'CLAIM_TRIGGERED' ? 'bg-red-100 text-red-700' :
                          farm.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          farm.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {farm.riskLevel.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#059669] font-medium">Covered</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/farmer/farms/${farm.id}`}
                          className="text-[#059669] font-bold hover:underline"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
