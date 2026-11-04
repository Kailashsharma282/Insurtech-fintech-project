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
  Camera,
  FileText
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
import { useLanguage } from '@/context/LanguageContext';
import { FarmerVisualGuide } from '@/components/ui/FarmerVisualGuide';

export default function FarmerDashboard() {
  const { language, t } = useLanguage();
  const [selectedPlot, setSelectedPlot] = useState<string>('Plot #204');
  const [pumpActive, setPumpActive] = useState<boolean>(false);
  const [pumpLoading, setPumpLoading] = useState<boolean>(false);
  const [soilMoisture, setSoilMoisture] = useState<number>(58.0);

  // CHF Health Progression
  const healthTrendData = [
    { week: 'Week 1', cropHealth: 68, targetNormal: 76, ndvi: 0.52 },
    { week: 'Week 2', cropHealth: 70, targetNormal: 76, ndvi: 0.58 },
    { week: 'Week 3', cropHealth: 69, targetNormal: 76, ndvi: 0.62 },
    { week: 'Week 4', cropHealth: 73, targetNormal: 76, ndvi: 0.66 },
    { week: 'Week 5', cropHealth: 72, targetNormal: 76, ndvi: 0.67 },
    { week: 'Current', cropHealth: 71, targetNormal: 76, ndvi: 0.68 },
  ];

  // Weather forecast for Ghatal
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
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full">
        
        {/* Visual Guide (No gradients, clean slate/blue) */}
        <FarmerVisualGuide />

        {/* Top Greeting & Selected Farm Context */}
        <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  {t('farmer.greeting')}
                </h1>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" title="Connected to Ghatal IoT gateway"></span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Field Hub: <strong className="text-slate-800">Ghatal Central, Paschim Medinipur, West Bengal</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">{t('farmer.selected_farm')}</span>
                <strong className="text-xs sm:text-sm font-black">{t('farmer.plot_name')}</strong>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Season</span>
                <strong className="text-xs sm:text-sm font-black">Kharif 2025</strong>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Current Crop</span>
                <strong className="text-xs sm:text-sm font-black">Aman Paddy (2.8 ha)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access: PMFBY Insurance Validation & Photo Diagnostic Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                  PMFBY Ghatal Hub
                </span>
                <span className="text-xs text-slate-500 font-mono">Satellite CHF: 0.421</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Insurance Claim Validation & 10-Yr Historical Yields
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Validate your crop insurance indemnity payout amount using calculated satellite CHF against official village yield benchmarks (2017-18 to 2026-27) and ground CCE records.
              </p>
            </div>
            <div>
              <Link
                href="/farmer/insurance-validation"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Insurance Validation Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                  Camera Diagnostic AI
                </span>
                <span className="text-xs text-slate-500 font-mono">NPK & Water Check</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Instant Leaf Photo Diagnosis — NPK & Water Need
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload or snap a leaf photo. Instantly see whether water is required, check Nitrogen, Phosphorus, Potassium conditions, and receive exact fertilizer dosages.
              </p>
            </div>
            <div>
              <Link
                href="/farmer/disease"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Analyze Leaf Photo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* 5 KPI Cards (Solid, Clean Contrast) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
          
          {/* 1. Crop Health Factor */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold flex items-center gap-1">🟢 {t('farmer.crop_health')}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[10px] tracking-wider border border-blue-200">
                NORMAL
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">0.71</div>
              <p className="text-xs text-slate-500 mt-1">{t('farmer.crop_health_desc')}</p>
            </div>
          </div>

          {/* 2. Soil Moisture */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold flex items-center gap-1">💧 {t('farmer.soil_moisture')}</span>
              <span className="text-blue-600 font-bold text-[10px] flex items-center space-x-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>LIVE IOT</span>
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600 tracking-tight">{soilMoisture.toFixed(0)}%</div>
              <p className="text-xs text-slate-500 mt-1">{t('farmer.soil_moisture_desc')}</p>
            </div>
          </div>

          {/* 3. Weather Risk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold flex items-center gap-1">🌤️ {t('farmer.weather_risk')}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">Low</div>
              <p className="text-xs text-slate-500 mt-1">{t('farmer.weather_risk_desc')}</p>
            </div>
          </div>

          {/* 4. Disease Risk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold flex items-center gap-1">🛡️ {t('farmer.disease_risk')}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">Low</div>
              <p className="text-xs text-slate-500 mt-1">{t('farmer.disease_risk_desc')}</p>
            </div>
          </div>

          {/* 5. Recommended Action */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between space-y-2">
            <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold">
              ⚡ {t('farmer.next_action')}
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-snug">
                {t('farmer.next_action_desc')}
              </div>
              <Link 
                href="/farmer/disease" 
                className="inline-flex items-center text-[11px] text-blue-300 font-bold hover:underline pt-2"
              >
                <span>View recipe &rarr;</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Main Widgets: Crop Health Trend & IoT Solenoid Pump Actuator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          
          {/* Widget 1: Crop Health & Vigour Trend */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  Crop Health & Satellite Vigour Trend
                </h3>
                <p className="text-xs text-slate-500">Weekly remote sensing assessment vs localized baseline</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-600 font-medium">Health (CHF)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-slate-600 font-medium">Target Normal</span>
                </span>
              </div>
            </div>

            <div className="h-[260px] w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthTrendData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <defs>
                    <linearGradient id="blueHealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
                  <YAxis domain={[50, 90]} stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: '1px solid #1E293B' }} />
                  <Area type="monotone" dataKey="cropHealth" name="Crop Health" stroke="#2563EB" strokeWidth={2.5} fill="url(#blueHealthGrad)" />
                  <Line type="monotone" dataKey="targetNormal" name="Target Normal (0.76)" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong>Crop Status: Normal Vigour.</strong> Canopy density is uniform across all 2.8 hectares of Plot #204.
              </div>
              <Link href="/farmer/farms" className="font-bold text-blue-700 hover:underline shrink-0">
                Full Farm Metrics &rarr;
              </Link>
            </div>
          </div>

          {/* Widget 2: Direct IoT Solenoid Pump Actuator & Insurance Status */}
          <div className="space-y-6 w-full">
            
            {/* Pump Actuator Console (Slate Navy & Royal Blue) */}
            <div className="bg-[#0F172A] p-5 sm:p-6 rounded-2xl text-white border border-slate-800 shadow-md space-y-4 w-full">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-sm">Solar Pump Relay #1</span>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold transition-all ${
                  pumpActive 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {pumpActive ? t('farmer.pump_running') : t('farmer.pump_idle')}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                Direct wireless pump actuation via ESP32 solenoid switch connected to Ghatal Drip Sub-main.
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex justify-between items-center">
                <span className="text-slate-400">Current Root Moisture:</span>
                <span className="font-bold text-blue-300 font-mono text-sm">{soilMoisture.toFixed(0)}% VWC</span>
              </div>

              <button
                onClick={handleTogglePump}
                disabled={pumpLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-xs ${
                  pumpActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{pumpLoading ? 'Switching Relay...' : (pumpActive ? t('farmer.halt_pump') : t('farmer.actuate_pump'))}</span>
              </button>
            </div>

            {/* Insurance Policy Status Widget */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 w-full">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Active PMFBY Policy</span>
                </div>
                <span className="font-mono text-slate-500 text-[11px]">POL-WB-2026-3000</span>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Coverage Sum Insured:</span>
                  <strong className="text-slate-900 font-mono">₹1,45,000</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trigger Condition:</span>
                  <strong className="text-slate-900 font-mono">CHF &le; 0.550</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Claim Status:</span>
                  <span className="text-blue-700 font-bold">Eligible for Assessment</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/farmer/insurance-validation"
                  className="block text-center py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Validate Claim with CHF &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Lower Grid: Weather Forecast & Active Advisories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Widget 3: Weather Forecast */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span>Ghatal Weather Forecast</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">AWS Station #4</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {forecast.map((f) => (
                <div key={f.day} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-600">{f.day}</div>
                  <div className="text-xl my-0.5">{f.icon}</div>
                  <div className="font-bold text-slate-900 text-xs">{f.temp}</div>
                  <div className="text-[10px] text-blue-600 font-mono">{f.rain}</div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Monsoon showers expected Friday. Sufficient moisture expected; delay manual furrow flooding.
            </p>
          </div>

          {/* Widget 4: Active Advisories & Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-700" />
                <span>Active Advisories</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200">
                1 Pending
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                <div className="font-bold text-blue-950 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>Fertigation Window Open</span>
                </div>
                <p className="text-blue-900 text-[11px] leading-relaxed">
                  Optimal tillering phase. Apply balanced N-P-K dosage (42-14-22 kg/ha).
                </p>
                <div className="pt-1">
                  <Link href="/farmer/disease" className="font-bold text-blue-700 hover:underline text-[11px]">
                    Diagnose NPK via Photo AI &rarr;
                  </Link>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">Brown Spot Disease Surveillance</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Humid weather window. Use Disease AI scanner if leaf discoloration spots appear.
                </p>
                <div className="pt-1">
                  <Link href="/farmer/disease" className="font-bold text-blue-700 hover:underline text-[11px]">
                    Open AI Scanner &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 5: Recent Interventions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Recent Interventions</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Plot #204</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-blue-600 pl-3 space-y-0.5">
                <div className="font-bold text-slate-900">45-Min Micro-Drip Pulse</div>
                <div className="text-[11px] text-slate-500">Automated ESP32 Relay &bull; 14 Sep</div>
              </div>

              <div className="border-l-2 border-blue-400 pl-3 space-y-0.5">
                <div className="font-bold text-slate-900">Variable N-P-K Dispensation</div>
                <div className="text-[11px] text-slate-500">Agronomic Advisory &bull; 10 Sep</div>
              </div>

              <div className="border-l-2 border-slate-300 pl-3 space-y-0.5">
                <div className="font-semibold text-slate-600">Trichoderma Bio-Foliar Spray</div>
                <div className="text-[11px] text-slate-400">Scheduled &bull; 18 Sep 07:00 IST</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
