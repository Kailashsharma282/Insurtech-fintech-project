'use client';

import React, { useState } from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Droplets, 
  Zap, 
  CheckCircle2, 
  RefreshCw,
  Activity,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function WeatherRiskPage() {
  const [simulating, setSimulating] = useState(false);
  const [simulatedEvent, setSimulatedEvent] = useState<any | null>(null);

  // 14-day weather & agrometeorological risk data
  const weatherTrendData = [
    { day: '01 Sep', rain: 4.2, tempMax: 32, wind: 14, heatStress: 0.22, droughtIdx: 0.18, floodRisk: 0.05 },
    { day: '03 Sep', rain: 8.5, tempMax: 33, wind: 16, heatStress: 0.25, droughtIdx: 0.16, floodRisk: 0.08 },
    { day: '05 Sep', rain: 12.0, tempMax: 31, wind: 18, heatStress: 0.20, droughtIdx: 0.12, floodRisk: 0.10 },
    { day: '07 Sep', rain: 2.0, tempMax: 34, wind: 12, heatStress: 0.38, droughtIdx: 0.22, floodRisk: 0.02 },
    { day: '09 Sep', rain: 0.0, tempMax: 35, wind: 10, heatStress: 0.44, droughtIdx: 0.28, floodRisk: 0.01 },
    { day: '11 Sep', rain: 24.5, tempMax: 30, wind: 22, heatStress: 0.18, droughtIdx: 0.10, floodRisk: 0.25 },
    { day: '13 Sep', rain: 42.0, tempMax: 29, wind: 26, heatStress: 0.12, droughtIdx: 0.05, floodRisk: 0.42 },
    { day: 'Current', rain: 18.0, tempMax: 31, wind: 14, heatStress: 0.19, droughtIdx: 0.08, floodRisk: 0.18 },
  ];

  const handleSimulateHeavyRain = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/simulate/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'heavy_rain' })
      });
      const data = await res.json();
      setSimulatedEvent(data);
    } catch {
      setSimulatedEvent({
        event: 'Heavy Rainfall Depression',
        affectedAreaHa: 1240,
        satelliteVerification: 'PENDING_PASS_IN_6H',
        insuranceRelevance: 'POTENTIAL_CLAIM_TRIGGER'
      });
    } finally {
      setSimulating(false);
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
                Agro-Meteorological Intel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Weather Risk & Meteorological Simulation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated weather stations (AWS) cross-referenced with Sentinel-1 SAR moisture tracking.
            </p>
          </div>

          <button
            onClick={handleSimulateHeavyRain}
            disabled={simulating}
            className="px-5 py-2.5 rounded-2xl bg-[#071511] hover:bg-slate-800 text-[#34D399] border border-[#10B981]/40 text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-950/20"
          >
            {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>Trigger "Heavy Rainfall" Simulation</span>
          </button>
        </div>

        {/* Weather-Event Simulation Card Required by Section 14 */}
        {simulatedEvent && (
          <div className="p-6 rounded-3xl bg-[#071511] text-white border-2 border-blue-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <div className="flex items-center space-x-2">
                <CloudRain className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">
                  Active Simulated Event: {simulatedEvent.event}
                </h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                LIVE METEOROLOGICAL SHOCK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#102820] border border-blue-800/40">
                <span className="text-slate-400 block text-[10px]">Affected Agricultural Area</span>
                <strong className="text-lg text-white font-bold mt-0.5 block">{simulatedEvent.affectedAreaHa.toLocaleString()} Hectares</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#102820] border border-blue-800/40">
                <span className="text-slate-400 block text-[10px]">Satellite Verification</span>
                <strong className="text-lg text-amber-300 font-bold mt-0.5 block">{simulatedEvent.satelliteVerification}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#102820] border border-blue-800/40">
                <span className="text-slate-400 block text-[10px]">Insurance Relevance</span>
                <strong className="text-lg text-red-400 font-bold mt-0.5 block">Potential Parametric Trigger</strong>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Excess precipitation (&gt; 140mm) recorded over Nadia District. Soil moisture probes spiked to 84%. 
              Automated underwriter workflow has flagged Insurance Unit WB-NAD-002 for priority satellite SAR verification.
            </p>
          </div>
        )}

        {/* 6 Key Weather Indices Cards (Rainfall, Temp, Wind, Heat Stress, Drought, Flood) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          
          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <CloudRain className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Precipitation</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">18.0 mm</div>
            <span className="text-[10px] text-emerald-600">Past 24h</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <Thermometer className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Temperature</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">31.4&deg;C</div>
            <span className="text-[10px] text-slate-500">Normal Range</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <Wind className="w-5 h-5 text-cyan-500 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Wind Velocity</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">14 km/h</div>
            <span className="text-[10px] text-slate-500">Light Breeze</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <Sun className="w-5 h-5 text-orange-500 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Heat Stress</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">0.19</div>
            <span className="text-[10px] text-emerald-600">Optimal (&lt; 0.40)</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <Droplets className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Drought Index</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">0.08</div>
            <span className="text-[10px] text-emerald-600">Adequate Moisture</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Flood Risk</span>
            <div className="text-xl font-black text-amber-600 mt-0.5">0.18</div>
            <span className="text-[10px] text-amber-600">Moderate Drainage</span>
          </div>

        </div>

        {/* Charts: Rainfall vs Temperature & Risk Profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">14-Day Precipitation & Temperature Trend</h3>
              <p className="text-xs text-slate-500">Automated Weather Station (AWS) data for Gangetic Plain</p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weatherTrendData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="rain" name="Rainfall (mm)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tempMax" name="Max Temp (°C)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">Heat Stress & Flood Risk Index</h3>
              <p className="text-xs text-slate-500">Biophysical stress index normalized to [0.00, 1.00]</p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherTrendData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                  <YAxis domain={[0, 0.6]} stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Line type="monotone" dataKey="heatStress" name="Heat Stress Index" stroke="#F97316" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="floodRisk" name="Waterlogging Flood Risk" stroke="#0284C7" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
