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
  Eye,
  Waves
} from 'lucide-react';
import { SEED_FARMS, SEED_INSURANCE_UNITS } from '@/lib/db/seed-data';
import { Farm } from '@/lib/types';
import dynamic from 'next/dynamic';
import { EarthEngineTelemetry } from '@/components/ui/EarthEngineTelemetry';

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
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">
                Sentinel-2 & Sentinel-1 GIS Engine (Ghatal Block, 2025)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Satellite Intelligence & Silabati Basin Cadastral Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Real-time multi-spectral crop health monitoring across 40 agricultural plots in Ghatal Block. Plots adjacent to the Silabati River reflect monsoonal inundation with lower CHF (&lt;0.55), while elevated upland sectors show high canopy vigor.
            </p>
          </div>

          {/* Layer Selector Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1 text-xs font-semibold">
            {[
              { id: 'chf', label: 'Composite CHF' },
              { id: 'ndvi', label: 'NDVI (Optical 10m)' },
              { id: 'lswi', label: 'LSWI (Moisture)' },
              { id: 'vh', label: 'Radar VH (dB)' },
              { id: 'risk', label: 'Parametric Risk' },
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  selectedLayer === layer.id 
                    ? 'bg-blue-600 text-white shadow-xs' 
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
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Map Filters:</span>
          </span>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Districts / Pilot Blocks</option>
            <option value="Purba Medinipur">Purba Medinipur (Ghatal Block — 40 Plots)</option>
            <option value="Nadia">Nadia</option>
            <option value="Burdwan">Burdwan</option>
            <option value="Hooghly">Hooghly</option>
            <option value="Murshidabad">Murshidabad</option>
          </select>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Crops</option>
            <option value="Aman Paddy">Aman Paddy</option>
            <option value="Potato">Potato</option>
            <option value="Jute">Jute</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Risk States</option>
            <option value="CLAIM_TRIGGERED">Claim Triggered (&lt; 0.55 CHF)</option>
            <option value="HIGH">High Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="LOW">Low Risk / Healthy</option>
            <option value="NORMAL">Normal</option>
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

          {/* Selected Farm Information Drawer */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedFarm.plotNumber}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedFarm.riskLevel === 'CLAIM_TRIGGERED' ? 'bg-red-100 text-red-700 border border-red-300' :
                  selectedFarm.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  selectedFarm.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-300'
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

            {/* Farm Summary Details with River Distance */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Crop & Acreage:</span>
                <strong className="text-slate-900">{selectedFarm.currentCrop} ({selectedFarm.acreage} ha)</strong>
              </div>

              {/* Silabati River Distance & Hydrological Zone */}
              <div className="flex justify-between py-1.5 border-b border-slate-100 bg-blue-50/50 px-2 rounded-lg">
                <span className="text-blue-900 font-semibold flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-blue-700" />
                  Distance to Silabati:
                </span>
                <strong className="text-blue-950 font-mono">
                  {selectedFarm.distanceToRiverMeters || 450} m ({selectedFarm.hydrologicalZone || 'SILABATI_FLOODPLAIN'})
                </strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Current CHF Index:</span>
                <strong className={`font-mono text-sm ${selectedFarm.currentChf < 0.55 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {selectedFarm.currentChf.toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Baseline CHF (4-Yr Normal):</span>
                <strong className="text-slate-800 font-mono">{selectedFarm.chfBaseline.toFixed(2)}</strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Baseline Deviation &Delta;:</span>
                <strong className={`font-mono ${selectedFarm.currentChf < selectedFarm.chfBaseline ? 'text-red-600' : 'text-emerald-600'}`}>
                  {(selectedFarm.currentChf - selectedFarm.chfBaseline).toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Soil Moisture:</span>
                <strong className={`font-mono ${selectedFarm.soilMoisturePct > 80 ? 'text-blue-700 font-bold' : 'text-slate-700'}`}>
                  {selectedFarm.soilMoisturePct}% VWC {selectedFarm.soilMoisturePct > 80 ? '(Waterlogged)' : ''}
                </strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Sentinel-2 NDVI / S1 VH:</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {selectedFarm.ndvi} / {selectedFarm.vhBackscatterDb} dB
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Sum Insured:</span>
                <span className="text-slate-900 font-mono font-bold">₹{selectedFarm.sumInsured.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              href={`/farmer/farms/${selectedFarm.id}`}
              className="w-full flex items-center justify-center py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <span>Open Complete Farm Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

        </div>

        {/* Real-Time Google Earth Engine Multi-Spectral Telemetry */}
        <div className="pt-4">
          <EarthEngineTelemetry />
        </div>

      </div>
    </div>
  );
}
