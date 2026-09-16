'use client';

import React, { useState } from 'react';
import { 
  Satellite, 
  Activity, 
  Cpu, 
  Droplets, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Database,
  Radio,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

interface Stage {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  icon: any;
  summary: string;
  dataSources: string[];
  techStack: string;
  agronomicPrinciple: string;
  sampleOutput: string;
}

export default function HowItWorksPage() {
  const [activeStage, setActiveStage] = useState<string>('01');

  const stages: Stage[] = [
    {
      id: '01',
      number: '01',
      name: 'OBSERVE',
      subtitle: 'Satellite Remote Sensing + Field IoT Probes',
      icon: Satellite,
      summary: 'Continuous multi-modal observations fusing Sentinel-2 Multi-Spectral Instrument (10m optical) with Sentinel-1 C-band Synthetic Aperture Radar (SAR) and real-time 3-second ESP32 soil probes.',
      dataSources: ['Sentinel-2A/B (Bands 2,3,4,8,11,12)', 'Sentinel-1B (VH/VV SAR)', 'ESP32 RS-485 Soil Moisture Probes', 'DHT22 Microclimate Stations'],
      techStack: 'Copernicus Open Access Hub, Leaflet GIS, PostGIS Spatial Indexing',
      agronomicPrinciple: 'Radar backscatter (Sentinel-1 VH) penetrates cloud cover and measures structural plant water content before cellular chlorophyll breakdown manifests in visible bands.',
      sampleOutput: 'Plot #204: NDVI=0.68, LSWI=0.38, VH Backscatter=-16.4 dB, Root Moisture=58% VWC'
    },
    {
      id: '02',
      number: '02',
      name: 'DIAGNOSE',
      subtitle: 'Multi-Stress Detection & Computer Vision',
      icon: Activity,
      summary: 'Separates moisture stress, nutrient deficiencies, and biotic disease threats using normalized spectral indices, localized baselines, and a 38-class MobileNetV3 deep learning classifier.',
      dataSources: ['UV-NDVI Ratio', 'Land Surface Water Index (LSWI)', 'Crop Canopy Temperature Anomaly', 'Smartphone Leaf Imagery'],
      techStack: 'PyTorch MobileNetV3 (92.9% accuracy benchmark), Shannon Entropy Dynamic Weighting',
      agronomicPrinciple: 'Root moisture deficit (< 40% VWC) paired with stable radar backscatter flags early transpiration stress before irreversible wilting occurs.',
      sampleOutput: 'Diagnosis: Early moisture deficit flagged in root zone. Leaf blight risk: LOW (healthy canopy).'
    },
    {
      id: '03',
      number: '03',
      name: 'PRESCRIBE',
      subtitle: 'GA-PSO Hybrid Nutrient & Irrigation Optimization',
      icon: Cpu,
      summary: 'A bio-inspired hybrid optimization engine combining Genetic Algorithm (GA) exploration with Particle Swarm Optimization (PSO) local convergence to formulate optimal N-P-K doses and water volumes.',
      dataSources: ['Soil Test Benchmarks (N, P, K, pH)', 'Crop Phenology & Age (Days After Sowing)', '7-Day IMD Rainfall Forecast'],
      techStack: 'Custom GA-PSO Engine (150 generations, 40 swarm particles)',
      agronomicPrinciple: 'Over-fertilization during moisture stress increases osmotic soil stress. GA-PSO calculates exact micro-dosing to maximize nitrogen uptake efficiency.',
      sampleOutput: 'Recommendation: 42 kg/ha Urea (N), 14 kg/ha DAP (P), 22 kg/ha MOP (K), 28,000 L/ha daily drip irrigation.'
    },
    {
      id: '04',
      number: '04',
      name: 'ACTUATE',
      subtitle: 'Automated Hardware Relays & Farmer Advisories',
      icon: Droplets,
      summary: 'Executes prescriptions either automatically via ESP32 pump relays and solenoid valves or delivers localized actionable vernacular advisories to farmers via smartphone push notifications.',
      dataSources: ['Micro-irrigation Flow Meters', 'Pump Relay Heartbeats', 'Farmer Verification Acknowledgements'],
      techStack: 'ESP32 MQTT/WebSocket Relay Controllers, Twilio/GSM Alert Gateway',
      agronomicPrinciple: 'Pulsed drip irrigation delivers water directly to the active root zone without runoff or surface evaporation losses, conserving up to 45% water.',
      sampleOutput: 'Pump Relay ESP32-RLY-01 actuated for 45 minutes. Soil moisture restored from 42% to 58%.'
    },
    {
      id: '05',
      number: '05',
      name: 'VERIFY',
      subtitle: 'Post-Intervention Satellite Recovery Monitoring',
      icon: CheckCircle2,
      summary: 'Subsequent satellite orbital passes measure whether the crop canopy returned to its historical trajectory, distinguishing between manageable stress and catastrophic regional failure.',
      dataSources: ['T+6 Days Sentinel-2 Pass', 'T+12 Days Radar Backscatter Differential', 'Localized 4-Year Baseline Matrix'],
      techStack: 'Temporal NDVI Slope Analysis, CHF Anomaly Vector Calculus',
      agronomicPrinciple: 'If vegetation indices recover within 10 days of actuation, crop yield loss is mitigated and insurance indemnity remains reserved.',
      sampleOutput: 'Post-actuation verification: CHF improved from 0.65 to 0.71. Recovery curve confirmed.'
    },
    {
      id: '06',
      number: '06',
      name: 'INSURE',
      subtitle: 'Objective Parametric Underwriting & Instant Settlement',
      icon: ShieldCheck,
      summary: 'When uncontrollable natural disasters (e.g. unseasonal depression floods or prolonged heatwaves) breach predefined CHF thresholds (<= 0.55), claims are triggered and settled automatically without physical loss adjusters.',
      dataSources: ['Composite CHF Breaches', 'Historical District Baselines', 'Field Agent Geotagged Ground Truth', 'RBI NEFT Settlement Gateway'],
      techStack: 'Prisma Relational Ledger, SHA-256 Cryptographic Audit Chain, Simulated Banking APIs',
      agronomicPrinciple: 'Eliminates moral hazard and administrative delays. Farmers receive liquidity within days when catastrophic shock exceeds on-farm mitigation capacity.',
      sampleOutput: 'Claim #CLM-2026-084: CHF 0.49 <= 0.55 Trigger. Loss Evaluated: 33.8%. Payout: ₹42,800 initiated.'
    },
  ];

  const currentStageData = stages.find(s => s.number === activeStage) || stages[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
            <span>Six-Stage Closed Loop Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            How AgriSure Intelligence Works
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Click on any stage below to explore its data sources, agronomic principles, and technical pipeline.
          </p>
        </div>

        {/* Stages Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {stages.map((st) => {
            const Icon = st.icon;
            const isSelected = st.number === activeStage;
            return (
              <button
                key={st.number}
                onClick={() => setActiveStage(st.number)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'bg-[#071511] text-white border-[#10B981] shadow-xl shadow-emerald-950/20 scale-[1.02]' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {st.number}
                  </span>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-[#34D399]' : 'text-slate-400'}`} />
                </div>
                <div className="font-extrabold text-sm">{st.name}</div>
                <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {st.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Information Panel for Active Stage */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono font-bold px-3 py-1 rounded-lg bg-[#071511] text-[#34D399]">
                  STAGE {currentStageData.number}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {currentStageData.name}: {currentStageData.subtitle}
                </h2>
              </div>
              <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
                {currentStageData.summary}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 shrink-0">
              <Link
                href="/farmer/dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#059669] text-xs font-semibold border border-emerald-200 transition-colors"
              >
                View Live Demo Farm &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Agronomic Principle */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Activity className="w-4 h-4 text-[#059669]" />
                <span>Agronomic & Biophysical Foundation</span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {currentStageData.agronomicPrinciple}
              </p>
            </div>

            {/* Technical Pipeline */}
            <div className="p-6 rounded-2xl bg-[#071511] text-white border border-[#10B981]/30 space-y-3">
              <div className="flex items-center space-x-2 text-[#34D399] font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Technical Stack & Algorithms</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {currentStageData.techStack}
              </p>
              <div className="pt-2 border-t border-emerald-900/60 font-mono text-xs text-emerald-300">
                Data Feeds: {currentStageData.dataSources.join(' • ')}
              </div>
            </div>

          </div>

          {/* Sample Telemetry / Pipeline Output */}
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>LIVE OUTPUT EMISSION LOG</span>
              <span className="text-emerald-400">STATUS: VERIFIED</span>
            </div>
            <div className="text-emerald-300 text-sm font-semibold">
              &gt; {currentStageData.sampleOutput}
            </div>
          </div>

          {/* Progression Actions */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 gap-4">
            <div className="text-xs text-slate-500 font-mono">
              OBSERVE → DIAGNOSE → PRESCRIBE → ACTUATE → VERIFY → INSURE
            </div>
            <div className="flex items-center space-x-3">
              <button
                disabled={activeStage === '01'}
                onClick={() => {
                  const prev = (parseInt(activeStage) - 1).toString().padStart(2, '0');
                  setActiveStage(prev);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                &larr; Previous Stage
              </button>
              <button
                disabled={activeStage === '06'}
                onClick={() => {
                  const next = (parseInt(activeStage) + 1).toString().padStart(2, '0');
                  setActiveStage(next);
                }}
                className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold disabled:opacity-40"
              >
                Next Stage &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
