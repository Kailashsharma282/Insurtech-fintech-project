'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Droplets, 
  CloudSun, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Clock,
  Sparkles,
  RefreshCw,
  Gauge,
  Wifi,
  Waves
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Card3D } from '@/components/ui/Card3D';

export default function FarmerDashboard() {
  const [selectedPlot, setSelectedPlot] = useState<string>('Plot #204');
  const [pumpActive, setPumpActive] = useState<boolean>(false);
  const [pumpLoading, setPumpLoading] = useState<boolean>(false);
  const [soilMoisture, setSoilMoisture] = useState<number>(58.0);

  // CHF Health Progression (plain language on farmer screen)
  const healthTrendData = [
    { week: 'Week 1', cropHealth: 68, targetNormal: 76, ndvi: 0.52 },
    { week: 'Week 2', cropHealth: 70, targetNormal: 76, ndvi: 0.58 },
    { week: 'Week 3', cropHealth: 69, targetNormal: 76, ndvi: 0.62 },
    { week: 'Week 4', cropHealth: 73, targetNormal: 76, ndvi: 0.66 },
    { week: 'Week 5', cropHealth: 72, targetNormal: 76, ndvi: 0.67 },
    { week: 'Current', cropHealth: 71, targetNormal: 76, ndvi: 0.68 },
  ];

  // Weather forecast for Nadia
  const forecast = [
    { day: 'Today', temp: '32°C', icon: '⛅', rain: '4 mm', desc: 'Partly Cloudy' },
    { day: 'Thu', temp: '33°C', icon: '🌧️', rain: '12 mm', desc: 'Light Showers' },
    { day: 'Fri', temp: '31°C', icon: '⛈️', rain: '24 mm', desc: 'Moderate Rain' },
    { day: 'Sat', temp: '32°C', icon: '🌤️', rain: '0 mm', desc: 'Sunny / Humid' },
  ];

  const handleTogglePump = async () => {
    setPumpLoading(true);
    try {
      const res = await fetch('/api/iot/devices/iot-dev-1/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' })
      });
      const data = await res.json();
      if (data.success) {
        const nextState = !pumpActive;
        setPumpActive(nextState);
        setSoilMoisture(prev => nextState ? Math.min(80, prev + 4) : prev);
      }
    } catch {
      setPumpActive(!pumpActive);
    } finally {
      setPumpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Greeting & Selected Farm Context with 3D Depth */}
        <Card3D depth={4} glowOnHover={false} className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
                  Namaskar, Subhash Biswas
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] pulse-indicator" title="Connected to Nadia IoT gateway"></span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Field Hub: <strong className="text-slate-800">Santipur Central, Nadia District, West Bengal</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Selected Farm</span>
                <strong className="text-xs sm:text-sm font-black">Plot #204 (Baganchra)</strong>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Season</span>
                <strong className="text-xs sm:text-sm font-black">Kharif 2026</strong>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Current Crop</span>
                <strong className="text-xs sm:text-sm font-black">Aman Paddy (2.8 ha)</strong>
              </div>
            </div>
          </div>
        </Card3D>

        {/* 5 KPI Cards (Plain Language UX per Section 6 & 32) with 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. Crop Health Factor */}
          <Card3D depth={8} glowColor="rgba(16, 185, 129, 0.25)" className="bg-white border border-[#E2E8F0] shadow-sm">
            <div className="p-5 h-full flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Crop Health</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-wider">
                  OPTIMAL
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">0.71</div>
                <p className="text-xs text-slate-500 mt-1">Normal is 0.76 (93% of normal vigour)</p>
              </div>
            </div>
          </Card3D>

          {/* 2. Soil Moisture */}
          <Card3D depth={8} glowColor="rgba(59, 130, 246, 0.25)" className="bg-white border border-[#E2E8F0] shadow-sm">
            <div className="p-5 h-full flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Soil Moisture</span>
                <span className="text-blue-600 font-bold text-[10px] flex items-center space-x-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span>LIVE IOT</span>
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">{soilMoisture.toFixed(0)}%</div>
                <p className="text-xs text-slate-500 mt-1">Root zone volumetric content (Adequate)</p>
              </div>
            </div>
          </Card3D>

          {/* 3. Weather Risk */}
          <Card3D depth={8} glowColor="rgba(16, 185, 129, 0.25)" className="bg-white border border-[#E2E8F0] shadow-sm">
            <div className="p-5 h-full flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Weather Risk</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">Low</div>
                <p className="text-xs text-slate-500 mt-1">Steady monsoon; zero cyclonic depression</p>
              </div>
            </div>
          </Card3D>

          {/* 4. Disease Risk */}
          <Card3D depth={8} glowColor="rgba(16, 185, 129, 0.25)" className="bg-white border border-[#E2E8F0] shadow-sm">
            <div className="p-5 h-full flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Disease Risk</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">Low</div>
                <p className="text-xs text-slate-500 mt-1">Canopy clear. Zero blight signatures</p>
              </div>
            </div>
          </Card3D>

          {/* 5. Recommended Action */}
          <Card3D depth={8} glowColor="rgba(16, 185, 129, 0.4)" className="bg-gradient-to-br from-[#071511] via-[#0B2119] to-[#102820] text-white border border-[#10B981]/40 shadow-md">
            <div className="p-5 h-full flex flex-col justify-between space-y-2">
              <div className="text-[10px] font-mono text-[#34D399] uppercase tracking-wider font-bold">
                Prescribed Action
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                  Micro-drip pulse or foliar spray on Friday
                </div>
                <Link 
                  href="/farmer/optimization" 
                  className="inline-flex items-center text-[11px] text-[#34D399] font-bold hover:underline pt-2"
                >
                  <span>View exact recipe</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </Card3D>

        </div>

        {/* Main Widgets: Crop Health Trend & IoT Solenoid Pump Actuator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Widget 1: Crop Health & Vigour Trend */}
          <Card3D depth={6} glowColor="rgba(16, 185, 129, 0.15)" className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#0F172A] tracking-tight">
                    Crop Health & Satellite Vigour Trend
                  </h3>
                  <p className="text-xs text-slate-500">Weekly remote sensing assessment vs 4-year localized baseline</p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                    <span className="text-slate-600 font-medium">Health (CHF)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-slate-600 font-medium">Satellite NDVI</span>
                  </span>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthTrendData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                    <defs>
                      <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
                    <YAxis domain={[50, 90]} stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: '1px solid #10B981' }} />
                    <Area type="monotone" dataKey="cropHealth" name="Crop Health" stroke="#10B981" strokeWidth={3} fill="url(#healthGrad)" />
                    <Line type="monotone" dataKey="targetNormal" name="Target Normal (0.76)" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong>Crop Status: Optimal Vigour.</strong> Canopy density is uniform across all 2.8 hectares of Plot #204.
                </div>
                <Link href="/farmer/farms/farm-plot-204" className="font-bold text-emerald-700 hover:underline shrink-0">
                  Full Farm Metrics &rarr;
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Widget 2: Direct IoT Solenoid Pump Actuator & Insurance Status */}
          <div className="space-y-6">
            
            {/* 3D Pump Actuator Console */}
            <Card3D depth={10} glowColor={pumpActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'} className="bg-[#071511] p-6 rounded-3xl text-white border border-[#10B981]/40 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-[#34D399]" />
                    <span className="font-bold text-sm">Solar Pump Relay #1</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold transition-all ${
                    pumpActive 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {pumpActive ? 'PUMP ACTIVE' : 'IDLE / STANDBY'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  Direct wireless pump actuation via ESP32 solenoid switch connected to Baganchra Drip Sub-main.
                </div>

                <div className="p-3.5 rounded-2xl bg-[#102820] border border-emerald-900/50 text-xs flex justify-between items-center">
                  <span className="text-slate-400">Current Root Moisture:</span>
                  <span className="font-bold text-[#34D399] font-mono text-sm">{soilMoisture.toFixed(0)}% VWC</span>
                </div>

                <button
                  onClick={handleTogglePump}
                  disabled={pumpLoading}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all duration-300 flex items-center justify-center space-x-2 transform active:scale-95 shadow-lg ${
                    pumpActive 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/50' 
                      : 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white shadow-[#10B981]/30'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{pumpLoading ? 'Switching Relay...' : (pumpActive ? 'Halt Micro-Irrigation Pump' : 'Actuate 45-Min Drip Cycle')}</span>
                </button>
              </div>
            </Card3D>

            {/* Insurance Status Widget */}
            <Card3D depth={6} glowColor="rgba(16, 185, 129, 0.2)" className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    <span>Parametric Policy Active</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">POL-WB-2026-3000</span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coverage Value:</span>
                    <strong className="text-slate-900 font-mono">₹1,45,000</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trigger Condition:</span>
                    <strong className="text-slate-900 font-mono">CHF &le; 0.550</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Claim Status:</span>
                    <span className="text-[#059669] font-bold">Zero Loss Breaches</span>
                  </div>
                </div>

                <Link
                  href="/farmer/insurance"
                  className="block text-center py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors mt-2"
                >
                  Review Policy Terms & Coverage
                </Link>
              </div>
            </Card3D>

          </div>

        </div>

        {/* Lower Grid: Weather Forecast, Active Advisories, Recent Interventions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Widget 3: Weather Forecast */}
          <Card3D depth={6} glowColor="rgba(245, 158, 11, 0.2)" className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <span>Nadia Weather Forecast</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">AWS Station #4</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {forecast.map((f) => (
                  <div key={f.day} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-600">{f.day}</div>
                    <div className="text-xl my-0.5">{f.icon}</div>
                    <div className="font-bold text-slate-900 text-xs">{f.temp}</div>
                    <div className="text-[10px] text-blue-600 font-semibold">{f.rain}</div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Monsoon showers expected Friday. Sufficient moisture expected; delay manual furrow flooding.
              </p>
            </div>
          </Card3D>

          {/* Widget 4: Active Advisories & Alerts */}
          <Card3D depth={6} glowColor="rgba(16, 185, 129, 0.2)" className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-[#059669]" />
                  <span>Active Advisories & Alerts</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  1 Pending
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fertigation Window Open</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Optimal tillering phase. Apply GA-PSO calculated N-P-K dosage (42-14-22 kg/ha).
                  </p>
                  <div className="pt-1">
                    <Link href="/farmer/optimization" className="font-bold text-emerald-700 hover:underline text-[11px]">
                      Calculate exact cost &rarr;
                    </Link>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-800">Brown Spot Disease Surveillance</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Humid weather window. Use Disease AI scanner if leaf discoloration spots appear.
                  </p>
                  <div className="pt-1">
                    <Link href="/farmer/disease" className="font-bold text-[#059669] hover:underline text-[11px]">
                      Open AI Scanner &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>

          {/* Widget 5: Recent Interventions */}
          <Card3D depth={6} glowColor="rgba(16, 185, 129, 0.2)" className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>Recent Plot Interventions</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Plot #204</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="border-l-2 border-[#10B981] pl-3 space-y-0.5">
                  <div className="font-bold text-slate-900">45-Min Micro-Drip Pulse</div>
                  <div className="text-[11px] text-slate-500">Automated ESP32 Relay &bull; 14 Sep</div>
                </div>

                <div className="border-l-2 border-emerald-400 pl-3 space-y-0.5">
                  <div className="font-bold text-slate-900">Variable N-P-K Dispensation</div>
                  <div className="text-[11px] text-slate-500">GA-PSO Prescription &bull; 10 Sep</div>
                </div>

                <div className="border-l-2 border-slate-300 pl-3 space-y-0.5">
                  <div className="font-semibold text-slate-600">Trichoderma Bio-Foliar Spray</div>
                  <div className="text-[11px] text-slate-400">Scheduled &bull; 18 Sep 07:00 IST</div>
                </div>
              </div>
            </div>
          </Card3D>

        </div>

      </div>
    </div>
  );
}
